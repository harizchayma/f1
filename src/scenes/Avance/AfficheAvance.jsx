import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Grid, Card, CardContent, Divider } from "@mui/material";
import axios from 'axios';

function AfficherAvance({ open, handleClose, selectedAvance }) {
    const [selectedDetailAvance, setSelectedDetailAvance] = useState(null);

    useEffect(() => {
        const fetchDetailAvance = async () => {
            if (selectedAvance && selectedAvance.Numero_avance) {
                try {
                    const response = await axios.get(`http://localhost:7001/detailAvance/${selectedAvance.Numero_avance}`);
                    setSelectedDetailAvance(response.data.data || {});
                } catch (error) {
                    console.error('Error fetching detail avance:', error);
                    setSelectedDetailAvance({});
                }
            } else {
                setSelectedDetailAvance({});
            }
        };

        fetchDetailAvance();
    }, [selectedAvance]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>
                Avance et Détails
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                {selectedAvance && (
                    <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
                        <CardContent>
                            <Grid container spacing={1.4}>
                                {[
                                    { label: "Numéro d'Avance", value: selectedAvance.Numero_avance },
                                    { label: "CIN", value: selectedAvance.cin },
                                    { label: "Date", value: selectedAvance.date },
                                    { label: "Numéro de Contrat", value: selectedAvance.Numero_contrat },
                                    { label: "Montant", value: selectedDetailAvance?.montant || "Non spécifié" },
                                    { label: "Banque", value: selectedDetailAvance?.banque || "Non spécifié" },
                                    { label: "Mode de règlement", value: selectedDetailAvance?.mode_reglement || "Non spécifié" }
                                ].map((item, index) => (
                                    <React.Fragment key={index}>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                                                {item.label} :
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" sx={{ color: '#555' }}>
                                                {item.value || "Non spécifié"}
                                            </Typography>
                                        </Grid>
                                        {index % 2 !== 0 && <Grid item xs={12} key={`divider-${index}`}><Divider /></Grid>}
                                    </React.Fragment>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" sx={{ bgcolor: "#d32f2f", color: "white", fontWeight: "bold", '&:hover': { bgcolor: "#1565c0" } }}>
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AfficherAvance;