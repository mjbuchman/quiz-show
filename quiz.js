(function(){
    var app = angular.module('Quiz Show', []);

    app.controller('QuizController',['$scope','$http','$sce',function($scope,$http,$sce){

        $scope.level = 0;
        $scope.activeQuestion = -1;
        $scope.activeQuestionAnswered = 0;

        $http.get('quiz_data.json').then(function(quizData){
            $scope.myQuestions = quizData.data;
            $scope.totalQuestions = $scope.myQuestions.length;
        });



    }]);

})();
