import { useNoiseAnalyzerContext } from '@/contexts/NoiseAnalyzerContext';
import { Volume2, VolumeX, Settings, Download, Share2, FileText, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AnalyzerControls() {
  const {
    isRecording,
    decibels,
    toggleRecording,
    calibrate,
    openReport,
    isCalibrating,
    setShowHelpDialog
  } = useNoiseAnalyzerContext();

  const onExportData = () => {
    // Cette fonction est désormais gérée par MeasurementActions
  };
  
  const onShare = () => {
    // Cette fonction est désormais gérée par MeasurementActions
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className="min-w-[200px]"
            >
              {isRecording ? (
                <>
                  <VolumeX className="mr-2 h-5 w-5" />
                  Arrêter la mesure
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-5 w-5" />
                  Mesurer le niveau sonore
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isRecording ? "Arrêter la mesure sonore" : "Commencer une nouvelle mesure"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={calibrate}
              variant="outline"
              size="lg"
              className="min-w-[50px]"
              disabled={isRecording || isCalibrating}
            >
              {isCalibrating ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></div>
              ) : (
                <Settings className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Calibrer le microphone dans un environnement calme
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={openReport}
              variant="outline"
              size="lg"
              className="min-w-[50px]"
              disabled={decibels === 0}
            >
              <FileText className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Voir le rapport d'analyse
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setShowHelpDialog(true)}
              variant="outline"
              size="lg"
              className="min-w-[50px]"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Aide et conseils
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
