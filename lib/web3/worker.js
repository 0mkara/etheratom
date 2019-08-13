const RemixTests = require('remix-tests');
const Solc = require('solc');

function _testCallback(result) {
    try {
        process.send({ _testCallback: '_testCallback', result });
    } catch (e) {
        process.send({ error: e });
    }
}
function _resultsCallback(e, result) {
    if(e) {
        process.send({ error: e });
    }
    process.send({ _resultsCallback: '_resultsCallback', result });
}
function _finalCallback(e, result) {
    if(e) {
        process.send({ error: e });
    }
    process.send({ _finalCallback: '_finalCallback', result });
    process.exit(0);
}
function _importFileCb(e, result) {
    if(e) {
        process.send({ error: e });
    }
}

process.on('message', async(m) => {
    if (m.command === 'compile') {
        try {
            const input = m.payload;
            const installedSlocVersion = 'v' + Solc.version();
            const requiredSolcVersion = m.version;

            if(installedSlocVersion.includes(requiredSolcVersion)) {
                const output = await Solc.compileStandardWrapper(JSON.stringify(input));
                process.send({ compiled: output });
            } else {
                Solc.loadRemoteVersion(requiredSolcVersion, async(err, solcSnapshot) => {
                    if (err) {
                        process.send({ error: err });
                    } else {
                        const output = await solcSnapshot.compile(JSON.stringify(input));
                        process.send({ compiled: output });
                    }
                });
            }
        } catch (e) {
            throw e;
        }
    }
    if (m.command === 'runTests') {
        try {
            const sources = m.payload;
            RemixTests.runTestSources(sources, _testCallback, _resultsCallback, _finalCallback, _importFileCb);
        } catch (e) {
            throw e;
        }
    }
});
module.exports = {};
