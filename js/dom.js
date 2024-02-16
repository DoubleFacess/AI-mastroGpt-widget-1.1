dom = dom.createModule(function(){	

	
	/* @@ init dom utils @@ */

	let _getEl = function(div) {
		if(document.getElementById(div)) {
			return document.getElementById(div)
		} else return false
	}
	let _getSelector = function(div) {
		if(document.querySelector(div)) {
			return document.querySelector(div)
		} else return false
	}

	/* @@ constants @@ */

	const profileId = _getEl('profile-id')
	const profileClass = _getSelector('.profile-class')
	const widgetElement = _getSelector('.widget')
	const btnClose = _getEl('close')
	const btnChat = _getEl('chat-button')
	const btnSend = _getEl('sendButton')
	const userInpuId = _getEl('userInput')
	const userInpuclass = _getSelector('userInput')

	/* @@ functions @@ */

	let _activateChat = function() {

		btnChat.addEventListener('click', function (e) {
			profileClass.classList.toggle('hide')
			widgetElement.setAttribute('style', 'display: block')
			widgetElement.classList.toggle(false)
			btnChat.style.display = 'none'
		})		

		dump.next('end of activateClass function')

		return false
		
	}

	let _closeButton = function() {

		btnClose.addEventListener('click', function () {
			//var profileDiv = DIV_PROFILE
			//var widgetDiv = DIV_WIDGET
			if (profileClass && profileClass.classList.contains('hide')) {
				profileClass.classList.remove('hide')
			}
			if (widgetElement) {
				widgetElement.style.display = widgetElement.style.display === 'none' ? 'block' : 'none'
				btnChat.style.display = 'block'
			}
			//scrollToBottomOfResults()
		})

	}

	let _disableUserInput = function() {
		return userInpuId.disabled = arg
	}

	let _userInput = function() {

		dump.next('into userInput')
		userInpuId.addEventListener("keyup", handleUserInput)
		userInpuId.addEventListener("keypress", handleUserInput)

		function handleUserInput(e) {
			const keyCode = e.keyCode || e.which
			const text = userInpuId.value;
			if (keyCode === 13) {
				if (text === "" || text.trim() === "") {
					e.preventDefault()
					return false
				} else {
					userInpuId.blur()
					//setUserResponse(text)
					//send(text)
					e.preventDefault()
					return false
				}
			}
		}

		return false

	}

	/* @@ test @@ */
	let _appTest = function(){
		dump.next('hello from this funcion');
		if(main.functionTest()) {
			console.log('function test is true')
		}
	}
	

	/* @@ inject functions in context @@ */

	return {
		activateChat: _activateChat,
		closeButton: _closeButton,
		userInput: _userInput,
		getEl: _getEl,
		getSelector: _getSelector
		/* appTest: _appTest, */
	}
})

