import React, { useState } from "react";
import axios from "axios";

function CSVUpload() {
  const [files, setFiles] = useState([]);

  const onFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const onUpload = async () => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("csv", file); // csv0, csv1, ...
    });

    try {
      const response = await axios.post("/api/upload-csv", formData);
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading CSV:", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" multiple onChange={onFileChange} />
      <button onClick={onUpload}>Upload</button>
    </div>
  );
}

export default CSVUpload;
