// CSVUpload.js
import React, { useState } from 'react';
import axios from 'axios';

function CSVUpload() {
    const [file, setFile] = useState(null);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onUpload = async () => {
        const formData = new FormData();
        formData.append('csv', file);

        try {
            const response = await axios.post('/api/upload-csv', formData);
            console.log('Upload successful:', response.data);
        } catch (error) {
            console.error('Error uploading CSV:', error);
        }
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={onFileChange} />
            <button onClick={onUpload}>Upload</button>
        </div>
    );
}

export default CSVUpload;
