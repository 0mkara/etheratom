'use babel'
import Etheratom from '../lib/ethereum-interface'
import { getHandlers, handleIPFS, resolveImports, combineSource } from '../lib/helpers/compiler-imports'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Etheratom", async function() {
	describe("Test command eth-interface:activate", function() {
		const workspaceElement = atom.views.getView(atom.workspace);
		afterEach(async () => {
			await atom.packages.deactivatePackage('etheratom')
			atom.packages.unloadPackage('etheratom')
		});

		it("Expect package etheratom to be activated", async function() {
			try {
				await atom.packages.loadPackage('etheratom')
				await atom.packages.activatePackage('etheratom')
				expect(atom.packages.isPackageActive('etheratom')).toBe(true)
			} catch (e) {
				throw e
			}
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
		const workspaceElement = atom.views.getView(atom.workspace);
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

	describe("Test github compiler-imports", function() {
		it("Expect combineSource to put all sources in one file", async function() {
			const contract = `
pragma solidity ^0.4.19;

import 'https://github.com/OpenZeppelin/zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol';
import 'https://github.com/OpenZeppelin/zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol';


contract GustavoCoinCrowdsale is TimedCrowdsale, MintedCrowdsale {
    function GustavoCoinCrowdsale
        (
            uint256 _openingTime,
            uint256 _closingTime,
            uint256 _rate,
            address _wallet,
            MintableToken _token
        )
        public
        Crowdsale(_rate, _wallet, _token)
        TimedCrowdsale(_openingTime, _closingTime) {

        }
}

			`
			const dir = "~/";
			try {
				var sources = { "GustavoCoinCrowdsale.sol": { content: contract } };
				source = await combineSource(dir, sources);
				expect(typeof source).toBe("object");
			} catch (e) {
				expect(e).toBeNull();
			}
		});
	});

	/*describe("Test local compiler-imports", function() {
		it("Expect combineSource to put all sources in one file", async function() {
			const contract = `
pragma solidity 0.4.19;

import '../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract GustavoCoin is MintableToken {
    string public name = "GUSTAVO COIN";
    string public symbol = "GUS";
    uint8 public decimals = 18;
}
			`
			const dir = "/home/0mkar/Karma/Solidity/zeplin/Token/";
			try {
				var sources = { "token.sol": { content: contract } };
				sources = await combineSource(dir, sources);
				expect(typeof sources).toBe("object");
			} catch (e) {
				expect(e).toBeNull();
			}
		});
	});*/
});
