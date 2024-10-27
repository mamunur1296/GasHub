$(document).ready(async function () {
    await GetProductList();
});

async function GetProductList() {
    
    try {
        const product = await $.ajax({
            url: '/Product/GetAllProduct',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        const company = await $.ajax({
            url: '/Company/GetCompanyList',
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

        if (product && product.data) { // Check if orders and orders.data exist
            onSuccess(company.data, product.data, productSize.data, productValv.data);
        }
    } catch (error) {
        console.log('Error:', error);

    }
}


function onSuccess(companys, products, productSize, productValv) {
    
    console.log('company:', companys);
    console.log('product:', products);
    console.log('productSize:', productSize);
    console.log('productValv:', productValv);

    if (companys && products && productSize && productValv) {
        // Convert products array to a map for easy lookup
        var companyMap = {};
        companys.forEach(function (company) {
            companyMap[company.id] = company;
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
        var mergedData = products.map(function (product) {
            var company = companyMap[product.companyId];
            var productSize = productSizeMap[product.prodSizeId];
            var productValv = productValvMap[product.prodValveId];

            console.log('company:', company);
            console.log('productSize:', productSize);
            console.log('product:', product);
            console.log('productValv:', productValv);
            if (product) {
                return {
                    id: product.id,
                    companyName: company.name,
                    productName: product.name,
                    productSize: productSize.size + " " + productSize.unit,
                    productValve: productValv.name + " " + productValv.unit ,
                    productImages: product.prodImage,
                    productPrice : product.prodPrice,
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
                    data: 'productImages',
                    render: function (data, type, row, meta) {
                        console.log("img of datra"+data);
                        return '<img src="images/' + data + '" alt="Image" style="width: 50px;" />';
                    }
                },
                {
                    data: 'productName',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'companyName',
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
                    data: 'productPrice',
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
        Name: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        ProdImage: {
            required: true,
        },
        CompanyId: {
            required: true,
        }
        ,
        ProdValveId: {
            required: true,
        }
        ,
        ProdSizeId: {
            required: true,
        },
        ProdPrice: {
            required: true,
        }
    },
    messages: {
        Name: {
            required: "Name is required.",
            minlength: "Name must be between 2 and 50 characters.",
            maxlength: "Name must be between 2 and 50 characters."
        },
        ProdImage: {
            required: " Product Name is required.",
        }
        ,
        CompanyId: {
            required: " Product Name is required.",
        }
        ,
        ProdValveId: {
            required: " Product Name is required.",
        }
        ,
        ProdSizeId: {
            required: " Product Name is required.",
        },
        ProdPrice: {
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
    popuprodValveDropdown();
    populateprodSizeDropdown();
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
$('#btnSave').click(async function () {
    console.log("Save");
    debugger

    // Check if the form is valid (including image file size and type)
    if ($('#CompanyForm').valid()) {
        // Prepare form data using FormData object to handle file uploads
        var formData = new FormData($('#CompanyForm')[0]);

        console.log(formData); // This will now include FormFile data
        try {
            var response = await $.ajax({
                url: '/Product/Create',
                type: 'post',
                // No need for contentType as FormData handles it
                data: formData,
                processData: false, // Prevent jQuery from processing data (handled by FormData)
                contentType: false,   // Set to false to allow FormData to set headers
                cache: false         // Disable caching for file uploads
            });

            $('#ProductNameError').text('Product Name  is already taken.').hide();
            $('#ProductSizeError').text('Product Size  is already Exjist.').hide();
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Product was successfully saved.');
                $('#successMessage').show();
                await GetProductList();
                $('#CompanyForm')[0].reset();
                $('#modelCreate').modal('hide');
            } else if (response.errorMessage) {
                // Display specific error messages
                if (response.errorMessage.includes("DuplicateProductName")) {
                    $('#ProductNameError').text('Product Name  is already Exjist.').show();
                } else if (response.errorMessage.includes("DuplicateProductSize")) {
                    $('#ProductSizeError').text('Product Size  is already Exjist.').show();
                } else {
                    $('#GeneralError').text('Failed to save the user: ').show();
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
});
// Submit button click event
//$('#btnSave').click(async function () {
//    console.log("Save");
//    debugger
//    // Check if the form is valid
//    if ($('#CompanyForm').valid()) {
//        // Proceed with form submission
//        var formData = $('#CompanyForm').serialize();

//        console.log(formData);
//        try {
//            var response = await $.ajax({
//                url: '/Product/Create',
//                type: 'post',
//                contentType: 'application/x-www-form-urlencoded',
//                data: formData
//            });

//            $('#modelCreate').modal('hide');
//            if (response === true) {
//                // Show success message
//                $('#successMessage').text('Your Product was successfully saved.');
//                $('#successMessage').show();
//                await GetProductList();
//                $('#CompanyForm')[0].reset();
//            }
//        } catch (error) {
//            console.log('Error:', error);
//        }
//    }
//});

async function popuprodValveDropdown() {
    
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
        $('#prodValveDropdown').append('<option value="">Select valv</option>');
        // Add user options
        console.log(data.data);
        $.each(data.data, function (index, valv) {
            $('#prodValveDropdown').append('<option value="' + valv.id + '">' + valv.name + " " + valv.unit + '</option>');
        });
    } catch (error) {
        console.error(error);
        // Handle error
    }
}
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
        $('#companyDropdown').append('<option value="">Select company Name</option>');
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
async function populateprodSizeDropdown() {
    
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
            $('#prodSizeDropdown').append('<option value="' + ProductSize.id + '">' + ProductSize.size + " " + ProductSize.unit + '</option>');
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
async function editCompany(id) {
    console.log("Edit company with id:", id);
    $('#myModalLabelUpdateEmployee').show();
    $('#myModalLabelAddEmployee').hide();
    await populateCompanyDropdown();
    await popuprodValveDropdown();
    await populateprodSizeDropdown();
    // Reset form validation
    debugger

    try {
        const data = await $.ajax({
            url: '/Product/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#Name').val(data.name);
        $('#ProdImage').val(data.prodImage);
        $('#prodValveDropdown').val(data.prodValveId);
        $('#companyDropdown').val(data.companyId);
        $('#prodSizeDropdown').val(data.prodSizeId);
        $('#ProdPrice').val(data.prodPrice);


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
        var formData = new FormData($('#CompanyForm')[0]);
        console.log(formData);
        try {
            var response = await $.ajax({
                url: '/Product/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData,
                processData: false, // Prevent jQuery from processing data (handled by FormData)
                contentType: false,   // Set to false to allow FormData to set headers
                cache: false         // Disable caching for file uploads
            });

            
            if (response.success === true && response.status === 200) {
                // Show success message
                $('#successMessage').text('Your Product was successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#CompanyForm')[0].reset();
                // Update the company list
                await GetProductList();
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

async function deleteCompany(id) {
    
    $('#deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(async function () {
        try {
            const response = await $.ajax({
                url: '/Product/Delete',
                type: 'POST',
                data: { id: id }
            });

            $('#deleteAndDetailsModel').modal('hide');
            $('#successMessage').text('Your Product was successfully Delete..');
            $('#successMessage').show();
            await GetProductList();
        } catch (error) {
            console.log(error);
            $('#deleteAndDetailsModel').modal('hide');
        }
    });
}


