import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Volume2, VolumeX, Settings, Download, Share2, Camera, HelpCircle, AlertCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import NoiseLevelDisplay from './NoiseLevelDisplay';
import SafetyTips from './SafetyTips';
import NoiseHistory from './NoiseHistory';
import AudioRecorder from './AudioRecorder';
import NoiseReport from './NoiseReport';
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from '@/lib/supabase';

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

export default function NoiseAnalyzer({ onNoiseLevel }: NoiseAnalyzerProps) {
  const [decibels, setDecibels] = useState<number>(0);
  const [isCompatible, setIsCompatible] = useState<boolean>(true);
  const [showCalibrationDialog, setShowCalibrationDialog] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [showHelpDialog, setShowHelpDialog] = useState<boolean>(false);
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
  const [measurementStatus, setMeasurementStatus] = useState<'idle' | 'starting' | 'active' | 'error'>('idle');
  const [measurementDuration, setMeasurementDuration] = useState<number>(0);
  const [measurementStartTime, setMeasurementStartTime] = useState<Date | null>(null);
  
  // Sample noise history data
  const [noiseHistoryData, setNoiseHistoryData] = useState([
    { date: "Lun", level: 45 },
    { date: "Mar", level: 52 },
    { date: "Mer", level: 49 },
    { date: "Jeu", level: 63 },
    { date: "Ven", level: 58 },
    { date: "Sam", level: 72 },
    { date: "Dim", level: 47 },
  ]);
  
  const handleNoiseLevel = useCallback((level: number) => {
    if (level > 0) {
      console.log("Noise level received:", level, "dB");
      setDecibels(level);
      onNoiseLevel(level);
      
      if (measurementStatus !== 'active') {
        setMeasurementStatus('active');
        setMeasurementStartTime(new Date());
      }
    }
  }, [measurementStatus, onNoiseLevel]);

  // Update measurement duration
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (measurementStatus === 'active' && measurementStartTime) {
      intervalId = window.setInterval(() => {
        const now = new Date();
        const durationInSeconds = Math.floor((now.getTime() - measurementStartTime.getTime()) / 1000);
        setMeasurementDuration(durationInSeconds);
      }, 1000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [measurementStatus, measurementStartTime]);

  const saveMeasurement = async (level: number) => {
    try {
      const { error } = await supabase
        .from('noise_measurements')
        .insert({
          noise_level: level,
          duration: measurementDuration || 5,
          type: 'ambient',
        });

      if (error) {
        console.error("Erreur lors de l'enregistrement de la mesure:", error);
        toast("Impossible d'enregistrer la mesure");
      } else {
        toast("Mesure enregistrée avec succès");
      }
    } catch (err) {
      console.error("Exception lors de la sauvegarde:", err);
      toast("Erreur lors de la sauvegarde");
    }
  };
  
  const saveReport = async (report: any) => {
    try {
      const { error } = await supabase
        .from('noise_measurements')
        .insert({
          noise_level: report.measurements.decibels,
          duration: report.measurements.duration,
          type: 'analyzed',
          metadata: report,
          notes: report.conclusion
        });

      if (error) {
        console.error("Erreur lors de l'enregistrement du rapport:", error);
        toast("Impossible d'enregistrer le rapport");
      }
    } catch (err) {
      console.error("Exception lors de la sauvegarde du rapport:", err);
      toast("Erreur lors de la sauvegarde du rapport");
    }
  };

  const { isRecording, error, startRecording, stopRecording, calibrate } = useAudioAnalyzer(handleNoiseLevel);

  useEffect(() => {
    checkDeviceCompatibility();
  }, []);

  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('noise-analyzer-help-seen');
    if (!hasSeenHelp) {
      setTimeout(() => {
        setShowHelpDialog(true);
        localStorage.setItem('noise-analyzer-help-seen', 'true');
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (isRecording && decibels === 0) {
      setMeasurementStatus('starting');
    } else if (!isRecording) {
      setMeasurementStatus('idle');
    }
  }, [isRecording, decibels]);

  const checkDeviceCompatibility = async () => {
    try {
      const result = await navigator.mediaDevices.getUserMedia({ audio: true });
      result.getTracks().forEach(track => track.stop());
      setIsCompatible(true);
      console.log("Device compatible with audio analysis");
    } catch (err) {
      console.error("Compatibility error:", err);
      setIsCompatible(false);
      toast("L'analyse sonore n'est pas disponible sur cet appareil");
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
      toast("Mesure du niveau sonore arrêtée");
      // Montrer automatiquement le rapport si la mesure est assez longue
      if (decibels > 0 && measurementDuration > 3) {
        setShowReportDialog(true);
      }
    } else {
      if (!showCalibrationDialog && decibels === 0) {
        setShowCalibrationDialog(true);
      } else {
        startMeasurement();
      }
    }
  };

  const startMeasurement = async () => {
    setShowCalibrationDialog(false);
    setMeasurementStatus('starting');
    setMeasurementDuration(0);
    setMeasurementStartTime(null);
    
    const success = await startRecording();
    
    if (!success) {
      setMeasurementStatus('error');
    } else {
      toast("Démarrage de la mesure du niveau sonore...");
    }
  };

  const handleCalibrate = async () => {
    setIsCalibrating(true);
    setShowCalibrationDialog(false);
    
    try {
      const success = await calibrate();
      
      if (success) {
        setTimeout(() => {
          startMeasurement();
          setIsCalibrating(false);
        }, 1000);
      } else {
        setIsCalibrating(false);
        toast("Échec de la calibration. Veuillez réessayer dans un environnement plus calme");
      }
    } catch (error) {
      console.error("Calibration failed:", error);
      setIsCalibrating(false);
      toast("Échec de la calibration. Veuillez réessayer");
    }
  };

  const handleSkipCalibration = () => {
    setShowCalibrationDialog(false);
    startMeasurement();
  };

  const handleExportData = () => {
    const exportData = {
      date: new Date().toISOString(),
      decibels: decibels,
      duration: measurementDuration,
      device: navigator.userAgent,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `mesure-sonore-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast("Les données ont été exportées avec succès");
  };

  const handleOpenReport = () => {
    if (decibels > 0) {
      setShowReportDialog(true);
    } else {
      toast("Veuillez d'abord effectuer une mesure");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mesure de niveau sonore',
          text: `Niveau sonore mesuré: ${decibels} dB`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`Niveau sonore mesuré: ${decibels} dB - ${window.location.href}`);
        toast("Le lien a été copié dans le presse-papier");
      }
    } catch (err) {
      console.error('Sharing error:', err);
      toast("Impossible de partager les données");
    }
  };

  if (!isCompatible) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Appareil non compatible</AlertTitle>
          <AlertDescription>
            L'analyse sonore n'est pas disponible sur cet appareil. 
            Voici quelques solutions alternatives :
          </AlertDescription>
        </Alert>

        <Card className="p-6 bg-white shadow-lg space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 border rounded-lg">
              <Camera className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-2">Utiliser la vidéo</h3>
              <p className="text-sm text-gray-600 mb-4">
                Vous pouvez filmer la source du bruit pour documenter la nuisance
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/video-analysis'}>
                Passer à l'analyse vidéo
              </Button>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <HelpCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Consultez notre guide de dépannage ou contactez le support
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Guide de dépannage</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Guide de dépannage</DialogTitle>
                    <DialogDescription>
                      <ul className="list-disc pl-4 space-y-2 mt-4">
                        <li>Vérifiez que votre navigateur est à jour</li>
                        <li>Autorisez l'accès au microphone dans les paramètres</li>
                        <li>Essayez avec un autre navigateur (Chrome recommandé)</li>
                        <li>Redémarrez votre appareil</li>
                        <li>Vérifiez que votre microphone fonctionne dans d'autres applications</li>
                      </ul>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        <SafetyTips />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
            <Button variant="outline" onClick={handleSkipCalibration}>
              Ignorer
            </Button>
            <Button onClick={handleCalibrate} disabled={isCalibrating}>
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
              onSave={saveReport}
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
                <Volume2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Comment mesurer</h4>
                <p className="text-sm text-gray-600">Cliquez sur "Mesurer le niveau sonore" pour commencer l'analyse</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Settings className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Calibration</h4>
                <p className="text-sm text-gray-600">Pour plus de précision, calibrez votre microphone dans un environnement calme</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-amber-600" />
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6 bg-white shadow-lg space-y-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleToggleRecording}
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
                      onClick={handleCalibrate}
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
                      onClick={handleOpenReport}
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
                      onClick={handleExportData}
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
                      onClick={handleShare}
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

            {measurementStatus === 'starting' && (
              <div className="w-full">
                <div className="flex justify-center items-center gap-2 text-amber-600">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
                  <p>Initialisation de la mesure en cours...</p>
                </div>
                <div className="mt-4">
                  <NoiseLevelDisplay decibels={0} />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-3">
                  Veuillez patienter quelques secondes pendant l'initialisation
                </p>
              </div>
            )}

            {isRecording && measurementStatus === 'active' ? (
              <div className="w-full">
                <NoiseLevelDisplay decibels={decibels} />
                <p className="text-center text-sm font-medium text-green-600 mt-2">
                  Mesure en cours... {measurementDuration > 0 ? `(${measurementDuration}s)` : ''}
                </p>
                {measurementDuration > 3 && decibels > 0 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        saveMeasurement(decibels);
                      }}
                    >
                      Enregistrer la mesure
                    </Button>
                  </div>
                )}
              </div>
            ) : decibels > 0 && measurementStatus === 'idle' ? (
              <div className="w-full">
                <NoiseLevelDisplay decibels={decibels} />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Mesure terminée. Vous pouvez démarrer une nouvelle mesure.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      saveMeasurement(decibels);
                    }}
                  >
                    Enregistrer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleOpenReport}
                  >
                    Voir le rapport
                  </Button>
                </div>
              </div>
            ) : measurementStatus === 'error' ? (
              <div className="text-center py-8 text-red-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                <p className="font-medium">Problème de mesure détecté</p>
                <p className="text-sm text-gray-600 mt-2">
                  Vérifiez les permissions du microphone et essayez de calibrer à nouveau
                </p>
              </div>
            ) : measurementStatus === 'idle' && (
              <div className="text-center py-8 text-muted-foreground">
                <Volume2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Appuyez sur le bouton pour commencer la mesure du niveau sonore</p>
                <p className="text-sm mt-2 text-blue-600">
                  Utilisez de préférence Chrome ou Firefox pour de meilleurs résultats
                </p>
              </div>
            )}

            <AudioRecorder />

            <div className="text-sm text-muted-foreground text-center mt-2 border-t border-gray-100 pt-4">
              <p>Pour des mesures plus précises, calibrez le microphone dans un environnement calme.</p>
              <p className="mt-1">Les niveaux sont enregistrés automatiquement pour le suivi des nuisances sonores.</p>
            </div>
          </Card>
          
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
    </div>
  );
}
