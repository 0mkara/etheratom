'use babel'
import Etheratom from '../lib/ethereum-interface';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Etheratom", () => {
	let workspaceElement = null
	let activationPromise = null

	beforeEach(function() {
		workspaceElement = atom.views.getView(atom.workspace);
		activationPromise = atom.packages.activatePackage('etheratom');
	});

	describe("when the eth-interface:toggle event is triggered", () => {
		it("hides and shows the modal panel", () => {
			runs(() => {
				// Before the activation event the view is not on the DOM, and no panel
				// has been created
				expect(workspaceElement.querySelector('.etheratom-panel')).not.toExist();
			})

			runs(() => {
				// This is an activation event, triggering it will cause the package to be activated.
				expect(workspaceElement.querySelector('.etheratom-panel')).not.toExist();
				atom.commands.dispatch(workspaceElement, 'eth-interface:toggle');
				let atomSolidityElement = workspaceElement.querySelector('.etheratom-panel');
				expect(atomSolidityElement).toExist();

				// This is a deactivation event, triggering it will cause the package to be deactivated.
				let atomSolidityPanel = atom.workspace.panelForItem(atomSolidityElement);
				expect(atomSolidityPanel.isVisible()).toBe(true);
				atom.commands.dispatch(workspaceElement, 'eth-interface:toggle');
				expect(atomSolidityPanel.isVisible()).toBe(false);
			});

			waitsForPromise(() => {
				return activationPromise;
			});
		});
	});
});
