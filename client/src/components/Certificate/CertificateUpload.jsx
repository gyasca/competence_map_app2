import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Button, 
  Typography, 
  Box, 
  CircularProgress, 
  TextField,
  Card,
  CardContent,
  CardActions,
  IconButton
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import http from "../../http";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const FOLDER_NAME = "certificates"; // Folder name for certificate uploads
const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;

const CertificateUpload = ({ userId, moduleCode, onUploadSuccess, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const isSubmittedRef = useRef(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > MAX_FILE_SIZE) {
          toast.error("Maximum file size is 1MB");
          return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
          // Upload the file
          const uploadResponse = await http.post(
            `/file/upload/${FOLDER_NAME}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("File upload response:", uploadResponse.data);
          setUploadedFile({
            filename: uploadResponse.data.filename,
            originalname: file.name,
            previewUrl: URL.createObjectURL(file) // Create a preview URL
          });
          toast.success("File uploaded successfully. Please submit the certificate.");
        } catch (err) {
          setError("Failed to upload file. Please try again.");
          console.error("Upload error:", err);
          if (err.response) {
            console.error("Error response:", err.response.data);
            toast.error(`Upload failed: ${err.response.data.message || err.response.data.error || "Unknown error"}`);
          } else {
            toast.error("Upload failed. Please try again.");
          }
        } finally {
          setUploading(false);
        }
      } else {
        toast.error("No file selected or file type not accepted.");
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  });

  // Handle file rejections
  useEffect(() => {
    fileRejections.forEach(({ file, errors }) => {
      if (errors[0]?.code === "file-too-large") {
        toast.error(`File is larger than 1MB`);
      } else if (errors[0]?.code === "file-invalid-type") {
        toast.error(`File type must be .jpeg, .jpg, .png, .gif, or .pdf`);
      } else {
        toast.error(`File error: ${errors[0]?.message}`);
      }
    });
  }, [fileRejections]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for the certificate");
      return;
    }

    if (!uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create the certificate
      const certificateData = {
        moduleCode,
        title: title.trim(),
        filePath: uploadedFile.filename,
      };

      console.log("Certificate data:", certificateData);

      const certificateResponse = await http.post(
        `/certificate/create/${userId}`,
        certificateData
      );

      console.log("Certificate creation response:", certificateResponse.data);

      onUploadSuccess(certificateResponse.data);
      toast.success("Certificate submitted successfully!");
      isSubmittedRef.current = true;
      setTitle("");
      setUploadedFile(null);
    } catch (err) {
      setError("Failed to submit certificate. Please try again.");
      console.error("Submission error:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
        toast.error(`Submission failed: ${err.response.data.message || err.response.data.error || "Unknown error"}`);
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (uploadedFile) {
      try {
        await http.delete(`/file/delete/folder/${FOLDER_NAME}/file/${uploadedFile.filename}`);
        URL.revokeObjectURL(uploadedFile.previewUrl); // Revoke the preview URL
        setUploadedFile(null);
        toast.success("File deleted successfully");
      } catch (error) {
        console.error("Error deleting uploaded file:", error);
        toast.error("Failed to delete uploaded file");
      }
    }
  };

  useEffect(() => {
    return () => {
      // Clean up function to delete the uploaded file when the component unmounts
      if (uploadedFile && !isSubmittedRef.current) {
        http.delete(`/file/delete/folder/${FOLDER_NAME}/file/${uploadedFile.filename}`)
          .then(() => console.log("Unsent file deleted successfully"))
          .catch((error) => console.error("Error deleting uploaded file:", error));
        URL.revokeObjectURL(uploadedFile.previewUrl); // Revoke the preview URL
      }
    };
  }, [uploadedFile]);

  return (
    <Card sx={{boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: 1}}>
      <CardContent sx={{mb: 2}}>
        <Typography variant="subtitle1" gutterBottom>
          Upload Certificate
        </Typography>
        <TextField
          fullWidth
          label="Certificate Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        {!uploadedFile && (
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #cccccc",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <CircularProgress />
            ) : isDragActive ? (
              <Typography>Drop the file here ...</Typography>
            ) : (
              <Box>
                <CloudUploadIcon sx={{ fontSize: 48, color: "#999" }} />
                <Typography>
                  Drag 'n' drop a file here, or click to select a file
                </Typography>
                <Typography variant="caption">
                  (Accepted formats: JPEG, PNG, GIF, PDF. Max size: 1MB)
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {uploadedFile && (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {uploadedFile.filename.match(/\.(jpeg|jpg|png|gif)$/i) ? (
              <Box sx={{ width: '100%', maxWidth: 300, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', mb: 2 }}>
                <img 
                  src={uploadedFile.previewUrl} 
                  alt="Uploaded certificate" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                />
              </Box>
            ) : (
              <Box sx={{ width: '100%', maxWidth: 300, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f0f0f0', mb: 2 }}>
                <Typography>PDF Preview Not Available</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Typography>
                File uploaded: {uploadedFile.originalname}
              </Typography>
              <IconButton onClick={handleDelete} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained" 
          disabled={!uploadedFile || uploading}
          fullWidth
          sx={{borderRadius: "8px 8px 15px 15px", mb: 2}}
        >
          SUBMIT CERTIFICATE
        </Button>
      </CardActions>
      <ToastContainer />
    </Card>
  );
};

export default CertificateUpload;