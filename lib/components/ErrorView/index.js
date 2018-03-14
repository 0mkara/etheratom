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
import React from 'react'
import { connect } from 'react-redux'

class ErrorView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { errormsg } = this.props;
        return (
            <ul class="error-list error-messages block">
                {
                    errormsg.length > 0 &&
                    errormsg.map(msg => {
                        return (
                            <li class="list-item">
                                <span class="icon icon-alert">{msg}</span>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}
const mapStateToProps = ({ errors }) => {
	const { errormsg } = errors;
	return { errormsg };
}

export default connect(mapStateToProps, {})(ErrorView);
