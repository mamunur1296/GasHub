$(document).ready(async function () {
    await GetProdReturnList();
});

async function GetProdReturnList() {
    debugger
    try {
        const prodReturn = await $.ajax({
            url: '/ProdReturn/GetAllConfirmCustomer',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        const product = await $.ajax({
            url: '/Product/GetAllProduct',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        const productSize = await $.ajax({
            url: '/ProductSize/GetallProductSize',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        const productValv = await $.ajax({
            url: '/Valve/GetallValve',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        if (prodReturn && prodReturn.data) { // Check if orders and orders.data exist
            onSuccess(prodReturn.data, product.data, productSize.data, productValv.data);
        }
    } catch (error) {
        console.log('Error:', error);

    }
}


function onSuccess(prodReturn, product, productSize, productValv) {
    debugger
    console.log('prodReturn:', prodReturn);
    console.log('product:', product);
    console.log('productSize:', productSize);
    console.log('productValv:', productValv);

    if (prodReturn && product && productSize && productValv) {
        // Convert products array to a map for easy lookup
        var productsMap = {};
        product.forEach(function (product) {
            productsMap[product.id] = product;
        });
        // Convert users array to a map for easy lookup
        var productSizeMap = {};
        productSize.forEach(function (productSize) {
            productSizeMap[productSize.id] = productSize;
        });
        // Convert return products array to a map for easy lookup
        var productValvMap = {};
        productValv.forEach(function (Valv) {
            productValvMap[Valv.id] = Valv;
        });

        // Merge order and user data
        var mergedData = prodReturn.map(function (preturn) {
            var product = productsMap[preturn.productId];
            var productSize = productSizeMap[preturn.prodSizeId];
            var productValv = productValvMap[preturn.prodValveId];

            console.log('preturn:', preturn);
            console.log('productSize:', productSize);
            console.log('product:', product);
            console.log('productValv:', productValv); 
            if (preturn) {
                return {
                    id: preturn.id,
                    productName: product.name,
                    productSize: productSize.size + " " + productSize.unit,
                    productValve: productValv.name + " " + productValv.unit,
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
                    data: 'productSize',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'productValve',
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
    popuprodValveDropdown();
    populateprodSizeDropdown();
    populateProductDropdown();
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
                url: '/ProdReturn/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Prod Return was successfully saved.');
                $('#successMessage').show();
                await GetProdReturnList();
                $('#CompanyForm')[0].reset();
                $('#modelCreate').modal('hide');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
});

async function popuprodValveDropdown() {
    debugger
    try {
        const data = await $.ajax({
            url: '/Valve/GetallValve',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Clear existing options
        $('#prodValveDropdown').empty();
        // Add default option
        $('#prodValveDropdown').append('<option value="">Select Valve </option>');
        // Add user options
        console.log(data.data);
        $.each(data.data, function (index, valv) {
            $('#prodValveDropdown').append('<option value="' + valv.id + '">' + valv.unit + '</option>');
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
        $('#productDropdown').append('<option value="">Select Product Name</option>');
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
async function populateprodSizeDropdown() {
    debugger
    try {
        const data = await $.ajax({
            url: '/ProductSize/GetallProductSize',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Clear existing options
        $('#prodSizeDropdown').empty();
        // Add default option
        $('#prodSizeDropdown').append('<option value="">Select Product Size</option>');
        // Add user options
        console.log(data.data);
        $.each(data.data, function (index, ProductSize) {
            $('#prodSizeDropdown').append('<option value="' + ProductSize.id + '">' + ProductSize.size + '</option>');
        });
    } catch (error) {
        console.error(error);
        // Handle error
    }
}



// Optionally, you can refresh the user list on some event, like a button click
$('#refreshButton').click(function () {
    populateUserDropdown();
});

// Edit Company
window.editCompany = async function (id) {
    console.log("Edit company with id:", id);
    $('#myModalLabelUpdateEmployee').show();
    $('#myModalLabelAddEmployee').hide();
    await populateProductDropdown();
    await popuprodValveDropdown();
    await populateprodSizeDropdown();
    // Reset form validation
    debugger

    try {
        const data = await $.ajax({
            url: '/ProdReturn/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#Name').val(data.name);
        $('#prodValveDropdown').val(data.prodValveId);
        $('#productDropdown').val(data.productId);
        $('#prodSizeDropdown').val(data.prodSizeId);


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
                url: '/ProdReturn/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

           
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Product Return was successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#CompanyForm')[0].reset();
                // Update the company list
                await GetProdReturnList();
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
                url: '/ProdReturn/Delete',
                type: 'POST',
                data: { id: id }
            });
            if (response.success === true && response.status === 200) {
                $('#deleteAndDetailsModel').modal('hide');
                $('#successMessage').text('Your Product Return was successfully Delete .');
                $('#successMessage').show();
                await GetProdReturnList();
            }
           
        } catch (error) {
            console.log(error);
            $('#deleteAndDetailsModel').modal('hide');
        }
    });
}


