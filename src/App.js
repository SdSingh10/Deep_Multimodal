import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import VideoUpload from './components/VideoUpload';
import PredictionResult from './components/PredictionResult';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVideoSelect = (file) => {
    setSelectedFile(file);
    setPredictionResult(null); // Reset previous results
    setError(''); // Reset previous errors
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a video file first.');
      return;
    }

    setLoading(true);
    setError('');
    setPredictionResult(null);

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      // Replace with your actual backend API endpoint
      const response = await axios.post('http://localhost:5001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPredictionResult(response.data);
    } catch (err) {
      console.error("Error uploading or processing video:", err);
      if (err.response) {
        setError(`Server error: ${err.response.data.error || err.response.statusText}`);
      } else if (err.request) {
        setError('Network error: Could not connect to the server. Is it running?');
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1><span className="icon" role="img" aria-label="shield">🛡️</span> Deep Multimodal</h1>
        <p>AI-Powered Hate Speech Detection in Videos</p>
      </header>

      <main className="main-content">
        <VideoUpload
          onVideoSelect={handleVideoSelect}
          onUpload={handleUpload}
          loading={loading}
          selectedFile={selectedFile}
        />

        {loading && <div className="loading-spinner"></div>}

        {error && <div className="error-message">{error}</div>}
        
        {!loading && predictionResult && (
          <PredictionResult result={predictionResult} />
        )}
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Deep Multimodal. Protecting online communities.</p>
      </footer>
    </div>
  );
}

export default App;