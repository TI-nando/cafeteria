// ===== CAFETERIA WEBSITE - SCRIPT PRINCIPAL =====

// ===== ELEMENTOS DO DOM =====
const elements = {
  // Navegação
  search: document.querySelector('.search-box'),
  navbar: document.querySelector('.navbar'),
  header: document.querySelector('header'),
  searchIcon: document.querySelector('#search-icon'),
  menuIcon: document.querySelector('#menu-icon'),
  
  // Carrinho
  cartIcon: document.querySelector('#cart-icon'),
  cartModal: document.querySelector('#cart-modal'),
  closeCart: document.querySelector('#close-cart'),
  cartItems: document.querySelector('#cart-items'),
  cartCount: document.querySelector('#cart-count'),
  cartTotal: document.querySelector('#cart-total'),
  clearCartBtn: document.querySelector('#clear-cart'),
  checkoutBtn: document.querySelector('#checkout'),
  addToCartBtns: document.querySelectorAll('.add-to-cart-btn'),
  
  // Notificação
  notification: document.querySelector('#notification'),
  notificationText: document.querySelector('#notification-text')
};

// ===== DADOS DOS PRODUTOS =====
const products = {
  1: { name: 'Espresso Clássico', price: 25.90, image: 'src/img/p1.png' },
  2: { name: 'Cappuccino Cremoso', price: 32.50, image: 'src/img/p2.png' },
  3: { name: 'Latte Especial', price: 28.90, image: 'src/img/p3.png' },
  4: { name: 'Mocha Delicioso', price: 35.00, image: 'src/img/p4.png' },
  5: { name: 'Americano Premium', price: 22.90, image: 'src/img/p5.png' },
  6: { name: 'Macchiato Artesanal', price: 38.50, image: 'src/img/p6.png' }
};

// ===== CARRINHO DE COMPRAS =====
let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

// DOM Elements
let navbar = document.querySelector('.navbar');
let searchForm = document.querySelector('.search-form');
let cartSidebar = document.querySelector('.cart-sidebar');
let cartOverlay = document.querySelector('.cart-overlay');
let notification = document.querySelector('.notification');

// Responsive Navigation - with null checks
const menuBtn = document.querySelector('#menu-btn');
const searchBtn = document.querySelector('#search-btn');
const cartBtn = document.querySelector('#cart-btn');
const closeCartBtn = document.querySelector('#closeCart');

if (menuBtn) {
    menuBtn.onclick = () => {
        navbar.classList.toggle('active');
        if (searchForm) searchForm.classList.remove('active');
        if (cartSidebar) cartSidebar.classList.remove('active');
    };
}

if (searchBtn) {
    searchBtn.onclick = () => {
        if (searchForm) searchForm.classList.toggle('active');
        if (navbar) navbar.classList.remove('active');
        if (cartSidebar) cartSidebar.classList.remove('active');
    };
}

// Cart Sidebar Controls
if (cartBtn) {
    cartBtn.onclick = () => {
        if (cartSidebar) {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        if (navbar) navbar.classList.remove('active');
        if (searchForm) searchForm.classList.remove('active');
        updateCartDisplay();
    };
}

if (closeCartBtn) {
    closeCartBtn.onclick = () => {
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };
}

// Close cart when clicking overlay
if (cartOverlay) {
    cartOverlay.onclick = () => {
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };
}

window.onscroll = () => {
    if (navbar) navbar.classList.remove('active');
    if (searchForm) searchForm.classList.remove('active');
};

// Header shadow effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 0) {
            header.classList.add('shadow');
        } else {
            header.classList.remove('shadow');
        }
    }
});

// Best Products Slider
class ProductSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('#prevBtn');
        this.nextBtn = document.querySelector('#nextBtn');
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto slide
        this.startAutoSlide();
        
        // Pause auto slide on hover
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => this.stopAutoSlide());
            sliderContainer.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    updateSlider() {
        // Remove active class from all slides and indicators
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
        
        // Transform slider
        const slider = document.querySelector('.product-slider');
        slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    addTouchSupport() {
        const slider = document.querySelector('.slider-container');
        if (!slider) return;
        
        let startX = 0;
        let endX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
}

// ===== FUNÇÕES DE NAVEGAÇÃO =====
function initNavigation() {
  // Ativa/desativa barra de pesquisa
  elements.searchIcon.onclick = () => {
    elements.search.classList.toggle('active');
    elements.navbar.classList.remove('active');
  };

  // Mostra/oculta menu responsivo
  elements.menuIcon.onclick = () => {
    elements.navbar.classList.toggle('active');
    elements.search.classList.remove('active');
  };

  // Oculta menus ao rolar a página
  window.onscroll = () => {
    elements.navbar.classList.remove('active');
    elements.search.classList.remove('active');
  };

  // Adiciona sombra ao header ao rolar
  window.addEventListener('scroll', () => {
    elements.header.classList.toggle('shadow', window.scrollY > 0);
  });
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    const notification = document.querySelector('.notification');
    if (!notification) return;
    
    // Remove existing type classes
    notification.classList.remove('success', 'error', 'info', 'warning');
    
    // Add new type class
    notification.classList.add(type);
    notification.textContent = message;
    notification.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== FUNÇÕES DO CARRINHO =====
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`${name} - Quantidade atualizada!`, 'success');
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
        showNotification(`${name} adicionado ao carrinho!`, 'success');
    }
    
    saveCart();
    updateCartCount();
    
    // Animate cart button
    const cartBtn = document.querySelector('#cart-btn');
    cartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
}

function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index > -1) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        updateCartDisplay();
        showNotification(`${removedItem.name} removido do carrinho!`, 'error');
    }
}

function updateQuantity(name, newQuantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(name);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('O carrinho já está vazio!', 'info');
        return;
    }
    
    // Animate cart items before clearing
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'slideOutRight 0.3s ease forwards';
        }, index * 100);
    });
    
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartCount();
        updateCartDisplay();
        showNotification('Carrinho limpo!', 'success');
    }, cartItems.length * 100 + 300);
}

function saveCart() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        
        // Animate count update
        if (totalItems > 0) {
            cartCount.style.animation = 'bounce 0.3s ease';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 300);
        }
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        cartTotal.textContent = '0,00';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">
                            -
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">
                            +
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
}

function openCart() {
  elements.cartModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  elements.cartModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// ===== CHECKOUT =====
function checkout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create checkout summary
    let summary = `🛒 RESUMO DO PEDIDO\n\n`;
    cart.forEach(item => {
        summary += `• ${item.name}\n  Qtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')}\n\n`;
    });
    summary += `📊 Total de itens: ${itemCount}\n💰 Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    if (confirm(summary + '\n\nConfirmar pedido?')) {
        // Simulate order processing
        showNotification('Processando pedido...', 'info');
        
        setTimeout(() => {
            showNotification('Pedido realizado com sucesso! 🎉', 'success');
            clearCart();
            cartSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }, 1500);
    }
}

// ===== EVENTOS DO CARRINHO =====
function initCartEvents() {
  // Abrir carrinho
  elements.cartIcon.addEventListener('click', openCart);
  
  // Fechar carrinho
  elements.closeCart.addEventListener('click', closeCart);
  
  // Fechar carrinho clicando fora
  elements.cartModal.addEventListener('click', (e) => {
    if (e.target === elements.cartModal) {
      closeCart();
    }
  });
  
  // Limpar carrinho
  elements.clearCartBtn.addEventListener('click', clearCart);
  
  // Finalizar compra
  elements.checkoutBtn.addEventListener('click', checkout);
  
  // Botões adicionar ao carrinho
  elements.addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.getAttribute('data-product-id');
      addToCart(productId);
    });
  });
  
  // Fechar carrinho com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.cartModal.classList.contains('active')) {
      closeCart();
    }
  });
}

// ===== INICIALIZAÇÃO =====
function init() {
    // Initialize slider
    if (document.querySelector('.slider-container')) {
        new ProductSlider();
    }
    
    // Update cart display
    updateCartDisplay();
    updateCartCount();
    
    // Event listeners para botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = e.target.getAttribute('data-price');
            const image = e.target.getAttribute('data-image');
            
            if (name && price && image) {
                addToCart(name, price, image);
            }
        });
    });
    
    // Event listeners para controles do carrinho
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkout');
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC to close cart
        if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    console.log('🚀 Coffee Shop Website initialized successfully!');
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        80% {
            transform: translateY(-5px);
        }
    }
    
    .cart-item {
        animation: slideInRight 0.3s ease;
    }
    
    .notification.success {
        background: linear-gradient(135deg, #4CAF50, #45a049);
    }
    
    .notification.error {
        background: linear-gradient(135deg, #f44336, #da190b);
    }
    
    .notification.warning {
        background: linear-gradient(135deg, #ff9800, #f57c00);
    }
    
    .notification.info {
        background: linear-gradient(135deg, #2196F3, #0b7dda);
    }
`;
document.head.appendChild(style);