const Solc = require('solc');
process.on('message', async(m) => {
    if (m.command === 'compile') {
        try {
            const input = m.payload;
            const output = Solc.compileStandardWrapper(JSON.stringify(input));
            process.send({ compiled: output });
            process.exit(0);
        } catch (e) {
            throw e;
        }
    }
});
module.exports = {};
