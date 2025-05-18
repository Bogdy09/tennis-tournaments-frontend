import React, { useState } from "react";
import axios from "axios";

export default function Upload() {
    const [file, setFile] = useState(null);
    const [uploadURL, setUploadURL] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setUploadURL(res.data.url);
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    return (
        <div>
            <h2>Upload a File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} style={{ marginTop: "10px" }}>
                Upload
            </button>

            {uploadURL && (
                <div style={{ marginTop: "20px" }}>
                    <strong>Download link:</strong>{" "}
                    <a href={`http://localhost:5000${uploadURL}`} download>
                        {uploadURL.split("/").pop()}
                    </a>
                </div>
            )}
        </div>
    );
}
