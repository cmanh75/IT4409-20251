const data = [
  { semester: "20241", code: "IT3090", name: "Cơ sở dữ liệu", credit: 3, process: 8, final: 7.5, letter: "B" },
  { semester: "20241", code: "IT3150", name: "Project I", credit: 2, process: 10, final: 10, letter: "A+" },
  { semester: "20241", code: "IT3160", name: "Nhập môn Trí tuệ nhân tạo", credit: 3, process: 8.5, final: 7.5, letter: "B" },
  { semester: "20241", code: "IT3170", name: "Thuật toán ứng dụng", credit: 2, process: 9.5, final: 10, letter: "A+" },
  { semester: "20241", code: "IT3180", name: "Nhập môn công nghệ phần mềm", credit: 3, process: 8.5, final: 6, letter: "B" },
  { semester: "20241", code: "PE2101", name: "Bóng chuyền 1", credit: 0, process: 7, final: 7, letter: "B" },
  { semester: "20241", code: "PE2261", name: "Karatedo", credit: 0, process: 5, final: 5, letter: "D+" },
  { semester: "20241", code: "PE2401", name: "Bóng bàn 1", credit: 0, process: 5, final: 5, letter: "D+" },
  { semester: "20241", code: "PE2801", name: "Nhảy xa", credit: 0, process: 8, final: 8, letter: "B+" },
  { semester: "20242", code: "ED3280", name: "Tâm lý học ứng dụng", credit: 2, process: 10, final: 8, letter: "A" },
  { semester: "20242", code: "EM1010", name: "Quản trị học đại cương", credit: 2, process: 9.5, final: 8, letter: "A" },
  { semester: "20242", code: "IT2030", name: "Technical Writing and Presentation", credit: 3, process: 8.5, final: 8, letter: "B+" },
  { semester: "20242", code: "IT3120", name: "Phân tích và thiết kế hệ thống", credit: 2, process: 9.5, final: 7, letter: "B+" },
  { semester: "20242", code: "IT3190", name: "Nhập môn Khai phá dữ liệu", credit: 3, process: 8.5, final: 7, letter: "B" },
  { semester: "20242", code: "IT3930", name: "Project II", credit: 2, process: 9, final: 8.5, letter: "A" },
  { semester: "20242", code: "IT4015", name: "Nhập môn An toàn thông tin", credit: 3, process: 8.5, final: 5, letter: "C" },
  { semester: "20242", code: "IT4244", name: "Quản trị dự án CNTT", credit: 2, process: 7.5, final: 8.5, letter: "B+" },
  { semester: "20242", code: "IT4441", name: "Giao diện và trải nghiệm người dùng", credit: 3, process: 8.5, final: 8.5, letter: "A" }
];


let filtered = [...data];
const tbody = document.querySelector("#resultTable tbody");

function renderTable() {
  tbody.innerHTML = "";
  filtered.forEach((r) => {
    const tr = document.createElement("tr");
    tr.dataset.letter = r.letter;
    tr.innerHTML = `
      <td>${r.semester}</td>
      <td>${r.code}</td>
      <td>${r.name}</td>
      <td>${r.credit}</td>
      <td>${r.process}</td>
      <td>${r.final}</td>
      <td><strong>${r.letter}</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

renderTable();

function gradeToPoint(letter) {
  switch (letter) {
    case "A+": return 4.0;
    case "A": return 4.0;
    case "B+": return 3.5;
    case "B": return 3.0;
    case "C+": return 2.5;
    case "C": return 2.0;
    case "D+": return 1.5;
    case "D": return 1.0;
    default: return 0.0;
  }
}

document.querySelector(".highlight").addEventListener("click", () => {
  const rows = tbody.querySelectorAll("tr");
  rows.forEach((row) => {
    const letter = row.dataset.letter;
    row.style.backgroundColor = "";
    row.style.color = "";
    if (letter === "A" || letter === "A+") {
      row.style.backgroundColor = "#d1fae5";
    } else if (letter === "F") {
      row.style.backgroundColor = "#e5e7eb";
      row.style.color = "black";
    }
  });
});

document.querySelector(".gpa").addEventListener("click", () => {
  const semesters = ["20241", "20242"];
  let message = "";
  semesters.forEach((sem) => {
    const semData = filtered.filter((r) => r.semester === sem);
    const totalCredits = semData.reduce((sum, r) => sum + r.credit, 0);
    const totalPoints = semData.reduce((sum, r) => sum + r.credit * gradeToPoint(r.letter), 0);
    const gpa = (totalPoints / totalCredits).toFixed(2);
    message += `GPA ${sem}: ${gpa}\n`;
  });
  alert(message);
});

document.querySelector(".filter").addEventListener("click", () => {
  filtered = data.filter(r => r.letter === "A" || r.letter === "A+");
  renderTable();
});

document.querySelector(".sort").addEventListener("click", () => {
  filtered.sort((a, b) => {
    if (a.letter === 'A+') return -1;
    if (b.letter === 'A+') return 1;
    return a.letter.localeCompare(b.letter);
  });
  renderTable();
});

document.querySelector(".reset").addEventListener("click", () => {
  filtered = [...data];
  renderTable();
});
