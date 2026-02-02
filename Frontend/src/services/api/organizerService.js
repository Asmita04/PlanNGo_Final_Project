import axios from 'axios';

export const organizerService = {
  uploadDocuments: async (userId, files, docTypes) => {
    const formData = new FormData();
    
    // Append files
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Append document types
    docTypes.forEach(docType => {
      formData.append('docType', docType);
    });
    
    return await axios.post(`http://localhost:9090/organizer/documents/${userId}`, formData);
  }
};