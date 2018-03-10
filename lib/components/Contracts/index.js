'use babel'
import React from 'react'
import { connect } from 'react-redux'

class InputsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: []
        }
        this._handleChange = this._handleChange.bind(this);
    }
    _handleChange(event) {
        console.log("Will handle change");
        /*const param = { value: event.target.value, type: event.target.placeholder };
        this.setState({ params[event.target.id]: param });*/
    }
    render() {
        const { contractName, abi } = this.props;
        return (
            <div id={contractName + '_inputs'}>
                {
                    abi.type === "constructor" &&
                    abi.inputs.map((input, i) => {
                        return (
                            <form key={i}>
                                <button class="input text-subtle">{ input.name }</button>
                                <input id={i} type="text" class="inputs" placeholder={input.type} onChange={this._handleChange}></input>
                            </form>
                        );
                    })
                }
            </div>
        );
    }
};
class GasInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gas: props.gas
        };
    }
    componentWillReceiveProps(nextProps) {
        const { gas } = nextProps;
        this.setState({ gas });
    }
    render() {
        const { contractName } = this.props;
        return (
            <form class="gas-estimate-form">
                <button class="input text-subtle">Gas</button>
                <input
                    id={contractName + '_gas'}
                    type="number"
                    class="inputs"
                    value={this.state.gas}
                    onChange={this.props.onChange}>
                </input>
            </form>
        );
    }
};
class CreateButton extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            constructorParams: undefined
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
            const { abi, bytecode, contractName, gas } = this.props;
            const { constructorParams } = this.state;

            const contract = await that.helpers.create(that.coinbase, that.password, abi, bytecode, params, contractName, gas);
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
class CompiledContract extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            estimatedGas: 4700000
        }
        this._handleGasChange = this._handleGasChange.bind(this);
    }
    async componentDidMount() {
        const { bytecode } = this.props;
        //const gas = await this.helpers.getGasEstimate(that.coinbase, bytecode);
        //this.setState({ estimatedGas: gas });
    }
    _handleGasChange(event) {
        this.setState({ estimatedGas: event.target.value });
    }
    render() {
        const { contractName, bytecode, ContractABI, index } = this.props;
        const { estimatedGas } = this.state;
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
                        return <InputsForm contractName={contractName} abi={abi} />
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
                <div id="compiled-code" class="compiled-code">
                    {
                        Object.keys(compiled.contracts).map((contractName, index) => {
                            const bytecode = compiled.contracts[contractName].bytecode;
                            const ContractABI = JSON.parse(compiled.contracts[contractName]["interface"]);
                            return (
                                <div id={contractName} class="contract-container">
                                    <CompiledContract
                                        contractName={contractName}
                                        bytecode={bytecode}
                                        ContractABI={ContractABI}
                                        index={index}
                                        helpers={this.helpers}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
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

export default connect(mapStateToProps, {})(Contracts);
