
import { useNoiseAnalyzerContext } from '@/contexts/NoiseAnalyzerContext';
import ActiveMeasurement from './ActiveMeasurement';
import AnalyzerControls from './AnalyzerControls';
import { Card, CardContent } from "@/components/ui/card";
import MeasurementActions from './MeasurementActions';

export default function MeasurementControlPanel() {
  const { 
    decibels,
    measurementDuration,
    measurementStatus
  } = useNoiseAnalyzerContext();
  
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
        <ActiveMeasurement />
        
        <AnalyzerControls />
        
        <MeasurementActions
          decibels={decibels}
          measurementDuration={measurementDuration}
          onSaveMeasurement={handleSaveMeasurement}
          onExportData={handleExportData}
          onShare={handleShare}
        />
      </CardContent>
    </Card>
  );
}
