import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { roll } = req.query;

  const filePath = path.join(process.cwd(), "students.json");
  const students = JSON.parse(fs.readFileSync(filePath));

  const student = students.find(s => s.roll === roll);

  if (!student) {
    return res.status(404).json({ success: false, message: "Student Not Found" });
  }

  if (student.scanned) {
    return res.status(200).json({
      success: false,
      message: "Already Scanned",
      name: student.name
    });
  }

  // Mark as scanned
  student.scanned = true;
  student.entryTime = new Date().toISOString();

  fs.writeFileSync(filePath, JSON.stringify(students, null, 2));

  return res.status(200).json({
    success: true,
    message: "Entry Allowed",
    name: student.name,
    time: student.entryTime
  });
}
