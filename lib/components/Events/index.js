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
import EventItem from '../EventItem';
import PropTypes from 'prop-types';

class Events extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
    }
    render() {
        const { events } = this.props;
        const events_ = events.slice();
        events_.reverse();
        return (
            <div className="events-container select-list">
                <ul className="list-group">
                    {
                        events_.length > 0 &&
                        events_.map((event, i) => {
                            return (
                                <EventItem key={i} event={event} />
                            );
                        })
                    }
                    {
                        !(events_.length > 0) &&
                        <h2 className="text-warning no-header">No events found!</h2>
                    }
                </ul>
            </div>
        );
    }
}

Events.propTypes = {
    helpers: PropTypes.any.isRequired,
    events: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = ({ eventReducer }) => {
    const { events } = eventReducer;
    return { events };
};

export default connect(mapStateToProps, {})(Events);
