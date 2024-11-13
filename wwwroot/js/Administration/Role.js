import { notification, notificationErrors } from "../Utility/notification.js";

$(document).ready(async function () {
    await GetRoleList();
    console.log("This is Role File ");
});

async function GetRoleList() {
    debugger
    try {
        const roles = await $.ajax({
            url: '/Role/GetallRole',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (roles && roles.data) { // Check if orders and orders.data exist
            onSuccess(roles.data);
        }
    } catch (error) {
        console.log('Error:', error);

    }
}


function onSuccess(roles) {
    debugger

    if (roles) {
        // Merge roles and user data
        var mergedData = roles.map(function (role) {
            if (role) {
                return {
                    id: role.id,
                    roleName: role.roleName,
                };

            }
            return null; // Skip if any data not found
        }).filter(Boolean); // Remove null entries

        $('#GasHub_RoleTable').dataTable({
            destroy: true,
            processing: true,
            lengthChange: true,
            lengthMenu: [[5, 10, 20, 30, -1], [5, 10, 20, 30, 'All']],
            searching: true,
            ordering: true,
            paging: true,
            data: mergedData,
            columns: [
                {
                    data: 'roleName',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'id',
                    render: function (data) {
                        return '<button class="btn btn-danger btn-sm ms-1" onclick="deleteRole(\'' + data + '\')">Delete</button>';
                            
                    }
                }
            ]
        });
    }
}




//======================================================================



// Initialize validation
const GasHub_Role_Form = $('#GasHub_Role_Form').validate({
    onkeyup: function (element) {
        $(element).valid();
    },
    rules: {
        RoleName: {
            required: true,
        }
    },
    messages: {
        RoleName: {
            required: " Trader Name is required.",
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
$('#userDropdown, #productDropdown, #ReturnProductDropdown').on('change focus', function () {
    GasHub_Role_Form.element($(this));
});
function resetValidation() {
    GasHub_Role_Form.resetForm(); // Reset validation
    $('.form-group .invalid-feedback').remove(); // Remove error messages
    $('#GasHub_Role_Form input').removeClass('is-invalid'); // Remove error styling
}


$('#GasHub_Role_btn-Create').off("click").click(function (e) {
    e.preventDefault;
    $('#GasHub_Role_modelCreate input[type="text"]').val('');
    $('#GasHub_Role_modelCreate').modal('show');
    $('#btnSave').show();
    $('#btnUpdate').hide();
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
$('#GasHub_Role_modelCreate').on('shown.bs.modal', function () {
    $('#GasHub_Role_Form input:first').focus();
});

// Listen for Enter key press on input fields
$('#GasHub_Role_modelCreate').on('keypress', 'input', handleEnterKey);

//======================================================================
// Submit button click event
$('#btnSave').off("click").click(async function (e) {
    e.preventDefault;
    debugger
    // Check if the form is valid
    if ($('#GasHub_Role_Form').valid()) {
        // Proceed with form submission
        var formData = $('#GasHub_Role_Form').serialize();
        console.log(formData);
        try {
            var response = await $.ajax({
                url: '/Role/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            if (response.success === true && response.status === 200) {
                // Show success message
                notification({ message: "Role Created successfully !", type: "success", title: "Success" });
                await GetRoleList();
                $('#GasHub_Role_Form')[0].reset();
                $('#GasHub_Role_modelCreate').modal('hide');
            } else {
                notificationErrors({ message: response.errorMessage });
                $('#GasHub_Role_modelCreate').modal('hide');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
});

window.deleteRole = function (id) {
    debugger
    $('#GasHub_Role_deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(async function () {
        try {
            const response = await $.ajax({
                url: '/Role/Delete',
                type: 'POST',
                data: { id: id }
            });
            if (response) {
                notification({ message: "Role was successfully deleted.", type: "success", title: "Success" });
                $('#GasHub_Role_deleteAndDetailsModel').modal('hide');
                await GetRoleList();
            }
        } catch (error) {
            console.log(error);
            $('#GasHub_Role_deleteAndDetailsModel').modal('hide');
        }
    });
}


