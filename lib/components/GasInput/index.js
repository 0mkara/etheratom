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
    componentWillReceiveProps(nextProps) {
        const { gas } = nextProps;
        this.setState({ gas });
    }
    render() {
        const { gasLimit } = this.props;
        const { contractName } = this.props;
        return (
            <form class="gas-estimate-form">
                <button class="input text-subtle">Gas supply</button>
                <input
                    id={contractName + '_gas'}
                    type="number"
                    class="inputs"
                    value={this.state.gas}
                    onChange={this.props.onChange}>
                </input>
                <button class="btn btn-primary">Gas Limit : {gasLimit}</button>
            </form>
        );
    }
};

const mapStateToProps = ({ contract }) => {
	const { compiled, gasLimit } = contract;
	return { compiled, gasLimit };
}

export default connect(mapStateToProps, {})(GasInput);
