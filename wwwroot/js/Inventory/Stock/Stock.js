$(document).ready(async function () {
    await GetStockList();
});

async function GetStockList() {
    debugger
    try {
        const stocks = await $.ajax({
            url: '/Stock/GetallStock',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        const products = await $.ajax({
            url: '/Product/GetAllProduct',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        const traders = await $.ajax({
            url: '/Trader/GetallTrader',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        
       
        if (stocks && stocks.data) { // Check if orders and orders.data exist
            onSuccess(stocks.data, products.data, traders.data);
        }
    } catch (error) {
        console.log('Error:', error);
       
    }
}


function onSuccess(stocks, products, traders) {
    debugger

    if (stocks ) {
        // Convert users array to a map for easy lookup
        var productsMap = {};
        products.forEach(function (stock) {
            productsMap[stock.id] = stock;
        });

        // Convert products array to a map for easy lookup
        var tradersMap = {};
        traders.forEach(function (trader) {
            tradersMap[trader.id] = trader;
        });

        // Merge order and user data
        var mergedData = stocks.map(function (stock) {
            var trader = tradersMap[stock.traderId];
            var product = productsMap[stock.productId];
            console.log("trader", trader);
            console.log("product", product);
            if (stock ) {
                return {
                    id: stock.id,
                    productName: product.name,
                    traderName: trader.name,
                    quentity: stock.quantity,
                };

            }
            return null; // Skip if any data not found
        }).filter(Boolean); // Remove null entries

        console.log('onSuccess:', mergedData);
        $('#CompanyTable').dataTable({
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
                    data: 'productName',
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
                    data: 'quentity',
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
        TraderId: {
            required: true,
        },
        ProductId: {
            required: true,
        },
        Quantity: {
            required: true,
        }
    },
    messages: {
        TraderId: {
            required: " Trader Name is required.",
        },
        ProductId: {
            required: " Product Name is required.",
        },
        Quantity: {
            required: " Quantity Name is required.",
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
    populateProductDropdown();
    populateTraderDropdown()
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
    debugger
    // Check if the form is valid
    if ($('#CompanyForm').valid()) {
        // Proceed with form submission
        var formData = $('#CompanyForm').serialize();
        console.log(formData);
        try {
            var response = await $.ajax({
                url: '/Stock/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Stock was successfully saved.');
                $('#successMessage').show();
                await GetStockList();
                $('#CompanyForm')[0].reset();
                $('#modelCreate').modal('hide');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
});

async function populateTraderDropdown() {
    try {
        const data = await $.ajax({
            url: '/Trader/GetallTrader',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Clear existing options
        $('#traderDropdown').empty();
        // Add default option
        $('#traderDropdown').append('<option value="">Select Trader</option>');
        // Add user options
        console.log(data.data);
        $.each(data.data, function (index, trader) {
            $('#traderDropdown').append('<option value="' + trader.id + '">' + trader.name + '</option>');
        });
    } catch (error) {
        console.error(error);
        // Handle error
    }
}
async function populateProductDropdown() {
    debugger
    try {
        const data = await $.ajax({
            url: '/Product/GetAllProduct',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Clear existing options
        $('#productDropdown').empty();
        // Add default option
        $('#productDropdown').append('<option value="">Select Product</option>');
        // Add user options
        console.log(data.data);
        $.each(data.data, function (index, product) {
            $('#productDropdown').append('<option value="' + product.id + '">' + product.name + '</option>');
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
    await populateProductDropdown();
    await populateTraderDropdown()

    // Reset form validation
    debugger

    try {
        const data = await $.ajax({
            url: '/Stock/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#productDropdown').val(data.productId);
        $('#traderDropdown').val(data.traderId);
        $('#Quantity').val(data.quantity);



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
                url: '/Stock/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Stock was successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#CompanyForm')[0].reset();
                // Update the company list
                await GetStockList();
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
    debugger
    $('#deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(async function () {
        try {
            const response = await $.ajax({
                url: '/Stock/Delete',
                type: 'POST',
                data: { id: id }
            });
            if (response.success === true && response.status === 200) {
                $('#deleteAndDetailsModel').modal('hide');
                $('#successMessage').text('Your Stock was successfully Delete..');
                $('#successMessage').show();
                await GetStockList();
            }
            
        } catch (error) {
            console.log(error);
            $('#deleteAndDetailsModel').modal('hide');
        }
    });
}


