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
import { Collapse } from 'react-collapse'
import ReactJson from 'react-json-view'
import VirtualList from 'react-tiny-virtual-list'
import { CodeAnalysis } from 'remix-solidity'
import CheckboxTree from 'react-checkbox-tree'

class StaticAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.anlsRunner = new CodeAnalysis();
        this.state = {
            anlsModules: this.anlsRunner.modules(),
            nodes: this._getNodes(this.anlsRunner.modules()),
            checked: [],
            analysis: []
        }
        this._runAnalysis = this._runAnalysis.bind(this);
    }
    componentDidMount() {
        // Mark all modules checked in the begining
        const { nodes } = this.state;
        const checked = [];
        for(let i = 0; i < nodes.length; i++) {
            checked.push(i);
        }
        this.setState({ checked });
    }
    _getNodes(modules) {
        return modules.map((module, i) => {
            return Object.assign({}, {}, { value: i, label: module.description, index: i });
        })
    }
    async _runAnalysis() {
        const { checked } = this.state;
        const { compiled } = this.props;
        if(compiled != null) {
            try {
                const analysis = await this.getAnalysis(compiled, checked);
                console.log(analysis);
                analysis.map(a => {
                    a.report.map(item => {
                        this.setState({ analysis: [...this.state.analysis, item.warning] });
                    })
                })
                console.log(this.state.analysis);
            } catch (e) {
                throw e;
            }
        }
    }
    async getAnalysis(compiled, checked) {
        return new Promise((resolve, reject) => {
            this.anlsRunner.run(compiled, checked, (analysis, error) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(analysis);
            })
        })
    }
    render() {
        const { nodes, checked, analysis } = this.state;
        console.log(nodes);
        console.log(checked);
        return (
            <div class="static-analyzer">
                <CheckboxTree
                    nodes={nodes}
                    checked={this.state.checked}
                    expanded={this.state.expanded}
                    onCheck={checked => this.setState({ checked })}
                    showNodeIcon={false}
                />
                <button class="btn btn-primary inline-block-tight" onClick={this._runAnalysis}>
                    Run analysis
                </button>
                {
                    analysis.length > 0 &&
                    analysis.map(report => {
                        return (
                            <div class="text-warning">
                                {report}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
const mapStateToProps = ({ contract }) => {
    const { compiled } = contract;
	return { compiled };
}

export default connect(mapStateToProps, {})(StaticAnalysis);
