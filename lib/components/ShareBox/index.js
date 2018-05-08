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

class ShareBox extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            shared: false,
            shareLink: null,
            gas: 0,
            snippet: null,
            txHash: null,
            code: null,
            isOpened: false,
            toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
            togglePreviewTxt: 'Preview Snippet'
        }
        this._handleShare = this._handleShare.bind(this);
        this._handleLoad = this._handleLoad.bind(this);
        this._handleCopy = this._handleCopy.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleGasChange = this._handleGasChange.bind(this);
        this._togglePreview = this._togglePreview.bind(this);
        this.watchSyncEvents();
    }
    async watchSyncEvents() {
        const that = this;
        const { coinbase } = this.props;
        that.helpers.snptEvents.NewFiddle({ filter: { _user: coinbase } })
            .on('data', data => {
                console.log(data);
                const fiddleId = data.returnValues._id;
                that.setState({ shared: true, shareLink: fiddleId });
            })
            .on('error', e => {
                throw e;
            })
    }
    async componentDidMount() {
        const { coinbase } = this.props;
        const gasEstm = await this.helpers.getShareGasEstm(coinbase);
        this.setState({ gas: gasEstm });
        atom.workspace.observeActiveTextEditor(async (editor) => {
            if(!editor || !editor.getBuffer()) {
				return
			}
            code = editor.getText();
            this.setState({ code });
            return;
        });
    }
    async _handleShare() {
        const that = this;
        const { coinbase, password } = this.props;
        const { gas, code } = this.state;
        this.setState({ txHash: null, shareLink: null, snippet: null });
        that.helpers.shareCode(coinbase, password, code, gas)
            .then(txHash => {
                this.setState({ txHash: txHash });
            })
            .catch(e => {
                throw e;
            });
    }
    async _handleLoad() {
        try {
            const { shareLink } = this.state;
            const { coinbase } = this.props;
            const code = await this.helpers.getSnippet(coinbase, shareLink);
            this.setState({ snippet: code });
        } catch(e) {
            throw e;
        }
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
    _togglePreview() {
        const { isOpened } = this.state;
        this.setState({ isOpened: !isOpened });
        if(!isOpened) {
            this.setState({
                toggleBtnStyle: 'btn btn-success icon icon-fold inline-block-tight',
                togglePreviewTxt: 'Hide Snippet'
            });
        } else {
            this.setState({
                toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
                togglePreviewTxt: 'Preview Snippet'
            });
        }
    }
    render() {
        const { shareLink, shared, gas, snippet, txHash, code, toggleBtnStyle, togglePreviewTxt, isOpened } = this.state;
        return (
            <div class="share-box">
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
                    {
                        shared &&
                        <button class='btn btn-success inline-block-tight' onClick={this._handleCopy}>
                            Copy
                        </button>
                    }
                </div>
                <div class="column">
                    <div class="row">
                        <input
                            type="number"
                            name="gas"
                            class="input-text"
                            placeholder="Gas supply"
                            value={gas}
                            onChange={this._handleGasChange}
                        />
                        <button class='btn btn-success inline-block-tight' onClick={this._handleShare}>
                            Share
                        </button>
                    </div>
                    <div class="row row-thin">
                        <span class="padded">This is contract creation gas. Update it according to your needs!</span>
                        <button class={toggleBtnStyle} onClick={this._togglePreview}>
                            {togglePreviewTxt}
                        </button>
                    </div>
                    {
                        txHash &&
                        <div class="row">
                            <span class="padded status-added">Transaction: { txHash }</span>
                        </div>
                    }
                </div>
                <Collapse isOpened={isOpened}>
                    {
                        code &&
                        <div class="code">
                            <pre>
                                {code}
                            </pre>
                        </div>
                    }
                </Collapse>
                {
                    snippet &&
                    <div class="block">
                        <pre>
                            {snippet}
                        </pre>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = ({ account }) => {
    const { coinbase, password } = account;
	return { coinbase, password };
}

export default connect(mapStateToProps, {})(ShareBox);
