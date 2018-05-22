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
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { connect } from 'react-redux'
import Contracts from '../Contracts'
import TxAnalyzer from '../TxAnalyzer'
import Events from '../Events'
import NodeControl from '../NodeControl'
import StaticAnalysis from '../StaticAnalysis'

class TabView extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            txBtnStyle: 'btn',
            eventBtnStyle: 'btn',
            newTxCounter: 0,
            newEventCounter: 0
        }
        this._handleTabSelect = this._handleTabSelect.bind(this);
    }
    _handleTabSelect(index) {
        if(index === 2) {
            this.setState({ newTxCounter: 0, txBtnStyle: 'btn' });
        }
        if(index === 3) {
            this.setState({ newEventCounter: 0, eventBtnStyle: 'btn' });
        }
    }
    componentWillReceiveProps(nextProps) {
        const { newTxCounter, newEventCounter } = this.state;
        if(this.props.pendingTransactions !== nextProps.pendingTransactions) {
            this.setState({ newTxCounter: newTxCounter+1, txBtnStyle: 'btn btn-error' });
        }
        if(this.props.events !== nextProps.events && nextProps.events.length > 0) {
            this.setState({ newEventCounter: newEventCounter+1, eventBtnStyle: 'btn btn-error' });
        }
    }
    render() {
        const { eventBtnStyle, txBtnStyle, newTxCounter, newEventCounter  } = this.state;

        return (
            <Tabs onSelect={index => this._handleTabSelect(index)} className="react-tabs vertical-tabs">
                <TabList className="react-tabs__tab-list vertical tablist">
                    <div class="tab_btns">
                        <Tab>
                            <div class="btn">Contract</div>
                        </Tab>
                        <Tab>
                            <div class="btn">Analysis</div>
                        </Tab>
                        <Tab>
                            <div class={txBtnStyle}>
                                Transaction analyzer
                                {
                                    newTxCounter > 0 &&
                                    <span class='badge badge-small badge-error notify-badge'>{newTxCounter}</span>
                                }
                            </div>
                        </Tab>
                        <Tab>
                            <div class={eventBtnStyle}>
                                Events
                                {
                                    newEventCounter > 0 &&
                                    <span class='badge badge-small badge-error notify-badge'>{newEventCounter}</span>
                                }
                            </div>
                        </Tab>
                        <Tab>
                            <div class="btn">Node</div>
                        </Tab>
                        <Tab>
                            <div class="btn btn-warning">Help</div>
                        </Tab>
                    </div>
                </TabList>

                <TabPanel>
                    <Contracts store={this.props.store} helpers={this.helpers} />
                </TabPanel>
                <TabPanel>
                    <StaticAnalysis store={this.props.store} helpers={this.helpers} />
                </TabPanel>
                <TabPanel>
                    <TxAnalyzer store={this.props.store} helpers={this.helpers} />
                </TabPanel>
                <TabPanel>
                    <Events store={this.props.store} helpers={this.helpers} />
                </TabPanel>
                <TabPanel>
                    <NodeControl store={this.props.store} helpers={this.helpers} />
                </TabPanel>
                <TabPanel>
                    <h2 class="text-warning">Help Etheratom to keep solidity development interactive.</h2>
                    <h4 class="text-success">Donate Ethereum: 0xd22fE4aEFed0A984B1165dc24095728EE7005a36</h4>
                    <p>
                        <span>Etheratom news </span><a href="https://twitter.com/hashtag/Etheratom">#Etheratom</a>
                    </p>
                    <p>
                        Contact: <a href="mailto:0mkar@protonmail.com" target="_top">0mkar@protonmail.com</a>
                    </p>
                </TabPanel>
            </Tabs>
        );
    }
}

const mapStateToProps = ({ contract, eventReducer }) => {
	const { compiled } = contract;
    const { pendingTransactions, events } = eventReducer;
	return { compiled, pendingTransactions, events };
}

export default connect(mapStateToProps, {})(TabView);
