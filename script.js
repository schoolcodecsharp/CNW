// Data storage
let farmerData = {
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    email: 'nguyenvana@email.com',
    address: 'Xã Hòa Bình, Huyện Thanh Oai, Hà Nội'
};

let batches = [
    { 
        id: 1, 
        name: 'Lô Rau Xanh #001', 
        product: 'Rau cải', 
        quantity: '500kg', 
        farm: 'Nông trại A',
        date: '2024-01-15', 
        status: 'Đã phê duyệt',
        description: 'Rau cải xanh hữu cơ',
        images: [],
        certificates: []
    }
];

let farms = [
    { 
        id: 1, 
        name: 'Nông trại A', 
        area: '2 hecta', 
        location: 'Lô 1, Khu A', 
        crops: 'Rau xanh',
        status: 'Đã phê duyệt',
        description: 'Nông trại trồng rau hữu cơ',
        images: [],
        certificates: []
    }
];

let shipments = [
    { id: 1, orderId: 'ĐH001', destination: 'Hà Nội', status: 'Đang giao', date: '2024-01-25' },
    { id: 2, orderId: 'ĐH002', destination: 'Hải Phòng', status: 'Đã giao', date: '2024-01-23' }
];

let isEditingProfile = false;
let editingBatchId = null;
let editingFarmId = null;

// Login function
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        loadProfile();
        updateStats();
        renderBatches();
        renderFarms();
        renderShipments();
        updateReports();
    }
}

// Logout function
function logout() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Show page function
function showPage(page) {
    document.querySelectorAll('[id$="Page"]').forEach(p => p.classList.add('hidden'));
    document.getElementById(page + 'Page').classList.remove('hidden');
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.menu-item').classList.add('active');
}

// Load profile
function loadProfile() {
    document.getElementById('farmerName').textContent = farmerData.name;
    document.getElementById('userAvatar').textContent = farmerData.name.charAt(0);
    document.getElementById('profileName').value = farmerData.name;
    document.getElementById('profilePhone').value = farmerData.phone;
    document.getElementById('profileEmail').value = farmerData.email;
    document.getElementById('profileAddress').value = farmerData.address;
}

// Toggle edit profile
function toggleEditProfile() {
    isEditingProfile = !isEditingProfile;
    const inputs = document.querySelectorAll('#profilePage input');
    inputs.forEach(input => input.disabled = !isEditingProfile);
    
    document.getElementById('editBtnText').textContent = isEditingProfile ? 'Hủy' : 'Chỉnh sửa';
    document.getElementById('saveProfileBtn').classList.toggle('hidden', !isEditingProfile);
}

// Save profile
function saveProfile(event) {
    event.preventDefault();
    farmerData.name = document.getElementById('profileName').value;
    farmerData.phone = document.getElementById('profilePhone').value;
    farmerData.email = document.getElementById('profileEmail').value;
    farmerData.address = document.getElementById('profileAddress').value;
    
    loadProfile();
    toggleEditProfile();
    alert('Cập nhật thông tin thành công!');
}

// Update stats
function updateStats() {
    document.getElementById('totalBatches').textContent = batches.length;
    document.getElementById('totalFarms').textContent = farms.length;
    document.getElementById('totalShipments').textContent = shipments.length;
}

// Load farm select options
function loadFarmOptions() {
    const select = document.getElementById('batchFarm');
    select.innerHTML = '<option value="">-- Chọn nông trại --</option>';
    
    farms.filter(f => f.status === 'Đã phê duyệt').forEach(farm => {
        select.innerHTML += `<option value="${farm.name}">${farm.name}</option>`;
    });
}

// Preview images
function previewImages(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    preview.innerHTML = '';
    
    if (input.files) {
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-image';
                preview.appendChild(img);
            }
            reader.readAsDataURL(file);
        });
    }
}

// Render batches
function renderBatches() {
    const tbody = document.getElementById('batchesTable');
    tbody.innerHTML = '';
    
    const pendingCount = batches.filter(b => b.status === 'Chờ phê duyệt').length;
    const alert = document.getElementById('pendingBatchesAlert');
    
    if (pendingCount > 0) {
        alert.style.display = 'flex';
        document.getElementById('pendingBatchCount').textContent = pendingCount;
    } else {
        alert.style.display = 'none';
    }
    
    batches.forEach(batch => {
        let statusClass = 'status-pending';
        if (batch.status === 'Đã phê duyệt') statusClass = 'status-approved';
        if (batch.status === 'Từ chối') statusClass = 'status-rejected';
        
        tbody.innerHTML += `
            <tr>
                <td>${batch.name}</td>
                <td>${batch.product}</td>
                <td>${batch.quantity}</td>
                <td>${batch.farm}</td>
                <td>${batch.date}</td>
                <td><span class="status-badge ${statusClass}">${batch.status}</span></td>
                <td>
                    <button class="btn-secondary" onclick="viewBatchDetails(${batch.id})">Xem</button>
                    <button class="btn-secondary" onclick="editBatch(${batch.id})">Sửa</button>
                    <button class="btn-danger" onclick="deleteBatch(${batch.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

// Save batch (Add or Edit)
function saveBatch(event) {
    event.preventDefault();
    
    const batchData = {
        name: document.getElementById('batchName').value,
        product: document.getElementById('batchProduct').value,
        quantity: document.getElementById('batchQuantity').value,
        farm: document.getElementById('batchFarm').value,
        date: document.getElementById('batchDate').value,
        description: document.getElementById('batchDescription').value,
        status: 'Chờ phê duyệt',
        images: [],
        certificates: []
    };
    
    if (editingBatchId) {
        // Edit existing batch
        const index = batches.findIndex(b => b.id === editingBatchId);
        batches[index] = { ...batches[index], ...batchData, status: 'Chờ phê duyệt' };
        alert('Cập nhật lô hàng thành công! Đang chờ Admin phê duyệt.');
        editingBatchId = null;
    } else {
        // Add new batch
        batchData.id = Date.now();
        batches.push(batchData);
        alert('Đăng ký lô hàng thành công! Đang chờ Admin phê duyệt.');
    }
    
    renderBatches();
    updateStats();
    updateReports();
    closeModal('batchModal');
    resetBatchForm();
}

// Edit batch
function editBatch(id) {
    const batch = batches.find(b => b.id === id);
    if (!batch) return;
    
    editingBatchId = id;
    document.getElementById('batchModalTitle').textContent = 'Chỉnh sửa lô hàng';
    document.getElementById('batchSubmitText').textContent = 'Cập nhật lô hàng';
    
    document.getElementById('batchId').value = batch.id;
    document.getElementById('batchName').value = batch.name;
    document.getElementById('batchProduct').value = batch.product;
    document.getElementById('batchQuantity').value = batch.quantity;
    document.getElementById('batchFarm').value = batch.farm;
    document.getElementById('batchDate').value = batch.date;
    document.getElementById('batchDescription').value = batch.description || '';
    
    openModal('batchModal');
}

// View batch details
function viewBatchDetails(id) {
    const batch = batches.find(b => b.id === id);
    if (!batch) return;
    
    document.getElementById('detailsModalTitle').textContent = 'Chi tiết lô hàng';
    document.getElementById('detailsContent').innerHTML = `
        <div style="line-height: 2;">
            <p><strong>Tên lô hàng:</strong> ${batch.name}</p>
            <p><strong>Sản phẩm:</strong> ${batch.product}</p>
            <p><strong>Số lượng:</strong> ${batch.quantity}</p>
            <p><strong>Nông trại:</strong> ${batch.farm}</p>
            <p><strong>Ngày đăng ký:</strong> ${batch.date}</p>
            <p><strong>Trạng thái:</strong> <span class="status-badge ${batch.status === 'Đã phê duyệt' ? 'status-approved' : 'status-pending'}">${batch.status}</span></p>
            <p><strong>Mô tả:</strong> ${batch.description || 'Không có'}</p>
        </div>
    `;
    
    openModal('detailsModal');
}

// Delete batch
function deleteBatch(id) {
    if (confirm('Bạn có chắc muốn xóa lô hàng này?')) {
        batches = batches.filter(b => b.id !== id);
        renderBatches();
        updateStats();
        updateReports();
        alert('Xóa lô hàng thành công!');
    }
}

// Reset batch form
function resetBatchForm() {
    editingBatchId = null;
    document.getElementById('batchModalTitle').textContent = 'Đăng ký lô hàng mới';
    document.getElementById('batchSubmitText').textContent = 'Đăng ký lô hàng';
    document.getElementById('batchId').value = '';
    document.getElementById('batchName').value = '';
    document.getElementById('batchProduct').value = '';
    document.getElementById('batchQuantity').value = '';
    document.getElementById('batchFarm').value = '';
    document.getElementById('batchDate').value = '';
    document.getElementById('batchDescription').value = '';
    document.getElementById('batchImagesPreview').innerHTML = '';
    document.getElementById('batchCertificatesPreview').innerHTML = '';
}

// Render farms
function renderFarms() {
    const tbody = document.getElementById('farmsTable');
    tbody.innerHTML = '';
    
    const pendingCount = farms.filter(f => f.status === 'Chờ phê duyệt').length;
    const alert = document.getElementById('pendingFarmsAlert');
    
    if (pendingCount > 0) {
        alert.style.display = 'flex';
        document.getElementById('pendingFarmCount').textContent = pendingCount;
    } else {
        alert.style.display = 'none';
    }
    
    farms.forEach(farm => {
        let statusClass = 'status-pending';
        if (farm.status === 'Đã phê duyệt') statusClass = 'status-approved';
        if (farm.status === 'Từ chối') statusClass = 'status-rejected';
        
        tbody.innerHTML += `
            <tr>
                <td>${farm.name}</td>
                <td>${farm.area}</td>
                <td>${farm.location}</td>
                <td>${farm.crops}</td>
                <td><span class="status-badge ${statusClass}">${farm.status}</span></td>
                <td>
                    <button class="btn-secondary" onclick="viewFarmDetails(${farm.id})">Xem</button>
                    <button class="btn-secondary" onclick="editFarm(${farm.id})">Sửa</button>
                    <button class="btn-danger" onclick="deleteFarm(${farm.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
    
    loadFarmOptions();
}

// Save farm (Add or Edit)
function saveFarm(event) {
    event.preventDefault();
    
    const farmData = {
        name: document.getElementById('farmName').value,
        area: document.getElementById('farmArea').value,
        location: document.getElementById('farmLocation').value,
        crops: document.getElementById('farmCrops').value,
        description: document.getElementById('farmDescription').value,
        status: 'Chờ phê duyệt',
        images: [],
        certificates: []
    };
    
    if (editingFarmId) {
        // Edit existing farm
        const index = farms.findIndex(f => f.id === editingFarmId);
        farms[index] = { ...farms[index], ...farmData, status: 'Chờ phê duyệt' };
        alert('Cập nhật nông trại thành công! Đang chờ Admin phê duyệt.');
        editingFarmId = null;
    } else {
        // Add new farm
        farmData.id = Date.now();
        farms.push(farmData);
        alert('Đăng ký nông trại thành công! Đang chờ Admin phê duyệt.');
    }
    
    renderFarms();
    updateStats();
    updateReports();
    closeModal('farmModal');
    resetFarmForm();
}

// Edit farm
function editFarm(id) {
    const farm = farms.find(f => f.id === id);
    if (!farm) return;
    
    editingFarmId = id;
    document.getElementById('farmModalTitle').textContent = 'Chỉnh sửa nông trại';
    document.getElementById('farmSubmitText').textContent = 'Cập nhật nông trại';
    
    document.getElementById('farmId').value = farm.id;
    document.getElementById('farmName').value = farm.name;
    document.getElementById('farmArea').value = farm.area;
    document.getElementById('farmLocation').value = farm.location;
    document.getElementById('farmCrops').value = farm.crops;
    document.getElementById('farmDescription').value = farm.description || '';
    
    openModal('farmModal');
}

// View farm details
function viewFarmDetails(id) {
    const farm = farms.find(f => f.id === id);
    if (!farm) return;
    
    document.getElementById('detailsModalTitle').textContent = 'Chi tiết nông trại';
    document.getElementById('detailsContent').innerHTML = `
        <div style="line-height: 2;">
            <p><strong>Tên nông trại:</strong> ${farm.name}</p>
            <p><strong>Diện tích:</strong> ${farm.area}</p>
            <p><strong>Vị trí:</strong> ${farm.location}</p>
            <p><strong>Cây trồng:</strong> ${farm.crops}</p>
            <p><strong>Trạng thái:</strong> <span class="status-badge ${farm.status === 'Đã phê duyệt' ? 'status-approved' : 'status-pending'}">${farm.status}</span></p>
            <p><strong>Mô tả:</strong> ${farm.description || 'Không có'}</p>
        </div>
    `;
    
    openModal('detailsModal');
}

// Delete farm
function deleteFarm(id) {
    if (confirm('Bạn có chắc muốn xóa nông trại này?')) {
        farms = farms.filter(f => f.id !== id);
        renderFarms();
        updateStats();
        updateReports();
        alert('Xóa nông trại thành công!');
    }
}

// Reset farm form
function resetFarmForm() {
    editingFarmId = null;
    document.getElementById('farmModalTitle').textContent = 'Đăng ký nông trại mới';
    document.getElementById('farmSubmitText').textContent = 'Đăng ký nông trại';
    document.getElementById('farmId').value = '';
    document.getElementById('farmName').value = '';
    document.getElementById('farmArea').value = '';
    document.getElementById('farmLocation').value = '';
    document.getElementById('farmCrops').value = '';
    document.getElementById('farmDescription').value = '';
    document.getElementById('farmImagesPreview').innerHTML = '';
    document.getElementById('farmCertificatesPreview').innerHTML = '';
}

// Render shipments
function renderShipments() {
    const tbody = document.getElementById('shipmentsTable');
    tbody.innerHTML = '';
    
    shipments.forEach(shipment => {
        let statusClass = 'status-delivering';
        if (shipment.status === 'Đã giao') statusClass = 'status-delivered';
        if (shipment.status === 'Đang chuẩn bị') statusClass = 'status-pending';
        
        tbody.innerHTML += `
            <tr>
                <td>${shipment.orderId}</td>
                <td>${shipment.destination}</td>
                <td>${shipment.date}</td>
                <td><span class="status-badge ${statusClass}">${shipment.status}</span></td>
                <td>
                    <button class="btn-danger" onclick="deleteShipment(${shipment.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

// Add shipment
function addShipment(event) {
    event.preventDefault();
    const newShipment = {
        id: Date.now(),
        orderId: document.getElementById('shipmentOrderId').value,
        destination: document.getElementById('shipmentDestination').value,
        date: document.getElementById('shipmentDate').value,
        status: document.getElementById('shipmentStatus').value
    };
    
    shipments.push(newShipment);
    renderShipments();
    updateStats();
    updateReports();
    closeModal('shipmentModal');
    event.target.reset();
    alert('Thêm vận chuyển thành công!');
}

// Delete shipment
function deleteShipment(id) {
    if (confirm('Bạn có chắc muốn xóa đơn vận chuyển này?')) {
        shipments = shipments.filter(s => s.id !== id);
        renderShipments();
        updateStats();
        updateReports();
        alert('Xóa vận chuyển thành công!');
    }
}

// Update reports
function updateReports() {
    const delivered = shipments.filter(s => s.status === 'Đã giao').length;
    const pending = shipments.filter(s => s.status !== 'Đã giao').length;
    const revenue = delivered * 15000000;
    
    document.getElementById('deliveredCount').textContent = delivered;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('totalRevenue').textContent = revenue.toLocaleString('vi-VN') + ' VNĐ';
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    if (modalId === 'batchModal') {
        loadFarmOptions();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'batchModal') {
        resetBatchForm();
    }
    if (modalId === 'farmModal') {
        resetFarmForm();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Initialize
window.onload = function() {
    updateStats();
    renderBatches();
    renderFarms();
    renderShipments();
    updateReports();
}