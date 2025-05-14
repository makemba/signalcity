
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateNoiseReport, NOISE_CATEGORIES } from '@/lib/noise-analyzer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertCircle, AlertTriangle, CheckCircle, Download, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface NoiseReportProps {
  decibels: number;
  duration?: number;
  context?: string;
  onSave?: (report: any) => void;
}

export default function NoiseReport({ decibels, duration = 5, context = 'urbain', onSave }: NoiseReportProps) {
  if (decibels <= 0) return null;

  const report = generateNoiseReport(decibels, duration, context);
  const { analysis } = report;

  const getCategoryIcon = () => {
    switch (analysis.category) {
      case NOISE_CATEGORIES.SAFE:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case NOISE_CATEGORIES.MODERATE:
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case NOISE_CATEGORIES.HARMFUL:
      case NOISE_CATEGORIES.DANGEROUS:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getCategoryColor = () => {
    switch (analysis.category) {
      case NOISE_CATEGORIES.SAFE:
        return 'bg-green-100 text-green-800 border-green-200';
      case NOISE_CATEGORIES.MODERATE:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case NOISE_CATEGORIES.HARMFUL:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case NOISE_CATEGORIES.DANGEROUS:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = () => {
    const reportBlob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(reportBlob);
    const a = document.createElement('a');
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
    a.href = url;
    a.download = `rapport-bruit-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast("Rapport téléchargé avec succès");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Rapport d\'analyse sonore',
          text: `Niveau sonore mesuré: ${decibels} dB - ${report.conclusion}`,
        });
      } else {
        await navigator.clipboard.writeText(`Rapport d'analyse sonore\nNiveau: ${decibels} dB\nConclusion: ${report.conclusion}`);
        toast("Rapport copié dans le presse-papier");
      }
    } catch (err) {
      console.error('Erreur de partage:', err);
      toast("Impossible de partager le rapport");
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(report);
      toast("Rapport enregistré avec succès");
    }
  };

  return (
    <Card className={`border-l-4 ${getCategoryColor()} shadow-md`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon()}
            <CardTitle className="text-lg">Rapport d'analyse sonore</CardTitle>
          </div>
          <Badge variant="outline" className={getCategoryColor()}>
            {decibels} dB
          </Badge>
        </div>
        <CardDescription>
          {format(new Date(report.timestamp), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Classification</h3>
          <p className="text-sm">
            Ce niveau sonore est classé comme{' '}
            <span className="font-medium">
              {analysis.category === NOISE_CATEGORIES.SAFE && 'sûr'}
              {analysis.category === NOISE_CATEGORIES.MODERATE && 'modéré'}
              {analysis.category === NOISE_CATEGORIES.HARMFUL && 'potentiellement nocif'}
              {analysis.category === NOISE_CATEGORIES.DANGEROUS && 'dangereux'}
            </span>
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Impact</h3>
          <p className="text-sm">{analysis.impact}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Risque d'exposition ({duration} min)</h3>
          <p className="text-sm">
            {analysis.exposureRisk}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Recommandations</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-1">Conclusion</h3>
          <p className="text-sm">{report.conclusion}</p>
          <p className="text-sm mt-2 text-muted-foreground">{report.legalStatus}</p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span>Télécharger</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-1"
        >
          <Share2 className="h-4 w-4" />
          <span>Partager</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
        >
          Enregistrer
        </Button>
      </CardFooter>
    </Card>
  );
}
