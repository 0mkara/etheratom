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
import React from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'react-collapse';
import ReactJson from 'react-json-view';
import VirtualList from 'react-tiny-virtual-list';
import PropTypes from 'prop-types';

class TxAnalyzer extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            txHash: undefined,
            txAnalysis: props.txAnalysis,
            toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
            isOpened: false,
        };
        this._handleTxHashChange = this._handleTxHashChange.bind(this);
        this._handleTxHashSubmit = this._handleTxHashSubmit.bind(this);
        this._toggleCollapse = this._toggleCollapse.bind(this);
    }
    componentDidMount() {
        const { pendingTransactions } = this.props;
        if (pendingTransactions.length < 10) {
            this.setState({
                isOpened: true,
                toggleBtnStyle: 'btn btn-success icon icon-fold inline-block-tight'
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.txAnalysis !== this.props.txAnalysis) {
            this.setState({ txAnalysis: this.props.txAnalysis });
        }
    }
    _toggleCollapse() {
        const { isOpened } = this.state;
        this.setState({ isOpened: !isOpened });
        if (!isOpened) {
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
        if (txHash) {
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
        const { pendingTransactions, txAnalysis } = this.props;
        const transactions = pendingTransactions.slice();
        transactions.reverse();
        return (
            <div className="tx-analyzer">
                <div className="flex-row">
                    <form className="flex-row" onSubmit={this._handleTxHashSubmit}>
                        <div className="inline-block">
                            <input type="text" name="txhash" value={this.state.txHash} onChange={this._handleTxHashChange} placeholder="Transaction hash" className="input-search" />
                        </div>
                        <div className="inline-block">
                            <input type="submit" value="Analyze" className="btn" />
                        </div>
                    </form>
                    <button className={toggleBtnStyle} onClick={this._toggleCollapse}>
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
                            overscanCount={10}
                            renderItem={({ index }) =>
                                <div className="tx-list-item">
                                    <span className="padded text-warning">
                                        {transactions[index]}
                                    </span>
                                </div>
                            }
                        />
                    }
                </Collapse>
                {
                    (txAnalysis && txAnalysis.transaction) &&
                    <div className="block">
                        <h2 className="block highlight-info tx-header">Transaction</h2>
                        <ReactJson
                            src={txAnalysis.transaction}
                            theme="chalk"
                            displayDataTypes={false}
                            name={false}
                            collapseStringsAfterLength={64}
                            iconStyle="triangle"
                        />
                    </div>
                }
                {
                    (txAnalysis && txAnalysis.transactionRecipt) &&
                    <div className="block">
                        <h2 className="block highlight-info tx-header">Transaction receipt</h2>
                        <ReactJson
                            src={txAnalysis.transactionRecipt}
                            theme="chalk"
                            displayDataTypes={false}
                            name={false}
                            collapseStringsAfterLength={64}
                            iconStyle="triangle"
                        />
                    </div>
                }
            </div>
        );
    }
}

TxAnalyzer.propTypes = {
    helpers: PropTypes.any.isRequired,
    pendingTransactions: PropTypes.array,
    txAnalysis: PropTypes.any
};

const mapStateToProps = ({ eventReducer }) => {
    const { pendingTransactions, txAnalysis } = eventReducer;
    return { pendingTransactions, txAnalysis };
};

export default connect(mapStateToProps, {})(TxAnalyzer);
