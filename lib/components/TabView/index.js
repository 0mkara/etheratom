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
    }
    render() {
        return (
            <Tabs>
                <TabList>
                    <div class="tab_btns">
                        <Tab>
                            <div class="btn copy-btn btn-primary">Contract</div>
                        </Tab>
                        <Tab>
                            <div class="btn copy-btn btn-primary">Transaction analyzer</div>
                        </Tab>
                        <Tab>
                            <div class="btn copy-btn btn-primary">Events</div>
                        </Tab>
                        <Tab>
                            <div class="btn copy-btn btn-success">Donate</div>
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
                    <h2 class="text-warning">Donate & help Etheratom to keep solidity development interactive.</h2>
                    <h4 class="text-success">Ethereum: 0xd22fE4aEFed0A984B1165dc24095728EE7005a36</h4>
                    <p>
                        <span>Etheratom news </span><a href="https://twitter.com/hashtag/Etheratom">#Etheratom</a>
                    </p>
                    <p>
                        <a href="mailto:0mkar@protonmail.com" target="_top">0mkar@protonmail.com</a>
                    </p>
                </TabPanel>
            </Tabs>
        );
    }
}

const mapStateToProps = ({ contract }) => {
	const { compiled } = contract;
	return { compiled };
}

export default connect(mapStateToProps, {})(TabView);
