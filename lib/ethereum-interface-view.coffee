module.exports =
class AtomSolidityView
    constructor: (serializedState) ->
        # Create resizer
        @element = document.createElement
        # Create root element
        @element = document.createElement('div')
        @element.classList.add('atom-solidity')
        @element.classList.add('native-key-bindings')
        @element.setAttribute('tabindex', '-1')

        # Create message element
        message = document.createElement('div')
        message.textContent = "Atom Ethereum Interface"
        message.classList.add('compiler-info')
        message.classList.add('inline-block')
        message.classList.add('highlight-info')
        @element.appendChild(message)

        # Create compiler selector div
        compilerNode = document.createElement('div')
        att = document.createAttribute('id')
        att.value = 'compiler-options'
        compilerNode.setAttributeNode(att)
        @element.appendChild(compilerNode)

        # Create account list div
        accountsNode = document.createElement('div')
        att = document.createAttribute('id')
        att.value = 'accounts-list'
        accountsNode.setAttributeNode(att)
        @element.appendChild(accountsNode)

        # Create compiled code view
        @compiledNode = document.createElement('div')
        att = document.createAttribute('id')
        att.value = 'compiled-code'
        @compiledNode.setAttributeNode(att)
        @compiledNode.classList.add('compiled-code')

    # Returns an object that can be retrieved when package is activated
    serialize: ->

    # Tear down any state and detach
    destroy: ->
        @element.remove()

    getElement: ->
        @element

    createTextareaR: (@text) ->
        textNode = document.createElement('pre')
        textNode.textContent = @text
        textNode.classList.add('large-code')
        return textNode

    destroyPass: ->
        addressNode = document.getElementById("accounts-list")
        passNode = addressNode.childNodes[0].childNodes[1]
        if passNode
            passNode.parentNode.removeChild(passNode)

    destroyCompiled: ->
        preCompiledNode = document.getElementById("compiled-code")
        if preCompiledNode
            preCompiledNode.removeChild(preCompiledNode.firstChild) while preCompiledNode.firstChild

    setContractView: (@name, @bytecode, @abiDef, @inputs, @estimatedGas) ->
        contractName = @name
        bytecode = JSON.stringify @bytecode
        contractABI = JSON.stringify @abiDef

        # Create contract display node
        cNode = document.createElement('div')
        att = document.createAttribute('id')
        att.value = contractName
        cNode.classList.add('contract-display')
        cNode.setAttributeNode(att)

        # Create contract name display
        cnameNode = document.createElement('span')
        cnameNode.classList.add('contract-name')
        cnameNode.classList.add('inline-block')
        cnameNode.classList.add('highlight-success')
        title = document.createTextNode(contractName)
        cnameNode.appendChild(title) # Append contract Name to span
        cNode.appendChild(cnameNode)

        # Contract byte code view
        bcNode = document.createElement('div')
        bcNode.classList.add('byte-code')
        textNode = this.createTextareaR(bytecode)
        bcNode.appendChild(textNode)
        cNode.appendChild(bcNode)

        # Create abiDef view
        messageNode = document.createElement('div')
        messageNode.classList.add('abi-definition')
        textNode = this.createTextareaR(contractABI)
        messageNode.appendChild(textNode)
        cNode.appendChild(messageNode)

        # Inputs
        inputsNode = document.createElement('div')
        att = document.createAttribute('id')
        att.value = contractName + '_inputs'
        inputsNode.setAttributeNode(att)

        for input of @inputs
            # Show var name
            buttonText = document.createElement('button')
            buttonText.classList.add('input')
            buttonText.classList.add('text-subtle')
            varName = document.createTextNode(@inputs[input].name)
            buttonText.appendChild(varName)
            inputsNode.appendChild(buttonText)

            # input var value
            inputText = document.createElement('input')
            att = document.createAttribute('id')
            att.value = @inputs[input].name
            inputText.setAttributeNode(att)
            inputText.setAttribute('type', 'text')
            inputText.classList.add('inputs')
            inputText.setAttribute('value', @inputs[input].type)
            inputsNode.appendChild(inputText)

            # Add line break
            lineBr = document.createElement('br')
            inputsNode.appendChild(lineBr)

        # Appent to inputs
        cNode.appendChild(inputsNode)

        # Estimated gas price view
        # Show var Estimated gas button
        buttonText = document.createElement('button')
        buttonText.classList.add('input')
        buttonText.classList.add('text-subtle')
        varName = document.createTextNode("Estimated Gas")
        buttonText.appendChild(varName)
        inputsNode.appendChild(buttonText)

        # Estimated gas input as estimated gas
        estimatedGasInput = document.createElement('input')
        att = document.createAttribute('id')
        att.value = contractName + '_gas'
        estimatedGasInput.setAttributeNode(att)
        estimatedGasInput.setAttribute('type', 'number')
        estimatedGasInput.classList.add('inputs')
        estimatedGasInput.setAttribute('value', @estimatedGas)
        inputsNode.appendChild(estimatedGasInput)

        # Create button
        createButton = document.createElement('div')
        att = document.createAttribute('id')
        att.value = contractName + '_create'
        createButton.setAttributeNode(att)
        inputsNode.appendChild(createButton)

        # Status
        createStat = document.createElement('div')
        # Add id contractName_stat
        att = document.createAttribute('id')
        att.value = contractName + '_stat'
        createStat.setAttributeNode(att)
        cNode.appendChild(createStat)

        # Address
        createAddr = document.createElement('div')
        att = document.createAttribute('id')
        att.value = contractName + '_address'
        createAddr.setAttributeNode(att)
        att = document.createAttribute('class')
        att.value = contractName
        createAddr.setAttributeNode(att)
        cNode.appendChild(createAddr)

        # Call button
        callButton = document.createElement('div')
        att = document.createAttribute('id')
        att.value = contractName + '_call'
        callButton.setAttributeNode(att)
        cNode.appendChild(callButton)

        @compiledNode.appendChild(cNode)
        @element.appendChild(@compiledNode)
