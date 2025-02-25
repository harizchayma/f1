import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { Header } from "../../components";
import AjouteContrat from "./AjouteContrat";
import AjouteClient from "../Client/AjouteClient";
import logo from "../../assets/images/nom.png"; 
import etat from "../../assets/images/etat.png";
import AfficherContrat from "./AffichierContrat";
import ModifieContrat from "./ModifieContrat";
import AjouteChauffeur from "./AjouteChauffeur";
import { useAuth } from "../context/AuthContext";


const Contrat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role } = useAuth();
  
  
  const initialContractState = () => ({
    Date_debut: "",
    Heure_debut: "",
    Date_retour: "",
    Heure_retour: "",
    Duree_location: "",
    Prolongation: "",
    Numero_contrat: "",
    num_immatriculation: "",
    cin: "",
    Prix_total: "",
    Piece_garantie: "",
    Frais: "",
  });

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
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newContract, setNewContract] = useState(initialContractState());
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openAddClientDialog, setOpenAddClientDialog] = useState(false);
  const [newClient, setNewClient] = useState(initialClientState());
  const [allChauffeursAdded, setAllChauffeursAdded] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [openAfficherContrat, setOpenAfficherContrat] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [openModifieContrat, setOpenModifieContrat] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
  const [openChauffeurDialogs, setOpenChauffeurDialogs] = useState({});
  const [openChauffeurDialog, setOpenChauffeurDialog] = useState(false);
  const [newChauffeurs, setNewChauffeurs] = useState({}); // Ajoutez cette ligne



  const [newChauffeur, setNewChauffeur] = useState({
    numero_contrat: "",
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
  });

  const handleModify = (contract) => {
    setSelectedContract(contract);
    setOpenModifieContrat(true);
  };
  const handleAddContract = async () => {
    try {
        const response = await axios.post("http://localhost:7001/contrat", newContract);
        const addedContract = response.data.data;
        setNewContract(prev => ({ ...prev, Numero_contrat: addedContract.Numero_contrat })); // Mettre à jour newContract
        console.log("Contrat ajouté avec succès, Numero_contrat:", addedContract.Numero_contrat);
        setData((prevData) => [...prevData, { ...addedContract, id: addedContract.ID_contrat }]);
        setSnackbarMessage("Contrat ajouté avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
    } catch (error) {
        console.error("Erreur lors de l'ajout du contrat:", error);
        setSnackbarMessage("Erreur: " + (error.response?.data?.message || error.message));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    }
};

const handleAddOpen = async () => {
  await generateNextContractNumber();
  console.log("Numéro de contrat généré:", newContract.Numero_contrat);
  setOpenAddDialog(true);
};

const handleAddContractAndOpenChauffeur = async () => {
  try {
      await handleAddContract();
      const nombreChauffeurs = parseInt(newContract["Nombre de chauffeur"] || 0);
      if (nombreChauffeurs > 0 && newContract.Numero_contrat) {
          console.log("Opening chauffeur dialog");
          setOpenChauffeurDialogsProp(true);
      } else {
          console.error("Numero_contrat is not defined or no chauffeurs needed.");
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


const generateNextContractNumber = async () => {
  try {
      const response = await axios.get("http://localhost:7001/contrat");
      const contrats = response.data.data;

      if (contrats.length > 0) {
          const lastContractNumber = contrats.reduce((max, contract) => {
              const num = parseInt(contract.Numero_contrat.replace(/\D/g, ''), 10);
              return num > max ? num : max;
          }, 0);

          const nextContractNumber = `AC${(lastContractNumber + 1).toString().padStart(4, '0')}`;
          setNewContract(prev => ({ ...prev, Numero_contrat: nextContractNumber }));
      } else {
          setNewContract(prev => ({ ...prev, Numero_contrat: 'AC0001' }));
      }
  } catch (error) {
      console.error("Erreur lors de la génération du numéro de contrat:", error);
      setNewContract(prev => ({ ...prev, Numero_contrat: 'AC0001' })); // Valeur par défaut en cas d'erreur
  }
};


const handleAddClose = () => {
  setOpenAddDialog(false);
  setNewContract(initialContractState());
  setOpenChauffeurDialog(false); // Réinitialise l'état du dialogue chauffeur
};

  const handleView = async (contract) => {
    setSelectedContract(contract);
    
    // Récupérer les détails du client
    const clientResponse = await axios.get(`http://localhost:7001/client?cin=${contract.cin}`);
    const clientData = clientResponse.data.data[0]; // Supposons que vous obtenez un tableau

    // Récupérer les détails du véhicule
    const vehicleResponse = await fetchVehiculeByImmatriculation(contract.num_immatriculation);
    
    setOpenAfficherContrat(true);
    setSelectedClient(clientData);
    setSelectedVehicle(vehicleResponse);
  };

  useEffect(() => {
    fetchData();
    fetchAvailableVehicles();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7001/contrat");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching contracts", error);
    }
  };

  const fetchAvailableVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:7001/vehicules");
      setAvailableVehicles(response.data.data);
    } catch (error) {
      console.error("Error fetching available vehicles", error);
    }
  };

  const fetchVehiculeByImmatriculation = async (num_immatriculation) => {
    try {
      const response = await axios.get(`http://localhost:7001/vehicules?num_immatriculation=${num_immatriculation}`);
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error("Error fetching vehicle by immatriculation", error);
      return null;
    }
  };

  const fetchChauffeur = async (numeroContrat) => {
    try {
      const response = await axios.get(
        `http://localhost:7001/chauffeur?Numero_contrat=${numeroContrat}`
      );
      if (response.data && response.data.data && response.data.data.length > 0) {
        // Filter only chauffeurs associated with this contract
        return response.data.data.filter(
          (chauffeur) => chauffeur.Numero_contrat === numeroContrat
        );
      }
      return [];
    } catch (error) {
      console.error("Error fetching chauffeurs", error);
      return [];
    }
  };
  const handleAllChauffeursAdded = () => {
    setAllChauffeursAdded(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleAddClient = async () => {
    try {
      const response = await axios.post("http://localhost:7001/client", newClient);
      setSnackbarMessage("Client added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenAddClientDialog(false);
      setNewClient(initialClientState());
      await fetchData();
      handleAddContract();
    } catch (error) {
      console.error("Error adding client", error);
      setSnackbarMessage("Error adding client: " + (error.response ? error.response.data.message : "Unknown error"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCINCheckAndAddContract = async () => {
    const cinExists = await checkCINExists(newContract.cin);
    if (!cinExists) {
      setOpenAddClientDialog(true);
    } else {
      handleAddContract();
    }
  };

  const checkCINExists = async (cin) => {
    try {
      const response = await axios.get(`http://localhost:7001/client?cin=${cin}`);
      return response.data?.data?.some(client => client.cin === cin) || false;
    } catch (error) {
      console.error("Error checking CIN:", error);
      return false;
    }
  };

  const handleDeleteContract = async () => {
    if (!selectedContract) return;

    try {
      await axios.delete(`http://localhost:7001/contrat/${selectedContract.ID_contrat}`);
      setData((prevData) => prevData.filter((c) => c.ID_contrat !== selectedContract.ID_contrat));
      setSnackbarMessage("Contrat supprimé avec succès!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting contract", error);
      setSnackbarMessage("Erreur lors de la suppression du contrat.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setOpenDeleteDialog(false); // Close the delete confirmation dialog
    }
  };


  const confirmDelete = () => {
    handleDeleteContract();
  };
  const handlePrint = async (contract) => {
    const chauffeurs = await fetchChauffeur(contract.Numero_contrat);
    const vehicules = await fetchVehiculeByImmatriculation(contract.num_immatriculation);
  
    const printWindow = window.open("", "_blank");
  
    let chauffeursInfo = '';
    chauffeurs.forEach((chauffeur, index) => {
      if (chauffeur && chauffeur.Numero_contrat === contract.Numero_contrat) {
        chauffeursInfo += `
          <div class="conducteur-info">
            <div class="conducteur-titre">${index + 1}${index === 0 ? 'er' : 'ème'} Conducteur / سائق</div>
            <p><strong>Nom & Prénom / الاسم واللقب:</strong> ${chauffeur.nom_fr} ${chauffeur.prenom_fr}</p>
            <p><strong>Date de Naissance / تاريخ الميلاد:</strong> ${chauffeur.date_naiss || "N/A"}</p>
            <p><strong>Profession / المهنة:</strong> ${chauffeur.profession_fr || "N/A"}</p>
            <p><strong>Nationalité d'Origine / الجنسية الأصلية:</strong> ${chauffeur.nationalite_origine || "N/A"}</p>
            <p><strong>Passeport ou CIN No / رقم جواز السفر أو بطاقة الهوية:</strong> ${chauffeur.cin_chauffeur || "N/A"}</p>
            <p><strong>Délivré le / تاريخ الإصدار:</strong> ${chauffeur.date_cin_chauffeur || "N/A"}</p>
            <p><strong>Adresse / العنوان:</strong> ${chauffeur.adresse_fr || "N/A"}</p>
            <p><strong>Permis de Conduite / رخصة القيادة:</strong> ${chauffeur.numero_permis || "N/A"}</p>
            <p><strong>Délivré le / تاريخ الإصدار:</strong> ${chauffeur.date_permis || "N/A"}</p>
            <p><strong>GSM/Tél / الهاتف:</strong> ${chauffeur.num_tel || "N/A"}</p>
          </div>
        `;
      }
    });
  
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 2px; }
            .contract { max-width: 100%; margin: 0; padding: 10px; }
            .signature { border-bottom: 1px solid #000; width: 100px; margin: 2px auto; }
            img { max-width: 100px; height: auto; }
            .container { display: flex; justify-content: space-between; }
            .left, .right { flex: 1; padding: 5px; border: 1px solid #000; margin: 2px; }
            .conducteur-info { border: 1px solid #000; padding: 5px; margin-bottom: 2px; }
            .conducteur-titre { font-weight: bold; margin-bottom: 3px; background-color: #f0f0f0; padding: 2px; text-align: center; }
            .contract-header { display: flex; justify-content: space-between; align-items: center; }
            .contract-header img { max-width: 60px; height: auto; }
            .contract-header h2 { text-align: center; flex-grow: 1; font-size: 12px; margin: 3px 0; }
            .contract-details { margin-top: 5px; }
            .contract-details p { margin: 1px 0; }
            .section-title { font-weight: bold; margin-top: 5px; }
            .important-notes { margin-top: 5px; }
            .company-info { text-align: center; margin-bottom: 5px; }
            .company-info p { margin: 0; }
            .contract-title { text-align: center; margin-bottom: 5px; font-size: 14px; }
            .signature-area { text-align: center; margin-top: 5px; display: flex; justify-content: space-around; }
            .signature-area p { margin: 1px 0; }
            .signature-area .signature { margin: 3px auto; }
            .notes-area { margin-top: 5px; }
            .notes-area p { margin: 1px 0; }
            .caution-div { border: 1px solid #000; padding: 3px; margin-bottom: 3px; }
.etat-image {
                    width: 150px;
                    height: 150px;
                    padding: 3px;
                    margin-top: 5px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    display: block;
                    margin: 5px auto;
                }
                .etat-details {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    margin-top: 10px;
                }
                .etat-details label {
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px;
                }
                .etat-details input[type="checkbox"] {
                    margin-right: 5px;
                }     
            .left p { text-align: center; }
            /* Alignement des titres */
            .conducteur-info p { display: flex; justify-content: space-between; }
            .conducteur-info p strong { flex-basis: 50%; text-align: left; }
            .conducteur-info p:nth-child(even) strong { text-align: right; }
          </style>
        </head>
        <body>
          <div class="contract">
            <div class="company-info">
              <img src="${logo}" alt="Logo"  margin-bottom: 3px;">
              <p>شركة رندر كار لكراء السيارات و التنشيط السياحي</p>
            </div>
            <h2 class="contract-title">Contrat de location / عقد الإيجار</h2>
            <div class="container">
              <div class="left">
                <p><strong>Type de voiture/نوع السيارة:</strong> ${vehicules ? vehicules.constructeur + " " + vehicules.type_constructeur : "N/A"}</p>
                <p><strong>Immatriculation / رقم التسجيل:</strong>  ${contract.num_immatriculation || "N/A"}</p>
                <p><strong>Carburant / نوع الوقود:</strong> ${vehicules ? vehicules.energie : "N/A"}</p>
                <p><strong>Date de Départ / تاريخ المغادرة:</strong> ${contract.Date_debut || "N/A"}</p>
                <p><strong>Heure / الوقت:</strong> ${contract.Heure_debut || "N/A"}</p>
                <p><strong>Date de Retour / تاريخ العودة:</strong> ${contract.Date_retour || "N/A"}</p>
                <p><strong>Heure / الوقت:</strong> ${contract.Heure_retour || "N/A"}</p>
                <p><strong>Durée de la location / مدة الإيجار:</strong> ${contract.Duree_location || "N/A"}</p>
                <p><strong>Prolongation / تمديد:</strong> ${contract.Prolongation || "N/A"}</p>
                <p><strong>Agence de Retour / وكالة العودة:</strong> ${contract.Agence_retour || ""}</p>
                <div class="caution-div">
                  <p><strong>Caution </strong> <span class="math-inline"></p\>
  <p\>Paiement de Jours en excès, heures en, km en excés</p\>
  <p\>Avance sur le montant de dégâts survenus au véhicules</p\>
  <p\>Paiement de remorquage </p\>
  <p\>Infraction Routière </p\>
  </div\>
                
                <img src="${etat}" alt="État du véhicule" class="etat-image"/>
                <p><strong>Kilomètrage </strong> ${contract.Kilometrage || "0"}</p>
                <p><strong>Carburant </strong> ${contract.Carburant || ""}</p>
                <p><strong>Etat de Pneu </strong> ${contract.Etat_pneu || ""}</p>
                <p><strong>Etat Intérieur </strong> ${contract.Etat_interieur || ""}</p>
                <p><strong>Tarif </strong> ${contract.Prix_total || ""}</p>
                <p><strong>Frais de Retour </strong> ${contract.Frais || ""}</p>
                <p><strong>Reste </strong> ${contract.Reste || ""}</p>
                <p><strong>Total Location en TTC </strong> ${contract.Prix_total * 1.19 || ""}</p>
              </div>
              <div class="right">
                ${chauffeursInfo || '<p>Aucun chauffeur associé à ce contrat / لا يوجد سائق مرتبط بهذا العقد</p>'}
              </div>
            </div>
            <div class="signature-area">
              <div>
                <div class="signature"></div>
                <p>Signature du Client / توقيع العميل</p>
              </div>
              <div>
                <div class="signature"></div>
                <p>Visa Rander Car / تأشيرة رندر كار</p>
              </div>
            </div>
            <div class="notes-area">
              <p><strong>A conserver: / يجب الاحتفاظ به:</strong> ce document doit être présenté à tout contrôle des agents de la sûreté nationale / يجب تقديم هذا المستند عند أي تفتيش من قبل ضباط الأمن الوطني.</p>
              <p>Bonne route et soyez prudent / طريق آمن وكن حذرًا.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  const columns = [
    { field: "Numero_contrat", headerName: "Numéro de Contrat", width: 180 },
    { field: "num_immatriculation", headerName: "Numéro d'Immatriculation", width: 180 },
    { field: "cin", headerName: "CIN", width: 150 },
    { field: "Date_debut", headerName: "Date de Début", width: 150 },
    { field: "Date_retour", headerName: "Date de Retour", width: 150 },
    { field: "Duree_location", headerName: "Durée de Location", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 650,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            onClick={() => handleView(params.row)}
            sx={{ backgroundColor: "#3d59d5", color: "white", marginRight: 2 }}
          >
            Voir
          </Button>
          {role === "admin" && (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleModify(params.row)}
              sx={{ bgcolor: "#3db351", color: "white", marginRight: 2 }}
              aria-label={`Modify contract ${params.row.Numero_contrat}`}
            >
              Modifier
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setSelectedContract(params.row);
                setOpenDeleteDialog(true); // Open delete confirmation dialog
              }}
              sx={{ marginRight: 2 }}
              aria-label={`Delete contract ${params.row.Numero_contrat}`}
            >
              Supprimer
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2d2c81", color: "white", marginRight: 2 }}
              onClick={() => handlePrint(params.row)}
              aria-label={`Print contract ${params.row.Numero_contrat}`}
            >
              Imprimer
            </Button>
          </>
        )}
        </div>
      ),
    },
  ];
  console.log("Data before DataGrid:", data); // Ajout de cette ligne

  return (
    <Box m="20px"
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
    }}>
      <Header title="Contrats" />
      {role === "admin" && (
      <Button variant="contained" sx={{ backgroundColor: "#3c55e2", color: "white" }} onClick={handleAddOpen}>
        Ajoute Contrat
      </Button>
       )}
      <Box>
        <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.ID_contrat}
            components={{ Toolbar: GridToolbar }}
            checkboxSelection
        />
    </Box>
      <AfficherContrat
        open={openAfficherContrat}
        handleClose={() => setOpenAfficherContrat(false)}
        selectedContrat={selectedContract}
        selectedClient={selectedClient}
        selectedVehicle={selectedVehicle}
      />
     
      <ModifieContrat
        open={openModifieContrat }
        handleClose={() => setOpenModifieContrat(false)}
        contrat={selectedContract}
        setContrat={setSelectedContract}
        handleUpdateContrat={(updatedContract) => {
          setData((prevData) => prevData.map((c) => (c.ID_contrat === updatedContract.ID_contrat ? updatedContract : c)));
        }}
      />
      <AjouteClient
        open={openAddClientDialog}
        handleClose={() => setOpenAddClientDialog(false)}
        newClient={newClient}
        setNewClient={setNewClient}
        handleAddClient={handleAddClient}
      />
<AjouteContrat
                open={openAddDialog}
                handleClose={handleAddClose}
                newContract={newContract} 
                setNewContract={setNewContract}
                handleAddContract={handleAddContract}
                availableVehicles={availableVehicles}
                onAllChauffeursAdded={handleAllChauffeursAdded}
                setOpenChauffeurDialogsProp={setOpenChauffeurDialog}
            />


            {openChauffeurDialog && (
                 <AjouteChauffeur
                 open={openChauffeurDialog}
                 handleClose={() => setOpenChauffeurDialog(false)}
                 newChauffeur={newChauffeur}
                 setNewChauffeur={setNewChauffeur}
                 setNewChauffeurs={setNewChauffeurs} // Passez la fonction ici
                 defaultContractNumber={newContract.Numero_contrat}
               />
            )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir supprimer ce Contrat ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
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

export default Contrat;