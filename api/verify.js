import fs from "fs";

export default function handler(req, res) {
  try {

    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { enrollment, name, branch } = req.body;

    const students = JSON.parse(
      fs.readFileSync("./students.json", "utf8")
    );

    console.log("INPUT VALUES:");
    console.log("Enrollment:", enrollment);
    console.log("Name:", name);
    console.log("Branch:", branch);

    console.log("FIRST STUDENT IN JSON:");
    console.log(students[0]);

    const student = students.find(s =>
      String(s.enrollment).trim() === String(enrollment).trim() &&
      s.name.trim().toLowerCase() === name.trim().toLowerCase() &&
      s.branch.trim().toLowerCase() === branch.trim().toLowerCase()
    );

    console.log("MATCH RESULT:", student);

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

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server crash"
    });
  }
}
