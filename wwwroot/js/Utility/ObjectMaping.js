import { SendRequest } from "./SendRequestUtility.js";
import { notification } from "./notification.js";

$(document).ready(async function () {
    initializeAutocomplete();
});
export const mapUserToEmployee = async (user) => {
    debugger
    const newEmployee = {
        Id: user.id,
        IsEmp:true,
        FirstName: user.firstName,
        LastName: user.lastName,
        Title: null,  // Default value or you can set based on your logic
        TitleOfCourtesy: 'No Data',  // Default value or you can set based on your logic
        BirthDate: new Date(),  // Or another date if available in user
        HireDate: new Date(),  // Or another date if applicable
        Address: user.address || 'No Data', // Fallback to empty string if undefined
        City: 'No Data',  // Set based on your logic
        Region: 'No Data',  // Set based on your logic
        PostalCode: 'No Data',  // Set based on your logic
        Country: user.country || 'No Data',  // Use user's country or empty string
        HomePhone: user.phoneNumber || 'No Data', // Use user's phone number or empty string
        Extension: 'No Data',  // Default value or you can set based on your logic
        Notes: user.about || 'No Data',  // Use user's about section or empty string
        ReportsTo: null,  // Default value or set according to your logic
        Photo: null,  // Binary data for photo, set based on your logic
        PhotoPath: user.userImg || 'No Data',  // Use user's image path or empty string

    };

    return newEmployee;
};

export const mapUserToCustomer = async (user) => {
    debugger;
    const newCustomer = {
        CustomerName: `${user.firstName} ${user.lastName}`, // Combine first and last name
        ContactName: " No Data", // Placeholder or set based on your logic
        ContactTitle: " No Data", // Placeholder or set based on your logic
        Address: user.address || 'Default Address', // Use user's address or default
        City: 'No Data ', // Placeholder or set based on your logic
        Region: 'No Data ', // Placeholder or set based on your logic
        PostalCode: ' No Data', // Placeholder or set based on your logic
        Country: user.country || 'No Data ', // Use user's country or placeholder
        Phone: user.phoneNumber || ' No Data', // Use user's phone number or placeholder
        Fax: 'No Data ', // Placeholder or set based on your logic
        Email: user.email, // Ensure the user's email is provided
        PasswordHash: "No Data", // Assume you have a function to hash passwords
        DateOfBirth: new Date(user.dateOfBirth) || new Date(), // Convert to Date object or use the current date
        MedicalHistory: user.password // Placeholder or set based on your logic
    };

    return newCustomer;
};
export const mackEmployee = async (id) => {
    debugger
    const users = await SendRequest({ endpoint: '/DashboardUser/GetById/' + id });
    if (users.success) {
        const newEmployee = await mapUserToEmployee(users.data);
        const employee = await SendRequest({ endpoint: '/Employee/Create', method: 'POST', data: newEmployee });

        if (employee.success) {
            debugger
            const updatedUserData = {
                ...users.data,
                isApprovedByAdmin: true,
                isEmployee: false,
                roleName: users.data.roles && users.data.roles.length > 0 ? users.data.roles[0] : null,
            };
            debugger
            const updateUser = await SendRequest({ endpoint: '/DashboardUser/Update/' + id, method: "PUT", data: updatedUserData });
            if (updateUser.success) {
                
                return true;
            } else {
                // Roll back - if required, add rollback code here
             
         
                return false;
            }
        } else {
            notification({ message: "Employee Creation Failed!", type: "error", title: "Error" });
            return false; // Moved return statement after notification
        }
    } else {
        notification({ message: "User Not Found", type: "error", title: "Error" });
        return false;
    }
};


export const mackCustomer = async (id) => {
    debugger
    const users = await SendRequest({ endpoint: '/DashboardUser/GetById/' + id });
    if (users.success) {
        const newCustomer = await mapUserToCustomer(users.data);
        const employee = await SendRequest({ endpoint: '/Customer/Create', method: 'POST', data: newCustomer });
        if (employee.success) {
            const updatedUserData = {
                ...users.data,
                isApprovedByAdmin: true,
                isEmployee: false,
                roleName: users.data.roles && users.data.roles.length > 0 ? users.data.roles[0] : null,

            };
            const updateUser = await SendRequest({ endpoint: '/DashboardUser/Update/' + id, method: "PUT", data: updatedUserData })
            if (updateUser.success) {
                return true;
            } else {
                // role back all functions 
                return false;
            }
        } else {
            return false;
            notification({ message: "Employee  Create Fauld ! ", type: "error", title: "Error" });
        }

    } else {
        notification({ message: "User Not Found ", type: "error", title: "Error" });
        return false;
    }
}



export const initializeAutocomplete = (selector, sourceUrl) => {
    $(selector).autocomplete({
        source: sourceUrl, // Endpoint to fetch products
        select: function (event, ui) {
            // Set the selected product name to the search input
            $(selector).val(ui.item.label);
            // Store the selected productId in the hidden input field
            $("#selectedProductId").val(ui.item.productid);
            // Prevent the default form submission
            event.preventDefault();
            // Trigger form submission manually
            $(this).closest('form').submit();
        }
    });
};