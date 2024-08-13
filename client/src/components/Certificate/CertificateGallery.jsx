import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import http from "../../http";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
  boxShadow:
    "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: "75%", // 4:3 aspect ratio
});

const EnlargedImage = styled("img")({
  width: "100%",
  maxHeight: "80vh",
  objectFit: "contain",
});

const CertificateGallery = ({ userId }) => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [enlargedCertificate, setEnlargedCertificate] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const fetchCertificates = useCallback(async () => {
    try {
      const response = await http.get(`/certificate/user/${userId}`);
      const certificatesWithUrls = response.data.map(cert => ({
        ...cert,
        fileUrl: cert.fileUrl || `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${cert.filePath}`
      }));
      setCertificates(certificatesWithUrls);
      setFilteredCertificates(certificatesWithUrls);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Failed to fetch certificates");
    }
  }, [userId]);

  const fetchModules = useCallback(async () => {
    try {
      const response = await http.get("/module/all");
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
      toast.error("Failed to fetch modules");
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
    fetchModules();
  }, [fetchCertificates, fetchModules]);

  useEffect(() => {
    const filtered = certificates.filter(
      (cert) =>
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedModule === "" || cert.moduleCode === selectedModule)
    );
    setFilteredCertificates(filtered);
  }, [searchTerm, selectedModule, certificates]);

  const handleDeleteCertificate = async (certificateId, publicId) => {
    setDeleteConfirmation({ id: certificateId, publicId: publicId });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await http.delete(`/certificate/${deleteConfirmation.id}`);
      // Note: Deleting from Cloudinary should be done on the backend for security
      await http.delete(`/file/delete/${deleteConfirmation.publicId}`);
      toast.success("Certificate deleted successfully");
      fetchCertificates();
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("Failed to delete certificate");
    } finally {
      setDeleteConfirmation(null);
    }
  };


  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleEnlargeCertificate = (certificate) => {
    setEnlargedCertificate(certificate);
  };

  const handleCloseEnlargedView = () => {
    setEnlargedCertificate(null);
  };

  const getModuleTitle = (moduleCode) => {
    const module = modules.find((mod) => mod.moduleCode === moduleCode);
    return module ? module.title : "Unknown Module";
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        My Certificates
      </Typography>
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          label="Search certificates"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Module</InputLabel>
          <Select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            label="Filter by Module"
          >
            <MenuItem value="">
              <em>All Modules</em>
            </MenuItem>
            {modules.map((module) => (
              <MenuItem key={module.moduleCode} value={module.moduleCode}>
                {module.moduleCode} - {module.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={4}>
        {filteredCertificates.map((certificate) => (
          <Grid item key={certificate.id} xs={12} sm={6} md={4}>
            <StyledCard>
              <StyledCardMedia
                image={certificate.fileUrl}
                title={certificate.title}
                onClick={() => handleEnlargeCertificate(certificate)}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {certificate.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Module Code: {certificate.moduleCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Module Title: {getModuleTitle(certificate.moduleCode)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded:{" "}
                  {new Date(certificate.createdAt).toLocaleDateString()}
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip label={certificate.moduleCode} color="primary" />
                  <IconButton
                    onClick={() =>
                      handleDeleteCertificate(
                        certificate.id,
                        certificate.filePath
                      )
                    }
                    color="error"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={enlargedCertificate !== null}
        onClose={handleCloseEnlargedView}
        maxWidth="md"
        fullWidth
      >
        {enlargedCertificate && (
          <>
            <DialogTitle>
              {enlargedCertificate.title}
              <IconButton
                aria-label="close"
                onClick={handleCloseEnlargedView}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <EnlargedImage
                src={enlargedCertificate.fileUrl}
                alt={enlargedCertificate.title}
              />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Module: {enlargedCertificate.moduleCode}
              </Typography>
              <Typography variant="body2">
                Uploaded on:{" "}
                {new Date(enlargedCertificate.createdAt).toLocaleDateString()}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>

      <Dialog
        open={deleteConfirmation !== null}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this certificate? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default CertificateGallery;
