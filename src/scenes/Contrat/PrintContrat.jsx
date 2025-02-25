import React from 'react';

const PrintContrat = ({ contract }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="URL_DE_VOTRE_IMAGE_DE_CONTRAT" alt="Contract Header" style={{ maxWidth: '100%', height: 'auto' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <p><strong>Numéro de Contrat:</strong> {contract.Numero_contrat}</p>
          <p><strong>Numéro d'Immatriculation:</strong> {contract.num_immatriculation}</p>
          <p><strong>CIN:</strong> {contract.cin}</p>
          <p><strong>Date de Début:</strong> {contract.Date_debut}</p>
          <p><strong>Heure de Début:</strong> {contract.Heure_debut}</p>
          <p><strong>Date de Retour:</strong> {contract.Date_retour}</p>
          <p><strong>Heure de Retour:</strong> {contract.Heure_retour}</p>
          <p><strong>Durée de Location:</strong> {contract.Duree_location}</p>
          <p><strong>Prix Total:</strong> {contract.Prix_total}</p>
          {/* Add more fields from the left side of your image */}
        </div>
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <p><strong>Nom et Prénom (Conducteur 1):</strong> {contract.nom_prenom_conducteur1}</p>
          <p><strong>Date de Naissance (Conducteur 1):</strong> {contract.date_naissance_conducteur1}</p>
          <p><strong>Adresse (Conducteur 1):</strong> {contract.adresse_conducteur1}</p>
          <p><strong>Numéro de Permis (Conducteur 1):</strong> {contract.numero_permis_conducteur1}</p>
          <p><strong>Téléphone (Conducteur 1):</strong> {contract.telephone_conducteur1}</p>
          <p><strong>Nom et Prénom (Conducteur 2):</strong> {contract.nom_prenom_conducteur2}</p>
          <p><strong>Date de Naissance (Conducteur 2):</strong> {contract.date_naissance_conducteur2}</p>
          <p><strong>Adresse (Conducteur 2):</strong> {contract.adresse_conducteur2}</p>
          <p><strong>Numéro de Permis (Conducteur 2):</strong> {contract.numero_permis_conducteur2}</p>
          <p><strong>Téléphone (Conducteur 2):</strong> {contract.telephone_conducteur2}</p>
          {/* Add more fields from the right side of your image */}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p><strong>Signature du Client</strong></p>
        <div style={{ borderBottom: '1px solid #000', width: '200px', margin: '10px auto' }}></div>
        <p><strong>Visa Rania Car</strong></p>
        <div style={{ borderBottom: '1px solid #000', width: '200px', margin: '10px auto' }}></div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '0.8em', textAlign: 'center' }}>
        <p>A conserver: ce document doit être présenté à tout contrôle des agents de la sûreté nationale</p>
        <p>PASSE LA DATE DE RETOUR PREVU LE CONTRAT N'EST PLUS VALABLE POUR LOCATION</p>
        <p>Bonne route et soyez prudent</p>
      </div>
    </div>
  );
};

export default PrintContrat;