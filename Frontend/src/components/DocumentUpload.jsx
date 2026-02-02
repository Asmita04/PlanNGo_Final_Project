import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services';
import { useApp } from '../context/AppContext';
import './DocumentUpload.css';

const DocumentUpload = () => {
  const { user, addNotification } = useApp();
  const [documents, setDocuments] = useState({
    adhar: null,
    pan: null
  });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (docType, event) => {
    const file = event.target.files[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [docType]: file
      }));
    }
  };

  const handleUpload = async () => {
    if (!documents.adhar || !documents.pan) {
      addNotification({ 
        message: 'Please select both Adhar and PAN documents', 
        type: 'error' 
      });
      return;
    }

    setUploading(true);
    try {
      const files = [documents.adhar, documents.pan];
      const docTypes = ['ADHAR', 'PAN'];
      
      await api.uploadDocuments(user.id, files, docTypes);
      addNotification({ 
        message: 'Documents uploaded successfully!', 
        type: 'success' 
      });
      
      // Reset form
      setDocuments({
        adhar: null,
        pan: null
      });
    } catch (error) {
      console.error('Upload error:', error);
      addNotification({ 
        message: 'Failed to upload documents', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  const isUploadDisabled = !documents.adhar || !documents.pan || uploading;

  return (
    <div className="document-upload">
      <div className="upload-header">
        <h2>Upload Verification Documents</h2>
        <p>Please upload both required documents to complete verification</p>
      </div>

      <div className="upload-sections">
        <div className="upload-section">
          <div className="section-header">
            <FileText size={20} />
            <h3>Adhar Card</h3>
            <span className="required">*Required</span>
          </div>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="adhar"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange('adhar', e)}
            />
            <label htmlFor="adhar" className="file-input-label">
              {documents.adhar ? (
                <div className="file-selected">
                  <CheckCircle size={20} />
                  <span>{documents.adhar.name}</span>
                </div>
              ) : (
                <div className="file-placeholder">
                  <Upload size={20} />
                  <span>Choose Adhar Card</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="upload-section">
          <div className="section-header">
            <FileText size={20} />
            <h3>PAN Card</h3>
            <span className="required">*Required</span>
          </div>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="pan"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange('pan', e)}
            />
            <label htmlFor="pan" className="file-input-label">
              {documents.pan ? (
                <div className="file-selected">
                  <CheckCircle size={20} />
                  <span>{documents.pan.name}</span>
                </div>
              ) : (
                <div className="file-placeholder">
                  <Upload size={20} />
                  <span>Choose PAN Card</span>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="upload-actions">
        {!documents.adhar || !documents.pan ? (
          <div className="upload-warning">
            <AlertCircle size={16} />
            <span>Both documents are required to proceed</span>
          </div>
        ) : null}
        
        <button 
          className="upload-btn"
          onClick={handleUpload}
          disabled={isUploadDisabled}
        >
          <Upload size={20} />
          {uploading ? 'Uploading...' : 'Upload Documents'}
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload;