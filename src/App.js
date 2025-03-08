// src/App.js
import React, { useState } from 'react';
import FormComponent from './components/Formcomponent';
import ProfileView from './components/Profileview';
import './App.css';

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const handleSave = (formData) => {
    if (formData === null) {
      // Handle cancel
      setIsEditing(false);
      return;
    }
    
    console.log('Saving profile data:', formData);
    setProfileData(formData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    console.log('Edit button clicked');
    setIsEditing(true);
  };

  console.log('Current state:', { isEditing, hasProfileData: !!profileData });

  return (
    <div className="app">
      <header className="appHeader">
        <h1>Profile Management</h1>
      </header>
      
      <main className="appMain">
        {!isEditing && profileData ? (
          <ProfileView 
            profileData={profileData} 
            onEdit={handleEdit} 
          />
        ) : (
          <FormComponent 
            existingData={profileData}
            isEditMode={isEditing}
            onSave={handleSave}
          />
        )}
      </main>
      <footer className="appFooter">
        <p>© 2025 Forms</p>
      </footer>
    </div>
  );
}

export default App;