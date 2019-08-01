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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class VersionSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            availableVersions: [],
            selectedVersion: '',
        };
        this._handleVersionSelector = this._handleVersionSelector.bind(this);
    }
    async _handleVersionSelector(event) {
        const selectedVersion = event.target.value;
        await this.setState({ selectedVersion });
        atom.config.set('etheratom.versionSelector', selectedVersion);
    }
    async componentDidMount() {
        this.fetchVersionList();
    }

    async fetchVersionList() {
        const versions = await axios.get('https://ethereum.github.io/solc-bin/bin/list.json');
        this.setState({
            availableVersions: versions.data.releases,
            selectedVersion: atom.config.get('etheratom.versionSelector'),
        });
    }
    render() {
        const { availableVersions } = this.state;
        return (
            <div className="content">
                <div className="row">
                    <select onChange={this._handleVersionSelector} value={this.state.selectedVersion}>
                        {
                            Object.keys(availableVersions).map((key, i) => {
                                return (
                                    <option key={i} value={availableVersions[key].split('soljson-')[1].split('.js')[0]}>{availableVersions[key]}</option>
                                );
                            })
                        }
                    </select>
                </div>
            </div>
        );
    }
}

VersionSelector.propTypes = {
    selectedVersion: PropTypes.string
};

const mapStateToProps = ({ contract }) => {
    const { selectedVersion } = contract;
    return { selectedVersion };
};

export default connect(mapStateToProps, {})(VersionSelector);
