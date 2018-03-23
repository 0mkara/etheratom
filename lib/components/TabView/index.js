'use babel'
import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { connect } from 'react-redux'
import Contracts from '../Contracts'
import TxAnalyzer from '../TxAnalyzer'
import Events from '../Events'

class TabView extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            txBtnStyle: 'btn btn-primary',
            eventBtnStyle: 'btn btn-primary',
            newTxCounter: 0,
            newEventCounter: 0
        }
        this._handleTabSelect = this._handleTabSelect.bind(this);
    }
    _handleTabSelect(index) {
        if(index === 1) {
            this.setState({ newTxCounter: 0, txBtnStyle: 'btn btn-primary' });
        }
        if(index === 2) {
            this.setState({ newEventCounter: 0, eventBtnStyle: 'btn btn-primary' });
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
                            <div class="btn btn-primary">Contract</div>
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
                            <div class="btn btn-warning">Help</div>
                        </Tab>
                    </div>
                </TabList>

                <TabPanel>
                    <Contracts store={this.props.store} helpers={this.helpers} />
                </TabPanel>
                <TabPanel>
                    <TxAnalyzer store={this.props.store} helpers={this.helpers} />
                </TabPanel>
                <TabPanel>
                    <Events store={this.props.store} helpers={this.helpers} />
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
