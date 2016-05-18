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
                ###
                # TODO: Handle Compilation asynchronously and handle errors
                ###
                that.compiled = web3.eth.compile.solidity(source);
                # Clean View before creating
                that.atomSolidityView.destroyCompiled()
                # Create inpus for every contract
                for contractName of that.compiled
                    # contractName is the name of contract in JSON object
                    bytecode = that.compiled[contractName].code
                    # Get contract  abi
                    ContractABI = that.compiled[contractName].info.abiDefinition
                    # get constructors for rendering display
                    inputs = []
                    for abiObj of ContractABI
                        if ContractABI[abiObj].type is "constructor" && ContractABI[abiObj].inputs.length > 0
                            inputs = ContractABI[abiObj].inputs

                    # Create View
                    that.atomSolidityView.setContractView(contractName, bytecode, ContractABI, inputs)

                # Show contract code
                if not that.modalPanel.isVisible()
                    that.modalPanel.show()
        return

    build: ->
        that = this
        constructVars = []
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
                    while i < inputVars.length
                        inputObj = {
                            "varName": inputVars.item(i).getAttribute('id'),
                            "varValue": inputVars.item(i).value
                        }
                        variables[i] = inputObj
                        if inputVars.item(i).nextSibling.getAttribute('id') == contractName + '_create'
                            break
                        else
                            i++
                    constructVars[contractName] = {
                        'contractName': contractName,
                        'inputVariables': variables
                    }

                createButton = React.createClass(
                    displayName: 'createButton'
                    _handleSubmit: ->
                        that.create(that.compiled[Object.keys(this.refs)[0]].info.abiDefinition, that.compiled[Object.keys(this.refs)[0]].code, constructVars[Object.keys(this.refs)[0]], Object.keys(this.refs)[0])
                    render: ->
                        React.createElement('form', { onSubmit: this._handleSubmit },
                        React.createElement('input', {type: 'submit', value: 'Create', ref: contractName, className: 'btn btn-primary inline-block-tight'}, null))
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

    # our asyncLoop
    asyncLoop: (iterations, func, callback) ->
        index = 0
        done = false
        cycle =
            next: ->
                if done
                    return
                if index < iterations
                    index++
                    func cycle
                else
                    done = true
                    callback()
            iteration: ->
                index - 1
            break: ->
                done = true
                callback()
        cycle.next()
        cycle

    # Construct function buttons from abi
    constructFunctions: (@contractABI, callback) ->
        for contractFunction in contractABI
            if contractFunction.type = 'function' and contractFunction.name != null and contractFunction.name != undefined
                @createChilds contractFunction, (error, childInputs) ->
                    if !error
                        callback(null, [contractFunction.name, childInputs])
                    else
                        callback(null, [null, null])

    createChilds: (contractFunction, callback) ->
        reactElements = []
        i = 0
        if contractFunction.inputs.length > 0
            while i < contractFunction.inputs.length
                reactElements[i] = [contractFunction.inputs[i].type, contractFunction.inputs[i].name]
                i++
        callback(null, reactElements)

    # Construct react child inputs
    create: (@abi, @code, @constructVars, @contractName) ->
        that = this
        # hide create button
        @prepareEnv @contractName, (err, callback) ->
            if err
                console.error err
            else
                # let's assume that coinbase is our account
                web3.eth.defaultAccount = web3.eth.coinbase
                # set variables and render display
                constructorS = []
                for i in that.constructVars.inputVariables
                    constructorS.push i.varValue

                # create contract
                web3.eth.contract(that.abi).new constructorS.toString(), { data: that.code, from: web3.eth.defaultAccount, gas: 1000000 }, (err, contract) ->
                    if err
                        console.error err
                        that.showErrorMessage 129, err
                        return
                    # callback fires twice, we only want the second call when the contract is deployed
                    else if contract.address
                        myContract = contract
                        console.log 'address: ' + myContract.address
                        document.getElementById(that.contractName + '_stat').innerText = 'Mined!'
                        document.getElementById(that.contractName + '_stat').setAttribute('class', 'icon icon-zap') # Add icon class
                        document.getElementById(that.contractName + '_address').innerText = myContract.address
                        document.getElementById(that.contractName + '_address').setAttribute('class', 'icon icon-key') # Add icon class

                        # Check every key, if it is a function create call buttons,
                        # for every function there could be many call methods,
                        # for every method there cpould be many inputs
                        # Innermost callback will have inputs for all abi objects
                        # Lets think the Innermost function

                        # Construct view for function call view
                        functionABI = React.createClass(
                            displayName: 'callFunctions'
                            getInitialState: ->
                                { childFunctions: [] }
                            componentDidMount: ->
                                self = this
                                that.constructFunctions that.abi, (error, childFunctions) ->
                                    if !error
                                        self.state.childFunctions.push(childFunctions)
                                        self.forceUpdate()
                            _handleChange: (childFunction, event) ->
                                console.log event.target.value
                                this.setState { value: event.target.value }
                            _handleSubmit: (childFunction, event) ->
                                # Get arguments ready here
                                that.argsToArray this.refs, childFunction, (error, argArray) ->
                                    if !error
                                        that.call(myContract, childFunction, argArray)
                            render: ->
                                self = this
                                React.createElement 'div', { htmlFor: 'contractFunctions' }, this.state.childFunctions.map((childFunction, i) ->
                                    React.createElement 'form', { onSubmit: self._handleSubmit.bind(this, childFunction[0]), key: i, ref: childFunction[0] },
                                        React.createElement 'input', { type: 'submit', readOnly: 'true', value: childFunction[0], className: 'text-subtle call-button' }
                                        childFunction[1].map((childInput, j) ->
                                            React.createElement 'input', { tye: 'text', handleChange: self._handleChange, placeholder: childInput[0] + ' ' + childInput[1], className: 'call-button-values' }#, ref: if childFunction[0] then childFunction[0][j] else "Constructor" }
                                        )


                                )
                        )

                        ReactDOM.render React.createElement(functionABI), document.getElementById(that.contractName + '_call')

                    else if !contract.address
                        contractStat = React.createClass(
                            render: ->
                                React.createElement 'div', { htmlFor: 'contractStat' },
                                    React.createElement 'span', { className: 'stat-sent' }, 'Contract transaction sent.'
                                    React.createElement 'span', { className: 'stat-thash' }, 'TransactionHash: ' + contract.transactionHash
                                    React.createElement 'span', { className: 'stat-mining stat-mining-align' }, 'waiting to be mined...'
                                    React.createElement 'span', { className: 'loading loading-spinner-tiny inline-block stat-mining-align' }

                        )
                        ReactDOM.render React.createElement(contractStat), document.getElementById(that.contractName + '_stat')
                        # document.getElementById(that.contractName + '_stat').innerText = "Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined..."
                        console.log "Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined..."

    showOutput: (address, output) ->
        messages = new MessagePanelView(title: 'Solidity compiler output')
        messages.attach()
        address = 'Contract address: ' + address
        output = 'Contract output: ' + output
        messages.add new PlainMessageView(message: address, className: 'green-message')
        messages.add new PlainMessageView(message: output, className: 'green-message')

    argsToArray: (@reactElements, @childFunction, callback) ->
        that = this
        # For every childNodes of childFunction
        # Get value of childFunction
        # Trim value having name of the function
        args = new Array()
        @asyncLoop @reactElements[@childFunction].childNodes.length, ((cycle) ->
            if that.reactElements[that.childFunction][cycle.iteration()].type != 'submit'
                args.push(that.reactElements[that.childFunction][cycle.iteration()].value)
            cycle.next()
        ), ->
            callback(null, args)

    checkArray: (@arguments, callback) ->
        # TODO: Check for empty elements and remove them
        # TODO: remove any unwanted element that has no text in it
        callback(null, @arguments)

    call: (@myContract, @functionName, @arguments) ->
        that = this
        console.log @myContract
        console.log @functionName
        console.log @arguments
        @checkArray @arguments, (error, args) ->
            if !error
                if args.length > 0
                    result = that.myContract[that.functionName].apply(this, args)
                else
                    result = that.myContract[that.functionName]()
                console.log result
                that.showOutput that.myContract.address, result

    toggle: ->
        if @modalPanel.isVisible()
            @modalPanel.hide()
        else
            @modalPanel.show()
