var current_url = "http://localhost:5041";

// API Endpoints
var API = {
    // Auth
    login: current_url + "/api/login",
    
    // Nông Dân Service
    nongdan: {
        getAll: current_url + "/api-nongdan/nong-dan/get-all",
        getById: function(id) { return current_url + "/api-nongdan/nong-dan/" + id; },
        create: current_url + "/api-nongdan/nong-dan/create",
        update: function(id) { return current_url + "/api-nongdan/nong-dan/update/" + id; },
        delete: function(id) { return current_url + "/api-nongdan/nong-dan/delete/" + id; }
    },
    
    // Đại Lý Service
    daily: {
        getAll: current_url + "/api-daily/dai-ly/get-all",
        getById: function(id) { return current_url + "/api-daily/dai-ly/" + id; },
        create: current_url + "/api-daily/dai-ly/create",
        update: function(id) { return current_url + "/api-daily/dai-ly/update/" + id; },
        delete: function(id) { return current_url + "/api-daily/dai-ly/delete/" + id; },
        search: current_url + "/api-daily/dai-ly/search"
    },
    
    // Kho (Đại Lý)
    kho: {
        getAll: current_url + "/api-daily/kho/get-all",
        getById: function(id) { return current_url + "/api-daily/kho/" + id; },
        getByMaDaiLy: function(id) { return current_url + "/api-daily/kho/dai-ly/" + id; },
        create: current_url + "/api-daily/kho/create",
        update: function(id) { return current_url + "/api-daily/kho/update/" + id; },
        delete: function(id) { return current_url + "/api-daily/kho/delete/" + id; }
    },
    
    // Kiểm Định (Đại Lý)
    kiemdinh: {
        getAll: current_url + "/api-daily/kiem-dinh/get-all",
        getById: function(id) { return current_url + "/api-daily/kiem-dinh/" + id; },
        getByMaDaiLy: function(id) { return current_url + "/api-daily/kiem-dinh/dai-ly/" + id; },
        create: current_url + "/api-daily/kiem-dinh/create",
        update: function(id) { return current_url + "/api-daily/kiem-dinh/update/" + id; },
        delete: function(id) { return current_url + "/api-daily/kiem-dinh/delete/" + id; }
    },
    
    // Đơn Hàng Đại Lý (Mua từ Nông Dân)
    donHangDaiLy: {
        getAll: current_url + "/api-daily/don-hang-dai-ly/get-all",
        getById: function(id) { return current_url + "/api-daily/don-hang-dai-ly/" + id; },
        getByMaDaiLy: function(id) { return current_url + "/api-daily/don-hang-dai-ly/dai-ly/" + id; },
        create: current_url + "/api-daily/don-hang-dai-ly/create",
        updateTrangThai: function(id) { return current_url + "/api-daily/don-hang-dai-ly/update-trang-thai/" + id; },
        delete: function(id) { return current_url + "/api-daily/don-hang-dai-ly/delete/" + id; }
    },

    // Đơn Hàng Siêu Thị (view từ Đại Lý)
    donHangSieuThiDaily: {
        getByMaDaiLy: function(id) { return current_url + "/api-daily/don-hang-sieu-thi/dai-ly/" + id; },
        getById: function(id) { return current_url + "/api-daily/don-hang-sieu-thi/" + id; },
        updateTrangThai: function(id) { return current_url + "/api-daily/don-hang-sieu-thi/update-trang-thai/" + id; }
    },
    
    // Siêu Thị Service
    sieuthi: {
        getAll: current_url + "/api-sieuthi/sieu-thi/get-all",
        getById: function(id) { return current_url + "/api-sieuthi/sieu-thi/" + id; },
        create: current_url + "/api-sieuthi/sieu-thi/create",
        update: function(id) { return current_url + "/api-sieuthi/sieu-thi/update/" + id; },
        delete: function(id) { return current_url + "/api-sieuthi/sieu-thi/delete/" + id; }
    },
    
    // Admin Service
    admin: {
        getAll: current_url + "/api-admin/admin/get-all",
        getById: function(id) { return current_url + "/api-admin/admin/" + id; },
        create: current_url + "/api-admin/admin/create",
        update: function(id) { return current_url + "/api-admin/admin/update/" + id; },
        delete: function(id) { return current_url + "/api-admin/admin/delete/" + id; }
    }
};

// Helper function để inject script
function makeScript(url) {
    var script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('type', 'text/javascript');
    var mainDiv = document.getElementById('mainDiv');
    if (mainDiv) {
        mainDiv.appendChild(script);
    } else {
        document.body.appendChild(script);
    }
}

// Helper function để lấy token từ sessionStorage
function getToken() {
    var user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    return user.token || '';
}

// Helper function để tạo headers với token
function getAuthHeaders() {
    return {
        'Authorization': 'Bearer ' + getToken(),
        'Content-Type': 'application/json'
    };
}
