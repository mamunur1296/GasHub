
$('#btnRegister').click(async function (e) {
    e.preventDefault(); // Corrected spelling
    debugger
    // Check if the form is valid
    if (true) {
        // Proceed with form submission
        var formData = $('#Registerform').serialize();
        try {
            const response = await $.ajax({
                url: '/Public/CreateUser',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });
            console.log(response)
            if (response) { // Assuming the server returns { success: true } upon successful registration
                // Show success message
                $('#successMessage').text('Your company was successfully saved.');
                $('#successMessage').show();
                $('#Registerform')[0].reset();
                window.location.href = '/Public/Login';
                console.log(response)
            } else {
                // Show error message if registration failed
                $('#errorMessage').text('Registration failed. Please try again.');
                $('#errorMessage').show();
            }
        } catch (error) {
            console.log('Error:', error);
            // Show error message
            $('#errorMessage').text('An error occurred while processing your request.');
            $('#errorMessage').show();
        }
    }
});




$('#btnLogin').click(async function (e) {
    e.preventDefault(); // Corrected spelling
    debugger
    // Check if the form is valid
    if (true) {
        // Proceed with form submission
        var formData = $('#loginform').serialize();
        try {
            const response = await $.ajax({
                url: '/Public/LoginUser',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });
            console.log(response)
            if (response) { // Assuming the server returns { success: true } upon successful registration
                // Show success message
                $('#successMessage').text('Your company was successfully saved.');
                $('#successMessage').show();
                $('#loginform')[0].reset();
                window.location.href = '/Home';
                console.log(response)
            } else {
                // Show error message if registration failed
                $('#errorMessage').text('Registration failed. Please try again.');
                $('#errorMessage').show();
            }
        } catch (error) {
            console.log('Error:', error);
            // Show error message
            $('#errorMessage').text('An error occurred while processing your request.');
            $('#errorMessage').show();
        }
    }
});











//// Initialize validation
//const companyForm = $('#Registerform').validate({
//    rules: {
//        FirstName: {
//            required: true,
//            minlength: 2,
//            maxlength: 50
//        },
//        LaststName: {
//            required: true,
//            minlength: 2,
//            maxlength: 50
//        },
//        UserName: {
//            required: true,
//            minlength: 2, // Adjust the min length as per your requirements
//            maxlength: 50 // Adjust the max length as per your requirements
//        },
//        PhoneNumber: {
//            required: true,
//            digits: true,
//            minlength: 11,
//            maxlength: 11
//        },
//        Email: {
//            required: true,
//            email: true // Add email validation
//        },
//        Password: {
//            required: true,
//            minlength: 6 // Adjust the min length as per your requirements
//        },
//        ConfirmationPassword: {
//            required: true,
//            equalTo: '#Password' // Validate if it matches the password field
//        }
//    },
//    messages: {
//        FirstName: {
//            required: "First Name is required.",
//            minlength: "First Name must be between 2 and 50 characters.",
//            maxlength: "First Name must be between 2 and 50 characters."
//        },
//        LaststName: {
//            required: "Last Name is required.",
//            minlength: "Last Name must be between 2 and 50 characters.",
//            maxlength: "Last Name must be between 2 and 50 characters."
//        },
//        UserName: {
//            required: "Username is required.",
//            minlength: "Username must be at least 2 characters long.",
//            maxlength: "Username must be less than 50 characters long."
//        },
//        PhoneNumber: {
//            required: "Phone Number is required.",
//            digits: "Phone Number must contain only digits.",
//            minlength: "Phone Number must be exactly 11 digits.",
//            maxlength: "Phone Number must be exactly 11 digits."
//        },
//        Email: {
//            required: "Email is required.",
//            email: "Please enter a valid email address."
//        },
//        Password: {
//            required: "Password is required.",
//            minlength: "Password must be at least 6 characters long."
//        },
//        ConfirmationPassword: {
//            required: "Confirmation password is required.",
//            equalTo: "Passwords do not match."
//        }
//    },
//    errorElement: 'div',
//    errorPlacement: function (error, element) {
//        error.addClass('invalid-feedback');
//        element.closest('.form-clt').append(error);
//    },
//    highlight: function (element, errorClass, validClass) {
//        $(element).addClass('is-invalid');
//    },
//    unhighlight: function (element, errorClass, validClass) {
//        $(element).removeClass('is-invalid');
//    }
//});


//// Bind validation on change
//$('#Registerform input[type="text"]').on('change', function () {
//    companyForm.element($(this));
//});
//$('#Registerform input[type="text"]').on('focus', function () {
//    companyForm.element($(this));
//});
//function resetValidation() {
//    companyForm.resetForm(); // Reset validation
//    $('.form-group .invalid-feedback').remove(); // Remove error messages
//    $('#Registerform input').removeClass('is-invalid'); // Remove error styling
//}
