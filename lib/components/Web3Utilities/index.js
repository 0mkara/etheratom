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
import React from 'react'
import { connect } from 'react-redux'
import { Collapse } from 'react-collapse'
import ReactJson from 'react-json-view'
import VirtualList from 'react-tiny-virtual-list'

class Web3Utilities extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            input: null,
            output: null
        };
        this._hexToUtf8 = this._hexToUtf8.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._toHex = this._toHex.bind(this);
        this._toChecksumAddress = this._toChecksumAddress.bind(this);
        this._hexToBytes = this._hexToBytes.bind(this);
        this._hexToNumber = this._hexToNumber.bind(this);
        this._bytesToHex = this._bytesToHex.bind(this);
        this._padLeft32 = this._padLeft32.bind(this);
        this._padRight32 = this._padRight32.bind(this);
        this._padLeft64 = this._padLeft64.bind(this);
        this._padRight64 = this._padRight64.bind(this);
        this._hexToAscii = this._hexToAscii.bind(this);
    }
    _handleInputChange(event) {
        this.setState({ input: event.target.value });
    }
    async _hexToUtf8() {
        try {
            const { input } = this.state;
            const decoded = await this.helpers.hexToUtf8(input);
            this.setState({ output: decoded });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    async _hexToAscii() {
        try {
            const { input } = this.state;
            const ascii = await this.helpers.hexToAscii(input);
            this.setState({ output: ascii });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    async _toHex() {
        try {
            const { input } = this.state;
            const encoded = await this.helpers.toHex(input);
            this.setState({ output: encoded });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    async _toChecksumAddress() {
        try {
            const { input } = this.state;
            const chkSmAddr = await this.helpers.toChecksumAddress(input);
            this.setState({ output: chkSmAddr });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    async _hexToNumber() {
        try {
            const { input } = this.state;
            const number = await this.helpers.hexToNumber(input);
            this.setState({ output: number });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    async _hexToBytes() {
        try {
            const { input } = this.state;
            const bytes = await this.helpers.hexToBytes(input);
            this.setState({ output: bytes });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    async _bytesToHex() {
        try {
            const { input } = this.state;
            const hex = await this.helpers.bytesToHex(input);
            this.setState({ output: hex });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    async _padLeft32() {
        try {
            const { input } = this.state;
            const leftPadded = await this.helpers.padLeft(input, 32);
            this.setState({ output: leftPadded });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    async _padRight32() {
        try {
            const { input } = this.state;
            const rightPadded = await this.helpers.padRight(input, 32);
            this.setState({ output: rightPadded });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    async _padLeft64() {
        try {
            const { input } = this.state;
            const leftPadded = await this.helpers.padLeft(input, 64);
            this.setState({ output: leftPadded });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    async _padRight64() {
        try {
            const { input } = this.state;
            const rightPadded = await this.helpers.padRight(input, 64);
            this.setState({ output: rightPadded });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    render() {
        return (
            <div class="web3-decoder">
                <div class="flex-column">
                    <div class="block">
                        <input
                            type="text"
                            name="utilsInput"
                            value={this.state.input}
                            onChange={this._handleInputChange}
                            placeholder="Enter web3 supported cryptographically encoded string"
                            class="input-text" />
                    </div>
                    <div class="block">
                        <button class='btn inline-block-tight' onClick={this._toHex}>
                            To Hex
                        </button>
                        <button class='btn inline-block-tight' onClick={this._toChecksumAddress}>
                            To Checksum Address
                        </button>
                        <button class='btn inline-block-tight' onClick={this._hexToNumber}>
                            Hex to Number
                        </button>
                        <button class='btn inline-block-tight' onClick={this._hexToUtf8}>
                            Hex to UTF8
                        </button>
                        <button class='btn inline-block-tight' onClick={this._hexToAscii}>
                            Hex to ASCII
                        </button>
                        <button class='btn inline-block-tight' onClick={this._hexToBytes}>
                            Hex to Bytes
                        </button>
                        <button class='btn inline-block-tight' onClick={this._bytesToHex}>
                            Bytes to Hex
                        </button>
                        <button class='btn inline-block-tight' onClick={this._padLeft32}>
                            Pad left 32
                        </button>
                        <button class='btn inline-block-tight' onClick={this._padRight32}>
                            Pad right 32
                        </button>
                        <button class='btn inline-block-tight' onClick={this._padLeft64}>
                            Pad left 64
                        </button>
                        <button class='btn inline-block-tight' onClick={this._padRight64}>
                            Pad right 64
                        </button>
                    </div>
                </div>
                {
                    this.state.output &&
                    <div class="block">
                        <pre>{this.state.output}</pre>
                    </div>
                }
            </div>
        );
    }
}
const mapStateToProps = () => {
	return { };
}

export default connect(mapStateToProps, {})(Web3Utilities);
