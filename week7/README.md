Ứng dụng React này cho phép người dùng tra cứu kết quả học tập của sinh viên theo mã số sinh viên.  
Thành phần (component) chính **App.jsx** quản lý toàn bộ state của ứng dụng, bao gồm: mã sinh viên, thông tin sinh viên, kết quả học tập, trạng thái tải và lỗi.  
**SearchForm.jsx** chịu trách nhiệm nhận input từ người dùng và gửi yêu cầu tra cứu.  
**ResultTable.jsx** hiển thị danh sách các học phần, số tín chỉ và điểm số tương ứng.  
**LoadingIndicator.jsx** hiển thị trạng thái đang tải khi dữ liệu đang được truy xuất.  

Hook **useState** được sử dụng để quản lý dữ liệu động (mã sinh viên, kết quả, lỗi, trạng thái tải).  
Hook **useEffect** được kích hoạt sau khi người dùng nhấn nút tra cứu, dùng để xử lý việc tải dữ liệu bất đồng bộ từ các file JSON.  
Dữ liệu sinh viên, học phần và kết quả được lấy từ các file JSON nằm trong thư mục **public**.  
