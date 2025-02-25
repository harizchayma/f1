import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Header } from '../../components';
import { tokens } from '../../theme';
import { useAuth } from "../context/AuthContext";
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import AjouteAvance from './AjouteAvance';
import Detailavance from "./Detailavance";
import AfficherAvance from './AfficheAvance';
import ModifierAvance from './ModifierAvance';

function Avance() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);
    const [contracts, setContracts] = useState([]);
    const { role } = useAuth();
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newAdvance, setNewAdvance] = useState({
        cin: '',
        date: '',
        Numero_contrat: '',
        Numero_avance: '',
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDetailAvanceDialog, setOpenDetailAvanceDialog] = useState(false);
    const [selectedAvanceNumber, setSelectedAvanceNumber] = useState(null);
    const [detailAvance, setDetailAvance] = useState({
        Numero_avance: '',
        montant: '',
        banque: '',
        mode_reglement: '', 
    });
    const [openVoirAvanceDialog, setOpenVoirAvanceDialog] = useState(false);

    const handleVoirAvanceClose = useCallback(() => setOpenVoirAvanceDialog(false), []);
    const [openModifierDialog, setOpenModifierDialog] = useState(false);
    const [avanceAModifierId, setAvanceAModifierId] = useState(null);

    const handleModifierClick = (avanceId) => {
        setAvanceAModifierId(avanceId);
        setOpenModifierDialog(true);
    };

    const handleAvanceModifiee = (avanceModifiee) => {
        setData(prevData => prevData.map(avance => avance.id_avance === avanceModifiee.id_avance ? avanceModifiee : avance));
    };

    const fetchAvanceDataAndDetailAvance = useCallback(async () => {
        try {
            const avanceResponse = await axios.get('http://localhost:7001/avance');
            if (avanceResponse.status >= 200 && avanceResponse.status < 300) {
                setData(avanceResponse.data.data);
            } else {
                throw new Error('Erreur lors de la récupération des données.');
            }
        } catch (error) {
            console.error('Error fetching avance data:', error);
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, []);

    const fetchContracts = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:7001/contrat');
            if (response.status >= 200 && response.status < 300) {
                setContracts(response.data.data);
            } else {
                throw new Error('Erreur lors de la récupération des contrats.');
            }
        } catch (error) {
            console.error('Error fetching contracts:', error);
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, []);

    const fetchDetailAvance = useCallback(async (numeroAvance) => {
        try {
            const response = await axios.get(`http://localhost:7001/detailAvance/${numeroAvance}`); // Utiliser Numero_avance
            if (response.status >= 200 && response.status < 300) {
                setDetailAvance(response.data.data);
            } else {
                throw new Error('Erreur lors de la récupération des détails de l\'avance.');
            }
        } catch (error) {
            console.error('Error fetching detail avance:', error);
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, []);

    useEffect(() => {
        fetchAvanceDataAndDetailAvance();
        fetchContracts();
        generateNextAvanceNumber();
    }, [fetchAvanceDataAndDetailAvance, fetchContracts]);

    const generateNextAvanceNumber = () => {
        if (data.length > 0) {
            const lastAvanceNumber = data.reduce((max, avance) => {
                const num = parseInt(avance.Numero_avance.replace(/\D/g, ''), 10);
                return num > max ? num : max;
            }, 0);
            const nextAvanceNumber = `V${(lastAvanceNumber + 1).toString().padStart(4, '0')}`;
            setNewAdvance(prev => ({ ...prev, Numero_avance: nextAvanceNumber }));
        } else {
            setNewAdvance(prev => ({ ...prev, Numero_avance: 'V0001' }));
        }
    };
    const handleVoirClick = useCallback((row) => {
        setSelectedAvanceNumber(row.Numero_avance);
        fetchDetailAvance(row.Numero_avance);
        setOpenVoirAvanceDialog(true); // Ouvrir le dialogue
    }, [fetchDetailAvance]);

    const handleAddOpen = useCallback(() => setOpenAddDialog(true), []);

    const handleAddClose = useCallback(() => {
        setOpenAddDialog(false);
        setNewAdvance({ cin: '', date: '', Numero_contrat: '', Numero_avance: '' });
        generateNextAvanceNumber();
    }, [generateNextAvanceNumber]);

    const handleAddAdvance = useCallback(async () => {
        try {
            const response = await axios.post('http://localhost:7001/avance', newAdvance);
            if (response.status >= 200 && response.status < 300) {
                setData((prevData) => [...prevData, { ...response.data.data, id: response.data.data.id_avance }]);
                setSnackbarMessage('Avance ajoutée avec succès !');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                handleAddClose();
                setSelectedAvanceNumber(newAdvance.Numero_avance);
                setOpenDetailAvanceDialog(true);
            } else {
                throw new Error(response.data?.message || 'Erreur lors de l\'ajout de l\'avance.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'avance:', error.response ? error.response.data : error);
            setSnackbarMessage(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'avance.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, [newAdvance, handleAddClose]);

    const handleContractChange = useCallback((event) => {
        const selectedContract = contracts.find(contract => contract.Numero_contrat === event.target.value);
        setNewAdvance(prev => ({
            ...prev,
            Numero_contrat: event.target.value,
            cin: selectedContract ? selectedContract.cin : '',
        }));
    }, [contracts]);

    const columns = [
        { field: 'Numero_avance', headerName: 'Numéro d\'Avance', width: 150 },
        { field: 'cin', headerName: 'CIN', width: 150 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'Numero_contrat', headerName: 'Numéro de Contrat', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 700,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#3d59d5", color: "white", marginRight: 2 }}
                        onClick={() => handleVoirClick(params.row)}
                        aria-label={`Voir l'avance ${params.row.Numero_avance}`}
                    >
                        Voir
                    </Button>
                    {role === "admin" && (
                        <>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#4caf50", color: "white", marginRight: 2 }}
                                onClick={() => handleModifierClick(params.row.id_avance)}
                                aria-label={`Modifier l'avance ${params.row.Numero_avance}`}
                            >
                                Modifier
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#d32f2f", color: "white", marginRight: 2 }}
                                onClick={() => {
                                    setSelectedAvance(params.row.id_avance);
                                    setOpenDeleteDialog(true); // Open delete confirmation dialog
                                }}
                                aria-label={`Supprimer l'avance ${params.row.Numero_avance}`}
                            >
                                Supprimer
                            </Button>
                        </>
                    )}
                </>
            ),
        },
    ];

    const handleSnackbarClose = useCallback(() => setSnackbarOpen(false), []);

    const handleDetailAvanceClose = () => {
        setOpenDetailAvanceDialog(false);
        setDetailAvance({
            Numero_avance: '',
            montant: '',
            banque: '',
            mode_reglement: '',
        });
        setSelectedAvanceNumber(null);
    };

    const handleAddDetailAvance = async () => {
        try {
            if (!detailAvance.banque || !detailAvance.mode_reglement) { // Correction ici
                setSnackbarMessage('Veuillez remplir tous les champs.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
            const response = await axios.post('http://localhost:7001/detailAvance', detailAvance);
            if (response.status >= 200 && response.status < 300) {
                setSnackbarMessage('Détail d\'avance ajouté avec succès !');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                handleDetailAvanceClose();
            } else {
                throw new Error(response.data?.message || 'Erreur lors de l\'ajout du détail d\'avance.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du détail d\'avance:', error.response ? error.response.data : error);
            setSnackbarMessage(error.response?.data?.message || 'Erreur lors de l\'ajout du détail d\'avance.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };
    const handleDeleteAvance = useCallback(async (avanceId) => {
        try {
            await axios.delete(`http://localhost:7001/avance/${avanceId}`);
            setData(prevData => prevData.filter(avance => avance.id_avance !== avanceId));
            setSnackbarMessage('Avance supprimée avec succès !');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'avance:', error);
            setSnackbarMessage('Erreur lors de la suppression de l\'avance.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, []);

    const handleDeleteDetailAvance = useCallback(async (avanceNumber) => {
        try {
            await axios.delete(`http://localhost:7001/detailAvance/${avanceNumber}`);
            setDetailAvance({ Numero_avance: '', montant: '', banque: '', mode_reglement: '' }); // Correction ici
            setSnackbarMessage('Détail d\'avance supprimé avec succès !');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setOpenDetailAvanceDialog(false);
        } catch (error) {
            console.error('Erreur lors de la suppression du détail d\'avance:', error);
            setSnackbarMessage('Erreur lors de la suppression du détail d\'avance.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, []);

    return (
        <Box m="20px">
            <Header title="Avances" />
            {role === "admin" && (
                <Button variant="contained" sx={{ backgroundColor: "#3c55e2", color: "white" }} onClick={handleAddOpen}>
                    Ajouter une Avance
                </Button>
            )}
            <Box mt="30px"
        height="70vh"
        width="100vh"
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
        }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    getRowId={(row) => row.id_avance}
                    components={{ Toolbar: GridToolbar }}
                    initialState={{ pagination: { paginationModel: { pageSize: 30, }, }, }}
                    checkboxSelection
                />
            </Box>
            <AjouteAvance 
                openAddDialog={openAddDialog} 
                handleAddClose={handleAddClose} 
                newAdvance={newAdvance} 
                setNewAdvance={setNewAdvance} 
                contracts={contracts} 
                handleContractChange={handleContractChange} 
                handleAddAdvance={handleAddAdvance} 
            />
            <Detailavance
                open={openDetailAvanceDialog}
                onClose={handleDetailAvanceClose}
                avanceOptions={selectedAvanceNumber ? [selectedAvanceNumber] : []}
                detailAvance={detailAvance}
                setDetailAvance={setDetailAvance}
                onAddDetailAvance={handleAddDetailAvance}
            />
            <AfficherAvance
    open={openVoirAvanceDialog}
    handleClose={handleVoirAvanceClose}
    selectedAvance={data.find(avance => avance.Numero_avance === selectedAvanceNumber)}
/>
<ModifierAvance
        open={openModifierDialog}
        handleClose={() => setOpenModifierDialog(false)}
        avanceId={avanceAModifierId}
        onAvanceModifiee={handleAvanceModifiee}
    />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
            </Snackbar>
        </Box>
    );
}

export default Avance;