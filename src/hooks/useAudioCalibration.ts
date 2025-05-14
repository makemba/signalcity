
import { useCallback } from 'react';
import { toast } from "sonner";

interface AudioCalibrationProps {
  calculateDBFS: (buffer: Float32Array) => number;
  initializeAudio: (options: any) => Promise<any>;
  releaseAudio: () => void;
}

export const useAudioCalibration = ({
  calculateDBFS,
  initializeAudio,
  releaseAudio
}: AudioCalibrationProps) => {
  // Calibrate the microphone
  const calibrate = useCallback(async () => {
    try {
      // Release any existing audio resources
      releaseAudio();
      
      const audioResources = await initializeAudio({
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      });
      
      if (!audioResources) {
        throw new Error("Failed to initialize audio resources");
      }
      
      const { stream, audioContext } = audioResources;
      
      // Create analyzer for calibration
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 4096;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);
      
      // Wait for the audio system to stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let totalMeasurement = 0;
      const buffer = new Float32Array(analyzer.frequencyBinCount);
      const samples = 5;
      
      // Take multiple samples for better accuracy
      for (let i = 0; i < samples; i++) {
        analyzer.getFloatTimeDomainData(buffer);
        const measurement = calculateDBFS(buffer);
        totalMeasurement += measurement;
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Target a background noise level of ~40dB
      const avgMeasurement = totalMeasurement / samples;
      const newCalibration = Math.round(40 - avgMeasurement);
      
      console.log("Calibration complete. Offset:", newCalibration);
      
      // Clean up calibration resources
      source.disconnect();
      
      // Clean up the audio resources created for calibration
      releaseAudio();
      
      return true;
    } catch (err) {
      console.error("Calibration error:", err);
      return false;
    }
  }, [calculateDBFS, initializeAudio, releaseAudio]);

  // Auto-calibrate function
  const autoCalibrate = useCallback(async () => {
    console.log("Auto-calibrating microphone...");
    const success = await calibrate();
    if (success) {
      toast("Calibration automatique terminée");
    } else {
      toast("Échec de la calibration automatique");
    }
    return success;
  }, [calibrate]);
  
  return {
    calibrate,
    autoCalibrate
  };
};
