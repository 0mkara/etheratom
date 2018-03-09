'use babel'
import Etheratom from '../lib/ethereum-interface'
import { getHandlers, handleIPFS, resolveImports, combineSource } from '../lib/helpers/compiler-imports'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Etheratom", async function() {
	describe("Test command eth-interface:activate", function() {
		beforeEach(async function() {
			const workspaceElement = atom.views.getView(atom.workspace);
		})
		afterEach(async () => {
			await atom.packages.deactivatePackage('etheratom')
			atom.packages.unloadPackage('etheratom')
		});

		it("Expect package etheratom to be activated", async function() {
			atom.packages.loadPackage('etheratom');
			await atom.packages.activatePackage('etheratom');
			expect(atom.packages.isPackageActive('etheratom')).toBe(true);
		});
		it("Expect package etheratom de-activated", async function() {
			atom.packages.loadPackage('etheratom');
			await atom.packages.activatePackage('etheratom');
			await atom.packages.deactivatePackage('etheratom');
			expect(atom.packages.isPackageActive('etheratom')).toBe(false);
		});
		it("Expect element with class .etheratom-panel to exist", async function() {
			atom.packages.loadPackage('etheratom');
			await atom.packages.activatePackage('etheratom');
			expect(workspaceElement.getElementsByClassName('etheratom-panel')).toShow();
		});
	});

	describe("Test command eth-interface:toggle", function() {
		afterEach(async () => {
			await atom.packages.deactivatePackage('etheratom')
			atom.packages.unloadPackage('etheratom')
		});

		it("Expect .etheratom-panel to be visiable", async function() {
			atom.packages.loadPackage('etheratom');
			await atom.packages.activatePackage('etheratom');

			// Now that we checked package activation lets do some real tests
			await atom.commands.dispatch(workspaceElement, 'eth-interface:toggle');
			expect(workspaceElement.querySelector('.etheratom-panel')).toShow();
		});
		it("Expect .etheratom-panel NOT to be visiable", async function() {
			atom.packages.loadPackage('etheratom');
			await atom.packages.activatePackage('etheratom');

			// Now that we checked package activation lets do some real tests
			await atom.commands.dispatch(workspaceElement, 'eth-interface:toggle');
			await atom.commands.dispatch(workspaceElement, 'eth-interface:toggle');
			expect(workspaceElement.querySelector('.etheratom-panel')).not.toShow();
		});
	});

	describe("Test compiler-imports functions", function() {
		/*it("Expect handleIPFS to be a function", async function() {
			console.log(await handleIPFS());
			expect(typeof handleIPFS).toBe("function");
		});
		it("Expect handler() to return array", async function() {
			const handlers = await getHandlers();
			console.log(handlers);
			expect(typeof handlers).toBe("object");
		});
		it("Expect resolveImports to resolve imports", async function() {
			const subSource = await resolveImports('../', 'https://github.com/OpenZeppelin/zeppelin-solidity/contracts/crowdsale/Crowdsale.sol');
			console.log(subSource);
			console.log(typeof subSource);
			expect(typeof subSource).toBe("string");
		});*/
		it("Expect combineSource to put all sources in one file", async function() {
			const contract = `
				/* Hello world contract */
				pragma solidity ^0.4.18;
				import './greeter.sol';
				import 'https://github.com/OpenZeppelin/zeppelin-solidity/contracts/crowdsale/Crowdsale.sol';

				contract Greetings is Greeter {
				}
			`
			console.log(contract);
			const dir = "/home/0mkar/Karma/Solidity";
			const source = await combineSource(dir, contract);
			//console.log(source);
			expect(typeof source).toBe("string");
		});
	});
});
