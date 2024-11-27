
//export const SendRequest = async ({ endpoint, method = 'GET', data = null, headers = {}, dataType = 'json' }) => {
//    // Validate and set default method
//    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
//    method = validMethods.includes(method.toUpperCase()) ? method.toUpperCase() : 'GET';

//    // Validate and set default data type
//    const validDataTypes = ['json', 'text', 'html', 'xml', 'script'];
//    dataType = validDataTypes.includes(dataType) ? dataType : 'json';

//    // Determine content type and processing options based on data
//    let contentType = null;
//    let processData = true;
//    let cache = true;
  
//    if (data) {
        
//        if (data instanceof FormData) {
//            // Handling FormData - Typically used for file uploads or complex form data
//            contentType = false;  // Let the browser set the appropriate content type
//            processData = false;  // Prevent jQuery from processing the data
//            cache = false;        // Disable caching for file uploads
//        } else if (typeof data === 'string') {
//            // Handling serialized form data - e.g., $('#EmployeeForm').serialize()
//            contentType = 'application/x-www-form-urlencoded';
//        } else if (method === "DELETE") {
//            contentType = 'application/x-www-form-urlencoded';
//        } else if (typeof data === 'object' && !(data instanceof FormData)) {
//            // Handling JSON data
//            contentType = 'application/x-www-form-urlencoded';
//            processData = true;
//            cache = true;
//        }
//    }
    
//    // Prepare request data
//    let requestData = null;
//    if (data) {
        
//        switch (contentType) {
//            case 'application/json':
//                requestData = JSON.stringify(data);
//                break;
//            case 'application/x-www-form-urlencoded':
//                requestData = new URLSearchParams(data).toString();
//                break;
//            case false:
//                requestData = data; // FormData is already prepared, no need for additional processing
//                break;
//            default:
//                requestData = data; // This case is for any custom or non-standard content types
//        }
//    }
   
//    // Setup fetch options
//    const options = {
//        method,
//        headers: {
//            ...headers,
//            ...(contentType !== false ? { 'Content-Type': contentType } : {})
//        },
//        body: requestData,
//        processData,
//        cache: cache ? 'default' : 'no-cache',
//    };
    
//    // Perform fetch request
//    try {
        
//        const response = await fetch(endpoint, options);
//        const result = dataType === 'json' ? await response.json() : await response.text();

//        if (response.ok) {
//            return result;
//        } else {
//            throw new Error(result || 'Network response was not ok.');
//        }
//    } catch (error) {
//        handleError(error.message || 'Unknown error occurred.');
//        throw new Error(error.message || 'Network response was not ok.');
//    }
//};

export const SendRequest = async ({ endpoint, method = 'GET', data = null, headers = {}, dataType = 'json' }) => {
    // Validate and set default method
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    method = validMethods.includes(method.toUpperCase()) ? method.toUpperCase() : 'GET';
    
    // Validate and set default data type
    const validDataTypes = ['json', 'text', 'html', 'xml', 'script'];
    dataType = validDataTypes.includes(dataType) ? dataType : 'json';
    
    // Determine content type and processing options based on data
    let contentType = null;
    let processData = true;
    let cache = true;

    if (data) {
        if (data instanceof FormData) {
            // Handling FormData - Typically used for file uploads or complex form data
            contentType = false;  // Let the browser set the appropriate content type
            processData = false;  // Prevent jQuery from processing the data
            cache = false;        // Disable caching for file uploads
        } else if (typeof data === 'string') {
            // Handling serialized form data - e.g., $('#EmployeeForm').serialize()
            contentType = 'application/x-www-form-urlencoded';
        } else if (method === "DELETE") {
            contentType = 'application/x-www-form-urlencoded';
        } else if (typeof data === 'object' && !(data instanceof FormData)) {
            // Handling JSON data
            contentType = 'application/x-www-form-urlencoded';
            processData = true;
            cache = true;
        }
    }
    
    // Prepare request data
    let requestData = null;
    if (data) {
        switch (contentType) {
            case 'application/json;charset=utf-8':
                requestData = JSON.stringify(data);
                break;
            case 'application/x-www-form-urlencoded':
                requestData = new URLSearchParams(data).toString();
                break;
            case false:
                requestData = data; // FormData is already prepared, no need for additional processing
                break;
            default:
                requestData = data; // This case is for any custom or non-standard content types
        }
    }

    // Setup fetch options
    const options = {
        method,
        headers: {
            ...headers,
            ...(contentType !== false ? { 'Content-Type': contentType } : {})
        },
        body: requestData,
        processData,
        cache: cache ? 'default' : 'no-cache',
    };


    
    try {
        
        const response = await fetch(endpoint, options);
        const result = dataType === 'json' ? await response.json() : await response.text();
        
        if (response.ok) {
            return result;
        } else {
            throw new Error(result || 'Network response was not ok.');
        }
    } catch (error) {
        handleError(error.message || 'Unknown error occurred.');
        throw new Error(error.message || 'Network response was not ok.');
    }
};

export function handleError(message) {
    console.error('Error:', message);
}

export const populateDropdown = async (endpoint, dropdownSelector, valueField, textField, defaultOption = null) => {
    try {
        
        const response = await SendRequest({ endpoint: endpoint });
        let data = response;
        
        if (response.data) {
            data = response.data;
        } 

        // Clear existing options
        $(dropdownSelector).empty();

        // Add default option
        if (defaultOption !== null) {
           
            $(dropdownSelector).append(`<option value="">${defaultOption}</option>`);
        } 
        
        // Check if data is null or empty
        if (!data || data.length === 0) {
          
            $(dropdownSelector).append('');
            //$(dropdownSelector).append('<option value=""></option>');
            return;
        }
        const textFields = textField.split(',').map(field => field.trim());
        // Add options from the fetched data
        $.each(data, function (index, item) {
            const displayText = textFields.map(field => item[field] || '').join(' ');
            $(dropdownSelector).append(`<option value="${item[valueField]}">${displayText}</option>`);
        });
    } catch (error) {
        
        console.error(`Error populating ${dropdownSelector}:`, error);
        // Handle error
        $(dropdownSelector).empty();
        $(dropdownSelector).append('<option value="">Error fetching data</option>');
    }
}

export const setupDropdownChange = (endpoint, dropdownSelector, valueField, textField, defaultOption = null) => {
    debugger
    $(dropdownSelector).off("focus").on("focus", async function (e) {
        e.preventDefault();  // Corrected the typo
        debugger
        // Call the populateDropdown function to refresh data
        await populateDropdown(endpoint, dropdownSelector, valueField, textField, defaultOption = null);  // Removed unnecessary assignment
    });
};
