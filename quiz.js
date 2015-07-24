var read = require('read');


var Question = function(qText, qAnswer, qId, qPoint){
	this.qText = qText;
	this.qAnswer = qAnswer;
	this.qId = qId;
	this.qPoint = qPoint;
	this.qBonus = false;

	this.showQuestion = function(){
		console.log("\n------------------\n# " + this.qId + "\n" + this.qText + "\nPoints: " + this.qPoint + "\n");
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
	this.totalScore = 0;

	this.startGame = function(){
		this.selectBonusQuestion();
		this.game();
	}

	this.game = function(){
		if(this.i < this.questionList.length){
			console.log("You have " + this.totalScore + " points.");
			this.questionList[this.i].showQuestion();
			if(this.questionList[this.i].qBonus){
				console.log("This is a bonus question..." + 
					"If you answer correctly, you'll get double points." + 
					"Good luck!!!");
			}
			options = {
				prompt: "Introduzca su respuesta...\n > "
			};				
			read(options, this.play.bind(this));
		}else{
			console.log("You have got a total score of " + this.totalScore + " points.");
			console.log("There are not more questions...");
		}
	}

	this.addQuestion = function(qText, qAnswer, qPoint){
		question = new Question(qText, qAnswer, this.getLastId(), qPoint);
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

	this.selectBonusQuestion = function(){
		var randomId = Math.floor(Math.random()*this.questionList.length);
		this.questionList[randomId].qBonus = true;
	}


	this.play = function(err, userAnswer){
		if(err){
			throw err;
		}
		console.log(this.questionList[this.i].qAnswer);
		var question = this.questionList[this.i];
		if(this.checkAnswer(userAnswer, question)){
			this.i++;
			var points = question.qPoint;
			var strCorrect = "Your answer is correct...";
			if(question.qBonus){
				points *= 2;
				strCorrect += "You get double points.";
			}
			this.totalScore += points;
			console.log(strCorrect);
		}else{
			this.totalScore -= question.qPoint;
			console.log("Your answer is incorrect :(... Try again");
		}
		this.game();
	}

}


quiz = new Quiz();

quiz.addQuestion("How many hearts have an octopus??", "3", 5);
quiz.addQuestion("Which element is heaviest, Mg or Mn??", "Mn", 6);
quiz.addQuestion("Who sang 'My Way'??", "Frank Sinatra", 6);
quiz.addQuestion("Where are the Dolomites??", "Italy", 5);
quiz.addQuestion("What is the capital of Australia??", "Canberra", 5);
quiz.addQuestion("How many months have 31 days??", "7", 3);
quiz.addQuestion("Who invented the telephone??", "Bell", 5);

quiz.startGame();
