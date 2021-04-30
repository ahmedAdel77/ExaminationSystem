function getUrl(url) {
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
};

var studentData = getUrl(window.location.href);
var name = studentData.fullname;
var score = studentData.score;
var fullScore = studentData.fullscore;;

document.querySelector('.student-name').textContent = name;
document.querySelector('.student-name').style.text = 'uppercase';


document.querySelector('.student-score').textContent = score;
if (score <=  (fullScore / score) ) {
    document.querySelector('.student-score').style.color = 'rgb(252, 80, 80)';
    document.querySelector('.student-msg').innerHTML = 'We are sorry for you, ';
    document.querySelector('.result-body').insertAdjacentHTML('beforeend', '<p class="student-feedback">we are sure you could do better the next time ' +' 😊'+'.</p>')
    document.querySelector('.student-feedback').style.background = 'orange';
} else if (score === fullScore) {
    document.querySelector('.student-score').style.color = 'rgb(82, 223, 82)';
    document.querySelector('.student-msg').innerHTML = 'CONGRATULATIONS, ';
    document.querySelector('.result-body').insertAdjacentHTML('beforeend', '<p class="student-feedback">who is the BEST right now! ' +' 🎉'+'.</p>')
    document.querySelector('.student-feedback').style.background = 'limegreen';
}

else {
    document.querySelector('.student-score').style.color = 'rgb(87, 170, 190)';
    document.querySelector('.student-msg').innerHTML = 'Congrats, ';
    document.querySelector('.result-body').insertAdjacentHTML('beforeend', '<p class="student-feedback">you have passed it!' +' 😉'+'.</p>')
}


document.querySelector('.full-score').textContent = fullScore;
