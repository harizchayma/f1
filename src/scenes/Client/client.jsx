import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"; // Add Dialog imports
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { Header } from "../../components";
import AjouteClient from "./AjouteClient"; // Component for adding a client
import AfficherClient from "./AfficherClient"; // Component for displaying client details
import ModifieClient from "./ModifieClient"; // Component for editing a client
import { useAuth } from "../context/AuthContext";

const Client = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role } = useAuth();

  const initialClientState = () => ({
    nom_fr: "",
    nom_ar: "",
    prenom_fr: "",
    prenom_ar: "",
    cin: "",
    date_cin: "",
    date_naiss: "",
    adresse_fr: "",
    adresse_ar: "",
    num_tel: "",
    Numero_Permis: "",
    date_permis: "",
    profession_fr: "",
    profession_ar: "",
    nationalite_origine: "",
  });

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newClient, setNewClient] = useState(initialClientState());
  const [clientToEdit, setClientToEdit] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation
  const [clientToDelete, setClientToDelete] = useState(null); // State to store the client to be deleted

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7001/client");
      setData(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients", error);
    }
  };

  const handleAddClient = async () => {
    try {
      const response = await axios.post("http://localhost:7001/client", newClient);
      setData((prevData) => [...prevData, response.data.data]); // S'assurer que response.data.data contient bien l'objet ajouté
      setSnackbarMessage("Client ajouté avec succès !");
      setSnackbarOpen(true);
      handleAddClose(); // Ferme la boîte de dialogue après l'ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
      setSnackbarMessage("Erreur lors de l'ajout du client");
      setSnackbarOpen(true);
    }
  };

  const handleAddOpen = () => setOpenAddDialog(true);
  const handleAddClose = () => {
    setOpenAddDialog(false);
    setNewClient(initialClientState()); 
  };

  const handleOpen = (client) => {
    setSelectedClient(client);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClient(null);
  };

  const handleEdit = (client) => {
    setClientToEdit(client);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setClientToEdit(null);
  };

  const handleUpdateClient = async () => {
    if (!clientToEdit) {
      setSnackbarMessage("Aucun client à mettre à jour");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.put(`http://localhost:7001/client/${clientToEdit.id_client}`, clientToEdit);
      
      setData((prevData) => prevData.map(client => 
        client.id_client === clientToEdit.id_client ? { ...client, ...clientToEdit } : client
      ));

      setSnackbarMessage("Client modifié avec succès !");
      setSnackbarOpen(true);
      
      handleCloseEdit(); // Ferme la fenêtre de modification après mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client", error);
      setSnackbarMessage("Erreur lors de la mise à jour du client");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteConfirmation = (client) => {
    setClientToDelete(client);
    setOpenDeleteDialog(true); // Open the delete confirmation dialog
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;

    try {
      await axios.delete(`http://localhost:7001/client/${clientToDelete.id_client}`);
      setData((prevData) => prevData.filter((client) => client.id_client !== clientToDelete.id_client));
      setSnackbarMessage("Client supprimé avec succès !");
      setSnackbarOpen(true);
      setOpenDeleteDialog(false); // Close the dialog after deletion
    } catch (error) {
      console.error("Erreur lors de la suppression du client", error);
      setSnackbarMessage("Erreur lors de la suppression du client");
      setSnackbarOpen(true);
      setOpenDeleteDialog(false); // Close the dialog in case of error
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const columns = [
    { field: "nom_fr", headerName: "Nom (FR)", width: 150 },
    { field: "nom_ar", headerName: "Nom (AR)", width: 150 },
    { field: "prenom_fr", headerName: "Prénom (FR)", width: 150 },
    { field: "prenom_ar", headerName: "Prénom (AR)", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 700,
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
              <Button variant="contained" color="error" onClick={() => handleDeleteConfirmation(params.row)}>
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
      <Header title="Clients" />
      {role === "admin" && (
        <Button variant="contained" sx={{ backgroundColor: "#3c55e2", color: "white" }} 
        onClick={handleAddOpen}
        >
          Ajouter un Client
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
          getRowId={(row) => row.cin}
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

      <AfficherClient open={open} handleClose={handleClose} selectedClient={selectedClient} />
      <AjouteClient 
        open={openAddDialog} 
        handleClose={handleAddClose} 
        newClient={newClient} 
        setNewClient={setNewClient} 
        handleAddClient={handleAddClient} 
      />
      <ModifieClient 
        open={openEdit} 
        handleClose={handleCloseEdit} 
        client={clientToEdit} 
        setClient={setClientToEdit} 
        handleUpdateClient={handleUpdateClient} 
      />

      {/* Confirmation Dialog for Delete */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir supprimer ce client ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Client;
