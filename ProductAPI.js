let products = [];
let cart = [];
let currentIndex = 0;
const maxIndex = 4; // limit to 5 products (index 0 to 4)

const productContainer = document.getElementById("Product");
const cartList = document.getElementById("myCartList");
const cartText = document.getElementById("cart-text");
const cartCountIcon = document.getElementById("cart-count");

const prevBtn = document.getElementById("prevProductBtn");
const nextBtn = document.getElementById("nextProductBtn");

function renderProduct(index) {
  if (!products.length) return;
  const product = products[index];

  // Generate size buttons or disabled button if none
  let sizesHTML = "";
  if (product.sizeOptions && product.sizeOptions.length > 0) {
    sizesHTML = product.sizeOptions.map(
      size => `<button type="button" class="size-btn" data-size="${size.label}" data-price="${size.price}">${size.label}</button>`
    ).join("");
  } else {
    sizesHTML = `<button type="button" disabled class="size-btn disabled">No sizes</button>`;
  }

  // Set default price for display
  let displayPrice = product.price.toFixed(2);

  productContainer.innerHTML = `
    <div class="product-card">
      <div class="product">
        <img src="${product.imageURL}" alt="${product.title}" />
      </div>
      <div class="detail">
        <h3>${product.title}</h3>
        <p class="description">${product.description}</p>
        <div class="bottom-column">
          <p class="price"><strong>$${displayPrice}</strong></p>
          <div class="Sizes">${sizesHTML}</div>
          <div class="Btn-cart">
            <button id="addToCartBtn" ${product.sizeOptions.length > 0 ? "disabled" : ""}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `;

  let selectedSize = null;
  let selectedPrice = product.price;

  if (product.sizeOptions.length > 0) {
    const sizeButtons = productContainer.querySelectorAll(".size-btn");
    const addToCartBtn = document.getElementById("addToCartBtn");
    const priceElement = productContainer.querySelector(".price strong");

    sizeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        sizeButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedSize = btn.getAttribute("data-size");
        selectedPrice = parseFloat(btn.getAttribute("data-price"));
        priceElement.textContent = `$${selectedPrice.toFixed(2)}`;
        addToCartBtn.disabled = false;
      });
    });
  }

  const addToCartBtn = document.getElementById("addToCartBtn");
  addToCartBtn.addEventListener("click", () => {
    if (product.sizeOptions.length > 0 && !selectedSize) {
      alert("Please select a size first!");
      return;
    }

    const existingIndex = cart.findIndex(item => item.id === product.id && item.size === selectedSize);
    if (existingIndex > -1) {
      cart[existingIndex].quantity++;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: selectedPrice,
        size: selectedSize,
        imageURL: product.imageURL,
        quantity: 1
      });
    }

    alert(`Added "${product.title}"${selectedSize ? ' (Size: ' + selectedSize + ')' : ''} to cart!`);

    updateCartUI();
  });

  // Enable/disable navigation buttons
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === maxIndex;
}

function updateCartUI() {
  let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartText.textContent = `My Cart (${totalQuantity})`;
  cartCountIcon.textContent = ` (${totalQuantity})`;

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.imageURL}" alt="${item.title}" />
      <p>${item.title}${item.size ? ' - ' + item.size : ''}</p>
      <p>Price: $${item.price.toFixed(2)}</p>
      <p>Qty: ${item.quantity}</p>
    </div>
  `).join("");
}

nextBtn.addEventListener("click", () => {
  if (currentIndex < maxIndex) {
    currentIndex++;
    renderProduct(currentIndex);
  } else {
    alert("You have reached the last product.");
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderProduct(currentIndex);
  } else {
    alert("You are already at the first product.");
  }
});

async function fetchProducts() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/nelparole/Ecommerce-Product-API/main/api_ecommerce_products.json');
    products = await response.json();

    // Limit products to first 5
    products = products.slice(0, 5);

    renderProduct(currentIndex);
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

fetchProducts();

// Optional: toggle cart dropdown visibility
function mycart() {
  const dropdown = document.getElementById("myCartList");
  dropdown.classList.toggle("show");
}

window.mycart = mycart; // expose for inline onclick in HTML
