document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;

document.body.style.backgroundImage = "url('/bg.png')";

// Initialize the knowledge base as an empty object
let knowledgeBase = {};

// Initialize IndexedDB
let db;

var rtm = `<button id="rtbtn" onclick="trainownans()">Retrain</button>`;

const request = indexedDB.open("knowledgeBaseDB", 1);

request.onupgradeneeded = function(event) {
	db = event.target.result;
	db.createObjectStore("knowledgeBaseStore", { keyPath: "question" });
};

request.onsuccess = function(event) {
	db = event.target.result;
	console.log("IndexedDB initialized successfully!");
	fetchKnowledgeBaseFromIndexedDB(); // Fetch the knowledge base from IndexedDB when the page loads
};

request.onerror = function(event) {
	console.error("Error initializing IndexedDB:", event.target.error);
};

function mesrep(txt) {
	document.getElementById("output").lastElementChild.insertAdjacentHTML("afterend", "<br><div class='botm me'><span>" + txt + "</span></div>");
	document.getElementById("output").scrollTo(0, document.getElementById("output").scrollHeight);
	updateTime();
}

// Define the updateInputAndMsend function in a global scope
window.updateInputAndMsend = function(question) {
	const inputElement = document.getElementById("inp");
	inputElement.value = question; // Update the input value with the selected question
	msend(); // Call the msend function to process the updated input
};


function mes(txt) {
	if (document.getElementById("rtbtn")) {
		document.getElementById("rtbtn").remove();
	}
	if (document.getElementById("suggs")) {
		document.getElementById("suggs").innerHTML = "...";
		document.getElementById("suggs").id = "";
	}
	document.getElementById("output").lastElementChild.insertAdjacentHTML("afterend","<br><div class='usm me'> " + txt + "</div>");
}

function msend() {
	if (document.getElementById("inp").value != "") {
		let x = document.getElementById("inp").value;
		document.getElementById("inp").value = "";
		mes(x);
		processUserInput(x);
	} else {
		if (document.getElementById("inp").value != "c") {
		document.getElementById("output").innerHTML = `<h2 class="name">MicroByte</h2><p>Developed By Antony Das. With Custom Licence at .</p>`;
		}
	}
}

document.getElementById("inp").addEventListener("keyup", function(event) {
	if (event.keyCode === 13 || event.key === "Enter") {
		msend();
	}
});

// Fetch the db.json file and use its content to update the knowledge base
fetch("/db.json")
	.then((response) => response.json())
	.then((data) => {
		// Merge the fetched data from db.json with the knowledge base from IndexedDB
		knowledgeBase = { ...knowledgeBase, ...data };

		// Save the updated knowledge base to IndexedDB
		saveKnowledgeBaseToIndexedDB();

		console.log("Knowledge base updated from db.json:", knowledgeBase);
	})
	.catch((error) => console.error("Error loading initial knowledge base:", error));

var lllbbbbooo;

function processUserInput(userInput) {
	const lowerCaseUserInput = userInput.toLowerCase().trim();
	lllbbbbooo = lowerCaseUserInput;
	const lowerCaseKnowledgeBase = {};

	// Convert the keys of the knowledgeBase object to lowercase
	for (const key in knowledgeBase) {
		lowerCaseKnowledgeBase[key.toLowerCase()] = knowledgeBase[key];
	}
	if ((lowerCaseUserInput.includes("+") || lowerCaseUserInput.includes("*") || lowerCaseUserInput.includes("/") || lowerCaseUserInput.includes("-") || lowerCaseUserInput.includes("=")) && lowerCaseUserInput.startsWith("what is")) {
		console.log("math id suc")
    mesrep(trimWordsUntilFirstNumber(lowerCaseUserInput) + " = " + eval(trimWordsUntilFirstNumber(lowerCaseUserInput)));
    return;
}


	function trimWordsUntilFirstNumber(input) {
		const match = input.match(/what is\s+([+\-*/0-9.]+)/i);
    if (match) {
        return match[1];
    }
    return "";
	}


	// Check if the lowercase userInput exists in the lowercase knowledge base
	if (lowerCaseKnowledgeBase.hasOwnProperty(lowerCaseUserInput)) {
		mesrep(lowerCaseKnowledgeBase[lowerCaseUserInput] + rtm);
	} else {
		// If user input is a question, find the best matching question using bigram matching
		if (userInput.endsWith(".")) {
		const statementKey = lowerCaseUserInput; // Use the full input as the key
		knowledgeBase[statementKey] = replaceWordsInStatement(userInput); // Store the user's statement as the value
		saveKnowledgeBaseToIndexedDB(); // Save the updated knowledge base
		mesrep("I Have Learned it! You can ask me a related question to this statement to get this data back.");
		return;
	} else {
			const bestMatch = findBestMatchingQuestion(lowerCaseUserInput);

			if (bestMatch) {
				// Respond with the answer to the similar question
				const similarAnswer = knowledgeBase[bestMatch];
				mesrep(similarAnswer + rtm);
			} else {
				const relatedQuestions = suggestRelatedQuestions(lowerCaseUserInput);

				// Generate HTML buttons for each related question
				const buttonsHTML = relatedQuestions.map(question => {
					return `<button class="related-question-button" onclick="updateInputAndMsend('${question}')">${question}</button>`;
				}).join("<br>") + "Can't see your question? Then train me the answer, <button class='related-question-button' style='background-color:dodgerblue;' onclick='trainownans()'>Train your own answer</button>";
				mesrep(`<div id="suggs">Did you mean, <br>${buttonsHTML}</div>`);
			}

			// Example usage
//const wordToDefine = 'apple';
//dcdefine(wordToDefine)
 // .then(definition => {
  //  if (definition === null) {
  //    alert('No internet connectivity.');
  //  } else {
  //    alert('Definition: ' + definition);
 //  }
 // });

			function updateInputAndMsend(question) {
				
				const inputElement = document.getElementById("inp");
				knowledgeBase[lowerCaseUserInput] = lowerCaseUserInput;
				inputElement.value = lllbbbbooo; // Update the input value with the selected question
				msend(); // Call the msend function to process the updated input
			}

		} 
	}
}

function dmode() {
	document.body.style.backgroundColor = "#393939";
	document.body.style.color = "#ffffff";
	document.getElementById("output").style.backgroundColor = "#1e1e1e";
}

function isInternetAvailable() {
  return navigator.onLine;
}

function dcdefine(word) {
  if (!isInternetAvailable()) {
    return null;
  }

  const scraper = new DictionaryScraper();

  return scraper.define({ word })
    .then(definition => {
      return definition;
    })
    .catch(error => {
      console.error('An error occurred:', error);
      return "Couldn't define";
    });
}


function trainownans() {
	if (knowledgeBase[lllbbbbooo] == "null") {
	knowledgeBase[lllbbbbooo] = prompt("Enter An Answer for: \n\n"+lllbbbbooo+"\n", knowledgeBase[lllbbbbooo]);
	
	} else {
		knowledgeBase[lllbbbbooo] = prompt("Enter An Answer for: \n\n"+lllbbbbooo+"\n");
	}
	saveKnowledgeBaseToIndexedDB(); // Save the updated knowledge base
}

function suggestRelatedQuestions(userInput) {
	const relatedQuestions = [];

	// Create an array to store question-score pairs
	const questionScores = [];

	// Calculate the similarity score for each question and store it in the array
	for (const question in knowledgeBase) {
		const score = similarity(userInput, question);
		questionScores.push({ question, score });
	}

	// Sort the question-score array in descending order based on the score
	questionScores.sort((a, b) => b.score - a.score);

	// Add the top three most similar questions to the relatedQuestions array
	for (let i = 0; i < Math.min(3, questionScores.length); i++) {
		relatedQuestions.push(questionScores[i].question);
	}

	console.log("Related Questions:", relatedQuestions);
	return relatedQuestions;
}




function replaceWordsInStatement(statement) {
	const replacements = {
		"my": "your",
		"your": "my",
		"i am":"you are",
		"you are":"i am"
		// Add more replacements as needed
	};

	// Split the statement into words and replace certain words
	const words = statement.split(/\s+/);
	const replacedWords = words.map(word => replacements[word] || word);

	// Join the words back to form the modified statement
	return replacedWords.join(" ");
}



function findBestMatchingQuestion(userInput) {
	let bestMatch = null;
	let bestMatchScore = 0;

	for (const question in knowledgeBase) {
		// Convert the knowledge base question to lowercase for case-insensitive matching
		const lowerCaseQuestion = question.toLowerCase().trim(); // Also trim the question to remove extra spaces

		const score = similarity(userInput, lowerCaseQuestion);
		if (score > bestMatchScore) {
			bestMatch = question;
			bestMatchScore = score;
		}
	}

	// Set a threshold score for similarity (adjust as needed)
	var threshold = document.getElementById("lr").value;


	// Return the best match only if it exceeds the threshold
	return bestMatchScore > threshold ? bestMatch : null;
}

function similarity(str1, str2) {
	const bigrams1 = new Set(generateNgrams(str1.toLowerCase(), 2));
	const bigrams2 = new Set(generateNgrams(str2.toLowerCase(), 2));

	const intersection = new Set([...bigrams1].filter((bigram) => bigrams2.has(bigram)));
	const union = new Set([...bigrams1, ...bigrams2]);

	return intersection.size / union.size;
}

function generateNgrams(text, n) {
	const ngrams = [];
	for (let i = 0; i < text.length - n + 1; i++) {
		ngrams.push(text.slice(i, i + n));
	}
	return ngrams;
}

function saveKnowledgeBaseToIndexedDB() {
	const transaction = db.transaction("knowledgeBaseStore", "readwrite");
	const store = transaction.objectStore("knowledgeBaseStore");

	// Clear the object store before saving the updated knowledge base
	store.clear();

	// Loop through the knowledgeBase object and save each question and answer as a separate record in IndexedDB
	for (const question in knowledgeBase) {
		const data = { question: question, answer: knowledgeBase[question] };
		store.add(data);
	}

	console.log("Knowledge base saved to IndexedDB!");
}

function fetchKnowledgeBaseFromIndexedDB() {
	const transaction = db.transaction("knowledgeBaseStore", "readonly");
	const store = transaction.objectStore("knowledgeBaseStore");
	const request = store.getAll();

	request.onsuccess = function(event) {
		const knowledgeBaseFromIndexedDB = {};

		// Convert the data fetched from IndexedDB into the knowledgeBase object format
		event.target.result.forEach((data) => {
			knowledgeBaseFromIndexedDB[data.question] = data.answer;
		});

		// Merge the knowledge base from IndexedDB with the existing knowledge base
		knowledgeBase = { ...knowledgeBase, ...knowledgeBaseFromIndexedDB };

		console.log("Knowledge base fetched from IndexedDB:", knowledgeBase);
	};

	request.onerror = function(event) {
		console.error("Error fetching knowledge base from IndexedDB:", event.target.error);
	};
}


function updateTime() {
  const spanElement = document.getElementById('timeSpan');
  const currentTime = new Date();
  spanElement.textContent = "Its " + currentTime.toLocaleTimeString();
}

		if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

document.body.onkeydown = function() {
	document.querySelector("#inp").focus()
}