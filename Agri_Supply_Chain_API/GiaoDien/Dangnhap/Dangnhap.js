// ========== ĐĂNG NHẬP - KẾT NỐI API ==========

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginAlert = document.getElementById('loginAlert');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const accountType = document.getElementById('accountType').value;
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        if (!accountType) {
            showAlert('Vui lòng chọn loại tài khoản', 'error');
            return;
        }

        // Gọi API login
        login(username, password, accountType);
    });

    function login(username, password, accountType) {
        // Tạo FormData để gửi
        var formData = new FormData();
        formData.append('TenDangNhap', username);
        formData.append('MatKhau', password);

        fetch(current_url + '/api/login', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            // Kiểm tra loại tài khoản có khớp không
            if (data.LoaiTaiKhoan !== accountType) {
                showAlert('Loại tài khoản không đúng!', 'error');
                return;
            }

            // Lưu thông tin user vào localStorage
            var userInfo = {
                MaTaiKhoan: data.MaTaiKhoan,
                TenDangNhap: data.TenDangNhap,
                LoaiTaiKhoan: data.LoaiTaiKhoan,
                Token: data.Token
            };
            localStorage.setItem('currentUser', JSON.stringify(userInfo));
            sessionStorage.setItem('currentUser', JSON.stringify(userInfo));

            showAlert('Đăng nhập thành công!', 'success');

            // Redirect theo loại tài khoản
            setTimeout(() => {
                var redirectUrl = getRedirectUrl(accountType);
                window.location.href = redirectUrl;
            }, 1000);
        })
        .catch(error => {
            console.error('Login error:', error);
            var msg = error.error || 'Tên đăng nhập hoặc mật khẩu không đúng!';
            showAlert(msg, 'error');
        });
    }

    function getRedirectUrl(accountType) {
        var redirects = {
            admin: '../Admin/Admin.html',
            nongdan: '../Nongdan/Nongdan.html',
            daily: '../Daily/Daily.html',
            sieuthi: '../Sieuthi/Sieuthi.html'
        };
        return redirects[accountType] || '../Trangchu/index.html';
    }

    function showAlert(message, type) {
        loginAlert.className = 'alert ' + type + ' show';
        loginAlert.textContent = message;
        
        setTimeout(() => {
            loginAlert.classList.remove('show');
        }, 5000);
    }
});
