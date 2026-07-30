# 🚀 Prototype — LearningRadar AI Tutor (Vite + React)

Prototype này được xây dựng trên nền **Vite + React 18** tối giản, cực kỳ nhẹ và khởi chạy tức thì.

---

## 💻 1. Hướng dẫn Khởi chạy (Cho các thành viên nhóm)

### Bước 1: Di chuyển vào thư mục `prototype`
```bash
cd prototype
```

### Bước 2: Cài đặt thư viện (Chỉ mất ~5 giây)
```bash
npm install
```

### Bước 3: Chạy server giao diện
```bash
npm start
# hoặc
npm run dev
```
Trình duyệt sẽ tự động mở tại: **http://localhost:3000**

---

## 🎨 2. Phân chia công việc UI giữa các thành viên

Mỗi thành viên trong nhóm tập trung vào các file độc lập bên trong `src/pages/vlearn/`:

| Thành viên | File đảm nhận | Chức năng UI cần làm |
| :--- | :--- | :--- |
| **TV 1 (Student Flow)** | `src/pages/vlearn/StudentSlideReader.js` | Giao diện học viên đọc Slide, bôi đen văn bản, hỏi AI Tutor, hiển thị Widget Kiểm Tra Hiểu Thật. |
| **TV 2 (Teacher Flow)** | `src/pages/vlearn/TeacherRadarDashboard.js` | Giao diện Giảng viên / TA xem Bản đồ lỗ hổng kiến thức (Radar), danh sách điểm nhầm lẫn, thống kê & live log. |
| **TV 3 (Eval & Prompt)** | `src/pages/vlearn/EvalPlayground.js` | Giao diện chạy Golden Set evaluation (50 câu test), chấm điểm & hiển thị độ chính xác. |

---

## 💡 Cấu trúc dự án
```text
prototype/src/
├── services/
│   └── aiService.js              ← Service gọi Gemini AI API / Fallback Mock AI
├── mockData/
│   └── vlearnMockData.js         ← Dữ liệu giả lập Slide, Lỗ hổng kiến thức, Feedback logs
├── pages/
│   └── vlearn/                   ← 🎯 KHU VỰC CHÍNH ĐỂ TEAM BUILD UI
│       ├── StudentSlideReader.js
│       ├── TeacherRadarDashboard.js
│       └── EvalPlayground.js
├── App.jsx                       ← Giao diện chính & Thanh điều hướng Top Navbar
└── main.jsx
```
