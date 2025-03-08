// src/components/FormComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  isRequired, 
  validateLength, 
  isValidUrl, 
  isValidEmail,
  isValidFileType,
  isValidFileSize
} from '../utils/Validation';
import './Formstyles.css';

const Formcomponent = ({ existingData, isEditMode = false, onSave }) => {
  // Initialize form state - use existingData if provided, otherwise use defaults
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    portfolioLink: "",
    resumeLink: "",
    resumeFile: null,
    profilePicture: null,
    email: "",
    linkedIn: "",
    leetCode: "",
    codeChef: "",
    geeksforGeeks: "",
    ...(existingData || {})
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Touched fields tracking
  const [touched, setTouched] = useState({});

  // Set resumeInputType based on whether a resumeLink or resumeFile exists in existing data
  const [resumeInputType, setResumeInputType] = useState(() => {
    if (isEditMode) {
      return existingData && existingData.resumeLink ? 'link' : 'file';
    }
    return 'file';
  });

  // Effect to update form when existingData changes
  useEffect(() => {
    if (isEditMode && existingData) {
      setFormData(prevData => ({
        ...prevData,
        ...existingData
      }));
      
      // If we're in edit mode with data, consider all fields "touched" for validation display
      if (existingData) {
        const allFieldsTouched = Object.keys(existingData).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allFieldsTouched);
      }
    }
  }, [existingData, isEditMode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0] || null
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Mark field as touched
    setTouched({
      ...touched,
      [name]: true
    });
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
  };

  // Handle toggle between resume file and link
  const handleResumeTypeToggle = (type) => {
    setResumeInputType(type);
    
    // Clear the opposite type when switching
    if (type === 'file') {
      setFormData({
        ...formData,
        resumeLink: ''
      });
    } else {
      setFormData({
        ...formData,
        resumeFile: null
      });
    }
  };

  // Validate form data - using useCallback to memoize the function
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Username validation
    if (!isRequired(formData.username)) {
      newErrors.username = 'Username is required';
    }
    
    // Bio validation
    if (!isRequired(formData.bio)) {
      newErrors.bio = 'Bio is required';
    } else if (!validateLength(formData.bio, 150, 200)) {
      newErrors.bio = 'Bio must be between 150 and 200 characters';
    }
    
    // Portfolio link validation (optional)
    if (formData.portfolioLink && !isValidUrl(formData.portfolioLink)) {
      newErrors.portfolioLink = 'Please enter a valid URL';
    }
    
    // Resume validation
    if (resumeInputType === 'file') {
      // If in edit mode and no new file is selected, don't require it if we already have one
      if (!formData.resumeFile && !isEditMode) {
        newErrors.resumeFile = 'Resume file is required';
      }
    } else {
      if (!isRequired(formData.resumeLink)) {
        newErrors.resumeLink = 'Resume link is required';
      } else if (!isValidUrl(formData.resumeLink)) {
        newErrors.resumeLink = 'Please enter a valid URL';
      }
    }
    
    // Profile picture validation - less strict in edit mode if not changed
    if (!formData.profilePicture && !isEditMode) {
      newErrors.profilePicture = 'Profile picture is required';
    } else if (formData.profilePicture) {
      // Only validate the file if a new one is selected
      if (!isValidFileType(formData.profilePicture, ['image/jpeg', 'image/jpg'])) {
        newErrors.profilePicture = 'Only JPG/JPEG files are allowed';
      }
      
      if (!isValidFileSize(formData.profilePicture, 2 * 1024 * 1024)) { // 2MB
        newErrors.profilePicture = 'Image size must be less than 2MB';
      }
    }
    
    // Email validation
    if (!isRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // LinkedIn validation
    if (!isRequired(formData.linkedIn)) {
      newErrors.linkedIn = 'LinkedIn profile is required';
    } else if (!isValidUrl(formData.linkedIn)) {
      newErrors.linkedIn = 'Please enter a valid LinkedIn URL';
    }
    
    // LeetCode validation
    if (!isRequired(formData.leetCode)) {
      newErrors.leetCode = 'LeetCode profile is required';
    } else if (!isValidUrl(formData.leetCode)) {
      newErrors.leetCode = 'Please enter a valid LeetCode URL';
    }
    
    // Optional platforms validation
    if (formData.codeChef && !isValidUrl(formData.codeChef)) {
      newErrors.codeChef = 'Please enter a valid CodeChef URL';
    }
    
    if (formData.geeksforGeeks && !isValidUrl(formData.geeksforGeeks)) {
      newErrors.geeksforGeeks = 'Please enter a valid GeeksforGeeks URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, resumeInputType, isEditMode]);

  // Validate on change - fixed dependency array
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    const isValid = validateForm();
    
    if (isValid) {
      // Form is valid, proceed with submission
      console.log(`Form ${isEditMode ? 'updated' : 'submitted'} successfully`, formData);
      
      // If onSave callback is provided, call it with the form data
      if (onSave) {
        onSave(formData);
      }
    } else {
      console.log('Form has errors', errors);
    }
  };

  // Helper to determine if a field has an error and has been touched
  const hasError = (field) => {
    return touched[field] && errors[field];
  };

  // Calculate remaining characters for bio
  const bioCharCount = formData.bio.length;
  const isBioInRange = bioCharCount >= 150 && bioCharCount <= 200;

  // Preview URL for profile image
  const profileImageSrc = formData.profilePicture 
    ? (formData.profilePicture instanceof File 
        ? URL.createObjectURL(formData.profilePicture)
        : formData.profilePicture) // For existing image URL in edit mode
    : null;

  return (
    <div className="formContainer">
      <h2>{isEditMode ? 'Edit Profile Information' : 'Profile Information'}</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div className="formGroup">
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError('username') ? 'inputError' : ''}
          />
          {hasError('username') && <div className="errorMessage">{errors.username}</div>}
        </div>

        {/* Bio */}
        <div className="formGroup">
          <label htmlFor="bio">Bio * (150-200 characters)</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError('bio') ? 'inputError' : ''}
          />
          <div className={`charCounter ${isBioInRange ? 'charValid' : 'charInvalid'}`}>
            {bioCharCount}/200 characters
            {bioCharCount < 150 && ` (${150 - bioCharCount} more needed)`}
          </div>
          {hasError('bio') && <div className="errorMessage">{errors.bio}</div>}
        </div>

        {/* Portfolio Link */}
        <div className="formGroup">
          <label htmlFor="portfolioLink">Portfolio Link (Optional)</label>
          <input
            type="url"
            id="portfolioLink"
            name="portfolioLink"
            value={formData.portfolioLink}
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError('portfolioLink') ? 'inputError' : ''}
          />
          {hasError('portfolioLink') && <div className="errorMessage">{errors.portfolioLink}</div>}
        </div>

        {/* Resume */}
        <div className="formGroup">
          <label>Resume *</label>
          <div className="toggleContainer">
            <button 
              type="button" 
              className={`toggleButton ${resumeInputType === 'file' ? 'active' : ''}`}
              onClick={() => handleResumeTypeToggle('file')}
            >
              Upload File
            </button>
            <button 
              type="button" 
              className={`toggleButton ${resumeInputType === 'link' ? 'active' : ''}`}
              onClick={() => handleResumeTypeToggle('link')}
            >
              Provide Link
            </button>
          </div>
          
          {resumeInputType === 'file' ? (
            <>
              <input
                type="file"
                id="resumeFile"
                name="resumeFile"
                onChange={handleChange}
                onBlur={handleBlur}
                className={hasError('resumeFile') ? 'inputError' : ''}
              />
              {isEditMode && formData.resumeFile && typeof formData.resumeFile === 'string' && (
                <div className="fileInfo">Current file: {formData.resumeFile}</div>
              )}
              {hasError('resumeFile') && <div className="errorMessage">{errors.resumeFile}</div>}
            </>
          ) : (
            <>
              <input
                type="url"
                id="resumeLink"
                name="resumeLink"
                value={formData.resumeLink}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter resume link"
                className={hasError('resumeLink') ? 'inputError' : ''}
              />
              {hasError('resumeLink') && <div className="errorMessage">{errors.resumeLink}</div>}
            </>
          )}
        </div>

        {/* Profile Picture */}
        <div className="formGroup">
          <label htmlFor="profilePicture">Profile Picture * (JPG/JPEG, less than 2MB)</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept=".jpg,.jpeg"
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError('profilePicture') ? 'inputError' : ''}
          />
          {hasError('profilePicture') && <div className="errorMessage">{errors.profilePicture}</div>}
          {isEditMode && !formData.profilePicture && existingData && existingData.profilePicture && (
            <div className="fileInfo">Current image will be kept if no new image is selected</div>
          )}
          {profileImageSrc && (
            <div className="previewContainer">
              <img 
                src={profileImageSrc} 
                alt="Profile preview" 
                className="imagePreview" 
              />
            </div>
          )}
        </div>

        {/* Email */}
        <div className="formGroup">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError('email') ? 'inputError' : ''}
          />
          {hasError('email') && <div className="errorMessage">{errors.email}</div>}
        </div>

        <h3>Social Accounts</h3>

        {/* LinkedIn */}
        <div className="formGroup">
          <label htmlFor="linkedIn">LinkedIn *</label>
          <input
            type="url"
            id="linkedIn"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError('linkedIn') ? 'inputError' : ''}
          />
          {hasError('linkedIn') && <div className="errorMessage">{errors.linkedIn}</div>}
        </div>

        {/* LeetCode */}
        <div className="formGroup">
          <label htmlFor="leetCode">LeetCode *</label>
          <input
            type="url"
            id="leetCode"
            name="leetCode"
            value={formData.leetCode}
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError('leetCode') ? 'inputError' : ''}
          />
          {hasError('leetCode') && <div className="errorMessage">{errors.leetCode}</div>}
        </div>

        {/* Optional Platforms */}
        <div className="formGroup">
          <label htmlFor="codeChef">CodeChef (Optional)</label>
          <input
            type="url"
            id="codeChef"
            name="codeChef"
            value={formData.codeChef}
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError('codeChef') ? 'inputError' : ''}
          />
          {hasError('codeChef') && <div className="errorMessage">{errors.codeChef}</div>}
        </div>

        <div className="formGroup">
          <label htmlFor="geeksforGeeks">GeeksforGeeks (Optional)</label>
          <input
            type="url"
            id="geeksforGeeks"
            name="geeksforGeeks"
            value={formData.geeksforGeeks}
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError('geeksforGeeks') ? 'inputError' : ''}
          />
          {hasError('geeksforGeeks') && <div className="errorMessage">{errors.geeksforGeeks}</div>}
        </div>

        <button type="submit" className="submitButton">
          {isEditMode ? 'Update Profile' : 'Submit'}
        </button>
        
        {isEditMode && (
          <button 
            type="button" 
            className="cancelButton" 
            onClick={() => onSave && onSave(null)}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default Formcomponent;