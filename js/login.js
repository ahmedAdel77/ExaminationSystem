
var fullName, email, gender;

var Student = function (fullName, email, gender) {  
    this.fullName = fullName;
    this.email = email;
    this.gender = gender;
};

var student = new Student();

function getGender () {  
    if (document.querySelector('#gender1').checked) {
        gender = document.querySelector('#gender1').value;
    } else if (document.querySelector('#gender2').checked) {
        gender = document.querySelector('#gender2').value;
    }
};

document.querySelector('.form-btn').addEventListener('click', function () {  
    fullName = document.querySelector('#fullname').value;
    email = document.querySelector('#email').value;
    getGender();
    
    student.fullName = fullName;
    student.email = email;
    student.gender = gender;
    
    // alert(student.fullName);
    // alert(student.email);
    // alert(student.gender);

    var queryString = "?fullname=" + student.fullName + "&email=" + student.email + "&gender=" + student.gender;
    window.location.href = "index.html" + queryString;

});

            