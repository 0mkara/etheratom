# atom-ethereum-interface package

Atom Solidity Compiler is a package for hackable Atom editor. Is uses web3js to interact with an Ethereum node.

![A screenshot of atom-ethereum-interface package](https://cloud.githubusercontent.com/assets/13261372/20199663/2d000048-a7d2-11e6-9eb6-222200442f5c.png)

# Requirements

To run and compile using atom-ethereum-interface, now it is not required to have a local ethereum node running and compilers installed. New version adds support to solc and ethereumjs to compile and run solidity codes without running a local node.

*Note: Currently only solidity compiler is supported.*

[Ethereum client installation instruction](https://www.ethereum.org/cli)

Start geth node using following command

    geth --rpc --rpcapi="db,eth,net,web3,personal" --rpcport "8545" --rpcaddr "127.0.0.1" --rpccorsdomain "localhost" console

Check if solidity compiler is installed

    eth.getCompilers()

If solidity compiler is installed output will be similar

    I0523 16:34:48.950510 common/compiler/solidity.go:114] solc, the solidity compiler commandline interface
    Version: 0.3.0-0/Release-Linux/g++/Interpreter linked to libethereum-1.2.2-0/Release-Linux/g++/Interpreter

    path: /usr/bin/solc
    []

# Installation

## Install from source

This atom package is not yet available via atom package manager. To install it follow instructions bellow -

Clone git repository

    git clone https://github.com/gmtcreators/atom-ethereum-interface
    cd atom-ethereum-interface

Install as atom package

    apm link .
    apm install

## Install using atom-package-manager

You need to install

* [Atom Ethereum Interface](https://atom.io/packages/atom-ethereum-interface) (`apm install atom-ethereum-interface`)

# Configuration

Assuming you have a local geth client running and rpc api listening on http://127.0.0.1:8545/

1. Go to package settings and set rpc address.

    ![atom-ethereum-interface package config](https://cloud.githubusercontent.com/assets/13261372/15468216/9989115e-2100-11e6-8dd5-e02fb9459ab6.gif)

2. Restart atom

# Usage

Compile solidity code `ctrl+alt+c`

Deploy code with variables `ctrl+alt+s`

After deploying your code hit **Create** button to create and mine it

Also you can select between **Javascript VM** and an actual running **Ethereum node**.

![New panel features](https://cloud.githubusercontent.com/assets/13261372/20199656/227e5a52-a7d2-11e6-95f5-ec7fb16b4564.png)

Once contract is mined you will see buttons with function names to call those functions

# Expectations

This is aimed to provide a front-end for Ethereum node. This interacts with Ethereum node via web3js. In future this project expects to support and provide all web3js commands required specifically for compiling solidity codes and execute them.


# Self promotion

I have put my efforts to this project. I hope this package has helped my fellow ethereum developers.
I am a MEAN stack developer. Also comfortable with ReactJS, meteor, golang. I am currently lookming for a decent paid job. If you are looking for a developer consider contacting me.
