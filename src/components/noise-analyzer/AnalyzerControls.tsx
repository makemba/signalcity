
import { useState } from 'react';
import { Volume2, VolumeX, Settings, Download, Share2, FileText, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface AnalyzerControlsProps {
  isRecording: boolean;
  decibels: number;
  onToggleRecording: () => void;
  onCalibrate: () => void;
  onOpenReport: () => void;
  onExportData: () => void;
  onShare: () => void;
  onShowHelp: () => void;
  isCalibrating: boolean;
}

export default function AnalyzerControls({
  isRecording,
  decibels,
  onToggleRecording,
  onCalibrate,
  onOpenReport,
  onExportData,
  onShare,
  onShowHelp,
  isCalibrating
}: AnalyzerControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onToggleRecording}
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
              onClick={onCalibrate}
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
              onClick={onOpenReport}
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
              onClick={onExportData}
              variant="outline"
              size="lg"
              className="min-w-[50px]"
              disabled={decibels === 0}
            >
              <Download className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Exporter les données de mesure
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onShare}
              variant="outline"
              size="lg"
              className="min-w-[50px]"
              disabled={decibels === 0}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Partager cette mesure
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onShowHelp}
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
