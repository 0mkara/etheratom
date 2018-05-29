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
class ClientSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedEnv: atom.config.get('etheratom.executionEnv')
        }
        this._handleChange = this._handleChange.bind(this);
    }
    async _handleChange(event) {
        atom.config.set('etheratom.executionEnv', event.target.value);
        this.setState({ selectedEnv: event.target.value });
    }
    render() {
        const { clients } = this.props;
        return (
            <div class="client-select">
                <form class="row">
                    <span class="icon icon-plug"></span>
                    <div class="clients">
                        {
                            clients.map((client) => {
                                return (
                                    <div class="client-input">
                                        <input
                                            type="radio" class="input-radio"
                                            value={client.provider}
                                            onChange={this._handleChange}
                                            checked={this.state.selectedEnv === client.provider}
                                        />
                                        <label class="input-label inline-block highlight">
                                            <span>{client.desc}</span>
                                        </label>
                                    </div>
                                );
                            })
                        }
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = ({ clientReducer }) => {
    const { clients } = clientReducer;
    return { clients };
};

export default connect(mapStateToProps, {})(ClientSelector);
