// ============================================
// STMJ NINGRAT - ALL IN ONE POS SYSTEM
// ============================================
const API_URL = 'http://localhost:5000/api';

// ============================================
// DATA MENU (FALLBACK)
// ============================================
const menuData = [
    { id: 1, name: "STMJ Telur Ayam Kampung (1 Telur)", description: "Susu Telur Madu Jahe 1 telur ayam kampung", price: 16000, category: "stmj-ayam", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f80b?w=400&h=300&fit=crop", badge: "⭐ Favorite" },
    { id: 2, name: "STMJ Telur Ayam Kampung (2 Telur)", description: "Double telur ayam kampung", price: 19000, category: "stmj-ayam", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop", badge: "🔥 Double" },
    { id: 3, name: "STMJ Telur Ayam Kampung (3 Telur)", description: "Triple telur ayam kampung", price: 22000, category: "stmj-ayam", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop", badge: "💪 Triple" },
    { id: 4, name: "STMJ Telur Bebek (1 Telur)", description: "Telur bebek premium", price: 18000, category: "stmj-bebek", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop" },
    { id: 5, name: "STMJ Telur Bebek (2 Telur)", description: "Double telur bebek creamy", price: 22000, category: "stmj-bebek", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f80b?w=400&h=300&fit=crop", badge: "🦆 Premium" },
    { id: 6, name: "STMJ Telur Bebek (3 Telur)", description: "Triple telur bebek ultimate", price: 26000, category: "stmj-bebek", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop", badge: "👑 Ultimate" },
    { id: 7, name: "Susu Sapi Murni", description: "Susu sapi segar hangat", price: 9000, category: "susu", image: "https://files.catbox.moe/vs7fp5.jpeg" },
    { id: 8, name: "Susu Madu", description: "Susu dengan madu pilihan", price: 11000, category: "susu", image: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop" },
    { id: 9, name: "Susu Jahe", description: "Susu dengan jahe merah", price: 11000, category: "susu", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop", badge: "🫚 Hangat" },
    { id: 10, name: "Susu Madu Jahe", description: "Kombinasi susu, madu, jahe", price: 13000, category: "susu", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop", badge: "🍯 Combo" },
    { id: 11, name: "Tambahan Majun", description: "Rempah majun vitalitas", price: 5000, category: "rempah", image: "https://images.unsplash.com/photo-1515377905703-c4788c4bda1e?w=400&h=300&fit=crop" },
    { id: 12, name: "Tambahan Ginseng", description: "Ginseng premium stamina", price: 10000, category: "rempah", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop", badge: "💪 Vitalitas" },
    { id: 13, name: "Wedang Uwuh", description: "Minuman rempah khas Jogja", price: 10000, category: "minuman", image: "https://files.catbox.moe/6r6p7i.jpeg", badge: "👑 Raja" },
    { id: 14, name: "Teh Jahe", description: "Teh dengan jahe merah segar", price: 8000, category: "minuman", image: "https://files.catbox.moe/8yg9d4.jpeg" },
    { id: 15, name: "Kopi Jahe", description: "Kopi hitam campur jahe", price: 8000, category: "minuman", image: "https://cdn.corenexis.com/files/c/9567173720.jpg" },
    { id: 16, name: "Wedang Sereh Jahe", description: "Sereh & jahe menyegarkan", price: 10000, category: "minuman", image: "https://files.catbox.moe/r3klxc.jpeg" },
    { id: 17, name: "Wedang Telang", description: "Bunga telang biru cantik", price: 10000, category: "minuman", image: "https://files.catbox.moe/1xb288.jpeg", badge: "💙 Cantik" }
];

// =============================================
// STATE
// ============================================
let cart = JSON.parse(localStorage.getItem('stmj_cart')) || [];
let orders = JSON.parse(localStorage.getItem('stmj_orders')) || [];
let currentCategory = 'all';
let currentOrderFilter = 'all';
let currentMode = 'menu';
let lastPendingCount = 0;
let pendingDeleteMenuId = null;

// ============================================
// INIT
// ============================================
window.onload = function() {
    console.log('STMJ Ningrat POS Ready!');
    renderMenu();
    updateCartCount();
    loadOrders();
    setInterval(() => { loadOrders(); }, 5000);
};

// ============================================
// MODE SWITCH
// ============================================
function switchMode(mode) {
    currentMode = mode;
    document.getElementById('menuMode').classList.toggle('hidden', mode !== 'menu');
    document.getElementById('ordersMode').classList.toggle('hidden', mode !== 'orders');
    document.getElementById('modeMenuBtn').classList.toggle('active', mode === 'menu');
    document.getElementById('modeOrdersBtn').classList.toggle('active', mode === 'orders');
    if (mode === 'menu') renderMenu();
    else loadOrders();
}

// ============================================
// RENDER MENU
// ============================================
async function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    let products = [];
    try {
        const response = await fetch(API_URL + '/products');
        const result = await response.json();
        products = result.data;
    } catch (error) {
        products = menuData;
    }
    
    let filtered = currentCategory === 'all' ? products : products.filter(item => item.category === currentCategory);
    
    menuGrid.innerHTML = filtered.map(item => `
        <div class="menu-card group">
            <div class="menu-image-container" onclick="addToCart(${item.id})">
                <img src="${item.image}" alt="${item.name}" class="menu-image"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Crect fill=%22%23fef3c7%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%2378350f%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ESTMJ%3C/text%3E%3C/svg%3E'">
                ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
            </div>
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1 z-10">
                <button onclick="event.stopPropagation();showEditMenuModal(${item.id})" class="bg-blue-500 text-white w-8 h-8 rounded-lg text-xs hover:bg-blue-600" title="Edit">
                    <i class="fas fa-pen"></i>
                </button>
                <button onclick="event.stopPropagation();deleteMenu(${item.id})" class="bg-red-500 text-white w-8 h-8 rounded-lg text-xs hover:bg-red-600" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="p-3" onclick="addToCart(${item.id})">
                <h3 class="font-bold text-sm mb-1">${item.name}</h3>
                <p class="text-amber-900 font-bold">Rp ${Number(item.price).toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

function filterByCategory(category) {
    currentCategory = category;
    document.querySelectorAll('#categoryFilter .category-btn').forEach((btn, i) => {
        btn.classList.remove('active');
        if (i === ['all','stmj-ayam','stmj-bebek','susu','rempah','minuman','roti'].indexOf(category)) {
            btn.classList.add('active');
        }
    });
    renderMenu();
}

function filterMenu() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const menuGrid = document.getElementById('menuGrid');
    let baseMenu = currentCategory === 'all' ? menuData : menuData.filter(i => i.category === currentCategory);
    let filtered = baseMenu.filter(i => i.name.toLowerCase().includes(searchTerm));
    
    menuGrid.innerHTML = filtered.length === 0 
        ? `<div class="col-span-full text-center py-12"><i class="fas fa-search text-5xl text-gray-300"></i><p>Tak ditemukan</p></div>`
        : filtered.map(item => `
            <div class="menu-card" onclick="addToCart(${item.id})">
                <div class="menu-image-container">
                    <img src="${item.image}" class="menu-image">
                    ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
                </div>
                <div class="p-3">
                    <h3 class="font-bold text-sm">${item.name}</h3>
                    <p class="text-amber-900 font-bold">Rp ${item.price.toLocaleString()}</p>
                </div>
            </div>
        `).join('');
}

// ============================================
// MENU CRUD
// ============================================
function showAddMenuModal() {
    document.getElementById('menuFormTitle').textContent = '➕ Tambah Menu Baru';
    document.getElementById('saveBtnText').textContent = 'Simpan';
    document.getElementById('editMenuId').value = '';
    document.getElementById('menuName').value = '';
    document.getElementById('menuDesc').value = '';
    document.getElementById('menuPrice').value = '';
    document.getElementById('menuStock').value = '99';
    document.getElementById('menuCategory').value = 'minuman';
    document.getElementById('menuImage').value = '';
    document.getElementById('menuBadge').value = '';
    document.getElementById('menuFormModal').classList.remove('hidden');
}

async function showEditMenuModal(id) {
    let product = menuData.find(i => i.id === id);
    try {
        const response = await fetch(API_URL + '/products/' + id);
        const result = await response.json();
        if (result.data) product = result.data;
    } catch(e) {}
    
    if (!product) return;
    
    document.getElementById('menuFormTitle').textContent = '✏️ Edit Menu';
    document.getElementById('saveBtnText').textContent = 'Update';
    document.getElementById('editMenuId').value = product.id;
    document.getElementById('menuName').value = product.name || '';
    document.getElementById('menuDesc').value = product.description || '';
    document.getElementById('menuPrice').value = product.price || '';
    document.getElementById('menuStock').value = product.stock || 99;
    document.getElementById('menuCategory').value = product.category || 'minuman';
    document.getElementById('menuImage').value = product.image || '';
    document.getElementById('menuBadge').value = product.badge || '';
    document.getElementById('menuFormModal').classList.remove('hidden');
}

function closeMenuForm() {
    document.getElementById('menuFormModal').classList.add('hidden');
}

async function saveMenu() {
    const id = document.getElementById('editMenuId').value;
    const data = {
        name: document.getElementById('menuName').value.trim(),
        description: document.getElementById('menuDesc').value.trim(),
        price: parseInt(document.getElementById('menuPrice').value) || 0,
        stock: parseInt(document.getElementById('menuStock').value) || 99,
        category: document.getElementById('menuCategory').value,
        image: document.getElementById('menuImage').value.trim(),
        badge: document.getElementById('menuBadge').value.trim()
    };
    
    if (!data.name || !data.price) {
        showToast('Nama & harga wajib!', 'error');
        return;
    }
    
    try {
        await fetch(API_URL + '/products' + (id ? '/' + id : ''), {
            method: id ? 'PUT' : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
    } catch(e) {
        if (id) {
            const idx = menuData.findIndex(i => i.id === parseInt(id));
            if (idx !== -1) menuData[idx] = {...menuData[idx], ...data, id: parseInt(id)};
        } else {
            menuData.push({ id: Math.max(...menuData.map(m => m.id)) + 1, ...data });
        }
    }
    
    showToast(id ? 'Menu diupdate!' : 'Menu ditambahkan!', 'success');
    closeMenuForm();
    renderMenu();
}

function deleteMenu(id) {
    pendingDeleteMenuId = id;
    document.getElementById('deleteMenuMessage').textContent = 'Menu akan dihapus permanen!';
    document.getElementById('deleteMenuModal').classList.remove('hidden');
}

async function confirmDeleteMenu() {
    const id = pendingDeleteMenuId;
    try {
        await fetch(API_URL + '/products/' + id, { method: 'DELETE' });
    } catch(e) {
        const idx = menuData.findIndex(i => i.id === id);
        if (idx !== -1) menuData.splice(idx, 1);
    }
    showToast('Menu dihapus!', 'error');
    closeDeleteMenuModal();
    renderMenu();
}

function closeDeleteMenuModal() {
    document.getElementById('deleteMenuModal').classList.add('hidden');
    pendingDeleteMenuId = null;
}

// ============================================
// CART
// ============================================
function addToCart(productId) {
    const product = menuData.find(i => i.id === productId);
    if (!product) return;
    
    const existing = cart.find(i => i.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
    showToast(product.name + ' ditambahkan!');
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartCount();
    viewCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    saveCart();
    updateCartCount();
    viewCart();
}

function saveCart() {
    localStorage.setItem('stmj_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('cart-count');
    if (count > 0) {
        el.textContent = count;
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function viewCart() {
    const content = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        content.innerHTML = `<div class="text-center py-10"><i class="fas fa-shopping-cart text-5xl text-gray-300"></i><p>Keranjang kosong</p></div>`;
    } else {
        const total = calculateTotal();
        content.innerHTML = `
            <div class="space-y-3 mb-4">
                ${cart.map(item => `
                    <div class="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                        <div>
                            <h4 class="font-bold text-sm">${item.name}</h4>
                            <p class="text-amber-900 text-sm">Rp ${item.price.toLocaleString()}</p>
                        </div>
                        <div class="flex items-center gap-2 mx-3">
                            <button onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 rounded-lg border-2 border-gray-300 bg-white font-bold">-</button>
                            <span class="font-bold w-6 text-center">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 rounded-lg border-2 border-gray-300 bg-white font-bold">+</button>
                        </div>
                        <div class="text-right">
                            <p class="font-bold">Rp ${(item.price * item.quantity).toLocaleString()}</p>
                            <button onclick="removeFromCart(${item.id})" class="text-red-500 text-xs">Hapus</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="border-t pt-4">
                <div class="flex justify-between mb-4">
                    <span class="font-bold text-lg">Total</span>
                    <span class="font-bold text-2xl text-amber-900">Rp ${total.toLocaleString()}</span>
                </div>
                <button onclick="createOrder()" class="w-full bg-green-500 text-white py-3 rounded-xl font-bold">Buat Pesanan</button>
            </div>
        `;
    }
    document.getElementById('cartModal').classList.remove('hidden');
}

function closeCart() {
    document.getElementById('cartModal').classList.add('hidden');
}

// ============================================
// ORDER & STRUK
// ============================================
function createOrder() {
    if (cart.length === 0) {
        showToast('Keranjang kosong!', 'error');
        return;
    }
    
    const orderId = 'STMJ-' + Date.now().toString().slice(-8);
    const total = calculateTotal();
    
    orders.unshift({
        id: orderId,
        items: [...cart],
        total: total,
        status: 'pending',
        timestamp: new Date().toISOString(),
        paymentMethod: 'TUNAI'
    });
    
    localStorage.setItem('stmj_orders', JSON.stringify(orders));
    showStruk(orderId, total);
    
    cart = [];
    saveCart();
    updateCartCount();
    closeCart();
    
    showToast('Pesanan berhasil!');
    loadOrders();
}

function showStruk(orderId, total) {
    document.getElementById('qrisTotal').textContent = 'Rp ' + total.toLocaleString();
    document.getElementById('qrisOrderId').textContent = orderId;
    document.getElementById('qrcode').innerHTML = `
        <div style="font-family:monospace; font-size:11px; line-height:1.5;">
            <div style="text-align:center;">
                <b>STMJ NINGRAT</b><br>
                ===============
            </div>
            <b>No:</b> ${orderId}<br>
            <b>Tgl:</b> ${new Date().toLocaleString('id-ID')}<br>
            <b>Bayar:</b> TUNAI<br>
            ===============<br>
            <b>TOTAL: Rp ${total.toLocaleString()}</b><br>
            ===============<br>
            <div style="text-align:center; font-size:10px;">Terima Kasih</div>
        </div>
    `;
    document.getElementById('qrisModal').classList.remove('hidden');
}

function downloadStruk() {
    const orderId = document.getElementById('qrisOrderId').textContent;
    const total = document.getElementById('qrisTotal').textContent;
    const text = `STMJ NINGRAT\n===============\nNo: ${orderId}\nTgl: ${new Date().toLocaleString('id-ID')}\nBayar: TUNAI\n===============\nTOTAL: ${total}\n===============\nTerima Kasih`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Struk_${orderId}.txt`;
    a.click();
}

function closeQRIS() {
    document.getElementById('qrisModal').classList.add('hidden');
}

// ============================================
// ORDERS MANAGEMENT
// ============================================
function loadOrders() {
    orders = JSON.parse(localStorage.getItem('stmj_orders')) || [];
    updateStats();
    renderOrders();
    checkNewOrders();
}

function updateStats() {
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const ready = orders.filter(o => o.status === 'ready').length;
    
    const today = new Date().toDateString();
    const revenue = orders
        .filter(o => new Date(o.timestamp).toDateString() === today && o.status === 'ready')
        .reduce((sum, o) => sum + Number(o.total || 0), 0);
    
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('processingCount').textContent = processing;
    document.getElementById('readyCount').textContent = ready;
    document.getElementById('totalRevenue').textContent = 'Rp ' + revenue.toLocaleString();
    
    const notif = document.getElementById('orderNotif');
    if (pending > 0) {
        notif.textContent = pending;
        notif.classList.remove('hidden');
    } else {
        notif.classList.add('hidden');
    }
}

function checkNewOrders() {
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    if (pendingCount > lastPendingCount && lastPendingCount > 0) {
        playSound();
        if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
        showToast('Pesanan baru!', 'warning');
    }
    lastPendingCount = pendingCount;
}

function playSound() {
    const audio = document.getElementById('notificationSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        });
    } else {
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
    }
}

function filterOrders(status) {
    currentOrderFilter = status;
    document.querySelectorAll('#ordersMode .filter-tab').forEach((btn, i) => {
        btn.classList.remove('active');
        if (i === ['all','pending','processing','ready'].indexOf(status)) {
            btn.classList.add('active');
        }
    });
    renderOrders();
}

function renderOrders() {
    const list = document.getElementById('ordersList');
    const empty = document.getElementById('emptyOrders');
    let filtered = currentOrderFilter === 'all' ? orders : orders.filter(o => o.status === currentOrderFilter);
    
    if (filtered.length === 0) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    
    empty.classList.add('hidden');
    
    const statusLabels = { pending: 'MENUNGGU', processing: 'DIPROSES', ready: 'SELESAI' };
    const statusClasses = { pending: 'status-pending', processing: 'status-processing', ready: 'status-ready' };
    
    list.innerHTML = filtered.map(order => {
        const orderId = order.order_number || order.id;
        const orderTotal = Number(order.total || 0);
        const orderTime = order.created_at || order.timestamp;
        
        const itemsHtml = (order.items || []).map(item => `
            <div class="flex justify-between text-sm py-1">
                <span>${item.quantity}x ${item.product_name || item.name}</span>
                <span>Rp ${(Number(item.price) * item.quantity).toLocaleString()}</span>
            </div>
        `).join('');
        
        let actionBtn = '';
        if (order.status === 'pending') {
            actionBtn = `<button onclick="updateOrderStatus('${orderId}','processing')" class="bg-blue-500 text-white px-3 py-1 rounded-lg font-bold text-sm">Proses</button>`;
        } else if (order.status === 'processing') {
            actionBtn = `<button onclick="updateOrderStatus('${orderId}','ready')" class="bg-green-500 text-white px-3 py-1 rounded-lg font-bold text-sm">Siap</button>`;
        }
        
        return `
            <div class="bg-white rounded-xl shadow-md p-4 border-l-4 ${order.status === 'pending' ? 'border-yellow-500' : order.status === 'processing' ? 'border-blue-500' : 'border-green-500'}">
                <div class="flex justify-between flex-wrap gap-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="font-mono font-bold">#${orderId}</span>
                            <span class="status-badge ${statusClasses[order.status]} text-xs">${statusLabels[order.status]}</span>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-3 mb-2">${itemsHtml}</div>
                        <div class="flex justify-between">
                            <span class="text-xs text-gray-500">${new Date(orderTime).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</span>
                            <span class="font-bold text-lg text-amber-900">Rp ${orderTotal.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        ${actionBtn}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    showDailyTotal();
}

function showDailyTotal() {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.timestamp).toDateString() === today && o.status === 'ready');
    const totalRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    
    const itemSales = {};
    todayOrders.forEach(order => {
        (order.items || []).forEach(item => {
            const name = item.product_name || item.name || 'Produk';
            itemSales[name] = (itemSales[name] || 0) + item.quantity;
        });
    });
    
    const salesHtml = Object.entries(itemSales)
        .sort((a, b) => b[1] - a[1])
        .map(([name, qty]) => `<div class="flex justify-between text-sm"><span>${qty}x ${name}</span></div>`)
        .join('');
    
    const old = document.getElementById('dailyTotal');
    if (old) old.remove();
    
    const dailyTotalDiv = document.createElement('div');
    dailyTotalDiv.id = 'dailyTotal';
    dailyTotalDiv.innerHTML = `
        <div class="bg-gradient-to-r from-amber-800 to-amber-900 text-white rounded-xl shadow-lg p-6 mt-6">
            <h3 class="text-xl font-bold mb-3">Total Hari Ini</h3>
            <p class="text-sm opacity-80 mb-4">${new Date().toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</p>
            <div class="bg-white bg-opacity-20 rounded-xl p-4 mb-4">
                <p class="text-sm mb-2 font-semibold">Menu Terjual:</p>
                ${salesHtml || '<p class="text-sm opacity-70">Belum ada penjualan</p>'}
            </div>
            <div class="flex justify-between pt-3 border-t border-white border-opacity-30">
                <span class="text-lg font-bold">Total Pendapatan</span>
                <span class="text-3xl font-bold">Rp ${totalRevenue.toLocaleString()}</span>
            </div>
        </div>
    `;
    
    document.getElementById('ordersList').after(dailyTotalDiv);
}

function updateOrderStatus(orderId, newStatus) {
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
        orders[idx].status = newStatus;
        localStorage.setItem('stmj_orders', JSON.stringify(orders));
        loadOrders();
        showToast('Status diperbarui!', 'success');
        if (newStatus === 'ready') playSound();
    }
}

function refreshOrders() {
    loadOrders();
    showToast('Data diperbarui!', 'info');
}

// ============================================
// DELETE ALL
// ============================================
function deleteAllOrders() {
    if (orders.length === 0) {
        showToast('Tak ada pesanan!', 'error');
        return;
    }
    document.getElementById('deleteMessage').textContent = `⚠️ ${orders.length} pesanan akan dihapus permanen!`;
    document.getElementById('deleteModal').classList.remove('hidden');
}

function confirmDeleteAll() {
    orders = [];
    localStorage.setItem('stmj_orders', JSON.stringify(orders));
    closeDeleteModal();
    loadOrders();
    showToast('Semua dihapus!', 'error');
    if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
    playSound();
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
}

// ============================================
// TOAST
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    document.getElementById('toastMessage').textContent = message;
    
    const icons = {
        success: 'fa-check-circle text-green-400',
        error: 'fa-exclamation-circle text-red-400',
        warning: 'fa-bell text-yellow-400'
    };
    
    document.getElementById('toastIcon').className = 'fas ' + (icons[type] || icons.success);
    
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// ============================================
// MODAL CLOSE ON OUTSIDE CLICK
// ============================================
document.addEventListener('click', (e) => {
    if (e.target.id === 'cartModal') closeCart();
    if (e.target.id === 'qrisModal') closeQRIS();
    if (e.target.id === 'deleteModal') closeDeleteModal();
    if (e.target.id === 'deleteMenuModal') closeDeleteMenuModal();
    if (e.target.id === 'menuFormModal') closeMenuForm();
});

console.log('✅ STMJ Ningrat POS ready!')