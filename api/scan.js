import students from "../students.json" assert { type: "json" };

let scannedToday = [];

export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const enrollment = String(req.body.enrollment || "").trim();

  // ❌ If no enrollment sent
  if (!enrollment) {
    return res.json({ status: "invalid" });
  }

  // 🔍 Check student exists
  const student = students.find(
    s => String(s.enrollment).trim() === enrollment
  );

  if (!student) {
    return res.json({ status: "invalid" });
  }

  // 🔁 Check duplicate
  const already = scannedToday.find(
    s => s.enrollment === enrollment
  );

  if (already) {
    return res.json({
      status: "duplicate",
      name: student.name,
      enrollment,
      time: already.time,
      total: scannedToday.length
    });
  }

  const time = new Date().toISOString();

  scannedToday.push({ enrollment, time });

  return res.json({
    status: "success",
    name: student.name,
    enrollment,
    time,
    total: scannedToday.length
  });
}
