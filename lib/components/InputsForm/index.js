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
import { setParamsInput } from '../../actions';
import PropTypes from 'prop-types';

class InputsForm extends React.Component {
    constructor(props) {
        super(props);
        this._handleChange = this._handleChange.bind(this);
    }
    _handleChange(input, event) {
        input.value = event.target.value;
    }
    render() {
        const { contractName, abi } = this.props;
        return (
            <div id={contractName + '_inputs'}>
                {
                    abi.type === 'constructor' &&
                    abi.inputs.map((input, i) => {
                        return (
                            <form key={i} onSubmit={this.props.onSubmit}>
                                <button className="input text-subtle">{ input.name }</button>
                                <input
                                    id={i} type="text" className="inputs" placeholder={input.type}
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
}

InputsForm.propTypes = {
    onSubmit: PropTypes.func,
    contractName: PropTypes.string,
    abi: PropTypes.object
};

const mapStateToProps = ({ contract }) => {
    const { compiled } = contract;
    return { compiled };
};

export default connect(mapStateToProps, { setParamsInput })(InputsForm);
