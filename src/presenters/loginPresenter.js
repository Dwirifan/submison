class loginPresenter {
    constructor(model, view, notificationHelper) {
        this.model = model;
        this.view = view;
        this.notificationHelper = notificationHelper;
        this.isProcessing = false;
    }

    async handleLogin(email, password) {
        if (this.isProcessing) return;

        if (!this.view) {
            this.isProcessing = false;
            return;
        }

        try {
            this.isProcessing = true;
            this.view.showLoading(true);
            this.view.clearMessage();
            this.clearAllFieldErrors();

            if (!this.validateBasicInput(email, password)) {
                this.isProcessing = false;
                this.view.showLoading(false);
                return;
            }

            const result = await this.model.loginUser(email, password);

            if (!this.view) {
                this.isProcessing = false;
                return;
            }

            // Simpan token jika perlu
            if (result?.loginResult?.token) {
                localStorage.setItem('token', result.loginResult.token);
                localStorage.setItem('user', JSON.stringify(result.loginResult));
            }

            this.handleLoginSuccess(result);

        } catch (error) {
            if (!this.view) {
                this.isProcessing = false;
                return;
            }
            this.handleLoginError(error);
        } finally {
            this.isProcessing = false;
            if (this.view) {
                this.view.showLoading(false);
            }
        }
    }

    validateBasicInput(email, password) {
        let isValid = true;
        if (!this.view) return false;

        if (!email?.trim()) {
            this.view.showFieldError('email', 'Email harus diisi');
            isValid = false;
        }

        if (!password?.trim()) {
            this.view.showFieldError('password', 'Password harus diisi');
            isValid = false;
        }

        return isValid;
    }

    handleLoginSuccess(result) {
        if (!this.view) return;

        this.view.showMessage('Login berhasil! Mengarahkan ke halaman utama...', true);

        setTimeout(() => {
            if (this.view) {
                this.view.redirectToHome();
            }
        }, 1500);
    }

    handleLoginError(error) {
        console.error('Login error:', error);
        if (!this.view) return;

        const errorMessage = error.message || 'Terjadi kesalahan saat login';
        this.view.showMessage(errorMessage, false);
    }

    handleEmailInput(email) {
        if (!this.view) return;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 0 && !emailPattern.test(email)) {
            this.view.showFieldError('email', 'Format email belum benar');
        } else {
            this.view.clearFieldError('email');
        }
    }

    handlePasswordInput(password) {
        if (!this.view) return;

        if (password.length > 0 && password.length < 6) {
            this.view.showFieldError('password', 'Password minimal 6 karakter');
        } else {
            this.view.clearFieldError('password');
        }
    }

    clearAllFieldErrors() {
        if (!this.view) return;

        this.view.clearFieldError('email');
        this.view.clearFieldError('password');
    }

    navigateToRegister() {
        if (this.view) {
            this.view.redirectToRegister();
        }
    }

    navigateToHome() {
        if (this.view) {
            this.view.redirectToHome();
        }
    }

    destroy() {
        this.model = null;
        this.view = null;
        this.notificationHelper = null;
        this.isProcessing = false;
    }
}

export default loginPresenter;
