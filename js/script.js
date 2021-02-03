const STORE = {
 questions: {
  Data_Science: [
   {
    question: "Welche beiden Programme sind Standard für Data Science?",
    code: ``,
    answers: [
     "R und Python",
     "Powerpoint und Word",
     "Excel und RapidMiner",
    ],
    correctAnswer: "R und Python"
   },{
    question: "Warum sind Datenbanken so wichtig?",
    code: ``,
    answers: [
     "Sie verwalten und speichern Daten.",
     "Sie sind ein Werkzeug für die Website-Erstellung.",
     "Sie sind ein Tool für die firmeninterne Zusammenarbeit.",
    ],
    correctAnswer: "Sie verwalten und speichern Daten."
   }
  ],
  Datenschutz: [
   {
    question: "Was müssen Sie mit einem Dienstleister abschließen, wenn dieser mit Ihren Kundendaten in Berührung kommt?",
    code: ``,
    answers: [
     "Auftragsdatenverarbeitung",
     "Letter of Intent",
     "Rahmenvertrag",
    ],
    correctAnswer: "Auftragsdatenverarbeitung"
   },{
    question: "Welche Stelle ist damit beauftragt, Datenschutz-bezogene Prozesse zu erstellen?",
    code: ``,
    answers: [
     "IT-Leitung",
     "Datenschutzbeauftragte(r)",
     "Chief Information Officer",
    
    ],
    correctAnswer: "Datenschutzbeauftragte(r)"
   }
  ],
  Frontend_Backend: [
   {
    question: "Was passiert in professionellen Firmen, wenn Sie ein Online-Formular ausfüllen und auf 'Abschicken' klicken?",
    code: ``,
    answers: [
     "Die IT-Leitung wird über den Inhalt des Formulares per E-Mail benachrichtigt.",
     "Der Inhalt des Formulares wird in eine Firmen-Datenbank geschrieben, die mit dem Formular verknüpft ist.",
    ],
    correctAnswer: "Der Inhalt des Formulares wird in eine Firmen-Datenbank geschrieben, die mit dem Formular verknüpft ist."
   },{
    question: "Was macht ein Data Warehouse?",
    code: ``,
    answers: [
     "Es sichert Daten für die gesetzliche Aufbewahrungsfrist.",
     "Es holt sich Daten aus verschiedenen Quellen und macht diese analysierbar.",
     "Es ist ein Warenwirtschaftssystem für das Lager.",
    ],
    correctAnswer: "Es holt sich Daten aus verschiedenen Quellen und macht diese analysierbar."
   },{
    question: "Was sind API (Application Programming Interfaces)?",
    code: ``,
    answers: [
     "Die Startseiten von Websites, die die NutzerInnen beim ersten Aufruf der Website sehen.",
     "Schnittstellen zu anderen Programmen oder Datenbanken, mit Hilfe derer zusätzliche Funktionen in digitale Produkte eingebaut werden können.",
     "Eine Programmiersprache für die Verwaltung von Datenbanken.",
    ],
    correctAnswer: "Schnittstellen zu anderen Programmen oder Datenbanken, mit Hilfe derer zusätzliche Funktionen in digitale Produkte eingebaut werden können."
   },
  ],
  Anbieter: [
   {
    question: "Welche sind die beiden großen Standbeine von AWS (Amazon Web Services)?",
    code: ``,
    answers: [
     "Rechenleistung und Speicherplatz aus der Cloud.",
     "ERP-Systeme und Buchhaltungsprogramme wie SAP und Oracle.",
     "Web-Suche und Werbung wie bei Google.",
    ],
    correctAnswer: "Rechenleistung und Speicherplatz aus der Cloud."
   },
  ],
  Hacking: [
   {
    question: "Was ist eine SQL Injection?",
    code: ``,
    answers: [
     "Eine Hackingmethode, bei der Datenbanken angegriffen werden - oft über schlecht programmierte Websites oder Apps.",
     "Ein Lahmlegen und Umleiten von Websites.",
     "Das Senden von E-Mails mit bösartigem Inhalt, um den Computer der jeweiligen Person in Geiselhaft zu nehmen.",
    ],
    correctAnswer: "Eine Hackingmethode, bei der Datenbanken angegriffen werden - oft über schlecht programmierte Websites oder Apps."
   }
  ]
 }
};


// Make the quiz. Create a model for our app's state
function makeQuiz(){
	// Creating an object to store the app's state when beginning the quiz
	return {
		// Gathering a random question out of the available questions for each category
		questions: helpers.getRandomQuestions(STORE),
		// Boolean for if the quiz is in progress or not
		midQuiz: false,
		// Array of correct/incorrect answers to use for our progress bar
		progress: {
			progressBar: [],
			incorrectCategories: []
		},
		// Boolean to determine if the end state should display
		completed: false,
		// Monitoring which question we are currently on
		currentQuestion: 0,
		// Keeps track of total correct answers
		correctAnswers: 0,
		// Keeps current selected answer
		currentAnswer: "",
		// Keeps track of % completed
		percCorrect: 0
	}
}

// Apply fadeOut animations and set the stage for DOM text/element changes
function $fade(appState){

	// This is the completed state of of a quiz
	if(appState.completed){
		
		// Fade out elements with a promise to avoid choppy behavior
		$.when($('.question-answer-wrapper, .question-wrapper, .answer-wrapper').fadeOut(500))
			.done(function(){

				// Display results of the quiz
				$showResults(appState);
				$('.results-wrapper').hide().removeClass('hide');
				$('.question-answer-wrapper, .results-wrapper').fadeIn(500);
	    });

	// This is if the app is just starting
	} else if(appState.midQuiz === false){

		// Set a flag that the app has begun
		appState.midQuiz = true;
		// Fade out elements with a promise to avoid choppy behavior
		$.when($('.question-answer-wrapper, .question-wrapper, .code, .answer-wrapper, .start-quiz, .quit-quiz, .results-wrapper, .progress, .progress-bar').fadeOut(500))
			.done(function(){
				// Remove any progress from a previous quiz (if any);
				helpers.updateProgressBar(appState);
				$('.progress-count').html('1 / 5');
				$('.progress-perc').html('');
				// Kill previous results
				$('.failures').remove();
				// Lots to do... mostly just setting up a new environment for a new quiz
				$updateQuestion(appState);
				$('progress-bar').empty();
				$('progress-fill').html('Progress: <span class="progress-count">1 / 10</span><span class="progress-perc"></span>');
				$('.question-answer-wrapper, .answer-wrapper').removeClass('begin');
				$('.submit-btn, .progress, .progress-bar').removeClass('hide');
				$('.progress, .progress-bar').hide();
				$('.question-answer-wrapper, .question-wrapper, .answer-wrapper, .progress, .progress-bar').fadeIn(500);
				if(!$('.code').hasClass('hide')){$('.code').fadeIn(500)};
	    });

	// This is if the app is in the middle of execution
	} else if(appState.midQuiz){
		$.when($('.question-answer-wrapper, .question-wrapper, .answer-wrapper').fadeOut(500))
			.done(function(){
				$updateQuestion(appState);
				$('.question-answer-wrapper, .question-wrapper, .answer-wrapper').fadeIn(500);
	    });
	}
}

// Work in progress...
function $showResults(appState){
	if(appState.correctAnswers === 10){
		let endMsg = `Sie haben ${appState.percCorrect}% richtig!
Wir können Ihnen nichts mehr beibringen. Bravo!
`;
	} else {
		$('.answer-btn').remove();
		let endMsg = `Sie haben ${appState.percCorrect}% richtig!`
		let endFeedback = ``;
		if(appState.progress.incorrectCategories.length === 0){
			endFeedback = `Prima gemacht!`;
		} else {
			endFeedback = `Sie könnten sich noch einmal folgende Themen anschauen:`;
		}
		
		$('.quiz-end-score').html(endMsg);
		let $failList = $('<ul class="failures"></ul>');
		appState.progress.incorrectCategories.map((cat => {
			$failList.append("<li class='category'>" + cat + "</li>");
		}));
		$('.quiz-end-feedback-p').html(endFeedback);
		$('.quiz-end-categories').append($failList);
		$('.results-wrapper').removeClass('hide').css('display', 'flex');
		$('.question-answer-wrapper, .results-wrapper, .quiz-end-feedback, .quiz-end-score, .retry-btn').css('display', 'flex').fadeIn(500);		
	}

}

// Update the question, code, answers, buttons in the DOM while we're in a faded out state
function $updateQuestion(appState){
	$('.answer-btn').remove();

	// Update the question and code text with the current question
	$('.question').html(appState.questions[appState.currentQuestion].question);

	// This is a hack to hide/show the code portion
	// Only 1/3 of the questions contain code so we hide it if they aren't present
	if(appState.questions[appState.currentQuestion].code == ``){
		$('.code').addClass('hide');
	} else {
		$('.code').removeClass('hide');
		$('.code').html(`<pre>${appState.questions[appState.currentQuestion].code}</pre>`);
	}
	
	// Change continue back to submit
	$('.continue-btn')
		.val("Auswählen")
		.removeClass('continue-btn')
		.addClass('submit-btn')
		.prop('disabled', true);

	// Add in available answers for the question
	let $answers = [];

	// Adding the answers to a temporary array
	for(let i=0; i<appState.questions[appState.currentQuestion].answers.length; i++){

		// Add current question answers to an array
		let $answer = $('<button class="answer-btn" type="button"></button>');
		$answer.html(appState.questions[appState.currentQuestion].answers[i]);
		$answers.push($answer);
	}

	// Shuffle the answers
	helpers.shuffleAnswers($answers)

	// Push answers to the DOM
	$answers.forEach((answer) => {
		$('.answer-wrapper').prepend(answer);
	});
}

// Simple class and enable/disable DOM selection when answer is selected
function selectAnswer(answer){
	$('.answer-btn').removeClass('selected');
	answer.addClass('selected');
	$('.submit-btn').prop('disabled', false);
}

// Answer is selected and submitted
// Push a feedback state
function submitAnswer(appState){

	// This will be returned true or false based on their answer
	let correct;

	// Add styles to the answers to show if their answer was correct or not
	$('.answer-btn').each(function () {
		if($(this).html() === appState.questions[appState.currentQuestion].correctAnswer){
			$(this).addClass('pass');
			// If answer is correct and selected...
			if($(this).hasClass('selected')){
				correct = "pass";
				appState.correctAnswers++;
				appState.questions[appState.currentQuestion];
			}

		// Handle correct answer if selected answer is incorrect
		} else if ($(this).hasClass('selected')){
			$(this).addClass('fail dim-answer');
			correct = "fail";
			appState.progress.incorrectCategories.push(appState.questions[appState.currentQuestion].category);

		// Dim the other answers to make the correct one more prevalent
		} else {
			$(this).addClass('dim-answer');
		}
	});

	// Add a progress bar indicator to our appState object
	appState.progress.progressBar.push(`<div class="progress-indicator ${correct}"></div>`);
	
	// Update our percent correct (parse a float and set it to a fixed percentage)
	appState.percCorrect = parseFloat(appState.correctAnswers / (appState.currentQuestion + 1) * 100).toFixed();

	// Update our current question VS total quiz length
	$('.progress-count').html(`
		${appState.currentQuestion + 1} / ${appState.questions.length}
	`);

	// Update our current correct percentage
	$('.progress-perc').html(`
		 // ${(appState.percCorrect)}% Richtig
	`)

	// Change submit back to continue
	$('.submit-btn')
		.val("Weiter")
		.removeClass('submit-btn')
		.addClass('continue-btn')

	// Disable selecting answers
	$('.answer-btn').prop("disabled", true);

	// Update our progress-bar DOM
	helpers.updateProgressBar(appState);

	// Continue to next question
	appState.currentQuestion++;

	// Verify if we're done or not
	if(appState.currentQuestion === appState.questions.length){
		appState.completed = true;
	}
	
}

// Silly easter egg for saying you don't want to do the quiz
function killQuiz(){
	$('.start-quiz, .quit-quiz').hide();
	let failureMsg = "You didn't grow. You didn't improve. You took a shortcut and gained nothing. You experienced a hollow victory. Nothing was risked and nothing was gained. It's sad you don't know the difference..."
	let msgSplit = failureMsg.split(" ");
	let counter = 0;
	$('.question').empty();
	let startTroll = setInterval(function () {
		$('.question').append(msgSplit[counter] + " ");
		counter++;
		if(counter > msgSplit.length - 1){
  			clearInterval(startTroll);
  			$('.start-quiz').text('You can do it! Start Quiz').fadeIn(500);
		}
	}, 250);
}

// These are simple algorithms to modify data that don't need an individual function
let helpers = {
	// Pick a random question from the available ones
	pickRandomQ: function(obj,section){
		return Math.floor(Math.random() * obj.questions[section].length);		
	},
	// Gather a random question from every category
	getRandomQuestions: function(obj){
		let questions = [];
		let categories = Object.keys(obj.questions);
		categories.forEach((cat) => {
			let randomQ = this.pickRandomQ(obj,cat);
			let question = obj.questions[cat][randomQ];
			question.category = cat;
			questions.push(question);
		});
		return questions;
	},
	// Shuffle the answers so they don't appear in the same order
	shuffleAnswers: function(arr){
	    for (var i = arr.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = arr[i];
	        arr[i] = arr[j];
	        arr[j] = temp;
	    }
	},
	// Update progress bar DOM element
	updateProgressBar: function(appState){
		$('.progress-bar').empty();
		appState.progress.progressBar.forEach((progInd => {
			$('.progress-bar').append(progInd);
		}))
	}
}

// Lets start the show
$(function(){

	// Kill any form refresh
	$('.answer-wrapper').on('submit', function(e){
		e.preventDefault();
	});

	// Storage for quiz app state
	let quizData;

	// Start quiz
	$('.start-quiz, .retry-btn').on('click', function(){
		quizData = makeQuiz();
		$fade(quizData);
	});

	// Select an answer
	$('.question-answer-wrapper').on('click', '.answer-btn', function(){
		selectAnswer($(this));
	})

	// Submit your answer to display feedback and advance question counter
	$('.question-answer-wrapper').on('click', '.submit-btn', function(e){
		submitAnswer(quizData);
	});

	// Submit your answer to display feedback and advance question counter
	$('.question-answer-wrapper').on('click', '.continue-btn', function(){
		$fade(quizData);
	});

	// Easter egg to chastize the user
	$('.quit-quiz').on('click', function(){
		killQuiz();
	})
})
