/* @@ constants @@ */

const DIV_PROFILE = document.querySelector(".profile_div")
const DIV_WIDGET = document.querySelector(".widget")
const ID_PROFILE = document.getElementById("profile_div")
const BTN_CLOSE = document.getElementById('close')

/* @@ Toggle chatbot @@ */
let profileDiv = ID_PROFILE
let profileDivElement = DIV_PROFILE
let widgetElement = DIV_WIDGET

profileDiv.addEventListener("click", function () {
	profileDivElement.classList.toggle("hide");
	widgetElement.setAttribute('style', 'display: block')
	widgetElement.classList.toggle();
});

/* @@ Toggle chatbot with close button @@ */
// When the #close element is clicked
let  closeButton = BTN_CLOSE
if (closeButton) {
    closeButton.addEventListener('click', function() {
        var profileDiv = DIV_PROFILE
        var widgetDiv = DIV_WIDGET
        if (profileDiv && profileDiv.classList.contains("hide")) {
			//profileDiv.style.display = profileDiv.style.display === 'none' ? 'block' : 'none';
			profileDiv.classList.remove("hide")
        }
        if (widgetDiv) {
            widgetDiv.style.display = widgetDiv.style.display === 'none' ? 'block' : 'none';
        }
        scrollToBottomOfResults();
    })
}

document.addEventListener('DOMContentLoaded', function () {
	showBotTyping()
	document.getElementById('userInput').disabled = false;

	// global variables
	const action_name = "action_greet_user";
	const user_id = "jitesh97";

	// if you want the bot to start the conversation
	//action_trigger(user_id, action_name)
})


//  restart conversation 
function restartConversation() {
	document.querySelector('.usrInput').value = "";
	send('/restart');
}

//=====================================	user enter or sends the message =====================

document.querySelector(".usrInput").addEventListener("keyup", handleUserInput);
document.querySelector(".usrInput").addEventListener("keypress", handleUserInput);

function handleUserInput(e) {
	const keyCode = e.keyCode || e.which;

	const text = document.querySelector(".usrInput").value;
	if (keyCode === 13) {

		if (text === "" || text.trim() === "") {
			e.preventDefault();
			return false;
		} else {
			const paginatedCards = document.getElementById("paginated_cards");
			if (paginatedCards) paginatedCards.remove();

			const suggestions = document.querySelectorAll(".suggestions");
			suggestions.forEach((suggestion) => suggestion.remove());

			const quickReplies = document.querySelectorAll(".quickReplies");
			quickReplies.forEach((quickReply) => quickReply.remove());

			document.querySelector(".usrInput").blur();
			setUserResponse(text);
			send(text);
			e.preventDefault();
			return false;
		}
	}
}

document.getElementById("sendButton").addEventListener("click", function (e) {
	var text = document.querySelector(".usrInput").value;
	if (text === "" || text.trim() === "") {
		e.preventDefault();
		return false;
	} else {
		var suggestions = document.querySelectorAll(".suggestions");
		var paginatedCards = document.querySelectorAll("#paginated_cards");
		var quickReplies = document.querySelectorAll(".quickReplies");
		suggestions.forEach(function (suggestion) {
			suggestion.remove();
		});
		paginatedCards.forEach(function (card) {
			card.remove();
		});
		quickReplies.forEach(function (reply) {
			reply.remove();
		});
		document.querySelector(".usrInput").blur();
		setUserResponse(text);
		send(text);
		e.preventDefault();
		return false;
	}
});


function setUserResponse(message) {
	var UserResponse = document.createElement("div");
	UserResponse.className = "msgUser";
	UserResponse.innerHTML = '<img class="userAvatar" src="./static/img/userAvatar.png"><p class="userMsg">' + message + '</p><div class="clearfix"></div>';
	document.querySelector(".chats").appendChild(UserResponse).style.display = "block";

	document.querySelector(".usrInput").value = "";
	scrollToBottomOfResults();
	showBotTyping();
	var suggestions = document.querySelectorAll(".suggestions");
	suggestions.forEach(function (suggestion) {
		suggestion.remove();
	});
}

//=========== Scroll to the bottom of the chats after new message has been added to chat ======
function scrollToBottomOfResults() {

	var terminalResultsDiv = document.getElementById("chats");
	terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}
const YOUR_TOKEN = '89773db3-7863-460c-ad3c-6abd0db43f1c'
const OPENAI_TOKEN = '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'
const API_URL = 'https://vnavarra.nuvolaris.dev/api/my/openai/chat'
//const API_URL = 'https://openai.nuvolaris.io/api/my/openai/chat'
//

async function send(message) {
    console.log("Calling GPT3")
    var url = API_URL
    let bearer = 'Bearer ' + YOUR_TOKEN

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
			/*
			.then(response => {        
				return response.json()
			})		   
			.then(data=>{
				console.log(data)
				console.log(typeof data)
				console.log(Object.keys(data))
				console.log(data['choices'][0].text)				
			})
			*/
		const botResponse = await response.json()
		console.log("Response from OpenAi: ", botResponse.output)
		if (message.toLowerCase() == '/restart') {
			document.querySelector(".chats").innerHTML = "";
			return
		}
		setBotResponse(botResponse.output)
	} catch(error) {
		// if there is no response from rasa server
		setBotResponse("")
		console.log("Error from bot end: ", error)
	}
}

async function sendOpenAi(message) {
    console.log("Calling GPT3")
    var url = "https://api.openai.com/v1/chat/completions";
    let bearer = 'Bearer ' + YOUR_TOKEN

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': bearer,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"model": "gpt-3.5-turbo", 
				//"prompt": 'generic conversational prompt',	
				"messages": [{"role": "user", "content": message}],
				"usage": {
					"prompt_tokens": 13,
					"completion_tokens": 20,
					"total_tokens": 33
				},
				
				"max_tokens": 5,
				"temperature": 1,
				"top_p": 1,
				"n": 1,
				"stream": false,
				"logprobs": null,
				"stop": "\n"
			})
		})			
		const botResponse = await response.json()
		console.log("Response from OpenAi: ", botResponse.choices[0].message.content)
		if (message.toLowerCase() == '/restart') {
			document.querySelector(".chats").innerHTML = "";
			return
		}
		setBotResponse(botResponse.choices[0].message.content)
	} catch(error) {
		// if there is no response from rasa server
		setBotResponse("")
		console.log("Error from bot end: ", error)
	}

        

}


async function sendOpenAi(message) {
    console.log("Calling GPT3")
    var url = "https://api.openai.com/v1/chat/completions";
    let bearer = 'Bearer ' + YOUR_TOKEN

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': bearer,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"model": "gpt-3.5-turbo", 
				//"prompt": 'generic conversational prompt',	
				"messages": [{"role": "user", "content": message}],
				"usage": {
					"prompt_tokens": 13,
					"completion_tokens": 20,
					"total_tokens": 33
				},
				
				"max_tokens": 5,
				"temperature": 1,
				"top_p": 1,
				"n": 1,
				"stream": false,
				"logprobs": null,
				"stop": "\n"
			})
		})
			/*
			.then(response => {        
				return response.json()
			})		   
			.then(data=>{
				console.log(data)
				console.log(typeof data)
				console.log(Object.keys(data))
				console.log(data['choices'][0].text)				
			})
			*/
		const botResponse = await response.json()
		console.log("Response from OpenAi: ", botResponse.choices[0].message.content)
		if (message.toLowerCase() == '/restart') {
			document.querySelector(".chats").innerHTML = "";
			return
		}
		setBotResponse(botResponse.choices[0].message.content)
	} catch(error) {
		// if there is no response from rasa server
		setBotResponse("")
		console.log("Error from bot end: ", error)
	}        

}

async function OpenaiFetchAPICopia(message) {
    console.log("Calling GPT3")
    var url = "https://api.openai.com/v1/engines/gpt-3.5-turbo-0125/completions";
    var bearer = 'Bearer ' + YOUR_TOKEN
    await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "prompt": "Once upon a time",
            "max_tokens": 5,
            "temperature": 1,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "logprobs": null,
            "stop": "\n"
        })


    }).then(response => {
        
        return response.json()
       
    }).then(data=>{
        console.log(data)
        console.log(typeof data)
        console.log(Object.keys(data))
        console.log(data['choices'][0].text)
        
    })
        .catch(error => {
            console.log('Something bad happened ' + error)
        });

}

//=================== set bot response in the chats ===========================================

function setBotResponse(response) {
    //console.log('serious test', response);
    setTimeout(function () {
        hideBotTyping()
        if (response.length < 1) {
            let fallbackMsg = "I am facing some issues, please try again later!!!";
            let BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"/><p class="botMsg">' + fallbackMsg + '</p><div class="clearfix"></div>';
            document.querySelector(".chats").insertAdjacentHTML('beforeend', BotResponse);
            scrollToBottomOfResults()
        } else {
            var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"/><p class="botMsg">' + response + '</p><div class="clearfix"></div>'
			document.querySelector(".chats").insertAdjacentHTML('beforeend', BotResponse)
			scrollToBottomOfResults()		
        }
    }, 500)
}


function setBotResponseCopia(response) {
	console.log('serious test', response)
	setTimeout(function () {
		hideBotTyping();
		if (response.length < 1) {
			let fallbackMsg = "I am facing some issues, please try again later!!!";
			let BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"/><p class="botMsg">' + fallbackMsg + '</p><div class="clearfix"></div>'
			document.querySelector(".chats").insertAdjacentHTML('beforeend', BotResponse);
			scrollToBottomOfResults();
		} else {
			for (var i = 0; i < response.length; i++) {
				if (response[i].hasOwnProperty("text")) {
					var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"/><p class="botMsg">' + response[i].text + '</p><div class="clearfix"></div>';
					document.querySelector(".chats").insertAdjacentHTML('beforeend', BotResponse);
				}
				if (response[i].hasOwnProperty("image")) {
					var BotResponse = '<div class="singleCard">' + '<img class="imgcard" src="' + response[i].image + '">' + '</div><div class="clearfix">';
					document.querySelector(".chats").insertAdjacentHTML('beforeend', BotResponse);
				}
				if (response[i].hasOwnProperty("buttons")) {
					addSuggestion(response[i].buttons);
				}
				if (response[i].hasOwnProperty("custom")) {
					if (response[i].custom.payload == "quickReplies") {
						quickRepliesData = response[i].custom.data;
						showQuickReplies(quickRepliesData);
						return;
					}
					if (response[i].custom.payload == "location") {
						document.getElementById("userInput").disabled = true;
						getLocation();
						scrollToBottomOfResults();
						return;
					}
					if (response[i].custom.payload == "cardsCarousel") {
						restaurantsData = (response[i].custom.data);
						showCardsCarousel(restaurantsData);
						return;
					}
				}
			}
			scrollToBottomOfResults();
		}
	}, 500);
}

// When the #restart element is clicked
var restartButton = document.getElementById('restart');
if (restartButton) {
    restartButton.addEventListener('click', function() {
        restartConversation();
    });
}

function scrollToBottomOfResults() {
    var chatsDiv = document.querySelector('.chats');
    if (chatsDiv) {
        chatsDiv.scrollTop = chatsDiv.scrollHeight;
    }
}

//======================================bot typing animation ======================================
function showBotTyping() {

	var botTyping = '<img class="botAvatar" id="botAvatar" src="./static/img/botAvatar.png"/><div class="botTyping">' + '<div class="bounce1"></div>' + '<div class="bounce2"></div>' + '<div class="bounce3"></div>' + '</div>'
	$(botTyping).appendTo(".chats");
	$('.botTyping').show();
	scrollToBottomOfResults();
}

function hideBotTyping() {
	$('#botAvatar').remove();
	$('.botTyping').remove();
}
