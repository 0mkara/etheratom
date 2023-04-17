# Use [ethcode](https://marketplace.visualstudio.com/items?itemName=7finney.ethcode) in vscode for better development experience.

# Etheratom

[![Greenkeeper badge](https://badges.greenkeeper.io/0mkara/etheratom.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/0mkara/etheratom.svg?branch=master)](https://travis-ci.org/0mkara/etheratom)
[![Gitter](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/Ethereum-Devtools-Developers-Studio/etheratom?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![telegram](https://png.icons8.com/color/24/000000/telegram-app.png)](https://t.me/etheratom)

Ethereum IDE plugin for hackable Atom editor. Compile smart contracts, deploy them to Ethereum networks. Efficient contract management interface. Integrated test suite for smart contracts.

![A screenshot of Etheratom package](https://user-images.githubusercontent.com/13261372/37828365-f43a0c8c-2ec0-11e8-8d09-d1c29d7168d3.png)

# Sponsors
![gitcoin](https://s.gitcoin.co/static/v2/images/presskit/GitcoinLogoText.682e2321c67c.svg)
<img src="https://gdurl.com/Js9x" alt="ethereumfoundation" height="300" hspace="40" />

# Support
You can join our Telegram group for quick help in solving any issues at https://t.me/etheratom  [![telegram](https://png.icons8.com/color/24/000000/telegram-app.png)](https://t.me/etheratom)

Join our new gitter room for help - https://gitter.im/Ethereum-Devtools-Developers-Studio/etheratom

#### Quick help
Follow our [quick troubleshooting issue](https://github.com/0mkara/etheratom/issues/282) to get help about some known bugs and issues.

# Requirements

#### Use [Ganache](http://truffleframework.com/ganache/) or Install [geth](https://github.com/ethereum/go-ethereum)
[Go Ethereum client installation instruction](https://www.ethereum.org/cli)
**Or**
You can just download binary from [https://geth.ethereum.org/downloads/](https://geth.ethereum.org/downloads/) and run.

#### Run go-ethereum client
Start geth node on testnet using following command:

    geth --goerli --rpc --rpcapi="eth,web3,personal" --ws --wsorigins="*" --wsapi="eth,web3,personal" console

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
**Geth** defaults : **rpc** `http://127.0.0.1:8545/` **websocket** `ws://127.0.0.1:8546/`

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

# Development guideline

##### Clone & code
```
git clone https://github.com/0mkara/etheratom.git
cd etheratom
```
##### Build
`rollup -c`

# Support development :heart:

Etheratom aims to provide a clean interactive interface to develop solidity smart contracts, test them on testnet, do security analysis and deploy them on mainnet. **Etheratom needs your help!**

**Etheratom is looking for financial help. Any organization or individual wants to help grow etheratom is requested to contact `0mkar@protonmail.com`**

## Ethereum :point_right: 0xd22fE4aEFed0A984B1165dc24095728EE7005a36
