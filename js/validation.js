$(document).ready(function () {
    $("#submit").click(function () {
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var message = document.getElementById('message').value;

        if (name.length == 0) {
            alert("Please enter your name");
        }
        
        else if (email.length == 0) {
            alert("Please enter your email");
        }
        
        else if (message.length == 0) {
            alert("Please enter a message");
        }
    });
});