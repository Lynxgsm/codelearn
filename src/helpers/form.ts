const formatFormToObject = (formData: FormData) => {
    const input: { [key: string]: any } = {};
    formData.forEach((value, key) => {
        input[key] = value
    })

    return input
}

const generatedPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
}

export {
    formatFormToObject, generatedPassword
}

