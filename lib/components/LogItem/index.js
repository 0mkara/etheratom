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
import ReactJson from 'react-json-view'

class LogItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { log } = this.props;
        return (
            <div class="log-list-item">
                <h4 class="padded text-warning">
                    {log.id}
                </h4>
                <ReactJson
                    src={log}
                    theme="solarized"
                    displayDataTypes={false}
                    name={false}
                    collapsed={true}
                />
            </div>
        );
    }
}

export default LogItem;
