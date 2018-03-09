'use babel'
import axios from 'axios'
import path from 'path'
import url from 'url'

async function handleGithubCall(rootPath, path) {
    console.log('%c Handling github import', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
    return await axios({
        method: 'get',
        url: 'https://api.github.com/repos/' + rootPath + '/contents/' + path,
        responseType: 'json'
    }).then(function(response) {
        if('content' in response.data) {
            var buf = Buffer.from(response.data.content, 'base64');
            return buf.toString('UTF-8');
        } else {
            throw 'Content not received!';
        }
    })
}
async function handleSwarmImport() {
    console.log('Handling swarm import');
}
export async function handleIPFS() {
    console.log('Handling ipfs import');
    return ['Handling ipfs import'];
}
async function getHandlers() {
    return [
        { type: 'github', match: /^(https?:\/\/)?(www.)?github.com\/([^/]*\/[^/]*)\/(.*)/, handle: async (match) => {
                if(match) {
                    return await handleGithubCall(match[3], match[4]);
                }
            }
        },
        { type: 'swarm', match: /^(bzz[ri]?:\/\/?(.*))$/, handle: (match) => { handleSwarmImport(match[1], match[2]) } },
        { type: 'ipfs', match: /^(ipfs:\/\/?.+)/, handle: (match) => { handleIPFS(match[1]) } }
    ];
}
export async function resolveImports(sourcePath) {
    console.log('%c Resolving imports', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
    const handlers = await getHandlers();
    let fileRoot = null;
    for(const handler of handlers) {
        try {
            // here we are trying to find type of import path github/swarm/ipfs/local
            const match = handler.match.exec(sourcePath);
            if(match) {
                fileRoot = match[0].substring(0, match[0].lastIndexOf("/"));
                fileRoot = fileRoot + '/'
            }
            const content = await handler.handle(match);
            return { fileRoot , content }
        } catch(e) {
            throw e;
        }
    }
}
function mapSourceDir(dir, file) {
	return path.isAbsolute(file)
	? dir
	: path.dirname(
        path.normalize(dir + '/' + file)
    );
}
export async function combineSource(fileRoot, source) {
    console.log("%c Combining source...", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
    let fn, iline, ir, match, o, subSource;
    var matches = [];
    o = {
        encoding: 'UTF-8'
    };
    ir = /import\ [\'\"](.+)[\'\"]\;/g;
    match = null;
    while(match = ir.exec(source)) {
        matches.push(match);
    }
    await Promise.all(matches.map(async function(match) {
        if((match = ir.exec(source))) {
            console.log("%c Matches found...", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
            console.log(match);
            iline = match[0];
            fn = url.resolve(fileRoot, match[1]);
            console.log(fn);
            const response = await resolveImports(fn);
            subSource = response.content;
            match.source = await combineSource(response.fileRoot, subSource);
            // replace source import line with actual content
            if(match.source) {
                console.log("%c Replacing source...", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
                console.log(iline);
                source = source.replace(iline, match.source);
            }
        }
    }));
    console.log("%c Combined source...", 'background: rgba(36, 194, 203, 0.3); color: #EF525B', new Date(Date.now()).toString());
    console.log(source);
    return source;
}
