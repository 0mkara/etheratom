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

const mapStateToProps = ({ contract }) => {
	const { compiled } = contract;
	return { compiled };
}

export default connect(mapStateToProps, {})(GasInput);
