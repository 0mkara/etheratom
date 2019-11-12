const shell = require("shelljs");
const fs = require("fs");

function vyperCompiler(source) {
    var input_json = {
        "language": "Vyper",
        "sources": source,
        "settings": {
            "evmVersion": "byzantium"
        },
        "outputSelection": {
            "*": ["evm.bytecode", "abi", "ast"],
        }
    };
    fs.writeFileSync(__dirname + "/" + ".temp-vy.json", JSON.stringify(input_json, null, 4), 'UTF-8');
    var args = "vyper-json " + __dirname + "/" + ".temp-vy.json";
    var escaped = shell.exec(args);
    var m = {
        "processMessage": "",
        "compiled": escaped
    }
    fs.unlink(__dirname + "/" + ".temp-vy.json", ()=>{});
    process.send(m);
}
process.on('message', (m) => {
    if (m.command == "compile") {
        vyperCompiler(m.source);
    }
})