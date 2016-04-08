AtomSolidityView = require './atom-solidity-view'
{CompositeDisposable} = require 'atom'
Web3 = require 'web3'
web3 = new Web3()
React = require 'react'
ReactDOM = require 'react-dom'
{MessagePanelView, PlainMessageView, LineMessageView} = require 'atom-message-panel'

module.exports = AtomSolidity =
    atomSolidityView: null
    modalPanel: null
    subscriptions: null

    activate: (state) ->
        web3.setProvider new web3.providers.HttpProvider('http://192.168.122.2:8545'), (error, callback) ->
            if error
                console.log error
            else
                console.log callback
        @atomSolidityView = new AtomSolidityView(state.atomSolidityViewState)
        @modalPanel = atom.workspace.addRightPanel(item: @atomSolidityView.getElement(), visible: false)

        # Empty global variable compiled
        @compiled = {}

        # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        @subscriptions = new CompositeDisposable

        # Register command that toggles this view
        @subscriptions.add atom.commands.add 'atom-workspace', 'atom-solidity:compile': => @compile()
        @subscriptions.add atom.commands.add 'atom-workspace', 'atom-solidity:build': => @build()
        @subscriptions.add atom.commands.add 'atom-workspace', 'atom-solidity:create': => @create()
        @subscriptions.add atom.commands.add 'atom-workspace', 'atom-solidity:toggle': => @toggleView()

    deactivate: ->
        @modalPanel.destroy()
        @subscriptions.dispose()
        @atomSolidityView.destroy()

    serialize: ->
        atomSolidityViewState: @atomSolidityView.serialize()

    checkConnection: (callback)->
        if !web3.isConnected()
            callback('Error could not connect to local geth instance!', null)
        else
            callback(null, true)

    toggleView: ->
        if @modalPanel.isVisible()
            @modalPanel.hide()
        else
            @modalPanel.show()

    showErrorMessage: (line, message, callback) ->
        messages = new MessagePanelView(title: 'Solidity compiler messages')
        messages.attach()
        messages.add new LineMessageView(line: line, message: message, className: 'red-message')

    compile: ->
        console.log 'Compilation started....'
        that = this
        editor = atom.workspace.getActiveTextEditor()
        source = editor.getText()
        @checkConnection (error, callback) ->
            if error
                console.error error
                that.showErrorMessage 0, 'Error could not connect to local geth instance!'
            else
                # Set coinbase
                web3.eth.defaultAccount = web3.eth.coinbase;
                that.compiled = web3.eth.compile.solidity(source);
                console.log that.compiled
                # Clean View before creating
                that.atomSolidityView.destroyCompiled()
                for contractName of that.compiled
                    # contractName is the name of contract in JSON object
                    bytecode = that.compiled[contractName].code
                    # Get contract  abi
                    ContractABI = that.compiled[contractName].info.abiDefinition
                    # set variables and render display
                    inputs = []
                    for abiObj of ContractABI
                        if ContractABI[abiObj].type is "constructor" && ContractABI[abiObj].inputs.length > 0
                            inputs = ContractABI[abiObj].inputs

                    # Create View
                    that.atomSolidityView.setMessage(contractName, bytecode, ContractABI, inputs)

                # Show contract code
                if not that.modalPanel.isVisible()
                    that.modalPanel.show()
        return

    build: ->
        console.log 'Sending compiled code to ethereum node...'
        that = this
        contractVars = []
        i = 0

        console.log @compiled
        for contractName of @compiled
            variables = []
            if document.getElementById(contractName + '_create')
                # contractName is the name of contract in JSON object
                bytecode = @compiled[contractName].code
                # Get contract  abi
                ContractABI = @compiled[contractName].info.abiDefinition
                # Collect variable inputs
                inputVars = if document.getElementById(contractName + '_inputs') then document.getElementById(contractName + '_inputs').getElementsByTagName('input')
                if inputVars
                    while i < inputVars.length - 1
                        console.log inputVars.item(i).value
                        inputObj = {
                            "varName": inputVars.item(i).getAttribute('id'),
                            "varValue": inputVars.item(i).value
                        }
                        variables[i] = inputObj
                        i++
                    contractVars[contractName] = {
                        'contractName': contractName,
                        'inputVariables': variables
                    }
                    console.log contractVars
                createButton = React.createClass(
                    displayName: 'createButton'
                    _handleSubmit: ->
                        console.log 'Handling submit'
                        that.create(that.compiled[Object.keys(this.refs)[0]].info.abiDefinition, that.compiled[Object.keys(this.refs)[0]].code, contractVars[Object.keys(this.refs)[0]], Object.keys(this.refs)[0])
                    render: ->
                        React.createElement('form', { onSubmit: this._handleSubmit },
                        React.createElement('input', {type: 'submit', value: 'Create', ref: contractName}, null, null))
                    )
                ReactDOM.render React.createElement(createButton, null), document.getElementById(contractName + '_create')

    prepareEnv: (contractName, callback) ->
        if document.getElementById(@contractName + '_create')
            document.getElementById(@contractName + '_create').style.visibility = 'hidden'
            document.getElementById(@contractName + '_stat').innerText = 'transaction sent, waiting for confirmation...'
            callback(null, true)
        else
            e = new Error('Could not parse input')
            callback(e, null)

    create: (@abi, @code, @inputObj, @contractName) ->
        console.log 'Creating contract...'
        that = this
        # hide create button
        @prepareEnv @contractName, (err, callback) ->
            if err
                console.error err
            else
                # let's assume that coinbase is our account
                web3.eth.defaultAccount = web3.eth.coinbase
                # create contract
                web3.eth.contract(that.abi).new { data: that.code, from: web3.eth.defaultAccount, gas: 1000000 }, (err, contract) ->
                    if err
                        console.error err
                        that.showErrorMessage 129, err
                        return
                    # callback fires twice, we only want the second call when the contract is deployed
                    else if contract.address
                        myContract = contract
                        console.log 'address: ' + myContract.address
                        document.getElementById(that.contractName + '_address').innerText = myContract.address
                        document.getElementById(that.contractName + '_stat').innerText = 'Mined!'
                    else if !contract.address
                        document.getElementById(that.contractName + '_stat').innerText = "Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined..."
                        console.log "Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined..."
                    return

    toggle: ->
        console.log 'Atom Solidity View was toggled!'

        if @modalPanel.isVisible()
            @modalPanel.hide()
        else
            @modalPanel.show()
