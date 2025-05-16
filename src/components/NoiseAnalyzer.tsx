
import NoiseAnalyzerContainer from './noise-analyzer/NoiseAnalyzerContainer';

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

export default function NoiseAnalyzer({ onNoiseLevel }: NoiseAnalyzerProps) {
  return <NoiseAnalyzerContainer onNoiseLevel={onNoiseLevel} />;
}
