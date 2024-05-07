function mycart() {
    const cartList = document.getElementById("myCartList");
    const cartEmptyMessage = '<p class="pt-3 px-5">Hello, Your cart is empty. 😟</p>';

    // Toggle the visibility of the cart list
    cartList.classList.toggle("show");

    // Check if the cart is empty
    if (cart.length === 0) {
        // Display a message if the cart is empty
        cartList.innerHTML = cartEmptyMessage;
    } else {
        // Display the cart items if the cart is not empty
        updateCartHTML();
    }
}

// Close window
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdown = document.getElementsByClassName("dropdown-content")
        var i;
        for (i = 0; i < dropdown.length; i++) {
            var openDropdown = dropdown[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Function to update the cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-text');
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = `My Cart (${totalCount})`;

    // Update cart count for mobile view
    const cartCountMobile = document.getElementById('cart-count');
    cartCountMobile.textContent = `(${totalCount})`;
}

// Initialize an empty cart array to store products
let cart = [];

// Initialize an object to track the count of each size in the cart
const sizeCount = {};

// Function to handle the "Add to Cart" button click
function handleAddToCart(product) {
    const selectedSize = document.querySelector('.size-btn.selected');

    if (selectedSize) {
        // Create a copy of the product with the selected size
        const productToAdd = {
            ...product,
            selectedSize: selectedSize.textContent
        };

        addToCart(productToAdd); // Add the product to the cart

        // Reset selected size button after adding to cart
        selectedSize.classList.remove('selected');

        // Update the cart count
        updateCartCount();

        // Prompt the user that the item has been added to the cart
        alert('Item successfully added to the cart!');
    } else {
        alert('Please select a size.'); // Alert the user if no size is selected
    }
}

// Function to handle adding a product to the cart
function addToCart(product) {
    // Check if the product with the same size already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id && item.selectedSize === product.selectedSize);

    if (existingProductIndex !== -1) {
        // If the product already exists, increment its quantity
        cart[existingProductIndex].quantity++;
    } else {
        // If the product doesn't exist, add it to the cart
        product.quantity = 1; // Add a quantity property to the product
        cart.push(product);
    }

    // Increment the count for the selected size
    if (sizeCount[product.selectedSize]) {
        sizeCount[product.selectedSize]++;
    } else {
        sizeCount[product.selectedSize] = 1;
    }

    console.log('Product added to cart:', product);
    updateCartHTML(); // Update the HTML content of the cart
}

// Function to update the HTML content of the "My Cart" section
function updateCartHTML() {
    const cartList = document.getElementById('myCartList');
    cartList.innerHTML = ''; // Clear the existing content

    // If the cart is empty, display a message
    if (cart.length === 0) {
        cartList.innerHTML = '';
        return; // Exit the function early
    }

    // Loop through each item in the cart and generate HTML for it
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        // Generate HTML for the item
        cartItem.innerHTML = `
            <div class="col-md-12 row p-3 mini-cart-detail">
                <!-- Image Column -->
                <div class="col"> <!-- Set to 6 columns for medium and small screens -->
                    <img src="${item.imageURL}" alt="Product Image">
                </div>
                
                <!-- Details Column -->
                <div class="col text-start"> <!-- Set to 6 columns for medium and small screens -->
                    <p style="font-size: small; font-weight: 400;">${item.title}</p>
                    <p style="font-size: small; font-weight: 500;">${sizeCount[item.selectedSize]}x <span style="font-size: small; font-weight: 700;">$${(item.price * sizeCount[item.selectedSize]).toFixed(2)}</span></p>
                    <p style="font-size: small; font-weight: 400;">Size: ${item.selectedSize}</p>
                    <i class="fa fa-trash" onclick="deleteItem(${index})"></i>
                </div>
            </div>`;
        
        cartList.appendChild(cartItem); // Append the item HTML to the cart container
    });
}

// Fetch product data from the API and display it
fetch('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product')
    .then(res => res.json())
    .then(product => {
        // Generate HTML for the single product
        const html = `
            <div class="container justify-content-center">
                <div class="col-md-12 row">
                    <!-- First Column -->
                    <div class="product col-md-6 col-sm-6 mt-5">
                        <img src="${product.imageURL}">
                    </div>

                    <!-- Third Column-->
                    <div class="detail col-md-6 col-sm-6 mt-5">
                        <div class="title">
                            <h5>${product.title}</h5>
                        </div>

                        <div class="price mt-4">
                            <strong>$${product.price.toFixed(2)}</strong>
                        </div>

                        <div class="description mt-4">
                            <small>${product.description}</small>
                        </div>

                        <div class="Sizes mt-4">
                            <p>SIZE<small>*</small></p>
                            <div class="size-buttons">
                                ${product.sizeOptions.map(option => `
                                    <button class="size-btn">${option.label}</button>
                                `).join('')}
                            </div>
                            <div class="Btn-cart mt-3 mb-5">
                                <button id="addToCartBtn">ADD TO CART</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        // Set the generated HTML to the Product element
        document.getElementById('Product').innerHTML = html;

        // Add event listener to the size buttons
        const sizeButtons = document.querySelectorAll('.size-btn');
        sizeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove the 'selected' class from all buttons
                sizeButtons.forEach(btn => btn.classList.remove('selected'));
                // Add the 'selected' class to the clicked button
                button.classList.add('selected');
            });
        });

        // Add event listener to the "Add to Cart" button
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            handleAddToCart(product); // Call handleAddToCart function when button is clicked
        });
    })
    .catch(err => {
        console.error(err);
    });
