import http from "http";
const students = [];
const server = http.createServer((req, res) => {
    const { method, url } = req;
    // Create a student
    if (method === "POST" && url === "/students") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const newStudent = JSON.parse(body);
            students.push(newStudent);
            res.writeHead(201, {
                "Content-Type": "application/json"
            });
            res.end(
                JSON.stringify({
                    message: "Student created successfully",
                    data: newStudent
                })
            );
        });
    }
    // Read all students
    else if (method === "GET" && url === "/students") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(
            JSON.stringify({
                message: "All Students fetched successfully",
                data: students
            })
        );
    }
    // Read student by ID
    else if (
        method === "GET" &&
        url.startsWith("/students/")
    ) {
        const studentId = parseInt(url.split("/")[2]);
        const student = students.find(
            (stu) => stu.id === studentId
        );
        if (student) {
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end(
                JSON.stringify({
                    message: "Student details fetched successfully",
                    data: student
                })
            );
        } else {
            res.writeHead(404, {
                "Content-Type": "application/json"
            });
            res.end(
                JSON.stringify({
                    message: "Student not found"
                })
            );
        }
    }
    // Update a student by ID
    else if (
        method === "PUT" &&
        url.startsWith("/students/")
    ) {
        const studentId = parseInt(url.split("/")[2]);
        const studentIndex = students.findIndex(
            (stu) => stu.id === studentId
        );
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            if (studentIndex !== -1) {
                const updateStudent = {
                    ...students[studentIndex],
                    ...JSON.parse(body)
                };
                students[studentIndex] = updateStudent;
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.end(
                    JSON.stringify({
                        message: "Student updated successfully",
                        data: updateStudent
                    })
                );
            } else {
                res.writeHead(404, {
                    "Content-Type": "application/json"
                });
                res.end(
                    JSON.stringify({
                        message: "Student not found"
                    })
                );
            }
        });
    }
    // Delete a student by ID
    else if (
        method === "DELETE" &&
        url.startsWith("/students/")
    ) {
        const studentIndex = parseInt(
            url.split("/")[2]
        );

        if (studentIndex !== -1) {
            const deletedStudent = students.splice(
                studentIndex,
                1
            )[0];

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(
                JSON.stringify({
                    message: "Student deleted successfully",
                    data: deletedStudent
                })
            );
        } else {
            res.writeHead(404, {
                "Content-Type": "application/json"
            });
            res.end(
                JSON.stringify({
                    message: "Student not found"
                })
            );
        }
    }
    // Route not found
    else {
        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(
            JSON.stringify({
                message: "Route not found"
            })
        );
    }
});

server.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
});