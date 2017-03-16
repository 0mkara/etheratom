'use babel'
// vm.js should handle all javascript virtaul machine events
// Every solidity file can be compiled in two ways jsvm and ethereum endpoint
// After every command is invoked compilation endpoint should be chosen
// If JsVM is compilation endpoint VM will be used to compile and execute solidity program
import { CompositeDisposable } from 'atom'
import path from 'path'
import fs from 'fs'
import Solc from 'solc'

let EthJSVM, ErrorView;
EthJSVM = require('ethereumjs-vm');
View = require('./vm-view');

class VM {
	constructor() {
		this.saveSubscriptions = new CompositeDisposable();
		this.subscriptions = new CompositeDisposable();
		this.vmSubscriptions = new CompositeDisposable();
		this.vm = new EthJSVM({
			activatePrecompiles: true,
			enableHomestead: true
		});
		this.view = new View();
		this.observeConfig();
		//this.subscriptions.add(atom.commands.add('atom-workspace', 'eth-interface:compile', () => this.commandInvoked()))
	}

	commandInvoked() {
		this.execute()
	}
	dispose() {
		if(this.subscriptions) {
			this.subscriptions.dispose()
		}
		this.subscriptions = null

		if(this.saveSubscriptions) {
			this.saveSubscriptions.dispose()
		}
		this.saveSubscriptions = null

		if(this.vmSubscriptions) {
			this.vmSubscriptions.dispose()
		}
		this.vmSubscriptions = null
	}

	observeConfig() {
		this.subscriptions.add(atom.config.observe('etheratom.executionEnv', (executionEnv) => {
			if(this.vmSubscriptions) {
				this.vmSubscriptions.dispose()
			}
			this.vmSubscriptions = new CompositeDisposable();
			if(executionEnv == 'solcjs') {
				this.subscribeToVMEvents()
			}
		}));
	}

	subscribeToVMEvents() {
		this.vmSubscriptions.add(atom.workspace.observeTextEditors((editor) => {
			if(!editor || !editor.getBuffer()) {
				return
			}

			this.subscriptions.add(atom.config.observe('etheratom.compileOnSave', (compileOnSave) => {
				if(this.saveSubscriptions) {
					this.saveSubscriptions.dispose();
				}
				this.saveSubscriptions = new CompositeDisposable();
				if(compileOnSave) {
					this.subscribeToSaveEvents();
				}
			}));
		}));
	}
	subscribeToSaveEvents() {
		this.saveSubscriptions.add(atom.workspace.observeTextEditors((editor) => {
			if(!editor || !editor.getBuffer()) {
				return
			}

			const bufferSubscriptions = new CompositeDisposable()
			bufferSubscriptions.add(editor.getBuffer().onDidSave((filePath) => {
				if(atom.config.get('etheratom.compileOnSave')) {
					//this.execute(editor)
					this.compile(editor)
				}
			}))
			bufferSubscriptions.add(editor.getBuffer().onDidDestroy(() => {
				bufferSubscriptions.dispose()
			}))
			this.saveSubscriptions.add(bufferSubscriptions)
		}));
	}

	execute() {
		console.log("Executing test VM");
		let code = '7f4e616d65526567000000000000000000000000000000000000000000000000003055307f4e616d6552656700000000000000000000000000000000000000000000000000557f436f6e666967000000000000000000000000000000000000000000000000000073661005d2720d855f1d9976f88bb10c1a3398c77f5573661005d2720d855f1d9976f88bb10c1a3398c77f7f436f6e6669670000000000000000000000000000000000000000000000000000553360455560df806100c56000396000f3007f726567697374657200000000000000000000000000000000000000000000000060003514156053576020355415603257005b335415603e5760003354555b6020353360006000a233602035556020353355005b60007f756e72656769737465720000000000000000000000000000000000000000000060003514156082575033545b1560995733335460006000a2600033545560003355005b60007f6b696c6c00000000000000000000000000000000000000000000000000000000600035141560cb575060455433145b1560d25733ff5b6000355460005260206000f3'
		//code needs to be a buffer
		code = new Buffer(code, 'hex')
		this.vm.runCode({
			code: code,
			gasLimit: new Buffer('ffffffff', 'hex')
		}, function(err, results) {
			console.log('returned: ' + results.return.toString('hex'));
		})
	}
	combineSource(dir, source, imports) {
		let fn, iline, ir, match, o, subSource;
		o = {
			encoding: 'UTF-8'
		};
		ir = /import\ [\'\"](.+)[\'\"]\;/g;
		match = null;
		while((match = ir.exec(source))) {
			iline = match[0];
			fn = match[1];
			if(imports[fn]) {
				source = source.replace(iline, '');
				continue;
			}
			imports[fn] = 1;
			subSource = fs.readFileSync(dir + "/" + fn, o);
			match.source = this.combineSource(dir, subSource, imports);
			source = source.replace(iline, match.source);
		}
		return source;
	}
	compile(editor) {
		let filename, filePath, dir, source;

		filePath = editor.getPath();
		filename = filePath.replace(/^.*[\\\/]/, '');
		if(filePath.split('.').pop() == 'sol') {
			dir = path.dirname(filePath);
			source = this.combineSource(dir, editor.getText(), {});
			this.compileVM(source, (error, compiled) => {
				if(error) {
					console.log(error);
					// Panic some unhandled error occured
				}
				if(compiled) {
					console.log(compiled);
					// Handle compilation returns
					if(compiled.errors) {
						this.view.viewErrors(compiled.errors);
					} else {
						this.view.viewCompiled(compiled);
					}
				}
			});
		} else {
			return;
		}
	}
	compileVM(source, callback) {
		let output;
		output = Solc.compile(source, 1);
		return callback(null, output);
	}
}
export { VM }
