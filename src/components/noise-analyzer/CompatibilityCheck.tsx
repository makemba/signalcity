
import { AlertTriangle, Camera, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from 'react';

interface CompatibilityCheckProps {
  isCompatible: boolean;
  onContinueAnyway?: () => void;
}

export default function CompatibilityCheck({ isCompatible, onContinueAnyway }: CompatibilityCheckProps) {
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  
  if (isCompatible) return null;
  
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
            <Button 
              variant="outline" 
              onClick={() => setShowTroubleshooting(true)}
            >
              Guide de dépannage
            </Button>
          </div>
        </div>
        
        {onContinueAnyway && (
          <div className="text-center mt-4 pt-4 border-t">
            <Button variant="ghost" onClick={onContinueAnyway}>
              Continuer malgré tout
            </Button>
          </div>
        )}
      </Card>
      
      <Dialog open={showTroubleshooting} onOpenChange={setShowTroubleshooting}>
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
  );
}
