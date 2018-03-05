# Etheratom - compile and deploy solidity code from atom editor

[![Greenkeeper badge](https://badges.greenkeeper.io/0mkara/etheratom.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/0mkara/etheratom.svg?branch=master)](https://travis-ci.org/0mkara/etheratom)

Etheratom is a package for hackable Atom editor. Is uses web3js to interact with an Ethereum node.

![A screenshot of Etheratom package](https://cloud.githubusercontent.com/assets/13261372/20199663/2d000048-a7d2-11e6-9eb6-222200442f5c.png)

# Requirements

To run and compile using Etheratom, it is now __not required to have a local ethereum node running and compilers installed__. New version adds support to solc and ethereumjs to compile and run solidity codes without running a local node.

*Note: Currently only solidity compiler is supported.*

[Ethereum client installation instruction](https://www.ethereum.org/cli)

Start geth node using following command

    geth --testnet --cache=1024 --fast --rpc --rpcapi="db,eth,net,web3,personal" console

# Installation

## Install from source

Clone git repository

    git clone https://gitlab.com/0mkara/etheratom.git
    cd etheratom

Install as atom package

    apm link .
    apm install

## Install using atom-package-manager

You need to install

* [Etheratom](https://atom.io/packages/etheratom) (`apm install etheratom`)

# Configuration

Assuming you have a local geth client running and rpc api listening on http://127.0.0.1:8545/

1. Go to package settings and set rpc address.

    ![etheratom package config](https://cloud.githubusercontent.com/assets/13261372/15468216/9989115e-2100-11e6-8dd5-e02fb9459ab6.gif)

2. Restart atom

# Usage

Activate Etheratom package `ctrl+alt+e`

Compile solidity code `ctrl+alt+c`

Show/hide etheratom panel `ctrl+alt+v`

After compiling your code hit **Create** button to deploy the contract on blockchain.

Also you can select between **Javascript VM** and an actual running **Ethereum node**.

![New panel features](https://cloud.githubusercontent.com/assets/13261372/20199656/227e5a52-a7d2-11e6-95f5-ec7fb16b4564.png)

Once contract is mined you will see buttons with function names to call those functions

# Expectations

Etheratom aims to provide an interface where developers can write solidity smart contracts, test them on Javascript VM, deploy them to testnets & mainnet and do a transaction analysis.

# Support development :green_heart: show some love
## Ethereum :point_right: 0xd22fE4aEFed0A984B1165dc24095728EE7005a36
