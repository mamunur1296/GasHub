import { notification, notificationErrors } from "../../Utility/gashyb_notification.js";

$(document).ready(async function () {
    await GetCompanyList();
});

async function GetCompanyList() {
    debugger
    try {
        const data = await $.ajax({
            url: '/Company/GetCompanyList',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        if (data && data.data) {
            const companies = data.data;
            console.log('companies:', companies);
            onSuccess(companies);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

function onSuccess(companies) {
    if (companies) {
        if ($.fn.DataTable.isDataTable('#GasHub_CompanyTable')) {
            // If initialized, destroy the DataTable first
            $('#GasHub_CompanyTable').DataTable().destroy();
        }
        $('#GasHub_CompanyTable').dataTable({
            processing: true,
            lengthChange: true,
            lengthMenu: [[5, 10, 20, 30, -1], [5, 10, 20, 30, 'All']],
            searching: true,
            ordering: true,
            paging: true,
            data: companies,
            columns: [
                {
                    data: 'Name',
                    render: function (data, type, row, meta) {
                        return row.name;
                    }
                },
                {
                    data: 'Contactperson',
                    render: function (data, type, row, meta) {
                        return row.contactperson;
                    }
                },
                {
                    data: 'ContactPerNum',
                    render: function (data, type, row, meta) {
                        return row.contactPerNum;
                    }
                },
                {
                    data: 'ContactNumber',
                    render: function (data, type, row, meta) {
                        return row.contactNumber;
                    }
                },
                {
                    data: 'IsActive',
                    render: function (data, type, row, meta) {
                        return row.isActive ? '<button class="btn btn-sm btn-primary rounded-pill">Yes</button>' : '<button class="btn btn-sm btn-danger rounded-pill">No</button>';
                    }
                },
                {
                    data: 'BIN',
                    render: function (data, type, row, meta) {
                        return row.bin;
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
const GasHub_Company_Form = $('#GasHub_Company_Form').validate({
    onkeyup: function (element) {
        $(element).valid();
    },
    rules: {
        Name: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        Contactperson: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        ContactPerNum: {
            required: true,
            digits: true,
            minlength: 11,
            maxlength: 11
        },
        ContactNumber: {
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
        Name: {
            required: "Name is required.",
            minlength: "Name must be between 2 and 50 characters.",
            maxlength: "Name must be between 2 and 50 characters."
        },
        Contactperson: {
            required: "Contact Person is required.",
            minlength: "Contact Person must be between 2 and 50 characters.",
            maxlength: "Contact Person must be between 2 and 50 characters."
        },
        ContactPerNum: {
            required: "Contact Person Number is required.",
            digits: "Contact Person Number must contain only digits.",
            minlength: "Contact Person Number must be exactly 11 digits.",
            maxlength: "Contact Person Number must be exactly 11 digits."
        },
        ContactNumber: {
            required: "Contact Number is required.",
            digits: "Contact Number must contain only digits.",
            minlength: "Contact Number must be exactly 11 digits.",
            maxlength: "Contact Number must be exactly 11 digits."
        },
        BIN: {
            required: "BIN is required."
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
$('#GasHub_Company_Form input[type="text"]').on('change', function () {
    GasHub_Company_Form.element($(this));
});
$('#GasHub_Company_Form input[type="text"]').on('focus', function () {
    GasHub_Company_Form.element($(this));
});
function resetValidation() {
    GasHub_Company_Form.resetForm(); // Reset validation
    $('.form-group .invalid-feedback').remove(); // Remove error messages
    $('#GasHub_Company_Form input').removeClass('is-invalid'); // Remove error styling
}


$('#GasHub_Company_btn-Create').off("click").click(function (e) {
    e.preventDefault;
    $('#GasHub_Company_modelCreate input[type="text"]').val('');
    $('#GasHub_Company_modelCreate').modal('show');
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
$('#GasHub_Company_modelCreate').on('shown.bs.modal', function () {
    $('#GasHub_Company_Form input:first').focus();
});

// Listen for Enter key press on input fields
$('#GasHub_Company_modelCreate').on('keypress', 'input', handleEnterKey);

// Submit button click event
$('#btnSave').click(async function (e) {
    e.preventDefault;
    // Check if the form is valid
    if ($('#GasHub_Company_Form').valid()) {
        // Proceed with form submission
        var formData = $('#GasHub_Company_Form').serialize();
        try {
            const response = await $.ajax({
                url: '/Company/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });


            if (response.success === true && response.status === 200) {
                // Show success message
                notification({ message: "Your company was successfully saved", type: "success", title: "Success" });
                await GetCompanyList();
                $('#GasHub_Company_Form')[0].reset();
                $('#GasHub_Company_modelCreate').modal('hide');
            } else {
                notificationErrors({ message: response.errorMessage });
                $('#GasHub_Company_Form')[0].reset();
                $('#GasHub_Company_modelCreate').modal('hide');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
});

// Edit Company
window.editCompany = async function (id) {
    $('#myModalLabelUpdateEmployee').show();
    $('#myModalLabelAddEmployee').hide();

    // Reset form validation
    debugger

    try {
        const data = await $.ajax({
            url: '/Company/GetCompany/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#Name').val(data.name);
        $('#Contactperson').val(data.contactperson);
        $('#ContactPerNum').val(data.contactPerNum);
        $('#ContactNumber').val(data.contactNumber);
        $('#BIN').val(data.bin);
        debugger
        resetValidation()
        // Show modal for editing
        $('#GasHub_Company_modelCreate').modal('show');
        // Update button click event handler
        $('#btnUpdate').off('click').on('click', function () {
            updateCompany(id);
        });
    } catch (error) {
        console.log('Error:', error);
    }
}


async function updateCompany(id) {
    if ($('#GasHub_Company_Form').valid()) {
        const formData = $('#GasHub_Company_Form').serialize();
        console.log(formData);
        try {
            const response = await $.ajax({
                url: '/Company/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });


            if (response.success === true && response.status === 200) {
                // Show success message
                notification({ message: "Your company was successfully updated.", type: "success", title: "Success" });
                // Reset the form
                $('#GasHub_Company_Form')[0].reset();
                // Update the company list
                await GetCompanyList();
                $('#GasHub_Company_modelCreate').modal('hide');
            } else {
                notificationErrors({ message: response.errorMessage });
                $('#GasHub_Company_modelCreate').modal('hide');
            }
        } catch (error) {
            notificationErrors({ message: 'An error occurred while updating the company.' });
            $('#GasHub_Company_modelCreate').modal('hide');
        }
    }
}

// Details Company
//async function showDetails(id) {
//    $('#GasHub_Company_deleteAndDetailsModel').modal('show');
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

window.deleteCompany = function (id) {
    $('#GasHub_Company_deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(function (e) {
        e.preventDefault;
        $.ajax({
            url: '/Company/Delete',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                debugger
                if (response.success && response.status === 200) {
                    $('#GasHub_Company_deleteAndDetailsModel').modal('hide');
                    notification({ message: "Company was successfully deleted.", type: "success", title: "Success" });
                    GetCompanyList();
                } else {
                    notificationErrors({ message: response.detail, type: "error", title: "Error" });
                    $('#GasHub_Company_deleteAndDetailsModel').modal('hide');
                }
                
            },
            error: function (xhr, status, error) {
                notificationErrors({ message: error.message });
                $('#GasHub_Company_deleteAndDetailsModel').modal('hide');
            }
        });
    });
}
