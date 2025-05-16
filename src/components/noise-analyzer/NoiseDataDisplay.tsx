
import { useState } from 'react';
import SafetyTips from '../SafetyTips';
import NoiseHistory from '../NoiseHistory';
import NoiseReport from '../NoiseReport';

interface NoiseDataDisplayProps {
  decibels: number;
  measurementDuration: number;
  isRecording: boolean;
  measurementStatus: 'idle' | 'starting' | 'active' | 'error';
  error: string;
  isCalibrating: boolean;
  onToggleRecording: () => void;
  onCalibrate: () => void;
  onShowHelp: () => void;
  onOpenReport: () => void;
  onSaveReport: (report: any) => void;
}

export default function NoiseDataDisplay({
  decibels,
  measurementDuration,
  isRecording,
  measurementStatus,
  error,
  isCalibrating,
  onToggleRecording,
  onCalibrate,
  onShowHelp,
  onOpenReport,
  onSaveReport
}: NoiseDataDisplayProps) {
  // Sample noise history data
  const [noiseHistoryData] = useState([
    { date: "Lun", level: 45 },
    { date: "Mar", level: 52 },
    { date: "Mer", level: 49 },
    { date: "Jeu", level: 63 },
    { date: "Ven", level: 58 },
    { date: "Sam", level: 72 },
    { date: "Dim", level: 47 },
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <MeasurementControlPanel
          isRecording={isRecording} 
          decibels={decibels}
          measurementDuration={measurementDuration}
          measurementStatus={measurementStatus}
          error={error}
          isCalibrating={isCalibrating}
          onToggleRecording={onToggleRecording}
          onCalibrate={onCalibrate}
          onShowHelp={onShowHelp}
          onOpenReport={onOpenReport}
        />
        
        <SafetyTips />
      </div>

      <div className="space-y-6">
        {decibels > 0 && (
          <NoiseReport 
            decibels={decibels} 
            duration={measurementDuration || 5} 
            onSave={onSaveReport}
          />
        )}
        <NoiseHistory data={noiseHistoryData} />
      </div>
    </div>
  );
}

// This component wraps MeasurementContainer to avoid circular dependencies
function MeasurementControlPanel({
  isRecording,
  decibels,
  measurementDuration,
  measurementStatus,
  error,
  isCalibrating,
  onToggleRecording,
  onCalibrate,
  onShowHelp,
  onOpenReport
}: Omit<NoiseDataDisplayProps, 'onSaveReport'>) {
  return (
    <div className="h-full">
      <MeasurementContainer 
        isRecording={isRecording} 
        decibels={decibels}
        measurementDuration={measurementDuration}
        measurementStatus={measurementStatus}
        error={error}
        isCalibrating={isCalibrating}
        onToggleRecording={onToggleRecording}
        onCalibrate={onCalibrate}
        onShowHelp={onShowHelp}
        onOpenReport={onOpenReport}
      />
    </div>
  );
}
