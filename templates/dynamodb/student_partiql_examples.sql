-- ==========================================
-- DYNAMODB PARTIQL EXAMPLES (BẢNG STUDENT)
-- ==========================================

-- 1. Tìm kiếm học sinh dựa theo tên chứa từ khóa 'Linh'
-- (Sử dụng hàm CONTAINS cho kiểu dữ liệu String/Sort Key)
SELECT * 
FROM "student"
WHERE CONTAINS(name, 'Linh');


-- 2. Tìm kiếm học sinh chưa kết hôn (is_married = false)
-- (Truy vấn theo trường kiểu Boolean)
SELECT * 
FROM "student"
WHERE is_married = false;


-- 3. Tìm kiếm học sinh có kỹ năng (skills) chứa 'guitar'
-- (Sử dụng hàm CONTAINS cho kiểu dữ liệu String Set - SS)
SELECT * 
FROM "student"
WHERE CONTAINS(skills, 'guitar');


-- 4. Tìm kiếm học sinh có sở thích (hobbies) chứa 'piano'
-- (Sử dụng hàm CONTAINS cho kiểu dữ liệu String Set - SS)
SELECT * 
FROM "student"
WHERE CONTAINS(hobbies, 'piano');
