const students = require("../students.json");

let scannedToday = [];

export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let enrollment = String(req.body.enrollment).trim();

  const student = students.find(
    s => String(s.enrollment) === enrollment
  );

  if (!student) {
    return res.json({ status: "invalid" });
  }

  const alreadyScanned = scannedToday.find(
    s => s.enrollment === enrollment
  );

  if (alreadyScanned) {
    return res.json({
      status: "duplicate",
      name: student.name,
      enrollment: student.enrollment,
      time: alreadyScanned.time,
      total: scannedToday.length
    });
  }

  const entryTime = new Date().toISOString();

  scannedToday.push({
    enrollment,
    time: entryTime
  });

  return res.json({
    status: "success",
    name: student.name,
    enrollment: student.enrollment,
    time: entryTime,
    total: scannedToday.length
  });
}
