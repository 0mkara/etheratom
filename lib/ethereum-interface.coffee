AtomSolidityView = require './ethereum-interface-view'
path = require 'path'
fs = require 'fs'
{CompositeDisposable} = require 'atom'
React = require 'react'
ReactDOM = require 'react-dom'
{MessagePanelView, PlainMessageView, LineMessageView} = require 'atom-message-panel'
# Ethereum requires
Web3 = require 'web3'
Solc = require 'solc'
TestRPC = require 'ethereumjs-testrpc'
ethJSUtil = require 'ethereumjs-util'
EthJSTX = require 'ethereumjs-tx'
EthJSBlock = require 'ethereumjs-block'
EthJSVM = require 'ethereumjs-vm'
ethJSABI = require 'ethereumjs-abi'
BN = ethJSUtil.BN
VM = {}
# Env Vars
Coinbase = ''
Password = ''
Compiler = 'solcjs' # set default compiler
vmAccounts = []
vmBlockNumber = 1150000
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
            callback(null, true)

    getAddresses: (callback) ->
        # List all accounts and set selected as coinbase
        web3.eth.getAccounts (err, accounts) ->
            if err
                callback('Error no base account!', null)
            else
                callback(null, accounts)

    addAccounts: (keyArr) ->
        accounts = []
        @VM = new EthJSVM(null, null, { activatePrecompiles: true, enableHomestead: true })
        # prepare accounts from key and return accounts array
        for key of keyArr
            privateKey = new Buffer(keyArr[key], 'hex')
            address = ethJSUtil.privateToAddress(privateKey)
            @VM.stateManager.putAccountBalance address, 'f00000000000000001', (error, callback) ->
            vmAccounts['0x' + address.toString('hex')] = { privateKey: privateKey, nonce: 0 }
            accounts.push('0x' + address.toString('hex'))
        accounts

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
        callback(null, { account: accounts[0], password: Password })

    chooseCompiler: (defaultCompiler, callback) ->
        that = this
        compilers = [{ compiler: 'solcjs', desc: 'Javascript VM' }, { compiler: 'Web3', desc: 'Backend ethereum node' }]
        createCompilerEnvList = React.createClass(
            displayName: 'envList'
            getInitialState: ->
                { compilerValue: if compilers[0].compiler == defaultCompiler then compilers[0].compiler else compilers[1].compiler }
            _handleChange: (event) ->
                this.setState { compilerValue: event.target.value }
                callback(null, { compilerValue: event.target.value })
            render: ->
                self = this
                # create dropdown list for accounts
                React.createElement 'div', { htmlFor: 'compiler-select' },
                    React.createElement 'form', { className: 'icon icon-plug' }, compilers.map (compiler, i) ->
                        React.createElement 'label', { className: 'input-label inline-block highlight' },
                            React.createElement 'input', { type: 'radio', uniqueName: "compilerOpt", className: 'input-radio', value: compiler.compiler, onChange: self._handleChange, checked: self.state.compilerValue == compiler.compiler }, compiler.desc
        )
        ReactDOM.render React.createElement(createCompilerEnvList), document.getElementById('compiler-options')
        callback(null, { compilerValue: defaultCompiler })

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

        source = that.combineSource(dir, editor.getText(), {})
        @chooseCompiler Compiler, (error, callback) ->
            if error
                console.error error
                that.showErrorMessage 0, error
            else
                Compiler = callback.compilerValue
                # Check selected compiler and compile using selected compiler (default solcjs)
                if Compiler is 'solcjs'
                    # create a VM
                    # prepare ethereumjsVM util variables
                    that.vmAccounts = []
                    keyArr = []
                    keyArr.push('3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511')
                    keyArr.push('2ac6c190b09897cd8987869cc7b918cfea07ee82038d492abce033c75c1b1d0c')
                    keyArr.push('dae9801649ba2d95a21e688b56f77905e5667c44ce868ec83f82e838712a2c7a')
                    keyArr.push('d74aa6d18aa79a05f3473dd030a97d3305737cbc8337d940344345c1f6b72eea')
                    keyArr.push('71975fbf7fe448e004ac7ae54cad0a383c3906055a65468714156a07385e96ce')
                    accounts = that.addAccounts(keyArr)

                    that.getBaseAccount accounts, (error, callback) ->
                        if error
                            console.error error
                        else
                            Coinbase = callback.account
                            that.compileVM source, (error, callback) ->
                                if error
                                    console.error error
                                    that.showErrorMessage 0, 'Error could not compile using JavascriptVM'
                                else
                                    that.compiled = callback
                                    estimatedGas = 0
                                    # Clean View before creating
                                    that.atomSolidityView.destroyPass()
                                    that.atomSolidityView.destroyCompiled()

                                    # Create inpus for every contract
                                    for contractName of that.compiled.contracts
                                        # contractName is the name of contract in JSON object
                                        bytecode = that.compiled.contracts[contractName].bytecode
                                        # Get contract  abi
                                        ContractABI = JSON.parse(that.compiled.contracts[contractName].interface)
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
                # if compiler is not solcjs it should be web3 for now
                else
                    that.checkConnection (error, callback) ->
                        if error
                            console.error error
                            that.showErrorMessage 0, error
                        else
                            that.getAddresses (error, accounts) ->
                                if error
                                    console.error error
                                    that.showErrorMessage 0, error
                                else
                                    that.getBaseAccount accounts, (err, callback) ->
                                        if err
                                            console.error err
                                        else
                                            Coinbase = callback.account
                                            Password = callback.password
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

        if Compiler is 'solcjs'
            # do things for ethereumjsVM
            for contractName of @compiled.contracts
                variables = []
                estimatedGas = 0
                if document.getElementById(contractName + '_create')
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
                            # contractName is the name of contract in JSON object
                            bytecode = that.compiled.contracts[Object.keys(this.refs)[0]].bytecode
                            # Get contract  abi
                            ContractABI = JSON.parse that.compiled.contracts[Object.keys(this.refs)[0]].interface
                            that.create(ContractABI, bytecode, constructVars[Object.keys(this.refs)[0]], Object.keys(this.refs)[0], constructVars[Object.keys(this.refs)[0]].estimatedGas)
                        render: ->
                            React.createElement('form', { onSubmit: this._handleSubmit },
                            React.createElement('input', {type: 'submit', value: 'Create', ref: contractName, className: 'btn btn-primary inline-block-tight'}, null))
                        )
                    ReactDOM.render React.createElement(createButton, null), document.getElementById(contractName + '_create')
        else
            # do things for web3
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
                            that.create(that.compiled[Object.keys(this.refs)[0]].info.abiDefinition, that.compiled[Object.keys(this.refs)[0]].code, constructVars[Object.keys(this.refs)[0]], Object.keys(this.refs)[0], constructVars[Object.keys(this.refs)[0]].estimatedGas)
                        render: ->
                            React.createElement('form', { onSubmit: this._handleSubmit },
                            React.createElement('input', {type: 'submit', value: 'Create', ref: contractName, className: 'btn btn-primary inline-block-tight'}, null))
                        )
                    ReactDOM.render React.createElement(createButton, null), document.getElementById(contractName + '_create')

    prepareEnv: (contractName, callback) ->
        if document.getElementById(@contractName + '_create')
            document.getElementById(@contractName + '_create').style.visibility = 'hidden'
            if Compiler != 'solcjs'
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

    # Construct function buttons from abi
    decodeABI: (@contractABI, callback) ->
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
        if Compiler is 'solcjs'
            # Execute code using ethereumjsVM
            # Construct transaction

            tx = new EthJSTX({
                    nonce: new BN(vmAccounts[Coinbase].nonce++),
                    gasPrice: new BN(1),
                    gasLimit: new BN(1000, 10),
                    value: new BN(0, 10),
                    data: that.code
                })
            tx.sign(vmAccounts[Coinbase].privateKey)
            block = new EthJSBlock({
                    header: {
                        timestamp: new Date().getTime() / 1000 | 0,
                        number: @vmBlockNumber
                    },
                    transactions: [],
                    uncleHeaders: []
                })
            # Prepare for ethereumjsVM execution code view
            @prepareEnv @contractName, (err, callback) ->
                if err
                    console.error err
                else
                    # set variables and render display
                    constructorS = []
                    for i in that.constructVars.inputVariables
                        constructorS.push i.varValue

                    that.VM.runTx { block: block, tx: tx, skipBalance: true, skipNonce: true }, (error, result) ->
                        if error
                            console.error error
                            that.showErrorMessage 508, error
                            return
                        else if result.createdAddress
                            myContract = result
                            console.log 'address: ' + result.createdAddress.toString('hex')
                            document.getElementById(that.contractName + '_stat').innerText = 'JavascriptVM code executed!'
                            document.getElementById(that.contractName + '_stat').setAttribute('class', 'icon icon-zap') # Add icon class
                            document.getElementById(that.contractName + '_address').innerText = '0x' + myContract.createdAddress.toString('hex')
                            document.getElementById(that.contractName + '_address').setAttribute('class', 'icon icon-key') # Add icon class

                            # Check every key, if it is a function create call buttons,
                            # for every function there could be many call methods,
                            # for every method there cpould be many inputs
                            # Innermost callback will have inputs for all abi objects

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
                                    this.setState { value: event.target.value }
                                _handleSubmit: (childFunction, event) ->
                                    self = this
                                    # Get arguments ready here
                                    that.typesToArray this.refs, childFunction, (error, typArray) ->
                                        if !error
                                            that.argsToArray self.refs, childFunction, (error, argArray) ->
                                                if !error
                                                    console.log "Will call"
                                                    # Buffer.concat([ ethJSABI.methodID(Method Name, input variable types), ethJSABI.rawEncode(input variable types, input variables) ]).toString('hex')
                                                    buffer = Buffer.concat([ ethJSABI.methodID(childFunction, typArray), ethJSABI.rawEncode(typArray, argArray) ]).toString('hex')
                                                    console.log buffer
                                                    #that.call(myContract, childFunction, argArray)
                                render: ->
                                    self = this
                                    React.createElement 'div', { htmlFor: 'contractFunctions' }, this.state.childFunctions.map((childFunction, i) ->
                                        React.createElement 'form', { onSubmit: self._handleSubmit.bind(this, childFunction[0]), key: i, ref: childFunction[0] },
                                            React.createElement 'input', { type: 'submit', readOnly: 'true', value: childFunction[0], className: 'text-subtle call-button' }
                                            childFunction[1].map((childInput, j) ->
                                                React.createElement 'input', { tye: 'text', handleChange: self._handleChange, name: childInput[0], placeholder: childInput[0] + ' ' + childInput[1], className: 'call-button-values' }#, ref: if childFunction[0] then childFunction[0][j] else "Constructor" }
                                            )
                                    )
                            )

                            ReactDOM.render React.createElement(functionABI), document.getElementById(that.contractName + '_call')
            ###
            console.log that.code
            vm.runCode { code: new Buffer(that.code, 'hex'), gasLimit: new Buffer('ffffffff', 'hex') }, (error, callback) ->
                if error
                    console.error error
                else
                    console.log callback.gasUsed.toString()
            ###

        else
            # Execute code using web3
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
                                            console.log childFunctions
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

    typesToArray: (@reactElements, @childFunction, callback) ->
        that = this
        # For every childNodes of childFunction
        # Get type of child inputs
        types = new Array()
        @asyncLoop @reactElements[@childFunction].childNodes.length, ((cycle) ->
            if that.reactElements[that.childFunction][cycle.iteration()].type != 'submit'
                types.push(that.reactElements[that.childFunction][cycle.iteration()].name)
            cycle.next()
        ), ->
            callback(null, types)

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
