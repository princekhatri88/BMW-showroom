document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Dummy credentials
    const validCredentials = {
        email: 'prince@gmail.com',
        password: '1234'
    };

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.querySelector('i').classList.toggle('fa-eye');
        togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Button ripple effect
    document.querySelector('.login-btn').addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Simulate loading
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        loginBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            if (email === validCredentials.email && password === validCredentials.password) {
                errorMessage.style.color = 'var(--success-green)';
                errorMessage.textContent = 'Login successful! Redirecting...';
                
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                errorMessage.style.color = 'var(--error-red)';
                errorMessage.textContent = 'Invalid email or password';
                loginBtn.innerHTML = '<span>Sign In</span>';
                loginBtn.disabled = false;

                // Shake animation for error
                loginForm.classList.add('shake');
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
            }
        }, 1500);
    });

    // Input animations
    document.querySelectorAll('.input-group input').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}); 