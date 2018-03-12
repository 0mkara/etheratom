'use babel'
import React from 'react'
import { connect } from 'react-redux'
import GasInput from '../GasInput'
import InputsForm from '../InputsForm'
import { addInterface } from '../../actions'

class ContractCompiled extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            estimatedGas: 4700000,
            ContractABI: props.interfaces[props.contractName].abi
        }
        this._handleGasChange = this._handleGasChange.bind(this);
        this._handleInput = this._handleInput.bind(this);
    }
    async componentDidMount() {
        const { bytecode } = this.props;
        //const gas = await this.helpers.getGasEstimate(that.coinbase, bytecode);
        //this.setState({ estimatedGas: gas });
    }
    _handleGasChange(event) {
        this.setState({ estimatedGas: event.target.value });
    }
    _handleInput() {
        const { contractName } = this.props;
        const { ContractABI } = this.state;
        this.props.addInterface({ contractName, ContractABI });
    }
    render() {
        const { contractName, bytecode, index } = this.props;
        const { estimatedGas, ContractABI } = this.state;
        return (
            <div class="contract-content" key={index}>
                <span class="contract-name inline-block highlight-success">{ contractName }</span>
                <div class="byte-code">
                    <pre class="large-code">{ JSON.stringify(bytecode) }</pre>
                </div>
                <div class="abi-definition">
                    <pre class="large-code">{ JSON.stringify(ContractABI) }</pre>
                </div>
                {
                    ContractABI.map((abi) => {
                        return <InputsForm contractName={contractName} abi={abi} onSubmit={this._handleInput}/>
                    })
                }
                <GasInput contractName={contractName} gas={estimatedGas} onChange={this._handleGasChange} />
                {/*
                    <CreateButton
                        contractName={contractName}
                        bytecode={bytecode}
                        abi={ContractABI}
                        gas={estimatedGas}
                        helpers={this.helpers}
                    />
                */}
            </div>
        );
    }
};

const mapStateToProps = ({ contract }) => {
	const { compiled, interfaces } = contract;
	return { compiled, interfaces };
}

export default connect(mapStateToProps, { addInterface })(ContractCompiled);
