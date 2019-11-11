// @ts-ignore
import * as shell from "shelljs";
import * as fs from "fs";

function vyperCompiler(sources) {
    var input_json = {
        "language": "Vyper",
        "sources": sources,
        "settings": {
            "evmVersion": "byzantium"
        },
        "outputSelection": {
            "*": ["evm.bytecode", "abi", "ast"],
        }
    };
    // @ts-ignore
    process.send(input_json);
    fs.writeFileSync(__dirname + "/" + ".temp-vy.json", JSON.stringify(input_json, null, 4), 'UTF-8');
    var args = "vyper-json " + __dirname + "/" + ".temp-vy.json";
    var escaped = shell.exec(args);
    var m = {
        "processMessage": "",
        "compiled": escaped
    }
    fs.unlink(__dirname + "/" + ".temp-vy.json", ()=>{});
    // @ts-ignore
    process.send(m);
}

// @ts-ignore
process.on('message', (m) => {
    if (m.command == "compile") {
        vyperCompiler(m.source);
    }
})