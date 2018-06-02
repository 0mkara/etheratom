# Etheratom - compile and deploy solidity code from atom editor

[![Greenkeeper badge](https://badges.greenkeeper.io/0mkara/etheratom.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/0mkara/etheratom.svg?branch=master)](https://travis-ci.org/0mkara/etheratom)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2F0mkara%2Fetheratom.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2F0mkara%2Fetheratom?ref=badge_shield)

Etheratom is a package for hackable Atom editor. It uses web3js to interact with Ethereum node.

![A screenshot of Etheratom package](https://user-images.githubusercontent.com/13261372/37828365-f43a0c8c-2ec0-11e8-8d09-d1c29d7168d3.png)

# Requirements

#### Use [Ganache](http://truffleframework.com/ganache/) or
#### Install geth
[Ethereum client installation instruction](https://www.ethereum.org/cli)
**Or**
You can just download binary from [https://geth.ethereum.org/downloads/](https://geth.ethereum.org/downloads/) and run.

#### Run go-ethereum client
Start geth node on testnet using following command:

    geth --testnet --fast --rpc --rpcapi="eth,web3,personal" --ws --wsorigins="*" --wsapi="eth,web3,personal" console

*Note:* Only solidity compiler is supported.

# Installation

`apm install etheratom`

Or you can install [Etheratom](https://atom.io/packages/etheratom) from Atom packages.

#### Install from source

Clone git repository

    git clone https://gitlab.com/0mkara/etheratom.git
    cd etheratom

Install as atom package

    apm link .
    apm install

# Configuration

Assuming you have a local geth client running and rpc api listening on [http://127.0.0.1:8545/](http://127.0.0.1:8545/) & websocket endpoint listening on [ws://127.0.0.1:8546](ws://127.0.0.1:8546)

#### Go to package settings and set rpc address & websocket address.

![etheratom package config](https://cloud.githubusercontent.com/assets/13261372/15468216/9989115e-2100-11e6-8dd5-e02fb9459ab6.gif)

**Restart atom** to load your configuration changes.

# Usage

Activate Etheratom package `ctrl+alt+e`

Compile solidity code `ctrl+alt+c`

Show/hide etheratom panel `ctrl+alt+v`

After compiling your code hit **Create** button to deploy the contract on blockchain.

Also you can select between **Javascript VM** and an actual running **Ethereum node**.

![New panel features](https://cloud.githubusercontent.com/assets/13261372/20199656/227e5a52-a7d2-11e6-95f5-ec7fb16b4564.png)

It has a tiny **Ethereum client monitor** to check how your node is doing

![nodeinfo](https://user-images.githubusercontent.com/13261372/39017080-f99b6d76-443f-11e8-94b5-ca77238a7011.png)


# Support development :heart:

Etheratom aims to provide a clean interactive interface to develop solidity smart contracts, test them on testnet, do security analysis and deploy them on mainnet. **Etheratom needs your help!**

## Ethereum :point_right: 0xd22fE4aEFed0A984B1165dc24095728EE7005a36


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2F0mkara%2Fetheratom.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2F0mkara%2Fetheratom?ref=badge_large)