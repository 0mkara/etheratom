'use babel'
import React from 'react'
import ReactDOM from 'react-dom'
let AtomSolidityView, CompositeDisposable;

CompositeDisposable = require('atom').CompositeDisposable;

module.exports = AtomSolidityView = (() => {
	function AtomSolidityView(serializedState) {
		var mainNode,
			resizeNode,
			accountsNode,
			att,
			buttonNode,
			compileButton,
			compilerNode,
			makeButton,
			message;

		this.handleMouseDown = function(e) {
			if(this.subscriptions != null) {
				this.subscriptions.dispose()
			}

			const mouseUpHandler = (e) => this.handleMouseUp(e)
			const mouseMoveHandler = (e) => this.handleMouseMove(e)
			window.addEventListener('mousemove', mouseMoveHandler)
			window.addEventListener('mouseup', mouseUpHandler)

			this.subscriptions = new CompositeDisposable({
				dispose: () => {
					window.removeEventListener('mousemove', mouseMoveHandler)
				}
			}, {
				dispose: () => {
					window.removeEventListener('mouseup', mouseUpHandler)
				}
			})
		}

		this.handleMouseMove = function(e) {
			// Currently only vertical panel is working, may be later I should add horizontal panel
			const width = this.element.getBoundingClientRect().right - e.pageX;
			const vwidth = window.innerWidth;
			const vw = (width / vwidth) * 100 + 'vw';
			this.element.style.width = vw;
		}

		this.handleMouseUp = function(e) {
			if(this.subscriptions) {
				this.subscriptions.dispose()
			}
		}

		this.dispose = function() {
			this.destroy()
		}

		this.element = document.createElement;
		this.element = document.createElement('atom-panel');
		this.element.classList.add('etheratom-panel');

		// empty div to handle resize
		resizeNode = document.createElement('div');
		resizeNode.onmousedown = this.handleMouseDown.bind(this);
		resizeNode.classList.add('etheratom-panel-resize-handle');
		resizeNode.setAttribute('ref', 'resizehandle');
		this.element.appendChild(resizeNode);

		mainNode = document.createElement('div');
		mainNode.classList.add('etheratom');
		mainNode.classList.add('native-key-bindings');
		mainNode.setAttribute('tabindex', '-1');

		message = document.createElement('div');
		message.textContent = "Ethereum Interface";
		message.classList.add('compiler-info');
		message.classList.add('block');
		message.classList.add('highlight-info');
		mainNode.appendChild(message);

		compilerNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'compiler-options';
		compilerNode.setAttributeNode(att);
		mainNode.appendChild(compilerNode);

		accountsNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'accounts-list';
		accountsNode.setAttributeNode(att);
		mainNode.appendChild(accountsNode);

		buttonNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'common-buttons';
		buttonNode.setAttributeNode(att);
		buttonNode.classList.add('block');

		compileButton = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'compile_btn';
		compileButton.setAttributeNode(att);
		compileButton.classList.add('inline-block');

		buttonNode.appendChild(compileButton);
		mainNode.appendChild(buttonNode);

		tabNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'tab_view';
		tabNode.setAttributeNode(att);
		mainNode.appendChild(tabNode);

		this.errorNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'compiled-error';
		this.errorNode.setAttributeNode(att);
		this.errorNode.classList.add('compiled-error');
		mainNode.appendChild(this.errorNode);

		// Finally append mainNode to element
		this.element.appendChild(mainNode);

	}

	AtomSolidityView.prototype.serialize = function() {};

	AtomSolidityView.prototype.destroy = function() {
		return this.element.remove();
	};

	AtomSolidityView.prototype.getElement = function() {
		return this.element;
	};

	return AtomSolidityView;
})();
