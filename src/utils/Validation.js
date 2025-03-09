/**
 * Validates if a field has a value
 * @param {string} value - The field value to check
 * @returns {boolean} - True if valid, false otherwise
 */
export const isRequired = (value) => {
    return value && value.trim().length > 0;
  };
  
  /**
   * Validates text length is within specified bounds
   * @param {string} value - The text to validate
   * @param {number} min - Minimum required length
   * @param {number} max - Maximum allowed length
   * @returns {boolean} - True if valid, false otherwise
   */
  export const validateLength = (value, min, max) => {
    const length = value ? value.trim().length : 0;
    return length >= min && length <= max;
  };
  
  /**
   * Validates if a string is a valid URL
   * @param {string} url - The URL to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  export const isValidUrl = (url) => {
    if (!url) return false;
    
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Validates if a string is a valid email
   * @param {string} email - The email to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  export const isValidEmail = (email) => {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  console.log(isValidEmail("invalid-email")); 
  
  /**
   * Validates file type
   * @param {File} file - The file to validate
   * @param {Array} allowedTypes - Array of allowed MIME types
   * @returns {boolean} - True if valid, false otherwise
   */
  export const isValidFileType = (file, allowedTypes) => {
    if (!file) return false;
    return allowedTypes.includes(file.type);
  };
  
  /**
   * Validates file size
   * @param {File} file - The file to validate
   * @param {number} maxSizeInBytes - Maximum allowed size in bytes
   * @returns {boolean} - True if valid, false otherwise
   */
  export const isValidFileSize = (file, maxSizeInBytes) => {
    if (!file) return false;
    return file.size <= maxSizeInBytes;
  };