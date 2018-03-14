'use babel'
import React from 'react'
import { connect } from 'react-redux'
import { setParamsInput } from '../../actions'

class InputsForm extends React.Component {
    constructor(props) {
        super(props);
        this._handleChange = this._handleChange.bind(this);
    }
    _handleChange(input, event) {
        const { contractName, abi } = this.props;
        input.value = event.target.value;
    }
    render() {
        const { contractName, abi } = this.props;
        return (
            <div id={contractName + '_inputs'}>
                {
                    abi.type === "constructor" &&
                    abi.inputs.map((input, i) => {
                        return (
                            <form key={i} onSubmit={this.props.onSubmit}>
                                <button class="input text-subtle">{ input.name }</button>
                                <input
                                    id={i} type="text" class="inputs" placeholder={input.type}
                                    value={input.value}
                                    onChange={(e) => this._handleChange(input, e)}
                                />
                            </form>
                        );
                    })
                }
            </div>
        );
    }
};

const mapStateToProps = ({ contract }) => {
	const { compiled } = contract;
	return { compiled };
}

export default connect(mapStateToProps, { setParamsInput })(InputsForm);
