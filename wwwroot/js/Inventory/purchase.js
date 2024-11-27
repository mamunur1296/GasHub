import { notification } from '../Utility/gashyb_notification.js';
import { clearMessage, createActionButtons, dataToMap, displayNotification, initializeDataTable, loger, resetFormValidation, resetValidation, showCreateModal, showExceptionMessage } from '../utility/gashyb_helpers.js';
import { SendRequest, populateDropdown } from '../utility/gashyb_sendrequestutility.js';

$(document).ready(async function () {
    await getPurchaseList();
});
const getPurchaseList = async () => {
    debugger;
    const purchases = await SendRequest({ endpoint: '/Purchase/GetAll' });
    const suppliers = await SendRequest({ endpoint: '/Company/GetCompanyList' });
    await onSuccessPurchases(purchases.data, suppliers.data);
}

function onSuccessPurchases(purchases, suppliers) {
    debugger;
    loger(purchases);
    // Destroy existing DataTable instance if it exists
    if ($.fn.DataTable.isDataTable('#PurchaseTable')) {
        $('#PurchaseTable').DataTable().destroy();
    }

    // Convert suppliers array to a map for easy lookup
    const suppliersMap = {};
    suppliers.forEach(supplier => {
        suppliersMap[supplier.id] = supplier;
    });

    // Merge purchases and suppliers data
    const mergedData = purchases.map(purchase => {
        const supplier = suppliersMap[purchase.companyId];
        loger(purchase.id);
        if (supplier) {
            return {
                id: purchase.id,
                name: supplier.name || "N/A",
                date: purchase.purchaseDate || "N/A",
                total: purchase.totalAmount || "N/A"
            };
        }
        return null; // Skip if supplier not found
    }).filter(Boolean); // Remove null entries

    // Initialize DataTable
    $('#PurchaseTable').DataTable({
        processing: true,
        lengthChange: true,
        lengthMenu: [[5, 10, 20, 30, -1], [5, 10, 20, 30, 'All']],
        searching: true,
        ordering: true,
        paging: true,
        data: mergedData,
        columns: [
            {
                data: null,
                render: (data, type, row) => row.name || "N/A"
            },
            {
                data: null,
                render: (data, type, row) => row.date || "N/A"
            },
            {
                data: null,
                render: (data, type, row) => row.total || "N/A"
            },
            {
                data: null,
                render: (data, type, row, meta) => {
                    return '<button class="btn btn-primary btn-sm ms-1" onclick="editPurchase(\'' + row.id + '\')">Edit</button>' +
                        ' <button class="btn btn-info btn-sm ms-1" onclick="showPurchase(\'' + row.id + '\')">Invoice</button>' +
                        ' <button class="btn btn-danger btn-sm ms-1" onclick="deletePurchase(\'' + row.id + '\')">Delete</button>';
                }
            }
        ]
    });
}


// Fatch duplucate file

//const createDuplicateCheckValidator = (endpoint, key, errorMessage) => {
//    return function (value, element) {
//        let isValid = false;
//        $.ajax({
//            type: "GET",
//            url: endpoint,
//            data: { key: key, val: value },
//            async: false,
//            success: function (response) {
//                isValid = !response;
//            },
//            error: function () {
//                isValid = false;
//            }
//        });
//        return isValid;
//    };
//}

//$.validator.addMethod("checkDuplicateCatagoryName", createDuplicateCheckValidator(
//    "/Category/CheckDuplicate",
//    "CategoryName",
//    "Message"
//));






// Initialize validation
export const isBranchValidae = $('#PurchaseForm').validate({
    onkeyup: function (element) {
        $(element).valid();
    },
    rules: {
        PurchaseDate: {
            required: true,
        }
        ,
        SupplierID: {
            required: true,

        }


    },
    messages: {
        PurchaseDate: {
            required: " Purchase  Date  is required.",
        },
        SupplierID: {
            required: " Supplar is required.",

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

//Sow Create Model
$('#CreatePurchaseBtn').off('click').click(async () => {
    resetFormValidation('#PurchaseForm', isBranchValidae);
    clearMessage('successMessage', 'globalErrorMessage');
    debugger
    showCreateModal('PurchaseModelCreate', 'PurchaseBtnSave', 'PurchaseBtnUpdate');
    await populateDropdown('/Supplier/GetAll', '#SupplierDropdown', 'id', 'supplierName', "Select Supplier");
});

// Save Button

$('#PurchaseBtnSave').off('click').click(async () => {
    clearMessage('successMessage', 'globalErrorMessage');
    debugger
    try {
        if ($('#PurchaseForm').valid()) {
            const formData = $('#PurchaseForm').serialize();
            const result = await SendRequest({ endpoint: '/Purchase/Create', method: 'POST', data: formData });
            // Clear previous messages
            $('#successMessage').hide();
            $('#UserError').hide();
            $('#EmailError').hide();
            $('#PasswordError').hide();
            $('#GeneralError').hide();
            debugger
            if (result.success && result.status === 201) {
                $('#PurchaseModelCreate').modal('hide');
                notification({ message: "Purchase Created successfully !", type: "success", title: "Success" });
                await getPurchaseList(); // Update the user list
            } else {
                notification({ message: result.detail, type: "error", title: "Error", time: 0 });
                $('#PurchaseModelCreate').modal('hide');
            }
        }
    } catch (error) {
        console.error('Error in click handler:', error);
        $('#PurchaseModelCreate').modal('hide');
        notification({ message: " Purchase Created failed . Please try again. !", type: "error", title: "Error", time: 0 });
    }

});



window.updatePurchase = async (id) => {
    resetFormValidation('#BranchForm', isBranchValidae);
    clearMessage('successMessage', 'globalErrorMessage');
    debugger
    $('#myModalLabelUpdateBranch').show();
    $('#myModalLabelAddBranch').hide();
    $('#BranchForm')[0].reset();
    await populateDropdown('/Company/GetAll', '#CompanyDropdown', 'id', 'name', "Select Company");

    const result = await SendRequest({ endpoint: '/Branch/GetById/' + id });
    if (result.success) {
        $('#BranchBtnSave').hide();
        $('#BranchBtnUpdate').show();

        $('#Name').val(result.data.name);
        $('#FullName').val(result.data.fullName);
        $('#ContactPerson').val(result.data.contactPerson);
        $('#Address').val(result.data.address);
        $('#PhoneNo').val(result.data.phoneNo);
        $('#FaxNo').val(result.data.faxNo);
        $('#EmailNo').val(result.data.emailNo);
        $('#IsActive').val(result.data.isActive);
        $('#CompanyDropdown').val(result.data.companyId);



        $('#BranchModelCreate').modal('show');
        resetValidation(isBranchValidae, '#BranchForm');
        $('#BranchBtnUpdate').off('click').on('click', async () => {
            debugger
            const formData = $('#BranchForm').serialize();
            const result = await SendRequest({ endpoint: '/Branch/Update/' + id, method: "PUT", data: formData });
            if (result.success) {
                $('#BranchModelCreate').modal('hide');
                notification({ message: "Branch Updated successfully !", type: "success", title: "Success" });

                await getBranchList(); // Update the user list
            } else {
                $('#BranchModelCreate').modal('hide');
                notification({ message: " Branch Updated failed . Please try again. !", type: "error", title: "Error", time: 0 });
            }
        });
    }
    loger(result);
}

window.showPurchase = async (id) => {
    const isDownload = false;  // Set this as needed
    const url = '/Report/DownloadPurchaseInvoice?id=' + id + '&isDownload=' + isDownload;
    //window.location.href = url;  
    window.open(url, '');
}


window.deletePurchase = async (id) => {
    loger("Dwlwrw ID  : " + id)
    clearMessage('successMessage', 'globalErrorMessage');
    debugger;
    $('#deleteAndDetailsModel').modal('show');
    $('#companyDetails').empty();
    $('#DeleteErrorMessage').hide();
    $('#DeleteErrorMessage').hide(); // Hide error message initially
    $('#btnDelete').off('click').on('click', async () => {
        debugger;
        const result = await SendRequest({ endpoint: `/Purchase/Delete/${id}`, method: "DELETE" });

        if (result.success) {
            $('#deleteAndDetailsModel').modal('hide');
            await getPurchaseList(); // Update the category list
            //notification({ message: "Purchase Deleted successfully !", type: "success", title: "Success" });

        } else {
            $('#deleteAndDetailsModel').modal('hide');
            notification({ message: result.detail, type: "error", title: "Error", time: 0 });
        }
    });
}
