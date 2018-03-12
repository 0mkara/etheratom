'use babel'
import React from 'react'
import { connect, Provider } from 'react-redux'
import ContractCompiled from '../ContractCompiled'
import { addInterface } from '../../actions'

class Contracts extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            compiled: props.compiled
        }
    }
    render() {
        const { compiled } = this.state;
        if(compiled) {
            return (
                <Provider store={this.props.store}>
                    <div id="compiled-code" class="compiled-code">
                        {
                            Object.keys(compiled.contracts).map((contractName, index) => {
                                const bytecode = compiled.contracts[contractName].bytecode;
                                const ContractABI = JSON.parse(compiled.contracts[contractName]["interface"]);
                                // Add interface to redux
                                this.props.addInterface({ contractName, ContractABI });

                                return (
                                    // If not execution view show contracts else show execution
                                    <div id={contractName} class="contract-container">
                                        <ContractCompiled
                                            contractName={contractName}
                                            bytecode={bytecode}
                                            index={index}
                                            helpers={this.helpers}
                                        />
                                        {/*
                                            executionView &&
                                            <ContractExecution
                                                contractName={contractName}
                                                bytecode={bytecode}
                                                ContractABI={ContractABI}
                                                index={index}
                                                helpers={this.helpers}
                                            />
                                        */}
                                    </div>
                                )
                            })
                        }
                    </div>
                </Provider>
            );
        }
        return (
            <div id="compiled-code" class="compiled-code"></div>
        );
    }
}

const mapStateToProps = ({ contract }) => {
	const { compiled } = contract;
	return { compiled };
}

export default connect(mapStateToProps, { addInterface })(Contracts);
