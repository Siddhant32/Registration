import fs from "fs";
import path from "path";

export default function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, enrollment, branch } = req.body;

    const filePath = path.join(process.cwd(), "students.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const studentFound = data.find(student =>
        student.name === name &&
        student.enrollment === enrollment &&
        student.branch === branch
    );

    if (studentFound) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(404).json({ success: false });
    }
}
