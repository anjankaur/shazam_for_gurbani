/**
 * API Response Validation Utilities
 * Validates data structures from external APIs to ensure data integrity
 */

/**
 * Validate GurbaniNow API Shabad response
 * @param {Object} data - Response data from API
 * @returns {Object} - { valid: boolean, errors: string[], data: Object }
 */
export function validateShabadResponse(data) {
  const errors = [];

  if (!data) {
    errors.push("Response data is null or undefined");
    return { valid: false, errors, data: null };
  }

  // Validate shabad array
  if (!data.shabad || !Array.isArray(data.shabad)) {
    errors.push("Missing or invalid 'shabad' array");
  } else if (data.shabad.length === 0) {
    errors.push("Shabad array is empty");
  } else {
    // Validate each line in shabad
    data.shabad.forEach((item, index) => {
      if (!item.line) {
        errors.push(`Line ${index}: Missing 'line' object`);
      } else {
        // Validate Gurmukhi text
        if (!item.line.gurmukhi?.Gurmukhi) {
          errors.push(`Line ${index}: Missing Gurmukhi text`);
        }

        // Validate transliteration
        if (!item.line.transliteration?.english) {
          errors.push(`Line ${index}: Missing English transliteration`);
        }

        // Validate translation
        if (!item.line.translation?.english?.default) {
          errors.push(`Line ${index}: Missing English translation`);
        }
      }
    });
  }

  // Validate shabadinfo (optional but good to check)
  if (!data.shabadinfo) {
    errors.push("Missing 'shabadinfo' object (metadata)");
  } else {
    if (!data.shabadinfo.raag) {
      errors.push("Missing raag in shabadinfo");
    }
    if (!data.shabadinfo.pageNo && data.shabadinfo.pageNo !== 0) {
      errors.push("Missing pageNo in shabadinfo");
    }
    if (!data.shabadinfo.writer) {
      errors.push("Missing writer in shabadinfo");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : null
  };
}

/**
 * Validate Recognition API response
 * @param {Object} data - Response from recognition API
 * @returns {Object} - { valid: boolean, errors: string[], data: Object }
 */
export function validateRecognitionResponse(data) {
  const errors = [];

  if (!data) {
    errors.push("Response data is null or undefined");
    return { valid: false, errors, data: null };
  }

  // Check required fields
  if (typeof data.success !== 'boolean') {
    errors.push("Missing or invalid 'success' field");
  }

  // If successful, validate shabad_id
  if (data.success) {
    if (!data.shabad_id) {
      errors.push("Success is true but 'shabad_id' is missing");
    }

    if (data.confidence !== null && data.confidence !== undefined) {
      if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1) {
        errors.push("'confidence' must be a number between 0 and 1");
      }
    }
  } else {
    // If not successful, should have a message
    if (!data.message) {
      errors.push("Failed response should include 'message' field");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : null
  };
}

/**
 * Validate Gemini explanation response
 * @param {string} explanation - Generated explanation text
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateExplanationResponse(explanation) {
  const errors = [];

  if (!explanation || typeof explanation !== 'string') {
    errors.push("Explanation must be a non-empty string");
  } else if (explanation.trim().length === 0) {
    errors.push("Explanation is empty");
  } else if (explanation.length > 1000) {
    errors.push("Explanation is unusually long (>1000 characters)");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate Gemini voice response (base64 audio)
 * @param {string} audioBase64 - Base64 encoded audio data
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateVoiceResponse(audioBase64) {
  const errors = [];

  if (!audioBase64 || typeof audioBase64 !== 'string') {
    errors.push("Audio data must be a non-empty string");
  } else if (audioBase64.length === 0) {
    errors.push("Audio data is empty");
  } else {
    // Basic base64 validation
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(audioBase64)) {
      errors.push("Audio data is not valid base64");
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create a detailed error message from validation errors
 * @param {string} apiName - Name of the API
 * @param {string[]} errors - Array of error messages
 * @returns {string} - Formatted error message
 */
export function formatValidationError(apiName, errors) {
  if (errors.length === 0) return "";

  return `${apiName} validation failed:\n${errors.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}`;
}
