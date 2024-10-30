

import { loger } from "../utility/helpers.js";
import { notification } from "../utility/notification.js";
import { SendRequest, populateDropdown } from '../utility/sendrequestutility.js';

// Initialize the purchase functionality when the document is ready
$(document).ready(async function () {
    loger("This is new purchase");
    await searchProducts();
    await searchSupplair();
    loadProductsFromLocalStorage();
    PurchaseProductVawserControler();
    loadSupplierFromLocalStorage();
    togglePurchaseButton();
});  











// Function to set up autocomplete for product search
const searchProducts = () => {
    $("#tagsProduct").autocomplete({
        source: async function (request, response) {
            try {
                // Send request to search products based on user input
                const res = await SendRequest({ endpoint: `/NewPurchase/SearchProducts?term=${request.term}` });
                response(res); // Return the response to autocomplete
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        },
        select: function (event, ui) {
            event.preventDefault(); // Prevent default behavior on select
            loger("Selected product:", ui);

            // Open modal and populate fields
            const purchaseProductList = JSON.parse(localStorage.getItem("purchaseProductList")) || {};
            const existingProduct = purchaseProductList[ui.item.productid];

            $('#productModal').modal('show');
            $('#productModalLabel').text(ui.item.label);
            $('#productPrice').val(existingProduct ? existingProduct.p : ui.item.unitPrice || 0);
            $('#productQuantity').val(existingProduct ? existingProduct.q : 1);
            $('#productDiscount').val(existingProduct ? existingProduct.d : ui.item.discount || 0);
            $('#productModal').data('productId', ui.item.productid);
            $("#tagsProduct").val(''); // Clear the search input
        }
    });
};
// Function to set up autocomplete for product search
// Function to set up autocomplete for supplier search
const searchSupplair = () => {
    $("#phoneNumber").autocomplete({
        source: async function (request, response) {
            try {
                // Send request to search suppliers based on user input
                const res = await SendRequest({ endpoint: `/NewPurchase/SearchSupplair?term=${request.term}` });
                response(res); // Return the response to autocomplete
            } catch (error) {
                console.error("Failed to fetch suppliers:", error);
            }
        },
        select: function (event, ui) {
            event.preventDefault(); // Prevent default behavior on select

            // Save selected supplier details to localStorage
            localStorage.setItem('selectedSupplier', JSON.stringify({
                label: ui.item.label,
                id: ui.item.id,
                phone: ui.item.phone || 'N/A' // Ensure phone is saved, fallback to 'N/A'
            }));

            // Display selected supplier details
            displaySupplierDetails(ui.item);

            // Clear the input field after selection
            $("#phoneNumber").val('');
        }
    });
};

// Function to display supplier details dynamically
const displaySupplierDetails = async (supplier) => {
    if (supplier) {
        $('#supplierName').text(supplier.label || 'N/A');
        $('#supplierPhone').text(supplier.phone || 'N/A');
        togglePurchaseButton();
    } else {
        $('#supplierName').text('N/A');
        $('#supplierPhone').text('N/A');
    }
   
};

// Load supplier from localStorage and display on page load if available
const loadSupplierFromLocalStorage = async () => {
    debugger
    const savedSupplier = localStorage.getItem('selectedSupplier');
    const supplier = JSON.parse(savedSupplier);
    await displaySupplierDetails(supplier);
    
};

// Function to load products from local storage and display in the table
const loadProductsFromLocalStorage = async () => {
    debugger
    const purchaseProductList = JSON.parse(localStorage.getItem("purchaseProductList")) || {};
    const products = await SendRequest({ endpoint: '/Product/GetAllProduct' });
    debugger
    if (products !== null) {
        const allProducts = products.data;
        $('#productTableBody').empty(); // Clear the table before loading
        debugger
        for (const productId in purchaseProductList) {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                const quantity = purchaseProductList[productId].q;
                const price = purchaseProductList[productId].p || 0;
                const discountPercentage = purchaseProductList[productId].d || 0;
                const totalPrice = (price * quantity) - discountPercentage;
                debugger
                const productToAdd = { productid: productId, label: product.name, price, quantity, totalPrice, discountPercentage };
                addProductToTable(productToAdd);
            }
        }
    } else {
        console.error("Failed to fetch products:", products);
    }
};

// Function to add a product to the table
const addProductToTable = (product) => {
    debugger
    const { label: name, price: productPrice, productid: productId, quantity: productQuantity, discountPercentage } = product;
    const totalPrice = (productPrice * productQuantity) - discountPercentage;
    debugger
    const newRow = `
        <tr data-product-id="${productId}">
            <td><button class="btn btn-sm delete-item-btn" data-product-id="${productId}" aria-label="Delete"><i class="fas text-danger fa-trash-alt"></i></button></td>
            <td>${name}</td>
            <td>${productPrice.toFixed(2)} Tk</td>
            <td>${productQuantity.toFixed(2)} Unit</td>
            <td>${discountPercentage.toFixed(2)} Tk</td>
            <td>${totalPrice.toFixed(2)} Tk</td>
            <td><button class="btn btn-sm update-item-btn" data-product-id="${productId}" aria-label="UpdateProductItem"><i class="fas fa-sync-alt text-primary"></i></button></td>
        </tr>
    `;
    $('#productTableBody').append(newRow);
};

// Event handler for saving product details from the modal
$('#saveProduct').on('click', function () {
    const productName = $('#productModalLabel').text();
    const productId = $('#productModal').data('productId');
    const productPrice = parseFloat($('#productPrice').val());
    const productQuantity = parseInt($('#productQuantity').val());
    const productDiscount = parseFloat($('#productDiscount').val());

    // Update the purchase product list in local storage
    let purchaseProductList = JSON.parse(localStorage.getItem("purchaseProductList")) || {};
    purchaseProductList[productId] = { q: productQuantity, p: productPrice, d: productDiscount, n: productName };

    localStorage.setItem("purchaseProductList", JSON.stringify(purchaseProductList));
    $('#productModal').modal('hide');
    loadProductsFromLocalStorage();
    PurchaseProductVawserControler();
    togglePurchaseButton();
    togglePurchaseButton();
});

// Event handler for updating product item in the table
$(document).on('click', '.update-item-btn', function () {
    const productId = $(this).data('product-id');
    const purchaseProductList = JSON.parse(localStorage.getItem("purchaseProductList")) || {};
    const product = purchaseProductList[productId];

    if (product) {
        // Pre-fill the modal with existing product data
        $('#productPrice').val(product.p);
        $('#productQuantity').val(product.q);
        $('#productDiscount').val(product.d);
        $('#productModalLabel').text(product.n); // Set the product name in the modal label
        $('#productModal').data('productId', productId); // Set the product ID in the modal data

        $('#productModal').modal('show');

        $('#saveProduct').off('click').on('click', function () {
            const updatedPrice = parseFloat($('#productPrice').val());
            const updatedQuantity = parseInt($('#productQuantity').val());
            const updatedDiscount = parseFloat($('#productDiscount').val());

            // Update the product with the new values, retaining the product name
            purchaseProductList[productId] = { p: updatedPrice, q: updatedQuantity, d: updatedDiscount, n: product.n };
            localStorage.setItem("purchaseProductList", JSON.stringify(purchaseProductList));

            loadProductsFromLocalStorage();
            PurchaseProductVawserControler();
            togglePurchaseButton();
            $('#productModal').modal('hide');
        });
    }
});

// Event handler for deleting a product item from the table
$(document).on('click', '.delete-item-btn', function () {
    const productId = $(this).data('product-id');
    let purchaseProductList = JSON.parse(localStorage.getItem("purchaseProductList")) || {};
    delete purchaseProductList[productId];

    localStorage.setItem("purchaseProductList", JSON.stringify(purchaseProductList));
    loadProductsFromLocalStorage();
    PurchaseProductVawserControler();
    togglePurchaseButton();
    
});

const PurchaseProductVawserControler = async () => {
    // Fetch the purchase product list from local storage
    let purchaseProductList = JSON.parse(localStorage.getItem("purchaseProductList")) || {};
    debugger

    // Clear existing content
    $('#PurchaseProductVawser').empty();

    // Start building the new row
    const newRow = `
        <div class="h-100">
            <div class="border px-3 rounded">
                <!-- Company and Branch Details -->
                <div class="d-flex justify-content-between">
                    <p class="mb-0">Name Of Company:</p>
                    <p class="mb-0">Sample Company</p>
                </div>
                <div class="d-flex justify-content-between">
                    <p class="mb-0">Name Of Branch:</p>
                    <p class="mb-0">Sample Branch</p>
                </div>
                <hr style="border: 1px solid;" />

                <!-- Products List - Scrollable Area -->
                <div style="max-height: 100px; overflow-y: auto; font-size: 12px;">
                    ${purchaseProductList && Object.keys(purchaseProductList).length > 0
            ? Object.entries(purchaseProductList).map(([id, product]) => `
                            <div class="d-flex justify-content-between">
                                <p class="mb-0 col-7 small-text">${product.n}</p>
                                <p class="mb-0 col-5 small-text">(${product.p} * ${product.q}) - ${product.d} = ${(product.p * product.q) - product.d} Tk</p>
                            </div>
                        `).join('')
            : `<div class="d-flex justify-content-center align-items-center h-100">
                            <p class="mb-0">No product available</p>
                          </div>`}
                </div>

                <hr style="border: 1px solid;" />

                <!-- Pricing and Customer Information -->
                <div class="d-flex justify-content-between">
                    <p class="mb-0">Total:</p>
                    <p class="mb-0">${calculateTotal(purchaseProductList)} Tk</p>
                </div>
                <hr style="border: 1px solid;" />

                <div class="d-flex justify-content-between">
                    <p class="mb-0">Sub total</p>
                    <p class="mb-0">${calculateSubtotal(purchaseProductList)} Tk</p>
                </div>
                <div class="d-flex justify-content-between">
                    <p class="mb-0">VAT</p>
                    <p class="mb-0">0 Tk</p>
                </div>
                <hr style="border: 1px solid;" />

                <div class="d-flex justify-content-between">
                    <p class="mb-0">Payment Total</p>
                    <p class="mb-0">${calculatePaymentTotal(purchaseProductList)} Tk</p>
                </div>
                <div class="d-flex justify-content-between">
                    <p class="mb-0">Amount Due</p>
                    <p class="mb-0">0 Tk</p>
                </div>
                <hr style="border: 1px solid;" />
                <div class="d-flex justify-content-between">
                    <p class="mb-0">Total Payment Amount</p>
                    <p class="mb-0">${calculateTotal(purchaseProductList)} Tk</p>
                </div>
                 <div class="d-flex mt-5 mb-auto justify-content-between">
                    <button type="button" class="btn btn-success" id="paymentButton" onclick="paymentButton()">Purchase</button>
                    <button type="button" class="btn btn-danger" id="cancelButton" onclick="cancelButton()">Cancel</button>
                </div>

            </div>
        </div>
    `;

    // Append the new row to the container
    $('#PurchaseProductVawser').append(newRow);
};

// Define the paymentButton function
window.paymentButton = async () => {
    debugger
    // Retrieve data from local storage
    let purchaseProductList = JSON.parse(localStorage.getItem("purchaseProductList")) || {};
    let idExistingSupplier = JSON.parse(localStorage.getItem("selectedSupplier")) || null;
    debugger
    // Check if purchaseProductList has items and supplier exists
    if (Object.keys(purchaseProductList).length > 0 && idExistingSupplier && idExistingSupplier.id) {
        // Create the purchase item structure
        const purchaseItem = {
            companyId: idExistingSupplier.id,
            products: Object.keys(purchaseProductList).map(productID => {
                debugger
                return {
                    productID: productID,
                    quantity: purchaseProductList[productID].q, // Assuming 'q' represents quantity
                    price: purchaseProductList[productID].p, // Assuming 'p' represents price
                    discount: purchaseProductList[productID].d // Assuming 'n' is the name/description
                };
            })
        };
        debugger
        if (purchaseItem) {
            $.ajax({
                url: '/NewPurchase/Purchase',
                type: 'POST',
                contentType: 'application/json', // Set the content type to JSON
                data: JSON.stringify(purchaseItem), // Convert the data to JSON format
                success: function (result) {
                    debugger
                    if (result.success && result.status === 201) {
                        clearAll();
                        alert(result.data);
                    } else {
                        alert("Lgoin Valid Admin OR User");
                    }
                    debugger
                },
                error: function (xhr, status, error) {
                    alert("Lgoin Valid Admin OR User");
                    console.error('Error during purchase:', xhr.responseText); // Handle error
                }
            });
        }
        
    } else {
        console.error("No products found or supplier ID is missing.");
    }
};


// Define the cancelButton function
window.cancelButton = async () => {
    clearAll();
};

const clearAll = () => {
    localStorage.removeItem("purchaseProductList"); // Clear purchaseProductList
    localStorage.removeItem("selectedSupplier");  // Clear ExjustingSupplair
    loadProductsFromLocalStorage();
    PurchaseProductVawserControler();
    togglePurchaseButton();
    loadSupplierFromLocalStorage();
}

// Function to toggle the 'Purchase' button based on the result of isActivePurchesButton
const togglePurchaseButton = () => {
    const purchaseButton = document.getElementById("paymentButton");
    debugger
    

    // Check the state of the button
    const isActive = isActivePurchesButton(); // Ensure this returns boolean

    if (isActive) {
        purchaseButton.classList.remove("disabled");
        purchaseButton.disabled = false;
    } else {
        purchaseButton.classList.add("disabled");
        purchaseButton.disabled = true;
    }
};


const isActivePurchesButton = () => {
    // Retrieve purchaseProductList and selectedSupplier from localStorage
    let purchaseProductList = JSON.parse(localStorage.getItem("purchaseProductList")) || [];
    let idExjustingSupplair = JSON.parse(localStorage.getItem("selectedSupplier")) || null;
    debugger
    // Check if purchaseProductList contains items and idExjustingSupplair is not empty
    if (Object.keys(purchaseProductList).length > 0 && idExjustingSupplair && idExjustingSupplair.id) {
        return true; // Return true if both conditions are met
    }

    return false; // Return false otherwise
}


// Function to calculate the total amount
const calculateTotal = (productList) => {
    return Object.values(productList).reduce((total, product) => total + (product.p * product.q) - product.d, 0);
};

// Function to calculate the total discount
const calculateTotalDiscount = (productList) => {
    return Object.values(productList).reduce((total, product) => total + product.d, 0);
};

// Function to calculate subtotal after applying discounts
const calculateSubtotal = (productList) => {
    return Object.values(productList).reduce((total, product) => total + (product.p * product.q) - product.d, 0);
};

// Function to calculate the payment total
const calculatePaymentTotal = (productList) => {
    // Assuming the total payment is the subtotal minus any additional discounts
    return calculateSubtotal(productList);
};



