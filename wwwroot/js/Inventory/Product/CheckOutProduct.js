
import { notification, notificationErrors } from "../../utility/gashyb_notification.js";

$(document).ready(async function () {
    await getLocalStorageList();
    await updateTotals();
    await addressOptions();
    await ReturnProductList();
});

async function getLocalStorageList() {
    debugger
    var storedProducts = JSON.parse(localStorage.getItem('productIds')) || {};
    var products = await getProduct();
    var productMap = {};

    products.forEach(function (product) {
        productMap[product.id] = product;
    });

    var $productList = $('#product-list');
    $productList.empty(); // Clear the current list
    const productDiscuns = await $.ajax({
        url: '/ProductDiscun/GetallProductDiscun',
        type: 'get',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8'
    });
    var productDiscunMap = {};
    productDiscuns.data.forEach(function (discount) {
        productDiscunMap[discount.productId] = discount;
    });
    Object.keys(storedProducts).forEach(function (id) {
        function normalizeDate(date) {
            const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return normalizedDate;
        }
        const today = normalizeDate(new Date());

        var product = productMap[id];
        var quantity = storedProducts[id];
        var discount = productDiscunMap[id];
        const discountValidTill = normalizeDate(new Date(discount?.validTill));
        var discounted = discountValidTill >= today ? discount?.discountedPrice : 0; // Check if discountedPrice exists
       
        if (product) {
            var productHtml = `
            <div class="d-flex justify-content-between mb-2" data-product-id="${id}">
                <div class="d-flex gap-2">
                    <div class="rounded-pil">
            
                        <img src="/images/${product?.prodImage}" alt="product-img" style="width: 60px;">
                    </div>
                    <div class="d-flex align-items-start flex-column">
                        <h5>${product.name}</h5>
                        <div class="d-flex mt-auto">
                            <button class="btn decrement-btn"> - </button>
                            <p class="btn quantity">${quantity}</p>
                            <button class="btn increment-btn"> + </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="d-flex align-items-start flex-column">
                        <h5 class="fs-4"> Tk : <span>${(product.prodPrice - discounted) * quantity}</span> </h5>
                        <a class="remove-btn">Remove</a>
                    </div>
                </div>
            </div>`;
        }
        

        $productList.append(productHtml);
    });

    updateTotals();
    ReturnProductList();
}

async function getProduct() {
    try {
        const response = await $.ajax({
            url: '/Product/GetAllProduct',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        return response.data || [];
    } catch (error) {
        console.log('Error:', error);
        return [];
    }
}

async function updateTotals() {
    var storedProducts = JSON.parse(localStorage.getItem('productIds')) || {};
    var products = await getProduct();
    var productMap = {};
    var subtotal = 0;
    var total = 0;
    var totalDiscount = 0;
    const productDiscuns = await $.ajax({
        url: '/ProductDiscun/GetallProductDiscun',
        type: 'get',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8'
    });
    var productDiscunMap = {};
    productDiscuns.data.forEach(function (discount) {
        productDiscunMap[discount.productId] = discount;
    });
    // Create a product map for easy access
    products.forEach(function (product) {
        productMap[product.id] = product;
    });

    // Calculate the subtotal
    Object.keys(storedProducts).forEach(function (id) {
        var product = productMap[id];
        function normalizeDate(date) {
            const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return normalizedDate;
        }

        const today = normalizeDate(new Date());
        if (product) {
            var discount = productDiscunMap[id];
            if (discount) {
                const discountValidTill = normalizeDate(new Date(discount?.validTill));

                if (discountValidTill >= today) {
                    subtotal += (product.prodPrice - discount?.discountedPrice) * storedProducts[id]; // Assuming the product price is stored in `product.price`
                    totalDiscount += discount?.discountedPrice * storedProducts[id];
                } else {
                    subtotal += product.prodPrice * storedProducts[id];
                }
                
            } else {
                subtotal += product.prodPrice * storedProducts[id];
            }
            total = subtotal;
        }
    });

    // Update the HTML
    $('#subtotal').text(subtotal);
    $('#discount').text(totalDiscount);
    $('#total').text(total);
}

// Ensure to call updateTotals() when necessary, e.g., after adding/removing/updating products in the cart


$(document).on('click', '.decrement-btn', async function () {
    
    var $productDiv = $(this).closest('[data-product-id]');
    var productId = $productDiv.data('product-id');
    var storedProducts = JSON.parse(localStorage.getItem('productIds')) || {};

    if (storedProducts[productId] > 1) {
        storedProducts[productId]--;
    } else {
        delete storedProducts[productId];
        $productDiv.remove();
    }

    localStorage.setItem('productIds', JSON.stringify(storedProducts));
    await getLocalStorageList();
    updateTotals();
    ReturnProductList();
});

$(document).on('click', '.increment-btn', function () {
    var $productDiv = $(this).closest('[data-product-id]');
    var productId = $productDiv.data('product-id');
    var storedProducts = JSON.parse(localStorage.getItem('productIds')) || {};

    storedProducts[productId]++;
    localStorage.setItem('productIds', JSON.stringify(storedProducts));
    getLocalStorageList();
});

$(document).on('click', '.remove-btn', function () {
    
    var $productDiv = $(this).closest('[data-product-id]');
    var productId = $productDiv.data('product-id');
    var storedProducts = JSON.parse(localStorage.getItem('productIds')) || {};

    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to remove this product?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            // User confirmed, proceed with removal
            delete storedProducts[productId];
            localStorage.setItem('productIds', JSON.stringify(storedProducts));
            $productDiv.remove();
            updateTotals();
            ReturnProductList();

            // Optionally, show success message
            Swal.fire(
                'Removed!',
                'The product has been removed.',
                'success'
            );
        }
    });
});

async function addressOptions() {
    try {
        
        const userId = $('#address-container').data('user-id');


        const deliveryAddressList = await getAddressList();
        const loginUser = await GetLoginUserById(userId);
        const deliveryAddress = deliveryAddressList.find(x => x.userId === userId);
        console.log(loginUser);
        if (deliveryAddress) {
            const { mobile, address } = deliveryAddress;

            if (mobile && address) {
                
                $('#address-container').html(`
                        
                       <p>Delivery Address </p>
                        <div class="d-flex w-100 flex-column p-2" id="address-details" style="background-color: #dcdcdc;">
                            <span id="Name">${loginUser?.firstName} ${loginUser?.lastName}</span>
                            <span id="phonNumber">${mobile}</span>
                            <span id="addressDetails" class="w-100">${address}</span>
                        </div>
                `);
                ConfirmOrderBtnActivity(true);
            } else if (mobile) {
                $('#address-container').html(`
                    <p>Delivery Address </p>
                        <div class="d-flex w-100 flex-column p-2" id="address-details" style="background-color: #dcdcdc;">
                            <span id="Name">${loginUser?.firstName} ${loginUser?.lastName}</span>
                            <span id="phonNumber">${mobile}</span>
                            <span id="addressDetails" class="w-50">${address}</span>
                        </div>
                `);
                ConfirmOrderBtnActivity(true);
            } else {
                $('#address-container').html(`
                     <div class="d-flex w-100 flex-column justify-content-center" id="address-details">
                        <p class="mx-auto">Please add your address before order</p>
                        <button  id="add-address-btn" class="btn btn-sm w-50 btn-dark mx-auto mt-2 text-white">Add Address</button>
                    </div>
                `);
            }
        } else {
            $('#address-container').html(`
                 <div class="d-flex w-100 flex-column justify-content-center" id="address-details">
                        <p class="mx-auto">Please add your address before order</p>
                        <button  id="add-address-btn" class="btn btn-sm w-50 btn-dark mx-auto mt-2 text-white">Add Address</button>
                    </div>
            `);
        }
    } catch (error) {
        console.error('Error fetching address details:', error);
    }
}
$(document).on('click', '#add-address-btn', function (e) {
    e.preventDefault(); // Prevent the default form submission
    window.location.href = "/Home/AddAddress";
});


async function getAddressList() {
    
    try {
        const response = await $.ajax({
            url: '/DeliveryAddress/GetDeliveryAddressList',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        return response.data || [];
    } catch (error) {
        console.log('Error:', error);
        return [];
    }
}
async function GetLoginUserById(id) {
    
    try {
        const response = await $.ajax({
            url: '/User/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        return response || [];
    } catch (error) {
        console.log('Error:', error);
        return [];
    }
}


async function ReturnProductList() {
    try {
        var storedProducts = JSON.parse(localStorage.getItem('productIds')) || {};
        var products = await getProduct();
        var companyList = await getAllCompanyList();
        //var productSizeList = await getAllSizeList();
        //var productUnitList = await getAllValvList();

        var $container = $('#return-product-container');
        $container.empty();

        Object.keys(storedProducts).forEach(productId => {
            var quantity = storedProducts[productId];
            var product = products.find(p => p.id == productId);
            if (product) {
                console.log(product);
                //var prodSize = productSizeList.find(p => p.id == product.prodSizeId);
                //var prodUnit = productUnitList.find(p => p.id == product.prodValveId);
                var DefoltCompany = companyList.find(c => c.id == product.companyId);

                var $row = $('<div>').addClass('row mb-3 p-2 border');

                var $imgCell = $('<div>').addClass('col-auto');
                var $img = $('<img>').attr('src', `/images/${product.prodImage}`).attr('alt', product.name).addClass('img-fluid').css({ width: '60px', height: 'auto' });                $imgCell.append($img);

                var $nameCell = $('<div>').addClass('col').text(product.name);
                //var $sizeCell = $('<div>').addClass('col').text(prodSize.size + " " + prodSize.unit);
                //var $unitCell = $('<div>').addClass('col').text(prodUnit.name + " " + prodUnit.unit);

                var $companyCell = $('<div>').addClass('col');
                var $companyDropdown = $('<select>').addClass('form-control').css('background-color', '#00000');

                companyList.forEach(company => {
                    var $option = $('<option>').val(company.id).text(company.name);
                    if (company.id === DefoltCompany.id) {
                        $option.attr('selected', 'selected');
                    }
                    $companyDropdown.append($option);
                });

                $companyCell.append($companyDropdown);

                var $quantityCell = $('<div>').addClass('col').text(quantity);

                $row.append($imgCell, $nameCell, $quantityCell, $companyCell);
                $container.append($row);
            }
        });
    } catch (error) {
        console.error('Error fetching product list:', error);
    }
}



async function getAllCompanyList() {
    
    try {
        const response = await $.ajax({
            url: '/Company/GetCompanyList',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        return response.data || [];
    } catch (error) {
        console.log('Error:', error);
        return [];
    }
}
async function getAllSizeList() {

    try {
        const response = await $.ajax({
            url: '/ProductSize/GetallProductSize',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        return response.data || [];
    } catch (error) {
        console.log('Error:', error);
        return [];
    }
}
async function getAllReturnProductList() {

    try {
        const response = await $.ajax({
            url: '/ProdReturn/GetallProdReturn',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        return response.data || [];
    } catch (error) {
        console.log('Error:', error);
        return [];
    }
}
async function getAllValvList() {

    try {
        const response = await $.ajax({
            url: '/Valve/GetallValve',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        return response.data || [];
    } catch (error) {
        console.log('Error:', error);
        return [];
    }
}

async function ConfirmOrderBtnActivity(isActive = false) {
    var $button = $('#add-order-and-return-product');

    if (isActive) {
        $button.removeClass('bg-secondary').addClass('bg-success');
        $button.prop('disabled', false);
    } else {
        $button.removeClass('bg-success').addClass('bg-secondary');
        $button.prop('disabled', true);
    }
}

window.navigateToConfirmOrder = async function () {
    debugger
    const userId = $('#address-container').data('user-id')?.toString();
    if (!userId) {
        console.error("User ID not found in address container.");
        return;
    }

    const storedProducts = JSON.parse(localStorage.getItem('productIds') || '{}');
    if (!Object.keys(storedProducts).length) {
        console.error("No products found in local storage.");
        return;
    }

    // Create FormData and populate it
    const formData = new FormData();
    formData.append('UserID', userId);

    for (const [productId, quantity] of Object.entries(storedProducts)) {
        formData.append(`ProductIdAndQuentity[${productId}]`, quantity);
    }

    try {
        const response = await $.ajax({
            url: '/Order/ConfirmOrder',
            type: 'POST',
            contentType: false,       // Important for FormData
            processData: false,       // Prevents jQuery from processing the data
            data: formData,
            dataType: 'json'
        });
        debugger
        if (response.success === true) {
            if (response.data) {
                debugger
                
                const isDownload = true;  // Set this as needed
                const url = '/Report/DownloadCustomerInvoice?id=' + response.data + '&isDownload=' + isDownload;
                //window.location.href = url;  
                window.open(url, '/Home/Product');
                notification({ message: "Order Confirm successfully !", type: "success", title: "Success" });
            } else {
                notificationErrors({ message: response.data });
            }
            debugger
            localStorage.removeItem('productIds')
            window.location.href = '/Home/Product';
        } else {
            console.error("Order confirmation failed.", response);
        }
    } catch (error) {
        console.error("Error during order confirmation:", error);
    }





    
}

async function processReturnProducts(storedProducts, products) {
    const returnProducts = [];

    for (const productId of Object.keys(storedProducts)) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.warn(`Product with ID ${productId} not found in products list.`);
            continue;
        }

        const returnProduct = {
            ProductId: product.id,
            Name: product.name,
            ProdSizeId: product.prodSizeId,
            ProdValveId: product.prodValveId,
        };

        try {
            const response = await $.ajax({
                url: '/ProdReturn/CreatebyUser',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(returnProduct),
                dataType: 'json'
            });

            if (response.success && response.status === 200) {
                returnProducts.push(returnProduct);
                console.log("Product return created:", returnProduct);
            } else {
                console.error('Failed to create return product:', returnProduct, response);
            }
        } catch (error) {
            console.error('Error updating product:', returnProduct, error);
        }
    }

    if (!returnProducts.length) {
        console.warn("No return products were created.");
    }

    return returnProducts;
}

async function createOrders(userId, returnProducts, productReturnList, storedProducts) {
    const transactionNumber = await generateTransactionNumber();
    debugger;

    const createdOrders = await Promise.all(
        returnProducts.map(async (product) => {
            const productReturn = productReturnList.find(p => p.productId === product.ProductId);

            if (!productReturn) {
                console.error(`No matching return product found for product ID ${product.ProductId}.`);
                return null; // Skips this product
            }
            debugger;

            const order = {
                UserId: userId,
                ProductId: product.ProductId,
                ReturnProductId: productReturn.id,
                TransactionNumber: transactionNumber,
                Comments: `${storedProducts[product.ProductId]}` || ""
            };

            try {
                const response = await $.ajax({
                    url: '/Order/CreatebyUser',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(order),
                    dataType: 'json'
                });

                if (response.success && response.status === 200) {
                    console.log("Order created:", order);
                    return order; // Adds to createdOrders if successful
                } else {
                    console.error('Failed to create order:', order, response);
                    return null;
                }
            } catch (error) {
                console.error('Error creating order:', order, error);
                return null;
            }
        })
    );

    const successfulOrders = createdOrders.filter(order => order !== null);
    if (!successfulOrders.length) {
        console.warn("No orders were created.");
    }
}






// Function to generate a random alphanumeric string of a given length
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Function to generate TransactionNumber with date and time
function generateTransactionNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (zero-based)
    const date = String(now.getDate()).padStart(2, '0'); // Date
    const hours = String(now.getHours()).padStart(2, '0'); // Hours
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Seconds
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Milliseconds

    const randomString = generateRandomString(5); // Random alphanumeric string

    return `${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}${randomString}`;
}

// Example usage
console.log(generateTransactionNumber());