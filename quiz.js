var read = require('read');
var fs = require('fs');


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
		if(this.qAnswer === answer.toLowerCase()){
			return true;
		}
		return false;
	}

}

var Quiz = function(){

	this.questionList = [];
	this.userList = [];
	this.i = 0;
	// this.totalScore = 0;
	this.currentUser = null;

	this.startGame = function(){
		this.selectBonusQuestion();
		// var data = loadData();
		// console.log(data);
		this.getUser();
	}

	this.getUser = function(){
		options = {
			prompt: "Are you registered??\n>"
		};				
		read(options, this.exitsUser.bind(this));
	}

	this.exitsUser = function(err, newUser){
		if(err){
			throw err;
		}
		switch(newUser){
			case "no":
				this.register();
				break;
			case "yes":
				this.login();
				break;
			default:
				this.getUser();
		}
	}

	this.login = function(){
		console.log("LOGIN:");
		options = {
			prompt: "Username: \n>"
		};				
		read(options, this.loadUser.bind(this));
	}

	this.register = function(){
		console.log("REGISTER:");
		options = {
			prompt: "New username: \n>"
		};				
		read(options, this.createUser.bind(this));
	}

	this.loadUser = function(err, name){
		if(err){
			throw err;
		}
		var users = this.userList.filter(function(user){
			return user.uName.toLowerCase() === name.toLowerCase();
		});
		this.currentUser = users.shift();
		if(this.currentUser !== null){
			this.i = this.currentUser.currentQ;
			this.game();
		}else{
			console.log("The user doesn't exist.");
			this.getUser();
		}
	}

	this.createUser = function(err, name){
		if(err){
			throw err;
		}
		this.addUser(name);
		var users = this.userList.filter(function(user){
			return user.uName === name;
		});
		this.currentUser = users.shift();
		if(this.currentUser !== null){
			this.i = this.currentUser.currentQ;
			this.game();
		}
	}

	this.game = function(){
		console.log(this.userList);
		if(this.i < this.questionList.length){
			console.log("You have " + this.currentUser.uPoints + " points.");
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
			console.log("You have got a total score of " + this.currentUser.uPoints + " points.");
			console.log("There are not more questions...");
		}
	}

	this.addQuestion = function(qText, qAnswer, qPoint){
		var question = new Question(qText, qAnswer, this.getLastId(), qPoint);
		this.questionList.push(question);
	}

	this.addUser = function(name){
		var user = new User(name, 0, 0);
		this.userList.push(user);
		console.log(this.userList);
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

	function loadData(){
		fs.readFile("./players.json", 'utf8', fileactions);
		    function fileactions(err, file){ 
		    if (err) {
		        throw err;
		    }
			data = JSON.parse(file);

		    //callback(searchFor(sortEpisodes(episodes)));
		}
		// this.getUser();
	}

	this.saveData = function(){
		var data = JSON.stringify(this.userList);
		fs.writeFile("./players.json", data, function(err){
			if(err){
				throw err;
			}
			console.log("It's saved.");
		});
	}

	this.play = function(err, userAnswer){
		if(err){
			throw err;
		}
		console.log(this.questionList[this.i].qAnswer);
		var question = this.questionList[this.i];
		if(userAnswer.toLowerCase() === "save"){
			//console.log(data);
			this.saveData();
		}else if(this.checkAnswer(userAnswer, question)){
			this.i++;
			var points = question.qPoint;
			var strCorrect = "Your answer is correct...";
			if(question.qBonus){
				points *= 2;
				strCorrect += "You get double points.";
			}
			this.currentUser.uPoints += points;
			console.log(strCorrect);
		}else{
			this.currentUser.uPoints -= 1;
			console.log("Your answer is incorrect :(... Try again");
		}
		this.game();
	}

}


var User = function(name, points, num){
	this.uName = name;
	this.uPoints = points;
	this.currentQ = num;


}

quiz = new Quiz();

quiz.addQuestion("How many hearts have an octopus??", "3", 5);
quiz.addQuestion("Which element is heaviest, Mg or Mn??", "mn", 6);
quiz.addQuestion("Who sang 'My Way'??", "frank sinatra", 6);
quiz.addQuestion("Where are the Dolomites??", "italy", 5);
quiz.addQuestion("What is the capital of Australia??", "canberra", 5);
quiz.addQuestion("How many months have 31 days??", "7", 3);
quiz.addQuestion("Who invented the telephone??", "bell", 5);

// quiz.addUser("Angel");

quiz.startGame();
