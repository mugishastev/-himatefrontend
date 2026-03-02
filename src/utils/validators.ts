export const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const isStrongPassword = (password: string) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    return re.test(password);
};

export const isAlphaNumeric = (str: string) => {
    const re = /^[a-z0-9]+$/i;
    return re.test(str);
};

export const isNumeric = (val: string | number) => {
    return !isNaN(parseFloat(val.toString())) && isFinite(Number(val));
};
