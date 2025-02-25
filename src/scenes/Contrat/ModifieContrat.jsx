import React, { useEffect, useState, useCallback } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from "@mui/material";
import axios from "axios";

function ModifieContrat({ open, handleClose, contrat, setContrat, handleUpdateContrat }) {
    if (!contrat) {
        return null; // Return null if contrat is not provided
    }

    const { Numero_contrat, cin, num_immatriculation } = contrat; // Use cin instead of ID_client

    const [clientDetails, setClientDetails] = useState({});
    const [vehiculeDetails, setVehiculeDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError("");

            try {
                // Fetch client details using CIN
                if (cin) {
                    const { data: clientData } = await axios.get(`http://localhost:7001/client?cin=${cin}`);
                    console.log("Client Data:", clientData); // Debugging log
                    setClientDetails(clientData?.data[0] || {}); // Assuming data is an array
                } else {
                    console.warn("CIN est manquant.");
                }

                // Fetch vehicle details
                if (num_immatriculation) {
                    const { data: vehicleData } = await axios.get(`http://localhost:7001/vehicules?num_immatriculation=${num_immatriculation}`);
                    console.log("Vehicle Data:", vehicleData); // Debugging log
                    setVehiculeDetails(vehicleData?.data[0] || {});
                } else {
                    console.warn("Numéro d'immatriculation est manquant.");
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des détails:", err);
                setError("Erreur lors de la récupération des détails. Vérifiez la console pour plus de détails.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [cin, num_immatriculation]);

    const handleChange = useCallback((field) => (event) => {
        setContrat((prev) => ({ ...prev, [field]: event.target.value }));
    }, [setContrat]);

    const handleUpdate = useCallback(async () => {
        if (!contrat || !contrat.Numero_contrat) {
            setError("Numero_contrat is missing or invalid");
            return;
        }

        const updatedContrat = {
            ...contrat,
            Date_debut: new Date(contrat.Date_debut).toISOString(),
            Date_retour: new Date(contrat.Date_retour).toISOString(),
            Duree_location: parseInt(contrat.Duree_location, 10),
            Prolongation: parseInt(contrat.Prolongation, 10),
            Prix_total: parseFloat(contrat.Prix_total),
            Frais: parseFloat(contrat.Frais),
        };

        try {
            const { data } = await axios.put(`http://localhost:7001/contrat/${contrat.ID_contrat}`, updatedContrat);
            handleUpdateContrat(data.data);
            handleClose(); // Close the dialog after updating
            setError('');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || "Erreur lors de la mise à jour du contrat");
            } else {
                setError("Erreur lors de la mise à jour du contrat");
            }
        }
    }, [contrat, handleUpdateContrat, handleClose]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            sx={{ "& .MuiDialog-paper": { height: "85vh", maxHeight: "100vh", overflowY: "auto" } }}
        >
            <DialogTitle sx={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", bgcolor: "#1976d2", color: "white" }}>
                Modifier le Contrat
            </DialogTitle>
    
            <DialogContent sx={{ p: 3 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {error && <Typography color="error">{error}</Typography>}
                        <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 3 }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {[
                                        { label: "Numéro de Contrat", key: "Numero_contrat", readOnly: true },
                                        { label: "Date de Début", key: "Date_debut", type: "date" },
                                        { label: "Heure de Début", key: "Heure_debut" },
                                        { label: "Date de Retour", key: "Date_retour", type: "date" },
                                        { label: "Heure de Retour", key: "Heure_retour" },
                                        { label: "Durée de Location (jours)", key: "Duree_location", type: "number" },
                                        { label: "Prolongation", key: "Prolongation", type: "number" },
                                        { label: "Prix Total", key: "Prix_total", type: "number" },
                                        { label: "Pièce de Garantie", key: "Piece_garantie" },
                                        { label: "Frais", key: "Frais", type: "number" },
                                    ].map(({ label, key, type, readOnly }, index) => (
                                        <Grid item xs={12} sm={6} key={key || index}>
                                            <TextField
                                                label={label}
                                                type={type || "text"}
                                                fullWidth
                                                variant="outlined"
                                                value={contrat[key] || ""}
                                                onChange={readOnly ? undefined : handleChange(key)}
                                                InputLabelProps={type === "date" ? { shrink: true } : {}}
                                                InputProps={{ readOnly: readOnly }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                        {clientDetails && Object.keys(clientDetails).length > 0 && (
                            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 2, mt: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Détails du Client</Typography>
                                    <Grid container spacing={1.5}>
                                        {[
                                            { label: "Nom (FR)", value: clientDetails.nom_fr },
                                            { label: "Nom (AR)", value: clientDetails.nom_ar },
                                            { label: "Prénom (FR)", value: clientDetails.prenom_fr },
                                            { label: "Prénom (AR)", value: clientDetails.prenom_ar },
                                            { label: "CIN", value: clientDetails.cin },
                                            { label: "Date CIN", value: clientDetails.date_cin },
                                            { label: "Date de Naissance", value: clientDetails.date_naiss },
                                            { label: "Adresse (FR)", value: clientDetails.adresse_fr },
                                            { label: "Adresse (AR)", value: clientDetails.adresse_ar },
                                            { label: "Numéro de Téléphone", value: clientDetails.num_tel },
                                            { label: "Numéro de Permis", value: clientDetails.numero_permis },
                                            { label: "Date de Permis", value: clientDetails.date_permis },
                                            { label: "Profession (FR)", value: clientDetails.profession_fr },
                                            { label: "Profession (AR)", value: clientDetails.profession_ar },
                                            { label: "Nationalité d'Origine", value: clientDetails.nationalite_origine },
                                        ].map(({ label, value }, index) => (
                                            <Grid item xs={12} sm={6} key={label}>
                                                <TextField
                                                    label={label}
                                                    type="text"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={value || ""}
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}
                        {vehiculeDetails && Object.keys(vehiculeDetails).length > 0 && (
                            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 2, mt: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Détails du Véhicule</Typography>
                                    <Grid container spacing={1.5}>
                                        {[
                                            { label: "Numéro Immatriculation", value: vehiculeDetails.num_immatriculation },
                                            { label: "Numéro de Châssis", value: vehiculeDetails.n_serie_du_type },
                                            { label: "Marque", value: vehiculeDetails.constructeur },
                                            { label: "Modèle", value: vehiculeDetails.type_constructeur },
                                            { label: "Carrosserie", value: vehiculeDetails.carrosserie },
                                            { label: "Énergie", value: vehiculeDetails.energie },
                                            { label: "Puissance Fiscale", value: vehiculeDetails.puissance_fiscale },
                                            { label: "Nombre de Places", value: vehiculeDetails.nbr_places },
                                            { label: "Cylindrée", value: vehiculeDetails.cylindree },
                                            { label: "Numéro Certificat", value: vehiculeDetails.num_certificat },
                                            { label: "Lieu Certificat", value: vehiculeDetails.lieu_certificat },
                                            { label: "Date Certificat", value: vehiculeDetails.date_certificat },
                                            { label: "Type Constructeur", value: vehiculeDetails.type_constructeur },
                                        ].map(({ label, value }, index) => (
                                            <Grid item xs={12} sm={6} key={label}>
                                                <TextField
                                                    label={label}
                                                    type="text"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={value || ""}
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                    onClick={handleUpdate}
                    variant="contained"
                    sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#1565c0" } }}
                >
                    Modifier
                </Button>
                <Button
                    onClick={() => {
                        setContrat(null); // Reset the contract state if needed
                        handleClose(); // Close the dialog
                    }}
                    variant="contained"
                    sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#b71c1c" } }}
                >
                    Annuler
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModifieContrat;