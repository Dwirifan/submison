import loginPresenter from "../../presenters/loginPresenter";
import loginModel from "../../models/loginModel";

class LoginPage {
    constructor() {
        this.presenter = null;
        this.model = null;
    }

    async render() {
        return `
            <section class="auth" id="mainContent">
                <h1 class="auth__title">Masuk</h1>
               
                <form class="auth__form" id="loginForm">
                    <div class="form-field">
                        <label for="email">Alamat Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            autocomplete="email"
                        />
                        <span class="field-error" id="emailError"></span>
                    </div>

                    <div class="form-field">
                        <label for="password">Kata Sandi</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            autocomplete="current-password"
                        />
                        <span class="field-error" id="passwordError"></span>
                    </div>

                    <button type="submit" class="submit-button" id="loginButton">
                        Masuk
                    </button>
                    
                    <div id="loadingSpinner" class="spinner" style="display: none;">
                    </div>
                </form>

                <div id="loginMessage" class="message"></div>
                
                <p class="auth__link">
                    Belum memiliki akun? <a href="#/register" id="registerLink">Daftar di sini</a>
                </p>
            </section>
        `;
    }

    async afterRender() {
        try {
            this.initializeComponents();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing login page:', error);
            this.showMessage('Terjadi kesalahan saat memuat halaman login', false);
        }
    }

    initializeComponents() {
        this.model = new loginModel();
        this.presenter = new loginPresenter(this.model, this);
    }

    setupEventListeners() {
        this.setupFormListener();
        this.setupInputListeners();
        this.setupNavigationListener();
    }

    setupFormListener() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    setupInputListeners() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('input', (e) => {
                this.presenter?.handleEmailInput(e.target.value);
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.presenter?.handlePasswordInput(e.target.value);
            });
        }
    }

    setupNavigationListener() {
        const registerLink = document.getElementById('registerLink');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.presenter?.navigateToRegister();
            });
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email')?.trim() || '';
        const password = formData.get('password') || '';

        if (this.presenter) {
            await this.presenter.handleLogin(email, password);
        }
    }

    showMessage(message, isSuccess = false) {
        const messageElement = document.getElementById('loginMessage');
        if (messageElement) {
            messageElement.className = `message ${isSuccess ? 'success' : 'error'}`;
            messageElement.textContent = message;
            messageElement.style.display = 'block';
            
            if (isSuccess) {
                setTimeout(() => {
                    this.clearMessage();
                }, 3000);
            }
        }
    }

    clearMessage() {
        const messageElement = document.getElementById('loginMessage');
        if (messageElement) {
            messageElement.style.display = 'none';
            messageElement.textContent = '';
        }
    }

    showFieldError(fieldName, errorMessage) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }

    clearFieldError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
        
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }

    showLoading(show = true) {
        const spinner = document.getElementById('loadingSpinner');
        const button = document.getElementById('loginButton');
        const inputs = document.querySelectorAll('#loginForm input');
        
        if (spinner) {
            spinner.style.display = show ? 'block' : 'none';
        }
        
        if (button) {
            button.disabled = show;
            button.innerHTML = show ? '<span>Memproses...</span>' : 'Masuk';
        }
        
        inputs.forEach(input => {
            input.disabled = show;
        });
    }

    redirectToHome() {
        window.location.hash = '#/';
    }

    redirectToRegister() {
        window.location.hash = '#/register';  
    }

    destroy() {
        if (this.presenter) {
            this.presenter.destroy();
        }
        this.presenter = null;
        this.model = null;
    }
}

export default LoginPage;