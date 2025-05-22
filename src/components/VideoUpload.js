import React, { useState, useCallback, useRef } from 'react';

const VideoUpload = ({ onVideoSelect, onUpload, loading, selectedFile }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('video/')) {
      onVideoSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid video file.');
      onVideoSelect(null);
      setPreviewUrl(null);
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
      if (fileInputRef.current) {
        // To make sure the input visually reflects the dropped file (optional)
        fileInputRef.current.files = event.dataTransfer.files;
      }
    }
  }, [onVideoSelect]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="video-upload-section">
      <h2><span role="img" aria-label="video camera">📹</span> Upload Your Video</h2>
      <div
        className={`dropzone ${isDragging ? 'drag-over' : ''}`}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="file-input"
          ref={fileInputRef}
        />
        <div className="upload-icon">🎬</div>
        <p>{selectedFile ? selectedFile.name : 'Drag & drop a video file here, or click to select'}</p>
      </div>

      {previewUrl && (
        <div className="video-preview-container">
          <h3>Video Preview:</h3>
          <video className="video-preview" src={previewUrl} controls width="600" />
        </div>
      )}

      {selectedFile && (
        <button
          onClick={onUpload}
          disabled={loading}
          className="upload-button"
        >
          {loading ? 'Analyzing...' : '🔎 Analyze Video'}
        </button>
      )}
    </div>
  );
};

export default VideoUpload;