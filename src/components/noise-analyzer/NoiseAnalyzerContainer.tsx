
import { useNoiseAnalyzerContext } from '@/contexts/NoiseAnalyzerContext';
import { useAnalyzerEffects } from '@/hooks/useAnalyzerEffects';
import ErrorDisplay from './ErrorDisplay';
import CompatibilityCheck from './CompatibilityCheck';
import NoiseDataDisplay from './NoiseDataDisplay';
import AnalyzerDialogs from './AnalyzerDialogs';

export default function NoiseAnalyzerContainer() {
  const {
    decibels,
    measurementDuration,
    isCalibrating,
    showCalibrationDialog,
    showHelpDialog,
    showReportDialog,
    calibrate,
    skipCalibration,
    saveReport,
    setShowCalibrationDialog,
    setShowHelpDialog,
    setShowReportDialog
  } = useNoiseAnalyzerContext();

  // Use the custom hook for all our effects
  const { isCompatible, error } = useAnalyzerEffects();

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

      <NoiseDataDisplay />
    </div>
  );
}
