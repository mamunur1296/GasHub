$(document).ready(async function () {
});
export const notification = ({
    message = "",
    type = "success",
    title = "",
    time = 5000,
    position = "toast-top-center" // Default position, can be overridden
} = {}) => {

    debugger
    console.log("Notification");
    // Set the options for Toastr
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": position, // Use the dynamic position here
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": time,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    // Determine the type of notification to display
    switch (type.toLowerCase()) {
        
        case 'success':
            toastr.success(message, title);
            break;
        case 'error':
            toastr.error(message, title);
            break;
        case 'warning':
            toastr.warning(message, title);
            break;
        case 'info':
            toastr.info(message, title);
            break;
        default:
            toastr.info(message, title);
            break;
    }
}
export const notificationErrors = ({
    message = "",
    type = "error",
    title = "Error",
    time = 15000,
    position = "toast-top-center" // Default position, can be overridden
} = {}) => {

    debugger
    console.log("Notification");
    // Set the options for Toastr
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": position, // Use the dynamic position here
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": time,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    // Determine the type of notification to display
    switch (type.toLowerCase()) {

        case 'success':
            toastr.success(message, title);
            break;
        case 'error':
            toastr.error(message, title);
            break;
        case 'warning':
            toastr.warning(message, title);
            break;
        case 'info':
            toastr.info(message, title);
            break;
        default:
            toastr.info(message, title);
            break;
    }
}


//Top Right(Default):

//"toast-top-right": Displays the notification in the top - right corner of the screen.
//Top Left:

//"toast-top-left": Displays the notification in the top - left corner of the screen.
//Top Center:

//"toast-top-center": Displays the notification at the top center of the screen.
//Top Full Width:

//"toast-top-full-width": Displays the notification at the top of the screen, spanning the full width.
//Bottom Right:

//"toast-bottom-right": Displays the notification in the bottom - right corner of the screen.
//Bottom Left:

//"toast-bottom-left": Displays the notification in the bottom - left corner of the screen.
//Bottom Center:

//"toast-bottom-center": Displays the notification at the bottom center of the screen.
//Bottom Full Width:

//"toast-bottom-full-width": Displays the notification at the bottom of the screen, spanning the full width.


//// Display a success message
//notification({
//    message: "Operation completed successfully!",
//    type: "success",
//    title: "Success",
//    time: 5000 // Optional: Duration for the notification to be visible
//    position: "toast-top-right"
//});

//// Display an error message
//notification({
//    message: "Something went wrong. Please try again.",
//    type: "error",
//    title: "Error"
//    position: "toast-top-right"
//});

//// Display a warning message
//notification({
//    message: "This is a warning message.",
//    type: "warning",
//    title: "Warning"
//    position: "toast-top-right"
//});

//// Display an info message
//notification({
//    message: "This is some information.",
//    type: "info",
//    title: "Information"
//    position: "toast-top-right"
//});
