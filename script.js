// --- 1. FES PRODUCT DATABASE ---
// These are the professionally edited images (image_23 to image_54)
const fes_inventory = {
    'ladies-wears': [
        {id: 101, name: "Royal Gold Sequin Gown", img: "image_28.png"},
        {id: 102, name: "Sunset Ombre Pleated Gown", img: "image_29.png"},
        {id: 103, name: "Floral Garden Silk Dress", img: "image_30.png"},
        {id: 104, name: "Purple Velvet Gold Gown", img: "image_31.png"},
        {id: 105, name: "Lavender Floral Bloom Gown", img: "image_32.png"},
        {id: 401, name: "Olive Maxi Gown Set", img: "image_38.png"},
        {id: 403, name: "Mauve Suit Dress", img: "image_40.png"},
        {id: 501, name: "Emerald Lace Ruffle Gown", img: "image_47.png"},
        {id: 502, name: "Mauve Belted Jumpsuit", img: "image_48.png"},
        {id: 506, name: "Mustard Gold Pleated Dress", img: "image_52.png"}
    ],
    'children': [
        {id: 301, name: "Infant Green Lace Gown", img: "image_21.png"},
        {id: 507, name: "Emerald Kids Ballgown", img: "image_53.png"},
        {id: 508, name: "White Silk Kids Dress", img: "image_54.png"},
        {id: 303, name: "Pink Fashionista Dress", img: "image_19.png"}
    ],
    'bedding': [
        {id: 201, name: "Blue Camo Duvet Set", img: "image_23.png"},
        {id: 204, name: "LV Inspired Blue Set", img: "image_26.png"},
        {id: 202, name: "Royal Navy Floral Set", img: "image_24.png"},
        {id: 203, name: "Chocolate Vine Bed Sheet", img: "image_25.png"},
        {id: 205, name: "Blue Wave Abstract Set", img: "image_27.png"}
    ]
};

// --- 2. CORE SHOPPING LOGIC ---
let cart = JSON.parse(localStorage.getItem('fes_cart')) || [];

// Display products on the category pages
function displayProducts(category, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = "";

    const items = fes_inventory[category] || [];
    items.forEach(p => {
        const price = localStorage.getItem(`fes_price_${p.id}`);
        // Only show items that Mom has set a price for (greater than 0)
        if (price && price > 0) {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div class="img-box"><img src="${p.img}" alt="FES Product"></div>
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

// Add items to the shopping bag
function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) { 
        existing.qty++; 
    } else { 
        cart.push({id, name, price, qty: 1}); 
    }
    localStorage.setItem('fes_cart', JSON.stringify(cart));
    alert(name + " added to your bag!");
}

// --- 3. ADMIN PRICE MANAGER LOGIC ---
// This allows Mom to update prices from admin-prices.html
function loadAdminPanel() {
    const tableBody = document.getElementById("adminPriceList");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    Object.keys(fes_inventory).forEach(cat => {
        fes_inventory[cat].forEach(p => {
            const savedPrice = localStorage.getItem(`fes_price_${p.id}`) || 0;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${p.img}" style="width:50px; border-radius:5px;"></td>
                <td><strong>${p.name}</strong><br><small>${cat}</small></td>
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
    alert("FES Inventory Prices Updated Successfully!");
    window.location.href = "index.html"; // Go back to store to see changes
}

// --- 4. CHECKOUT & BANK LOGIC ---
function setupCheckout() {
    const list = document.getElementById("orderItems");
    const display = document.getElementById("finalTotalDisplay");
    let total = 0;
    
    if (cart.length === 0) {
        if(list) list.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    if(list) {
        list.innerHTML = cart.map(item => {
            total += item.price * item.qty;
            return `<p style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span>${item.name} (x${item.qty})</span> 
                <span>₦${(item.price * item.qty).toLocaleString()}</span>
            </p>`;
        }).join('');
    }
    
    if(display) display.innerText = "Total to Pay: ₦" + total.toLocaleString();
}

function processOrder() {
    const name = document.getElementById("custName").value;
    const phone = document.getElementById("custPhone").value;
    
    if(!name || !phone) { 
        alert("Please provide your Name and Phone Number!"); 
        return; 
    }

    const orderID = "FES-" + Math.floor(Math.random() * 90000 + 10000);
    
    // Clear display and show success screen
    const container = document.querySelector('.checkout-container');
    if(container) {
        container.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <h1 style="color: #2e7d32; font-size: 3rem;">✔</h1>
                <h2 style="color: var(--navy);">Order Request Logged!</h2>
                <p style="margin: 15px 0;">Order ID: <strong>${orderID}</strong></p>
                <p>Thank you, <strong>${name}</strong>. Please send your transfer receipt to <strong>08066493911</strong> on WhatsApp for confirmation.</p>
                <button onclick="window.location.href='index.html'" style="margin-top:20px; width:200px;">Back to Home</button>
            </div>
        `;
    }
    
    // Clear the cart after order is placed
    cart = [];
    localStorage.removeItem('fes_cart');
  }
        
