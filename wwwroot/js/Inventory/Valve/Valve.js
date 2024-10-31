$(document).ready(async function () {
    await GetValveList();
});

async function GetValveList() {
    debugger
    try {
        const data = await $.ajax({
            url: '/Valve/GetallValve',
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

function onSuccess(Valves) {
    if (Valves) {
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
            data: Valves,
            columns: [
                {
                    data: 'Name',
                    render: function (data, type, row, meta) {
                        return row.name;
                    }
                },
                {
                    data: 'Unit',
                    render: function (data, type, row, meta) {
                        return row.unit;
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
        Unit: {
            required: true,
        }
    },
    messages: {
        Name: {
            required: "Name is required.",
            minlength: "Name must be between 2 and 50 characters.",
            maxlength: "Name must be between 2 and 50 characters."
        },
        Unit: {
            required: "Unit is required."
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
                url: '/Valve/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });
            $('#ValveNameError').text('Valve Name  is already Exjist.').hide();
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Valve was successfully saved.');
                $('#successMessage').show();
                await GetValveList();
                $('#CompanyForm')[0].reset();
                $('#modelCreate').modal('hide');
            } else if (response.errorMessage) {
                // Display specific error messages
                if (response.errorMessage.includes("DuplicateValveName")) {
                    $('#ValveNameError').text('Valve Name  is already Exjist.').show();
                } else {
                    $('#GeneralError').text('Failed to save the user: ').show();
                }
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
            url: '/Valve/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#Name').val(data.name);
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
    if ($('#CompanyForm').valid()) {
        const formData = $('#CompanyForm').serialize();
        console.log(formData);
        try {
            const response = await $.ajax({
                url: '/Valve/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

           
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Valve was successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#CompanyForm')[0].reset();
                // Update the company list
                await GetValveList();
                $('#modelCreate').modal('hide');
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

window.deleteCompany = function (id) {
    $('#deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(function () {
        $.ajax({
            url: '/Valve/Delete',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                $('#deleteAndDetailsModel').modal('hide');
                $('#successMessage').text('Your Valve was successfully Delete.');
                $('#successMessage').show();
                GetValveList();
            },
            error: function (xhr, status, error) {
                console.log(error);
                $('#deleteAndDetailsModel').modal('hide');
            }
        });
    });
}
