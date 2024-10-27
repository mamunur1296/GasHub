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
        if ($.fn.DataTable.isDataTable('#CompanyTable')) {
            // If initialized, destroy the DataTable first
            $('#CompanyTable').DataTable().destroy();
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
        $('#CompanyTable').dataTable({
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
                        return '<button class="btn btn-primary btn-sm ms-1" onclick="editCompany(\'' + row.id + '\')">Edit</button>' + ' ' +
                            '<button class="btn btn-info btn-sm ms-1" onclick="showDetails(\'' + row.id + '\')">Details</button>' + ' ' +
                            '<button class="btn btn-danger btn-sm ms-1" onclick="deleteCompany(\'' + row.id + '\')">Delete</button>';
                    }
                }
            ]
        });
    }
}

// Initialize validation
const companyForm = $('#CompanyForm').validate({
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
            required: true
        },
        ConfirmationPassword: {
            required: true
        },
        Roles: {
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
            required: "Password is required."
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

// Bind validation on change
$('#CompanyForm input[type="text"]').on('change', function () {
    companyForm.element($(this));
});
$('#CompanyForm input[type="text"]').on('focus', function () {
    companyForm.element($(this));
});
function resetValidation() {
    companyForm.resetForm(); // Reset validation
    $('.form-group .invalid-feedback').remove(); // Remove error messages
    $('#CompanyForm input').removeClass('is-invalid'); // Remove error styling
}


$('#btn-Create').click(async function () {
    $('#modelCreate input[type="text"]').val('');
    $('#modelCreate').modal('show');
    $('#btnSave').show();
    $('#btnUpdate').hide();
    await populateRoleDropdown();
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
$('#modelCreate').on('shown.bs.modal', function () {
    $('#CompanyForm input:first').focus();
});

// Listen for Enter key press on input fields
$('#modelCreate').on('keypress', 'input', handleEnterKey);

// Submit button click event
$('#btnSave').click(async function () {
    debugger
    // Check if the form is valid
    if ($('#CompanyForm').valid()) {
        // Proceed with form submission
        var formData = $('#CompanyForm').serialize();
        try {
            const response = await $.ajax({
                url: '/User/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            $('#successMessage').text('New User was successfully saved.').hide();
            $('#UserError').text('Username is already taken.').hide();
            $('#EmailError').text('Email is already taken.').hide();
            if (response.success && response.status === 200) {
                // Show success message
                $('#successMessage').text('New User was successfully saved.');
                $('#successMessage').show();
                await GetUserList();
                $('#CompanyForm')[0].reset();
                $('#modelCreate').modal('hide');
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
            $('#GeneralError').text('An unexpected error occurred. Please try again.').show();
        }
    }
});

// Edit Company
//async function editCompany(id) {
//    console.log("Edit company with id:", id);
//    $('#myModalLabelUpdateEmployee').show();
//    $('#myModalLabelAddEmployee').hide();
//    // Reset form validation
//    debugger

//    try {
//        const data = await $.ajax({
//            url: '/Company/GetCompany/' + id,
//            type: 'get',
//            dataType: 'json',
//            contentType: 'application/json;charset=utf-8'
//        });

//        // Populate form fields with company data
//        $('#btnSave').hide();
//        $('#btnUpdate').show();
//        $('#Name').val(data.name);
//        $('#Contactperson').val(data.contactperson);
//        $('#ContactPerNum').val(data.contactPerNum);
//        $('#ContactNumber').val(data.contactNumber);
//        $('#BIN').val(data.bin);
//        debugger
//        resetValidation()
//        // Show modal for editing
//        $('#modelCreate').modal('show');
//        // Update button click event handler
//        $('#btnUpdate').off('click').on('click', function () {
//            updateCompany(id);
//        });
//    } catch (error) {
//        console.log('Error:', error);
//    }
//}


async function updateCompany(id) {
    if ($('#CompanyForm').valid()) {
        const formData = $('#CompanyForm').serialize();
        console.log(formData);
        try {
            const response = await $.ajax({
                url: '/Company/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            $('#modelCreate').modal('hide');
            if (response === true) {
                // Show success message
                $('#successMessage').text('Your company was successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#CompanyForm')[0].reset();
                // Update the company list
                await GetCompanyList();
            }
        } catch (error) {
            console.log('Error:', error);
            // Show error message
            $('#errorMessage').text('An error occurred while updating the company.');
            $('#errorMessage').show();
        }
    }
}

// Details Company
//async function showDetails(id) {
//    $('#deleteAndDetailsModel').modal('show');
//    // Fetch company details and populate modal
//    try {
//        const response = await $.ajax({
//            url: '/Company/GetCompany', // Assuming this is the endpoint to fetch company details
//            type: 'GET',
//            data: { id: id }
//        });

//        console.log(response);
//        // Assuming response contains company details
//        populateCompanyDetails(response);
//    } catch (error) {
//        console.log(error);
//    }
//}

function deleteCompany(id) {
    debugger
    $('#deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(function () {
        $.ajax({
            url: '/User/Delete',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                $('#deleteAndDetailsModel').modal('hide');
                $('#successMessage').text('  User was successfully Delete....');
                $('#successMessage').show();
                GetUserList();
            },
            error: function (xhr, status, error) {
                console.log(error);
                $('#deleteAndDetailsModel').modal('hide');
            }
        });
    });
}
