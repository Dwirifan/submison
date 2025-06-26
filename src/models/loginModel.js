import StoryAPI from "../scripts/data/api";

class loginModel {
    constructor() {
        this.validationRules = {
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            password: {
                minLength: 8
            }
        };
    }

    validateLoginData(email, password) {
        const errors = [];

        if (!email || email.trim().length === 0) {
            errors.push("Email harus diisi");
        } else if (!this.validationRules.email.pattern.test(email.trim())) {
            errors.push("Format email tidak valid");
        }

        if (!password || password.trim().length === 0) {
            errors.push("Password harus diisi");
        } else if (password.length < this.validationRules.password.minLength) {
            errors.push("Password minimal 6 karakter");
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    sanitizeUserData(email, password) {
        return {
            email: email.trim().toLowerCase(),
            password: password 
        };
    }

    async loginUser(email, password) {
        const validation = this.validateLoginData(email, password);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(", "));
        }
        const sanitizedData = this.sanitizeUserData(email, password);

        try {
            const result = await StoryAPI.login(sanitizedData);
            const processedResult = this.processLoginResponse(result);
            this.saveLoginData(processedResult.loginData);
            
            return processedResult;
            
        } catch (error) {
            throw this.handleLoginError(error);
        }
    }

    processLoginResponse(apiResponse) {
        if (!apiResponse || !apiResponse.loginResult) {
            throw new Error('Response tidak valid dari server');
        }

        const { token, userId, name } = apiResponse.loginResult;
        if (!token || !userId || !name) {
            throw new Error('Data login tidak lengkap dari server');
        }

        return {
            success: true,
            message: "Login berhasil!",
            loginData: { token, userId, name }
        };
    }

    handleLoginError(error) {
        const errorMessages = {
            'Invalid credentials': 'Email atau password salah',
            'User not found': 'Akun tidak ditemukan',
            'Account locked': 'Akun Anda terkunci, silakan hubungi administrator',
            'Server error': 'Terjadi kesalahan server, silakan coba lagi',
            'Network error': 'Koneksi bermasalah, periksa internet Anda'
        };

        const userFriendlyMessage = errorMessages[error.message] || 
            error.message || 
            'Terjadi kesalahan saat login';
            
        return new Error(userFriendlyMessage);
    }

    saveLoginData({ token, userId, name }) {
        try {
            if (!token || !userId || !name) {
                throw new Error('Data login tidak valid');
            }
            
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("name", name);
            
        } catch (error) {
            console.error('Error saving login data:', error);
            throw new Error('Gagal menyimpan data login');
        }
    }

    getToken() {
        return localStorage.getItem("token");
    }

    getUserId() {
        return localStorage.getItem("userId");
    }

    getUserName() {
        return localStorage.getItem("name");
    }

    isLoggedIn() {
        return !!this.getToken();
    }

    clearLoginData() {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("name");
        } catch (error) {
            console.error('Error clearing login data:', error);
        }
    }

    getCurrentUser() {
        if (!this.isLoggedIn()) {
            return null;
        }

        return {
            token: this.getToken(),
            userId: this.getUserId(),
            name: this.getUserName()
        };
    }

    getValidationRules() {
        return {
            email: "Masukkan alamat email yang valid",
            password: `Password minimal ${this.validationRules.password.minLength} karakter`
        };
    }
}

export default loginModel;