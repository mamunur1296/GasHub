$(document).ready(async function () {
    await addToCard();
});

async function addToCard() {
    debugger
    // Function to format price
    function formatPrice(price) {
        return 'TK : ' + price.toFixed(2);
    }

    // Retrieve stored product IDs and counts
    var storedProductIds = JSON.parse(localStorage.getItem('productIds')) || {};

    // Clear the cart items container
    var cartItemsContainer = $('#cart-items');
    cartItemsContainer.empty();

    // Check if there are stored product IDs
    if (Object.keys(storedProductIds).length === 0) {
        $('#shopping-total').text('Shopping: 0.00');
        $('#total-price').text('Total: 0.00');
        return;
    }

    // Fetch the product data
    var products = await GetProducts();

    // Check if products is an array
    if (!Array.isArray(products)) {
        console.log('Products is not an array');
        return;
    }

    // Populate the cart with the products
    var totalPrice = 0;
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
    var productMap = {};
    products.forEach(function (product) {
        productMap[product.id] = product;
    });

    Object.keys(storedProductIds).forEach(function (id) {
        debugger
        var product = productMap[id];
        var discount = productDiscunMap[id];
        function normalizeDate(date) {
            const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return normalizedDate;
        }

        const today = normalizeDate(new Date());
        if (product) {
            var count = storedProductIds[id];
            var cartItem = $('<li></li>').addClass('list-group-item d-flex justify-content-between align-items-center');
            var productImage = '<img src="/images/' + product.prodImage + '" alt="Image" class="img-fluid" style="width: 60px;" />';
            var cartProduct = $('<div></div>').addClass('cart-product ms-3');
            var productLink = $('<p></p>').text(product.name + ' x ' + count);
            if (discount) {
                const discountValidTill = normalizeDate(new Date(discount.validTill));

                if (discountValidTill >= today) {
                    var productPrice = $('<span></span>').text(formatPrice((product.prodPrice - discount.discountedPrice) * count)).addClass('ms-3');
                    totalPrice += (product.prodPrice - discount.discountedPrice) * count;
                } else {
                    var productPrice = $('<span></span>').text(formatPrice(product.prodPrice * count)).addClass('ms-3');
                    totalPrice += product.prodPrice * count;
                }
                
            } else {
                var productPrice = $('<span></span>').text(formatPrice(product.prodPrice * count)).addClass('ms-3');
                totalPrice += product.prodPrice * count;
            }
            

            // Increase, Decrease, and Cancel buttons
            var cancelButton = $('<button></button>').addClass('btn text-danger fw-bold ms-2').html('&#10006;').css('font-weight', 'bold');

            cancelButton.on('click', async function () {
                // Handle remove product logic here
                console.log('Remove product id:', id);
                delete storedProductIds[id];
                localStorage.setItem('productIds', JSON.stringify(storedProductIds));
                await addToCard(); // Refresh the cart
            });

            cartProduct.append(productLink).append(productPrice);
            cartItem.append(productImage).append(cartProduct).append(cancelButton);
            cartItemsContainer.append(cartItem);

           
        }
    });

    // Update the total prices
    $('#shopping-total').text('Shopping: ' + formatPrice(totalPrice));
    $('#total-price').text('Total: ' + formatPrice(totalPrice));
}

async function GetProducts() {
   
    try {
        const product = await $.ajax({
            url: '/Product/GetAllProduct',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (product) {  // Check if product is not null or undefined
            return product.data;
        } else {
            console.log("No products returned from server");
            return [];
        }
    } catch (error) {
        console.log('Error:', error);
        return [];
    }
}
$(document).on('click', '#clear_all_card_Item', async function (e) {
    e.preventDefault();

    // Show confirmation dialog
    if (window.confirm("Are you sure you want to clear all items from the cart?")) {
        // Clear localStorage
        localStorage.removeItem('productIds');
        // Refresh the cart
        await addToCard();
    }
});

$('#LogOutBtn').click(function () {
    console.log("log Out");
    localStorage.removeItem('productIds');
});
