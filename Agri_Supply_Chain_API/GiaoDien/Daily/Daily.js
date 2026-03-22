var app = angular.module('DaiLyApp', []);

app.controller('DaiLyCtrl', function($scope, $http) {
    
    // BIẾN DỮ LIỆU
    $scope.currentUser = null;
    $scope.listDaiLy = [];
    $scope.listKho = [];
    $scope.listKiemDinh = [];
    $scope.listDonHangDaiLy = [];
    $scope.listDonHangSieuThi = [];
    
    //Form data
    $scope.formDaiLy = {};
    $scope.formKho = {};
    $scope.formKiemDinh = {};
    $scope.formDonHang = {};
    
    //KHỞI TẠO
    $scope.init = function() {
        $scope.loadCurrentUser();
        $scope.loadDaiLy();
        $scope.loadKho();
        $scope.loadKiemDinh();
        $scope.loadDonHangDaiLy();
        $scope.loadDonHangSieuThi();
    };
    
    $scope.loadCurrentUser = function() {
        var stored = sessionStorage.getItem('currentUser');
        if (stored) {
            $scope.currentUser = JSON.parse(stored);
        }
    };

    //ĐẠI LÝ
    $scope.loadDaiLy = function() {
        $http({
            method: 'GET',
            url: API.daily.getAll
        }).then(function(response) {
            $scope.listDaiLy = response.data;
            console.log('Loaded DaiLy:', $scope.listDaiLy);
        }).catch(function(error) {
            console.error('Error loading DaiLy:', error);
        });
    };
    
    //KHO
    $scope.loadKho = function() {
        $http({
            method: 'GET',
            url: API.kho.getAll
        }).then(function(response) {
            $scope.listKho = response.data;
            console.log('Loaded Kho:', $scope.listKho);
        }).catch(function(error) {
            console.error('Error loading Kho:', error);
        });
    };
    
    $scope.createKho = function() {
        $http({
            method: 'POST',
            url: API.kho.create,
            data: $scope.formKho,
            headers: { 'Content-Type': 'application/json' }
        }).then(function(response) {
            alert('Tạo kho thành công!');
            $scope.loadKho();
            $scope.formKho = {};
            $scope.closeModal();
        }).catch(function(error) {
            console.error('Error creating Kho:', error);
            alert('Lỗi tạo kho: ' + (error.data || error.statusText));
        });
    };
    
    $scope.updateKho = function(maKho) {
        $http({
            method: 'PUT',
            url: API.kho.update(maKho),
            data: $scope.formKho,
            headers: { 'Content-Type': 'application/json' }
        }).then(function(response) {
            alert('Cập nhật kho thành công!');
            $scope.loadKho();
            $scope.formKho = {};
            $scope.closeModal();
        }).catch(function(error) {
            console.error('Error updating Kho:', error);
            alert('Lỗi cập nhật kho: ' + (error.data || error.statusText));
        });
    };
    
    $scope.deleteKho = function(maKho) {
        if (!confirm('Xác nhận xóa kho này?')) return;
        $http({
            method: 'DELETE',
            url: API.kho.delete(maKho)
        }).then(function(response) {
            alert('Xóa kho thành công!');
            $scope.loadKho();
        }).catch(function(error) {
            console.error('Error deleting Kho:', error);
            alert('Lỗi xóa kho: ' + (error.data || error.statusText));
        });
    };
    
    $scope.editKho = function(kho) {
        $scope.formKho = angular.copy(kho);
        $scope.isEditKho = true;
        $scope.openModal('kho');
    };

    //KIỂM ĐỊNH 
    $scope.loadKiemDinh = function() {
        $http({
            method: 'GET',
            url: API.kiemdinh.getAll
        }).then(function(response) {
            $scope.listKiemDinh = response.data;
            console.log('Loaded KiemDinh:', $scope.listKiemDinh);
        }).catch(function(error) {
            console.error('Error loading KiemDinh:', error);
        });
    };
    
    $scope.createKiemDinh = function() {
        $http({
            method: 'POST',
            url: API.kiemdinh.create,
            data: $scope.formKiemDinh,
            headers: { 'Content-Type': 'application/json' }
        }).then(function(response) {
            alert('Tạo kiểm định thành công!');
            $scope.loadKiemDinh();
            $scope.formKiemDinh = {};
            $scope.closeModal();
        }).catch(function(error) {
            console.error('Error creating KiemDinh:', error);
            alert('Lỗi tạo kiểm định: ' + (error.data || error.statusText));
        });
    };
    
    $scope.updateKiemDinh = function(maKiemDinh) {
        $http({
            method: 'PUT',
            url: API.kiemdinh.update(maKiemDinh),
            data: $scope.formKiemDinh,
            headers: { 'Content-Type': 'application/json' }
        }).then(function(response) {
            alert('Cập nhật kiểm định thành công!');
            $scope.loadKiemDinh();
            $scope.formKiemDinh = {};
            $scope.closeModal();
        }).catch(function(error) {
            console.error('Error updating KiemDinh:', error);
            alert('Lỗi cập nhật kiểm định: ' + (error.data || error.statusText));
        });
    };
    
    $scope.deleteKiemDinh = function(maKiemDinh) {
        if (!confirm('Xác nhận xóa kiểm định này?')) return;
        $http({
            method: 'DELETE',
            url: API.kiemdinh.delete(maKiemDinh)
        }).then(function(response) {
            alert('Xóa kiểm định thành công!');
            $scope.loadKiemDinh();
        }).catch(function(error) {
            console.error('Error deleting KiemDinh:', error);
            alert('Lỗi xóa kiểm định: ' + (error.data || error.statusText));
        });
    };
    
    $scope.editKiemDinh = function(kiemDinh) {
        $scope.formKiemDinh = angular.copy(kiemDinh);
        $scope.isEditKiemDinh = true;
        $scope.openModal('kiemdinh');
    };

    // ĐƠN HÀNG ĐẠI LÝ (Mua từ Nông Dân)
    $scope.loadDonHangDaiLy = function() {
        $http({
            method: 'GET',
            url: API.donHangDaiLy.getAll
        }).then(function(response) {
            $scope.listDonHangDaiLy = response.data;
            console.log('Loaded DonHangDaiLy:', $scope.listDonHangDaiLy);
        }).catch(function(error) {
            console.error('Error loading DonHangDaiLy:', error);
        });
    };
    
    $scope.createDonHangDaiLy = function() {
        $http({
            method: 'POST',
            url: API.donHangDaiLy.create,
            data: $scope.formDonHang,
            headers: { 'Content-Type': 'application/json' }
        }).then(function(response) {
            alert('Tạo đơn hàng thành công!');
            $scope.loadDonHangDaiLy();
            $scope.formDonHang = {};
            $scope.closeModal();
        }).catch(function(error) {
            console.error('Error creating DonHangDaiLy:', error);
            alert('Lỗi tạo đơn hàng: ' + (error.data || error.statusText));
        });
    };
    
    $scope.updateTrangThaiDonHangDaiLy = function(maDonHang, trangThai) {
        $http({
            method: 'PUT',
            url: API.donHangDaiLy.updateTrangThai(maDonHang),
            data: { trangThai: trangThai },
            headers: { 'Content-Type': 'application/json' }
        }).then(function(response) {
            alert('Cập nhật trạng thái thành công!');
            $scope.loadDonHangDaiLy();
        }).catch(function(error) {
            console.error('Error updating DonHangDaiLy:', error);
            alert('Lỗi cập nhật: ' + (error.data || error.statusText));
        });
    };
    
    $scope.deleteDonHangDaiLy = function(maDonHang) {
        if (!confirm('Xác nhận xóa đơn hàng này?')) return;
        $http({
            method: 'DELETE',
            url: API.donHangDaiLy.delete(maDonHang)
        }).then(function(response) {
            alert('Xóa đơn hàng thành công!');
            $scope.loadDonHangDaiLy();
        }).catch(function(error) {
            console.error('Error deleting DonHangDaiLy:', error);
            alert('Lỗi xóa đơn hàng: ' + (error.data || error.statusText));
        });
    };

    //ĐƠN HÀNG SIÊU THỊ (Bán cho Siêu Thị)
    $scope.loadDonHangSieuThi = function() {
        $http({
            method: 'GET',
            url: API.donHangSieuThiDaily.getByMaDaiLy(1) //lấy maDaiLy từ currentUser
        }).then(function(response) {
            $scope.listDonHangSieuThi = response.data;
            console.log('Loaded DonHangSieuThi:', $scope.listDonHangSieuThi);
        }).catch(function(error) {
            console.error('Error loading DonHangSieuThi:', error);
        });
    };
    
    $scope.updateTrangThaiDonHangSieuThi = function(maDonHang, trangThai) {
        $http({
            method: 'PUT',
            url: API.donHangSieuThiDaily.updateTrangThai(maDonHang),
            data: { trangThai: trangThai },
            headers: { 'Content-Type': 'application/json' }
        }).then(function(response) {
            alert('Cập nhật trạng thái thành công!');
            $scope.loadDonHangSieuThi();
        }).catch(function(error) {
            console.error('Error updating DonHangSieuThi:', error);
            alert('Lỗi cập nhật: ' + (error.data || error.statusText));
        });
    };
    
    //MODAL
    $scope.currentModal = '';
    $scope.isEditKho = false;
    $scope.isEditKiemDinh = false;
    $scope.isEditDonHang = false;
    
    $scope.openModal = function(type) {
        $scope.currentModal = type;
        document.getElementById('modal').classList.remove('hidden');
    };
    
    $scope.closeModal = function() {
        $scope.currentModal = '';
        document.getElementById('modal').classList.add('hidden');
        $scope.formKho = {};
        $scope.formKiemDinh = {};
        $scope.formDonHang = {};
        $scope.isEditKho = false;
        $scope.isEditKiemDinh = false;
        $scope.isEditDonHang = false;
    };
    
    $scope.saveKho = function() {
        if ($scope.isEditKho) {
            $scope.updateKho($scope.formKho.maKho);
        } else {
            $scope.createKho();
        }
    };
    
    $scope.saveKiemDinh = function() {
        if ($scope.isEditKiemDinh) {
            $scope.updateKiemDinh($scope.formKiemDinh.maKiemDinh);
        } else {
            $scope.createKiemDinh();
        }
    };
    
    $scope.saveDonHangDaiLy = function() {
        if ($scope.isEditDonHang) {
            $scope.updateDonHangDaiLy($scope.formDonHang.maDonHang);
        } else {
            $scope.createDonHangDaiLy();
        }
    };
    
    $scope.editDonHangDaiLy = function(donHang) {
        $scope.formDonHang = angular.copy(donHang);
        $scope.isEditDonHang = true;
        $scope.openModal('donhangdaily');
    };
    
    $scope.updateDonHangDaiLy = function(maDonHang) {
        $http({
            method: 'PUT',
            url: API.donHangDaiLy.update(maDonHang),
            data: $scope.formDonHang,
            headers: { 'Content-Type': 'application/json' }
        }).then(function(response) {
            alert('Cập nhật đơn hàng thành công!');
            $scope.loadDonHangDaiLy();
            $scope.formDonHang = {};
            $scope.closeModal();
        }).catch(function(error) {
            console.error('Error updating DonHangDaiLy:', error);
            alert('Lỗi cập nhật đơn hàng: ' + (error.data || error.statusText));
        });
    };
    
    // NAVIGATION
    $scope.currentPage = 'dashboard';
    
    $scope.showPage = function(page) {
        $scope.currentPage = page;
    };
    
    //LOGOUT 
    $scope.logout = function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = '../Dangnhap/Dangnhap.html';
    };
    
    // Khởi tạo
    $scope.init();
});
