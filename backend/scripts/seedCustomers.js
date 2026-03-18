// scripts/seedCustomers.js
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import User from "../src/models/User.js"
import dotenv from "dotenv"

dotenv.config()
await mongoose.connect(process.env.MONGO_URI)

// ===== DATA =====
const FIRST_NAMES = [
  // Các họ phổ biến (chiếm ~90%)
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý",
  // Các họ ít phổ biến hơn nhưng vẫn quen thuộc
  "Trương", "Đào", "Đoàn", "Trịnh", "Vương", "Đinh", "Lâm", "Phùng", "Mai", "Tô", "Hà", "Tạ", "Cao", "Khương", "Quách",
  // Các họ hiếm/họ kép/gốc Hoa
  "Lương", "Thái", "Châu", "Tăng", "Hứa", "Diệp", "Nhan", "Vi", "Sử", "Tiêu", "Lục", "Âu", "Mạc", "Thạch", "Kim", "Viên"
]

const MIDDLE_NAMES = [
  // Truyền thống
  "Thị", "Văn", "Hữu", "Đức", "Minh", "Ngọc", "Thanh", "Quang", "Công", "Đình", "Trọng",
  // Hiện đại & Phổ biến (Unisex)
  "Anh", "Bảo", "Gia", "Khánh", "Xuân", "Tường", "Nhật", "Kim", "Thùy", "Phương", "Hải", "Tuấn",
  // Các từ đệm tạo sắc thái sang trọng
  "Thế", "Khôi", "Nhã", "Tú", "Diệu", "Cát", "Uyên", "An", "Bình", "Trúc", "Thành", "Vĩnh", "Hoàng"
]

const LAST_NAMES = [
  // Nhóm tên phổ biến cho cả Nam và Nữ
  "Anh", "Bình", "Châu", "Dũng", "Hà", "Hải", "Hân", "Hạnh", "Hiếu", "Hòa", "Hùng", "Khánh", "Lan", "Linh", "Mai", 
  "Nam", "Ngọc", "Nhung", "Phúc", "Quân", "Trang", "Trúc", "Tuấn", "Uyên", "Vy", "Yến", "Thủy",
  // Bổ sung thêm tên Nam mạnh mẽ
  "Sơn", "Lộc", "Long", "Kiệt", "Khoa", "Hoàng", "Huy", "Thịnh", "Phong", "Tiến", "Bách", "Cường", "Đạt", "Khôi", 
  "Minh", "Nhân", "Trung", "Việt", "Vinh", "Uy", "Tú", "Thắng", "Quốc", "Tùng", "Kha", "Du", "Bắc", "Trường", "Lương", "Thiện", "Sang",
  // Bổ sung thêm tên Nữ nhẹ nhàng
  "Thảo", "Diệp", "Quỳnh", "Huyền", "Trinh", "Tuyết", "Nga", "Kiều", "Nguyệt", "Cầm", "Lam", "Tú", "Hạ", "Mỹ", 
  "Tâm", "Thư", "Phương", "Dung", "Chi", "Trà", "Ân", "Hương", "Kỳ", "Tiên", "Như", "Oanh", "Hồng", "Hảo", "Hằng", "Thoa"
]

// remove dấu tiếng Việt
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
}

// random phone VN
const randomPhone = () => {
  const prefix = ["03", "05", "07", "08", "09"]
  const p = prefix[Math.floor(Math.random() * prefix.length)]
  let number = p
  for (let i = 0; i < 8; i++) {
    number += Math.floor(Math.random() * 10)
  }
  return number
}

// ===== MAIN =====
const EXISTING_USERS = await User.find({}, "name username email")

const usedNames = new Set(EXISTING_USERS.map(u => u.name))
const usedUsernames = new Set(EXISTING_USERS.map(u => u.username))
const usedEmails = new Set(EXISTING_USERS.map(u => u.email))

const newUsers = []
const TARGET = 986

while (newUsers.length < TARGET) {
  // random name
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
  const middle = MIDDLE_NAMES[Math.floor(Math.random() * MIDDLE_NAMES.length)]
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]

  const name = `${first} ${middle} ${last}`

  if (usedNames.has(name)) continue

  // username = 2 từ cuối
  const lastTwo = `${middle} ${last}`
  let username = removeVietnameseTones(lastTwo)
    .toLowerCase()
    .replace(/\s+/g, "")

  if (usedUsernames.has(username)) continue

  const email = `${username}@gmail.com`
  if (usedEmails.has(email)) continue

  usedNames.add(name)
  usedUsernames.add(username)
  usedEmails.add(email)

  newUsers.push({
    name,
    username,
    email,
    phone: randomPhone(),
    password: "123456",
    role: "customer",
    status: "active"
  })
}

// hash password
const hashedUsers = await Promise.all(
  newUsers.map(async (u) => ({
    ...u,
    password: await bcrypt.hash(u.password, 10)
  }))
)

// insert DB
await User.insertMany(hashedUsers)

console.log(`✅ Created ${hashedUsers.length} customers`)

process.exit()

// node scripts/seedCustomers.js