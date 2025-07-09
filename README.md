# Portfolio 2300 – Quách Thành Long

![Portfolio 2300 Banner](assets/images/portfolio-banner.png) Chào mừng bạn đến với Portfolio 2300, một không gian tương tác giới thiệu về hành trình và năng lực của **Quách Thành Long** trong các lĩnh vực Công nghệ thông tin, Kinh tế Đầu tư, và Phân tích Kinh doanh. Dự án này được thiết kế với giao diện futuristic, lấy cảm hứng từ một trạm vũ trụ, mang đến trải nghiệm khám phá độc đáo.

## 🚀 Giới Thiệu

Đây là portfolio cá nhân của Quách Thành Long, nơi bạn có thể khám phá:
* **Tổng Quan:** Thông tin cá nhân, học vấn và kỹ năng ngoại ngữ.
* **Kỹ Năng:** Các công nghệ và công cụ chuyên môn (Front-End, Back-End, Game Development, v.v.).
* **Kinh Nghiệm:** Lịch sử làm việc và vai trò đảm nhiệm.
* **Dự Án:** Các dự án nổi bật đã thực hiện, bao gồm phát triển game, website, và nghiên cứu.
* **Thành Tựu & Hoạt Động:** Các giải thưởng học thuật, thành tích thể thao và hoạt động cộng đồng.
* **Liên Hệ:** Thông tin liên lạc và mã QR tiện lợi.

Điểm nhấn của portfolio này là hiệu ứng nền 3D sống động với các mô hình phi thuyền, hành tinh và trường sao, tạo nên một không gian làm việc đậm chất tương lai.

## ✨ Tính Năng Nổi Bật

* **Giao diện Futuristic:** Thiết kế lấy cảm hứng từ màn hình terminal và trạm vũ trụ.
* **Nền 3D tương tác:** Sử dụng Three.js để tạo ra một cảnh không gian 3D động với các mô hình và hiệu ứng chuyển động.
* **Đa ngôn ngữ:** Hỗ trợ tiếng Việt và tiếng Anh.
* **Phản hồi (Responsive):** Tối ưu hóa cho cả thiết bị di động và máy tính để bàn.
* **AI Assistant:** Một chatbot đơn giản tích hợp để cung cấp thông tin nhanh chóng về portfolio (hiện tại là thông tin đã định sẵn).
* **QR Code tiện lợi:** Dễ dàng quét mã QR để truy cập thông tin liên hệ hoặc donate.

## 🛠️ Công Nghệ Sử Dụng

* **HTML5:** Cấu trúc nội dung.
* **CSS3 (futuristic.css):** Tạo phong cách và hiệu ứng giao diện.
* **JavaScript (ES6+):** Xử lý logic tương tác.
* **Three.js (r165):** Thư viện JavaScript mạnh mẽ cho đồ họa 3D trên trình duyệt.
    * `GLTFLoader`: Để tải các mô hình 3D (.glb).
    * `OrbitControls`: (Chỉ dùng cho phát triển) để điều khiển camera trong môi trường 3D.
* **QRCode.js:** Thư viện tạo mã QR động (có thể sử dụng hoặc thay thế bằng ảnh tĩnh như hiện tại).
* **Font Google Fonts:** `Space Mono`.
* 
## ⚙️ Cách Cài Đặt và Chạy

Để chạy dự án này trên máy tính của bạn:

1.  **Clone repository về máy:**
    ```bash
    git clone [https://github.com/StephenSouth13/Portforlio_QTL_ver1.git](https://github.com/StephenSouth13/Portforlio_QTL_ver1.git)
    ```
2.  **Điều hướng vào thư mục dự án:**
    ```bash
    cd Portforlio_QTL_ver1
    ```
3.  **Mở bằng Live Server:**
    Do dự án sử dụng các module ES6 (`import`/`export`) và tải tài nguyên 3D cục bộ, bạn cần chạy nó thông qua một web server cục bộ. Cách đơn giản nhất là sử dụng tiện ích **"Live Server"** trong VS Code:
    * Mở thư mục `Portforlio_QTL_ver1` trong VS Code.
    * Click chuột phải vào file `index.html`.
    * Chọn **"Open with Live Server"**.
    * Trang web sẽ tự động mở trong trình duyệt của bạn tại địa chỉ như `http://127.0.0.1:5500/index.html`.

    *(Nếu bạn không dùng VS Code, bạn có thể sử dụng các server cục bộ khác như Python's `http.server`, Node.js `serve`, v.v.)*

## 💡 Ghi Chú Phát Triển

* **Three.js CDN:** Các thư viện Three.js được import trực tiếp từ CDN để đơn giản hóa việc triển khai và đảm bảo phiên bản ổn định.
* **Mô hình 3D:** Các mô hình `.glb` được tải cục bộ từ thư mục `assets/models/`. Đảm bảo các file này tồn tại và đường dẫn trong `scene-3d.js` là chính xác.
* **OrbitControls:** `OrbitControls` trong `scene-3d.js` được bật để dễ dàng xem và điều chỉnh cảnh 3D trong quá trình phát triển. Bạn nên **comment hoặc xóa** dòng `controls = new OrbitControlsClass(camera, renderer.domElement);` khi triển khai sản phẩm cuối cùng nếu không muốn người dùng có thể điều khiển cảnh.

## 📄 Giấy Phép

Dự án này được cấp phép theo Giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết. ## 📧 Liên Hệ

Nếu có bất kỳ câu hỏi hoặc cơ hội hợp tác nào, đừng ngần ngại liên hệ với Quách Thành Long qua:
* **Email:** stephensouth1307@gmail.com
* **Điện thoại:** 0979 137 018
* **Website CV:** [stephensouth13.github.io/cv-qtl/](https://stephensouth13.github.io/cv-qtl/)
* **Blog:** [stephensouth9.wordpress.com](https://stephensouth9.wordpress.com)

---
