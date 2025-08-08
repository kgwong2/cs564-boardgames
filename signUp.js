function validateSignUp() {
    const username = document.getElementById('newUserName').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (username === '') {
        alert('Please enter a username.');
        return false;
    }

    if (password === '') {
        alert('Please enter a password.');
        return false;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }

    return true;
}
