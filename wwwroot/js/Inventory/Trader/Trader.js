import { notification, notificationErrors } from "../../Utility/gashyb_notification.js";
$(document).ready(async function () {
    await GetTraderList();
});

async function GetTraderList() {
    try {
        const traders = await $.ajax({
            url: '/Trader/GetallTrader',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        const companys = await $.ajax({
            url: '/Company/GetCompanyList',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (traders && traders.data ) {
            onSuccess(traders.data, companys.data);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}


function onSuccess(traders, companys) {
    debugger
    if (traders && companys) {
        if ($.fn.DataTable.isDataTable('#CompanyTable')) {
            // If initialized, destroy the DataTable first
            $('#CompanyTable').DataTable().destroy();
        }

        // Convert users array to a map for easy lookup
        var companysMap = {};
        companys.forEach(function (company) {
            companysMap[company.id] = company;
        });

        // Merge company and user data
        var mergedData = traders.map(function (trader) {
            var company = companysMap[trader.companyId];
            console.log('company:', company);
            console.log('trader:', trader);
            if (trader) {
                return {
                    id: trader.id,
                    companyName: company.name,
                    traderName: trader.name,
                    phone: trader.contactNumber,
                    contactParsonName: trader.contactperson,
                    contactParsoneNumber: trader.contactPerNum,
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
                    data: 'companyName',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'traderName',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'phone',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'contactParsonName',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'contactParsoneNumber',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'id',
                    render: function (data) {
                        return '<button class="btn btn-primary btn-sm ms-1" onclick="editCompany(\'' + data + '\')">Edit</button>' + ' ' +
                            '<button class="btn btn-info btn-sm ms-1" onclick="showDetails(\'' + data + '\')">Details</button>' + ' ' +
                            '<button class="btn btn-danger btn-sm ms-1" onclick="deleteCompany(\'' + data + '\')">Delete</button>';
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
        CompanyId: {
            required: true,
        },
        Name: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        ContactNumber: {
            required: true,
            digits: true,
            minlength: 11,
            maxlength: 11
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
        }
    },
    messages: {
        CompanyId: {
            required: " User Name is required.",
        },
        Name: {
            required: "Address is required.",
            minlength: "Address must be between 2 and 50 characters.",
            maxlength: "Address must be between 2 and 50 characters."
        },
        ContactNumber: {
            required: "Phone Number is required.",
            digits: "Phone Number must contain only digits.",
            minlength: "Phone Number must be exactly 11 digits.",
            maxlength: "Phone Number must be exactly 11 digits."
        },
        ContactPerNum: {
            required: "Mobile is required.",
            digits: "Mobile must contain only digits.",
            minlength: "Mobile must be exactly 11 digits.",
            maxlength: "Mobile must be exactly 11 digits."
        },
        Contactperson: {
            required: "Address is required.",
            minlength: "Address must be between 2 and 50 characters.",
            maxlength: "Address must be between 2 and 50 characters."
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
    populateCompanyDropdown();
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
    debugger
    console.log("Save");
    // Check if the form is valid
    if ($('#CompanyForm').valid()) {
        // Proceed with form submission
        var formData = $('#CompanyForm').serialize();
        console.log(formData);
        try {
            var response = await $.ajax({
                url: '/Trader/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                notification({ message: "Your Trader was successfully saved.", type: "success", title: "Success" });
                await GetTraderList()
                $('#CompanyForm')[0].reset();
                $('#modelCreate').modal('hide');
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

async function populateCompanyDropdown() {
    try {
        const data = await $.ajax({
            url: '/Company/GetCompanyList',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Clear existing options
        $('#companyDropdown').empty();
        // Add default option
        $('#companyDropdown').append('<option value="">Select Company</option>');
        // Add user options
        console.log(data.data);
        $.each(data.data, function (index, company) {
            $('#companyDropdown').append('<option value="' + company.id + '">' + company.name + '</option>');
        });
    } catch (error) {
        console.error(error);
        // Handle error
    }
}


// Edit Company
window.editCompany = async function (id) {
    console.log("Edit company with id:", id);
    $('#myModalLabelUpdateEmployee').show();
    $('#myModalLabelAddEmployee').hide();
    await populateCompanyDropdown();
    // Reset form validation
    debugger

    try {
        const data = await $.ajax({
            url: '/Trader/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#companyDropdown').val(data.companyId);
        $('#Name').val(data.name);
        $('#ContactNumber').val(data.contactNumber);
        $('#Contactperson').val(data.contactperson);
        $('#ContactPerNum').val(data.contactPerNum);


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
            var response = await $.ajax({
                url: '/Trader/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                notification({ message: "Your Trader was successfully updated.", type: "success", title: "Success" });
                $('#CompanyForm')[0].reset();
                await GetTraderList();
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

window.deleteCompany = function (id) {
    $('#deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(async function () {
        try {
            const response = await $.ajax({
                url: '/Trader/Delete',
                type: 'POST',
                data: { id: id }
            });
            if (response.success === true && response.status === 200) {
                notification({ message: "Your Trader was successfully Delete.", type: "success", title: "Success" });
                $('#deleteAndDetailsModel').modal('hide');
                await GetTraderList()
            } else {
                notificationErrors({ message: response.errorMessage });
                $('#deleteAndDetailsModel').modal('hide');
            }
        } catch (error) {
            notificationErrors({ message: error.message });
            $('#deleteAndDetailsModel').modal('hide');
        }
    });
}


