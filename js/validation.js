$(document).ready(function () {
    $("#submit").click(function () {
        
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var message = document.getElementById('message').value;
        var regexName = /^[a-zA-Z\s]*$/; 
        var regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

        if (name.length == 0) {
            alert("Please enter your name");
            event.preventDefault();
        }
        else if(regexName.test(name) == false) {
            alert("Please enter a valid name");
            event.preventDefault();
        }
        
        else if (email.length == 0) {
            alert("Please enter your email");
            event.preventDefault();
        }
        else if(regexEmail.test(email) == false) {
            alert("Please enter a valid email");
            event.preventDefault();
        }
        
        else if (message.length == 0) {
            alert("Please enter a message");
            event.preventDefault();
        }

       $("#formSubmit").submit(function(event) {
           event.preventDefault();
           var $form = $(this);
           url = $form.attr('action');
           var posting = $.post(
               url, {
                   contactname: $('#name').val(),
                   emailaddress: $('#email').val(),
                   message: $('#message').val()
                });
            });
        });
});
