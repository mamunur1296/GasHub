
export const loger = (message) => {
    console.log(message);
}
///**
// * Initializes a DataTable with the given data and configuration.
// * @param {Array} data - The data to be displayed in the table.
// * @param {Array} columnsConfig - Configuration for the table columns.
// * @param {string} tableId - The ID of the table element.
// */
export const initializeDataTable = async (data, schema, tableId) => {
    try {
        debugger
        if (!Array.isArray(data) || !Array.isArray(schema) || typeof tableId !== 'string') {
            throw new Error('Invalid arguments passed to initializeGenericDataTable');
        }
        // Handle null values in schema
        //schema.forEach(x => {
        //    if (x.value === null) {
        //        x.value = "No data";
        //    }
        //});
        const tableElement = $(`#${tableId}`);
        if (!tableElement.length) {
            throw new Error(`Table with ID ${tableId} not found`);
        }

        // Check if the DataTable is already initialized
        if ($.fn.DataTable.isDataTable(tableElement)) {
            // Destroy the existing DataTable
            tableElement.DataTable().destroy();
        }
        // Initialize the DataTable
        tableElement.DataTable({
            processing: true,
            lengthChange: true,
            lengthMenu: [[5, 10, 20, 30, -1], [5, 10, 20, 30, 'All']],
            searching: true,
            ordering: true,
            paging: true,
            data: data,
            columns: schema
        });
    } catch (error) {
        console.error('Error initializing DataTable:', error);
    }
}

// Helper function to create action buttons

//const createActionButton = (buttonType, btnClass, id, action, disabled = false) => {
//    const disabledAttr = disabled ? 'disabled' : '';
//    return `<button class="btn ${btnClass} btn-sm ms-1" onclick="${action}('${id}')" ${disabledAttr}>${buttonType}</button>`;
//}

//export const createActionButtons = (row, actions) => {
//    return actions.map(action => createActionButton(action.label, action.btnClass, row.id, action.callback, action.disabled)).join(' ');
//}

const createActionButton = (buttonType, btnClass, id, action, disabled = false) => {
    const disabledAttr = disabled ? 'disabled' : '';
    return `<button class="btn ${btnClass} btn-sm ms-1" onclick="${action}(${id})" ${disabledAttr}>${buttonType}</button>`;
}

export const createActionButtons = (row, actions) => {
    return actions.map(action => createActionButton(action.label, action.btnClass, row.id, action.callback, action.disabled)).join(' ');
}




export const showCreateModal = (modalId, saveBtnId, updateBtnId) => {
    // Clear all text inputs within the specified modal
    $(`#${modalId} input[type="text"]`).val('');

    // Show the modal
    $(`#${modalId}`).modal('show');

    // Show and hide the specified buttons
    $(`#${saveBtnId}`).show();
    $(`#${updateBtnId}`).hide();
}


export const showExceptionMessage = (successId, message) => {
    // Ensure the successId is a valid selector
    if (typeof successId !== 'string' || !successId.startsWith('#')) {
        console.error('Invalid successId provided. Must be a string starting with "#".');
        return;
    }

    // Ensure the message is a valid string
    if (typeof message !== 'string') {
        console.error('Invalid message provided. Must be a string.');
        return;
    }

    // Find the success message element and update its content
    const $successElement = $(successId);
    if ($successElement.length) {
        $successElement.text(message).show();
    } else {
        console.error(`Element with selector ${successId} not found.`);
    }
};


export const displayNotification = ({
    messageElementId = '#successMessage',
    modalId = '#exampleModal',
    formId = '#myForm',
    message = 'Operation successful',
    onSuccess = () => { },
    onError = () => { }
}) => {
    // Ensure the messageElementId is a valid selector
    if (typeof messageElementId !== 'string' || !messageElementId.startsWith('#')) {
        console.error('Invalid messageElementId provided. Must be a string starting with "#".');
        onError();
        return;
    }

    // Ensure the message is a valid string
    if (typeof message !== 'string') {
        console.error('Invalid message provided. Must be a string.');
        onError();
        return;
    }

    // Find the message element and update its content
    const $messageElement = $(messageElementId);
    if ($messageElement.length) {
        $messageElement.text(message).show();
    } else {
        console.error(`Element with selector ${messageElementId} not found.`);
        onError();
        return;
    }

    // Hide the modal
    $(modalId).modal('hide');

    // Reset the form
    $(formId)[0].reset();

    onSuccess();
};



export const initializevalidation = (formselector, rules, messages) => {
    const validator = $(formselector).validate({
        onkeyup: function (element) {
            $(element).valid();
        },
        rules: rules,
        messages: messages,
        errorelement: 'div',
        errorplacement: function (error, element) {
            error.addclass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorclass, validclass) {
            $(element).addclass('is-invalid');
        },
        unhighlight: function (element, errorclass, validclass) {
            $(element).removeclass('is-invalid');
        }
    });
    debugger
    // bind validation on change and focus events
    // bind validation on change and focus events
    // bind validation on change and focus events
    // bind validation on change and focus events
    // bind validation on change and focus events
    $(formselector + ' input[type="text"]').on('change focus', function () {
        validator.element($(this));
    });

    return validator;
}

export const resetValidation = (validator, formSelector) => {
    validator.resetForm(); // Reset validation
    $(formSelector + ' .form-group .invalid-feedback').remove(); // Remove error messages
    $(formSelector + ' input').removeClass('is-invalid'); // Remove error styling
};



export const dataToMap = (data, key) => {
    debugger
    return data.reduce((map, item) => {
        map[item[key]] = item;
        return map;
    }, {});
};

export const clearMessage = (...messageIds) => {
    messageIds.forEach(id => {
        $(`#${id}`).hide();
    });
}
export const resetFormValidation = (formId, validator) => {
    // Reset the form fields
    $(formId)[0].reset();

    // Reset validation (removes all error messages and error classes)
    validator.resetForm();

    // Remove any additional classes applied by validation
    $(formId).find('.is-invalid').removeClass('is-invalid');
    $(formId).find('.invalid-feedback').remove();
};
