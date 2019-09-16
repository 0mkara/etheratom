'use babel'
// Copyright 2018 Etheratom Authors
// This file is part of Etheratom.

// Etheratom is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Etheratom is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Etheratom.  If not, see <http://www.gnu.org/licenses/>.

/*eslint no-useless-escape: "warn"*/
/*eslint node/no-deprecated-api: "warn" */
import axios from 'axios';
import path from 'path';
import url from 'url';
import validUrl from 'valid-url';
import fs from 'fs';

async function handleGithubCall(fullpath, repoPath, path, filename, fileRoot) {
    return await axios({
        method: 'get',
        url: 'https://api.github.com/repos/' + repoPath + '/contents/' + path,
        responseType: 'json'
    }).then(function(response) {
        if ('content' in response.data) {
            const buf = Buffer.from(response.data.content, 'base64');
            fileRoot = fullpath.substring(0, fullpath.lastIndexOf('/'));
            fileRoot = fileRoot + '/';
            const resp = { filename, content: buf.toString('UTF-8'), fileRoot };
            return resp;
        } else {
            throw 'Content not received!';
        }
    });
}
async function handleNodeModulesImport(pathString, filename, fileRoot) {
    const o = { encoding: 'UTF-8' };
    var modulesDir = fileRoot;

    while (true) {
        var p = path.join(modulesDir, 'node_modules', pathString, filename);
        try {
            const content = fs.readFileSync(p, o);
            fileRoot = path.join(modulesDir, 'node_modules', pathString);
            const response = { filename, content, fileRoot };
            return response;
        }
        catch (err) {
            console.log(err);
        }

        // Recurse outwards until impossible
        var oldModulesDir = modulesDir;
        modulesDir = path.join(modulesDir, '..');
        if (modulesDir === oldModulesDir) {
            break;
        }
    }

}
async function handleLocalImport(pathString, filename, fileRoot) {
    // if no relative/absolute path given then search in node_modules folder
    if (pathString && pathString.indexOf('.') !== 0 && pathString.indexOf('/') !== 0) {
        return handleNodeModulesImport(pathString, filename, fileRoot);
    }
    else {
        const o = { encoding: 'UTF-8' };
        const p = pathString ? path.resolve(fileRoot, pathString, filename) : path.resolve(fileRoot, filename);
        const content = fs.readFileSync(p, o);
        fileRoot = pathString ? path.resolve(fileRoot, pathString) : fileRoot;
        const response = { filename, content, fileRoot };
        return response;
    }
}
async function getHandlers() {
    return [
        {
            type: 'local',
            match: /(^(?!(?:http:\/\/)|(?:https:\/\/)?(?:www.)?(?:github.com)))(^\/*[\w+-_/]*\/)*?(\w+\.sol)/g,
            handle: async(match, fileRoot) => { return await handleLocalImport(match[2], match[3], fileRoot); }
        },
        {
            type: 'github',
            match: /^(https?:\/\/)?(www.)?github.com\/([^/]*\/[^/]*)(.*\/(\w+\.sol))/g,
            handle: async(match, fileRoot) => {
                return await handleGithubCall(match[0], match[3], match[4], match[5], fileRoot);
            }
        }
    ];
}
async function resolveImports(fileRoot, sourcePath) {
    const handlers = await getHandlers();
    let response = {};
    for (const handler of handlers) {
        try {
            // here we are trying to find type of import path github/swarm/ipfs/local
            const match = handler.match.exec(sourcePath);
            if (match) {
                response = await handler.handle(match, fileRoot);
                break;
            }
        } catch (e) {
            throw e;
        }
    }
    return response;
}
export async function combineSource(fileRoot, sources) {
    let fn, importLine, ir;
    var matches = [];
    ir = /^(?:import){1}(.+){0,1}\s['"](.+)['"];/gm;
    let match = null;
    for (const fileName of Object.keys(sources)) {
        const source = sources[fileName].content;
        while ((match = ir.exec(source))) {
            matches.push(match);
        }
        for (let match of matches) {
            importLine = match[0];
            const extra = match[1] ? match[1] : '';
            if (validUrl.isUri(fileRoot)) {
                fn = url.URL.resolve(fileRoot, match[2]);
            } else {
                fn = match[2];
            }
            try {
                // resolve anything other than remix_tests.sol & tests.sol
                if (fn.localeCompare('remix_tests.sol') != 0 && fn.localeCompare('tests.sol') != 0) {
                    let subSorce = {};
                    const response = await resolveImports(fileRoot, fn);
                    sources[fileName].content = sources[fileName].content.replace(importLine, 'import' + extra + ' \'' + response.filename + '\';');
                    subSorce[response.filename] = { content: response.content };
                    sources = Object.assign(await combineSource(response.fileRoot, subSorce), sources);
                }
            } catch (e) {
                throw e;
            }
        }
    }
    return sources;
}
