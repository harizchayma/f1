import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AjouteContrat = ({
  open,
  handleClose,
  newContract, 
  setNewContract,
  handleAddContract,
  availableVehicles,
  onAllChauffeursAdded,
  setOpenChauffeurDialogsProp,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewContract((prev) => ({ ...prev, [name]: value }));
    if (name === "Heure_debut") {
      setNewContract((prev) => ({ ...prev, Heure_retour: value }));
    }
  };

  const [openChauffeurDialogs, setOpenChauffeurDialogs] = useState({});
  const [addedChauffeursCount, setAddedChauffeursCount] = useState(0);
  const [allChauffeursAdded, setAllChauffeursAdded] = useState(false);
  const [localContract, setLocalContract] = useState(newContract); // Initialise avec newContract
  const [newChauffeurs, setNewChauffeurs] = useState({}); // État pour stocker les chauffeurs ajoutés

  const navigate = useNavigate();

  const handleAddContractAndRedirect = async () => {
    try {
      await handleAddContract(); // Ajout du contrat dans la base de données
  
      // Vérifier si on a bien un numéro de contrat
      if (newContract.Numero_contrat) {
        navigate(`/ajoute-chauffeur/${newContract.Numero_contrat}`);
      } else {
        console.error("Numéro de contrat manquant !");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du contrat:", error);
    }
  };
  
  

  const handleOpenChauffeurDialog = (index) => {
    if (newContract.Numero_contrat) {
      setOpenChauffeurDialogs((prev) => ({ ...prev, [index]: true }));
      setNewChauffeurs((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          numero_contrat: newContract.Numero_contrat,
        },
      }));
    } else {
      console.error("Numero_contrat is not defined.");
    }
  };

  const handleCloseChauffeurDialog = (index) => {
    setOpenChauffeurDialogs((prev) => ({ ...prev, [index]: false }));
    setNewChauffeurs((prev) => ({
      ...prev,
      [index]: {
        nom_fr: "",
        nom_ar: "",
        prenom_fr: "",
        prenom_ar: "",
        cin_chauffeur: "",
        date_cin_chauffeur: "",
        date_naiss: "",
        adresse_fr: "",
        adresse_ar: "",
        num_tel: "",
        numero_permis: "",
        date_permis: "",
        profession_fr: "",
        profession_ar: "",
        nationalite_origine: "",
        Numero_contrat: newContract.Numero_contrat,
      },
    }));
  };

  const handleAddChauffeur = async (index) => {
    try {
      console.log("Ajout du chauffeur:", newChauffeurs[index]);
      setAddedChauffeursCount((prevCount) => prevCount + 1);
      handleCloseChauffeurDialog(index);

      if (addedChauffeursCount + 1 === parseInt(newContract["Nombre de chauffeur"] || 0)) {
        setAllChauffeursAdded(true);
        if (onAllChauffeursAdded) {
          onAllChauffeursAdded();
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du chauffeur", error);
    }
  };

  const handleAddContractAndOpenChauffeur = async () => {
    try {
        await handleAddContract();
        const nombreChauffeurs = parseInt(newContract["Nombre de chauffeur"] || 0);
        if (nombreChauffeurs > 0) {
            console.log("Opening chauffeur dialog"); // Ajout de cette ligne
            setOpenChauffeurDialogsProp(true);
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du contrat:", error);
    }
};

  const calculateDuration = () => {
    if (newContract.Date_debut && newContract.Date_retour) {
      const startDate = new Date(newContract.Date_debut);
      const endDate = new Date(newContract.Date_retour);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNewContract((prev) => ({ ...prev, Duree_location: diffDays }));
    }
  };

  const calculateTotalPrice = () => {
    if (newContract.Duree_location && newContract.num_immatriculation) {
      const selectedVehicle = availableVehicles.find(
        (vehicle) => vehicle.num_immatriculation === newContract.num_immatriculation
      );
      if (selectedVehicle) {
        const prixParJour = selectedVehicle.prix_jour;
        const total = prixParJour * newContract.Duree_location;
        setNewContract((prev) => ({ ...prev, Prix_total: total }));
      }
    }
  };

  useEffect(() => {
    calculateDuration();
  }, [newContract.Date_debut, newContract.Date_retour]);

  useEffect(() => {
    calculateTotalPrice();
  }, [newContract.Duree_location, newContract.num_immatriculation, newContract.Frais]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ bgcolor: "#1976d2", color: "white", textAlign: "center" }}>
        <Typography variant="h3">Ajouter un Contrat</Typography>
      </DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, bgcolor: "#ffffff" }}>
          <Grid container spacing={2}>
            {[
              { name: "Numero_contrat", label: "Numéro Contrat" },
              { name: "Date_debut", label: "Date Début", type: "date" },
              { name: "Heure_debut", label: "Heure Début", type: "time" },
              { name: "Date_retour", label: "Date Retour", type: "date" },
              { name: "Heure_retour", label: "Heure Retour", type: "time", disabled: true },
              { name: "Duree_location", label: "Durée Location", disabled: true },
              { name: "Prolongation", label: "Prolongation" },
              { name: "cin", label: "CIN" },
              { name: "Prix_total", label: "Prix Total", disabled: true },
              { name: "Piece_garantie", label: "Pièce Garantie" },
              { name: "Frais", label: "Frais" },
              {
                name: "Nombre de chauffeur",
                label: "Nombre de chauffeur",
                type: "select",
                options: [1, 2, 3],
              },
              {
                name: "num_immatriculation",
                label: "Numéro Immatriculation",
                type: "select",
                options: availableVehicles,
              },
            ].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                {field.type === "select" ? (
                  <FormControl fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select name={field.name} value={newContract[field.name] || ""} onChange={handleChange}>
                      {field.options.map((option, idx) => (
                        <MenuItem key={idx} value={option.num_immatriculation || option}>
                          {option.num_immatriculation || option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    type={field.type || "text"}
                    value={newContract[field.name] || ""}
                    onChange={handleChange}
                    disabled={field.disabled}
                    InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                    sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ padding: 2, justifyContent: "flex-end", bgcolor: "#fffbfb" }}>
                <Button
                    onClick={handleClose}
                    color="error"
                    variant="outlined"
                    sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#b71c1c" } }}
                >
                    Annuler
                </Button>
                <Button
                    onClick={handleAddContractAndOpenChauffeur} // Utilisation de la fonction modifiée
                    color="primary"
                    variant="contained"
                    sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#1565c0" } }}
                    >
                    Ajouter Contrat
                </Button>
            </DialogActions>
    </Dialog>
  );
};

AjouteContrat.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  newContract: PropTypes.object.isRequired,
  setNewContract: PropTypes.func.isRequired,
  handleAddContract: PropTypes.func.isRequired,
  availableVehicles: PropTypes.array.isRequired,
  onAllChauffeursAdded: PropTypes.func,
};

export default AjouteContrat;