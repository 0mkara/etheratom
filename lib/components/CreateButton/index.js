'use babel'
import React from 'react'
import { connect } from 'react-redux'

class CreateButton extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            constructorParams: undefined,
            coinbase: props.coinbase,
            password: props.password
        }
        this._handleSubmit = this._handleSubmit.bind(this);
    }
    async componentDidMount() {
        const { abi } = this.props;
        inputs = [];
        for (abiObj in abi) {
            if (abi[abiObj].type === "constructor" && abi[abiObj].inputs.length > 0) {
                inputs = abi[abiObj].inputs;
            }
        }
        this.setState({ constructorParams: inputs });
    }
    async _handleSubmit() {
        console.log("%c Submit handle... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        try {
            const { abi, bytecode, contractName, gas, coinbase, password } = this.props;
            const { constructorParams } = this.state;

            const contract = await that.helpers.create(coinbase, password, abi, bytecode, params, contractName, gas);
            that.setExecutionView(contractName, abi, bytecode, constructorParams, params, contract);
            const contractInstance = await that.helpers.deploy(contract, params);
            contractInstance.on('address', address => {
                contract.options.address = address;
                that.setExecutionView(contractName, abi, bytecode, constructorParams, params, contract);
            });
            contractInstance.on('transactionHash', transactionHash => {
                contract.transactionHash = transactionHash;
                that.setExecutionView(contractName, abi, bytecode, constructorParams, params, contract);
            });
            contractInstance.on('error', error => {
                that.helpers.showPanelError(error);
            });
        } catch(e) {
            that.helpers.showPanelError(e);
        }
    }
    render() {
        const { contractName } = this.props;
        return (
            <form onSubmit={this._handleSubmit}>
                <input
                    type="submit"
                    value="Create"
                    ref={contractName}
                    class="btn btn-primary inline-block-tight">
                </input>
            </form>
        );
    }
};

const mapStateToProps = ({ contract, account }) => {
	const { compiled } = contract;
    const { coinbase, password } = account;
	return { compiled, coinbase, password };
}

export default connect(mapStateToProps, {})(CreateButton);
