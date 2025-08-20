// Authentication JavaScript
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupTokenRefresh();
    }

    async checkAuthStatus() {
        if (!this.token) {
            this.redirectToLogin();
            return;
        }

        try {
            const response = await fetch('/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Token verification failed');
            }

            const data = await response.json();
            this.user = data.user;
            this.updateUI();
            
        } catch (error) {
            console.error('Auth check failed:', error);
            this.logout();
        }
    }

    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            this.token = data.token;
            this.user = data.user;
            
            // Store token and user data
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            
            return data;
            
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            this.token = data.token;
            this.user = data.user;
            
            // Store token and user data
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            
            return data;
            
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            sessionStorage.removeItem('authToken');
            
            this.token = null;
            this.user = null;
            
            this.redirectToLogin();
        }
    }

    redirectToLogin() {
        if (window.location.pathname !== '/signin.html' && window.location.pathname !== '/signup.html') {
            window.location.href = '/signin.html';
        }
    }

    updateUI() {
        // Update user interface elements
        const userElements = document.querySelectorAll('[data-user-info]');
        
        userElements.forEach(element => {
            const info = element.dataset.userInfo;
            if (this.user && this.user[info]) {
                element.textContent = this.user[info];
            }
        });

        // Show/hide elements based on auth status
        const authElements = document.querySelectorAll('[data-auth-required]');
        const guestElements = document.querySelectorAll('[data-guest-only]');
        
        authElements.forEach(element => {
            element.style.display = this.token ? 'block' : 'none';
        });
        
        guestElements.forEach(element => {
            element.style.display = this.token ? 'none' : 'block';
        });
    }

    setupTokenRefresh() {
        // Refresh token before it expires
        if (this.token) {
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            const expirationTime = payload.exp * 1000;
            const currentTime = Date.now();
            const timeUntilExpiration = expirationTime - currentTime;
            
            // Refresh token 5 minutes before expiration
            const refreshTime = Math.max(timeUntilExpiration - 5 * 60 * 1000, 60000);
            
            setTimeout(() => {
                this.refreshToken();
            }, refreshTime);
        }
    }

    async refreshToken() {
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.token = data.token;
                localStorage.setItem('authToken', this.token);
                this.setupTokenRefresh();
            } else {
                this.logout();
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.logout();
        }
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    hasRole(role) {
        return this.user && this.user.role === role;
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }
}

// Form validation utilities
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        return {
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };
    }

    static getPasswordStrength(password) {
        const checks = this.validatePassword(password);
        const score = Object.values(checks).filter(Boolean).length;
        
        if (score <= 2) return { level: 'weak', score };
        if (score <= 3) return { level: 'medium', score };
        return { level: 'strong', score };
    }

    static validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        return usernameRegex.test(username);
    }
}

// UI Helper functions
class UIHelpers {
    static showMessage(elementId, message, type = 'error') {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `${type}-message`;
            element.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    static hideMessage(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    }

    static setLoadingState(buttonId, isLoading, loadingText = 'Loading...') {
        const button = document.getElementById(buttonId);
        const spinner = button.querySelector('.loading-spinner');
        const text = button.querySelector('#btnText');
        
        if (isLoading) {
            button.disabled = true;
            spinner.style.display = 'inline-block';
            text.textContent = loadingText;
        } else {
            button.disabled = false;
            spinner.style.display = 'none';
        }
    }

    static addInputValidation(inputId, validationFn, errorMessage) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('blur', () => {
            const isValid = validationFn(input.value);
            
            if (!isValid && input.value) {
                input.style.borderColor = 'var(--jarvis-red)';
                this.showFieldError(input, errorMessage);
            } else {
                input.style.borderColor = 'var(--jarvis-blue)';
                this.hideFieldError(input);
            }
        });

        input.addEventListener('input', () => {
            this.hideFieldError(input);
            input.style.borderColor = 'var(--jarvis-blue)';
        });
    }

    static showFieldError(input, message) {
        let errorElement = input.parentNode.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: var(--jarvis-red);
                font-size: 0.8rem;
                margin-top: 0.3rem;
                display: block;
            `;
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    static hideFieldError(input) {
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.AuthManager = AuthManager;
    window.FormValidator = FormValidator;
    window.UIHelpers = UIHelpers;
    window.authManager = authManager;
}