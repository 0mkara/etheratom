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

class VersionSelector extends React.Component {
    constructor(props) {
        super(props);
        this._handleVersionSelector = this._handleVersionSelector.bind(this);
    }
    async _handleVersionSelector() {
        
    }
    render() {
        const { selectedVersion } = this.props;
        return (
            <p>VersionSelector</p>
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
