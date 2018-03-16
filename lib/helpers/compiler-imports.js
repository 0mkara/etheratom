'use babel'
import axios from 'axios'
import path from 'path'
import url from 'url'
import validUrl from 'valid-url'
import fs from 'fs'

async function handleGithubCall(fullpath, rootPath, path, filename, fileRoot) {
    console.log('%c Handling github import...', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
    return await axios({
        method: 'get',
        url: 'https://api.github.com/repos/' + rootPath + '/contents/' + path,
        responseType: 'json'
    }).then(function(response) {
        if('content' in response.data) {
            const buf = Buffer.from(response.data.content, 'base64');
            fileRoot = fullpath.substring(0, fullpath.lastIndexOf("/"));
            fileRoot = fileRoot + '/';
            const resp = { filename, content: buf.toString('UTF-8'), fileRoot };
            return resp;
        } else {
            throw 'Content not received!';
        }
    })
}
async function handleLocalImport(pathString, filename, fileRoot) {
    console.log('%c Handling local import...', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
    /*console.log(pathString);
    console.log(filename);
    console.log(fileRoot);*/
    const o = { encoding: 'UTF-8' };
    const content = fs.readFileSync(path.resolve(fileRoot, pathString, filename), o);
    fileRoot = path.resolve(fileRoot, pathString);
    const response = { filename, content, fileRoot };
    return response;
}
async function getHandlers() {
    return [
        { type: 'local', match: /(^(?!(?:http:\/\/)|(?:https:\/\/)?(?:www.)?(?:github.com)))(^\/*[\w+-_/]*\/)*?(\w+.sol)/g, handle: async (match, fileRoot) => { return await handleLocalImport(match[2], match[3], fileRoot) } },
        { type: 'github', match: /^(https?:\/\/)?(www.)?github.com\/([^/]*\/[^/]*)\/(.*\/(\w+.sol))/g, handle: async (match, fileRoot) => { return await handleGithubCall(match[0], match[3], match[4], match[5], fileRoot) } }
    ];
}
async function resolveImports(fileRoot, sourcePath) {
    console.log('%c Resolving imports', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
    const handlers = await getHandlers();
    let response = {};
    for(const handler of handlers) {
        try {
            // here we are trying to find type of import path github/swarm/ipfs/local
            const match = handler.match.exec(sourcePath);
            if(match) {
                response = await handler.handle(match, fileRoot);
                break;
            }
        } catch(e) {
            throw e;
        }
    }
    return response;
}
export async function combineSource(fileRoot, sources) {
    console.log("%c Combining source...", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
    //console.log(sources);
    let fn, iline, ir;
    var matches = [];
    ir = /^import*\ [\'\"](.+)[\'\"]\;/gm;
    let match = null;
    for (const fileName of Object.keys(sources)) {
        const source = sources[fileName].content;
        while(match = ir.exec(source)) {
            matches.push(match);
        }
        console.log("%c Matches found...", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
        for(let match of matches) {
            iline = match[0];
            if(validUrl.isUri(fileRoot)) {
                fn = url.resolve(fileRoot, match[1]);
            } else {
                fn = match[1];
            }
            try {
                let subSorce = {};
                const response = await resolveImports(fileRoot, fn);
                sources[fileName].content = sources[fileName].content.replace(iline, 'import \'' + response.filename + '\';');
                //const content = response.content.replace(iline, response.sourceName);
                /*console.log("%c Import Line:", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
                console.log(iline);
                console.log("%c Source:", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
                console.log(sources);*/
                subSorce[response.filename] = { content: response.content };
                /*console.log("%c Subsource:", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
                console.log(subSorce);*/
                // Add new source to sources object
                //console.log("%c Appending new sources...", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
                sources = Object.assign(await combineSource(response.fileRoot, subSorce), sources);
            } catch (e) {
                throw e;
            }
        }
    }
    return sources;
}
