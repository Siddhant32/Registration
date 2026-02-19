import fs from "fs";
import path from "path";

let entries = []; // memory storage

export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { enrollment } = req.body;

  const studentsPath = path.join(process.cwd(), "students.json");
  const students = JSON.parse(fs.readFileSync(studentsPath, "utf8"));

  const student = students.find(
    s => s.enrollment === enrollment
  );

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Invalid QR ❌"
    });
  }

  const alreadyScanned = entries.find(
    e => e.enrollment === enrollment
  );

  if (alreadyScanned) {
    return res.json({
      success: false,
      message: "Already Scanned ❗",
      total: entries.length
    });
  }

  const record = {
    enrollment,
    name: student.name,
    time: new Date().toLocaleString()
  };

  entries.push(record);

  res.json({
    success: true,
    student,
    total: entries.length
  });
}
