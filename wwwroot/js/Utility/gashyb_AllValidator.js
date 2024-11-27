// Fatch duplucate file 

const createDuplicateCheckValidator = (endpoint, key, errorMessage) => {
    return function (value, element) {
        let isValid = false;
        $.ajax({
            type: "GET",
            url: endpoint,
            data: { key: key, val: value },
            async: false,
            success: function (response) {
                isValid = !response;
            },
            error: function () {
                isValid = false;
            }
        });
        return isValid;
    };
}

// Product validator 
export const ProductValidator = (FromId) => {
    return $(FromId).validate({
        onkeyup: function (element) {
            $(element).valid();
        },
        rules: {
            ProductName: {
                required: true,
            },
            Description: {
                required: true,
            },
            CategoryID: {
                required: true,
            },
            SupplierID: {
                required: true,
            },
            QuantityPerUnit: {
                required: true,
            },
            UnitPrice: {
                required: true,
            },
            UnitsInStock: {
                required: true,
            },
            ReorderLevel: {
                required: true,
            },
            BatchNumber: {
                required: true,
            },
            ExpirationDate: {
                required: true,
            },
            ImageURL: {
                required: true,
            },
            Weight: {
                required: true,
            },
            Dimensions: {
                required: true,
            },
            UnitMasterId: {
                required: true,
            },
            UnitChildId: {
                required: true,
            }
        },
        messages: {
            ProductName: {
                required: "Product Name is required.",
            },
            Description: {
                required: "Description is required.",
            },
            CategoryID: {
                required: "Category ID is required.",
            },
            SupplierID: {
                required: "Supplier ID is required.",
            },
            QuantityPerUnit: {
                required: "Quantity per Unit is required.",
            },
            UnitPrice: {
                required: "Unit Price is required.",
            },
            UnitsInStock: {
                required: "Units in Stock is required.",
            },
            ReorderLevel: {
                required: "Reorder Level is required.",
            },
            BatchNumber: {
                required: "Batch Number is required.",
            },
            ExpirationDate: {
                required: "Expiration Date is required.",
            },
            ImageURL: {
                required: "Image URL is required.",
            },
            Weight: {
                required: "Weight is required.",
            },
            Dimensions: {
                required: "Dimensions are required.",
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
};



$.validator.addMethod("checkDuplicateCatagoryName", createDuplicateCheckValidator(
    "/Category/CheckDuplicate",
    "CategoryName",
    "Message"
));






// Initialize validation
export const CatagoryValidae = (formId) => {
    return $(formId).validate({
        onkeyup: function (element) {
            $(element).valid();
        },
        rules: {
            CategoryName: {
                required: true,
                checkDuplicateCatagoryName: true 
            },
            Description: {
                required: true,
            }
        },
        messages: {
            CategoryName: {
                required: "Category Name is required.",
                checkDuplicateCatagoryName: "This Category Name is already taken."
            },
            Description: {
                required: "Description is required.",
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
};


// SupplierValidate
export const SupplierValidate = (formId) => {
    return $(formId).validate({
        onkeyup: function (element) {
            $(element).valid();
        },
        rules: {
            SupplierName: {
                required: true,
            },
            ContactName: {
                required: true,
            },
            ContactTitle: {
                required: true,
            },
            Address: {
                required: true,
            },
            City: {
                required: true,
            },
            Region: {
                required: true,
            },
            PostalCode: {
                required: true,
            },
            Country: {
                required: true,
            },
            Phone: {
                required: true,
            },
            Fax: {
                required: true,
            },
            HomePage: {
                required: true,
            }
        },
        messages: {
            SupplierName: {
                required: "Supplier Name is required.",
            },
            ContactName: {
                required: "Contact Name is required.",
            },
            ContactTitle: {
                required: "Contact Title is required.",
            },
            Address: {
                required: "Address is required.",
            },
            City: {
                required: "City is required.",
            },
            Region: {
                required: "Region is required.",
            },
            PostalCode: {
                required: "Postal Code is required.",
            },
            Country: {
                required: "Country is required.",
            },
            Phone: {
                required: "Phone is required.",
            },
            Fax: {
                required: "Fax is required.",
            },
            HomePage: {
                required: "Home Page is required.",
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
};
// validateUnitChildForm

export const validateUnitChildForm = (formId) => {
    return $(formId).validate({
        onkeyup: function (element) {
            $(element).valid();
        },
        rules: {
            Name: {
                required: true,
            },
            UnitMasterId: {
                required: true,
            },
            UnitShortCode: {
                required: true,
            },
            DisplayName: {
                required: true,
            },
            UnitDescription: {
                required: true,
            }
        },
        messages: {
            Name: {
                required: "Name is required.",
            },
            UnitMasterId: {
                required: "Unit Master ID is required.",
            },
            UnitShortCode: {
                required: "Unit Short Code is required.",
            },
            DisplayName: {
                required: "Display Name is required.",
            },
            UnitDescription: {
                required: "Unit Description is required.",
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
};
// Exportable UnitMaster Validation Function
export const validateUnitMasterForm = (formId) => {
    return $(formId).validate({
        onkeyup: function (element) {
            $(element).valid();
        },
        rules: {
            Name: {
                required: true,
            },
            UnitMasterDescription: {
                required: true,
            }
        },
        messages: {
            Name: {
                required: "Name is required.",
            },
            UnitMasterDescription: {
                required: "Unit Master Description is required.",
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
};
