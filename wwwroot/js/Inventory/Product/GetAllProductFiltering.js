$(document).ready(async function () {
    await GetCompanyList();
    await GetProductSizeList();
    await GetProductList1();

    let selectedCompanyId = null;
    let selectedSizes = [];

    // Add event listener for company filter
    $('#category-list').on('click', 'a', function (e) {
        e.preventDefault();
        

        // Get the selected company ID from the clicked link
        selectedCompanyId = $(this).data('company-id');

        // Change the color of the selected company name to success color
        $('#all-products-btn').removeClass('text-success');
        $('#category-list a').removeClass('text-success'); // Remove success color from all links
        $(this).addClass('text-success'); // Add success color to the clicked link

        // Fetch the product list based on the selected company and sizes
        GetProductList(selectedCompanyId, selectedSizes);
    });

    // Event listener for size filter
    $('#size-filter').on('change', 'input[name="size-filter"]', function () {
        ;
        selectedSizes = $('input[name="size-filter"]:checked').map(function () {
            return $(this).attr('id').split('=')[1];
        }).get();
        console.log('Selected sizes:', selectedSizes);  // Debugging statement
        GetProductList(selectedCompanyId, selectedSizes);
    });

    // Reset selected company
    // Reset selected company and make "All Products" active
    $('#all-products-btn').on('click', function () {
        
        selectedCompanyId = null; // Reset selected company

        // Remove success color from all company links
        $('#category-list a').removeClass('text-success');

        // Add success color to "All Products" button
        $(this).addClass('text-success');

        // Fetch all products
        GetProductList(selectedCompanyId, selectedSizes);
    });

    
});
// Add custom style to style the selected link

async function GetCompanyList() {
    
    try {
        const company = await $.ajax({
            url: '/Company/GetCompanyList',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        if (company && company.data && company.data.length > 0) {

            var categoryList = $('#category-list');
            categoryList.empty();

            $.each(company.data, function (index, category) {
                var listItem = $('<li></li>');
                var link = $('<a></a>')
                    .attr('href', '#')
                    .attr('data-company-id', category.id)
                    .text(category.name);

                listItem.append(link);
                categoryList.append(listItem);
            });
        }
    } catch (error) {
        console.log('Error fetching categories:', error);
    }
}

async function GetProductSizeList() {
    try {
        const prodSize = await $.ajax({
            url: '/ProductSize/GetallProductSize',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        if (prodSize && prodSize.data && prodSize.data.length > 0) {
            var sizeFilter = $('#size-filter');
            sizeFilter.empty();

            $.each(prodSize.data, function (index, size) {
                var filterDiv = $('<div></div>').addClass('input-save d-flex align-items-center');
                var checkbox = $('<input>')
                    .attr('type', 'checkbox')
                    .addClass('form-check-input')
                    .attr('name', 'size-filter')
                    .attr('id', 'size=' + size.id);
                var label = $('<label></label>')
                    .attr('for', 'size-' + size.id)
                    .text(size.size + " " + size.unit );

                filterDiv.append(checkbox).append(label);
                sizeFilter.append(filterDiv);
            });
        }
    } catch (error) {
        console.log('Error fetching sizes:', error);
    }
}



async function GetProductList(companyId = null, sizeIds = []) {
    debugger
    try {
        const products = await $.ajax({
            url: '/Product/GetAllProduct',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
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

        var productSection = $('#product-section');
        productSection.empty();

        let filteredProducts = products.data;

        if (companyId) {
            filteredProducts = filteredProducts.filter(product => product.companyId === companyId);
        }

        if (sizeIds.length > 0) {
            filteredProducts = filteredProducts.filter(product => sizeIds.includes(product.prodSizeId.toString()));
        }

        if (filteredProducts.length === 0) {
            var noProductsMessage = $('<div></div>')
                .addClass('font-weight-bold text-lg text-muted')
                .text('No products available. Please check again later.');
            productSection.append(noProductsMessage);
            return;  // Exit function if no products are found
        }

        $.each(filteredProducts, async function (index, product) {
            if (product) {
                var discount = productDiscunMap[product.id];
                debugger

                // Create a new product card for each product
                var colDiv = $('<div></div>').addClass('col-xl-3 col-lg-3 col-md-3');
                var cardDiv = $('<div></div>').addClass('catagory-product-card-2 shadow-style text-center');
                var imgDiv = $('<div></div>').addClass('catagory-product-image');

                // Create an image element and set its attributes
                //var img = $('<img>').attr('src', '/images/' + product.prodImage).attr('alt', 'product-img');
                var img = '<img src="/images/' + product.prodImage + '" alt="Image" style="width: 100%;" />';

                var contentDiv = $('<div></div>').addClass('catagory-product-content');
                var buttonDiv = $('<div></div>').addClass('catagory-button');
                if (product.isStock === 0) {
                    debugger
                    var button = $('<a></a>')
                        .addClass('theme-btn-2 text-danger disabled-link')
                        .css({
                            'pointer-events': 'none',
                            'opacity': '0.5'
                        })
                        .html('<i class="far fa-shopping-basket"></i> Out Of Stock');
                } else {
                    var button = $('<a></a>')
                        //.attr('href', 'shop-cart.html')
                        .addClass('theme-btn-2')
                        .attr('order-product-id', product.id)
                        .html('<i class="far fa-shopping-basket"></i> Add To Cart');
                }
                
                var priceDiv = $('<div></div>').addClass('info-price d-flex align-items-center justify-content-center');

                // Check for discount, original price, and discounted price
                buttonDiv.append(button);

                function normalizeDate(date) {
                    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    return normalizedDate;
                }

                const today = normalizeDate(new Date());

                if (discount) {
                    const discountValidTill = normalizeDate(new Date(discount.validTill));


                    if (discountValidTill >= today) {
                        var discountedPrice = product.prodPrice - discount.discountedPrice;
                        var originalPriceText = product.prodPrice ? 'TK' + product.prodPrice : '00';
                        var discountedPriceText = discountedPrice ? 'TK' + discountedPrice : '00';

                        var originalPrice = $('<del></del>').text(originalPriceText);
                        var discountedPrice = $('<span></span>').text(discountedPriceText);
                        priceDiv.append(originalPrice).append(discountedPrice);
                    } else {

                        var originalPriceText = product.prodPrice ? 'TK' + product.prodPrice : '00';
                        var originalPrice = $('<h5></h5>').text(originalPriceText);
                        priceDiv.append(originalPrice);
                    }
                } else {
                    var originalPriceText = product.prodPrice ? 'TK' + product.prodPrice : '00';
                    var originalPrice = $('<h5></h5>').text(originalPriceText);
                    priceDiv.append(originalPrice);
                }



                var title = $('<h4></h4>').append($('<a></a>').attr('href', '#').text(product.name));
                var starDiv = $('<div></div>').addClass('star');

                // Add star ratings
                for (var i = 0; i < 5; i++) {
                    var star = $('<span></span>').addClass('fas fa-star');
                    if (i >= product.rating) {
                        star.addClass('color-bg');
                    }
                    starDiv.append(star);
                }


                contentDiv.append(buttonDiv).append(priceDiv).append(title).append(starDiv);
                cardDiv.append(imgDiv.append(img)).append(contentDiv);
                colDiv.append(cardDiv);
                productSection.append(colDiv);
            }
        });

    } catch (error) {
        console.log('Error fetching products:', error);
    }
}



async function GetProductList1() {
    
    try {
        const products = await $.ajax({
            url: '/Product/GetAllProduct',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
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
        if (products && products.data) {
            var productSection = $('#product-section');
            productSection.empty(); // Clear any existing product cards

            $.each(products.data, function (index, product) {



                
                var discount = productDiscunMap[product.id];


                // Create a new product card for each product
                var colDiv = $('<div></div>').addClass('col-xl-3 col-lg-3 col-md-3');
                var cardDiv = $('<div></div>').addClass('catagory-product-card-2 shadow-style text-center');
                var imgDiv = $('<div></div>').addClass('catagory-product-image');

                // Create an image element and set its attributes
                //var img = $('<img>').attr('src', '/images/' + product.prodImage).attr('alt', 'product-img');
                var img = '<img src="/images/' + product.prodImage + '" alt="Image" style="width: 100%;" />';

                var contentDiv = $('<div></div>').addClass('catagory-product-content');
                var buttonDiv = $('<div></div>').addClass('catagory-button');
                if (product.isStock === 0) {
                    debugger
                    var button = $('<a></a>')
                        .addClass('theme-btn-2 text-danger disabled-link')
                        .css({
                            'pointer-events': 'none',
                            'opacity': '0.5'
                        })
                        .html('<i class="far fa-shopping-basket"></i> Out Of Stock');
                } else {
                    var button = $('<a></a>')
                        //.attr('href', 'shop-cart.html')
                        .addClass('theme-btn-2')
                        .attr('order-product-id', product.id)
                        .html('<i class="far fa-shopping-basket"></i> Add To Cart');
                }
                var priceDiv = $('<div></div>').addClass('info-price d-flex align-items-center justify-content-center');

                // Check for discount, original price, and discounted price
                buttonDiv.append(button);

                function normalizeDate(date) {
                    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    return normalizedDate;
                }

                const today = normalizeDate(new Date());

                if (discount) {
                    const discountValidTill = normalizeDate(new Date(discount.validTill));


                    if (discountValidTill >= today) {
                        var discountedPrice = product.prodPrice - discount.discountedPrice;
                        var originalPriceText = product.prodPrice ? 'TK' + product.prodPrice : '00';
                        var discountedPriceText = discountedPrice ? 'TK' + discountedPrice : '00';

                        var originalPrice = $('<del></del>').text(originalPriceText);
                        var discountedPrice = $('<span></span>').text(discountedPriceText);
                        priceDiv.append(originalPrice).append(discountedPrice);
                    } else {

                        var originalPriceText = product.prodPrice ? 'TK' + product.prodPrice : '00';
                        var originalPrice = $('<h5></h5>').text(originalPriceText);
                        priceDiv.append(originalPrice);
                    }
                } else {
                    var originalPriceText = product.prodPrice ? 'TK' + product.prodPrice : '00';
                    var originalPrice = $('<h5></h5>').text(originalPriceText);
                    priceDiv.append(originalPrice);
                }



                var title = $('<h4></h4>').append($('<a></a>').attr('href', '#').text(product.name));
                var starDiv = $('<div></div>').addClass('star');

                // Add star ratings
                for (var i = 0; i < 5; i++) {
                    var star = $('<span></span>').addClass('fas fa-star');
                    if (i >= product.rating) {
                        star.addClass('color-bg');
                    }
                    starDiv.append(star);
                }


                contentDiv.append(buttonDiv).append(priceDiv).append(title).append(starDiv);
                cardDiv.append(imgDiv.append(img)).append(contentDiv);
                colDiv.append(cardDiv);
                productSection.append(colDiv);
            });
        } else {
            var noProductsMessage = $('<div></div>').addClass('no-products-message').text('No products available. Please check again later.');
            productSection.append(noProductsMessage);
        }
    } catch (error) {
        console.log('Error fetching products:', error);

    }
}

$(document).on('click', '.theme-btn-2', async function (e) {
    e.preventDefault();

    // Get the product ID from the button's data attribute
    var productId = $(this).attr('order-product-id');

    // Retrieve the existing product IDs from local storage
    var storedProducts = JSON.parse(localStorage.getItem('productIds')) || {};

    // Add the new product ID to the list
    // Check if the product ID already exists in the stored products
    if (storedProducts[productId]) {
        // If it exists, increment the count
        storedProducts[productId]++;
    } else {
        // If it doesn't exist, add the product ID with a count of 1
        storedProducts[productId] = 1;
    }

    // Store the updated list back to local storage
    localStorage.setItem('productIds', JSON.stringify(storedProducts));

    // Call the addToCard function
    await addToCard();

    // Show a success alert with SweetAlert
    Swal.fire({
        title: 'Success!',
        text: 'Product added to cart.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
});





