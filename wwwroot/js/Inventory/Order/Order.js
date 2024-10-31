$(document).ready(async function () {
    await GetOrderList();
});

async function GetOrderList() {
    debugger
    try {
        const orders = await $.ajax({
            url: '/Order/GetOrderList',
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
        const productData = await $.ajax({
            url: '/Product/GetAllProduct',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        const returnProductData = await $.ajax({
            url: '/ProdReturn/GetallProdReturn',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
       
        if (orders && orders.data) { // Check if orders and orders.data exist
            onSuccess(orders.data, userData.data, productData.data, returnProductData.data);
        }
    } catch (error) {
        console.log('Error:', error);
       
    }
}


function onSuccess(orders, usersData, productsData, returnProductsData) {
    debugger
    console.log('orders:', orders);
    console.log('usersData:', usersData);
    console.log('productsData:', productsData);
    console.log('returnProductsData:', returnProductsData);

    if (orders && usersData && productsData && returnProductsData) {
        // Convert users array to a map for easy lookup
        var usersMap = {};
        usersData.forEach(function (user) {
            usersMap[user.id] = user;
        });

        // Convert products array to a map for easy lookup
        var productsMap = {};
        productsData.forEach(function (product) {
            productsMap[product.id] = product;
        });

        // Convert return products array to a map for easy lookup
        var returnProductsMap = {};
        returnProductsData.forEach(function (returnProduct) {
            returnProductsMap[returnProduct.id] = returnProduct;
        });

        // Merge order and user data
        var mergedData = orders.map(function (order) {
            var user = usersMap[order.userId];
            var product = productsMap[order.productId];
            var returnProduct = returnProductsMap[order.returnProductId];
          
            console.log('order:', order);
            console.log('user:', user);
            console.log('product:', product);
            console.log('returnProduct:', returnProduct);
            if (order ) {
                return {
                    id: order.id,
                    fullName: user?.firstName + ' ' + user?.lastName,
                    phone: user ? user.phoneNumber : "No Number",
                    productOrder: product ? product.name : "No Order",
                    productReturn: returnProduct ? returnProduct.name : "No Return",
                    isActive: order.isActive,
                    TransactionNumber: order.transactionNumber,
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
                    data: 'fullName',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'TransactionNumber',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'productOrder',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'productReturn',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'isActive',
                    render: function (data, type, row, meta) {
                        return data ? '<button class="btn btn-sm btn-primary rounded-pill">Yes</button>' : '<button class="btn btn-sm btn-danger rounded-pill">No</button>';
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
        UserId: {
            required: true,
        },
        ProductId: {
            required: true,
        }
    },
    messages: {
        UserId: {
            required: " User Name is required.",
        },
        ProductId: {
            required: " Product Name is required.",
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
    populateUserDropdown();
    populateProductDropdown();
    populateReturnProductDropdown();
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
                url: '/Order/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Order was successfully saved.');
                $('#successMessage').show();
                await GetOrderList();
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
        $('#productDropdown').append('<option value="">Select User</option>');
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
async function populateReturnProductDropdown() {
    debugger
    try {
        const data = await $.ajax({
            url: '/ProdReturn/GetallProdReturn',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Clear existing options
        $('#ReturnProductDropdown').empty();
        // Add default option
        $('#ReturnProductDropdown').append('<option value="">Select User</option>');
        // Add user options
        console.log(data.data);
        $.each(data.data, function (index, returnProduct) {
            $('#ReturnProductDropdown').append('<option value="' + returnProduct.id + '">' + returnProduct.name + '</option>');
        });
    } catch (error) {
        console.error(error);
        // Handle error
    }
}

// Call the function to populate the dropdown when the page loads
populateUserDropdown();
populateProductDropdown();
populateReturnProductDropdown();

// Optionally, you can refresh the user list on some event, like a button click
$('#refreshButton').click(function () {
    populateUserDropdown();
});

// Edit Company
window.editCompany = async function (id) {
    console.log("Edit company with id:", id);
    $('#myModalLabelUpdateEmployee').show();
    $('#myModalLabelAddEmployee').hide();
    await populateUserDropdown();
    await populateProductDropdown();
    await populateReturnProductDropdown();
    // Reset form validation
    debugger

    try {
        const data = await $.ajax({
            url: '/Order/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#userDropdown').val(data.userId);
        $('#productDropdown').val(data.productId);
        $('#ReturnProductDropdown').val(data.returnProductId);
        $('#Comments').val(data.comments);
        $('#TransactionNumber').val(data.transactionNumber);


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
                url: '/Order/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Order was successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#CompanyForm')[0].reset();
                // Update the company list
                await GetOrderList();
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
                url: '/Order/Delete',
                type: 'POST',
                data: { id: id }
            });
            if (response.success === true && response.status === 200) {

            $('#deleteAndDetailsModel').modal('hide');
            $('#successMessage').text('Your Order was successfully Delete...');
            $('#successMessage').show();
            await GetOrderList();
            }
        } catch (error) {
            console.log(error);
            $('#deleteAndDetailsModel').modal('hide');
        }
    });
}


