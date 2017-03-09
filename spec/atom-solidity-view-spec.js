'use babel'
import AtomSolidityView from '../lib/ethereum-interface-view';

describe("AtomSolidityView", () => {
	let workspaceElement = null
	let activationPromise = null

	beforeEach(function() {
		workspaceElement = atom.views.getView(atom.workspace);
		activationPromise = atom.packages.activatePackage('etheratom');
	});

	it("toggles the Etheratom panel and check if every html node is created properly", () => {
		runs(() => {
			// This is an activation event, triggering it will cause the package to be activated.
			expect(workspaceElement.querySelector('.etheratom-panel')).not.toExist();
			atom.commands.dispatch(workspaceElement, 'eth-interface:toggle');
			let atomSolidityElement = workspaceElement.querySelector('.etheratom-panel');
			expect(atomSolidityElement).toExist();

			// Check for expected divs
			expect(workspaceElement.querySelector('.etheratom-panel-resize-handle')).toExist();
			expect(workspaceElement.querySelector('.etheratom')).toExist();
			expect(workspaceElement.querySelector('.compiler-info')).toExist();
			expect(workspaceElement.querySelector('#compiler-options')).toExist();
			expect(workspaceElement.querySelector('#accounts-list')).toExist();
			expect(workspaceElement.querySelector('#common-buttons')).toExist();
			expect(workspaceElement.querySelector('#compile_btn')).toExist();
			expect(workspaceElement.querySelector('#make_btn')).toExist();
			expect(workspaceElement.querySelector('#compiled-code')).toExist();

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
