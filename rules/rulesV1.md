### Rule 20251229001: Sử dụng ES5 cho JavaScript
- content: Sử dụng ES5 cho JavaScript
	1. Code JavaScript phải hướng tới ES5 để đảm bảo tương thích với các môi trường hỗ trợ.
- created: 2025-12-29
- group: code
- level: CRITICAL

### Rule 20251229002: Một task chỉ ở 1 folder duy nhất
- content: Task duy nhất trong việc quản lý
	1. Khi tạo task mới: đặt file trong `tasks/data/TODO/`.
	2. Khi bắt đầu làm task: di chuyển file sang `tasks/data/IN_PROGRESS/`.
	3. Khi hoàn thành task: di chuyển file sang `tasks/data/DONE/`.
	4. Khi review task chưa đạt: di chuyển file về `tasks/data/REOPEN/`.
	5. Không để 1 task tồn tại ở cả hai folder.
- created: 2025-12-29
- group: platform
- level: CRITICAL

### Rule 20251229007: Mỗi task bắt buộc phải có branch riêng
- content: Git branch cho mỗi task
	1. Mỗi task phải làm trên một branch riêng theo format: `dev-<taskID>`.
	2. Khi bắt đầu task: tạo branch từ `staging`: `git checkout -b dev-<taskID> staging`.
	3. Chỉ merge khi task hoàn thành và working tree sạch.
- created: 2025-12-29
- group: git
- level: IMPORTANT

### Rule 20251229012: Tài liệu cho thư mục và file
- content: Mỗi file, thư mục cần phải có tài liệu mô tả
	1. Với folder: phải có file `README.md` mô tả mục đích và nội dung chính.
	2. Với file: phải có file `README_<tênfile>.md` mô tả mục đích, cách dùng, tham số đầu vào/đầu ra.
- created: 2025-12-29
- group: docs
- level: IMPORTANT

### Rule 20251229013: Thêm dữ liệu vào Doc-Site khi có tài liệu mới
- content: Theo dõi tài liệu trên Doc-Site
	1. Tạo file JSON trong `projects/doc-site/data/docs/<category>/xxx.json`.
	2. Thêm entry vào `projects/doc-site/data/docs-manifest.json`: `{ "file": "<category>/xxx.json", "title": "Display Title" }`.
- created: 2025-12-29
- group: docs
- level: IMPORTANT

### Rule 20251229015: Mọi hoạt động phải có plan cụ thể và history lưu lại
- content: Mọi hoạt động phải có plan và history
	1. Trước khi làm: tạo plan (todo list hoặc task file).
	2. Sau khi làm: log vào `logs/history.jsonl` với action/description/timestamp.
	3. Ưu tiên dùng `make history-add` để log.
- created: 2025-12-29
- group: process
- level: IMPORTANT

### Rule 20251229016: Mọi task phải có plan document
- content: Mọi task phải có plan document
	1. Trước khi bắt đầu task, phải có plan mô tả: objective, steps, expected output, success criteria.
	2. Plan có thể là file `.md` trong workspace, hoặc nội dung trong task JSON (nếu hệ thống hỗ trợ).
- created: 2025-12-29
- group: process
- level: IMPORTANT

### Rule 20251229017: Đặt tên file chuẩn
- content: Đặt tên file chuẩn
	1. Tên file phải bắt đầu bằng chữ thường.
	2. Các từ tiếp theo viết hoa chữ cái đầu.
	3. Không chứa ký tự đặc biệt hoặc khoảng trắng (có thể dùng ký tự '_' khi cần).
	4. Các từ nối liền nhau (camelCase).
- created: 2025-12-29
- group: code
- level: RECOMMENDED

### Rule 20251229018: Hạn chế thư viện bên ngoài
- content: Hạn chế thư viện bên ngoài
	1. Hạn chế sử dụng thư viện bên ngoài.
	2. Nếu dùng phải ghi rõ lý do và kế hoạch loại bỏ.
- created: 2025-12-29
- group: code
- level: RECOMMENDED

### Rule 20251229020: Định dạng mã
- content: Định dạng mã
	1. Mã rule theo định dạng `YYYYMMDDNNN` để dễ truy vết và sắp xếp.
	2. `NNN` là số thứ tự 001-999 trong ngày.
	3. Không tái sử dụng ID đã từng tồn tại.
- created: 2025-12-29
- group: process
- level: RECOMMENDED
