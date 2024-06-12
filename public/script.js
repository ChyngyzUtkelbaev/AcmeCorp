const app = document.getElementById('app');

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function displayRegistrationPage() {
    app.innerHTML = `
        <div class="container">
            <h2>Register</h2>
            <form id="registrationForm">
                <label for="name">Name</label>
                <input type="text" id="name" placeholder="Name" required>
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Email" required>
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Password" required>
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                <button type="submit">Register</button>
                <p class="message" id="registrationMessage"></p>
            </form>
            <p>Already have an account? <a href="#" id="loginLink">Login</a></p>
        </div>
    `;

    document.getElementById('loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        displayLoginPage();
    });

    const registrationForm = document.getElementById('registrationForm');
    const registrationMessage = document.getElementById('registrationMessage');

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            registrationMessage.textContent = 'Passwords do not match.';
            return;
        }

        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayLoginPage();
            } else {
                registrationMessage.textContent = data.message;
            }
        });
    });
}

function displayLoginPage() {
    app.innerHTML = `
        <div class="container">
            <h2>Login</h2>
            <form id="loginForm">
                <label for="loginEmail">Email</label>
                <input type="email" id="loginEmail" placeholder="Email" required>
                <label for="loginPassword">Password</label>
                <input type="password" id="loginPassword" placeholder="Password" required>
                <button type="submit">Login</button>
                <p class="message" id="loginMessage"></p>
            </form>
            <p><a href="#" id="forgotPasswordLink">Forgot Password?</a></p>
            <p>Don't have an account? <a href="#" id="registerLink">Register</a></p>
        </div>
    `;

    document.getElementById('registerLink').addEventListener('click', (e) => {
        e.preventDefault();
        displayRegistrationPage();
    });

    document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
        e.preventDefault();
        displayForgotPasswordPage();
    });

    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayProfilePage(data.user);
            } else {
                loginMessage.textContent = data.message;
            }
        });
    });
}

function displayForgotPasswordPage() {
    app.innerHTML = `
        <div class="container">
            <h2>Forgot Password</h2>
            <form id="forgotPasswordForm">
                <label for="forgotEmail">Email</label>
                <input type="email" id="forgotEmail" placeholder="Email" required>
                <button type="submit">Send Reset Link</button>
                <p class="message" id="forgotPasswordMessage"></p>
            </form>
            <p>Remembered your password? <a href="#" id="loginLink">Login</a></p>
        </div>
    `;

    document.getElementById('loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        displayLoginPage();
    });

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const forgotPasswordMessage = document.getElementById('forgotPasswordMessage');

    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;

        fetch('/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            forgotPasswordMessage.textContent = data.message;
        });
    });
}

function displayResetPasswordPage() {
    app.innerHTML = `
        <div class="container">
            <h2>Reset Password</h2>
            <form id="resetPasswordForm">
                <label for="newPassword">New Password</label>
                <input type="password" id="newPassword" placeholder="New Password" required>
                <label for="confirmNewPassword">Confirm New Password</label>
                <input type="password" id="confirmNewPassword" placeholder="Confirm New Password" required>
                <button type="submit">Reset Password</button>
                <p class="message" id="resetPasswordMessage"></p>
            </form>
        </div>
    `;

    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const resetPasswordMessage = document.getElementById('resetPasswordMessage');
    const token = getQueryParameter('token');

    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        if (password !== confirmPassword) {
            resetPasswordMessage.textContent = 'Passwords do not match.';
            return;
        }

        fetch('/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        })
        .then(response => response.json())
        .then(data => {
            resetPasswordMessage.textContent = data.message;
        });
    });
}

function displayProfilePage(user) {
    app.innerHTML = `
        <div class="container">
            <h2>Profile</h2>
            <form id="profileForm">
                <label for="name">Name</label>
                <input type="text" id="name" placeholder="Name" value="${user.name}" required>
                <label for="address">Address</label>
                <input type="text" id="address" placeholder="Address" value="${user.address}">
                <label for="phone">Phone</label>
                <input type="text" id="phone" placeholder="Phone" value="${user.phone}">
                <input type="hidden" id="email" value="${user.email}">
                <button type="submit">Update Profile</button>
                <p class="message" id="profileMessage"></p>
            </form>
            <button id="logoutButton">Logout</button>
        </div>
    `;

    const profileForm = document.getElementById('profileForm');
    const profileMessage = document.getElementById('profileMessage');

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        fetch('/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, address, phone, email })
        })
        .then(response => response.json())
        .then(data => {
            profileMessage.textContent = data.message;
        });
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
        displayLoginPage();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('reset-password.html')) {
        displayResetPasswordPage();
    } else {
        displayLoginPage();
    }
});
