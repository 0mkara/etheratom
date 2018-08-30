'use babel'
// Copyright 2018 Etheratom Authors
// This file is part of Etheratom.

// Etheratom is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Etheratom is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Etheratom.  If not, see <http://www.gnu.org/licenses/>.
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

GasInput.propTypes = {
    contractName: PropTypes.string,
    interfaces: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    gasLimit: PropTypes.number,
    gas: PropTypes.number
};

const mapStateToProps = ({ contract }) => {
    const { compiled, gasLimit } = contract;
    return { compiled, gasLimit };
};

export default connect(mapStateToProps, {})(GasInput);
