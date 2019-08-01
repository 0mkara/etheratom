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
import ReactJson from 'react-json-view';
import { Collapse } from 'react-collapse';
import PropTypes from 'prop-types';

class EventItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
            toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
            toggleBtnTxt: 'Expand'
        };
        this._toggleCollapse = this._toggleCollapse.bind(this);
    }
    _toggleCollapse() {
        const { isOpened } = this.state;
        this.setState({ isOpened: !isOpened });
        if(!isOpened) {
            this.setState({
                toggleBtnStyle: 'btn btn-success icon icon-fold inline-block-tight',
                toggleBtnTxt: 'Collapse'
            });
        } else {
            this.setState({
                toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
                toggleBtnTxt: 'Expand'
            });
        }
    }
    render() {
        const { event } = this.props;
        const { isOpened, toggleBtnStyle, toggleBtnTxt } = this.state;
        return (
            <li className="event-list-item">
                <label className="label event-collapse-label">
                    <h4 className="padded text-warning">
                        {event.id} : {event.event}
                    </h4>
                    <button className={toggleBtnStyle} onClick={this._toggleCollapse}>
                        {toggleBtnTxt}
                    </button>
                </label>
                <Collapse isOpened={isOpened}>
                    <ReactJson
                        src={event}
                        theme="chalk"
                        displayDataTypes={false}
                        name={false}
                        collapseStringsAfterLength={64}
                        iconStyle="triangle"
                    />
                </Collapse>
            </li>
        );
    }
}

EventItem.propTypes = {
    event: PropTypes.object
};

export default EventItem;
