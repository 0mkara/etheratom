'use babel'
import React from 'react'
import { connect } from 'react-redux'

class InputsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: props.params
        }
    }
    render() {
        const { params } = this.state;
        return (
            <div id={contractName + '_inputs'}>
                {
                    constructorParams.map((input, i) => {
                        return(
                            <form key={i}>
                                <button class='input text-subtle'>{input.name}</button>
                                <input id={input.name} type="text" class="inputs" placeholder={input.type} value={params[input.name]} readonly></input>
                            </form>
                        );
                    })
                }
            </div>
        );
    }
};
class FunctionABI extends React.Component {
    constructor() {
        super();
        this.state = {
            childFunctions: []
        };
        this._handleChange = this._handleChange.bind(this);
    }
    async componentDidMount() {
        try {
            const childFunctions = await self.helpers.constructFunctions(abiDef);
            this.setState({ childFunctions: childFunctions });
        } catch (e) {
            self.helpers.showPanelError(e);
        }
    }
    _handleChange(interfaceName, type, event) {
        const value = event.target.value;
        let params = { ...this.state.params }
        params[interfaceName] = { type, value }
        this.setState({ params });
    }
    async _handleSubmit(methodItem) {
        console.log("%c Submit handle... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        // call functions here
        try {
            let params = [];
            if(this.state.params && this.state.params[methodItem.name]) {
                params = await self.helpers.inputsToArray(this.state.params[methodItem.name]);
            }
            const result = await self.helpers.call(self.coinbase, self.password, contract, methodItem, params);
            const outputTypes = await self.helpers.getOutputTypes(methodItem);
            self.helpers.showOutput(contract.options.address, outputTypes, result);
        } catch (e) {
            self.helpers.showPanelError(e);
        }
    }
    render() {
        return React.createElement('div', {
            htmlFor: 'contractFunctions'
        }, this.state.childFunctions.map((childFunction, i) => {
            return React.createElement('form', {
                onSubmit: this._handleSubmit.bind(this, childFunction.interface),
                key: i,
                ref: childFunction.interface.name
            }, React.createElement('input', {
                type: 'submit',
                value: childFunction.interface.name,
                className: 'text-subtle call-button'
            }), childFunction.params.map((childInput, j) => {
                return React.createElement('input', {
                    name: childInput[0],
                    type: 'text',
                    onChange: (event) => this._handleChange(childFunction.interface.name, childInput[0], event),
                    placeholder: childInput[0] + ' ' + childInput[1],
                    className: 'call-button-values'
                });
            }));
        }));
    }
};

class ExecutionContent extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
    }
    render() {
        return (
            const { contractName, bytecode, ContractABI, index } = this.props;
            <div class="contract-content" key={index}>
                <span class="contract-name inline-block highlight-success">{contractName}</span>
                <div class="byte-code">
                    <pre class="large-code">{ JSON.stringify(bytecode) }</pre>
                </div>
                <div class="abi-definition">
                    <pre class="large-code">{ JSON.stringify(abiDef) }</pre>
                </div>
                <div id={contractName + '_txHash'}>
                    {
                        contract.transactionHash &&
                        <div>
                            <span class="inline-block highlight">Transaction hash:</span>
                            <pre class="large-code">{contract.transactionHash}</pre>
                        </div>
                    }
                </div>
                <div id={contractName + '_stat'}>
                    {
                        !contract.options.address &&
                        <div>
                            <span class="stat-mining stat-mining-align">waiting to be mined</span>
                            <span class="loading loading-spinner-tiny inline-block stat-mining-align"></span>
                        </div>
                    }
                    {
                        contract.options.address &&
                        <div>
                            <span class="inline-block highlight">
                                <pre class="large-code">{contract.options.address}</pre>
                            </span>
                        </div>
                    }
                </div>
                <InputsForm />
                <FunctionABI />
            </div>
        );
    }
};

const mapStateToProps = ({ contract }) => {
	const { compiled } = contract;
	return { compiled };
}

export default connect(mapStateToProps, {})(ExecutionContent);
