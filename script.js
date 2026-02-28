// --- DATABASE OF ENHANCED IMAGES ---
const fes_inventory = {
    'ladies-wears': [
        {id: 101, name: "Royal Gold Sequin Gown", img: "image_28.png"},
        {id: 102, name: "Sunset Ombre Pleated Gown", img: "image_29.png"},
        {id: 401, name: "Olive Maxi Gown Set", img: "image_38.png"},
        {id: 403, name: "Mauve Suit Dress", img: "image_40.png"},
        {id: 501, name: "Emerald Lace Ruffle Gown", img: "image_47.png"}
    ],
    'children': [
        {id: 301, name: "Infant Green Lace Gown", img: "image_21.png"},
        {id: 507, name: "Emerald Kids Ballgown", img: "image_53.png"},
        {id: 508, name: "White Silk Kids Dress", img: "image_54.png"}
    ],
    'bedding': [
        {id: 201, name: "Blue Camo Duvet Set", img: "image_23.png"},
        {id: 204, name: "LV Inspired Blue Set", img: "image_26.png"},
        {id: 202, name: "Royal Navy Floral Set", img: "image_24.png"}
    ]
};

let cart = JSON.parse(localStorage.getItem('fes_cart')) || [];

// --- DISPLAY PRODUCTS FOR CUSTOMERS ---
function displayProducts(category, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = "";

    const items = fes_inventory[category] || [];
    items.forEach(p => {
        const price = localStorage.getItem(`fes_price_${p.id}`);
        if (price && price > 0) { // Only show items Mom has priced
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div class="img-box"><img src="${p.img}"></div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p class="price">₦${parseInt(price).toLocaleString()}</p>
                    <button onclick="addToCart(${p.id}, '${p.name}', ${price})">Add to Cart</button>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

// --- CART LOGIC ---
function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) { existing.qty++; } 
    else { cart.push({id, name, price, qty: 1}); }
    localStorage.setItem('fes_cart', JSON.stringify(cart));
    alert(name + " added to cart!");
}

// --- ADMIN PRICE MANAGER ---
function loadAdminPanel() {
    const tableBody = document.getElementById("adminPriceList");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    Object.keys(fes_inventory).forEach(cat => {
        fes_inventory[cat].forEach(p => {
            const savedPrice = localStorage.getItem(`fes_price_${p.id}`) || 0;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${p.img}" style="width:50px"></td>
                <td>${p.name}</td>
                <td>₦ <input type="number" id="input-${p.id}" value="${savedPrice}" class="admin-input"></td>
            `;
            tableBody.appendChild(row);
        });
    });
}

function saveAllPrices() {
    Object.keys(fes_inventory).forEach(cat => {
        fes_inventory[cat].forEach(p => {
            const val = document.getElementById(`input-${p.id}`).value;
            localStorage.setItem(`fes_price_${p.id}`, val);
        });
    });
    alert("Shop Prices Updated Successfully!");
      }
  
