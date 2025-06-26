import StoryAPI from "../scripts/data/api";

class registerModel {
   constructor() {
        this.validationRules = {
            name: {
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s]+$/
            },
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            password: {
                minLength: 8,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
            }
        };
    }

    validateRegistrationData(name, email, password) {
        const errors = [];
        if (!name || name.trim().length === 0) {
            errors.push("Nama harus diisi");
        } else if (name.trim().length < this.validationRules.name.minLength) {
            errors.push("Nama minimal 2 karakter");
        } else if (name.trim().length > this.validationRules.name.maxLength) {
            errors.push("Nama maksimal 50 karakter");
        } else if (!this.validationRules.name.pattern.test(name.trim())) {
            errors.push("Nama hanya boleh berisi huruf dan spasi");
        }

        if (!email || email.trim().length === 0) {
            errors.push("Email harus diisi");
        } else if (!this.validationRules.email.pattern.test(email.trim())) {
            errors.push("Format email tidak valid");
        }

        if (!password || password.trim().length === 0) {
            errors.push("Password harus diisi");
        } else if (password.length < this.validationRules.password.minLength) {
            errors.push("Password minimal 8 karakter");
        } else if (!this.validationRules.password.pattern.test(password)) {
            errors.push("Password harus mengandung huruf besar, kecil, dan angka");
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }I
    sanitizeUserData(name, email, password) {
        return {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password 
        };
    }

    // bisnis logic
    async registerUser(name, email, password) {
        const validation = this.validateRegistrationData(name, email, password);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(", "));
        }
        const sanitizedData = this.sanitizeUserData(name, email, password);

        try {
            const result = await StoryAPI.register(sanitizedData);
            return this.processRegistrationResponse(result);
        } catch (error) {
            throw this.handleRegistrationError(error);
        }
    }
    processRegistrationResponse(apiResponse) {
        return {
            success: true,
            message: "Registrasi berhasil! Silakan login dengan akun Anda.",
            userData: {
                name: apiResponse.data?.name || '',
                email: apiResponse.data?.email || ''
            }
        };
    }

    handleRegistrationError(error) {
        const errorMessages = {
            'Email already exists': 'Email sudah terdaftar, silakan gunakan email lain',
            'Invalid email format': 'Format email tidak valid',
            'Password too weak': 'Password terlalu lemah',
            'Server error': 'Terjadi kesalahan server, silakan coba lagi'
        };

        const userFriendlyMessage = errorMessages[error.message] || error.message;
        return new Error(userFriendlyMessage);
    }
    getValidationRules() {
        return {
            name: `Nama harus ${this.validationRules.name.minLength}-${this.validationRules.name.maxLength} karakter, hanya huruf dan spasi`,
            email: "Masukkan alamat email yang valid",
            password: `Password minimal ${this.validationRules.password.minLength} karakter dengan huruf besar, kecil, dan angka`
        };
    }
}
export default registerModel;