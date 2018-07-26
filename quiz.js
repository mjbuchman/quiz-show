(function(){
    var app = angular.module('Quiz Show', []);

    app.controller('QuizController',['$scope','$http','$sce',function($scope,$http,$sce){

        $scope.activeQuestion = -1;
        $scope.activeQuestionAnswered = 0;
        $scope.lives = 1;
        $scope.level = 0;
        $scope.gameover = false;
        $scope.clicked = false;
        $scope.quoteText = "Good Luck! Try not to lose!";

        $http.get('quiz_data.json').then(function(quizData){
            $scope.myQuestions = quizData.data;
            $scope.totalQuestions = $scope.myQuestions.length;
        });

        $http.get('quotes.json').then(function(quoteData){
            $scope.myQuotes = quoteData.data;
        });

        $scope.gameScreenState = function(){
            if($scope.activeQuestion < 0){
                return 'inactive';
            }else if($scope.activeQuestion === 10){
                $scope.quoteText = $scope.myQuotes[2].quote;
                return 'done';
            }else if($scope.activeQuestion > 10){
                $scope.quoteText = $scope.myQuotes[3].quote;
                return 'gameover';
            }else{
                return 'active';
            }
        }

        $scope.selectAnswer = function(qIndex, aIndex){
            var questionState = $scope.myQuestions[qIndex].questionState;

            if( questionState != 'answered' ){
                $scope.myQuestions[qIndex].selectedAnswer = aIndex;
                var correctAnswer = $scope.myQuestions[qIndex].correct;
                $scope.myQuestions[qIndex].correctAnswer = correctAnswer;

                if( aIndex === correctAnswer ){
                    $scope.myQuestions[qIndex].correctness = 'correct';
                    $scope.quoteText = $scope.myQuotes[0].quote;
                }else{
                    $scope.myQuestions[qIndex].correctness = 'incorrect';
                    $scope.lives--;
                    $scope.quoteText = $scope.myQuotes[1].quote;
                }
                $scope.myQuestions[qIndex].questionState = 'answered';
            }

            $scope.clicked = false;
        }

        $scope.isSelected = function(qIndex, aIndex){
            return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
        }

        $scope.isCorrect = function(qIndex, aIndex){
            return $scope.myQuestions[qIndex].correctAnswer === aIndex;
        }

        $scope.fillText = function(){
            var num = Math.floor(Math.random() * ($scope.myQuotes.length-4)) + 4;
            console.log(num);
            $scope.quoteText = $scope.myQuotes[num].quote;
        }

        $scope.selectContinue = function(){
            if($scope.clicked === false){
                $scope.level++;

                if($scope.lives === 0){
                    $scope.gameover = true;
                    $scope.level--;
                }
                $scope.clicked = true;
                $scope.fillText();

                return $scope.activeQuestion++;
            }
            return;
        }

        $scope.gameOverStatus = function(qIndex){
            if($scope.gameover === false){
                return 'inactive';
            }else{
                $scope.activeQuestion = 11;
                return 'active';
            }
        }

        $scope.reset = function(){
            document.location.reload();
        }

    }]);

})();
