
import { FC } from 'react';
import NoiseAnalyzerContainer from './noise-analyzer/NoiseAnalyzerContainer';

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

const NoiseAnalyzer: FC<NoiseAnalyzerProps> = ({ onNoiseLevel }) => {
  return <NoiseAnalyzerContainer onNoiseLevel={onNoiseLevel} />;
};

export default NoiseAnalyzer;
