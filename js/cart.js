// Shared cart functionality for GoldSpice website
// This file provides common cart operations across all pages

class GoldSpiceCart {
    constructor() {
        this.cart = [];
        this.storageKey = 'goldspiceCart';
        this.loadCart();
    }

    // Load cart from localStorage
    loadCart() {
        const storedCart = localStorage.getItem(this.storageKey);
        if (storedCart) {
            this.cart = JSON.parse(storedCart);
        }
        this.updateCartCount();
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Add item to cart
    addItem(productId, productName, productPrice, productImage, productPack, quantity = 1) {
        const existingItemIndex = this.cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex > -1) {
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                pack: productPack,
                quantity: quantity
            });
        }
        
        this.saveCart();
        return true;
    }

    // Remove item from cart
    removeItem(productId) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const removedItem = this.cart[itemIndex];
            this.cart.splice(itemIndex, 1);
            this.saveCart();
            return removedItem;
        }
        return null;
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            if (newQuantity <= 0) {
                return this.removeItem(productId);
            } else {
                this.cart[itemIndex].quantity = newQuantity;
                this.saveCart();
                return this.cart[itemIndex];
            }
        }
        return null;
    }

    // Get cart items
    getItems() {
        return this.cart;
    }

    // Get cart total count
    getTotalCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Get cart subtotal
    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Update cart count in navigation
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cart-count');
        const totalItems = this.getTotalCount();
        
        cartCountElements.forEach(element => {
            if (element) {
                element.textContent = totalItems;
            }
        });
    }

    // Check if cart is empty
    isEmpty() {
        return this.cart.length === 0;
    }

    // Get item by ID
    getItem(productId) {
        return this.cart.find(item => item.id === productId);
    }
}

// Create global cart instance
window.goldSpiceCart = new GoldSpiceCart();

// Utility function to show notifications
function showCartNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.className = 'fixed top-0 left-0 right-0 text-white text-center py-4 z-50 transition-all duration-300 transform -translate-y-full';
        document.body.appendChild(notification);
    }

    // Set notification style based on type
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    notification.className = `fixed top-0 left-0 right-0 ${bgColor} text-white text-center py-4 z-50 transition-all duration-300 transform translate-y-0`;
    notification.textContent = message;

    // Show notification
    notification.style.display = 'block';

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.className = notification.className.replace('translate-y-0', '-translate-y-full');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.goldSpiceCart) {
        window.goldSpiceCart.updateCartCount();
    }
});
