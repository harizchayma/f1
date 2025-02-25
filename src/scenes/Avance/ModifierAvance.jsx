import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';

function ModifierAvance({ open, handleClose, avanceId, onAvanceModifiee }) {
    const [avance, setAvance] = useState({
        cin: '',
        date: '',
        Numero_contrat: '',
    });

    useEffect(() => {
        if (avanceId) {
            axios.get(`http://localhost:7001/avance/${avanceId}`)
                .then(response => setAvance(response.data.data))
                .catch(error => console.error('Error fetching avance:', error));
        }
    }, [avanceId]);

    const handleChange = (e) => {
        setAvance({ ...avance, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        axios.put(`http://localhost:7001/avance/${avanceId}`, avance)
            .then(response => {
                onAvanceModifiee(response.data.data);
                handleClose();
            })
            .catch(error => console.error('Error updating avance:', error));
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}
            >Modifier Avance</DialogTitle>
            <DialogContent>
                <TextField label="CIN" name="cin" value={avance.cin} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Date" name="date" value={avance.date} onChange={handleChange} fullWidth margin="normal" />
                <TextField
                    label="Numéro de Contrat"
                    name="Numero_contrat"
                    value={avance.Numero_contrat}
                    InputProps={{ readOnly: true }} // Rendre le champ en lecture seule
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary"sx={{ bgcolor: "#d32f2f", color: "white",  px: 3, py: 1.5, fontWeight: "bold", '&:hover': { bgcolor: "#1565c0" } }}
                >Annuler</Button>
                <Button onClick={handleSubmit} color="primary" sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#1565c0" } }}
                >Enregistrer</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModifierAvance;