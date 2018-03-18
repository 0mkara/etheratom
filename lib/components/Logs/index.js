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
import VirtualList from 'react-tiny-virtual-list'
import LogItem from '../LogItem'

class Logs extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
    }
    render() {
        const { logs } = this.props;
        const logs_ = logs.slice();
        logs_.reverse();
        return (
            <div class="logs-container">
                {
                    logs_.length > 0 &&
                    <VirtualList
                        height={300}
                        itemCount={logs_.length}
                        itemSize={50}
                        class="tx-list-container"
                        renderItem={({ index }) => <LogItem log={logs_[index]} />}
                    />
                }
            </div>
        );
    }
}
const mapStateToProps = ({ events }) => {
	const { logs } = events;
	return { logs };
}

export default connect(mapStateToProps, {})(Logs);
