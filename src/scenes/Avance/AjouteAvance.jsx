import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function AjouteAvance({ openAddDialog, handleAddClose, newAdvance, setNewAdvance, contracts, handleContractChange, handleAddAdvance }) {
  return (
    <>
      {/* Add Advance Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ontSize: '2rem', fontWeight: 'bold', bgcolor: '#1976d2', color: 'white', textAlign: 'center' }}>
        Ajouter une Avance
      </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="contract-select-label">Numéro de Contrat</InputLabel>
            <Select
              labelId="contract-select-label"
              value={newAdvance.Numero_contrat}
              onChange={handleContractChange}
            >
              {contracts.map((contract) => (
                <MenuItem key={contract.id} value={contract.Numero_contrat}>
                  {contract.Numero_contrat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="CIN"
            value={newAdvance.cin}
            onChange={(e) => setNewAdvance({ ...newAdvance, cin: e.target.value })}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Numéro d'Avance"
            value={newAdvance.Numero_avance}
            onChange={(e) => setNewAdvance({ ...newAdvance, Numero_avance: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            type="date"
            value={newAdvance.date}
            onChange={(e) => setNewAdvance({ ...newAdvance, date: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleAddAdvance} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AjouteAvance;