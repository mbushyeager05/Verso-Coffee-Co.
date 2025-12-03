// Shopping Cart Management
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.init();
  }

  init() {
    this.updateCartUI();
    this.attachEventListeners();
  }

  loadCart() {
    const savedCart = localStorage.getItem('versoCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  saveCart() {
    localStorage.setItem('versoCart', JSON.stringify(this.items));
  }

  addItem(product, quantity = 1, size = '12oz', grind = 'whole-bean') {
    const existingItemIndex = this.items.findIndex(
      item => item.id === product.id && item.size === size && item.grind === grind
    );

    if (existingItemIndex > -1) {
      this.items[existingItemIndex].quantity += quantity;
    } else {
      this.items.push({
        ...product,
        quantity,
        size,
        grind
      });
    }

    this.saveCart();
    this.updateCartUI();
    this.openCart();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveCart();
    this.updateCartUI();
  }

  updateQuantity(index, quantity) {
    if (quantity <= 0) {
      this.removeItem(index);
    } else {
      this.items[index].quantity = quantity;
      this.saveCart();
      this.updateCartUI();
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotal = document.getElementById('cartTotal');
    const cartFooter = document.getElementById('cartFooter');

    // Update cart count badge
    const itemCount = this.getItemCount();
    if (cartCount) {
      cartCount.textContent = itemCount;
      cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
    }

    // Update cart items display
    if (cartItems && cartEmpty && cartTotal && cartFooter) {
      if (this.items.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.innerHTML = '';
        cartFooter.style.display = 'none';
      } else {
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        cartItems.innerHTML = this.items.map((item, index) => `
          <div class="cart-item">
            <div class="cart-item-image">
              <div class="image-placeholder small"></div>
            </div>
            <div class="cart-item-details">
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-meta">${item.size} • ${item.grind || 'Whole Bean'}</p>
              <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
              <div class="quantity-control">
                <button class="qty-btn" onclick="cart.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" onclick="cart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
              </div>
              <button class="remove-btn" onclick="cart.removeItem(${index})" aria-label="Remove item">×</button>
            </div>
          </div>
        `).join('');
        cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
      }
    }
  }

  openCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('visible');
      document.body.style.overflow = '';
    }
  }

  attachEventListeners() {
    // Cart toggle button
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
      cartToggle.addEventListener('click', () => this.openCart());
    }

    // Close cart button
    const cartClose = document.getElementById('cartClose');
    if (cartClose) {
      cartClose.addEventListener('click', () => this.closeCart());
    }

    // Cart overlay
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => this.closeCart());
    }

    // Continue shopping button
    const continueShopping = document.getElementById('continueShopping');
    if (continueShopping) {
      continueShopping.addEventListener('click', () => this.closeCart());
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        alert('Checkout functionality coming soon!');
      });
    }

    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        const productData = e.target.getAttribute('data-product');
        if (productData) {
          const product = JSON.parse(productData);
          this.addItem(product);
        }
      }
    });

    // Product detail form
    const productForm = document.getElementById('productForm');
    if (productForm) {
      productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const size = document.getElementById('sizeSelect').value;
        const grind = document.getElementById('grindSelect').value;
        const quantity = parseInt(document.getElementById('quantityInput').value);
        
        // Get price based on size
        let price = 18.00;
        if (size === '2lb') price = 60.00;
        if (size === '5lb') price = 140.00;

        const product = {
          id: 'house-blend',
          name: 'House Blend',
          price: price,
          image: 'placeholder'
        };

        this.addItem(product, quantity, size, grind);
      });
    }

    // Filter functionality for shop page
    const roastFilter = document.getElementById('roastFilter');
    if (roastFilter) {
      roastFilter.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        const productCards = document.querySelectorAll('.shop-product-card');
        
        productCards.forEach(card => {
          if (filterValue === 'all') {
            card.style.display = 'block';
          } else {
            const cardRoast = card.getAttribute('data-roast');
            card.style.display = cardRoast === filterValue ? 'block' : 'none';
          }
        });
      });
    }
  }
}

// Initialize cart
const cart = new ShoppingCart();
