// src/services/security.js
export const SecurityUtils = {
    // Validação de email
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Sanitização básica de inputs
    sanitizeInput: (input) => {
        if (typeof input !== 'string') return input;

        return input
            .replace(/[<>]/g, '') // Remove < e >
            .replace(/javascript:/gi, '') // Remove javascript:
            .replace(/on\w+=/gi, '') // Remove event handlers
            .replace(/'|"|;|--/g, '') // Remove caracteres SQL perigosos
            .trim()
            .substring(0, 255); // Limita tamanho
    },

    // Validação de senha
    validatePassword: (password) => {
        return password && password.length >= 6;
    },

    // Prevenção de XSS - escape de HTML
    escapeHtml: (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
        };
        return text.replace(/[&<>"']/g, (char) => map[char]);
    },

    // Detecção básica de tentativa de SQL Injection
    containsSQLInjection: (text) => {
        const sqlKeywords = [
            'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION',
            'OR', 'AND', 'WHERE', 'FROM', 'TABLE', 'DATABASE',
            'EXEC', 'EXECUTE', 'TRUNCATE', 'ALTER', 'CREATE'
        ];
        const upperText = text.toUpperCase();
        return sqlKeywords.some(keyword => upperText.includes(keyword));
    }
};