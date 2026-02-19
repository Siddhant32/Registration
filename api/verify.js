import fs from "fs";
import path from "path";

export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { enrollment, branch, name } = req.body;

  const filePath = path.join(process.cwd(), "students.json");
  const students = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const student = students.find(
    s =>
      s.enrollment === enrollment &&
      s.branch.toLowerCase() === branch.toLowerCase() &&
      s.name.toLowerCase().trim() === name.toLowerCase().trim()
  );

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student data mismatch ❌"
    });
  }

  res.status(200).json({
    success: true,
    student
  });
}
