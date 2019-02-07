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
            const installedSlocVersion = 'v'+Solc.version();
            const requiredSolcVersion = m.version;

            if(installedSlocVersion.includes(requiredSolcVersion)) {
                const output = await Solc.compileStandardWrapper(JSON.stringify(input));
                process.send({ compiled: output });
            } else if (m.snapshot){
                const snapshot = m.snapshot;
                const output = await snapshot.compile(JSON.stringify(input));
                process.send({ compiled: output });
            } else {
                
                /**
                 * TODO Store cached versions in redux
                 * For one cached version store vesrion and snapshot
                 * 
                 * 1. send loaded version and snapshot to methods
                 * 2. save it in store
                 * 3. check if already cached
                 * 4. pass snapshot if cached
                 * 5. compile with the passed snapshot
                 */

                Solc.loadRemoteVersion(requiredSolcVersion, async(err, solcSnapshot) => {
                    if (err) {
                        process.send({ error: err });
                    } else {
                        const snapshot = JSON.stringify(solcSnapshot, function (key, value) {
                            if (typeof value === 'function') {
                                var fnBody;
                      
                                fnBody = value.toString();
                      
                                return fnBody;
                            } else {
                                return value
                            }
                        });
                        const output = await solcSnapshot.compile(JSON.stringify(input));
                        process.send({ compiled: output, solc: { version: requiredSolcVersion, snapshot: snapshot } });
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
