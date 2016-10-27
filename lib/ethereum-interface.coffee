AtomSolidityView = require './ethereum-interface-view'
path = require 'path'
fs = require 'fs'
{CompositeDisposable} = require 'atom'
Web3 = require 'web3'
Solc = require 'solc'
React = require 'react'
ReactDOM = require 'react-dom'
TestRPC = require 'ethereumjs-testrpc'
{MessagePanelView, PlainMessageView, LineMessageView} = require 'atom-message-panel'
Coinbase = ''
Password = ''
rpcAddress = atom.config.get('atom-ethereum-interface.rpcAddress')
useTestRpc = atom.config.get('atom-ethereum-interface.useTestRpc')

if typeof web3 != 'undefined'
    web3 = new Web3(web3.currentProvider)
else
    if useTestRpc
        web3 = new Web3(TestRPC.provider())
    else
        web3 = new Web3(new (Web3.providers.HttpProvider)(rpcAddress))

module.exports = AtomSolidity =
    atomSolidityView: null
    modalPanel: null
    subscriptions: null

    activate: (state) ->
        @atomSolidityView = new AtomSolidityView(state.atomSolidityViewState)
        @modalPanel = atom.workspace.addRightPanel(item: @atomSolidityView.getElement(), visible: false)
        atom.config.observe 'atom-ethereum-interface.rpcAddress', (newValue) ->
            # TODO: add url validation
            urlPattern = new RegExp('(http)://?')
            if urlPattern.test(newValue)
                rpcAddress = newValue

        # Empty global variable compiled
        @compiled = {}

        # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        @subscriptions = new CompositeDisposable

        # Register command that toggles this view
        @subscriptions.add atom.commands.add 'atom-workspace', 'eth-interface:compile': => @compile()
        @subscriptions.add atom.commands.add 'atom-workspace', 'eth-interface:build': => @build()
        @subscriptions.add atom.commands.add 'atom-workspace', 'eth-interface:create': => @create()
        @subscriptions.add atom.commands.add 'atom-workspace', 'eth-interface:toggle': => @toggleView()

    deactivate: ->
        @modalPanel.destroy()
        @subscriptions.dispose()
        @atomSolidityView.destroy()

    serialize: ->
        atomSolidityViewState: @atomSolidityView.serialize()

    # if callback and @, use arrow the fat
    compileVM: (source, callback) ->
        that = this
        output = Solc.compile(source, 1)
        callback(null, output)

    checkConnection: (callback) ->
        that = this
        haveConn = {}
        if useTestRpc == true
            haveConn = true
        else
            haveConn = web3.isConnected()
        if !haveConn
            callback('Error could not connect to local geth instance!', null)
        else
            # If passphrase is not already set
            if Password == ''
                # Set coinbase
                # List all accounts and set selected as coinbase
                web3.eth.getAccounts (err, accounts) ->
                    if err
                        console.log err
                    else
                        that.getBaseAccount accounts, (err, callback) ->
                            if err
                                console.log err
                            else
                                Coinbase = callback.account
                                Password = callback.password
                                # Check if account is locked ? then prompt for password
                                that.checkUnlock (err, callback) ->
                                    callback(null, true)
            callback(null, true)

    checkUnlock: (Coinbase, callback) ->
        # web3.personal.unlockAccount("Coinbase", password)
        console.log "In checkUnlock"

    toggleView: ->
        if @modalPanel.isVisible()
            @modalPanel.hide()
        else
            @modalPanel.show()

    showErrorMessage: (line, message, callback) ->
        messages = new MessagePanelView(title: 'Solidity compiler messages')
        messages.attach()
        messages.add new LineMessageView(line: line, message: message, className: 'red-message')

    getBaseAccount: (accounts, callback) ->
        # Here we will select baseAccount for rest of the operations
        # we will also get password for that account
        that = this
        createAddressList = React.createClass(
            displayName: 'addressList'
            getInitialState: ->
                { account: accounts[0], password: Password }
            _handleChange: (event) ->
                this.setState { account: event.target.value }
            _handlePasswordChange: (event) ->
                this.setState { password: event.target.value }
            _handlePassword: (event) ->
                event.preventDefault()
                # Return account and password
                callback(null, this.state)
            render: ->
                # create dropdown list for accounts
                React.createElement 'div', { htmlFor: 'acc-n-pass', className: 'icon icon-link' },
                    React.createElement 'select', { onChange: this._handleChange, value: this.state.account }, accounts.map (account, i) ->
                        React.createElement 'option', { value: account }, account #options are address
                    React.createElement 'form', { onSubmit: this._handlePassword, className: 'icon icon-lock' },
                        React.createElement 'input', { type: 'password', uniqueName: "password", placeholder: "Password", value: this.state.password, onChange: this._handlePasswordChange }
                        React.createElement 'input', { type: 'submit', value: 'Unlock' }

        )
        ReactDOM.render React.createElement(createAddressList), document.getElementById('accounts-list')
        callback(null, { account: accounts[0], password: '' })

    combineSource: (dir, source, imports) ->
        that = this
        o = { encoding: 'UTF-8' }

        ir = /import\ [\'\"](.+)[\'\"]\;/g
        match = null
        while (match = ir.exec(source))
          iline = match[0]
          fn = match[1]
          # empty out already imported
          if imports[fn]
            source = source.replace(iline, '')
            continue

          imports[fn] = 1
          subSource = fs.readFileSync("#{dir}/#{fn}", o)
          match.source = that.combineSource(dir, subSource, imports)
          source = source.replace(iline, match.source)

        return source

    compile: ->
        that = this
        editor = atom.workspace.getActiveTextEditor()
        filePath = editor.getPath()
        dir = path.dirname(filePath)
        compiler = null

        source = that.combineSource(dir, editor.getText(), {})
        # Check selected compiler and compile using selected compiler (default solcjs)
        ###
        if compiler is 'solcjs'
            that.compileVM source, (error, callback) ->
                if error
                    console.error error
                    that.showErrorMessage 0, 'Error could not compile using JavascriptVM'
                else
                    that.compiled = callback
                    # Clean View before creating
                    that.atomSolidityView.destroyCompiled()
                    console.log that.compiled

                    estimatedGas = 0
                    # Create inpus for every contract
                    for contractName of that.compiled.contracts
                        # contractName is the name of contract in JSON object
                        bytecode = that.compiled.contracts[contractName].bytecode
                        # Get contract  abi
                        ContractABI = that.compiled.contracts[contractName].interface
                        # get constructors for rendering display
                        inputs = []
                        for abiObj of ContractABI
                            if ContractABI[abiObj].type is "constructor" && ContractABI[abiObj].inputs.length > 0
                                inputs = ContractABI[abiObj].inputs
                        # Create view
                        that.atomSolidityView.setContractView(contractName, bytecode, ContractABI, inputs, estimatedGas)


                    # Show contract code
                    if not that.modalPanel.isVisible()
                        that.modalPanel.show()
        else
        ###
        @checkConnection (error, callback) ->
            if error
                console.error error
                that.showErrorMessage 0, 'Error could not connect to local geth instance!'
            else
                web3.eth.defaultAccount = Coinbase
                console.log "Using coinbase: " + web3.eth.defaultAccount
                ###
                # TODO: Handle Compilation asynchronously and handle errors
                ###
                web3.eth.compile.solidity source, (err, callback) ->
                    if err
                        # TODO: Add linter support
                        console.log err
                        return
                    else
                        that.compiled = callback
                        # Clean View before creating
                        that.atomSolidityView.destroyCompiled()
                        console.log that.compiled

                        # Create inpus for every contract
                        for contractName of that.compiled
                            # Get estimated gas
                            estimatedGas = web3.eth.estimateGas { from: web3.eth.defaultAccount, data: that.compiled[contractName].code, gas: 1000000 }
                            ###
                            # TODO: Use asynchronous call
                            web3.eth.estimateGas({from: '0xmyaccout...', data: "0xc6888fa1fffffffffff…..", gas: 500000 }, function(err, result){
                              if(!err && result !=== 500000) { …  }
                             });
                            ###

                            # contractName is the name of contract in JSON object
                            bytecode = that.compiled[contractName].code
                            # Get contract  abi
                            ContractABI = that.compiled[contractName].info.abiDefinition
                            # get constructors for rendering display
                            inputs = []
                            for abiObj of ContractABI
                                if ContractABI[abiObj].type is "constructor" && ContractABI[abiObj].inputs.length > 0
                                    inputs = ContractABI[abiObj].inputs
                            # Create view
                            that.atomSolidityView.setContractView(contractName, bytecode, ContractABI, inputs, estimatedGas)


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
            estimatedGas = 0
            if document.getElementById(contractName + '_create')
                # contractName is the name of contract in JSON object
                bytecode = @compiled[contractName].code
                # Get contract  abi
                ContractABI = @compiled[contractName].info.abiDefinition
                # Collect variable inputs
                inputVars = if document.getElementById(contractName + '_inputs') then document.getElementById(contractName + '_inputs').getElementsByTagName('input')
                if inputVars
                    while i < inputVars.length
                        if inputVars.item(i).getAttribute('id') == contractName + '_gas'
                            estimatedGas = inputVars.item(i).value
                            inputVars.item(i).readOnly = true
                            break
                        inputObj = {
                            "varName": inputVars.item(i).getAttribute('id'),
                            "varValue": inputVars.item(i).value
                        }
                        variables[i] = inputObj
                        inputVars.item(i).readOnly = true
                        if inputVars.item(i).nextSibling.getAttribute('id') == contractName + '_create'
                            break
                        else
                            i++
                    constructVars[contractName] = {
                        'contractName': contractName,
                        'inputVariables': variables,
                        'estimatedGas': estimatedGas
                    }
                # Create React element for create button
                createButton = React.createClass(
                    displayName: 'createButton'
                    _handleSubmit: ->
                        console.log constructVars
                        that.create(that.compiled[Object.keys(this.refs)[0]].info.abiDefinition, that.compiled[Object.keys(this.refs)[0]].code, constructVars[Object.keys(this.refs)[0]], Object.keys(this.refs)[0], constructVars[Object.keys(this.refs)[0]].estimatedGas)
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
    create: (@abi, @code, @constructVars, @contractName, @estimatedGas) ->
        that = this
        @estimatedGas = if @estimatedGas > 0 then @estimatedGas else 1000000
        if Password == ''
            e = new Error('Empty password')
            console.error ("Empty password")
            @showErrorMessage 0, "No password provided"
            return
        # hide create button
        @prepareEnv @contractName, (err, callback) ->
            if err
                console.error err
            else
                # Use coinbase
                web3.eth.defaultAccount = Coinbase
                console.log "Using coinbase: " + web3.eth.defaultAccount
                # set variables and render display
                constructorS = []
                for i in that.constructVars.inputVariables
                    constructorS.push i.varValue

                web3.personal.unlockAccount(web3.eth.defaultAccount, Password)
                web3.eth.contract(that.abi).new constructorS.toString(), { data: that.code, from: web3.eth.defaultAccount, gas: that.estimatedGas }, (err, contract) ->
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
                                    React.createElement 'span', { className: 'inline-block highlight' }, 'TransactionHash: '
                                    React.createElement 'pre', { className: 'large-code' }, contract.transactionHash
                                    React.createElement 'span', { className: 'stat-mining stat-mining-align' }, 'waiting to be mined '
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
                    web3.personal.unlockAccount(web3.eth.defaultAccount, Password)
                    result = that.myContract[that.functionName].apply(this, args)
                else
                    web3.personal.unlockAccount(web3.eth.defaultAccount, Password)
                    result = that.myContract[that.functionName]()
                console.log result
                that.showOutput that.myContract.address, result

    toggle: ->
        if @modalPanel.isVisible()
            @modalPanel.hide()
        else
            @modalPanel.show()
