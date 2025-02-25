import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Grid, Card, CardContent, Divider } from "@mui/material";

function AfficherContrat({ open, handleClose, selectedContrat, selectedClient, selectedVehicle }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>
        Détails du Contrat
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {selectedContrat && (
          <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
            <CardContent>
              <Grid container spacing={1.4}>
                {[
                  { label: "Numéro de Contrat", value: selectedContrat.Numero_contrat },
                  { label: "Date de Début", value: selectedContrat.Date_debut },
                  { label: "Heure de Début", value: selectedContrat.Heure_debut },
                  { label: "Date de Retour", value: selectedContrat.Date_retour },
                  { label: "Heure de Retour", value: selectedContrat.Heure_retour },
                  { label: "Durée de Location (jours)", value: selectedContrat.Duree_location },
                  { label: "Prolongation", value: selectedContrat.Prolongation },
                  { label: "Prix Total", value: selectedContrat.Prix_total },
                  { label: "Pièce de Garantie", value: selectedContrat.Piece_garantie },
                  { label: "Frais", value: selectedContrat.Frais },
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
        {selectedClient && (
          <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 2, mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Détails du Client</Typography>
              <Grid container spacing={1.4}>
                {[
                  { label: "Nom (FR)", value: selectedClient.nom_fr },
                  { label: "Nom (AR)", value: selectedClient.nom_ar },
                  { label: "Prénom (FR)", value: selectedClient.prenom_fr },
                  { label: "Prénom (AR)", value: selectedClient.prenom_ar },
                  { label: "CIN", value: selectedClient.cin },
                  { label: "Date CIN", value: selectedClient.date_cin },
                  { label: "Date de Naissance", value: selectedClient.date_naiss },
                  { label: "Adresse (FR)", value: selectedClient.adresse_fr },
                  { label: "Adresse (AR)", value: selectedClient.adresse_ar },
                  { label: "Numéro de Téléphone", value: selectedClient.num_tel },
                  { label: "Numéro de Permis", value: selectedClient.Numero_Permis },
                  { label: "Date de Permis", value: selectedClient.date_permis },
                  { label: "Profession (FR)", value: selectedClient.profession_fr },
                  { label: "Profession (AR)", value: selectedClient.profession_ar },
                  { label: "Nationalité d'Origine", value: selectedClient.nationalite_origine },
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
        {selectedVehicle && (
    <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 2, mt: 2 }}>
        <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Détails du Véhicule</Typography>
            <Grid container spacing={1.4}>
                {[
                    { label: "Numéro d'Immatriculation", value: selectedVehicle.num_immatriculation },
                    { label: "Marque", value: selectedVehicle.constructeur },
                    { label: "Modèle", value: selectedVehicle.type_commercial },
                    { label: "Type de Carrosserie", value: selectedVehicle.carrosserie },
                    { label: "Énergie", value: selectedVehicle.energie },
                    { label: "Puissance Fiscale", value: selectedVehicle.puissance_fiscale },
                    { label: "Cylindrée", value: selectedVehicle.cylindree },
                    { label: "Numéro de Certificat", value: selectedVehicle.num_certificat },
                    { label: "Lieu de Certificat", value: selectedVehicle.lieu_certificat },
                    { label: "Date de Certificat", value: selectedVehicle.date_certificat },
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

export default AfficherContrat;