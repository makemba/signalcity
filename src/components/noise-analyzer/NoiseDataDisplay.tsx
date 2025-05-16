
import { useState } from 'react';
import { useNoiseAnalyzerContext } from '@/contexts/NoiseAnalyzerContext';
import SafetyTips from '../SafetyTips';
import NoiseHistory from '../NoiseHistory';
import NoiseReport from '../NoiseReport';
import MeasurementControlPanel from './MeasurementControlPanel';

export default function NoiseDataDisplay() {
  const {
    decibels, 
    measurementDuration,
    saveReport
  } = useNoiseAnalyzerContext();

  // Sample noise history data (would be fetched from a real source in production)
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
        <MeasurementControlPanel />
        
        <SafetyTips />
      </div>

      <div className="space-y-6">
        {decibels > 0 && (
          <NoiseReport 
            decibels={decibels} 
            duration={measurementDuration || 5} 
            onSave={saveReport}
          />
        )}
        <NoiseHistory data={noiseHistoryData} />
      </div>
    </div>
  );
}
