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
				"messages": [{ "role": "user", "content": message }],
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
	} catch (error) {
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
				"messages": [{ "role": "user", "content": message }],
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
	} catch (error) {
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

	}).then(data => {
		console.log(data)
		console.log(typeof data)
		console.log(Object.keys(data))
		console.log(data['choices'][0].text)

	})
		.catch(error => {
			console.log('Something bad happened ' + error)
		});

}
