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
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import RemixTests from 'remix-tests';
import VirtualList from 'react-tiny-virtual-list';
import ErrorView from '../ErrorView';
import { setErrors, resetErrors } from '../../actions';

Object.defineProperty(String.prototype, 'regexIndexOf', {
    value(regex, startpos) {
        const indexOf = this.substring(startpos || 0).search(regex);
        return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }
});

class RemixTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            testResults: [],
            running: false
        };
        this._runRemixTests = this._runRemixTests.bind(this);
        this._testCallback = this._testCallback.bind(this);
        this._finalCallback = this._finalCallback.bind(this);
        this._resultsCallback = this._resultsCallback.bind(this);
    }
    componentDidMount() {
        this.props.resetErrors();
    }
    componentDidUpdate(prevProps) {
        const { sources } = this.props;
        if(sources != prevProps.sources) {
            this._runRemixTests();
        }
    }
    _testCallback(result) {
        try {
            const { testResults } = this.state;
            const t = testResults.slice();
            t.push(result);
            this.setState({ testResults: t });
        } catch (e) {
            this.props.setErrors(e);
            e.forEach(err => {
                console.error(err);
            });
        }
    }
    _resultsCallback(err, result) {
        if(err) {
            this.props.setErrors(err);
            err.forEach(e => {
                console.error(e);
            });
        }
    }
    _finalCallback(err, result) {
        if(err) {
            this.props.setErrors(err);
            err.forEach(e => {
                console.error(e);
            });
        }
        this.setState({ testResult: result, running: false });
    }
    _importFileCb(err, result) {
        if(err) {
            this.props.setErrors(err);
            err.forEach(e => {
                console.error(e);
            });
        }
    }
    async _runRemixTests() {
        const { sources } = this.props;
        this.setState({ testResults: [], running: true });
        this.props.resetErrors();
        try {
            RemixTests.runTestSources(sources, this._testCallback, this._resultsCallback, this._finalCallback, this._importFileCb);
        } catch (e) {
            this.props.setErrors(e);
            e.forEach(err => {
                console.error(err);
            });
        }
    }
    async injectTests(source) {
        const s = /^(import)\s['"](remix_tests.sol|tests.sol)['"];/gm;
        if(source.content && source.content.regexIndexOf(s) < 0) {
            return source.content.replace(/(pragma solidity \^\d+\.\d+\.\d+;)/, '$1\nimport \'remix_tests.sol\';');
        }
    }
    render() {
        const { testResults, testResult, running } = this.state;
        return (
            <Provider store={this.props.store}>
                <div id="remix-tests">
                    <h3 className="block test-header">Test files should have [foo]_test.sol suffix</h3>
                    <div className="test-selector">
                        <button className="btn btn-primary inline-block-tight" onClick={this._runRemixTests}>
                            Run tests
                        </button>
                        {
                            running &&
                            <span className='loading loading-spinner-tiny inline-block'></span>
                        }
                        {
                            testResult &&
                            <div className="test-result">
                                <span className="text-error">Total failing: {testResult.totalFailing} </span>
                                <span className="text-success">Total passing: {testResult.totalPassing} </span>
                                <span className="text-info">Time: {testResult.totalTime}</span>
                            </div>
                        }
                    </div>
                    <VirtualList
                        height="50vh"
                        itemCount={testResults.length}
                        itemSize={30}
                        className="test-result-list-container"
                        overscanCount={10}
                        renderItem={({ index }) =>
                            <div key={index} className="test-result-list-item">
                                {
                                    testResults[index].type === 'contract' &&
                                    <span className="status-renamed icon icon-checklist"></span>
                                }
                                {
                                    testResults[index].type === 'testPass' &&
                                    <span className="status-added icon icon-check"></span>
                                }
                                {
                                    testResults[index].type === 'testFailure' &&
                                    <span className="status-removed icon icon-x"></span>
                                }
                                <span className="padded text-warning">
                                    {testResults[index].value}
                                </span>
                            </div>
                        }
                    />
                    <div id="test-error" className="error-container">
                        <ErrorView />
                    </div>
                </div>
            </Provider>
        );
    }
}

RemixTest.propTypes = {
    helpers: PropTypes.any.isRequired,
    sources: PropTypes.object,
    compiled: PropTypes.object,
    setErrors: PropTypes.func,
    resetErrors: PropTypes.func,
    store: PropTypes.any.isRequired
};

const mapStateToProps = ({ files }) => {
    const { sources } = files;
    return { sources };
};
export default connect(mapStateToProps, { setErrors, resetErrors })(RemixTest);
