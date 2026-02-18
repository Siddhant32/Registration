import fs from "fs";
import path from "path";

export default function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { enrollment } = req.body;

    if (!enrollment) {
        return res.status(400).json({ status: "invalid" });
    }

    const studentsPath = path.join(process.cwd(), "students.json");
    const entriesPath = path.join(process.cwd(), "entries.json");

    // Read student list
    const students = JSON.parse(fs.readFileSync(studentsPath, "utf8"));

    // Check if student exists
    const studentExists = students.find(
        s => s.enrollment === enrollment
    );

    if (!studentExists) {
        return res.status(404).json({ status: "invalid" });
    }

    // Create entries.json if not exists
    if (!fs.existsSync(entriesPath)) {
        fs.writeFileSync(entriesPath, JSON.stringify([]));
    }

    let entries = JSON.parse(fs.readFileSync(entriesPath, "utf8"));

    // Check duplicate entry
    const alreadyEntered = entries.find(
        e => e.enrollment === enrollment
    );

    if (alreadyEntered) {
        return res.status(200).json({
            status: "duplicate",
            total: entries.length
        });
    }

    // Add new entry
    entries.push({
        enrollment,
        time: new Date().toISOString()
    });

    fs.writeFileSync(entriesPath, JSON.stringify(entries, null, 2));

    return res.status(200).json({
        status: "success",
        total: entries.length
    });
}
