import React from 'react';

const PredictionResult = ({ result }) => {
  // error prop is removed as App.js now handles error display directly above this component
  if (!result) {
    return null; // Don't render anything if there's no result yet
  }

  let cardClass = '';
  let overallStatus = '';
  let statusIcon = '';
  let confidenceText = 'N/A';

  if (result.neutral) {
    cardClass = 'neutral'; // Using 'warning' style for neutral, or create a 'neutral' class
    overallStatus = "Neutral Content Classification";
    statusIcon = "⚖️"; // Icon for neutral
    // Detailed confidence is in the summary from App.js
    // If you want to show the primary confidence here:
    confidenceText = result.confidence !== undefined ? (result.confidence * 100).toFixed(2) + '%' : 'N/A';
    // Or display both if available in result.confidence_details
    if (result.confidence_details) {
        confidenceText = `Hate: ${(result.confidence_details.hate * 100).toFixed(1)}%, Non-Hate: ${(result.confidence_details.nhate * 100).toFixed(1)}%`;
    }

  } else if (result.is_hate_speech) {
    if (result.confidence > 0.75) cardClass = 'danger';
    else if (result.confidence > 0.5) cardClass = 'warning';
    else cardClass = 'warning'; // Default for hate speech if confidence is lower but still classified as hate
    overallStatus = "Hate Speech Detected";
    statusIcon = "⚠️";
    confidenceText = result.confidence !== undefined ? (result.confidence * 100).toFixed(2) + '%' : 'N/A';
  } else { // No hate speech and not neutral
    cardClass = 'safe';
    overallStatus = "No Hate Speech Detected";
    statusIcon = "✅";
    confidenceText = result.confidence !== undefined ? (result.confidence * 100).toFixed(2) + '%' : 'N/A';
  }

  return (
    <div className="results-section">
      <h2><span role="img" aria-label="chart">📊</span> Analysis Results</h2>
      <div className={`result-card ${cardClass}`}>
        <h3>{statusIcon} {overallStatus}</h3>
        
        {/* Display confidence based on type of result */}
        <p><strong>Confidence Score:</strong> {confidenceText}</p>
        
        {result.summary && (
          <p><strong>Summary:</strong> {result.summary}</p>
        )}

        {/* Segments section is kept for potential future use, but will likely be empty with the current backend response */}
        {result.segments && result.segments.length > 0 && (
          <div>
            <h4>Potentially Problematic Segments:</h4>
            <ul>
              {result.segments.map((segment, index) => (
                <li key={index}>
                  <strong>Time:</strong> {segment.start_time.toFixed(1)}s - {segment.end_time.toFixed(1)}s
                  {segment.text && <p><em>"{segment.text}"</em></p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Fallback message if no hate, not neutral, and no specific summary (though App.js now always provides a summary) */}
        {!result.is_hate_speech && !result.neutral && !result.summary && (
             <p>The video content appears to be clear of hate speech based on our analysis.</p>
        )}
      </div>
    </div>
  );
};

export default PredictionResult;