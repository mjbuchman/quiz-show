(function(){
    var app = angular.module('Quiz Show', []);

    app.controller('QuizController',['$scope','$http','$sce',function($scope,$http,$sce){

        $scope.activeQuestion = -1;
        $scope.activeQuestionAnswered = 0;
        $scope.lives = 1;
        $scope.level = 0;

        $http.get('quiz_data.json').then(function(quizData){
            $scope.myQuestions = quizData.data;
            $scope.totalQuestions = $scope.myQuestions.length;
        });

        $scope.gameScreenState = function(){
            if($scope.activeQuestion < 0){
                return 'inactive';
            }else if($scope.activeQuestion === 10){
                return 'done';
            }else if($scope.activeQuestion > 10){
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
                }else{
                    $scope.myQuestions[qIndex].correctness = 'incorrect';
                    $scope.lives--;
                }
                $scope.myQuestions[qIndex].questionState = 'answered';
            }
        }

        $scope.isSelected = function(qIndex, aIndex){
            return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
        }

        $scope.isCorrect = function(qIndex, aIndex){
            return $scope.myQuestions[qIndex].correctAnswer === aIndex;
        }

        $scope.selectContinue = function(){
            $scope.level++;
            return $scope.activeQuestion++;
        }

        $scope.gameOverStatus = function(qIndex){
            if($scope.lives > 0){
                return 'inactive';
            }else{
                $scope.activeQuestion = 11;
                return 'active';
            }
        }

    }]);

})();
