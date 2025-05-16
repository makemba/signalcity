
import ActiveMeasurement from './ActiveMeasurement';
import AnalyzerControls from './AnalyzerControls';
import { Card, CardContent } from "@/components/ui/card";

interface MeasurementControlPanelProps {
  isRecording: boolean;
  decibels: number;
  measurementDuration: number;
  measurementStatus: 'idle' | 'starting' | 'active' | 'error';
  error: string;
  isCalibrating: boolean;
  onToggleRecording: () => void;
  onCalibrate: () => void;
  onShowHelp: () => void;
  onOpenReport: () => void;
}

export default function MeasurementControlPanel({
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
}: MeasurementControlPanelProps) {
  const handleSaveMeasurement = async () => {
    // Placeholder for save measurement functionality
    return Promise.resolve();
  };
  
  const handleExportData = () => {
    // Placeholder for export data functionality
  };
  
  const handleShare = async () => {
    // Placeholder for share functionality
    return Promise.resolve();
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-6">
        <ActiveMeasurement 
          decibels={decibels}
          measurementDuration={measurementDuration}
          measurementStatus={measurementStatus}
          onSaveMeasurement={handleSaveMeasurement}
        />
        
        <AnalyzerControls
          isRecording={isRecording}
          decibels={decibels}
          onToggleRecording={onToggleRecording}
          onCalibrate={onCalibrate}
          onOpenReport={onOpenReport}
          onExportData={handleExportData}
          onShare={handleShare}
          onShowHelp={onShowHelp}
          isCalibrating={isCalibrating}
        />
      </CardContent>
    </Card>
  );
}
