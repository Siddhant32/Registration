const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { enrollment, name, branch } = req.body;

  if (!enrollment || !name || !branch) {
    return res.status(400).json({
      success: false,
      message: "Missing fields"
    });
  }

  const filePath = path.join(process.cwd(), "students.json");
  const students = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const student = students.find(s =>
    s.enrollment === enrollment &&
    s.name === name &&
    s.branch === branch
  );

  if (!student) {
    return res.status(400).json({
      success: false,
      message: "Student not found"
    });
  }

  return res.status(200).json({
    success: true,
    student
  });
};
