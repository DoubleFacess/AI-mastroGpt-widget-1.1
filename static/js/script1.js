document.addEventListener("DOMContentLoaded", function () {
    // showBotTyping();
    // document.getElementById("userInput").disabled = true;

    let action_name = "action_greet_user";
    let user_id = "jitesh97";

    // Uncomment the line below if you want the bot to start the conversation
    // action_trigger();
});

function restartConversation() {
    document.querySelector(".usrInput").value = "";
    send("/restart");
}

function action_trigger() {
    // send an event to the bot, so that bot can start the conversation by greeting the user
    let user_id = "jitesh97";
    let action_name = "action_greet_user";
    let data = { "name": action_name, "policy": "MappingPolicy", "confidence": "0.98" };

    fetch(`http://localhost:5005/conversations/${user_id}/execute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(botResponse => {
        console.log("Response from Rasa: ", botResponse);

        if (botResponse.hasOwnProperty("messages")) {
            setBotResponse(botResponse.messages);
        }

        document.getElementById("userInput").disabled = false;
    })
    .catch(error => {
        // If there is no response from Rasa server
        setBotResponse("");
        console.log("Error from bot end: ", error);
        document.getElementById("userInput").disabled = false;
    });
}

document.querySelector(".usrInput").addEventListener("keyup", function (e) {
    var keyCode = e.keyCode || e.which;

    var text = document.querySelector(".usrInput").value;

    if (keyCode === 13) {
        if (text == "" || text.trim() == "") {
            e.preventDefault();
            return false;
        } else {
            document.getElementById("paginated_cards").remove();
            document.querySelector(".suggestions").remove();
            document.querySelector(".quickReplies").remove();
            document.querySelector(".usrInput").blur();
            setUserResponse(text);
            send(text);
            e.preventDefault();
            return false;
        }
    }
});

document.getElementById("sendButton").addEventListener("click", function (e) {
    var text = document.querySelector(".usrInput").value;
    if (text == "" || text.trim() == "") {
        e.preventDefault();
        return false;
    } else {
        document.querySelector(".suggestions").remove();
        document.getElementById("paginated_cards").remove();
        document.querySelector(".quickReplies").remove();
        document.querySelector(".usrInput").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
    }
});

function setUserResponse(message) {
    var userResponse = document.createElement('div');
    userResponse.innerHTML = '<img class="userAvatar" src="./static/img/userAvatar.png"><p class="userMsg">' + message + ' </p><div class="clearfix"></div>';
    document.querySelector(".chats").appendChild(userResponse);

    document.querySelector(".usrInput").value = "";
    scrollToBottomOfResults();
    showBotTyping();
    document.querySelector(".suggestions").remove();
}

function scrollToBottomOfResults() {
    var terminalResultsDiv = document.getElementById("chats");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

function send(message) {
    let user_id = "jitesh97";
    fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message, sender: user_id })
    })
    .then(response => response.json())
    .then(botResponse => {
        console.log("Response from Rasa: ", botResponse);

        if (message.toLowerCase() == '/restart') {
            document.querySelector(".chats").innerHTML = "";
            return;
        }

        setBotResponse(botResponse);
    })
    .catch(error => {
        setBotResponse("");
        console.log("Error from bot end: ", error);
    });
}

function setBotResponse(response) {
    setTimeout(function () {
        hideBotTyping();

        if (response.length < 1) {
            var fallbackMsg = "I am facing some issues, please try again later!!!";
            var botResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"/><p class="botMsg">' + fallbackMsg + '</p><div class="clearfix"></div>';
            document.querySelector(".chats").appendChild(createElementFromHTML(botResponse));
            scrollToBottomOfResults();
        } else {
            for (let i = 0; i < response.length; i++) {
                if (response[i].hasOwnProperty("text")) {
                    var botResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"/><p class="botMsg">' + response[i].text + '</p><div class="clearfix"></div>';
                    document.querySelector(".chats").appendChild(createElementFromHTML(botResponse));
                }

                if (response[i].hasOwnProperty("image")) {
                    var botResponse = '<div class="singleCard">' + '<img class="imgcard" src="' + response[i].image + '">' + '</div><div class="clearfix">';
                    document.querySelector(".chats").appendChild(createElementFromHTML(botResponse));
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
                        restaurantsData = (response[i].custom.data)
                        showCardsCarousel(restaurantsData);
                        return;
                    }
                }
            }
            scrollToBottomOfResults();
        }
    }, 500);
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

document.getElementById("profile_div").addEventListener("click", function () {
    document.querySelector(".profile_div").style.display = (document.querySelector(".profile_div").style.display === "none") ? "block" : "none";
    document.querySelector(".widget").style.display = (document.querySelector(".widget").style.display === "none") ? "block" : "none";
});

function addSuggestion(textToAdd) {
    setTimeout(function () {
        var suggestions = textToAdd;
        var suggLength = textToAdd.length;
        var singleCard = document.createElement("div");
        singleCard.className = "singleCard";
        singleCard.innerHTML = '<div class="suggestions"><div class="menu"></div></div>';
        document.querySelector(".chats").appendChild(singleCard).style.display = "none";

        for (var i = 0; i < suggLength; i++) {
            var menuChips = document.createElement("div");
            menuChips.className = "menuChips";
            menuChips.setAttribute("data-payload", suggestions[i].payload);
            menuChips.innerText = suggestions[i].title;
            document.querySelector(".menu").appendChild(menuChips);
        }

        scrollToBottomOfResults();
        singleCard.style.display = "block";
    }, 1000);
}

document.addEventListener("click", function (e) {
    var target = e.target;
    if (target.classList.contains("menuChips")) {
        var text = target.innerText;
        var payload = target.getAttribute('data-payload');
        console.log("payload: ", target.getAttribute('data-payload'));
        setUserResponse(text);
        send(payload);
        document.querySelector(".suggestions").remove();
    }

    if (target.id === "close") {
        document.querySelector(".profile_div").style.display = "none";
        document.querySelector(".widget").style.display = "none";
        scrollToBottomOfResults();
    }

    if (target.id === "restart") {
        restartConversation();
    }
});

function showCardsCarousel(cardsToAdd) {
    var cards = createCardsCarousel(cardsToAdd);
    document.querySelector(".chats").appendChild(cards).style.display = "block";

    if (cardsToAdd.length <= 2) {
        document.querySelector(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").style.display = "block";
    } else {
        for (var i = 0; i < cardsToAdd.length; i++) {
            document.querySelector(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").style.display = "block";
        }
        document.querySelector(".cards .arrow.prev").style.display = "block";
        document.querySelector(".cards .arrow.next").style.display = "block";
    }

    scrollToBottomOfResults();

    const card = document.querySelector("#paginated_cards");
    const card_scroller = card.querySelector(".cards_scroller");
    var card_item_size = 225;

    card.querySelector(".arrow.next").addEventListener("click", scrollToNextPage);
    card.querySelector(".arrow.prev").addEventListener("click", scrollToPrevPage);

    function scrollToNextPage() {
        card_scroller.scrollBy(card_item_size, 0);
    }

    function scrollToPrevPage() {
        card_scroller.scrollBy(-card_item_size, 0);
    }
}

function createCardsCarousel(cardsData) {
    var cards = "";

    for (var i = 0; i < cardsData.length; i++) {
        var title = cardsData[i].name;
        var ratings = Math.round((cardsData[i].ratings / 5) * 100) + "%";
        var data = cardsData[i];
        var item = '<div class="carousel_cards in-left">' + '<img class="cardBackgroundImage" src="' + cardsData[i].image + '"><div class="cardFooter">' + '<span class="cardTitle" title="' + title + '">' + title + "</span> " + '<div class="cardDescription">' + '<div class="stars-outer">' + '<div class="stars-inner" style="width:' + ratings + '" ></div>' + "</div>" + "</div>" + "</div>" + "</div>";

        cards += item;
    }

    var cardContents = document.createElement("div");
    cardContents.id = "paginated_cards";
    cardContents.className = "cards";
    cardContents.innerHTML = '<div class="cards_scroller">' + cards + '  <span class="arrow prev fa fa-chevron-circle-left "></span> <span class="arrow next fa fa-chevron-circle-right" ></span> </div>';

    return cardContents;
}

function showQuickReplies(quickRepliesData) {
    var chips = "";
    for (var i = 0; i < quickRepliesData.length; i++) {
        var chip = '<div class="chip" data-payload=\'' + (quickRepliesData[i].payload) + '\'>' + quickRepliesData[i].title + '</div>';
        chips += (chip);
    }

    var quickReplies = document.createElement("div");
    quickReplies.className = "quickReplies";
    quickReplies.innerHTML = chips + '<div class="clearfix"></div>';
    document.querySelector(".chats").appendChild(quickReplies).style.display = "block";
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

document.addEventListener("click", function (e) {
    var target = e.target;
    if (target.classList.contains("chip")) {
        var text = target.innerText;
        var payload = target.getAttribute('data-payload');
        console.log("chip payload: ", target.getAttribute('data-payload'));
        setUserResponse(text);
        send(payload);
        document.querySelector(".quickReplies").remove();
    }
});

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

    // here you add the intent which you want to trigger
    response = '/inform{"latitude":' + position.coords.latitude + ',"longitude":' + position.coords.longitude + '}';
    document.getElementById("userInput").disabled = false;
    send(response);
    showBotTyping();
}

function handleLocationAccessError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }

    response = '/inform{"user_location":"deny"}';
    send(response);
    showBotTyping();
    document.querySelector(".usrInput").value = "";
    document.getElementById("userInput").disabled = false;
}

function showBotTyping() {
    var botTyping = document.createElement("div");
    botTyping.className = "botTyping";
    botTyping.innerHTML = '<div class="bounce1"></div>' + '<div class="bounce2"></div>' + '<div class="bounce3"></div>';
    document.querySelector(".chats").appendChild(botTyping).style.display = "block";
    scrollToBottomOfResults();
}

function hideBotTyping() {
    document.getElementById('botAvatar').remove();
    document.querySelector('.botTyping').remove();
}
