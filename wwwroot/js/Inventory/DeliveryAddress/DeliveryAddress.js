import { notification, notificationErrors } from "../../Utility/notification.js";

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
        if ($.fn.DataTable.isDataTable('#GasHub_Address_Table')) {
            // If initialized, destroy the DataTable first
            $('#GasHub_Address_Table').DataTable().destroy();
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
        $('#GasHub_Address_Table').dataTable({
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
                        return '<button class="btn btn-primary btn-sm ms-1" onclick="editAddress(\'' + row.id + '\')">Edit</button>' + ' ' +
                            '<button class="btn btn-info btn-sm ms-1" onclick="showDetails(\'' + row.id + '\')">Details</button>' + ' ' +
                            '<button class="btn btn-danger btn-sm ms-1" onclick="deleteAddress(\'' + row.id + '\')">Delete</button>';
                    }
                }
            ]
        });
    }
}



//======================================================================



// Initialize validation
const GasHub_Address_Form = $('#GasHub_Address_Form').validate({
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
$('#GasHub_Address_Form input[type="text"]').on('change', function () {
    GasHub_Address_Form.element($(this));
});
$('#GasHub_Address_Form input[type="text"]').on('focus', function () {
    GasHub_Address_Form.element($(this));
});
function resetValidation() {
    GasHub_Address_Form.resetForm(); // Reset validation
    $('.form-group .invalid-feedback').remove(); // Remove error messages
    $('#GasHub_Address_Form input').removeClass('is-invalid'); // Remove error styling
}


$('#GasHub_Address_btn-Create').click(function (e) {
    e.preventDefault;
    $('#GasHub_Address_modelCreate input[type="text"]').val('');
    $('#GasHub_Address_modelCreate').modal('show');
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
$('#GasHub_Address_modelCreate').on('shown.bs.modal', function () {
    $('#GasHub_Address_Form input:first').focus();
});

// Listen for Enter key press on input fields
$('#GasHub_Address_modelCreate').on('keypress', 'input', handleEnterKey);

//======================================================================
// Submit button click event
$('#btnSave').click(async function (e) {
    e.preventDefault;
    // Check if the form is valid
    if ($('#GasHub_Address_Form').valid()) {
        // Proceed with form submission
        var formData = $('#GasHub_Address_Form').serialize();
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
                notification({ message: "Your Delivery Address was successfully saved.", type: "success", title: "Success" });
                await GetDeliveryAddressList()
                $('#GasHub_Address_Form')[0].reset();
                $('#GasHub_Address_modelCreate').modal('hide');
            } else {
                notificationErrors({ message: response.errorMessage });
                $('#GasHub_Address_modelCreate').modal('hide');
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

// Edit Address
window.editAddress = async function (id) {
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
        $('#GasHub_Address_modelCreate').modal('show');
        // Update button click event handler
        $('#btnUpdate').off('click').on('click', function () {
            updateAddress(id);
        });
    } catch (error) {
        console.log('Error:', error);
    }
}

async function updateAddress(id) {
    debugger
    if ($('#GasHub_Address_Form').valid()) {
        const formData = $('#GasHub_Address_Form').serialize();
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
                notification({ message: "Your Delivery Address was successfully updated.", type: "success", title: "Success" });
                // Reset the form
                $('#GasHub_Address_Form')[0].reset();
                // Update the company list
                $('#GasHub_Address_modelCreate').modal('hide');
                await GetDeliveryAddressList();
            } else {
                notificationErrors({ message: response.errorMessage });
                $('#GasHub_Address_modelCreate').modal('hide');
            }
        } catch (error) {
            notificationErrors({ message: error.message });
        }
    }
}

// Details Company
//async function showDetails(id) {
//    $('#GasHub_Address_deleteAndDetailsModel').modal('show');
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

window.deleteAddress = function (id) {
    $('#GasHub_Address_deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(async function () {
        try {
            const response = await $.ajax({
                url: '/DeliveryAddress/Delete',
                type: 'POST',
                data: { id: id }
            });
            if (response.success === true && response.status === 200) {
                $('#GasHub_Address_deleteAndDetailsModel').modal('hide');
                notification({ message: "Your Delivery Address was successfully Delete.", type: "success", title: "Success" });
                await GetDeliveryAddressList()
            } else {
                notificationErrors({ message: response.errorMessage });
                $('#GasHub_Address_deleteAndDetailsModel').modal('hide');
            }
            
        } catch (error) {
            notificationErrors({ message: error.message });
            $('#GasHub_Address_deleteAndDetailsModel').modal('hide');
        }
    });
}


