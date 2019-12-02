const shell = require('shelljs');
const fs = require('fs');

function vyperCompiler(source) {
    const outputSelection = {
        // Enable the metadata and bytecode outputs of every single contract.
        '*': {
            '': ['ast'],
            '*': ['abi', 'evm.bytecode']
        }
    };
    var input_json = {
        'language': 'Vyper',
        'sources': source,
        'settings': {
            'evmVersion': 'byzantium'
        },
        'outputSelection': outputSelection
    };
    fs.writeFileSync(__dirname + '/' + '.temp-vy.json', JSON.stringify(input_json, null, 4), 'UTF-8');
    var args = 'vyper-json ' + __dirname + '/' + '.temp-vy.json';
    var escaped = shell.exec(args);
    var m = { compiled: escaped };
    fs.unlink(__dirname + '/' + '.temp-vy.json', ()=>{});
    process.send(m);
}
process.on('message', (m) => {
    if (m.command == 'compile') {
        vyperCompiler(m.source);
    }
});
