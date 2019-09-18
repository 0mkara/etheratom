'use babel';
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
import ScaleLoader from 'react-spinners/ScaleLoader';

const loaderContainerStyle = {
    textAlign: 'center',
    justifyContent: 'center'
};

class LoaderView extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
    }
    stateChange() {
    }
    componentDidUpdate() {

    }
    componentWillReceiveProps() {

    }
    render() {
        const { clients } = this.props;
        const { hasConnection } = clients[0];

        // alert(hasConnection);

        return (
            <div className="loader" style={loaderContainerStyle}>
                <ScaleLoader
                    sizeUnit={'px'}
                    size={50}
                    color={'#636973'}
                    loading={!hasConnection}
                />
            </div>
        );
    }
}

LoaderView.propTypes = {
    clients: PropTypes.any.isRequired,
    store: PropTypes.any,
};

const mapStateToProps = ({ clientReducer }) => {
    const { clients } = clientReducer;
    return { clients };
};
export default connect(mapStateToProps)(LoaderView);
