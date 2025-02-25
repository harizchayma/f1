import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Paper, CircularProgress, Typography } from "@mui/material";
import axios from "axios";

function AjouteChauffeur({ open, handleClose, newChauffeur, setNewChauffeur, index, setNewChauffeurs, defaultContractNumber }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [localChauffeur, setLocalChauffeur] = useState({ ...newChauffeur, Numero_contrat: defaultContractNumber }); // Utiliser Numero_contrat

    useEffect(() => {
        if (defaultContractNumber && defaultContractNumber !== "") {
            setLocalChauffeur(prev => ({ ...prev, Numero_contrat: defaultContractNumber })); // Utiliser Numero_contrat
        } else {
            console.error("defaultContractNumber is undefined or empty.");
        }
    }, [defaultContractNumber]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalChauffeur((prev) => ({ ...prev, [name]: value }));
    };

    const addChauffeur = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = {
                Numero_contrat: localChauffeur.Numero_contrat,
                nom_fr: localChauffeur.nom_fr,
                nom_ar: localChauffeur.nom_ar,
                prenom_fr: localChauffeur.prenom_fr,
                prenom_ar: localChauffeur.prenom_ar,
                cin_chauffeur: localChauffeur.cin_chauffeur,
                date_cin_chauffeur: localChauffeur.date_cin_chauffeur,
                date_naiss: localChauffeur.date_naiss,
                adresse_fr: localChauffeur.adresse_fr,
                adresse_ar: localChauffeur.adresse_ar,
                num_tel: localChauffeur.num_tel,
                numero_permis: localChauffeur.numero_permis,
                date_permis: localChauffeur.date_permis,
                nationalite_origine: localChauffeur.nationalite_origine,
                profession_fr: localChauffeur.profession_fr,
                profession_ar: localChauffeur.profession_ar,
            };
            console.log("Data envoyée:", data);
            await axios.post("http://localhost:7001/chauffeur", data);
            setLoading(false);
            handleClose();
            if (index !== undefined) {
                setNewChauffeurs((prev) => {
                    const updatedChauffeurs = { ...prev };
                    delete updatedChauffeurs[index];
                    return updatedChauffeurs;
                });
            }
            setNewChauffeur({});
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || "Erreur lors de l'ajout du chauffeur.";
            setError(errorMessage);
            console.error("Erreur lors de l'ajout du chauffeur:", err);
            console.error("Error Details:", err.response);
            if (err.response && err.response.data) {
                console.log("Response Data : ", err.response.data);
            }
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontSize: "1.4rem", fontWeight: "bold", textAlign: "center", bgcolor: "#1976d2", color: "white" }}>
                Ajouter Chauffeur
            </DialogTitle>
            <DialogContent>
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Numéro Contrat: {localChauffeur.Numero_contrat}
                    </Typography>
                    <Grid container spacing={2}>
                        {[
                            { label: "Numéro Contrat", field: "Numero_contrat" }, // Modifier ici
                            { label: "Nom (FR)", field: "nom_fr" },
                            { label: "Nom (AR)", field: "nom_ar" },
                            { label: "Prénom (FR)", field: "prenom_fr" },
                            { label: "Prénom (AR)", field: "prenom_ar" },
                            { label: "CIN", field: "cin_chauffeur" },
                            { label: "Date CIN", field: "date_cin_chauffeur", type: "date" },
                            { label: "Date de Naissance", field: "date_naiss", type: "date" },
                            { label: "Adresse (FR)", field: "adresse_fr" },
                            { label: "Adresse (AR)", field: "adresse_ar" },
                            { label: "Numéro de Téléphone", field: "num_tel" },
                            { label: "Numéro de Permis", field: "numero_permis" },
                            { label: "Date de Permis", field: "date_permis", type: "date" },
                            { label: "Profession (FR)", field: "profession_fr" },
                            { label: "Profession (AR)", field: "profession_ar" },
                            { label: "Nationalité d'Origine", field: "nationalite_origine" },
                        ].map(({ label, field, type, disabled }) => (
                            <Grid item xs={12} sm={6} key={field}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label={label}
                                    name={field}
                                    value={localChauffeur[field] || ""}
                                    onChange={handleChange}
                                    type={type || "text"}
                                    InputLabelProps={type === "date" ? { shrink: true } : {}}
                                    sx={{ mb: 2 }}
                                    disabled={disabled}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </DialogContent>
            <DialogActions sx={{ padding: 2, justifyContent: "flex-end" }}>
                <Button disabled={loading} onClick={addChauffeur} color="primary" variant="contained" sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#1565c0" } }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Ajouter"}
                </Button>
                <Button disabled={loading} onClick={handleClose} color="error" variant="outlined" sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#b71c1c" } }}>
                    Annuler
                </Button>
            </DialogActions>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        </Dialog>
    );
}

export default AjouteChauffeur;