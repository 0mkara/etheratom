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
import { Collapse } from 'react-collapse';
import ContractCompiled from '../ContractCompiled';
import ContractExecution from '../ContractExecution';
import ErrorView from '../ErrorView';
import { addInterface } from '../../actions';
import PropTypes from 'prop-types';

class CollapsedFile extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
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
        const { isOpened, toggleBtnStyle, toggleBtnTxt } = this.state;
        const { fileName, compiled, deployed, compiling, interfaces } = this.props;
        return (
            <div>
                <label className="label file-collapse-label">
                    <h4 className="text-success">{fileName}</h4>
                    <button className={toggleBtnStyle} onClick={this._toggleCollapse}>
                        {toggleBtnTxt}
                    </button>
                </label>
                <Collapse isOpened={isOpened}>
                    {
                        Object.keys(compiled.contracts[fileName]).map((contractName, index) => {
                            const bytecode = compiled.contracts[fileName][contractName].evm.bytecode.object;
                            return (
                                <div id={contractName} className="contract-container" key={index}>
                                    {
                                        !deployed[contractName] && interfaces !== null && interfaces[contractName] && compiling === false &&
                                        <ContractCompiled
                                            contractName={contractName}
                                            bytecode={bytecode}
                                            index={index}
                                            helpers={this.helpers}
                                        />
                                    }
                                    {
                                        deployed[contractName] &&
                                        <ContractExecution
                                            contractName={contractName}
                                            bytecode={bytecode}
                                            index={index}
                                            helpers={this.helpers}
                                        />
                                    }
                                </div>
                            );
                        })
                    }
                </Collapse>
            </div>
        );
    }
}

class Contracts extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
    }
    render() {
        const { compiled, deployed, compiling, interfaces } = this.props;
        return (
            <Provider store={this.props.store}>
                <div id="compiled-code" className="compiled-code">
                    {
                        compiled &&
                        Object.keys(compiled.contracts).map((fileName, index) => {
                            return (
                                <CollapsedFile
                                    fileName={fileName}
                                    compiled={compiled}
                                    deployed={deployed}
                                    compiling={compiling}
                                    interfaces={interfaces}
                                    helpers={this.helpers}
                                    key={index}
                                />
                            );
                        })
                    }
                    {
                        !compiled &&
                        <h2 className="text-warning no-header">No compiled contract!</h2>
                    }
                    <div id="compiled-error" className="error-container">
                        <ErrorView />
                    </div>
                </div>
            </Provider>
        );
    }
}

CollapsedFile.propTypes = {
    helpers: PropTypes.any.isRequired,
    contractName: PropTypes.string,
    bytecode: PropTypes.string,
    index: PropTypes.number,
    instances: PropTypes.any,
    interfaces: PropTypes.object,
    fileName: PropTypes.string,
    compiled: PropTypes.object,
    deployed: PropTypes.any,
    compiling: PropTypes.bool,
};

Contracts.propTypes = {
    helpers: PropTypes.any.isRequired,
    store: PropTypes.any.isRequired,
    compiled: PropTypes.object,
    deployed: PropTypes.any,
    compiling: PropTypes.bool,
    interfaces: PropTypes.object,
};

const mapStateToProps = ({ contract }) => {
    const { compiled, deployed, compiling, interfaces } = contract;
    return { compiled, deployed, compiling, interfaces };
};

export default connect(mapStateToProps, { addInterface })(Contracts);
