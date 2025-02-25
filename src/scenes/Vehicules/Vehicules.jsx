import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Snackbar, Alert, Dialog, DialogTitle, DialogActions, DialogContent } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { Header } from "../../components";
import AjouteVehicule from "./ajouteVehicule";
import AfficherVehicule from "./AfficherVehicule";
import ModifieVehicule from "./ModifieVehicule";
import { useAuth } from "../context/AuthContext";

const Vehicules = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role } = useAuth();

  const initialVehicleState = () => ({
    num_immatriculation: "",
    constructeur: "",
    type_constructeur: "",
    id_categorie: "",
    n_serie_du_type: "",
    genre: "",
    DPMC: "",
    type_commercial: "",
    carrosserie: "",
    energie: "",
    puissance_fiscale: "",
    nbr_places: "",
    cylindree: "",
    num_certificat: "",
    lieu_certificat: "",
    date_certificat: "",
  });

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newVehicle, setNewVehicle] = useState(initialVehicleState());
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchData();
    }
  }, [categories]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7001/vehicules");
      const vehicles = response.data.data;

      const vehiclesWithCategories = vehicles.map(vehicle => {
        const category = categories.find(cat => cat.id_categorie === vehicle.id_categorie);
        return {
          ...vehicle,
          catégorie: category ? category.catégorie : "Inconnu",
        };
      });

      setData(vehiclesWithCategories);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:7001/categorie");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories", error);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const response = await axios.post('http://localhost:7001/vehicules', newVehicle);
      setData((prevData) => [...prevData, response.data]); // Add the new vehicle to the state
      setSnackbarMessage("Véhicule ajouté avec succès !");
      setSnackbarOpen(true);
      handleAddClose(); // Close the dialog after adding
    } catch (error) {
      console.error("Erreur lors de l'ajout du véhicule:", error);
      setSnackbarMessage("Erreur lors de l'ajout du véhicule");
      setSnackbarOpen(true);
    }
  };

  const handleAddOpen = () => setOpenAddDialog(true);
  const handleAddClose = () => {
    setOpenAddDialog(false);
    setNewVehicle(initialVehicleState());
  };

  const handleOpen = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVehicle(null);
  };

  const handleEdit = (vehicle) => {
    setVehicleToEdit(vehicle);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setVehicleToEdit(null);
  };

  const handleUpdateVehicle = async () => {
    if (!vehicleToEdit) {
      console.error("Aucun véhicule à mettre à jour");
      setSnackbarMessage("Aucun véhicule à mettre à jour");
      setSnackbarOpen(true);
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:7001/vehicules/${vehicleToEdit.num_immatriculation}`, vehicleToEdit);
      setData((prevData) => prevData.map(vehicle => vehicle.num_immatriculation === vehicleToEdit.num_immatriculation ? response.data : vehicle));
      setSnackbarMessage("Véhicule modifié avec succès !");
      setSnackbarOpen(true);
      handleCloseEdit(); // Close the dialog after update
    } catch (error) {
      console.error("Erreur lors de la mise à jour du véhicule", error);
      setSnackbarMessage("Erreur lors de la mise à jour du véhicule");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (numImmatriculation) => {
    try {
      await axios.delete(`http://localhost:7001/vehicules/${numImmatriculation}`);
      setData((prevData) => prevData.filter((vehicle) => vehicle.num_immatriculation !== numImmatriculation));
      setSnackbarMessage("Véhicule supprimé avec succès !");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de la suppression du véhicule", error);
      setSnackbarMessage("Erreur lors de la suppression du véhicule");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleOpenDeleteDialog = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedVehicle(null);
  };

  const confirmDelete = () => {
    if (selectedVehicle) {
      handleDelete(selectedVehicle.num_immatriculation);
    }
    handleCloseDeleteDialog();
  };

  const columns = [
    { field: "num_immatriculation", headerName: "Numéro Immatriculation", width: 180 },
    { field: "constructeur", headerName: "Marque", width: 150 },
    { field: "type_constructeur", headerName: "Modele", width: 180 },
    { field: "catégorie", headerName: "Catégorie", width: 250 },
    {
      field: "action",
      headerName: "Action",
      width: 400,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" sx={{ backgroundColor: "#3d59d5", color: "white", marginRight: 2 }} onClick={() => handleOpen(params.row)}>
            Voir
          </Button>
          {role === "admin" && (
            <>
              <Button 
                variant="contained" 
                sx={{ bgcolor: "#3db351", color: "white", marginRight: 2 }} 
                onClick={() => handleEdit(params.row)}
              >
                Modifier
              </Button>
              <Button variant="contained" color="error" onClick={() => handleOpenDeleteDialog(params.row)}>
                Supprimer
              </Button>
            </>
          )}
        </Box>
      ),
    }
  ];

  return (
    <Box m="20px">
      <Header title="Véhicules" />
      {role === "admin" && (
        <Button variant="contained" sx={{ backgroundColor: "#3c55e2", color: "white" }} 
        onClick={handleAddOpen}
        >
          Ajouter un Véhicule
        </Button>
      )}
      <Box
        mt="30px"
        height="70vh"
        width="150vh"
        flex={1}
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { border: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#6da5ee",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#6da5ee",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.gray[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.num_immatriculation}
          components={{ Toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />
      </Box>

      <AfficherVehicule open={open} handleClose={handleClose} selectedVehicle={selectedVehicle} />
      <AjouteVehicule 
        open={openAddDialog} 
        handleClose={handleAddClose} 
        newVehicle={newVehicle} 
        setNewVehicle={setNewVehicle} 
        categories={categories} 
        handleAddVehicle={handleAddVehicle} 
      />
      <ModifieVehicule 
        open={openEdit} 
        handleClose={handleCloseEdit} 
        vehicle={vehicleToEdit} 
        setVehicle={setVehicleToEdit} 
        handleUpdateVehicle={handleUpdateVehicle} 
        categories={categories} 
      />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir supprimer ce véhicule ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehicules;