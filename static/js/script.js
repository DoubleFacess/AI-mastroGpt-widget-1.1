/* @@ constants @@ */

const DIV_PROFILE = document.querySelector(".profile_div")
const DIV_WIDGET = document.querySelector(".widget")
const ID_PROFILE = document.getElementById("profile_div")
const BTN_CLOSE = document.getElementById('close')
//====================================== Toggle chatbot ======================================= 
var profileDiv = ID_PROFILE
var profileDivElement = DIV_PROFILE
var widgetElement = DIV_WIDGET

profileDiv.addEventListener("click", function () {
	profileDivElement.classList.toggle("hide");
	widgetElement.setAttribute('style', 'display: block')
	widgetElement.classList.toggle();
});

//====================================== Toggle chatbot with close button ===================== 
// When the #close element is clicked
var closeButton = BTN_CLOSE
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
    });
}


// ========================== let the bot start the conversation ========================

function action_trigger(user_id, action_name) {
	// send an event to the bot, so that bot can start the conversation by greeting the user
	const url = `http://localhost:5005/conversations/${user_id}/execute`;
	const data = JSON.stringify({ name: action_name, policy: "MappingPolicy", confidence: "0.98" });
	const headers = {
		"Content-Type": "application/json"
	};

	fetch(url, {
		method: "POST",
		headers,
		body: data
	})
		.then(response => response.json())
		.then(botResponse => {
			console.log("Response from Rasa: ", botResponse, "\nStatus: ", response.status);

			if (botResponse.hasOwnProperty("messages")) {
				setBotResponse(botResponse.messages);
			}
			document.getElementById("userInput").disabled = false;
		})
		.catch(error => {
			console.log("Error from bot end: ", error);
			setBotResponse("");
			document.getElementById("userInput").disabled = false;
		});
}


// ========================== greet user proactively ========================

document.addEventListener('DOMContentLoaded', function () {
	showBotTyping();
	document.getElementById('userInput').disabled = false;

	// global variables
	const action_name = "action_greet_user";
	const user_id = "jitesh97";

	// if you want the bot to start the conversation
	action_trigger(user_id, action_name)
});

// ========================== restart conversation ========================
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


async function send(message) {
	try {
		const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ message: message, sender: user_id })
		});

		const botResponse = await response.json();
		console.log("Response from Rasa: ", botResponse);

		// if user wants to restart the chat, clear the existing chat contents
		if (message.toLowerCase() == '/restart') {
			document.querySelector(".chats").innerHTML = "";
			return;
		}

		setBotResponse(botResponse);

	} catch (error) {
		// if there is no response from rasa server
		setBotResponse("");
		console.log("Error from bot end: ", error);
	}
}

//=================== set bot response in the chats ===========================================

function setBotResponse(response) {
	setTimeout(function () {
		hideBotTyping();
		if (response.length < 1) {
			var fallbackMsg = "I am facing some issues, please try again later!!!";
			var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"/><p class="botMsg">' + fallbackMsg + '</p><div class="clearfix"></div>';
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


//====================================== Suggestions ===========================================
function addSuggestion(textToAdd) {
    setTimeout(function () {
        var suggestions = textToAdd;
        var suggLength = textToAdd.length;
        var newCard = document.createElement('div');
        newCard.className = 'singleCard';
        newCard.innerHTML = '<div class="suggestions"><div class="menu"></div></div>';
        document.querySelector('.chats').appendChild(newCard);
        
        // Fading in the newCard (using CSS transitions)
        newCard.style.display = 'none';
        newCard.style.opacity = 0;
        newCard.style.transition = 'opacity 1s';
        setTimeout(function() {
            newCard.style.display = 'block';
            newCard.style.opacity = 1;
        }, 0); // we can use 0ms timeout to ensure the display is set before opacity transition starts

        // Loop through suggestions
        for (var i = 0; i < suggLength; i++) {
            var menuChip = document.createElement('div');
            menuChip.className = 'menuChips';
            menuChip.setAttribute('data-payload', suggestions[i].payload);
            menuChip.innerText = suggestions[i].title;
            newCard.querySelector('.menu').appendChild(menuChip);
        }

        scrollToBottomOfResults(); // Make sure this function does not depend on jQuery
    }, 1000);
}

// on click of suggestions, get the value and send to rasa
document.addEventListener('click', function(event) {
    if (event.target.matches('.menu .menuChips')) {
        var text = event.target.innerText;
        var payload = event.target.getAttribute('data-payload');
        console.log("payload: ", payload);
        setUserResponse(text);
        send(payload);

        //delete the suggestions
        var suggestions = document.querySelector('.suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }
});


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

//====================================== Cards Carousel =========================================

function showCardsCarousel(cardsToAdd) {
	var cards = createCardsCarousel(cardsToAdd);

	$(cards).appendTo(".chats").show();


	if (cardsToAdd.length <= 2) {
		$(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(3000);
	}
	else {
		for (var i = 0; i < cardsToAdd.length; i++) {
			$(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(3000);
		}
		$(".cards .arrow.prev").fadeIn("3000");
		$(".cards .arrow.next").fadeIn("3000");
	}


	scrollToBottomOfResults();

	const card = document.querySelector("#paginated_cards");
	const card_scroller = card.querySelector(".cards_scroller");
	var card_item_size = 225;

	card.querySelector(".arrow.next").addEventListener("click", scrollToNextPage);
	card.querySelector(".arrow.prev").addEventListener("click", scrollToPrevPage);


	// For paginated scrolling, simply scroll the card one item in the given
	// direction and let css scroll snaping handle the specific alignment.
	function scrollToNextPage() {
		card_scroller.scrollBy(card_item_size, 0);
	}
	function scrollToPrevPage() {
		card_scroller.scrollBy(-card_item_size, 0);
	}

}

function createCardsCarousel(cardsData) {

	var cards = "";

	for (i = 0; i < cardsData.length; i++) {
		title = cardsData[i].name;
		ratings = Math.round((cardsData[i].ratings / 5) * 100) + "%";
		data = cardsData[i];
		item = '<div class="carousel_cards in-left">' + '<img class="cardBackgroundImage" src="' + cardsData[i].image + '"><div class="cardFooter">' + '<span class="cardTitle" title="' + title + '">' + title + "</span> " + '<div class="cardDescription">' + '<div class="stars-outer">' + '<div class="stars-inner" style="width:' + ratings + '" ></div>' + "</div>" + "</div>" + "</div>" + "</div>";

		cards += item;
	}

	var cardContents = '<div id="paginated_cards" class="cards"> <div class="cards_scroller">' + cards + '  <span class="arrow prev fa fa-chevron-circle-left "></span> <span class="arrow next fa fa-chevron-circle-right" ></span> </div> </div>';

	return cardContents;
}

//====================================== Quick Replies ==================================================

function showQuickReplies(quickRepliesData) {
	var chips = ""
	for (i = 0; i < quickRepliesData.length; i++) {
		var chip = '<div class="chip" data-payload=\'' + (quickRepliesData[i].payload) + '\'>' + quickRepliesData[i].title + '</div>'
		chips += (chip)
	}

	var quickReplies = '<div class="quickReplies">' + chips + '</div><div class="clearfix"></div>'
	$(quickReplies).appendTo(".chats").fadeIn(1000);
	scrollToBottomOfResults();
	const slider = document.querySelector('.quickReplies');
	let isDown = false;
	let startX;
	let scrollLeft;

	slider.addEventListener('mousedown', (e) => {
		isDown = true;
		slider.classList.add('active');
		startX = e.pageX - slider.offsetLeft;
		scrollLeft = slider.scrollLeft;
	});
	slider.addEventListener('mouseleave', () => {
		isDown = false;
		slider.classList.remove('active');
	});
	slider.addEventListener('mouseup', () => {
		isDown = false;
		slider.classList.remove('active');
	});
	slider.addEventListener('mousemove', (e) => {
		if (!isDown) return;
		e.preventDefault();
		const x = e.pageX - slider.offsetLeft;
		const walk = (x - startX) * 3; //scroll-fast
		slider.scrollLeft = scrollLeft - walk;
	});

}

// on click of quickreplies, get the value and send to rasa
$(document).on("click", ".quickReplies .chip", function () {
	var text = this.innerText;
	var payload = this.getAttribute('data-payload');
	console.log("chip payload: ", this.getAttribute('data-payload'))
	setUserResponse(text);
	send(payload);

	//delete the quickreplies
	$(".quickReplies").remove();

});

//====================================== Get User Location ==================================================
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getUserPosition, handleLocationAccessError);
	} else {
		response = "Geolocation is not supported by this browser.";
	}
}

function getUserPosition(position) {
	response = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
	console.log("location: ", response);

	//here you add the intent which you want to trigger 
	response = '/inform{"latitude":' + position.coords.latitude + ',"longitude":' + position.coords.longitude + '}';
	$("#userInput").prop('disabled', false);
	send(response);
	showBotTyping();
}

function handleLocationAccessError(error) {

	switch (error.code) {
		case error.PERMISSION_DENIED:
			console.log("User denied the request for Geolocation.")
			break;
		case error.POSITION_UNAVAILABLE:
			console.log("Location information is unavailable.")
			break;
		case error.TIMEOUT:
			console.log("The request to get user location timed out.")
			break;
		case error.UNKNOWN_ERROR:
			console.log("An unknown error occurred.")
			break;
	}

	response = '/inform{"user_location":"deny"}';
	send(response);
	showBotTyping();
	$(".usrInput").val("");
	$("#userInput").prop('disabled', false);


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
