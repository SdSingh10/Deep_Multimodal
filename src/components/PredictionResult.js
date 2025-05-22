import React from 'react';

const PredictionResult = ({ result, error }) => {
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!result) {
    return null; // Don't render anything if there's no result yet
  }

  // Example result structure:
  // {
  //   is_hate_speech: true,
  //   confidence: 0.92,
  //   segments: [
  //     { start_time: 10.5, end_time: 15.2, text: "..." },
  //     { start_time: 25.0, end_time: 28.7, text: "..." }
  //   ],
  //   summary: "High probability of hate speech detected in multiple segments."
  // }

  const getResultCardClass = (confidence) => {
    if (confidence > 0.75) return 'danger';
    if (confidence > 0.5) return 'warning';
    return 'safe';
  };

  const cardClass = result.is_hate_speech ? getResultCardClass(result.confidence) : 'safe';
  const overallStatus = result.is_hate_speech ? "Hate Speech Detected" : "No Hate Speech Detected";
  const statusIcon = result.is_hate_speech ? "⚠️" : "✅";

  return (
    <div className="results-section">
      <h2><span role="img" aria-label="chart">📊</span> Analysis Results</h2>
      <div className={`result-card ${cardClass}`}>
        <h3>{statusIcon} {overallStatus}</h3>
        <p><strong>Confidence Score:</strong> {result.confidence !== undefined ? (result.confidence * 100).toFixed(2) + '%' : 'N/A'}</p>
        
        {result.summary && (
            <p><strong>Summary:</strong> {result.summary}</p>
        )}

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
         {!result.is_hate_speech && !result.summary && (
             <p>The video content appears to be clear of hate speech based on our analysis.</p>
         )}
      </div>
    </div>
  );
};

export default PredictionResult;