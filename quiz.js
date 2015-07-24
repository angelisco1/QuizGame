var read = require('read');


var Question = function(qText, qAnswer, qId){
	this.qText = qText;
	this.qAnswer = qAnswer;
	this.qId = qId;

	this.showQuestion = function(){
		console.log("\n------------------\n# " + this.qId + "\n" + this.qText + "\n");
	}

	this.isCorrect = function(answer){
		if(this.qAnswer === answer){
			return true;
		}
		return false;
	}

}

var Quiz = function(){

	this.questionList = [];
	this.i = 0;

	this.addQuestion = function(qText, qAnswer){
		question = new Question(qText, qAnswer, this.getLastId());
		this.questionList.push(question);
	}

	this.getLastId = function(){
		return this.questionList.length + 1;
	}

	this.showAllQuestions = function(){
		this.questionList.forEach(function(question){
			console.log("\n------------------\n" + question.qText + "\n--> " + question.qAnswer + "\n# " + question.qId);
		});
	}

	this.checkAnswer = function(userAnswer, question){
		return question.isCorrect(userAnswer);
	}

	this.game = function(){
			if(this.i < this.questionList.length){
				this.questionList[this.i].showQuestion();
				options = {
					prompt: "Introduzca su respuesta...\n > "
				};				
				read(options, this.play.bind(this));
			}else{
				console.log("There are not more questions...");
			}
	}

	this.play = function(err, userAnswer){
		if(err){
			throw err;
		}
		console.log(this.questionList[this.i].qAnswer);
		var question = this.questionList[this.i];
		if(this.checkAnswer(userAnswer, question)){
			this.i++;
			console.log("Your answer is correct...");
		}else{
			console.log("Your answer is incorrect :(... Try again");
		}
		this.game();
	}

}

quiz = new Quiz();

quiz.addQuestion("How many hearts have an octopus??", "3");
quiz.addQuestion("Which element is heaviest, Mg or Mn??", "Mn");
quiz.addQuestion("Who sang 'My Way'??", "Frank Sinatra");
quiz.addQuestion("Where are the Dolomites??", "Italy");
quiz.addQuestion("What is the capital of Australia??", "Canberra");

quiz.game();
