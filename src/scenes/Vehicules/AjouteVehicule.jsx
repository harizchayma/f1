import React from 'react';
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
    Grid,
    Paper
} from '@mui/material';

function AjouteVehicule({ open, handleClose, newVehicle, setNewVehicle, categories, handleAddVehicle }) {
    const handleChange = (field) => (event) => {
        setNewVehicle({ ...newVehicle, [field]: event.target.value });
    };

    const marques = [
        "Alfa Romeo", "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Mercedes-Benz",
        "Peugeot", "Renault", "Volkswagen", "Chery", "Hyundai", "Kia", "Nissan",
        "Suzuki", "Toyota", "Chevrolet", "Ford", "Jeep"
    ];

    const lieuxCertification = [
        "Tunis",
        "Sfax",
        "Sousse",
        "Gabès",
        "Bizerte",
        "Ariana",
        "Kairouan",
        "Gafsa",
        "Nabeul",
        "Monastir",
        "Mahdia",
        "Médenine",
        "Tozeur",
        "Kasserine",
        "Zarzis",
        "Hammamet",
        "Djerba",
        "Ben Arous",
        "Manouba"
    ];

    const energies = ["Essence", "Diesel", "Gaz", "Électrique", "Hybride"];

    const renderSelect = (label, field, options) => (
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={newVehicle[field] || ""}
                onChange={handleChange(field)}
                label={label}
            >
                {options === marques ? (
                    marques.map((marque, index) => (
                        <MenuItem key={index} value={marque}>{marque}</MenuItem>
                    ))
                ) : options === energies ? (
                    energies.map((energie, index) => (
                        <MenuItem key={index} value={energie}>{energie}</MenuItem>
                    ))
                ) : options === lieuxCertification ? (
                    lieuxCertification.map((lieu, idx) => (
                        <MenuItem key={idx} value={lieu}>{lieu}</MenuItem>
                    ))
                ) : (
                    options.map((option, index) => (
                        <MenuItem key={index} value={option.id_categorie}>{option.catégorie}</MenuItem>
                    ))
                )}
            </Select>
        </FormControl>
    );

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontSize: '1.4rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>
                Ajouter un Véhicule
            </DialogTitle>
            <DialogContent>
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                        {[
                            { label: "Numéro Immatriculation", field: "num_immatriculation" },
                            { label: "Numéro de chassis", field: "n_serie_du_type" },
                            { label: "Marque", field: "constructeur", isSelect: true, options: marques },
                            { label: "Modele", field: "type_constructeur" },
                            { label: "Carrosserie", field: "carrosserie" },
                            { label: "Énergie", field: "energie", isSelect: true, options: energies },
                            { label: "Puissance Fiscale", field: "puissance_fiscale" },
                            { label: "Nombre de Places", field: "nbr_places" },
                            { label: "Cylindrée", field: "cylindree" },
                            { label: "Numéro Certificat", field: "num_certificat" },
                            { label: "Lieu Certificat", field: "lieu_certificat", isSelect: true, options: lieuxCertification },
                            { label: "Type Commercial", field: "type_commercial" },
                            { label: "Catégorie", field: "id_categorie", isSelect: true, options: categories }
                        ].map(({ label, field, isSelect, options }) => (
                            <Grid item xs={12} sm={6} key={field}>
                                {isSelect ? renderSelect(label, field, options) : (
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label={label}
                                        value={newVehicle[field] || ""}
                                        onChange={handleChange(field)}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            </Grid>
                        ))}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Date Certificat"
                                type="date"
                                value={newVehicle.date_certificat || ""}
                                onChange={handleChange("date_certificat")}
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </DialogContent>
            <DialogActions sx={{ padding: 2, justifyContent: "flex-end" }}>
                <Button onClick={handleClose} color="error" variant="outlined" sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#b71c1c" } }}>
                    Annuler
                </Button>
                <Button onClick={handleAddVehicle} color="primary" variant="contained" sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#1565c0" } }}>
                    Ajouter
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AjouteVehicule;