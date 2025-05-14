
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NoiseReport from '../NoiseReport';

interface AnalyzerDialogsProps {
  showCalibrationDialog: boolean;
  setShowCalibrationDialog: (show: boolean) => void;
  showHelpDialog: boolean;
  setShowHelpDialog: (show: boolean) => void;
  showReportDialog: boolean;
  setShowReportDialog: (show: boolean) => void;
  isCalibrating: boolean;
  decibels: number;
  measurementDuration: number;
  onCalibrate: () => void;
  onSkipCalibration: () => void;
  onSaveReport: (report: any) => void;
}

export default function AnalyzerDialogs({
  showCalibrationDialog,
  setShowCalibrationDialog,
  showHelpDialog,
  setShowHelpDialog,
  showReportDialog,
  setShowReportDialog,
  isCalibrating,
  decibels,
  measurementDuration,
  onCalibrate,
  onSkipCalibration,
  onSaveReport
}: AnalyzerDialogsProps) {
  return (
    <>
      <Dialog open={showCalibrationDialog} onOpenChange={setShowCalibrationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calibration recommandée</DialogTitle>
            <DialogDescription>
              Pour des mesures plus précises, nous recommandons de calibrer votre microphone dans un environnement calme.
              Souhaitez-vous calibrer maintenant ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={onSkipCalibration}>
              Ignorer
            </Button>
            <Button onClick={onCalibrate} disabled={isCalibrating}>
              {isCalibrating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Calibration...
                </>
              ) : "Calibrer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rapport d'analyse sonore</DialogTitle>
            <DialogDescription>
              Analyse détaillée de la mesure sonore de {decibels} dB
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <NoiseReport 
              decibels={decibels} 
              duration={measurementDuration || 5} 
              onSave={onSaveReport}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowReportDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Guide d'utilisation de l'analyse sonore</DialogTitle>
            <DialogDescription>
              Comment utiliser l'outil de mesure du niveau sonore
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <div className="h-5 w-5 text-blue-600">🔊</div>
              </div>
              <div>
                <h4 className="font-medium">Comment mesurer</h4>
                <p className="text-sm text-gray-600">Cliquez sur "Mesurer le niveau sonore" pour commencer l'analyse</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <div className="h-5 w-5 text-green-600">⚙️</div>
              </div>
              <div>
                <h4 className="font-medium">Calibration</h4>
                <p className="text-sm text-gray-600">Pour plus de précision, calibrez votre microphone dans un environnement calme</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <div className="h-5 w-5 text-amber-600">⚠️</div>
              </div>
              <div>
                <h4 className="font-medium">Problèmes courants</h4>
                <p className="text-sm text-gray-600">Utilisez Chrome ou Firefox, vérifiez les permissions du microphone et attendez quelques secondes après le démarrage</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>J'ai compris</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
