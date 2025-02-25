import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

function Detailavance({
    open,
    onClose,
    avanceOptions,
    detailAvance,
    setDetailAvance,
    onAddDetailAvance,
}) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDetailAvance((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const banquesTunisiennes = [
        "Société Tunisienne de Banque (STB)",
        "Banque Nationale Agricole (BNA)",
        "Banque de l'Habitat (BH)",
        "Banque de Financement des Petites et Moyennes Entreprises (BFPME)",
        "Banque Tunisienne de Solidarité (BTS)",
        "Banque de Tunisie et des Émirats (BTE)",
        "Banque Tuniso-Libyenne (BTL)",
        "Tunisian Saudi Bank (TSB)",
        "Banque Zitouna",
        "Al Baraka Bank",
        "Al Wifak International Bank",
        "Amen Bank",
        "Attijari Bank",
        "Arab Tunisian Bank (ATB)",
        "Arab Banking Corporation (ABC)",
        "Banque Internationale Arabe de Tunisie (BIAT)",
        "Banque de Tunisie (BT)",
        "Banque Tuniso-Koweïtienne (BTK)",
        "Banque Franco-Tunisienne (BFT)",
        "Citi Bank",
        "Qatar National Bank (QNB)",
        "Union Bancaire pour le Commerce et l'Industrie (UBCI)",
        "Union Internationale de Banques (UIB)",
    ];

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontSize: '2rem', fontWeight: 'bold', bgcolor: '#1976d2', color: 'white', textAlign: 'center' }}>
                Ajouter un détail d'avance
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="avance-select-label">Numéro d'Avance</InputLabel>
                    <Select
                        labelId="avance-select-label"
                        value={detailAvance.Numero_avance || ''}
                        onChange={(e) =>
                            setDetailAvance((prev) => ({
                                ...prev,
                                Numero_avance: e.target.value,
                            }))
                        }
                        name="Numero_avance"
                    >
                        {avanceOptions.map((avance) => (
                            <MenuItem key={avance} value={avance}>
                                {avance}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Montant"
                    name="montant"
                    value={detailAvance.montant || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    type="number"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="banque-select-label">Banque</InputLabel>
                    <Select
                        labelId="banque-select-label"
                        name="banque"
                        value={detailAvance.banque || ''}
                        onChange={handleInputChange}
                    >
                        {banquesTunisiennes.map((banque) => (
                            <MenuItem key={banque} value={banque}>
                                {banque}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="mode-reglement-label">Mode de Règlement</InputLabel>
                    <Select
                        labelId="mode-reglement-label"
                        name="mode_reglement"
                        value={detailAvance.mode_reglement || ''} // Correction ici
                        onChange={handleInputChange}
                    >
                        <MenuItem value="Chèque">Chèque</MenuItem>
                        <MenuItem value="Virement">Virement</MenuItem>
                        <MenuItem value="Espèces">Espèces</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Annuler
                </Button>
                <Button onClick={onAddDetailAvance} color="primary">
                    Ajouter
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Detailavance;