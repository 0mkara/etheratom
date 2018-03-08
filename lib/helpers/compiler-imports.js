'use babel'
import axios from 'axios'
import path from 'path';

async function handleGithubCall(rootPath, path) {
    console.log('Handling github import');
    console.log(rootPath);
    console.log(path);
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
    console.log("Resolving imports");
    const handlers = await getHandlers();
    for(const handler of handlers) {
        try {
            // here we are trying to find type of import path github/swarm/ipfs/local
            const match = handler.match.exec(sourcePath);
            console.log(match);
            const content = await handler.handle(match);
            return { type: handler.type, content }
        } catch(e) {
            throw e;
        }
    }
}
function mapSourceDir(dir, file) {
    console.log("Mapping source dir");
    console.log(dir);
    console.log(file);
	return path.isAbsolute(file)
	? dir
	: path.dirname(
        path.normalize(dir + '/' + file)
    );
}
export async function combineSource(dir, source) {
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
            console.log(dir);
            console.log(match);
            iline = match[0];
            fn = match[1];
            const response = await resolveImports(fn);
            dir = response.type
            subSource = response.content
            console.log(subSource);
            match.source = await combineSource(mapSourceDir(dir, fn), subSource);
            console.log(match.source);
            // replace source import line with actual content
            source = source.replace(iline, match.source);
        }
        return source;
    }))
}
