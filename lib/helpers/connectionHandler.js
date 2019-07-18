'use babel';
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
import Web3 from 'web3';
import { showPanelError } from './uiHelpers.js';

export function getWeb3Conn() {    
    try {
        const rpcAddress = atom.config.get('etheratom.rpcAddress');
        const websocketAddress = atom.config.get('etheratom.websocketAddress');        
        const web3 = new Web3();
        if(rpcAddress && !websocketAddress){           
            web3.setProvider(new Web3.providers.HttpProvider(rpcAddress));
        }else if(websocketAddress) {
            web3.setProvider(new Web3.providers.WebsocketProvider(websocketAddress));
        }        
        return web3;
    } catch (e) {
        console.error(e);
        showPanelError(e);
    }
}
