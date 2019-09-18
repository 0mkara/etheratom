'use babel'
// Copyright 2018 Etheratom Authors
// This file is part of Etheratom.

// Etheratom is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Etheratom is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Etheratom.  If not, see <http://www.gnu.org/licenses/>.
import { CompositeDisposable } from 'atom';
export class AtomSolidityView {
    constructor() {
        this.element = document.createElement;
        this.element = document.createElement('atom-panel');
        this.element.classList.add('etheratom-panel');
        let att = null;

        // empty div to handle resize
        let resizeNode = document.createElement('div');
        resizeNode.onmousedown = this.handleMouseDown.bind(this);
        resizeNode.classList.add('etheratom-panel-resize-handle');
        resizeNode.setAttribute('ref', 'resizehandle');
        this.element.appendChild(resizeNode);

        let mainNode = document.createElement('div');
        mainNode.classList.add('etheratom');
        mainNode.classList.add('native-key-bindings');
        mainNode.setAttribute('tabindex', '-1');

        let message = document.createElement('div');
        message.textContent = 'Etheratom IDE';
        message.classList.add('compiler-info');
        message.classList.add('block');
        message.classList.add('highlight-info');
        mainNode.appendChild(message);

        let compilerNode = document.createElement('div');
        att = document.createAttribute('id');
        att.value = 'client-options';
        compilerNode.setAttributeNode(att);
        mainNode.appendChild(compilerNode);

        let loaderNode = document.createElement('div');
        att = document.createAttribute('id');
        att.value = 'loader';
        loaderNode.setAttributeNode(att);
        mainNode.appendChild(loaderNode);

        let versionNode = document.createElement('div');
        att = document.createAttribute('id');
        att.value = 'version_selector';
        versionNode.setAttributeNode(att);
        mainNode.appendChild(versionNode);

        let accountsNode = document.createElement('div');
        att = document.createAttribute('id');
        att.value = 'accounts-list';
        accountsNode.setAttributeNode(att);
        mainNode.appendChild(accountsNode);

        let buttonNode = document.createElement('div');
        att = document.createAttribute('id');
        att.value = 'common-buttons';
        buttonNode.setAttributeNode(att);
        buttonNode.classList.add('block');

        let compileButton = document.createElement('div');
        att = document.createAttribute('id');
        att.value = 'compile_btn';
        compileButton.setAttributeNode(att);
        compileButton.classList.add('inline-block');

        buttonNode.appendChild(compileButton);
        mainNode.appendChild(buttonNode);

        let tabNode = document.createElement('div');
        att = document.createAttribute('id');
        att.value = 'tab_view';
        tabNode.setAttributeNode(att);
        mainNode.appendChild(tabNode);

        let errorNode = document.createElement('div');
        att = document.createAttribute('id');
        att.value = 'compiled-error';
        errorNode.setAttributeNode(att);
        errorNode.classList.add('compiled-error');
        mainNode.appendChild(errorNode);

        // Finally append mainNode to element
        this.element.appendChild(mainNode);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.dispose = this.dispose.bind(this);
        this.getElement = this.getElement.bind(this);
        this.destroy = this.destroy.bind(this);
    }
    handleMouseDown(e) {
        if (this.subscriptions != null) {
            this.subscriptions.dispose();
        }

        const mouseUpHandler = (e) => this.handleMouseUp(e);
        const mouseMoveHandler = (e) => this.handleMouseMove(e);
        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);

        this.subscriptions = new CompositeDisposable({
            dispose: () => {
                window.removeEventListener('mousemove', mouseMoveHandler);
            }
        }, {
                dispose: () => {
                    window.removeEventListener('mouseup', mouseUpHandler);
                }
            });
    }
    handleMouseMove(e) {
        // Currently only vertical panel is working, may be later I should add horizontal panel
        const width = this.element.getBoundingClientRect().right - e.pageX;
        const vwidth = window.innerWidth;
        const vw = (width / vwidth) * 100 + 'vw';
        this.element.style.width = vw;
    }
    handleMouseUp(e) {
        if (this.subscriptions) {
            this.subscriptions.dispose();
        }
    }
    getElement() {
        return this.element;
    }
    dispose() {
        this.destroy();
    }
    destroy() {
        return this.element.remove();
    }
}
