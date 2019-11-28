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
import PropTypes from 'prop-types';
import { setErrors, addInterface } from '../../actions';

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
        this._clearContract = this._clearContract.bind(this);
    }
    _toggleCollapse() {
        const { isOpened } = this.state;
        this.setState({ isOpened: !isOpened });
        if (!isOpened) {
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
    _clearContract() {
        // TODO: clear interface from store
    }

    render() {
        const { isOpened, toggleBtnStyle, toggleBtnTxt } = this.state;
        const { fileName, compiled, deployed, compiling, interfaces } = this.props;
        return (
            <div>
                <label className="label file-collapse-label">
                    <h4 className="text-success">{fileName}</h4>
                    <div>
                        <button className={toggleBtnStyle} onClick={this._toggleCollapse}>
                            {toggleBtnTxt}
                        </button>
                    </div>
                </label>
                <Collapse isOpened={isOpened}>
                    {
                        Object.keys(compiled.contracts[fileName]).map((contractName, index) => {
                            const regexVyp = /([a-zA-Z0-9\s_\\.\-():])+(.vy|.v.py|.vyper.py)$/g;
                            const bytecode = fileName.match(regexVyp)
                            ? compiled.contracts[fileName][contractName].evm.bytecode.object.substring(2)
                            : compiled.contracts[fileName][contractName].evm.bytecode.object;
                            return (
                                <div id={contractName} className="contract-container" key={index}>
                                    {
                                        !deployed[contractName] && interfaces !== null && interfaces[contractName] && compiling === false &&
                                        <ContractCompiled
                                            contractName={contractName}
                                            fileName={fileName}
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
    componentDidUpdate(prevProps) {
        const { sources, compiled } = this.props;
        if (sources != prevProps.sources) {
            // Start compilation of contracts from here
            const workspaceElement = atom.views.getView(atom.workspace);
            atom.commands.dispatch(workspaceElement, 'eth-interface:compile');
        }
        if (compiled !== null && compiled !== prevProps.compiled) {
            if (compiled.contracts) {
                for (const file of Object.entries(compiled.contracts)) {
                    for (const [contractName, contract] of Object.entries(file[1])) {
                        // Add interface to redux
                        const ContractABI = contract.abi;
                        this.props.addInterface({ contractName, ContractABI });
                    }
                }
            }
            if (compiled.errors) {
                this.props.setErrors(compiled.errors);
            }
        }
    }
    render() {
        const { compiled, deployed, compiling, interfaces } = this.props;
        return (

            <Provider store={this.props.store}>
                <div id="compiled-code" className="compiled-code">
                    {
                        compiled && compiled.contracts &&
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
    sources: PropTypes.object,
    helpers: PropTypes.any.isRequired,
    store: PropTypes.any.isRequired,
    compiled: PropTypes.object,
    deployed: PropTypes.any,
    compiling: PropTypes.bool,
    interfaces: PropTypes.object,
    addInterface: PropTypes.func,
    setErrors: PropTypes.func
};

const mapStateToProps = ({ contract }) => {
    const { sources, compiled, deployed, compiling, interfaces } = contract;
    return { sources, compiled, deployed, compiling, interfaces };
};

export default connect(mapStateToProps, { addInterface, setErrors })(Contracts);
