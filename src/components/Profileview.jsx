import React from 'react';
import './Profileview.css';

const ProfileView = ({ profileData, onEdit }) => {
  if (!profileData) return null;

  return (
    <div className="profileView">
      <div className="profileHeader">
        <h2>Profile Information</h2>
        <button 
          className="editButton" 
          onClick={onEdit}
          type="button"
        >
          Edit Profile
        </button>
      </div>

      <div className="profileContent">
        {/* Profile Picture */}
        {profileData.profilePicture && (
          <div className="profileImage">
            <img 
              src={typeof profileData.profilePicture === 'string' 
                ? profileData.profilePicture 
                : URL.createObjectURL(profileData.profilePicture)
              } 
              alt="Profile" 
            />
          </div>
        )}

        {/* Profile Details */}
        <div className="profileDetails">
          <div className="detailItem">
            <label>Username:</label>
            <span>{profileData.username}</span>
          </div>

          <div className="detailItem">
            <label>Bio:</label>
            <p>{profileData.bio}</p>
          </div>

          <div className="detailItem">
            <label>Email:</label>
            <span>{profileData.email}</span>
          </div>

          {profileData.portfolioLink && (
            <div className="detailItem">
              <label>Portfolio:</label>
              <a href={profileData.portfolioLink} target="_blank" rel="noopener noreferrer">
                {profileData.portfolioLink}
              </a>
            </div>
          )}

          <div className="detailItem">
            <label>LinkedIn:</label>
            <a href={profileData.linkedIn} target="_blank" rel="noopener noreferrer">
              {profileData.linkedIn}
            </a>
          </div>

          <div className="detailItem">
            <label>LeetCode:</label>
            <a href={profileData.leetCode} target="_blank" rel="noopener noreferrer">
              {profileData.leetCode}
            </a>
          </div>

          {profileData.codeChef && (
            <div className="detailItem">
              <label>CodeChef:</label>
              <a href={profileData.codeChef} target="_blank" rel="noopener noreferrer">
                {profileData.codeChef}
              </a>
            </div>
          )}

          {profileData.geeksforGeeks && (
            <div className="detailItem">
              <label>GeeksforGeeks:</label>
              <a href={profileData.geeksforGeeks} target="_blank" rel="noopener noreferrer">
                {profileData.geeksforGeeks}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
