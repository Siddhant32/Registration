import fs from "fs";
import path from "path";

export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { enrollment } = req.body;

  const filePath = path.join(process.cwd(), "students.json");
  const students = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const student = students.find(
    s => s.enrollment === enrollment
  );

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  res.status(200).json({
    success: true,
    student
  });
}
