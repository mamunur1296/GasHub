$(document).ready(async function () {
    await GetDeliveryAddressList();
});

async function GetDeliveryAddressList() {
    try {
        const deliveryAddress = await $.ajax({
            url: '/DeliveryAddress/GetDeliveryAddressList',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        const userData = await $.ajax({
            url: '/User/GetallUser',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (deliveryAddress && deliveryAddress.data) {
            onSuccess(deliveryAddress.data, userData.data);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

function onSuccess(deliveryAddress, users) {
    debugger
    if (deliveryAddress) {
        if ($.fn.DataTable.isDataTable('#CompanyTable')) {
            // If initialized, destroy the DataTable first
            $('#CompanyTable').DataTable().destroy();
        }

        // Convert users array to a map for easy lookup
        var usersMap = {};
        users.forEach(function (user) {
            usersMap[user.id] = user;
        });

        // Merge company and user data
        var mergedData = deliveryAddress.map(function (deliveryAddres) {
            var user = usersMap[deliveryAddres.userId];
            if (user) {
                return {
                    id: deliveryAddres.id,
                    email: user.email,
                    fullName: user.firstName + ' ' + user.lastName,
                    phone: deliveryAddres.phone,
                    mobile: deliveryAddres.mobile,
                    address: deliveryAddres.address,
                    isActive: deliveryAddres.isActive
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
                        return row.fullName;
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
                        return row.mobile;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return row.address;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return row.isActive ? '<button class="btn btn-sm btn-primary rounded-pill">Yes</button>' : '<button class="btn btn-sm btn-danger rounded-pill">No</button>';
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



//======================================================================



// Initialize validation
const companyForm = $('#CompanyForm').validate({
    onkeyup: function (element) {
        $(element).valid();
    },
    rules: {
        UserId: {
            required: true,
        },
        Address: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        Phone: {
            required: true,
            digits: true,
            minlength: 11,
            maxlength: 11
        },
        Mobile: {
            required: true,
            digits: true,
            minlength: 11,
            maxlength: 11
        },
        BIN: {
            required: true
        }
    },
    messages: {
        UserId: {
            required: " User Name is required.",
        },
        Address: {
            required: "Address is required.",
            minlength: "Address must be between 2 and 50 characters.",
            maxlength: "Address must be between 2 and 50 characters."
        },
        Phone: {
            required: "Phone Number is required.",
            digits: "Phone Number must contain only digits.",
            minlength: "Phone Number must be exactly 11 digits.",
            maxlength: "Phone Number must be exactly 11 digits."
        },
        Mobile: {
            required: "Mobile is required.",
            digits: "Mobile must contain only digits.",
            minlength: "Mobile must be exactly 11 digits.",
            maxlength: "Mobile must be exactly 11 digits."
        },
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


$('#btn-Create').click(function () {
    $('#modelCreate input[type="text"]').val('');
    $('#modelCreate').modal('show');
    $('#btnSave').show();
    $('#btnUpdate').hide();
    populateUserDropdown();
});



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

//======================================================================
// Submit button click event
$('#btnSave').click(async function () {
    console.log("Save");
    // Check if the form is valid
    if ($('#CompanyForm').valid()) {
        // Proceed with form submission
        var formData = $('#CompanyForm').serialize();
        console.log(formData);
        try {
            var response = await $.ajax({
                url: '/DeliveryAddress/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Delivery Address was successfully saved.');
                $('#successMessage').show();
                await GetDeliveryAddressList()
                $('#CompanyForm')[0].reset();
                $('#modelCreate').modal('hide');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
});

async function populateUserDropdown() {
    try {
        const data = await $.ajax({
            url: '/User/GetallUser',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Clear existing options
        $('#userDropdown').empty();
        // Add default option
        $('#userDropdown').append('<option value="">Select User</option>');
        // Add user options
        console.log(data.data);
        $.each(data.data, function (index, user) {
            $('#userDropdown').append('<option value="' + user.id + '">' + user.userName + '</option>');
        });
    } catch (error) {
        console.error(error);
        // Handle error
    }
}

// Call the function to populate the dropdown when the page loads
populateUserDropdown();

// Optionally, you can refresh the user list on some event, like a button click
$('#refreshButton').click(function () {
    populateUserDropdown();
});

// Edit Company
async function editCompany(id) {
    console.log("Edit company with id:", id);
    $('#myModalLabelUpdateEmployee').show();
    $('#myModalLabelAddEmployee').hide();
    await populateUserDropdown();
    // Reset form validation
    debugger

    try {
        const data = await $.ajax({
            url: '/DeliveryAddress/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#userDropdown').val(data.userId);
        $('#address').val(data.address);
        $('#phone').val(data.phone);
        $('#mobile').val(data.mobile);

        debugger
        resetValidation()
        // Show modal for editing
        $('#modelCreate').modal('show');
        // Update button click event handler
        $('#btnUpdate').off('click').on('click', function () {
            updateCompany(id);
        });
    } catch (error) {
        console.log('Error:', error);
    }
}

async function updateCompany(id) {
    debugger
    if ($('#CompanyForm').valid()) {
        const formData = $('#CompanyForm').serialize();
        console.log(formData);
        try {
            var response = await $.ajax({
                url: '/DeliveryAddress/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Delivery Address was successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#CompanyForm')[0].reset();
                // Update the company list
                $('#modelCreate').modal('hide');
                await GetDeliveryAddressList();
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
//            url: '/Company/GetCompany',
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

async function deleteCompany(id) {
    $('#deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(async function () {
        try {
            const response = await $.ajax({
                url: '/DeliveryAddress/Delete',
                type: 'POST',
                data: { id: id }
            });
            if (response.success === true && response.status === 200) {
                $('#deleteAndDetailsModel').modal('hide');
                $('#successMessage').text('Your Delivery Address was successfully Delete.');
                $('#successMessage').show();
                await GetDeliveryAddressList()
            }
            
        } catch (error) {
            console.log(error);
            $('#deleteAndDetailsModel').modal('hide');
        }
    });
}


