class registerPresenter {
   constructor(model, view) {
        this.model = model;
        this.view = view;
        this.isProcessing = false;
    }

    async handleRegister(name, email, password) {
        if (this.isProcessing) {
            return;
        }

        try {
            this.isProcessing = true;
            
            this.view.showLoading(true);
            this.view.clearMessage();

            if (!this.validateBasicInput(name, email, password)) {
                return;
            }
            const result = await this.model.registerUser(name, email, password);
            this.handleRegistrationSuccess(result);
            
        } catch (error) {
            this.handleRegistrationError(error);
        } finally {
            this.isProcessing = false;
            this.view.showLoading(false);
        }
    }

    validateBasicInput(name, email, password) {
        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            this.view.showMessage('Semua field harus diisi', false);
            return false;
        }
        return true;
    }
    
    handleRegistrationSuccess(result) {
        this.view.showMessage(result.message, true);
        setTimeout(() => {
            this.view.redirectToLogin();
        }, 2000);
    }

    handleRegistrationError(error) {
        console.error('Registration error:', error);
        
        const errorMessage = error.message || 'Terjadi kesalahan saat registrasi';
        this.view.showMessage(errorMessage, false);
    }

    getValidationHints() {
        return this.model.getValidationRules();
    }
    handleNameInput(name) {
        if (name.length > 0 && name.length < 2) {
            this.view.showFieldError('name', 'Nama minimal 2 karakter');
        } else {
            this.view.clearFieldError('name');
        }
    }

    handleEmailInput(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 0 && !emailPattern.test(email)) {
            this.view.showFieldError('email', 'Format email belum benar');
        } else {
            this.view.clearFieldError('email');
        }
    }

    handlePasswordInput(password) {
        if (password.length > 0 && password.length < 6) {
            this.view.showFieldError('password', 'Password minimal 6 karakter');
        } else {
            this.view.clearFieldError('password');
        }
    }
    navigateToLogin() {
        this.view.redirectToLogin();
    }

    navigateToHome() {
        this.view.redirectToHome();
    }
    destroy() {
        this.model = null;
        this.view = null;
        this.isProcessing = false;
    }
}

export default registerPresenter;