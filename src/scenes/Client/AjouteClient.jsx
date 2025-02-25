import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper
} from "@mui/material";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

function AjouteClient({ open, handleClose, newClient, setNewClient, handleAddClient }) {
  const [focusedField, setFocusedField] = useState(null); // Champ actuellement sélectionné
  const [layout, setLayout] = useState("arabic"); // Layout du clavier

  const handleChange = (field) => (event) => {
    setNewClient({ ...newClient, [field]: event.target.value });
  };

  const onKeyPress = (button) => {
    if (focusedField) {
      setNewClient({ ...newClient, [focusedField]: (newClient[focusedField] || "") + button });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontSize: "1.4rem",
          fontWeight: "bold",
          textAlign: "center",
          bgcolor: "#1976d2",
          color: "white",
        }}
      >
        Ajouter un Client
      </DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            {[
              { label: "Nom (FR)", field: "nom_fr" },
              { label: "Nom (AR)", field: "nom_ar", arabic: true },
              { label: "Prénom (FR)", field: "prenom_fr" },
              { label: "Prénom (AR)", field: "prenom_ar", arabic: true },
              { label: "CIN", field: "cin" },
              { label: "Date CIN", field: "date_cin", type: "date" },
              { label: "Date de Naissance", field: "date_naiss", type: "date" },
              { label: "Adresse (FR)", field: "adresse_fr" },
              { label: "Adresse (AR)", field: "adresse_ar", arabic: true },
              { label: "Numéro de Téléphone", field: "num_tel" },
              { label: "Numéro de Permis", field: "Numero_Permis" },
              { label: "Date de Permis", field: "date_permis", type: "date" },
              { label: "Profession (FR)", field: "profession_fr" },
              { label: "Profession (AR)", field: "profession_ar", arabic: true },
              { label: "Nationalité d'Origine", field: "nationalite_origine" },
            ].map(({ label, field, type, arabic }) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={label}
                  value={newClient[field] || ""}
                  onChange={handleChange(field)}
                  type={type || "text"}
                  InputLabelProps={type === "date" ? { shrink: true } : {}}
                  sx={{ mb: 2 }}
                  onFocus={() => setFocusedField(arabic ? field : null)}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
        {focusedField && (
          <Keyboard
            layoutName={layout}
            onKeyPress={onKeyPress}
            layout={{
              arabic: [
                "ض ص ث ق ف غ ع ه خ ح ج د",
                "ش س ي ب ل ا ت ن م ك ط",
                "ئ ء ؤ ر لا ى ة و ز ظ",
                
              ],
            }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ padding: 2, justifyContent: "flex-end" }}>
      <Button
          onClick={handleAddClient}
          color="primary"
          variant="contained"
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            px: 3,
            py: 1.5,
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Ajouter
        </Button>
        <Button
          onClick={handleClose}
          color="error"
          variant="outlined"
          sx={{
            bgcolor: "#d32f2f",
            color: "white",
            px: 3,
            py: 1.5,
            "&:hover": { bgcolor: "#b71c1c" },
          }}
        >
          Annuler
        </Button>
       
      </DialogActions>
    </Dialog>
  );
}

export default AjouteClient;
