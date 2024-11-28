import { notification, notificationErrors } from '../Utility/gashyb_notification.js';
$(document).ready(async function () {
    await GetUserList();
});

async function GetUserList() {
    debugger
    try {
        const users = await $.ajax({
            url: '/User/GetallUser',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        if (users && users.data) {
            console.log('companies:', users.data);
            onSuccess(users.data);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

function onSuccess(users) {
    debugger
    if (users) {
        if ($.fn.DataTable.isDataTable('#GasHub_UserTable')) {
            // If initialized, destroy the DataTable first
            $('#GasHub_UserTable').DataTable().destroy();
        }

        // Merge company and user data
        var mergedData = users.map(function (user) {

            if (user) {
                return {
                    id: user.id,
                    email: user.email,
                    fullName: user.firstName + ' ' + user.lastName,
                    phone: user.phoneNumber,
                    image: user.userImg,
                    userName: user.userName,
                    
                };
            }
            return null; // Skip if user not found
        }).filter(Boolean); // Remove null entries
        console.log('onSuccess:', mergedData);
        $('#GasHub_UserTable').dataTable({
            processing: true,
            lengthChange: true,
            lengthMenu: [[5, 10, 20, 30, -1], [5, 10, 20, 30, 'All']],
            searching: true,
            ordering: true,
            paging: true,
            data: mergedData,
            columns: [
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return '<img src="' + row.image + '" alt="Image">';
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return row.fullName;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return row.userName;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return row.email;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return row.phone;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return '<button class="btn btn-primary btn-sm ms-1" onclick="editCompany(\'' + row.id + '\')"disabled>Edit</button>' + ' ' +
                            '<button class="btn btn-info btn-sm ms-1" onclick="showDetails(\'' + row.id + '\')"disabled>Details</button>' + ' ' +
                            '<button class="btn btn-danger btn-sm ms-1" onclick="deleteCompany(\'' + row.id + '\')">Delete</button>';
                    }
                }
            ]
        });
    }
}








// Initialize validation
const GasHub_UserForm = $('#GasHub_UserForm').validate({
    onkeyup: function (element) {
        $(element).valid();
    },
    rules: {
        FirstName: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        LaststName: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        UserName: {
            required: true,
        },
        Email: {
            required: true,
        },
        PhoneNumber: {
            required: true
        },
        Password: {
            required: true,
            pwcheck: true
        },
        ConfirmationPassword: {
            required: true
        },
        Roles: {
            required: true
        }

        ,
        TraderId: {
            required: true
        }
    },
    messages: {
        FirstName: {
            required: " first Name is required.",
            minlength: "first Name must be between 2 and 50 characters.",
            maxlength: "first Name must be between 2 and 50 characters."
        },
        LaststName: {
            required: "Lastst Name  is required.",
            minlength: "Lastst Name  must be between 2 and 50 characters.",
            maxlength: "Lastst Name  must be between 2 and 50 characters."
        },
        UserName: {
            required: "User Name  is required.",
            minlength: "User Name   must be between 2 and 50 characters.",
            maxlength: "User Name   must be between 2 and 50 characters."
        },
        Email: {
            required: "Email is required.",
           
        },
        PhoneNumber: {
            required: "Phone Number is required."
        }
        ,
        Password: {
            required: "Password is required.",
            pwcheck: "Password must contain at least one lowercase letter (a-z)." 
        }
        ,
        ConfirmationPassword: {
            required: "Confirmation Your Password ."
        },
        Roles: {
            required: "Must be select Roles "
        }
    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid');
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid');
    }
});
$.validator.addMethod("pwcheck", function (value) {
    return /[a-z]/.test(value); // At least one lowercase letter
});
// Bind validation on change
$('#GasHub_UserForm input[type="text"]').on('change', function () {
    GasHub_UserForm.element($(this));
});
$('#GasHub_UserForm input[type="text"]').on('focus', function () {
    GasHub_UserForm.element($(this));
});
function resetValidation() {
    GasHub_UserForm.resetForm(); // Reset validation
    $('.form-group .invalid-feedback').remove(); // Remove error messages
    $('#GasHub_UserForm input').removeClass('is-invalid'); // Remove error styling
}


$('#GasHub_btn-Create').off("click").click(async function (e) {
    debugger
    e.preventDefault;
    $('#GasHub_modelCreate input[type="text"]').val('');
    $('#GasHub_modelCreate').modal('show');
    $('#btnSave').show();
    $('#btnUpdate').hide();
    await populateRoleDropdown();
    await populateTraderDropdown();
});

async function populateRoleDropdown() {
    debugger
    try {
        const data = await $.ajax({
            url: '/Role/GetallRole',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Clear existing options
        $('#RolesDropdown').empty();
        // Add default option
        //$('#RolesDropdown').append('<option value="">Select role</option>');
        // Add user options
        console.log(data.data);
        $.each(data.data, function (index, role) {
            $('#RolesDropdown').append('<option value="' + role.roleName + '">' + role.roleName + '</option>');
        });
    } catch (error) {
        console.error(error);
        // Handle error
    }
}
async function populateTraderDropdown() {
    debugger
    try {
        const data = await $.ajax({
            url: '/Trader/GetallTrader',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Clear existing options
        $('#TraderDropdown').empty();
        // Add default option
        $('#TraderDropdown').append('<option value="">Select Trader</option>');
        // Add user options
        console.log(data.data);
        $.each(data.data, function (index, role) {
            $('#TraderDropdown').append('<option value="' + role.id + '">' + role.name + '</option>');
        });
    } catch (error) {
        console.error(error);
        // Handle error
    }
}



// Function to handle Enter key press
function handleEnterKey(event) {
    if (event.keyCode === 13) { // Check if Enter key is pressed
        event.preventDefault(); // Prevent default form submission
        if ($('#btnSave').is(":visible")) {
            $('#btnSave').click(); // Trigger save button click if Save button is visible
        } else if ($('#btnUpdate').is(":visible")) {
            $('#btnUpdate').click(); // Trigger update button click if Update button is visible
        }
    }
}


// Open modal and focus on the first input field
$('#GasHub_modelCreate').on('shown.bs.modal', function () {
    $('#GasHub_UserForm input:first').focus();
});

// Listen for Enter key press on input fields
$('#GasHub_modelCreate').on('keypress', 'input', handleEnterKey);

// Submit button click event
$('#btnSave').off("click").click(async function (e) {
    e.preventDefault;
    debugger
    // Check if the form is valid
    if ($('#GasHub_UserForm').valid()) {
        // Proceed with form submission
        var formData = $('#GasHub_UserForm').serialize();
        try {
            const response = await $.ajax({
                url: '/User/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });
            $('#UserError').text('Username is already taken.').hide();
            $('#EmailError').text('Email is already taken.').hide();
            if (response.success && response.status === 200) {
                // Show success message
                await GetUserList();
                $('#GasHub_UserForm')[0].reset();
                $('#GasHub_modelCreate').modal('hide');
                notification({ message: "User Created successfully !", type: "success", title: "Success" });
            } else if (response.errorMessage) {
                // Display specific error messages
                if (response.errorMessage.includes("DuplicateUserName")) {
                    $('#UserError').text('Username is already taken.').show();
                } else if (response.errorMessage.includes("DuplicateEmail")) {
                    $('#EmailError').text('Email is already taken.').show();
                } else {
                    $('#GeneralError').text('Failed to save the user: ' + response.errorMessage).show();
                }
            }
        } catch (jqXHR) {
            var errorMessage = jqXHR.responseText || "Unknown error occurred";
            console.log('Error:', errorMessage);
            notificationErrors({ message: "An unexpected error occurred. Please try again." });
        }
    }
});

window.deleteCompany = function (id) {
    
    $('#GasHub_deleteAndDetailsModel').modal('show');
    $('#companyDetails').empty();
    $('#btnDelete').off('click').on('click', function (e) { // Unbind previous events first
        e.preventDefault;
        $.ajax({
            url: '/User/Delete',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                $('#GasHub_deleteAndDetailsModel').modal('hide');
                notification({ message: "User was successfully deleted.", type: "success", title: "Success" });
                GetUserList();
            },
            error: function (xhr, status, error) {
                console.log(error);
                $('#GasHub_deleteAndDetailsModel').modal('hide');
            }
        });
    });
};

