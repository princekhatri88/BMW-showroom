// Authentication and Subscription Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.subscriptionTypes = {
            basic: 'basic',
            premium: 'premium',
            enterprise: 'enterprise'
        };
        this.init();
    }

    init() {
        // Check if user is already logged in
        this.checkAuthStatus();
        // Initialize event listeners
        this.setupEventListeners();
    }

    checkAuthStatus() {
        const userData = localStorage.getItem('bmwUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUIForLoggedInUser();
        }
    }

    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Subscription form submission
        const subscriptionForms = document.querySelectorAll('.subscription-form');
        subscriptionForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubscription(e));
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        try {
            // Here you would typically make an API call to your backend
            // For demo purposes, we'll simulate a successful login
            const user = {
                email,
                subscriptionType: this.subscriptionTypes.basic,
                name: email.split('@')[0]
            };

            this.currentUser = user;
            localStorage.setItem('bmwUser', JSON.stringify(user));
            
            this.showNotification('Login successful!', 'success');
            this.updateUIForLoggedInUser();
            
            // Redirect to home page after successful login
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        } catch (error) {
            this.showNotification('Login failed. Please try again.', 'error');
        }
    }

    handleSubscription(e) {
        e.preventDefault();
        if (!this.currentUser) {
            this.showNotification('Please login to subscribe', 'error');
            window.location.href = 'login.html';
            return;
        }

        const form = e.target;
        const subscriptionType = form.dataset.subscriptionType;
        
        // Update user's subscription
        this.currentUser.subscriptionType = subscriptionType;
        localStorage.setItem('bmwUser', JSON.stringify(this.currentUser));
        
        this.showNotification(`Successfully upgraded to ${subscriptionType} subscription!`, 'success');
        this.updateUIForLoggedInUser();
    }

    handleLogout() {
        localStorage.removeItem('bmwUser');
        this.currentUser = null;
        this.updateUIForLoggedOutUser();
        this.showNotification('Logged out successfully', 'success');
    }

    updateUIForLoggedInUser() {
        // Update navigation
        const loginBtn = document.querySelector('.login-nav-btn');
        if (loginBtn) {
            loginBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>${this.currentUser.name}</span>
                <div class="btn-ripple"></div>
            `;
            loginBtn.href = '#';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                this.showUserMenu();
            };
        }

        // Update subscription cards
        const subscriptionCards = document.querySelectorAll('.subscription-card');
        subscriptionCards.forEach(card => {
            const type = card.dataset.type;
            const button = card.querySelector('.subscribe-btn');
            
            if (type === this.currentUser.subscriptionType) {
                button.textContent = 'Current Plan';
                button.classList.add('current-plan');
            } else if (this.isUpgrade(type)) {
                button.textContent = 'Upgrade Now';
            } else {
                button.style.display = 'none';
            }
        });
    }

    updateUIForLoggedOutUser() {
        const loginBtn = document.querySelector('.login-nav-btn');
        if (loginBtn) {
            loginBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Login</span>
                <div class="btn-ripple"></div>
            `;
            loginBtn.href = 'login.html';
            loginBtn.onclick = null;
        }

        // Reset subscription cards
        const subscriptionCards = document.querySelectorAll('.subscription-card');
        subscriptionCards.forEach(card => {
            const button = card.querySelector('.subscribe-btn');
            button.textContent = 'Subscribe Now';
            button.classList.remove('current-plan');
            button.style.display = 'block';
        });
    }

    isUpgrade(newType) {
        const typeOrder = [this.subscriptionTypes.basic, this.subscriptionTypes.premium, this.subscriptionTypes.enterprise];
        const currentIndex = typeOrder.indexOf(this.currentUser.subscriptionType);
        const newIndex = typeOrder.indexOf(newType);
        return newIndex > currentIndex;
    }

    showUserMenu() {
        const menu = document.createElement('div');
        menu.className = 'user-menu';
        menu.innerHTML = `
            <div class="user-info">
                <i class="fas fa-user-circle"></i>
                <span>${this.currentUser.name}</span>
                <span class="subscription-badge">${this.currentUser.subscriptionType}</span>
            </div>
            <div class="menu-items">
                <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
                <a href="subscriptions.html"><i class="fas fa-crown"></i> Subscriptions</a>
                <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Position menu
        const loginBtn = document.querySelector('.login-nav-btn');
        const rect = loginBtn.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 10}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== loginBtn) {
                menu.remove();
            }
        });
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
}); 