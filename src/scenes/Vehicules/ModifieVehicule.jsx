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
  Card,
  CardContent
} from '@mui/material';

function ModifieVehicule({ open, handleClose, vehicle, setVehicle, handleUpdateVehicle, categories }) {
  const currentVehicle = vehicle || {};

  const marques = [
    "Alfa Romeo", "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Mercedes-Benz",
    "Peugeot", "Renault", "Volkswagen", "Chery", "Hyundai", "Kia", "Nissan",
    "Suzuki", "Toyota", "Chevrolet", "Ford", "Jeep"
  ];

  const energies = ["Essence", "Diesel", "Gaz", "Électrique", "Hybride"];
  const lieuxCertification = [
    "Tunis ",
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
    "Djerba ",
    "Ben Arous",
    "Manouba"
  ];
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{ '& .MuiDialog-paper': { height: '80vh', maxHeight: '100vh', overflowY: 'auto' } }}
    >
      <DialogTitle sx={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>
        Modifier le Véhicule
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              {[
                { label: "Numéro Immatriculation", key: "num_immatriculation", readOnly: true },
                { label: "Numéro de chassis", key: "n_serie_du_type" },
                { label: "Marque", key: "constructeur", isSelect: true, options: marques },
                { label: "Modele", key: "type_constructeur" },
                { label: "Carrosserie", key: "carrosserie" },
                { label: "Énergie", key: "energie", isSelect: true, options: energies },
                { label: "Puissance Fiscale", key: "puissance_fiscale" },
                { label: "Nombre de Places", key: "nbr_places" },
                { label: "Cylindrée", key: "cylindree" },
                { label: "Numéro Certificat", key: "num_certificat" },
                { label: "Lieu Certificat", key: "lieu_certificat", isSelect: true, options: lieuxCertification },
                { label: "Date Certificat", key: "date_certificat", type: "date" },
                { label: "Type Commercial", key: "type_commercial" },
                { label: "Catégorie", key: "id_categorie", isSelect: true, options: categories }
              ].map((field, index) => (
                <Grid item xs={6} key={index}>
                  {field.isSelect ? (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        value={currentVehicle[field.key] || ""}
                        onChange={(e) => setVehicle({ ...currentVehicle, [field.key]: e.target.value })}
                        label={field.label}
                      >
                        {field.options === marques ? (
                          marques.map((marque, idx) => (
                            <MenuItem key={idx} value={marque}>
                              {marque}
                            </MenuItem>
                          ))
                        ) : field.options === energies ? (
                          energies.map((energie, idx) => (
                            <MenuItem key={idx} value={energie}>
                              {energie}
                            </MenuItem>
                          ))
                        ) : field.options === lieuxCertification ? (
                          lieuxCertification.map((lieu, idx) => (
                            <MenuItem key={idx} value={lieu}>
                              {lieu}
                            </MenuItem>
                          ))
                        ) : (
                          field.options.map((option, idx) => (
                            <MenuItem key={idx} value={option.id_categorie}>
                              {option.catégorie}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      label={field.label}
                      type={field.type || "text"}
                      fullWidth
                      variant="outlined"
                      value={currentVehicle[field.key] || ""}
                      onChange={(e) => !field.readOnly && setVehicle({ ...currentVehicle, [field.key]: e.target.value })}
                      InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                      InputProps={field.readOnly ? { readOnly: true } : {}}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={handleUpdateVehicle}
          variant="contained"
          sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#1565c0" } }}
        >
          Modifier
        </Button>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#b71c1c" } }}
        >
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModifieVehicule;