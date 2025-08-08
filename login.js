function validateLogin() {
    const username = document.getElementById('userName').value.trim();
    const password = document.getElementById('password').value;

    if (username === '') {
        alert('Please enter your username.');
        return false;
    }

    if (password === '') {
        alert('Please enter your password.');
        return false;
    }

    return true;
}