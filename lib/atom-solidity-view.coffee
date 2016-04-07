module.exports =
class AtomSolidityView
    constructor: (serializedState) ->
        # Create root element
        @element = document.createElement('div')
        @element.classList.add('atom-solidity')

        # Create message element
        message = document.createElement('div')
        message.textContent = "The Atom Solidity Compiler"
        message.classList.add('message')
        @element.appendChild(message)

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
        textNode = document.createElement('textarea')
        textNode.textContent = @text
        textNode.setAttribute('readonly', 'readonly')
        return textNode

    destroyCompiled: ->
        preCompiledNode = document.getElementById("compiled-code")
        if preCompiledNode
            preCompiledNode.removeChild(preCompiledNode.firstChild) while preCompiledNode.firstChild

    setMessage: (@name, @bytecode, @abiDef, @inputs) ->

        contractName = @name
        bytecode = JSON.stringify @bytecode
        contractABI = JSON.stringify @abiDef

        # Create contract display node
        cNode = document.createElement('div')
        att = document.createAttribute('id')
        att.value = contractName
        cNode.setAttributeNode(att)

        # Create contract name display
        cnameNode = document.createElement('span')
        cnameNode.classList.add('contract-name')
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
        inputsNode.classList.add('inputs')

        for input of @inputs
            # Show var name
            buttonText = document.createElement('button')
            buttonText.classList.add('input')
            varName = document.createTextNode(@inputs[input].name)
            buttonText.appendChild(varName)
            inputsNode.appendChild(buttonText)

            # input var value
            inputText = document.createElement('input')
            att = document.createAttribute('id')
            att.value = @inputs[input].name
            inputText.setAttributeNode(att)
            inputText.setAttribute('type', 'text')
            inputText.setAttribute('value', @inputs[input].type)
            inputsNode.appendChild(inputText)
            # Appent to inputs
            cNode.appendChild(inputsNode)


        # Create button
        createButton = document.createElement('div')
        att = document.createAttribute('id')
        att.value = contractName + '_create'
        createButton.setAttributeNode(att)
        inputsNode.appendChild(createButton)

        # Status
        createStat = document.createElement('div')
        att = document.createAttribute('id')
        att.value = contractName + '_stat'
        createStat.setAttributeNode(att)
        cNode.appendChild(createStat)

        # Address
        createAddr = document.createElement('div')
        att = document.createAttribute('id')
        att.value = contractName + '_address'
        createAddr.setAttributeNode(att)
        cNode.appendChild(createAddr)

        @compiledNode.appendChild(cNode)
        @element.appendChild(@compiledNode)
