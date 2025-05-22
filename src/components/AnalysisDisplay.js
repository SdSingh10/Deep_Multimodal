import React from 'react';
import { AlertTriangle, CheckCircle2, BarChart2, Clock } from 'lucide-react';

const AnalysisDisplay = ({ analysisResult, isProcessing, error }) => {
  if (isProcessing) {
    return (
      <div className="analysis-display-container" style={{ textAlign: 'center', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', background: '#fefcbf1a' }}>
        <div className="spinner"></div>
        <p style={{ fontWeight: '500', color: 'var(--text-color)' }}>Analyzing video... This may take a few moments.</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light-color)' }}>Please wait while our AI processes the content.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-display-container result-card error" style={styles.cardBase}>
        <div style={{ ...styles.iconWrapper, backgroundColor: 'var(--danger-color)' }}>
          <AlertTriangle size={32} color="white" />
        </div>
        <h3 style={{ ...styles.title, color: 'var(--danger-color)' }}>Analysis Failed</h3>
        <p style={styles.text}>{error}</p>
        <p style={styles.text}>Please try again or upload a different video.</p>
      </div>
    );
  }

  if (!analysisResult) {
    return (
        <div className="analysis-display-container" style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius)', background: '#f0f8ff4d' }}>
            <BarChart2 size={48} color="var(--text-light-color)" style={{ marginBottom: '1rem' }} />
            <p style={{ fontWeight: '500', color: 'var(--text-light-color)' }}>Analysis results will appear here.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light-color)' }}>Upload a video to start the detection process.</p>
        </div>
    );
  }

  const { is_hate_speech, confidence, details, segments } = analysisResult;
  const resultColor = is_hate_speech ? 'var(--danger-color)' : 'var(--secondary-color)';
  const ResultIcon = is_hate_speech ? AlertTriangle : CheckCircle2;

  return (
    <div className="analysis-display-container result-card" style={{ ...styles.cardBase, borderColor: resultColor }}>
      <div style={{ ...styles.iconWrapper, backgroundColor: resultColor }}>
        <ResultIcon size={32} color="white" />
      </div>
      <h3 style={{ ...styles.title, color: resultColor }}>
        {is_hate_speech ? 'Potential Hate Speech Detected' : 'No Hate Speech Detected'}
      </h3>

      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Confidence:</span>
          <span style={{ ...styles.infoValue, color: resultColor, fontWeight: 'bold' }}>
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>
        {details && (
            <div style={styles.infoItemFull}>
                <span style={styles.infoLabel}>Details:</span>
                <span style={styles.infoValue}>{details}</span>
            </div>
        )}
      </div>

      {segments && segments.length > 0 && (
        <div style={styles.segmentsSection}>
          <h4 style={styles.segmentsTitle}><Clock size={18} style={{ marginRight: '0.5rem', verticalAlign: 'bottom' }} />Detected Segments:</h4>
          <ul style={styles.segmentsList}>
            {segments.map((segment, index) => (
              <li key={index} style={styles.segmentItem}>
                <span style={styles.segmentTime}>[{segment.start_time} - {segment.end_time}]</span>
                <span style={styles.segmentText}>{segment.text || 'Potentially problematic content'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  cardBase: {
    padding: '2rem',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'var(--card-background-color)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    textAlign: 'center',
    borderTopWidth: '4px',
  },
  iconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem auto',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  text: {
    color: 'var(--text-light-color)',
    marginBottom: '0.5rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
    textAlign: 'left',
    marginBottom: '1.5rem',
    borderTop: '1px solid var(--border-color)',
    borderBottom: '1px solid var(--border-color)',
    padding: '1rem 0',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    backgroundColor: '#F9FAFB',
    borderRadius: 'calc(var(--border-radius) / 2)',
  },
  infoItemFull: {
    gridColumn: '1 / -1',
    padding: '0.5rem',
    backgroundColor: '#F9FAFB',
    borderRadius: 'calc(var(--border-radius) / 2)',
  },
  infoLabel: {
    fontWeight: '500',
    color: 'var(--text-color)',
  },
  infoValue: {
    color: 'var(--text-light-color)',
  },
  segmentsSection: {
    textAlign: 'left',
    marginTop: '1.5rem',
  },
  segmentsTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text-color)',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center'
  },
  segmentsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '200px',
    overflowY: 'auto',
  },
  segmentItem: {
    padding: '0.75rem',
    backgroundColor: '#F9FAFB',
    borderRadius: 'calc(var(--border-radius) / 2)',
    marginBottom: '0.5rem',
    borderLeft: '3px solid var(--primary-color)',
  },
  segmentTime: {
    fontWeight: '500',
    color: 'var(--primary-color)',
    marginRight: '0.75rem',
  },
  segmentText: {
    color: 'var(--text-light-color)',
  }
};

export default AnalysisDisplay;