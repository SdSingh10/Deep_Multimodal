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
      const response = await axios.post('http://localhost:5001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Process the new backend response
      const backendResponse = response.data;
      let processedResult = {};

      // Expected backendResponse: { "category": "hate", "confidence_hate": 0.54, "confidence_nhate": 0.34 }
      const confidenceHate = parseFloat(backendResponse.confidence_hate);
      const confidenceNhate = parseFloat(backendResponse.confidence_nhate);
      const diff = Math.abs(confidenceHate - confidenceNhate);

      if (diff < 0.4) {
        processedResult = {
          is_hate_speech: false, // Not strictly hate, but neutral
          neutral: true,
          confidence: Math.max(confidenceHate, confidenceNhate), // Represent with the higher confidence
          confidence_details: { // Optionally pass both for more detailed display
            hate: confidenceHate,
            nhate: confidenceNhate,
          },
          summary: `The content is classified as neutral. Confidence (Hate): ${(confidenceHate * 100).toFixed(1)}%, Confidence (Non-Hate): ${(confidenceNhate * 100).toFixed(1)}%. The difference is small.`,
          segments: [], // Assuming no segments from this new endpoint structure
        };
      } else if (backendResponse.category === "hate") {
        processedResult = {
          is_hate_speech: true,
          neutral: false,
          confidence: confidenceHate,
          summary: "Hate speech has been detected in the video.",
          segments: [],
        };
      } else { // category is "nhate" (or any other non-hate category) and diff >= 0.4
        processedResult = {
          is_hate_speech: false,
          neutral: false,
          confidence: confidenceNhate, // Confidence for non-hate
          summary: "No hate speech was detected in the video.",
          segments: [],
        };
      }
      setPredictionResult(processedResult);

    } catch (err) {
      console.error("Error uploading or processing video:", err);
      if (err.response) {
        setError(`Server error: ${err.response.data.error || err.response.statusText || err.response.status}`);
      } else if (err.request) {
        setError('Network error: Could not connect to the server. Is it running and accessible at http://localhost:5001?');
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