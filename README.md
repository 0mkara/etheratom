# Etheratom - compile and deploy solidity code from atom editor

[![Greenkeeper badge](https://badges.greenkeeper.io/0mkara/etheratom.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/0mkara/etheratom.svg?branch=master)](https://travis-ci.org/0mkara/etheratom)
[![telegram](https://png.icons8.com/color/24/000000/telegram-app.png)](https://t.me/etheratom)

Etheratom is a package for hackable Atom editor. It uses web3js to interact with Ethereum node.

![A screenshot of Etheratom package](https://user-images.githubusercontent.com/13261372/37828365-f43a0c8c-2ec0-11e8-8d09-d1c29d7168d3.png)

# Requirements

#### Use [Ganache](http://truffleframework.com/ganache/) or Install [geth](https://github.com/ethereum/go-ethereum)
[Go Ethereum client installation instruction](https://www.ethereum.org/cli)
**Or**
You can just download binary from [https://geth.ethereum.org/downloads/](https://geth.ethereum.org/downloads/) and run.

#### Run go-ethereum client
Start geth node on testnet using following command:

    geth --testnet --fast --rpc --rpcapi="eth,web3,personal" --ws --wsorigins="*" --wsapi="eth,web3,personal" console

*Note:* Only solidity compilation is supported. `--wsorigins="*"` or `--wsorigins="file://"`  is necessary to allow Atom to connect to go-ethereum websocket endpoint.

# Installation

`apm install etheratom`

Or you can install [Etheratom](https://atom.io/packages/etheratom) from Atom packages.

#### Install from source

Clone git repository

    git clone https://github.com/0mkara/etheratom.git
    cd etheratom

Install as atom package

    apm install
    apm link .

# Configuration
**Geth** defaults : **rpc** `http://127.0.0.1:8545/` **websocket** `http://127.0.0.1:8546/`

**Ganache** defaults : **rpc** `http://127.0.0.1:7545/`

#### Go to package settings and set rpc address & websocket address.

![etheratom package config](https://user-images.githubusercontent.com/13261372/41284998-96a25e26-6e58-11e8-80a6-1860368bcaed.png)

**Restart atom** to load your configuration changes.

# Usage

Activate Etheratom package `ctrl+alt+e`

Compile solidity code with `ctrl+alt+c` or just by saving a solidity file with `ctrl+s`

Show/hide etheratom panel `ctrl+alt+v`

After compiling your solidity code click **Deploy to blockchain** button to deploy the contract on blockchain. Optionally you can deploy your contract at some previously created address.

![New panel features](https://user-images.githubusercontent.com/13261372/41285521-0dd4154c-6e5a-11e8-843d-505368a31302.png)

##### Follow [Etheratom Wiki](https://github.com/0mkara/etheratom/wiki) for more information.

# Support development :heart:

Etheratom aims to provide a clean interactive interface to develop solidity smart contracts, test them on testnet, do security analysis and deploy them on mainnet. **Etheratom needs your help!**

## Ethereum :point_right: 0xd22fE4aEFed0A984B1165dc24095728EE7005a36
