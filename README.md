# atom-ethereum-interface package

Atom Solidity Compiler is a package for hackable Atom editor. Is uses web3js to interact with an Ethereum node.

![A screenshot of atom-ethereum-interface package](https://github.com/gmtcreators/atom-ethereum-interface/raw/dev/atom-ethereum-interface.gif)

#Installation

##Install from source

This atom package is not yet available via atom package manager. To install it follow instructions bellow -

Clone git repository

    git clone https://github.com/gmtcreators/atom-ethereum-interface
    cd atom-ethereum-interface
    git branch dev

Point it to Ethereum node

    vi lib/ethereum-interface.coffee

Change localhost to point your Ethereum node

    web3.providers.HttpProvider('http://localhost:8545')

Install as atom package

    apm link .
    apm install

##Install using atom-package-manager

You need to install

* [Atom Ethereum Interface](https://atom.io/packages/atom-ethereum-interface) (`atom-ethereum-interface` from apm)

#Usage

Compile solidity code `ctrl+alt+c`

Deploy code with variables `ctrl+alt+s`

After deploying your code hit **Create** button to create and mine it

Once contract is mined you will see buttons with function names to call those functions

#Expectations

This is aimed to provide a front-end for Ethereum node. This interacts with Ethereum node via web3js. In future this project expects to support and provide all web3js commands required specifically for compiling solidity codes and execute them.
