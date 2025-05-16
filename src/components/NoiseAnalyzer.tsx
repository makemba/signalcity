
import { FC } from 'react';
import { NoiseAnalyzerProvider } from '@/contexts/NoiseAnalyzerContext';
import NoiseAnalyzerContainer from './noise-analyzer/NoiseAnalyzerContainer';

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

const NoiseAnalyzer: FC<NoiseAnalyzerProps> = ({ onNoiseLevel }) => {
  return (
    <NoiseAnalyzerProvider onNoiseLevel={onNoiseLevel}>
      <NoiseAnalyzerContainer />
    </NoiseAnalyzerProvider>
  );
};

export default NoiseAnalyzer;
