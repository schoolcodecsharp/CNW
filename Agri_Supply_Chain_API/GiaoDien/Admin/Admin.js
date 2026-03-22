// ========== TỔNG HỢP DỮ LIỆU TỪ TẤT CẢ ỨNG DỤNG ========== 
const getAll = k => { try { return JSON.parse(localStorage.getItem(k)||'[]'); } catch(e){ return []; } };
const getAllUsers = () => [...getAll('users'),...getAll('dailyAgencies'),...getAll('sieuthiAgencies')];
const getAllBatches = () => getAll('lohang');
const getAllOrders = () => [...getAll('market_orders'),...getAll('retail_orders')];

// ========== HIỂN THỊ DỮ LIỆU LÊN GIAO DIỆN ADMIN ========== 
function renderAdminUsers() {
    const users = getAllUsers(), tb = document.getElementById('table-admin-users');
    if (!tb) return;
    tb.innerHTML = users.map(u=>`<tr><td>${u.id||u.maDaiLy||u.maNong||''}</td><td>${u.fullName||u.tenDaiLy||u.tenNong||u.username||''}</td><td>${u.role||u.loai||''}</td></tr>`).join('');
}
function renderAdminBatches() {
    const batches = getAllBatches(), tb = document.getElementById('table-admin-batches');
    if (!tb) return;
    tb.innerHTML = batches.map(b=>`<tr><td>${b.maLo}</td><td>${b.sanPham}</td><td>${b.soLuong}</td><td>${b.ngayTao||''}</td></tr>`).join('');
}
function renderAdminOrders() {
    const orders = getAllOrders(), tb = document.getElementById('table-admin-orders');
    if (!tb) return;
    tb.innerHTML = orders.map(o=>`<tr><td>${o.maPhieu||o.uid||''}</td><td>${o.maLo||''}</td><td>${o.sanPham||''}</td><td>${o.soLuong||''}</td><td>${o.status||''}</td></tr>`).join('');
}

// Gọi các hàm render khi chuyển tab giao diện
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-section="users"]')?.addEventListener('click', renderAdminUsers);
    document.querySelector('[data-section="batches"]')?.addEventListener('click', renderAdminBatches);
    document.querySelector('[data-section="orders"]')?.addEventListener('click', renderAdminOrders);
});
// ========== KHỞI TẠO & HÀM HỖ TRỢ ========== 
let currentUser = null;

function loadCurrentUser() {
    let currentUser = null;
    
    if (typeof AuthHelper !== 'undefined') {
        currentUser = AuthHelper.getCurrentUser();
    } else {
        const stored = sessionStorage.getItem('currentUser');
        currentUser = stored ? JSON.parse(stored) : null;
    }
    
    if (!currentUser) {
        window.location.href = '../Dangnhap/Dangnhap.html';
        return null;
    }
    currentUser = JSON.parse(stored);
    return currentUser;
}

// Cơ sở dữ liệu toàn cục cho Admin (tập trung, không chia theo từng người dùng)
const DB = {
    users: [],
    farms: [],
    batches: [],
    orders: [],
    logs: []
};

function loadDB() {
    DB.users = JSON.parse(localStorage.getItem('admin_users') || '[]');
    DB.farms = JSON.parse(localStorage.getItem('admin_farms') || '[]');
    DB.batches = JSON.parse(localStorage.getItem('admin_batches') || '[]');
    DB.orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    DB.logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
}

function saveDB() {
    localStorage.setItem('admin_users', JSON.stringify(DB.users));
    localStorage.setItem('admin_farms', JSON.stringify(DB.farms));
    localStorage.setItem('admin_batches', JSON.stringify(DB.batches));
    localStorage.setItem('admin_orders', JSON.stringify(DB.orders));
    localStorage.setItem('admin_logs', JSON.stringify(DB.logs));
}

// ========== ĐIỀU HƯỚNG GIAO DIỆN ========== 
document.addEventListener('DOMContentLoaded', () => {
    loadCurrentUser();
    loadDB();

    // --- Đồng bộ dữ liệu từ các vai trò vào DB admin ---
    // Lấy danh sách người dùng từ localStorage của các vai trò
    try {
        const nd = JSON.parse(localStorage.getItem('users') || '[]');
        const dl = JSON.parse(localStorage.getItem('dailyAgencies') || '[]');
        const st = JSON.parse(localStorage.getItem('sieuthiAgencies') || '[]');
        DB.users = [...nd, ...dl, ...st];
    } catch(e){}
    // Lấy danh sách lô hàng (batches)
    try {
        DB.batches = JSON.parse(localStorage.getItem('lohang') || '[]');
    } catch(e){}
    // Lấy danh sách đơn hàng (orders)
    try {
        const marketOrders = JSON.parse(localStorage.getItem('market_orders') || '[]');
        const retailOrders = JSON.parse(localStorage.getItem('retail_orders') || '[]');
        DB.orders = [...marketOrders, ...retailOrders];
    } catch(e){}
    // Lưu lại dữ liệu vào localStorage của admin
    saveDB();

    // Hiển thị thông tin người dùng hiện tại
    if (currentUser?.fullName) {
        const userDisplay = document.getElementById('current-user');
        if (userDisplay) {
            userDisplay.textContent = currentUser.fullName;
            userDisplay.style.cursor = 'pointer';
            userDisplay.title = 'Xem thông tin cá nhân';
            userDisplay.addEventListener('click', function() {
                // Dữ liệu mẫu cho admin
                const fakeUser = {
                    fullName: 'Admin Hệ thống',
                    username: 'adminsys',
                    email: 'admin@nongnghiep.vn',
                    phone: '0999 888 777',
                    role: 'Admin',
                    createdAt: '2025-09-01T08:00:00',
                    id: 'AD0001'
                };
                const avatar = `<div style=\"display:flex;justify-content:center;align-items:center;margin-bottom:16px;\"><div style=\"background:linear-gradient(135deg,#4caf50,#388e3c);width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px #0002;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"44\" height=\"44\" viewBox=\"0 0 24 24\" fill=\"#fff\"><path d=\"M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z\"/></svg></div></div>`;
                const infoTable = `
                    <table style=\"width:100%;border-collapse:separate;border-spacing:0 12px 0 18px;font-size:16px;\">
                        <colgroup><col style=\"width:180px;\"><col style=\"width:auto;\"></colgroup>
                        <tr><td style=\"color:#888;padding-right:32px;\">Họ tên</td><td style=\"font-weight:600;\">${fakeUser.fullName}</td></tr>
                        <tr><td style=\"color:#888;padding-right:32px;\">Tên đăng nhập</td><td>${fakeUser.username}</td></tr>
                        <tr><td style=\"color:#888;padding-right:32px;\">Email</td><td>${fakeUser.email}</td></tr>
                        <tr><td style=\"color:#888;padding-right:32px;\">Số điện thoại</td><td>${fakeUser.phone}</td></tr>
                        <tr><td style=\"color:#888;padding-right:32px;\">Vai trò</td><td>${fakeUser.role}</td></tr>
                        <tr><td style=\"color:#888;padding-right:32px;\">Ngày tạo tài khoản</td><td>${new Date(fakeUser.createdAt).toLocaleString('vi-VN')}</td></tr>
                        <tr><td style=\"color:#888;padding-right:32px;\">ID người dùng</td><td>${fakeUser.id}</td></tr>
                    </table>`;
                showUserInfoModal(`
                    ${avatar}
                    <div style=\"margin-bottom:12px;text-align:center;font-size:18px;font-weight:600;color:#388e3c;letter-spacing:0.5px;\">Thông tin cá nhân</div>
                    <div style=\"padding:0 8px 8px 8px;\">${infoTable}</div>
                `);
            });
        }
    }
        // Modal hiển thị thông tin người dùng
        function showUserInfoModal(html) {
            let modal = document.getElementById('modal-user-info');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'modal-user-info';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.background = 'rgba(0,0,0,0.3)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '9999';
                document.body.appendChild(modal);
            }
            modal.innerHTML = `<div style=\"background:#fff;padding:24px 32px;border-radius:8px;min-width:260px;max-width:90vw;box-shadow:0 2px 16px #0002;position:relative;\">\n            <button id=\"close-user-info-modal\" style=\"position:absolute;top:8px;right:12px;font-size:20px;background:none;border:none;cursor:pointer;\">&times;</button>\n            <h3 style=\"margin-top:0\">Thông tin cá nhân</h3>\n            <div style=\"margin:12px 0 0 0;font-size:16px;\">${html}</div>\n        </div>`;
            modal.style.display = 'flex';
            document.getElementById('close-user-info-modal').onclick = () => { modal.style.display = 'none'; };
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
        }
    // Hiển thị vai trò hiện tại (dạng thân thiện)
    if (currentUser?.role) {
        const roleDisplay = document.getElementById('current-role');
        if (roleDisplay) roleDisplay.textContent = (currentUser.role || '').toString().replace(/(^|_)([a-z])/g, (_, a, b) => b ? b.toUpperCase() : '').replace(/_/g, ' ');
    }

    const links = document.querySelectorAll('.menu-link');
    const pages = document.querySelectorAll('.page');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    function showSection(id) {
        pages.forEach(p => p.classList.toggle('active-page', p.id === id));
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
    }

    function currentHash() { return (location.hash || '').replace(/^#/, '') || 'dashboard'; }
    showSection(currentHash());
    window.addEventListener('hashchange', () => showSection(currentHash()));

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const s = link.dataset.section;
            if (!s) return;
            e.preventDefault();
            location.hash = s;
        });
    });

    // Nhấn logo sẽ về trang tổng quan (dashboard)
    document.querySelectorAll('.logo').forEach(l => l.addEventListener('click', (e) => { e.preventDefault(); location.hash = 'dashboard'; }));

    // Nhấn nút tạo báo cáo mới sẽ chuyển sang tab báo cáo
    document.getElementById('btn-new-report')?.addEventListener('click', () => { location.hash = 'reports'; });

    // ========== HỖ TRỢ MODAL ========== 
    function openModal(templateId) {
        const tpl = document.getElementById(templateId);
        if (!tpl) return;
        modalBody.innerHTML = '';
        modalBody.appendChild(tpl.content.cloneNode(true));
        modal.classList.remove('hidden');
        
        modalBody.querySelectorAll('.modal-close-btn').forEach(b => {
            b.addEventListener('click', closeModal);
        });
        modalBody.querySelectorAll('.modal-close').forEach(b => {
            b.addEventListener('click', closeModal);
        });
        
        modalBody.querySelectorAll('form').forEach(f => {
            f.addEventListener('submit', (ev) => {
                ev.preventDefault();
                const formId = f.id || templateId;
                handleFormSubmit(formId, new FormData(f));
                closeModal();
            });
        });
    }

    function closeModal() {
        modal.classList.add('hidden');
        modalBody.innerHTML = '';
    }

    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // ========== XỬ LÝ GỬI FORM ========== 
    function handleFormSubmit(formId, formData) {
        const data = Object.fromEntries(formData);
        
        if (formId.includes('user')) {
            addUser(data);
        } else if (formId.includes('farm')) {
            addFarm(data);
        }
        
        refreshAll();
    }

    // ========== CÁC HÀNH ĐỘNG DỮ LIỆU ========== 
    function addUser(data) {
        const user = {
            id: 'user_' + Date.now(),
            hoTen: data.hoTen,
            role: data.role,
            email: data.email || ''
        };
        DB.users.push(user);
        saveDB();
    }

    function addFarm(data) {
        const farm = {
            id: 'F' + (DB.farms.length + 1),
            ten: data.ten,
            chu: data.chu,
            diachi: data.diachi || ''
        };
        DB.farms.push(farm);
        saveDB();
    }

    function deleteFarm(farmId) {
        DB.farms = DB.farms.filter(f => f.id !== farmId);
        saveDB();
        renderFarms();
    }

    function deleteUser(userId) {
        DB.users = DB.users.filter(u => u.id !== userId);
        saveDB();
        renderUsers();
    }

    function deleteOrder(orderId) {
        DB.orders = DB.orders.filter(o => o.id !== orderId);
        saveDB();
        renderOrders();
    }

    // ========== CÁC HÀM HIỂN THỊ ========== 
    function renderKPIs() {
        document.getElementById('kpi-total-users').textContent = DB.users.length;
        document.getElementById('kpi-total-farms').textContent = DB.farms.length;
        document.getElementById('kpi-total-batches').textContent = DB.batches.length;
        document.getElementById('kpi-total-orders').textContent = DB.orders.length;
    }

    function renderUsers() {
        const tbody = document.querySelector('#table-admin-users tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        DB.users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${u.id}</td><td>${u.hoTen}</td><td>${u.role}</td><td>${u.email}</td>
                <td><button class="btn small btn-danger" onclick="deleteUser('${u.id}')">Xóa</button></td>`;
            tbody.appendChild(tr);
        });
    }

    function renderFarms() {
        const tbody = document.querySelector('#table-farms tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        DB.farms.forEach(f => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${f.id}</td><td>${f.ten}</td><td>${f.chu}</td><td>${f.diachi}</td>
                <td><button class="btn small btn-danger" onclick="deleteFarm('${f.id}')">Xóa</button></td>`;
            tbody.appendChild(tr);
        });
    }

    function renderBatches() {
        const tbody = document.querySelector('#table-batches tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        DB.batches.forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${b.ma}</td><td>${b.sanPham}</td><td>${b.soLuong}</td><td>${b.ngay}</td><td></td>`;
            tbody.appendChild(tr);
        });
    }

    function renderOrders() {
        const tbody = document.querySelector('#table-orders tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        DB.orders.forEach(o => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${o.ma}</td><td>${o.nguoi}</td><td>${o.daily}</td><td>${o.soLuong}</td><td>${o.trangThai}</td>
                <td><button class="btn small btn-danger" onclick="deleteOrder('${o.ma}')">Xóa</button></td>`;
            tbody.appendChild(tr);
        });
    }

    function renderLogs() {
        const tbody = document.querySelector('#table-logs tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        DB.logs.slice().reverse().slice(0, 20).forEach(log => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${log.time}</td><td>${log.user}</td><td>${log.action}</td>`;
            tbody.appendChild(tr);
        });
    }

    function refreshAll() {
        renderKPIs();
        renderUsers();
        renderFarms();
        renderBatches();
        renderOrders();
        renderLogs();
    }

    // ========== XỬ LÝ SỰ KIỆN NÚT BẤM ========== 
    document.getElementById('btn-add-admin-user')?.addEventListener('click', () => openModal('add-user-template'));
    document.getElementById('btn-add-farm')?.addEventListener('click', () => openModal('add-farm-template'));
    
    document.getElementById('btn-seed-data')?.addEventListener('click', () => {
        DB.users = [
            { id: 'admin1', hoTen: 'Quản trị viên', role: 'admin', email: 'admin@example.com' },
            { id: 'nd1', hoTen: 'Nguyễn Nông Dân', role: 'nongdan', email: 'nd1@example.com' },
            { id: 'dl1', hoTen: 'Trần Đại Lý', role: 'daily', email: 'dl1@example.com' }
        ];
        DB.farms = [
            { id: 'F1', ten: 'Trang trại A', chu: 'Nguyễn Nông Dân', diachi: 'Hà Nội' },
            { id: 'F2', ten: 'Trang trại B', chu: 'Nguyễn Nông Dân', diachi: 'Hải Phòng' }
        ];
        DB.batches = [
            { ma: 'L001', sanPham: 'Lúa gạo', soLuong: 1000, ngay: '2025-10-01' },
            { ma: 'L002', sanPham: 'Khoai tây', soLuong: 500, ngay: '2025-10-05' }
        ];
        DB.orders = [
            { ma: 'O001', nguoi: 'Khách', daily: 'DL1', soLuong: 100, trangThai: 'Đã giao' }
        ];
        saveDB();
        refreshAll();
    });

    // ========== HIỂN THỊ BAN ĐẦU ========== 
    refreshAll();

    // Đưa các hàm ra global để gọi từ HTML (onclick)
    window.deleteFarm = deleteFarm;
    window.deleteUser = deleteUser;
    window.deleteOrder = deleteOrder;
});

