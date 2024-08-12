import React, { useState, useEffect, useContext } from "react";
import CertificateGallery from '../components/Certificate/CertificateGallery';
import { Container, CircularProgress, Box } from "@mui/material";
import { UserContext } from '../main'; // Adjust the import path as needed

function ViewCertificates() {
    const { user } = useContext(UserContext);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserId = async () => {
            if (user && user.userId) {
                setUserId(user.userId);
            } else {
                console.error("User ID not found in user context");
            }
            setIsLoading(false);
        };

        fetchUserId();
    }, [user]);

    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!userId) {
        return (
            <Container maxWidth="xl" sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>User ID not found. Please check your login status or contact support.</Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ height: "80vh" }}>
            <CertificateGallery userId={userId} />
        </Container>
    );
}

export default ViewCertificates;