// ========== QUÊN MẬT KHẨU ==========
function loadUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');
    const alertBox = document.getElementById('resetAlert');

    if (!resetForm) return;

    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const role = document.getElementById('resetRole').value;
        const email = document.getElementById('resetEmail').value.trim().toLowerCase();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!role) {
            showAlert('Vui lòng chọn loại tài khoản', 'error');
            return;
        }

        if (!email) {
            showAlert('Vui lòng nhập email', 'error');
            return;
        }

        if (!newPassword || !confirmPassword) {
            showAlert('Vui lòng nhập mật khẩu mới', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert('Mật khẩu xác nhận không khớp', 'error');
            return;
        }

        if (newPassword.length < 3) {
            showAlert('Mật khẩu phải có ít nhất 3 ký tự', 'error');
            return;
        }

        // Tìm user theo email
        const users = loadUsers();
        const userIndex = users.findIndex(u => u.role === role && u.email === email);

        if (userIndex === -1) {
            showAlert('Email không tìm thấy trong hệ thống', 'error');
            return;
        }

        // Cập nhật mật khẩu
        users[userIndex].password = newPassword;
        saveUsers(users);

        showAlert('Đặt lại mật khẩu thành công! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'Dangnhap.html';
        }, 1500);
    });

    function showAlert(message, type) {
        if (!alertBox) return;
        alertBox.className = `alert ${type} show`;
        alertBox.textContent = message;

        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 5000);
    }
});
