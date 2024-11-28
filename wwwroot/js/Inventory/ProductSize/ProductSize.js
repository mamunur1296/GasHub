import { notification, notificationErrors } from "../../Utility/gashyb_notification.js";
$(document).ready(async function () {
    await GetProductSizeList();
});

async function GetProductSizeList() {
    debugger
    try {
        const data = await $.ajax({
            url: '/ProductSize/GetallProductSize',
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
        if ($.fn.DataTable.isDataTable('#CompanyTable')) {
            // If initialized, destroy the DataTable first
            $('#CompanyTable').DataTable().destroy();
        }
        $('#CompanyTable').dataTable({
            processing: true,
            lengthChange: true,
            lengthMenu: [[5, 10, 20, 30, -1], [5, 10, 20, 30, 'All']],
            searching: true,
            ordering: true,
            paging: true,
            data: companies,
            columns: [
                {
                    data: 'size',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'unit',
                    render: function (data, type, row, meta) {
                        return data;
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
        Size: {
            required: true,
        },
        Unit: {
            required: true,
        }
    },
    messages: {
        Size: {
            required: "Name is required.",
        },
        Unit: {
            required: "Contact Person is required.",
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


$('#btn-Create').click(function () {
    $('#modelCreate input[type="text"]').val('');
    $('#modelCreate').modal('show');
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
$('#modelCreate').on('shown.bs.modal', function () {
    $('#CompanyForm input:first').focus();
});

// Listen for Enter key press on input fields
$('#modelCreate').on('keypress', 'input', handleEnterKey);

// Submit button click event
$('#btnSave').click(async function () {
    // Check if the form is valid
    if ($('#CompanyForm').valid()) {
        // Proceed with form submission
        var formData = $('#CompanyForm').serialize();
        try {
            const response = await $.ajax({
                url: '/ProductSize/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            $('#ProductSizeError').text('Product Size is already Exjist.').hide();
            if (response.success === true && response.status === 200) {
                notification({ message: "Your Product Size was successfully saved.", type: "success", title: "Success" });
                await GetProductSizeList();
                $('#CompanyForm')[0].reset();
                $('#modelCreate').modal('hide');
            } else if (response.errorMessage) {
                // Display specific error messages
                if (response.errorMessage.includes("DuplicateProductSize")) {
                    $('#ProductSizeError').text('Product Size is already Exjist.').show();
                } else {
                    $('#GeneralError').text('Failed to save the user: ').show();
                }
            } else {
                notificationErrors({ message: response.errorMessage });
                $('#modelCreate').modal('hide');
            }
        } catch (error) {
            notificationErrors({ message: error.message });
            $('#modelCreate').modal('hide');
        }
    }
});

// Edit Company

window.editCompany = async function (id) {
    console.log("Edit company with id:", id);
    $('#myModalLabelUpdateEmployee').show();
    $('#myModalLabelAddEmployee').hide();

    // Reset form validation
    debugger

    try {
        const data = await $.ajax({
            url: '/ProductSize/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#Size').val(data.size);
        $('#Unit').val(data.unit);
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
                url: '/ProductSize/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                notification({ message: "Your Product Size was successfully updated.", type: "success", title: "Success" });
                $('#CompanyForm')[0].reset();
                await GetProductSizeList();
                $('#modelCreate').modal('hide');
            } else {
                notificationErrors({ message: response.errorMessage + response.title });
                $('#modelCreate').modal('hide');
            }
        } catch (error) {
            notificationErrors({ message: error.message });
            $('#modelCreate').modal('hide');
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

window.deleteCompany = function (id) {
    $('#deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(function () {
        $.ajax({
            url: '/ProductSize/Delete',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                notification({ message: "Your Product Size was successfully Delete.", type: "success", title: "Success" });
                $('#deleteAndDetailsModel').modal('hide');
                GetProductSizeList();
            },
            error: function (xhr, status, error) {
                notificationErrors({ message: error.message });
                $('#deleteAndDetailsModel').modal('hide');
            }
        });
    });
}



