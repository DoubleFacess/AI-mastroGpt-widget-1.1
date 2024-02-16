/* @@ constants @@ */

const YOUR_TOKEN = '89773db3-7863-460c-ad3c-6abd0db43f1c'
const OPENAI_TOKEN = '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'
const API_URL = 'https://vnavarra.nuvolaris.dev/api/my/openai/chat'
//const API_URL = 'https://openai.nuvolaris.io/api/my/openai/chat'

const DIV_PROFILE = document.querySelector(".profile_div")
const DIV_WIDGET = document.querySelector(".widget")
const ID_PROFILE = document.getElementById("profile_div")
const BTN_CLOSE = document.getElementById('close')
const USER_INPUT = document.querySelector(".usrInput")
const USER_INPUT_ID = document.getElementById('userInput')
const CREATE_DIV = document.createElement("div")
const USER_IMG = '<img class="userAvatar" src="./static/img/userAvatar.png">'
const USER_RESPONSE_PREFIX = USER_IMG + '<p class="userMsg">'
const USER_RESPONSE_SUFFIX = '</p><div class="clearfix"></div>'
const CHAT_CLASS = document.querySelector(".chats")
const CHAT_ID = document.getElementById('chats')
const FALLBACK_MSG = "I am facing some issues, please try again later!!!"
const BOT_IMAGE = '<div class="botAvatar"><svg stroke="none" fill="black" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path></svg></div>'
const BOT_MESSAGE_PREFIX = BOT_IMAGE + '<p class="botMsg">'
const BOT_MESSAGE_SUFFIX = '</p><div class="clearfix"></div>'
const BOT_TYPING = BOT_IMAGE + '<div class="botTyping">' + '<div class="bounce1"></div>' + '<div class="bounce2"></div>' + '<div class="bounce3"></div>' + '</div>'
const SEND_BTN = document.getElementById("sendButton")


/* @@ init funcion @@ */

function init() {
	document.addEventListener('DOMContentLoaded', function () {
		//showBotTyping()
		activate_chat()
		disable_user_input(false)
		send(false)
		listen_user_input()
		get_user_input()
		return false
	})
}

/* @@ Toggle chatbot @@ */
function activate_chat() {
	let profileDiv = ID_PROFILE
	let profileDivElement = DIV_PROFILE
	let widgetElement = DIV_WIDGET

	profileDiv.addEventListener("click", function () {
		profileDivElement.classList.toggle("hide")
		widgetElement.setAttribute('style', 'display: block')
		widgetElement.classList.toggle()
	})

	let closeButton = BTN_CLOSE
	if (closeButton) {
		closeButton.addEventListener('click', function () {
			var profileDiv = DIV_PROFILE
			var widgetDiv = DIV_WIDGET
			if (profileDiv && profileDiv.classList.contains("hide")) {
				profileDiv.classList.remove("hide")
			}
			if (widgetDiv) {
				widgetDiv.style.display = widgetDiv.style.display === 'none' ? 'block' : 'none'
			}
			scrollToBottomOfResults()
		})
	}
}

function disable_user_input(arg) {
	return USER_INPUT_ID.disabled = arg
}

function listen_user_input() {
	
	USER_INPUT.addEventListener("keyup", handleUserInput)
	USER_INPUT.addEventListener("keypress", handleUserInput)

	function handleUserInput(e) {
		const keyCode = e.keyCode || e.which
		const text = USER_INPUT.value;
		if (keyCode === 13) {
			if (text === "" || text.trim() === "") {
				e.preventDefault()
				return false
			} else {
				USER_INPUT.blur()
				setUserResponse(text)
				send(text)
				e.preventDefault()
				return false
			}
		}
	}
}

function get_user_input() {
	SEND_BTN.addEventListener("click", function (e) {
		var text = USER_INPUT.value;
		if (text === "" || text.trim() === "") {
			e.preventDefault();
			return false;
		} else {			
			USER_INPUT.blur()
			setUserResponse(text)
			send(text)
			e.preventDefault()
			return false
		}
	})
}

function restartConversation() {
	USER_INPUT.value = ""
	send('/restart')
}


function setUserResponse(message) {
	let res_div = CREATE_DIV
	res_div.className = 'msgUser'
	res_div.innerHTML = USER_RESPONSE_PREFIX + message + USER_RESPONSE_SUFFIX
	CHAT_CLASS.appendChild(res_div).style.display = "block"
	USER_INPUT.value = ""
	scrollToBottomOfResults()
	showBotTyping()
	return false
	/*
	var suggestions = document.querySelectorAll(".suggestions");
	suggestions.forEach(function (suggestion) {
		suggestion.remove()
	})
	*/
}

function scrollToBottomOfResults() {	
	return CHAT_ID.scrollTop = CHAT_ID.scrollHeight
}

//

async function send(message) {
	console.log("Fetching api")
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
		console.log("Response from OpenAi: ", botResponse.output)
		if (message.toLowerCase() == '/restart') {
			CHAT_CLASS.innerHTML = "";
			return
		}
		setBotResponse(botResponse.output)
	} catch (error) {
		// if there is no response from rasa server
		setBotResponse("")
		console.log("Error from bot end: ", error)
	}
}

function setBotResponse(response) {
	//console.log('serious test', response);
	setTimeout(function () {
		hideBotTyping()
		if (response.length < 1) {
			let BotResponse = BOT_MESSAGE_PREFIX + FALLBACK_MSG + BOT_MESSAGE_SUFFIX
			CHAT_CLASS.insertAdjacentHTML('beforeend', BotResponse);
			scrollToBottomOfResults()
		} else {
			var BotResponse = BOT_MESSAGE_PREFIX + response + BOT_MESSAGE_SUFFIX
			CHAT_CLASS.insertAdjacentHTML('beforeend', BotResponse)
			scrollToBottomOfResults()
		}
	}, 500)
}


// When the #restart element is clicked
var restartButton = document.getElementById('restart');
if (restartButton) {
	restartButton.addEventListener('click', function () {
		restartConversation();
	});
}

function scrollToBottomOfResults() {
	
	if (CHAT_CLASS) {
		CHAT_CLASS.scrollTop = CHAT_CLASS.scrollHeight;
	}
}

//======================================bot typing animation ======================================
function showBotTyping() {

	//var botTyping = '<img class="botAvatar" id="botAvatar" src="./static/img/botAvatar.png"/><div class="botTyping">' + '<div class="bounce1"></div>' + '<div class="bounce2"></div>' + '<div class="bounce3"></div>' + '</div>'
	$(BOT_TYPING).appendTo(CHAT_CLASS)
	$('.botTyping').show();
	scrollToBottomOfResults();
}

function hideBotTyping() {
	$('#botAvatar').remove();
	$('.botTyping').remove();
}

init()
