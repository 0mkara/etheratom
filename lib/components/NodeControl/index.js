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
import { SET_ACCOUNTS } from '../../actions/types'
import { setAccounts } from '../../actions'

class NodeControl extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            syncStat: {}
        }
        this._refreshSync = this._refreshSync.bind(this);
    }
    async componentDidMount() {
        const syncStat = await this.helpers.getSyncStat();
        this.setState({ syncStat });
    }
    async _refreshSync() {
        const accounts = await this.helpers.getAccounts();
        this.props.setAccounts({ accounts });
        const syncStat = await this.helpers.getSyncStat();
        this.setState({ syncStat });
    }
    render() {
        const { coinbase } = this.props;
        const { syncStat } = this.state;
        return (
            <div id="NodeControl">
                <ul class='list-group'>
                    <li class='list-item'>
                        <span class='inline-block highlight-info'>Coinbase:</span>
                        <span class='inline-block highlight-info'>{ coinbase }</span>
                    </li>
                </ul>
                <ul class="list-group">
                    <li class='list-item'>
                        <span class='inline-block highlight-info'>Current Block:</span>
                        <span class='inline-block highlight-info'>{ syncStat.currentBlock }</span>
                    </li>
                    <li class='list-item'>
                        <span class='inline-block highlight-info'>Highest Block:</span>
                        <span class='inline-block highlight-info'>{ syncStat.highestBlock }</span>
                    </li>
                    <li class='list-item'>
                        <span class='inline-block highlight-info'>Known States:</span>
                        <span class='inline-block highlight-info'>{ syncStat.knownStates }</span>
                    </li>
                    <li class='list-item'>
                        <span class='inline-block highlight-info'>Pulled States</span>
                        <span class='inline-block highlight-info'>{ syncStat.pulledStates }</span>
                    </li>
                    <li class='list-item'>
                        <span class='inline-block highlight-info'>Starting Block:</span>
                        <span class='inline-block highlight-info'>{ syncStat.startingBlock }</span>
                    </li>
                </ul>
                <button class="btn" onClick={this._refreshSync}>Refresh</button>
            </div>
        );
    }
};

const mapStateToProps = ({ account }) => {
    const { coinbase } = account;
    return { coinbase };
}

export default connect(mapStateToProps, { setAccounts })(NodeControl);
