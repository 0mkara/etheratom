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
import RemixTests from 'remix-tests';
import VirtualList from 'react-tiny-virtual-list';

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
    }
    _testCallback(result) {
        try {
            const { testResults } = this.state;
            const t = testResults.slice();
            t.push(result);
            this.setState({ testResults: t });
        } catch (e) {
            throw e;
        }
    }
    _resultsCallback(result) {
        console.log(result);
    }
    _finalCallback(err, result) {
        if(err) {
            throw err;
        }
        this.setState({ testResult: result, running: false });
    }
    _importFileCb(err, result) {
        console.log(err);
        console.log(result);
    }
    async _runRemixTests() {
        const { sources } = this.props;
        this.setState({ testResults: [], running: true });
        const promises = [];
        for(let filename in sources) {
            if(filename === 'remix_tests.sol') {
                continue;
            }
            sources[filename].content = await this.injectTests(sources[filename]);
            promises.push(filename);
        }
        Promise.all(promises)
            .then(testSources => {
                console.log(sources);
                RemixTests.runTestSources(sources, this._testCallback, this._resultsCallback, this._finalCallback, this._importFileCb);
            })
            .catch(e => {
                console.log(e);
            });
    }
    async injectTests(source) {
        return source.content.replace(/(pragma solidity \^\d+\.\d+\.\d+;)/, '$1\nimport \'remix_tests.sol\';');
    }
    render() {
        const { testResults, testResult, running } = this.state;
        return (
            <div id="remix-tests">
                <h2 className="block test-header">Naming conventions</h2>
                <h3 className="block test-header">File names should end with _test, as in foo_test.sol</h3>
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
                    height="100vh"
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
            </div>
        );
    }
}
RemixTest.propTypes = {
    helpers: PropTypes.any.isRequired,
    sources: PropTypes.object,
    compiled: PropTypes.object
};
const mapStateToProps = ({ contract }) => {
    const { sources } = contract;
    return { sources };
};
export default connect(mapStateToProps, {})(RemixTest);
