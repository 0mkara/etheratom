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
import { CodeAnalysis } from 'remix-analyzer';
import CheckboxTree from 'react-checkbox-tree';
import PropTypes from 'prop-types';

class StaticAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.anlsRunner = new CodeAnalysis();
        this.state = {
            anlsModules: this.anlsRunner.modules(),
            nodes: this._getNodes(this.anlsRunner.modules()),
            checked: [],
            analysis: [],
            running: false
        };
        this._runAnalysis = this._runAnalysis.bind(this);
    }
    componentDidMount() {
        // Mark all modules checked in the begining
        const { nodes } = this.state;
        const checked = [];
        for (let i = 0; i < nodes.length; i++) {
            checked.push(i);
        }
        this.setState({ checked });
    }
    _getNodes(modules) {
        return modules.map((module, i) => {
            return Object.assign({}, {}, { value: i, label: module.description, index: i });
        });
    }
    async _runAnalysis() {
        const { checked } = this.state;
        const { compiled } = this.props;
        this.setState({ analysis: [], running: true });
        if (compiled != null) {
            try {
                const analysis = await this.getAnalysis(compiled, checked);
                this.setState({ analysis, running: false });
            } catch (e) {
                this.setState({ running: false });
                throw e;
            }
        } else {
            this.setState({ running: false });
            this.helpers.showPanelError('Compile the code first then, analyse it.');
        }
    }
    async getAnalysis(compiled, checked) {
        return new Promise((resolve, reject) => {
            this.anlsRunner.run(compiled, checked, (analysis, error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(analysis);
            });
        });
    }
    render() {
        const { nodes, analysis, running } = this.state;
        return (
            <div className="static-analyzer">
                <CheckboxTree
                    nodes={nodes}
                    checked={this.state.checked}
                    expanded={this.state.expanded}
                    onCheck={checked => this.setState({ checked })}
                    showNodeIcon={false}
                />
                <button className="btn btn-primary inline-block-tight" onClick={this._runAnalysis}>
                    Run analysis
                </button>
                {
                    running &&
                    <span className='loading loading-spinner-tiny inline-block'></span>
                }
                {
                    analysis.length > 0 &&
                    analysis.map((a, j) => {
                        if (a.report.length > 0) {
                            return (
                                <div className="padded" key={j}>
                                    {
                                        a.report.map((report, i) => {
                                            return (
                                                <div key={i}>
                                                    {
                                                        report.location &&
                                                        <span className="text-info">
                                                            {report.location}{' '}
                                                        </span>
                                                    }
                                                    {
                                                        report.warning &&
                                                        <span className="text-warning" dangerouslySetInnerHTML={{ __html: report.warning }} />
                                                    }
                                                    {
                                                        report.more &&
                                                        <p>
                                                            <a className="text-info" href={report.more}>
                                                                {report.more}
                                                            </a>
                                                        </p>
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        }
                        return;
                    })
                }
            </div>
        );
    }
}

StaticAnalysis.propTypes = {
    helpers: PropTypes.any.isRequired,
    compiled: PropTypes.object,
};

const mapStateToProps = ({ contract }) => {
    const { compiled } = contract;
    return { compiled };
};

export default connect(mapStateToProps, {})(StaticAnalysis);
