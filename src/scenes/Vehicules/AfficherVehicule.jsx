import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Grid, Card, CardContent, Divider } from "@mui/material";

function AfficherVehicule({ open, handleClose, selectedVehicle }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>
        Détails du Véhicule
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {selectedVehicle && (
          <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
            <CardContent>
              <Grid container spacing={1.4}>
                {[
                  { label: "Numéro Immatriculation", value: selectedVehicle.num_immatriculation },
                  { label: "Numéro de chassis", value: selectedVehicle.n_serie_du_type },
                  { label: "Marque", value: selectedVehicle.constructeur },
                  { label: "Modele", value: selectedVehicle.type_commercial },
                  { label: "Carrosserie", value: selectedVehicle.carrosserie },
                  { label: "Énergie", value: selectedVehicle.energie },
                  { label: "Puissance Fiscale", value: selectedVehicle.puissance_fiscale },
                  { label: "Nombre de Places", value: selectedVehicle.nbr_places },
                  { label: "Cylindrée", value: selectedVehicle.cylindree },
                  { label: "Numéro Certificat", value: selectedVehicle.num_certificat },
                  { label: "Lieu Certificat", value: selectedVehicle.lieu_certificat },
                  { label: "Date Certificat", value: selectedVehicle.date_certificat },
                  { label: "Catégorie", value: selectedVehicle.catégorie },
                  { label: "Type Constructeur", value: selectedVehicle.type_constructeur },
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
                    {index % 2 !== 0 && <Grid item xs={10}><Divider /></Grid>}
                  </React.Fragment>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" sx={{ bgcolor: "#1976d2", color: "white", fontWeight: "bold", '&:hover': { bgcolor: "#1565c0" } }}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AfficherVehicule;
