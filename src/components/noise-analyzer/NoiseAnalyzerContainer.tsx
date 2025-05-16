
import { useEffect } from 'react';
import { useNoiseAnalyzerContext } from '@/contexts/NoiseAnalyzerContext';
import { useAnalyzerEffects } from '@/hooks/useAnalyzerEffects';
import ErrorDisplay from './ErrorDisplay';
import CompatibilityCheck from './CompatibilityCheck';
import NoiseDataDisplay from './NoiseDataDisplay';
import AnalyzerDialogs from './AnalyzerDialogs';

export default function NoiseAnalyzerContainer() {
  const {
    decibels,
    measurementStatus,
    measurementDuration,
    isRecording,
    error,
    isCalibrating,
    showCalibrationDialog,
    showHelpDialog,
    showReportDialog,
    toggleRecording,
    calibrate,
    skipCalibration,
    saveReport,
    setShowCalibrationDialog,
    setShowHelpDialog,
    setShowReportDialog,
    openReport
  } = useNoiseAnalyzerContext();

  // Use the custom hook for all our effects
  const { isCompatible } = useAnalyzerEffects();

  if (!isCompatible) {
    return <CompatibilityCheck isCompatible={isCompatible} />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <ErrorDisplay error={error} />

      <AnalyzerDialogs 
        showCalibrationDialog={showCalibrationDialog}
        setShowCalibrationDialog={setShowCalibrationDialog}
        showHelpDialog={showHelpDialog}
        setShowHelpDialog={setShowHelpDialog}
        showReportDialog={showReportDialog}
        setShowReportDialog={setShowReportDialog}
        isCalibrating={isCalibrating}
        decibels={decibels}
        measurementDuration={measurementDuration}
        onCalibrate={calibrate}
        onSkipCalibration={skipCalibration}
        onSaveReport={saveReport}
      />

      <NoiseDataDisplay 
        decibels={decibels}
        measurementDuration={measurementDuration}
        isRecording={isRecording}
        measurementStatus={measurementStatus}
        error={error}
        isCalibrating={isCalibrating}
        onToggleRecording={toggleRecording}
        onCalibrate={calibrate}
        onShowHelp={() => setShowHelpDialog(true)}
        onOpenReport={openReport}
        onSaveReport={saveReport}
      />
    </div>
  );
}
