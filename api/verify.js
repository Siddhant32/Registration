import fs from "fs";

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

    const students = JSON.parse(
      fs.readFileSync("./students.json", "utf8")
    );

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

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server crash"
    });
  }
}
