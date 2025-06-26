import registerPresenter from "../../presenters/registerPresenter";
import registerModel from "../../models/registerModel";

class registerPage {
  constructor() {
    this.presenter = null;
    this.model = null;
  }

  async render() {
    return `
             <section class="auth" id="mainContent">
               <h1 class="auth__title">Register</h1>
                    <form class="auth__form" id="registerForm">
                    <div class="form-field">
                        <label for="name">Nama</label>
                        <input type="text" id="name" name="name" required />
                        <span class="field-error" id="nameError"></span>
                    </div>
                    
                    <div class="form-field">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required />
                        <span class="field-error" id="emailError"></span>
                    </div>
                    
                    <div class="form-field">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required />
                        <span class="field-error" id="passwordError"></span>
                    </div>
                    
                  <button type="submit" id="registerButton">Register</button>
                    <div id="loadingSpinner" style="display: none;">
                    </div>
                </form>
                
                <div id="registerMessage" class="message"></div>
                
                <p class="auth-link">
                    Sudah punya akun? <a href="#/login" id="loginLink">Login di sini</a>
                </p>
            </section>
        `;
  }

  async afterRender() {
    try {
      this.model = new registerModel();
      this.presenter = new registerPresenter(this.model, this);
      this.setupEventListeners();
    } catch (error) {
      console.error("Error initializing register page:", error);
      this.showMessage("Terjadi kesalahan saat memuat halaman register", false);
    }
  }

  setupEventListeners() {
    const form = document.getElementById("registerForm");
    if (form) {
      form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        this.presenter?.handleNameInput(e.target.value);
      });
    }

    if (emailInput) {
      emailInput.addEventListener("input", (e) => {
        this.presenter?.handleEmailInput(e.target.value);
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener("input", (e) => {
        this.presenter?.handlePasswordInput(e.target.value);
      });
    }
    const loginLink = document.getElementById("loginLink");
    if (loginLink) {
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.presenter?.navigateToLogin();
      });
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name")?.trim() || "";
    const email = formData.get("email")?.trim() || "";
    const password = formData.get("password") || "";

    if (this.presenter) {
      await this.presenter.handleRegister(name, email, password);
    }
  }
  showMessage(message, isSuccess = false) {
    const messageElement = document.getElementById("registerMessage");
    if (messageElement) {
      messageElement.className = `message ${isSuccess ? "success" : "error"}`;
      messageElement.textContent = message;
      messageElement.style.display = "block";

      if (isSuccess) {
        setTimeout(() => {
          this.clearMessage();
        }, 5000);
      }
    }
  }

  clearMessage() {
    const messageElement = document.getElementById("registerMessage");
    if (messageElement) {
      messageElement.style.display = "none";
      messageElement.textContent = "";
    }
  }

  showFieldError(fieldName, errorMessage) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = "block";
      const inputElement = document.getElementById(fieldName);
      if (inputElement) {
        inputElement.classList.add("error");
      }
    }
  }

  clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
      errorElement.style.display = "none";
      errorElement.textContent = "";
      const inputElement = document.getElementById(fieldName);
      if (inputElement) {
        inputElement.classList.remove("error");
      }
    }
  }

  // Dalam registerPage.js
  showLoading(show = true) {
    const spinner = document.getElementById("loadingSpinner");
    const button = document.getElementById("registerButton");
    const inputs = document.querySelectorAll("#registerForm input");

    if (spinner) {
      spinner.style.display = show ? "block" : "none";
    }

    if (button) {
      button.disabled = show;
      button.textContent = show ? "Memproses..." : "Register";
    }

    inputs.forEach((input) => {
      input.disabled = show;
    });
  }
  redirectToLogin() {
    window.location.hash = "#/login";
  }

  redirectToHome() {
    window.location.hash = "#/home";
  }
  destroy() {
    if (this.presenter) {
      this.presenter.destroy();
    }
    this.presenter = null;
    this.model = null;
  }
}

export default registerPage;
