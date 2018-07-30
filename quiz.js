(function(){
    var app = angular.module('Quiz Show', []);

    app.controller('QuizController',['$scope','$http','$sce',function($scope,$http,$sce){

        $scope.activeQuestion = -1; // Keeps Track of current question
        $scope.lives = 1; // Sets number of lives (allows for modular game style)
        $scope.level = 0; // Controls scoreboard
        $scope.gameover = false; // Flags gameOverStatus
        $scope.clicked = false; // Used by continue button to prevent double clicks
        $scope.quoteText = "Good Luck! Try not to lose!"; // variable holding Mr. Quiz's dialouge
        $scope.currentQuestion = -1; // Used to randomize questions
        $scope.questionArray = []; //Used to prevent duplicate questions

        /* Grabs data from quiz-data file and stores it into useful variables */
        $http.get('quiz_data.json').then(function(quizData){
            $scope.myQuestions = quizData.data;
            $scope.totalQuestions = $scope.myQuestions.length;
            console.log($scope.totalQuestions);
        });

        /* Grabs data from quotes file and stores it into useful variables */
        $http.get('quotes.json').then(function(quoteData){
            $scope.myQuotes = quoteData.data;
        });

        /* Sets the secondary class of the game screen element */
        $scope.gameScreenState = function(){
            if($scope.activeQuestion < 0){ // If game has yet to start
                return 'inactive';
            }else if($scope.activeQuestion === 10){ // If game has been won
                $scope.quoteText = $scope.myQuotes[2].quote;
                return 'done';
            }else if($scope.activeQuestion > 10){ // If game has been lost
                $scope.quoteText = $scope.myQuotes[3].quote;
                return 'gameover';
            }else{ // Otherwise, remain in an active/visible state
                return 'active';
            }
        }

        /* Randomizes questions and prevents re-asking of any questions */
        $scope.selectQuestion = function(){
            if($scope.activeQuestion < 9 && $scope.gameover != true){  // Disable this function if game has ended
                var flag = false; // Used to determine whether the question number returned is viable
                var count = 0; // Used to determine whether the question number returned is viable
                while(flag === false){
                    $scope.currentQuestion = Math.floor(Math.random() * ($scope.totalQuestions));
                    for(i = 0; i < $scope.questionArray.length; i++){  // Iterate through already used questions
                        if($scope.currentQuestion === $scope.questionArray[i]){ // If current random number is in array increase count
                            count++;
                        }
                    }
                    if(count === 0){ // If count hasn't been increased -> random number hasn't been used
                        flag = true; // Exit while loop
                    }
                    count = 0; // Reset count prior to redoing the loop
                }
                $scope.questionArray.push($scope.currentQuestion); //Add the new number to the array
            }else{
                $scope.currentQuestion = -1;
            }
        }

        /* Controls the question element including its functionality and styling */
        $scope.selectAnswer = function(qIndex, aIndex){
            var questionState = $scope.myQuestions[qIndex].questionState; // Retrieves state of current question

            if(questionState != 'answered'){
                $scope.myQuestions[qIndex].selectedAnswer = aIndex;
                var correctAnswer = $scope.myQuestions[qIndex].correct;
                $scope.myQuestions[qIndex].correctAnswer = correctAnswer;

                if(aIndex === correctAnswer){ // If correct
                    $scope.myQuestions[qIndex].correctness = 'correct';
                    $scope.quoteText = $scope.myQuotes[0].quote;
                }else{  //If incorrect
                    $scope.myQuestions[qIndex].correctness = 'incorrect';
                    $scope.lives--;
                    $scope.quoteText = $scope.myQuotes[1].quote;
                }
                $scope.myQuestions[qIndex].questionState = 'answered'; // Deactivates question
            }
            $scope.clicked = false; // Prevents double clicking of continue button
        }

        /* Controls styling for selected answers */
        $scope.isSelected = function(qIndex, aIndex){
            return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
        }

        /* Controls styling for correct answers */
        $scope.isCorrect = function(qIndex, aIndex){
            return $scope.myQuestions[qIndex].correctAnswer === aIndex;
        }

        /* Randomizes Mr. Quiz's dialouge */
        $scope.fillText = function(){
            var num = Math.floor(Math.random() * ($scope.myQuotes.length-4)) + 4;
            console.log(num);
            $scope.quoteText = $scope.myQuotes[num].quote;
        }

        /* Controls functionality of continue button */
        $scope.selectContinue = function(){
            if($scope.clicked === false){ // Prevents double clicking
                $scope.level++; // Scoreboard level changes

                if($scope.lives === 0){ // Checks for game over
                    $scope.gameover = true;
                    $scope.level--;
                }
                $scope.clicked = true; // Button cannot be reclicked now
                $scope.fillText(); // Change Mr. Quiz's dialouge
                $scope.selectQuestion(); // Select next question

                return $scope.activeQuestion++; // Move on to next question
            }
            return;
        }

        /* Checks for game over */
        $scope.gameOverStatus = function(){
            if($scope.gameover === false){
                return 'inactive';
            }else{
                $scope.activeQuestion = 11;
                return 'active';
            }
        }

        /* Resets game by reloading the page from cache */
        $scope.reset = function(){
            document.location.reload();
        }

    }]);

})();
