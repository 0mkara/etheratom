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

class ErrorView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { errormsg } = this.props;
        return (
            <ul className="error-list block">
                {
                    errormsg.length > 0 &&
                    errormsg.map((msg, i) => {
                        return (
                            <li key={i} className="list-item">
                                {
                                    msg.severity === 'warning' &&
                                    <span className="icon icon-alert text-warning">{msg.formattedMessage || msg.message}</span>
                                }
                                {
                                    msg.severity === 'error' &&
                                    <span className="icon icon-bug text-error">{msg.formattedMessage || msg.message}</span>
                                }
                                {
                                    !msg.severity &&
                                    <span className="icon icon-bug text-error">{msg.message}</span>
                                }
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}

ErrorView.propTypes = {
    errormsg: PropTypes.any
};

const mapStateToProps = ({ errors }) => {
    const { errormsg } = errors;
    return { errormsg };
};

export default connect(mapStateToProps, {})(ErrorView);
