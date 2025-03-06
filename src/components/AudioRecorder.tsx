
import { useState, useRef } from 'react';
import { Mic, Square, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      console.log("Démarrage de l'enregistrement audio");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log("Enregistrement terminé, création du fichier audio");
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Sauvegarde dans Supabase Storage
        try {
          const fileName = `record-${Date.now()}.wav`;
          
          // Initialize buckets if they don't exist
          const { data: buckets } = await supabase.storage.listBuckets();
          
          if (!buckets?.find(b => b.name === 'incident-attachments')) {
            console.log("Creating incident-attachments bucket");
            const { error: bucketError } = await supabase.storage.createBucket('incident-attachments', {
              public: false,
              allowedMimeTypes: ['audio/wav', 'audio/webm', 'image/jpeg', 'image/png', 'video/mp4'],
              fileSizeLimit: 50000000 // 50MB
            });
            
            if (bucketError) {
              console.error("Error creating bucket:", bucketError);
              throw bucketError;
            }
          }
          
          console.log("Uploading audio to Supabase:", fileName);
          const { error } = await supabase.storage
            .from('incident-attachments')
            .upload(fileName, audioBlob);

          if (error) {
            console.error("Error during upload:", error);
            throw error;
          }

          toast({
            title: "Enregistrement sauvegardé",
            description: "L'enregistrement audio a été sauvegardé avec succès",
          });
        } catch (error) {
          console.error("Erreur lors de la sauvegarde:", error);
          toast({
            variant: "destructive",
            title: "Erreur de sauvegarde",
            description: "Impossible de sauvegarder l'enregistrement",
          });
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Enregistrement démarré",
        description: "L'enregistrement audio a commencé",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
      });
    }
  };

  const stopRecording = () => {
    console.log("Arrêt de l'enregistrement");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `enregistrement-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "default"}
        >
          {isRecording ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              Arrêter l'enregistrement
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
        
        {audioUrl && (
          <Button variant="outline" onClick={downloadRecording}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        )}
      </div>

      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
