export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    // Replace < and > to prevent basic HTML injection
    return input.replace(/[<>]/g, '');
};

export const validateSearchTerm = (term) => {
    // Allow alphanumeric, spaces, and basic punctuation. 
    // Reject chars that are typically used in XSS payloads like <, >, ;, etc in strict mode
    // But for name search, let's be permissive but safe.
    if (!term) return true;
    // Only allow letters, numbers, spaces, hyphens, underscores, dots
    const regex = /^[a-zA-Z0-9\s\.\,\-\_]+$/;
    return regex.test(term);
};
