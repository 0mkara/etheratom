'use babel'
import axios from 'axios'
import path from 'path'
import url from 'url'
import validUrl from 'valid-url'
import fs from 'fs'

async function handleGithubCall(fullpath, rootPath, path, fileRoot) {
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
            const resp = { content: buf.toString('UTF-8'), fileRoot };
            return resp;
        } else {
            throw 'Content not received!';
        }
    })
}
async function handleLocalImport(pathString, filename, fileRoot) {
    console.log('%c Handling local import...', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
    const o = { encoding: 'UTF-8' };
    const content = fs.readFileSync(path.resolve(fileRoot, pathString, filename), o);
    fileRoot = path.resolve(fileRoot, pathString);
    const response = { content, fileRoot };
    return response;
}
async function getHandlers() {
    return [
        { type: 'local', match: /^(?!https?:\/\/)?(?!www.)?(?!github.com)?(\.\.|\.)*?(\/*[\w+-_/]*\/)*?(\w+.sol)/g, handle: async (match, fileRoot) => { return await handleLocalImport(match[2], match[3], fileRoot) } },
        { type: 'github', match: /^(https?:\/\/)?(www.)?github.com\/([^/]*\/[^/]*)\/(.*)/g, handle: async (match, fileRoot) => { return await handleGithubCall(match[0], match[3], match[4], fileRoot) } }
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
export async function combineSource(fileRoot, source) {
    console.log("%c Combining source...", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
    let fn, iline, ir, subSource;
    var matches = [];
    ir = /^import*\ [\'\"](.+)[\'\"]\;/gm;
    let match = null;
    while(match = ir.exec(source)) {
        matches.push(match);
    }
    for(let match of matches) {
        console.log("%c Matches found...", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
        iline = match[0];
        if(validUrl.isUri(fileRoot)) {
            fn = url.resolve(fileRoot, match[1]);
        } else {
            fn = match[1];
        }
        const response = await resolveImports(fileRoot, fn);
        subSource = response.content;
        match.source = await combineSource(response.fileRoot, subSource);
        // replace source import line with actual content
        if(match.source) {
            console.log("%c Replacing source...", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
            source = source.replace(iline, match.source);
        }
    }
    return source;
}
