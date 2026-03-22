// ========== SHARED AUTH HELPERS ==========
// File này được sử dụng bởi tất cả các trang để quản lý session

const AuthHelper = {
    // Lưu người dùng vào sessionStorage
    setCurrentUser: function(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    },

    // Lấy người dùng từ sessionStorage
    getCurrentUser: function() {
        const stored = sessionStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    },

    // Kiểm tra người dùng đã đăng nhập
    isLoggedIn: function() {
        return this.getCurrentUser() !== null;
    },

    // Đăng xuất
    logout: function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = '../Dangnhap/Dangnhap.html';
    },

    // Redirect nếu chưa đăng nhập
    requireLogin: function() {
        if (!this.isLoggedIn()) {
            window.location.href = '../Dangnhap/Dangnhap.html';
        }
    },

    // Lấy thư mục gốc dựa trên vai trò
    getHomeFolder: function(role) {
        const redirects = {
            'admin': '../Admin/Admin.html',
            'nongdan': '../Nongdan/Nongdan.html',
            'daily': '../Daily/Daily.html',
            'sieuthi': '../Sieuthi/Sieuthi.html'
        };
        return redirects[role] || '../Trangchu/index.html';
    }
};
