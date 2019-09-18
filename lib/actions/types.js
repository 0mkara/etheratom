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
export const RESET_CONTRACTS = 'reset_contracts';
export const SET_COMPILING = 'set_compiling';
export const SET_COMPILED = 'set_compiled';
export const RESET_COMPILED = 'reset_compiled';
export const SET_PARAMS = 'set_params';
export const ADD_INTERFACE = 'add_interface';
export const UPDATE_INTERFACE = 'update_interface';
export const UPDATE_OPTIONS = 'update_options';
export const ADD_TX_HASH = 'add_tx_hash';
export const SET_INSTANCE = 'set_instance';
export const SET_DEPLOYED = 'set_deployed';
export const SET_GAS_LIMIT = 'set_gas_limit';
export const SET_BALANCE = 'set_balance';
export const SET_GAS_ESTIMATE = 'set_gas_estimate';

// Files action types
export const RESET_SOURCES = 'reset_sources';
export const SET_SOURCES = 'set_sources';

export const SET_COINBASE = 'set_coinbase';
export const SET_PASSWORD = 'set_password';
export const SET_ACCOUNTS = 'set_accounts';

export const SET_ERRORS = 'set_errors';
export const RESET_ERRORS = 'reset_errors';

// Ethereum client events
export const ADD_PENDING_TRANSACTION = 'add_pending_transaction';
export const ADD_EVENTS = 'add_logs';
export const SET_EVENTS = 'set_events';
export const TEXT_ANALYSIS = 'text_analysis';

// Node variables
export const SET_CONNECTED = 'set_connected';
export const SET_SYNC_STATUS = 'set_sync_status';
export const SET_SYNCING = 'set_syncing';
export const SET_MINING = 'set_mining';
export const SET_HASH_RATE = 'set_hash_rate';

// Client variables
export const SET_CONNECTION_STATUS = 'set_connection_status';
export const FIRST_TIME_CHECK_ENABLE = 'first_time_check_enable';
export const IS_WS_PROVIDER = 'is_ws_provider';
export const IS_HTTP_PROVIDER = 'is_http_provider';
