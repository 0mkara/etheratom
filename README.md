# atom-solidity package

Atom Solidity Compiler is a package for hackable Atom editor. Is uses web3js to interact with an Ethereum node.

![A screenshot of your package](https://github.com/gmtcreators/atom-solidity/raw/dev/atom-solidity.gif)

#Installation

This atom package is not yet available via atom package manager. To install it follow instructions bellow -

Clone git repository

    git clone https://github.com/gmtcreators/atom-solidity

Point it to Ethereum node

    vi atom-solidity/lib/atom-solidity.coffee

Change localhost to point your Ethereum node

    web3.providers.HttpProvider('http://localhost:8545')

Install as atom package

    cd atom-solidity
    apm install
