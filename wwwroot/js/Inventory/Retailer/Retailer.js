$(document).ready(async function () {
    await GetRetailerList();
});

async function GetRetailerList() {
    debugger
    try {
        const data = await $.ajax({
            url: '/Retailer/GetallRetailer',
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
const companyForm = $('#CompanyForm').validate({
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
                url: '/Retailer/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Retailer was successfully saved.');
                $('#successMessage').show();
                await GetRetailerList();
                $('#CompanyForm')[0].reset();
                $('#modelCreate').modal('hide');
            }
        } catch (error) {
            console.log('Error:', error);
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
            url: '/Retailer/GetById/' + id,
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
        $('#modelCreate').modal('show');
        // Update button click event handler
        $('#btnUpdate').off('click').on('click', function () {
            updateCompany(id);
        });
    } catch (error) {
        console.log('Error:', error);
    }
}


window.deleteCompany = function (id) {
    if ($('#CompanyForm').valid()) {
        const formData = $('#CompanyForm').serialize();
        console.log(formData);
        try {
            const response = await $.ajax({
                url: '/Retailer/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Retailer was successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#CompanyForm')[0].reset();
                // Update the company list
                await GetRetailerList();
                $('#modelCreate').modal('hide');
            }
        } catch (error) {
            console.log('Error:', error);
            // Show error message
            $('#errorMessage').text('An error occurred while updating the Retailer.');
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
//            url: '/Retailer/GetRetailer', // Assuming this is the endpoint to fetch company details
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
    $('#deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(function () {
        $.ajax({
            url: '/Retailer/Delete',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                $('#deleteAndDetailsModel').modal('hide');
                GetRetailerList();
                $('#successMessage').text('Your Retailer was successfully Delete.');
                $('#successMessage').show();
            },
            error: function (xhr, status, error) {
                console.log(error);
                $('#deleteAndDetailsModel').modal('hide');
            }
        });
    });
}
