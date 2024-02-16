dom = dom.createModule(function(){	

	
	/* @@ init dom utils @@ */

	let _createEl = function(arg) {
		return document.createElement(arg)
	}
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

	const YOUR_TOKEN = '89773db3-7863-460c-ad3c-6abd0db43f1c'
	const API_URL = 'https://vnavarra.nuvolaris.dev/api/my/openai/chat'

	//const profileId = _getEl('profile-id')
	const profileClass = _getSelector('.profile-class')
	const widgetElement = _getSelector('.widget')
	const btnClose = _getEl('close')
	const btnChat = _getEl('chat-button')
	const btnSend = _getEl('sendButton')	
	const userInpuId = _getEl('userInput')	
	const userInpuclass = _getSelector('.usrInput')
	const getChatClass = _getSelector('.chats')
	const getChatId = _getEl('chats')

	/* testing */
	const BOT_IMAGE = '<div class="botAvatar"><svg stroke="none" fill="black" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path></svg></div>'
	const BOT_MESSAGE_PREFIX = BOT_IMAGE + '<p class="botMsg">'
	const BOT_MESSAGE_SUFFIX = '</p><div class="clearfix"></div>'
	const BOT_TYPING = BOT_IMAGE + '<div class="botTyping">' + '<div class="bounce1"></div>' + '<div class="bounce2"></div>' + '<div class="bounce3"></div>' + '</div>'
	const USER_IMG = '<img class="userAvatar" src="./static/img/userAvatar.png">'
	const USER_RESPONSE_PREFIX = USER_IMG + '<p class="userMsg">'
	const USER_RESPONSE_SUFFIX = '</p><div class="clearfix"></div>'


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

	let _disableUserInput = function(arg) {
		return userInpuId.disabled = arg
	}

	function _setBotResponse(response) {
		setTimeout(function () {
			//hideBotTyping()
			if (response.length < 1) {
				let BotResponse = BOT_MESSAGE_PREFIX + FALLBACK_MSG + BOT_MESSAGE_SUFFIX
				getChatClass.insertAdjacentHTML('beforeend', BotResponse);
				scrollToBottomOfResults()
			} else {
				var BotResponse = BOT_MESSAGE_PREFIX + response + BOT_MESSAGE_SUFFIX
				getChatClass.insertAdjacentHTML('beforeend', BotResponse)
				_scrollToBottomOfResults()
			}
		}, 500)
	}

	let _setUserResponse = function(message) {
		dump.next('preparing userInput Response')
		let respDiv = _createEl('div')
		respDiv.className = 'msgUser'
		respDiv.innerHTML = USER_RESPONSE_PREFIX + message + USER_RESPONSE_SUFFIX
		getChatClass.appendChild(respDiv).style.display = "block"
		userInpuclass.value = ""
		_scrollToBottomOfResults()
		//showBotTyping()
		return false

	}	

	let _getUserInput = function() {
		btnSend.addEventListener("click", function (e) {
			var text = userInpuclass.value;
			if (text === "" || text.trim() === "") {
				e.preventDefault();
				return false;
			} else {			
				userInpuclass.blur()
				_setUserResponse(text)
				_sendRequest(text)
				e.preventDefault()
				return false
			}
		})
	}
	

	let _sendRequest = async function (message) {
		dump.next("send function")
		dump.next("Fetching api")
		var url = API_URL
		let bearer = 'Bearer ' + YOUR_TOKEN
		if(!message) {
			message = ''		
		}
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Authorization': bearer,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					"input": message
				})
			})		
			const botResponse = await response.json()
			dump.next("Response from OpenAi: " +  botResponse.output)
			if (message.toLowerCase() == '/restart') {
				getChatClass.innerHTML = ""
				return
			}
			_setBotResponse(botResponse.output)
		} catch (error) {
			// if there is no response from rasa server
			//setBotResponse("")
			console.log("Error from bot end: ", error)
		}
	}

	function _scrollToBottomOfResults() {	
		return getChatClass.scrollTop = getChatClass.scrollHeight
	}

	let _listenUserInput = function() { //listen_user_input

		dump.next('into userInput')
		userInpuId.addEventListener('keyup', handleUserInput)
		userInpuId.addEventListener('keypress', handleUserInput)

		function handleUserInput(e) {
			const keyCode = e.keyCode || e.which
			const text = userInpuId.value;
			if (keyCode === 13) {
				if (text === '' || text.trim() === '') {
					e.preventDefault()
					return false
				} else {
					userInpuId.blur()
					dump.next('get user input: ' + text)
					_setUserResponse(text)
					_sendRequest(text)
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
		disableUserInput: _disableUserInput,
		listenUserInput: _listenUserInput,
		getUserInput: _getUserInput,
		sendRequest: _sendRequest,
		getEl: _getEl,
		getSelector: _getSelector
		/* appTest: _appTest, */
	}
})

