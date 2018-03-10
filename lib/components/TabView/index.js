'use babel'
import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import ReactJson from 'react-json-view'
import { connect } from 'react-redux'
import Contracts from '../Contracts'

class TabView extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            txHash: undefined,
            txAnalysis: undefined
        }
        this._handleTxHashChange = this._handleTxHashChange.bind(this);
        this._handleTxHashSubmit = this._handleTxHashSubmit.bind(this);
    }
    _handleTxHashChange(event) {
        this.setState({ txHash: event.target.value });
    }
    async _handleTxHashSubmit() {
        const { txHash } = this.state;
        try {
            const txAnalysis = await this.helpers.getTxAnalysis(txHash);
            this.setState({ txAnalysis });
        } catch (e) {
            console.log(e);
        }
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
                    </div>
                </TabList>

                <TabPanel>
                    <Contracts store={this.props.store} helpers={this.helpers} />
                </TabPanel>
                <TabPanel>
                    <div class="block">
                        <form onSubmit={this._handleTxHashSubmit}>
                            <div class="inline-block">
                                <input type="text" name="txhash" value={this.state.txHash} onChange={this._handleTxHashChange} placeholder="Transaction hash" class="input-search" />
                            </div>
                            <div class="inline-block">
                                <input type="submit" value="Analyze" class="btn btn-success" />
                            </div>
                        </form>
                    </div>
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
