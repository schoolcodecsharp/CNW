import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop" alt="AgriChain Logo" className="logo-icon" />
            <span className="logo-text" style={{ color: '#10b981' }}>AgriChain</span>
          </Link>
          <ul className="nav-menu">
            <li><a href="#features">Tính năng</a></li>
            <li><a href="#roles">Vai trò</a></li>
            <li><a href="#benefits">Lợi ích</a></li>
            <li><a href="#contact">Liên hệ</a></li>
          </ul>
          <div className="nav-buttons">
            <Link to="/login" className="btn btn-outline">Đăng nhập</Link>
            <Link to="/register" className="btn btn-primary">Đăng ký</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Quản lý Nông sản & Chuỗi cung ứng</h1>
          <p>Giải pháp công nghệ toàn diện giúp quản lý nông sản từ trang trại đến siêu thị. Minh bạch, an toàn và hiệu quả.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-white">Bắt đầu ngay</Link>
            <a href="#features" className="btn btn-outline-white">Tìm hiểu thêm</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Tính năng nổi bật</h2>
            <p>Hệ thống quản lý toàn diện cho chuỗi cung ứng nông sản</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=240&h=240&fit=crop" alt="Đăng ký" className="feature-icon" />
              <h3>Đăng ký lô nông sản</h3>
              <p>Ghi nhận nguồn gốc, chứng nhận VietGAP/GlobalGAP, thông tin chi tiết về từng lô nông sản</p>
            </div>
            <div className="feature-card">
              <img src="https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=240&h=240&fit=crop" alt="QR Code" className="feature-icon" />
              <h3>Truy xuất nguồn gốc QR</h3>
              <p>Quét mã QR để xem toàn bộ hành trình của nông sản từ trang trại đến tay người tiêu dùng</p>
            </div>
            <div className="feature-card">
              <img src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=240&h=240&fit=crop" alt="Vận chuyển" className="feature-icon" />
              <h3>Quản lý vận chuyển</h3>
              <p>Theo dõi vận chuyển, quản lý kho trung gian, đảm bảo chất lượng trong suốt quá trình</p>
            </div>
            <div className="feature-card">
              <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=240&h=240&fit=crop" alt="Kiểm định" className="feature-icon" />
              <h3>Kiểm định chất lượng</h3>
              <p>Biên bản kiểm tra chất lượng, chữ ký số, đảm bảo an toàn thực phẩm cho người tiêu dùng</p>
            </div>
            <div className="feature-card">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=240&h=240&fit=crop" alt="Báo cáo" className="feature-icon" />
              <h3>Báo cáo & Thống kê</h3>
              <p>Báo cáo sản lượng, tồn kho, phân tích dữ liệu để tối ưu hóa chuỗi cung ứng</p>
            </div>
            <div className="feature-card">
              <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=240&h=240&fit=crop" alt="Cảnh báo" className="feature-icon" />
              <h3>Cảnh báo tự động</h3>
              <p>Cảnh báo lô quá hạn, nhiệt độ kho, các sự cố trong chuỗi cung ứng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="roles" id="roles">
        <div className="container">
          <div className="section-header">
            <h2>Dành cho mọi đối tượng</h2>
            <p>Hệ thống hỗ trợ đầy đủ các vai trò trong chuỗi cung ứng nông sản</p>
          </div>
          <div className="roles-grid">
            <div className="role-card">
              <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=300&fit=crop" alt="Nông dân" className="role-icon" />
              <h3>Nông dân</h3>
              <p>Quản lý trang trại và sản xuất</p>
              <ul className="role-features">
                <li>✓ Đăng ký lô nông sản</li>
                <li>✓ Quản lý chứng nhận</li>
                <li>✓ Theo dõi sản lượng</li>
                <li>✓ Tạo mã QR truy xuất</li>
              </ul>
            </div>
            <div className="role-card">
              <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=300&h=300&fit=crop" alt="Đại lý" className="role-icon" />
              <h3>Đại lý</h3>
              <p>Vận chuyển và phân phối</p>
              <ul className="role-features">
                <li>✓ Quản lý vận chuyển</li>
                <li>✓ Theo dõi kho trung gian</li>
                <li>✓ Cập nhật trạng thái</li>
                <li>✓ Báo cáo giao hàng</li>
              </ul>
            </div>
            <div className="role-card">
              <img src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=300&h=300&fit=crop" alt="Siêu thị" className="role-icon" />
              <h3>Siêu thị</h3>
              <p>Bán lẻ cho người tiêu dùng</p>
              <ul className="role-features">
                <li>✓ Nhận hàng và kiểm tra</li>
                <li>✓ Quản lý tồn kho</li>
                <li>✓ Truy xuất nguồn gốc</li>
                <li>✓ Báo cáo bán hàng</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits" id="benefits">
        <div className="container">
          <div className="section-header">
            <h2>Lợi ích vượt trội</h2>
            <p>Giải pháp mang lại giá trị cho toàn bộ chuỗi cung ứng</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-item">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop" alt="Minh bạch" className="benefit-icon" />
              <div className="benefit-content">
                <h4>Minh bạch 100%</h4>
                <p>Theo dõi đầy đủ nguồn gốc, quá trình vận chuyển và kiểm định chất lượng</p>
              </div>
            </div>
            <div className="benefit-item">
              <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=160&h=160&fit=crop" alt="An toàn" className="benefit-icon" />
              <div className="benefit-content">
                <h4>An toàn thực phẩm</h4>
                <p>Đảm bảo chất lượng nông sản, giảm thiểu rủi ro về an toàn vệ sinh</p>
              </div>
            </div>
            <div className="benefit-item">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=160&h=160&fit=crop" alt="Hiệu quả" className="benefit-icon" />
              <div className="benefit-content">
                <h4>Tăng hiệu quả</h4>
                <p>Tối ưu hóa quy trình, giảm thời gian và chi phí vận hành</p>
              </div>
            </div>
            <div className="benefit-item">
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=160&h=160&fit=crop" alt="Niềm tin" className="benefit-icon" />
              <div className="benefit-content">
                <h4>Tăng niềm tin</h4>
                <p>Xây dựng lòng tin từ người tiêu dùng với thông tin minh bạch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Sẵn sàng bắt đầu?</h2>
          <p>Tham gia cùng hàng nghìn nông dân, đại lý và siêu thị đang sử dụng hệ thống</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-white">Đăng ký miễn phí</Link>
            <a href="#contact" className="btn btn-outline-white">Liên hệ tư vấn</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-content">
          <div className="footer-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=40&h=40&fit=crop" alt="AgriChain" style={{ borderRadius: '8px' }} />
              <h3>AgriChain</h3>
            </div>
            <p>Giải pháp công nghệ toàn diện cho quản lý nông sản và chuỗi cung ứng.</p>
          </div>
          <div className="footer-section">
            <h3>Liên kết</h3>
            <ul className="footer-links">
              <li><a href="#features">Tính năng</a></li>
              <li><a href="#roles">Vai trò</a></li>
              <li><a href="#benefits">Lợi ích</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Liên hệ</h3>
            <ul className="footer-links">
              <li>📍 Thanh Long Yên Mĩ Hưng Yên</li>
              <li>📞 0964778132</li>
              <li>✉️ nguyenvantruong17012005@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 AgriChain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
