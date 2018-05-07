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

class ShareBox extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            shared: false,
            shareLink: null,
            gas: 500000
        }
        this._handleShare = this._handleShare.bind(this);
        this._handleLoad = this._handleLoad.bind(this);
        this._handleCopy = this._handleCopy.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleGasChange = this._handleGasChange.bind(this);
    }
    async _handleShare() {
        const that = this;
        const { coinbase, password } = this.props;
        const { gas } = this.state;
        let code = null;
        atom.workspace.observeTextEditors(async (editor) => {
            code = editor.getText();
            return;
        });
        // Will upload code to smart contract
        const shared = await that.helpers.shareCode(coinbase, password, code, gas);
        console.log(shared);
        //const shared = 'abcd';
        that.setState({ shared: true, shareLink: shared });
        return;
    }
    async _handleLoad() {
        // Will load code from smart contract
    }
    async _handleCopy() {
        const { shareLink } = this.state;
        atom.clipboard.write(shareLink);
    }
    async _handleChange(event) {
        this.setState({ shared: false, shareLink: event.target.value });
    }
    async _handleGasChange(event) {
        this.setState({ gas: event.target.value });
    }
    render() {
        const { shareLink, shared, gas } = this.state;
        return (
            <div class="row">
                <input
                    type="text"
                    name="shared link"
                    class="input-text"
                    placeholder="Fiddle link here"
                    value={shareLink}
                    onChange={this._handleChange}
                />
                {
                    !shared &&
                    <button class='btn btn-success inline-block-tight' onClick={this._handleLoad}>
                        Load
                    </button>
                }
                <input
                    type="number"
                    name="gas"
                    class="input-text gas-supply"
                    placeholder="Gas supply"
                    value={gas}
                    onChange={this._handleGasChange}
                />
                {
                    shared &&
                    <button class='btn btn-success inline-block-tight' onClick={this._handleCopy}>
                        Copy
                    </button>
                }
                <button class='btn btn-success inline-block-tight' onClick={this._handleShare}>
                    Share
                </button>
            </div>
        );
    }
}

const mapStateToProps = ({ account }) => {
    const { coinbase, password } = account;
	return { coinbase, password };
}

export default connect(mapStateToProps, {})(ShareBox);
