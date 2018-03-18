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

class TxAnalyzer extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            txHash: undefined,
            txAnalysis: undefined,
            toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
            isOpened: false,
        }
        this._handleTxHashChange = this._handleTxHashChange.bind(this);
        this._handleTxHashSubmit = this._handleTxHashSubmit.bind(this);
        this._toggleCollapse = this._toggleCollapse.bind(this);
    }
    _toggleCollapse() {
        const { isOpened } = this.state;
        this.setState({ isOpened: !isOpened });
        if(!isOpened) {
            this.setState({
                toggleBtnStyle: 'btn btn-success icon icon-fold inline-block-tight'
            });
        } else {
            this.setState({
                toggleBtnStyle: 'btn icon icon-unfold inline-block-tight'
            });
        }
    }
    _handleTxHashChange(event) {
        this.setState({ txHash: event.target.value });
    }
    async _handleTxHashSubmit() {
        const { txHash } = this.state;
        if(txHash) {
            try {
                const txAnalysis = await this.helpers.getTxAnalysis(txHash);
                this.setState({ txAnalysis });
            } catch (e) {
                console.log(e);
            }
        }
    }
    render() {
        const { toggleBtnStyle, isOpened } = this.state;
        const { pendingTransactions } = this.props;
        const transactions = pendingTransactions.slice();
        transactions.reverse();
        return (
            <div class="tx-analyzer">
                <div class="flex-row">
                    <form class="flex-row" onSubmit={this._handleTxHashSubmit}>
                        <div class="inline-block">
                            <input type="text" name="txhash" value={this.state.txHash} onChange={this._handleTxHashChange} placeholder="Transaction hash" class="input-search" />
                        </div>
                        <div class="inline-block">
                            <input type="submit" value="Analyze" class="btn" />
                        </div>
                    </form>
                    <button class={toggleBtnStyle} onClick={this._toggleCollapse}>
                        Transaction List
                    </button>
                </div>
                <Collapse isOpened={isOpened}>
                    {
                        transactions.length > 0 &&
                        <VirtualList
                            itemCount={transactions.length}
                            itemSize={30}
                            class="tx-list-container"
                            renderItem={({ index }) =>
                                <div class="tx-list-item">
                                    <span class="padded text-warning">
                                        {transactions[index]}
                                    </span>
                                </div>
                            }
                        />
                    }
                </Collapse>
                {
                    (this.state.txAnalysis && this.state.txAnalysis.transaction) &&
                    <div class="block">
                        <h2 class="block highlight-info tx-header">Transaction</h2>
                        <ReactJson
                            src={this.state.txAnalysis.transaction}
                            theme="solarized"
                            displayDataTypes={false}
                            name={false}
                        />
                    </div>
                }
                {
                    (this.state.txAnalysis && this.state.txAnalysis.transactionRecipt) &&
                    <div class="block">
                        <h2 class="block highlight-info tx-header">Transaction receipt</h2>
                        <ReactJson
                            src={this.state.txAnalysis.transactionRecipt}
                            theme="solarized"
                            displayDataTypes={false}
                            name={false}
                        />
                    </div>
                }
            </div>
        );
    }
}
const mapStateToProps = ({ events }) => {
	const { pendingTransactions } = events;
	return { pendingTransactions };
}

export default connect(mapStateToProps, {})(TxAnalyzer);
