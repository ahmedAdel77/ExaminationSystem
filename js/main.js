////////////////////////////
// DATA CONTROLLER MODULE //
////////////////////////////

var DataController = (function () {

    function Question(question, answers, correctAnswer, flagged = false) {
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
        this.flagged = flagged;

    }

    function Answer(id, ans) {
        this.id = id;
        this.ans = ans;
    }

    var questions, randomQuestions, flaggedQuestions, userAnswers, firstQuestionOfRandom;

    questions = [
        new Question('How many months do we have in a year?', ['9 months', '12 months', '10 months', '11 months'], '12 months'),
        new Question('How many days do we have in a week?', ['8 days', '6 days', '10 days', '7 days'], '7 days'),
        new Question('How many days are there in a year?', ['364 days', '368 days', '365 days', '366 days'], '365 days'),
        new Question('What is 2+2?', ['2', '6', '4', '1'], '4'),
        new Question('Which number comes after 6?', ['6', '7', '8', '5'], '7'),

    ];

    randomQuestions = [];
    flaggedQuestions = [];
    score = 0;

    userAnswers = [];

    for (var i = 0; i < questions.length; i++) {
        userAnswers.push(new Answer(i + 1, ''));
    }

    return {
        questions,
        randomQuestions,
        flaggedQuestions,
        userAnswers,
        score,


        generateRandomQuestion: function () {
            return questions[Math.floor(Math.random() * questions.length)];
        },
        generateRandomList: function () {

            this.randomQuestions = [];
            var q;
            var isExisted = false;

            q = this.generateRandomQuestion();
            this.randomQuestions.push(q);

            console.log(this.randomQuestions.length);
            console.log(this.randomQuestions[0]);

            while (this.randomQuestions.length < this.questions.length) {

                q = this.generateRandomQuestion();
                console.log(q);

                this.randomQuestions.forEach(element => {
                    if (element === q) {
                        isExisted = true;
                    }

                });
                if (!isExisted) {
                    this.randomQuestions.push(q);
                    console.log(this.randomQuestions.length);
                }

                isExisted = false;
            }
            return this.randomQuestions;
        },
        setScore: function () {
            this.score = 0;
            for (var i = 0; i < questions.length; i++) {
                if (this.userAnswers[i].ans === this.randomQuestions[i].correctAnswer) {
                    this.score += 1;
                }
            }
            return this.score;
        },
        updateFlag: function (questionIndex) {
            if (!(this.randomQuestions[questionIndex].flagged)) {
                this.randomQuestions[questionIndex].flagged = true;
            } else {
                this.randomQuestions[questionIndex].flagged = false;
            }
        },

    }

})();

//////////////////////////
// UI CONTROLLER MODULE //
//////////////////////////

var UIController = (function () {

    var str, questionToView;
    return {
        getUrl: function (url) {
            var params = {};
            var parser = document.createElement('a');
            parser.href = url;
            var query = parser.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                params[pair[0]] = decodeURIComponent(pair[1]);
                // console.log(params);
            }
            return params;
        },
        viewQuestion: function (listOfQuestions, questionIndex = 0) {

            questionToView = listOfQuestions[questionIndex];
            str = `<div class="question"><h2 class="question__number">Question #%QNo%</h2><h4 class="question__header">%QHeader%</h4><div class="question__answers"><input type="radio" name="answer" id="answer-1" value="%QAnswerValue1%"><p><strong>a.</strong> %QAnswer1%</p><input type="radio" name="answer" id="answer-2" value="%QAnswerValue2%"><p><strong>b.</strong> %QAnswer2%</p><input type="radio" name="answer" id="answer-3" value="%QAnswerValue3%"><p><strong>c.</strong> %QAnswer3%</p><input type="radio" name="answer" id="answer-4" value="%QAnswerValue4%"><p><strong>d.</strong> %QAnswer4%</p></div><div class="question__buttons"><button class="question_btn" id="btn-previous" type="button"><i class="fa fa-arrow-left" id="icon-previous" aria-hidden="true"></i><span id="btn-text-previous">Previous</span></button><button class="question_btn" id="btn-flag" type=""><i class="fa fa-flag-o" id="icon-flag" aria-hidden="true"></i><span id="btn-text-flag">Flag</span></button><button class="question_btn" id="btn-next" type=""><span id="btn-text-next">Next</span><i class="fa fa-arrow-right" id="icon-next" aria-hidden="true"></i></button></div>        <div class="question__buttons"><button class="question_btn" id="btn-submit" type=""><span id="btn-text-submit">Submit</span><i class="fa fa-send-o" id="icon-submit" aria-hidden="true"></i></button></div></div>`;
            str = str.replace('%QNo%', questionIndex + 1);
            str = str.replace('%QHeader%', questionToView.question);
            for (var i = 0; i < questionToView.answers.length; i++) {
                str = str.replace('%QAnswer' + (i + 1) + '%', questionToView.answers[i]);
                str = str.replace('%QAnswerValue' + (i + 1) + '%', questionToView.answers[i]);
            }

            document.querySelector('.questions-container').innerHTML = str;
            //   document.querySelector('.questions-container').insertAdjacentHTML('beforeend', str);

            if (questionIndex === 0) {
                document.querySelector('#btn-previous').setAttribute("disabled", "");
            } else {
                document.querySelector('#btn-previous').removeAttribute("disabled", "");
            }

            if (questionIndex === listOfQuestions.length - 1) {
                document.querySelector('#btn-next').setAttribute("disabled", "");
            } else {
                document.querySelector('#btn-next').removeAttribute("disabled", "");
            }

            this.updateFlaggedButton(questionToView);
            this.updateCheckedAnswers(questionToView, questionIndex);

            console.log(questionToView.flagged);

            return questionToView;

        },
        updateFlaggedPanel: function () {

            var falggedQuestion = document.querySelectorAll('.flagged__question');
            falggedQuestion.forEach(function (item) {
                item.parentNode.removeChild(item);
            });

            for (var i = 0; i < DataController.randomQuestions.length; i++) {
                if (DataController.randomQuestions[i].flagged) {
                    document.querySelector('.flagged__list').insertAdjacentHTML('beforebegin', `<li class="flagged__question" id="falggedQuestion-` + (i + 1) + `"  data-QNo="` + i + `" ><a href="#" class="flagged__question-link" data-QNo="` + i + `">` + `Question #` + (i + 1) + `</a></li>`);
                }
            }
        },
        updateFlaggedButton: function (questionToView) {

            if (questionToView.flagged) {
                console.log('flagged');
                // document.querySelector('#icon-flag').classList.replace('fa-flag-o', 'fa-flag');
                document.querySelector('#icon-flag').classList.remove('fa-flag-o');
                document.querySelector('#icon-flag').classList.add('fa-flag');
                document.querySelector('#btn-flag').lastElementChild.textContent = 'Flagged';
                // document.querySelector('#btn-flag').lastElementChild.style.color = 'darkred';

            } else {
                console.log('Unflagged');
                // document.querySelector('#icon-flag').classList.replace('fa-flag', 'fa-flag-o');
                document.querySelector('#icon-flag').classList.remove('fa-flag');
                document.querySelector('#icon-flag').classList.add('fa-flag-o');
                document.querySelector('#btn-flag').lastElementChild.textContent = 'Flag';
            }
        },

        updateCheckedAnswers: function (question, questionIndex) {

            document.querySelectorAll('[name="answer"]').checked = false;
            for (var i = 0; i < question.answers.length; i++) {
                if (document.querySelector('#answer-' + (i + 1)).value === DataController.userAnswers[questionIndex].ans) {
                    document.querySelector('#answer-' + (i + 1)).checked = true;
                }
            }

        },
        // flagQuestions: function (questions) {  
        //     str = questions.firstChild.firstElementChild.textContent;
        //     document.querySelector('.flagged__list').insertAdjacentHTML( 'beforeend', `<li class="flagged__question" data-QNo=""><a href="#">`+ str +`</a></li>`);
        //     // var flaggedQ;
        //     // // document.querySelector
        //     // DataController.randomQuestions.forEach(function(item) {
        //     //     if (item.flagged) {
        //     //         console.log(item);
        //     //         // flaggedQ = this.questo;
        //     //         // document.querySelector('.flagged__list').innerHTML = `<li class="flagged__question"><a href="#">Question #`+ (flaggedQ+1) +`</a></li>`;
        //     //     }
        //     // });
        // },

    }
})();

///////////////////////////
// APP CONTROLLER MODULE //
///////////////////////////

var AppController = (function (DataCtrl, UICtrl) {

    var randomList, currentQuestion, returnSkipFLag = false;
    return {
        init: function () {

            // Generate Random List of Questions
            randomList = DataCtrl.generateRandomList();
            console.log(randomList);

            // View Questions Through UI
            currentQuestion = UICtrl.viewQuestion(randomList);
            console.log(currentQuestion);

            document.querySelector('.flagged-questions-container').addEventListener('click', function (event) {
                var target = event.target;
                var targetClass = target.classList.value;
                var targetID = target.id;
                console.log(target)
                console.log(targetID)
                console.log(targetClass)

                returnSkipFLag = true;

                if (targetClass === 'flagged__question' || targetClass === 'flagged__question-link') {
                    console.log('aywa flag');
                    console.log(randomList);
                    console.log(target.dataset.qno);
                    UICtrl.viewQuestion(randomList, parseInt(target.dataset.qno));
                }
            });

            document.querySelector('.questions-container').addEventListener('click', function (event) {
                var target = event.target;
                var targetID = target.getAttribute('id');
                var targetName = target.getAttribute('name');
                console.log(target);
                console.log(targetID);
                console.log(targetName);

                if (targetName === 'answer') {
                    DataCtrl.userAnswers[randomList.indexOf(currentQuestion)].ans = target.value;
                }

                if (targetID === 'btn-next' || targetID === 'icon-next' || targetID === 'btn-text-next') {
                    if ((randomList.indexOf(currentQuestion) + 1) < randomList.length) {
                        if (returnSkipFLag === false) {
                            currentQuestion = UICtrl.viewQuestion(randomList, randomList.indexOf(currentQuestion) + 1);
                        } else {
                            currentQuestion = UICtrl.viewQuestion(randomList, randomList.indexOf(currentQuestion));
                            returnSkipFLag = false;
                        }
                    }

                } else if (targetID === 'btn-previous' || targetID === 'icon-previous' || targetID === 'btn-text-previous') {

                    if ((randomList.indexOf(currentQuestion) - 1) >= 0) {
                        currentQuestion = UICtrl.viewQuestion(randomList, randomList.indexOf(currentQuestion) + -1);
                    }

                } else if (targetID === 'btn-submit' || targetID === 'icon-submit' || targetID === 'btn-text-submit') {
                    var s = DataCtrl.setScore();
                    console.log(s);
                    var studentData = UICtrl.getUrl(window.location.href);
                    console.log(studentData.fullname);

                    var queryString = "?fullname=" + studentData.fullname + "&score=" + s + "&fullscore=" + DataCtrl.randomQuestions.length;
                    window.location.href = "result.html" + queryString;



                } else if (targetID === 'btn-flag' || targetID === 'icon-flag' || targetID === 'btn-text-flag') {
                    console.log(target);
                    console.log(targetID);
                    console.log(this);                    

                    // Update Flagged Property Within A Question
                    DataCtrl.updateFlag(randomList.indexOf(currentQuestion));

                    // Update Flagged Button UI
                    UICtrl.updateFlaggedButton(currentQuestion);

                    // Update Flagged Panel UI
                    UICtrl.updateFlaggedPanel();

                }

            });

        }
    }

})(DataController, UIController);

AppController.init();