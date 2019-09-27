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
import { setAccounts, setSyncStatus, setMining, setHashrate, setCoinbase, setErrors } from '../../actions';
import PropTypes from 'prop-types';

class NodeControl extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.helpers.isWsProvider();
        this.helpers.isHttpProvider();
        const { clients } = this.props;
        const client = clients[0];
        this.state = {
            // TODO: get values from props
            wsProvider: client.isWsProvider,
            httpProvider: client.isHttpProvider,
            connected: client.hasConnection,
            toAddress: '',
            amount: 0,
            rpcAddress: atom.config.get('etheratom.rpcAddress'),
            websocketAddress: atom.config.get('etheratom.websocketAddress'),
            status: this.props.store.getState().node.status
        };
        this._refreshSync = this._refreshSync.bind(this);
        this.getNodeInfo = this.getNodeInfo.bind(this);
        this._handleToAddrrChange = this._handleToAddrrChange.bind(this);
        this._handleSend = this._handleSend.bind(this);
        this._handleAmountChange = this._handleAmountChange.bind(this);
        this._handleWsChange = this._handleWsChange.bind(this);
        this._handleWsSubmit = this._handleWsSubmit.bind(this);
        this._handleRPCChange = this._handleRPCChange.bind(this);
        this._handleRPCSubmit = this._handleRPCSubmit.bind(this);
    }
    async componentDidMount() {
        this.getNodeInfo();
    }
    async componentDidUpdate(prevProps, prevState) {
        if (this.state.httpProvider !== this.props.store.getState().clientReducer.clients[0].isHttpProvider) {
            this.setState({ httpProvider: this.props.store.getState().clientReducer.clients[0].isHttpProvider });
        }
        if (this.state.wsProvider !== this.props.store.getState().clientReducer.clients[0].isWsProvider) {
            this.setState({ wsProvider: this.props.store.getState().clientReducer.clients[0].isWsProvider });
        }
    }
    async _refreshSync() {
        await this.helpers.getAccounts();
        this.getNodeInfo();
        const { clients } = this.props;
        const client = clients[0];
        this.setState({
            wsProvider: client.isWsProvider,
            httpProvider: client.isHttpProvider,
            connected: client.hasConnection,
        });
    }
    async getNodeInfo() {
        // get sync status
        await this.helpers.getSyncStat();
        this.setState({ status: this.props.store.getState().node.status });
        this.props.setSyncStatus(this.state.status);
        // get mining status
        await this.helpers.getMining();
        // get hashrate
        await this.helpers.getHashrate();
        // this.props.setHashrate(hashRate);
    }
    _handleToAddrrChange(event) {
        this.setState({ toAddress: event.target.value });
    }
    _handleAmountChange(event) {
        this.setState({ amount: event.target.value });
    }
    _handleWsChange(event) {
        atom.config.set('etheratom.websocketAddress', event.target.value);
        this.setState({ websocketAddress: event.target.value });
    }
    _handleRPCChange(event) {
        atom.config.set('etheratom.rpcAddress', event.target.value);
        this.setState({ rpcAddress: event.target.value });
    }
    async _handleWsSubmit(event) {
        event.preventDefault();
        const { websocketAddress } = this.state;
        atom.config.set('etheratom.websocketAddress', websocketAddress);

        const newState = {
            wsProvider: this.props.store.getState().clientReducer.clients[0].isWsProvider,
            httpProvider: this.props.store.getState().clientReducer.clients[0].isHttpProvider,
            connected: this.props.store.getState().clientReducer.clients[0].hasConnection,
            toAddress: '',
            amount: 0,
            rpcAddress: atom.config.get('etheratom.rpcAddress'),
            websocketAddress: atom.config.get('etheratom.websocketAddress')
        };

        this.setState(newState);
        // this.helpers.updateWeb3();
        try {

            await this.helpers.getAccountsForNodeSubmit('node_ws', websocketAddress);
        }
        catch (e) {
            this.helpers.showPanelError('Error with Web Socket value. Please check again');
        }
    }
    async _handleRPCSubmit(event) {
        event.preventDefault();
        const { rpcAddress } = this.state;
        atom.config.set('etheratom.rpcAddress', rpcAddress);
        const newState = {
            wsProvider: this.props.store.getState().clientReducer.clients[0].isWsProvider,
            httpProvider: this.props.store.getState().clientReducer.clients[0].isHttpProvider,
            connected: this.props.store.getState().clientReducer.clients[0].hasConnection,
            toAddress: '',
            amount: 0,
            rpcAddress: atom.config.get('etheratom.rpcAddress'),
            websocketAddress: atom.config.get('etheratom.websocketAddress')
        };

        this.setState(newState);
        // this.helpers.updateWeb3();
        try {
            await this.helpers.getAccountsForNodeSubmit('node_rpc', rpcAddress);
        }
        catch (e) {

            this.helpers.showPanelError('Error with RPC value. Please check again');
        }
    }
    async _handleSend() {
        try {
            const { password } = this.props;
            const { toAddress, amount } = this.state;
            await this.helpers.send(toAddress, amount, password);
            // this.helpers.showTransaction({ head: 'Transaction recipt:', data: txRecipt });
        } catch (e) {
            this.helpers.showPanelError(e);
        }
    }
    render() {
        const { coinbase, status, syncing, mining, hashRate } = this.props;
        const { connected, wsProvider, httpProvider, toAddress, amount, rpcAddress, websocketAddress } = this.state;
        return (
            <div id="NodeControl">
                <div id="connections">
                    <ul className="connection-urls list-group">
                        <li className='list-item'>
                            <form onSubmit={this._handleWsSubmit}>
                                <input type="submit" value="WS" className={(wsProvider && connected) ? 'btn btn-success smallbtn' : 'btn btn-error smallbtn'} />
                                <input
                                    type="string" placeholder="Address" className="input-text"
                                    value={websocketAddress}
                                    onChange={this._handleWsChange}
                                />
                            </form>
                        </li>
                        <li className='list-item'>
                            <form onSubmit={this._handleRPCSubmit}>
                                <input type="submit" value="RPC" className={(httpProvider && connected) ? 'btn btn-success smallbtn' : 'btn btn-error smallbtn'} />
                                <input
                                    type="string" placeholder="Address" className="input-text"
                                    value={rpcAddress}
                                    onChange={this._handleRPCChange}
                                />
                            </form>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Connected:</span>
                            <span className='inline-block'>{`${connected}`}</span>
                        </li>
                    </ul>
                </div>
                <ul className='list-group'>
                    <li className='list-item'>
                        <span className='inline-block highlight'>Coinbase:</span>
                        <span className='inline-block'>{coinbase}</span>
                    </li>
                </ul>
                {
                    (Object.keys(status).length > 0 && status instanceof Object) &&
                    <ul className="list-group">
                        <li className='list-item'>
                            <span className='inline-block highlight'>Sync progress:</span>
                            <progress className='inline-block' max='100' value={(100 * (status.currentBlock / status.highestBlock)).toFixed(2)}></progress>
                            <span className='inline-block'>{(100 * (status.currentBlock / status.highestBlock)).toFixed(2)}%</span>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Current Block:</span>
                            <span className='inline-block'>{status.currentBlock}</span>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Highest Block:</span>
                            <span className='inline-block'>{status.highestBlock}</span>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Known States:</span>
                            <span className='inline-block'>{status.knownStates}</span>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Pulled States</span>
                            <span className='inline-block'>{status.pulledStates}</span>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Starting Block:</span>
                            <span className='inline-block'>{status.startingBlock}</span>
                        </li>
                    </ul>
                }
                {
                    !syncing &&
                    <ul className="list-group">
                        <li className='list-item'>
                            <span className='inline-block highlight'>Syncing:</span>
                            <span className='inline-block'>{`${syncing}`}</span>
                        </li>
                    </ul>
                }
                <ul className="list-group">
                    <li className='list-item'>
                        <span className='inline-block highlight'>Mining:</span>
                        <span className='inline-block'>{`${mining}`}</span>
                    </li>
                    <li className='list-item'>
                        <span className='inline-block highlight'>Hashrate:</span>
                        <span className='inline-block'>{hashRate}</span>
                    </li>
                </ul>
                <button className="btn" onClick={this._refreshSync}>Refresh</button>
                <form className="row" onSubmit={this._handleSend}>
                    <input
                        type="string" placeholder="To address"
                        className="input-text"
                        value={toAddress}
                        onChange={this._handleToAddrrChange}
                    />
                    <input
                        type="number" placeholder="Amount"
                        className="input-text"
                        value={amount}
                        onChange={this._handleAmountChange}
                    />
                    <input
                        className='btn inline-block-tight'
                        type="submit"
                        value="Send"
                    />
                </form>
            </div>
        );
    }
}

NodeControl.propTypes = {
    helpers: PropTypes.any.isRequired,
    syncing: PropTypes.bool,
    status: PropTypes.object,
    mining: PropTypes.bool,
    hashRate: PropTypes.number,
    coinbase: PropTypes.number,
    setHashrate: PropTypes.func,
    setMining: PropTypes.func,
    setSyncStatus: PropTypes.func,
    setAccounts: PropTypes.func,
    setCoinbase: PropTypes.func,
    setErrors: PropTypes.string,
    password: PropTypes.string,
    clients: PropTypes.array.isRequired,
    store: PropTypes.any,
};

const mapStateToProps = ({ account, node, clientReducer }) => {
    const { coinbase, password } = account;
    const { status, syncing, mining, hashRate } = node;
    const { clients } = clientReducer;
    return { coinbase, password, status, syncing, mining, hashRate, clients };
};

export default connect(mapStateToProps, { setAccounts, setCoinbase, setSyncStatus, setMining, setHashrate, setErrors })(NodeControl);
