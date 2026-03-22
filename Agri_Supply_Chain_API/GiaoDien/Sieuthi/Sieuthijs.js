
// ====== SIÊU THỊ - QUẢN LÝ ĐƠN HÀNG, KHO, KIỂM ĐỊNH ======
let currentUser = null;
const get = (k, u = currentUser) => u ? JSON.parse(localStorage.getItem(`user_${u.id}_${k}`) || '[]') : [];
const set = (k, v, u = currentUser) => u && localStorage.setItem(`user_${u.id}_${k}`, JSON.stringify(v));
function loadCurrentUser() {
  let s = null;
  
  if (typeof AuthHelper !== 'undefined') {
    currentUser = AuthHelper.getCurrentUser();
  } else {
    s = sessionStorage.getItem('currentUser');
    currentUser = s ? JSON.parse(s) : null;
  }
  
  if (!currentUser) {
    window.location.href = '../Dangnhap/Dangnhap.html';
  }
  
  return currentUser;
}
const DB = { orders: get('orders'), kho: get('kho'), lohang: get('lohang'), kiemDinh: get('kiemDinh') };
function loadDB() { ['orders','kho','lohang','kiemDinh'].forEach(k=>DB[k]=get(k)); }
function saveDB() { ['orders','kho','lohang','kiemDinh'].forEach(k=>set(k,DB[k]||[])); }
// Lấy hoặc tạo modal (nếu chưa có trong HTML thì tự động tạo)
let modal = document.getElementById('modal'), modalBody = document.getElementById('modal-body');
if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal hidden';
    modal.innerHTML = '<div class="modal-content"><span class="modal-close">&times;</span><div id="modal-body"></div></div>';
    document.body.appendChild(modal);
    modalBody = document.getElementById('modal-body');
}

// Hàm hiển thị bảng dữ liệu động
function renderTable(sel, data, fn) {
    const tb = document.querySelector(sel + ' tbody');
    if (!tb) return;
    tb.innerHTML = data.map((r,i)=>`<tr>${fn(r,i)}</tr>`).join('');
}

// Gọi tất cả hàm render giao diện chính
function renderAll() {
    [renderOrders,renderIncoming,renderInventory,renderReports,renderDashboard].forEach(f=>f());
}

// Hiển thị dashboard tổng quan (KPI, đơn hàng gần nhất)
function renderDashboard() {
    const totalOrders = (DB.orders||[]).length, totalReceived = (DB.lohang||[]).reduce((s,b)=>s+(+b.soLuong||0),0),
        qualityAlerts = (DB.kiemDinh||[]).filter(k=>/kh(ô|o)ng|fail|chua/i.test(k.ketQua||'')).length;
    [['kpi-orders',totalOrders],['kpi-received',totalReceived],['kpi-stock',totalReceived],['kpi-quality',qualityAlerts]].forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=v});
    const tb=document.querySelector('#table-orders tbody');
    if(tb)tb.innerHTML=(DB.orders||[]).slice(-10).reverse().map(o=>`<tr><td>${o.maPhieu||o.uid||o.id||''}</td><td>${o.maLo||''} — ${o.sanPham||''}</td><td>${o.soLuong||o.quantity||0}</td><td>${o.toDaily||o.toDailyAgency||o.to||''}</td><td>${o.ngayTao||o.ngayNhap||o.date||''}</td><td>${o.status||''}</td></tr>`).join('');
}

// Hiển thị danh sách đơn hàng
function renderOrders() {
    renderTable('#table-orders-all', DB.orders||[], o => `
        <td>${o.maPhieu}</td><td>${o.maLo||''}</td><td>${o.sanPham}</td><td>${o.soLuong}</td><td>${o.toDaily||o.toDailyAgency||''}</td><td>${o.ngayTao||''}</td><td>${o.status||''}</td>
        <td><button class="btn small" onclick="editOrder('${o.uid}')">Sửa</button><button class="btn small btn-danger" onclick="deleteOrder('${o.uid}')">Xóa</button></td>`);
}
// Sửa đơn hàng
window.editOrder = uid => {
    const o = (DB.orders||[]).find(x=>x.uid===uid);
    if (!o) return;
    openModal(`<h3>Sửa đơn hàng</h3>
        <label>Mã lô</label><input id="edit-maLo" value="${o.maLo}" />
        <label>Sản phẩm</label><input id="edit-sanPham" value="${o.sanPham}" />
        <label>Số lượng</label><input id="edit-soLuong" type="number" value="${o.soLuong}" />
        <label>Kho nhận</label><input id="edit-kho" value="${o.khoNhap||''}" />
        <div style="margin-top:8px"><button onclick="saveOrder('${uid}')">Lưu</button><button onclick="closeModal()">Hủy</button></div>`);
};
// Lưu đơn hàng sau khi sửa
window.saveOrder = uid => {
    const o = (DB.orders||[]).find(x=>x.uid===uid);
    if (!o) return;
    o.maLo = document.getElementById('edit-maLo').value;
    o.sanPham = document.getElementById('edit-sanPham').value;
    o.soLuong = +document.getElementById('edit-soLuong').value||0;
    o.khoNhap = document.getElementById('edit-kho').value;
    saveDB(); renderAll(); closeModal();
};
// Xóa đơn hàng
window.deleteOrder = uid => {
    if (!confirm('Xóa đơn hàng này?')) return;
    DB.orders = (DB.orders||[]).filter(x=>x.uid!==uid);
    saveDB(); renderAll();
};



// Hiển thị các đơn hàng nhập về từ Siêu thị
function renderIncoming() {
    try {
        const all = JSON.parse(localStorage.getItem('retail_orders')||'[]')||[],
            mine = all.filter(m=>String(m.fromSieuthiId)===String(currentUser?.id)&&String(m.status).toLowerCase()==='shipped');
        renderTable('#table-incoming', mine, m=>`
            <td>${m.maPhieu}</td><td>${m.maLo} — ${m.sanPham||''}</td><td>${m.soLuong}</td><td>${m.toDaily||m.toDailyAgency||m.toSieuthi||''}</td><td>${m.ngayTao||''}</td><td>${m.status||''}</td>
            <td>${m.status==='shipped'?`<button class=\"btn-edit\" onclick=\"markRetailOrderReceived('${m.uid}')\">Đã nhận</button>`:''}</td>`);
    } catch(e){console.warn(e);}
}

// Đánh dấu đã nhận đơn hàng bán lẻ
function markRetailOrderReceived(uid) {
    const all = JSON.parse(localStorage.getItem('retail_orders') || '[]');
    const idx = all.findIndex(x => x.uid === uid);
    if (idx === -1) return;
    all[idx].status = 'received';
    localStorage.setItem('retail_orders', JSON.stringify(all));
    const p = all[idx];
    DB.lohang = DB.lohang || [];
    DB.lohang.push({ maLo: p.maLo, sanPham: p.sanPham, soLuong: parseFloat(p.soLuong)||0, ngayTao: new Date().toLocaleString() });
    saveDB();
    renderAll();
}

// Hủy đơn hàng
function cancelOrder(uid) {
    DB.orders = DB.orders || [];
    const idx = DB.orders.findIndex(o => o.uid === uid);
    if (idx !== -1) { DB.orders.splice(idx,1); saveDB(); }
    const all = JSON.parse(localStorage.getItem('retail_orders') || '[]');
    const idx2 = all.findIndex(a => a.uid === uid);
    if (idx2 !== -1) { all.splice(idx2,1); localStorage.setItem('retail_orders', JSON.stringify(all)); }
    renderAll();
}

// Hiển thị báo cáo thống kê
function renderReports() {
    const totalOrders = (DB.orders||[]).length,
        stock = (DB.lohang||[]).reduce((s,b)=>s+(+b.soLuong||0),0);
    [['report-production',totalOrders+' đơn'],['report-stock',stock+' sản phẩm'],['report-received',''],['report-quality','']].forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=v});
}

// Hiển thị tồn kho
function renderInventory() {
  renderTable('#table-inventory', DB.lohang||[], b=>`
    <td>${b.maLo}</td><td>${b.sanPham||''}</td><td>${b.soLuong||0}</td><td>${b.ngayTao||''}</td>
    <td><button class="btn-edit" onclick="editBatch('${b.maLo}')">Sửa</button><button class="btn-delete" onclick="deleteBatch('${b.maLo}')">Xóa</button></td>`);
}



// ====== MODAL: MỞ VÀ ĐÓNG POPUP ======
const openModal = html => { modalBody.innerHTML = html; modal.classList.remove('hidden'); };
const closeModal = () => { modal.classList.add('hidden'); modalBody.innerHTML = ''; };
document.querySelector('.modal-close')?.addEventListener('click', closeModal);
modal.addEventListener('click', e => e.target === modal && closeModal());

// Modal tạo phiếu kiểm định chất lượng
document.getElementById('btn-create-quality')?.addEventListener('click', ()=>{
    openModal(`<h3>Thêm phiếu kiểm định</h3>
        <label>Mã kiểm định</label><input id="q_ma" />
        <label>Mã lô</label><input id="q_lo" />
        <label>Ngày kiểm</label><input id="q_ngay" type="date" />
        <label>Người kiểm</label><input id="q_nguoi" />
        <label>Kết quả</label><select id="q_ket"><option>Đạt</option><option>Không đạt</option></select>
        <label>Ghi chú</label><input id="q_gc" />
        <div style="margin-top:12px"><button onclick="addQuality()">Lưu</button><button onclick="closeModal()">Hủy</button></div>`);
});

// Thêm phiếu kiểm định mới
window.addQuality = function() {
    const $ = id => document.getElementById(id), q = {
        maKiemDinh: $('q_ma').value || 'KD'+Date.now(),
        maLo: $('q_lo').value,
        ngayKiem: $('q_ngay').value || new Date().toLocaleDateString(),
        nguoiKiem: $('q_nguoi').value,
        ketQua: $('q_ket').value,
        ghiChu: $('q_gc').value
    };
    (DB.kiemDinh=DB.kiemDinh||[]).push(q);
    saveDB(); renderReports(); closeModal();
};

// Modal tạo đơn hàng mới và xử lý
document.getElementById('btn-create-order')?.addEventListener('click', () => {
    openModal(`<h3>Đơn đặt hàng mới</h3>
        <label>Mã lô</label><input id="input-maLo" placeholder="ML..." />
        <label>Đại lý</label>
        <select id="select-daily"><option value="">-- Chọn đại lý --</option></select>
        <label>Sản phẩm</label><select id="select-sanpham"><option value="">--Chọn sản phẩm--</option></select>
        <label>Số lượng</label><input id="input-soLuong" type="number" />
        <label>Kho nhận</label><select id="select-kho"><option value="">--Chọn kho--</option></select>
        <div class="modal-actions">
            <button class="btn btn-cancel modal-close-btn" type="button" onclick="closeModal()">Hủy</button>
            <button class="btn" type="button" onclick="addPhieu()">Nhập hàng</button>
        </div>`);
    populateOrderModalSelects();
});

// Đổ dữ liệu vào các select trong modal tạo đơn hàng
function populateOrderModalSelects() {
    // Đổ danh sách sản phẩm từ lô hàng
    const sel = document.getElementById('select-sanpham');
    const skl = document.getElementById('select-kho');
    const sDaily = document.getElementById('select-daily');
    if (sel) {
        const prods = Array.from(new Set((DB.lohang||[]).map(b => b.sanPham).filter(Boolean)));
        sel.innerHTML = '<option value="">--Chọn sản phẩm--</option>' + prods.map(p=>`<option>${p}</option>`).join('');
    }
    if (skl) {
        const khs = (DB.kho||[]).map(k=>k.tenKho||k.maKho||'').filter(Boolean);
        skl.innerHTML = '<option value="">--Chọn kho--</option>' + khs.map(k=>`<option>${k}</option>`).join('');
    }

    // Đổ danh sách đại lý (ưu tiên user đã đăng ký)
    try {
        const list = JSON.parse(localStorage.getItem('dailyAgencies') || '[]') || [];
        let users = JSON.parse(localStorage.getItem('users') || '[]') || [];
        // Nếu chưa có user đăng ký, tạo dữ liệu mẫu để hiển thị
        if (!Array.isArray(users) || users.length === 0) {
            users = [
                { id: 4, role: 'daily', username: 'daily1', fullName: 'Đại lý 1', maDaiLy: 'DL001' },
                { id: 5, role: 'daily', username: 'daily2', fullName: 'Đại lý 2', maDaiLy: 'DL002' }
            ];
        }
        if (sDaily) {
            sDaily.innerHTML = '<option value="">-- Chọn đại lý --</option>';
            // Ưu tiên user có role 'daily' để hiển thị tên đầy đủ
            const dailiesFromUsers = users.filter(u => (u.role || '').toString().toLowerCase().includes('daily'));
            const usedMa = new Set();
            if (dailiesFromUsers.length) {
                sDaily.innerHTML += dailiesFromUsers.map(u => {
                    const val = u.maDaiLy || u.id;
                    usedMa.add(String(u.maDaiLy || u.id));
                    return `<option value="${val}" data-userid="${u.id}">${u.fullName || u.hoTen || u.username || u.id} (${u.maDaiLy || u.id})</option>`;
                }).join('');
            }
            // Bổ sung các đại lý từ dailyAgencies chưa có trong users
            if (Array.isArray(list) && list.length) {
                list.forEach(a => {
                    if (usedMa.has(String(a.maDaiLy))) return;
                    const uid = a.userId || '';
                    sDaily.innerHTML += `<option value="${a.maDaiLy}" data-userid="${uid}">${a.tenDaiLy || a.maDaiLy} (${a.maDaiLy})</option>`;
                });
            }
        }
    } catch (e) { console.warn('populate daily failed', e); }

    // Khi chọn đại lý, lọc sản phẩm liên quan đến đại lý đó (ưu tiên kho/phieuNhap của user, nếu không có thì lấy chung)
    if (sDaily) {
        sDaily.addEventListener('change', () => {
            const val = sDaily.value;
            let products = [];
            try {
                // Thử lấy sản phẩm từ kho/phieuNhap của user đại lý
                const opt = sDaily.options[sDaily.selectedIndex];
                const userId = opt?.dataset?.userid;
                if (userId) {
                    const k = JSON.parse(localStorage.getItem(`user_${userId}_kho`) || '[]');
                    if (Array.isArray(k) && k.length) {
                        k.forEach(kk => { if (Array.isArray(kk.items)) kk.items.forEach(it => it.sanPham && products.push(it.sanPham)); });
                    }
                    const pnh = JSON.parse(localStorage.getItem(`user_${userId}_phieuNhap`) || '[]');
                    if (Array.isArray(pnh) && pnh.length) pnh.forEach(r => r.sanPham && products.push(r.sanPham));
                }
            } catch(e){ /* ignore */ }
            // Nếu không có thì lấy từ lô hàng chung
            if (products.length === 0) {
                try { products = (JSON.parse(localStorage.getItem('lohang')||'[]')||[]).filter(l => l.sanPham).map(l=>l.sanPham); } catch(e){ products = []; }
            }
            const uniq = [...new Set(products)].filter(Boolean);
            if (sel) {
                if (uniq.length) sel.innerHTML = '<option value="">--Chọn sản phẩm--</option>' + uniq.map(p=>`<option>${p}</option>`).join('');
                else sel.innerHTML = '<option value="">-- Không có sản phẩm --</option>';
            }
        });
    }
}

// Thêm mới một phiếu nhập hàng
window.addPhieu = function() {
    const $ = id => document.getElementById(id),
        maLo = $('input-maLo')?.value, soLuong = $('input-soLuong')?.value,
        sanPham = $('select-sanpham')?.value, kho = $('select-kho')?.value,
        selDaily = $('select-daily'),
        toDailyAgency = selDaily?.value||'',
        toDailyUserId = selDaily?.selectedOptions?.[0]?.dataset?.userid||'';
    if (!maLo||!soLuong||!sanPham) return alert('Vui lòng nhập đầy đủ Mã lô, sản phẩm và số lượng');
    const uid = 'R'+Date.now(), p = { uid, maPhieu: uid, maLo, sanPham, soLuong: +soLuong||0, khoNhap: kho, toDailyAgency, toDailyUserId, toDaily: selDaily?.selectedOptions?.[0]?.text||'', fromSieuthiId: currentUser?.id, status: 'pending', ngayTao: new Date().toLocaleString() };
    (DB.orders=DB.orders||[]).push(p); saveDB();
    const retail = JSON.parse(localStorage.getItem('retail_orders')||'[]');
    retail.push({...p}); localStorage.setItem('retail_orders',JSON.stringify(retail));
    renderAll(); closeModal();
};

// Sửa lô hàng
window.editBatch = maLo => {
    const b = (DB.lohang||[]).find(x=>x.maLo===maLo);
    if (!b) return;
    openModal(`<h3>Sửa lô</h3>
        <label>Mã lô</label><input id="bl_maLo" value="${b.maLo}" />
        <label>Sản phẩm</label><input id="bl_sp" value="${b.sanPham||''}" />
        <label>Số lượng</label><input id="bl_sl" type="number" value="${b.soLuong||0}" />
        <div style="margin-top:8px"><button onclick="saveBatch('${maLo}')">Lưu</button><button onclick="closeModal()">Hủy</button></div>`);
};
// Lưu lô hàng sau khi sửa
window.saveBatch = oldMaLo => {
    const b = (DB.lohang||[]).find(x=>x.maLo===oldMaLo);
    if (!b) return;
    b.maLo = document.getElementById('bl_maLo').value;
    b.sanPham = document.getElementById('bl_sp').value;
    b.soLuong = +document.getElementById('bl_sl').value||0;
    saveDB(); renderAll(); closeModal();
};
// Xóa lô hàng
window.deleteBatch = maLo => {
    if (!confirm('Xóa lô hàng?')) return;
    DB.lohang = (DB.lohang||[]).filter(x=>x.maLo!==maLo);
    saveDB(); renderAll();
};

// ====== ĐIỀU HƯỚNG MENU - sử dụng [data-section] giống Nongdan & Daily ======
document.querySelectorAll('.menu-link[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.menu-link[data-section]').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
        link.classList.add('active');
        const section = link.dataset.section;
        document.getElementById(section)?.classList.add('active-page');
    });
});

// ====== KHỞI TẠO - phải gọi refreshAll() giống Daily & Nongdan ======
window.addEventListener('DOMContentLoaded', () => {
    loadCurrentUser();
    loadDB();
    const user = document.getElementById('current-user');
    if (user && currentUser) {
        user.innerHTML = `<strong>${currentUser.fullName}</strong>`;
        user.style.cursor = 'pointer';
        user.title = 'Xem thông tin cá nhân';
        user.addEventListener('click', function() {
            // Dữ liệu mẫu cho siêu thị
            const fakeUser = {
                fullName: 'Lê Văn C',
                username: 'sieuthi789',
                email: 'sieuthi.c@example.com',
                phone: '0901 234 567',
                role: 'Siêu thị',
                storeName: 'Siêu thị Xanh',
                businessType: 'Siêu thị',
                businessLicense: 'GP123456',
                storeSize: '1200',
                province: 'TP. Hồ Chí Minh',
                district: 'Quận 1',
                address: 'Số 1, Đường Lê Lợi',
                createdAt: '2025-10-10T08:00:00',
                id: 'ST789123'
            };
            const avatar = `<div style="display:flex;justify-content:center;align-items:center;margin-bottom:16px;"><div style="background:linear-gradient(135deg,#4caf50,#388e3c);width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px #0002;"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"44\" height=\"44\" viewBox=\"0 0 24 24\" fill=\"#fff\"><path d=\"M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z\"/></svg></div></div>`;
            const infoTable = `
                <table style=\"width:100%;border-collapse:separate;border-spacing:0 12px 0 18px;font-size:16px;\">
                    <colgroup><col style=\"width:180px;\"><col style=\"width:auto;\"></colgroup>
                    <tr><td style=\"color:#888;padding-right:32px;\">Họ tên</td><td style=\"font-weight:600;\">${fakeUser.fullName}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Tên đăng nhập</td><td>${fakeUser.username}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Email</td><td>${fakeUser.email}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Số điện thoại</td><td>${fakeUser.phone}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Vai trò</td><td>${fakeUser.role}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Tỉnh/Thành phố</td><td>${fakeUser.province}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Quận/Huyện</td><td>${fakeUser.district}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Địa chỉ</td><td>${fakeUser.address}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Tên cửa hàng/Siêu thị</td><td>${fakeUser.storeName}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Loại hình kinh doanh</td><td>${fakeUser.businessType}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Giấy phép kinh doanh</td><td>${fakeUser.businessLicense}</td></tr>
                    <tr><td style=\"color:#888;padding-right:32px;\">Quy mô (m²)</td><td>${fakeUser.storeSize}</td></tr>
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
    // Modal hiển thị thông tin người dùng (popup)
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
    refreshAll();
});

// Làm mới toàn bộ dữ liệu và giao diện (giống Daily & Nongdan)
function refreshAll() {
    renderAll();
}

// Lắng nghe sự kiện thay đổi storage (từ tab khác) để tự động làm mới giao diện
window.addEventListener('storage', (ev) => {
    try {
        if (!ev.key) return;
        const keysToWatch = ['retail_orders', 'lohang'];
        if (keysToWatch.includes(ev.key) || ev.key.includes('retail_orders') || ev.key.includes('lohang')) {
            try { loadDB(); } catch (e) {}
            try { renderAll(); } catch (e) {}
        }
    } catch (err) { console.warn('storage listener error (sieuthi)', err); }
});
