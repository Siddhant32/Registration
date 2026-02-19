import fs from "fs";
import path from "path";

function clean(text) {
  return String(text)
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export default function handler(req, res) {
  try {

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

    const students = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    const inputEnrollment = clean(enrollment);
    const inputName = clean(name);
    const inputBranch = clean(branch);

    const student = students.find(s =>
      clean(s.enrollment) === inputEnrollment &&
      clean(s.name) === inputName &&
      clean(s.branch) === inputBranch
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

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server crash"
    });
  }
}
