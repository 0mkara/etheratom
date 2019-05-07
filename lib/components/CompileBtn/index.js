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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class CompileBtn extends React.Component {
    constructor(props) {
        super(props);
        this._handleSubmit = this._handleSubmit.bind(this);
    }
    async _handleSubmit() {
        const workspaceElement = atom.views.getView(atom.workspace);
        await atom.commands.dispatch(workspaceElement, 'eth-interface:compile')
    }
    render() {
        const { compiling, compiled, compile_btn_value, compile_btn_class } = this.props;
        if(compiled !== null){
            return (
                <form className="row" onSubmit={this._handleSubmit}>
                    {
                        compiling || compiled.errors
                            ? <input type="submit" value={compile_btn_value} className={ 'btn copy-btn ' + compile_btn_class} disabled />
                            : <input type="submit" value={compile_btn_value} className={ 'btn copy-btn ' + compile_btn_class} />

                    }
                </form>
            );
        }else {
            return (
                <form className="row" onSubmit={this._handleSubmit}>
                    {
                        compiling &&
                        <input type="submit" value={compile_btn_value} className={ 'btn copy-btn ' + compile_btn_class} disabled />
                    }
                    {
                        !compiling &&
                        <input type="submit" value={compile_btn_value} className={ 'btn copy-btn ' + compile_btn_class} />
                    }
                </form>
            )
        }
    }
}

CompileBtn.propTypes = {
    compiling: PropTypes.bool,
    compiled: PropTypes.any,
    compile_btn_value:PropTypes.string,
    compile_btn_class:PropTypes.string
};

const mapStateToProps = ({ contract }) => {
    const { compiling, compiled, compile_btn_value, compile_btn_class } = contract;
    return { compiling, compiled, compile_btn_value, compile_btn_class };
};

export default connect(mapStateToProps, {})(CompileBtn);
