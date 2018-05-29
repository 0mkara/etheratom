'use babel'
import React from 'react'
import { connect } from 'react-redux'

class GasInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gas: props.gas
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { gas } = nextProps;
        this.setState({ gas });
    }
    render() {
        const { gasLimit } = this.props;
        const { contractName } = this.props;
        return (
        <form className="gas-estimate-form">
            <button className="input text-subtle">Gas supply</button>
            <input
                id={contractName + '_gas'}
                type="number"
                className="inputs"
                value={this.state.gas}
                onChange={this.props.onChange}>
            </input>
            <button className="btn btn-primary">Gas Limit : {gasLimit}</button>
        </form>
        );
    }
}

const mapStateToProps = ({ contract }) => {
	const { compiled, gasLimit } = contract;
	return { compiled, gasLimit };
};

export default connect(mapStateToProps, {})(GasInput);
