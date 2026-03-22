// ========== LOCALSTORAGE HELPERS (shared with Dangnhap.js) ==========
function loadUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function userExists(role, username) {
    const users = loadUsers();
    return users.some(u => u.role === role && u.username === username);
}

function emailExists(email, role) {
    const users = loadUsers();
    return users.some(u => u.email === email && u.role === role);
}

document.addEventListener('DOMContentLoaded', () => {
    const roleCards = document.querySelectorAll('.role-card');
    const userRoleInput = document.getElementById('userRole');
    const farmerFields = document.getElementById('farmerFields');
    const distributorFields = document.getElementById('distributorFields');
    const retailerFields = document.getElementById('retailerFields');

    const registerForm = document.getElementById('registerForm');
    const registerAlert = document.getElementById('registerAlert');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrengthBar = document.getElementById('passwordStrength');
    const submitBtn = document.getElementById('submitBtn');
    const usernameField = document.getElementById('username');

    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            const wasActive = card.classList.contains('active');
            roleCards.forEach(c => c.classList.remove('active'));
            userRoleInput.value = '';
            farmerFields.classList.remove('active');
            distributorFields.classList.remove('active');
            retailerFields.classList.remove('active');

            if (!wasActive) {
                card.classList.add('active');
                const role = card.dataset.role;
                userRoleInput.value = role;

                if (role === 'farmer') farmerFields.classList.add('active');
                if (role === 'distributor') distributorFields.classList.add('active');
                if (role === 'retailer') retailerFields.classList.add('active');

            } else {
                clearRoleInputs();
            }
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    function clearRoleInputs() {
        [farmerFields, distributorFields, retailerFields].forEach(section => {
            if (!section) return;
            const inputs = section.querySelectorAll('input, select, textarea');
            inputs.forEach(i => {
                if (i.type === 'checkbox' || i.type === 'radio') i.checked = false;
                else i.value = '';
            });
        });
    }

    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        const score = passwordScore(val);
        passwordStrengthBar.className = 'password-strength-bar'; 
        if (score < 2) passwordStrengthBar.classList.add('weak');
        else if (score === 2) passwordStrengthBar.classList.add('medium');
        else passwordStrengthBar.classList.add('strong');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAlert();

        const role = userRoleInput.value;
        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const usernameInputValue = (usernameField && usernameField.value) ? usernameField.value.trim() : '';

        if (!role) return showAlert('Vui lòng chọn vai trò', 'error');
        if (!fullName) return showAlert('Họ và tên không được trống', 'error');
        if (!phone) return showAlert('Số điện thoại không được trống', 'error');
        if (!validateEmail(email)) return showAlert('Email không hợp lệ', 'error');
        if (password.length < 8) return showAlert('Mật khẩu tối thiểu 8 ký tự', 'error');
        if (password !== confirmPassword) return showAlert('Mật khẩu và xác nhận không khớp', 'error');

        // Load current users from localStorage
        let users = loadUsers();

        let username = usernameInputValue || generateUsername(role, fullName, users);

        // Check username uniqueness
        if (usernameInputValue && userExists(role, username)) {
            return showAlert('Tên tài khoản đã tồn tại, vui lòng chọn tên khác', 'error');
        }

        // Check email uniqueness per role
        if (emailExists(email, role)) {
            return showAlert('Email này đã được đăng ký cho vai trò đã chọn', 'error');
        }

        // Build account object
        const account = {
            id: Date.now(),
            role,
            username,
            fullName,
            phone,
            email,
            password, // plaintext only for dev/demo; never do this in production
            createdAt: new Date().toISOString()
        };

        // Attach role-specific fields
        if (role === 'farmer') {
            account.farmName = document.getElementById('farmName').value.trim();
            account.farmArea = document.getElementById('farmArea').value;
            account.cropType = document.getElementById('cropType').value;
            account.certification = document.getElementById('certification').value;
        } else if (role === 'distributor') {
            account.companyName = document.getElementById('companyName').value.trim();
            account.taxCode = document.getElementById('taxCode').value.trim();
            account.vehicleCount = document.getElementById('vehicleCount').value;
            account.serviceArea = document.getElementById('serviceArea').value.trim();
        } else if (role === 'retailer') {
            account.storeName = document.getElementById('storeName').value.trim();
            account.businessType = document.getElementById('businessType').value;
            account.businessLicense = document.getElementById('businessLicense').value.trim();
            account.storeSize = document.getElementById('storeSize').value;
        }

        // Add new account to users array and save
        users.push(account);
        saveUsers(users);

        showAlert('Đăng ký thành công', 'success');
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'Dangnhap.html';
        }, 2000);
    });

    function showAlert(msg, type = 'info') {
        registerAlert.className = `alert ${type} show`;
        registerAlert.textContent = msg;
        
        // Scroll alert into view smoothly
        registerAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // For success messages, redirect after delay
        if (type === 'success') {
            submitBtn.disabled = true;
            setTimeout(() => {
                window.location.href = 'Dangnhap.html';
            }, 2000);
        } else {
            // Auto hide non-success alerts after 6s
            setTimeout(() => clearAlert(), 6000);
        }
    }

    function clearAlert() {
        registerAlert.className = 'alert';
        registerAlert.textContent = '';
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function passwordScore(pw) {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
        if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++; 
        return score; // 0..3
    }

    function slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^\w\-]+/g, '')
            .replace(/\_\_+/g, '_')
            .replace(/^_+|_+$/g, '');
    }

    function generateUsername(role, fullName, existingUsers) {
        const base = `${role}_${slugify(fullName.split(' ')[0] || fullName)}`.slice(0, 20);
        let username = base;
        let i = 1;
        const exists = () => existingUsers.some(u => u.username === username);
        while (exists()) {
            username = `${base}${i}`;
            i++;
        }
        return username;
    }

});