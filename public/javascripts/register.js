
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const errorMessageEl = document.getElementById('errorMessage');

    form.addEventListener('submit', function (e) {
    if (password.value !== confirmPassword.value) {
        e.preventDefault();
        errorMessageEl.textContent = 'Passwords do not match!';
        errorMessageEl.classList.remove('hidden');
        confirmPassword.focus();
    }
    });

    password.addEventListener('input', () => {
    errorMessageEl.classList.add('hidden');
    });
    confirmPassword.addEventListener('input', () => {
    errorMessageEl.classList.add('hidden');
    });
});