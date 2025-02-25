import React, { useState } from "react";
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
  Box
} from "@mui/material";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

function ModifieClient({ open, handleClose, client, setClient, handleUpdateClient }) {
  const currentClient = client || {};
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (field) => (event) => {
    setClient({ ...currentClient, [field]: event.target.value });
  };

  const onKeyPress = (button) => {
    if (focusedField) {
      setClient({
        ...currentClient,
        [focusedField]: (currentClient[focusedField] || "") + button,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{ "& .MuiDialog-paper": { height: "85vh", maxHeight: "100vh", overflowY: "auto" } }}
    >
      <DialogTitle sx={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", bgcolor: "#1976d2", color: "white" }}>
        Modifier le Client
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              {[
                { label: "Nom (FR)", key: "nom_fr" },
                { label: "Nom (AR)", key: "nom_ar", arabic: true },
                { label: "Prénom (FR)", key: "prenom_fr" },
                { label: "Prénom (AR)", key: "prenom_ar", arabic: true },
                { label: "CIN", key: "cin" },
                { label: "Date CIN", key: "date_cin", type: "date" },
                { label: "Date de Naissance", key: "date_naiss", type: "date" },
                { label: "Adresse (FR)", key: "adresse_fr" },
                { label: "Adresse (AR)", key: "adresse_ar", arabic: true },
                { label: "Numéro de Téléphone", key: "num_tel" },
                { label: "Numéro de Permis", key: "Numero_Permis" },
                { label: "Date de Permis", key: "date_permis", type: "date" },
                { label: "Profession (FR)", key: "profession_fr" },
                { label: "Profession (AR)", key: "profession_ar", arabic: true },
                { label: "Nationalité d'Origine", key: "nationalite_origine" }
              ].map(({ label, key, type, readOnly, arabic }, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField
                    label={label}
                    type={type || "text"}
                    fullWidth
                    variant="outlined"
                    value={currentClient[key] || ""}
                    onChange={handleChange(key)}
                    InputLabelProps={type === "date" ? { shrink: true } : {}}
                    InputProps={readOnly ? { readOnly: true } : {}}
                    onFocus={() => setFocusedField(arabic ? key : null)}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {focusedField && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Keyboard
              layoutName="arabic"
              onKeyPress={onKeyPress}
              layout={{
                arabic: [
                  "ض ص ث ق ف غ ع ه خ ح ج د",
                  "ش س ي ب ل ا ت ن م ك ط",
                  "ئ ء ؤ ر لا ى ة و ز ظ"
                ]
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleUpdateClient}
          variant="contained"
          sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#1565c0" } }}
        >
          Modifier
        </Button>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#b71c1c" } }}
        >
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModifieClient;
