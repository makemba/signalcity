
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "@/components/StarRating";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function IncidentFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Fetch incident details
  const { data: incident, isLoading: isLoadingIncident } = useQuery({
    queryKey: ["incident", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Check if feedback already exists
  const { data: existingFeedback, isLoading: isLoadingFeedback } = useQuery({
    queryKey: ["feedback", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("incident_id", parseInt(id))
        .maybeSingle();

      if (error) {
        console.error("Error fetching feedback:", error);
        return null;
      }
      return data;
    },
    enabled: !!id,
  });

  // Set initial values if feedback exists
  useEffect(() => {
    if (existingFeedback) {
      setRating(existingFeedback.rating);
      setComment(existingFeedback.comment || "");
      setSubmitted(true);
    }
  }, [existingFeedback]);

  // Submit feedback mutation
  const submitFeedback = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("No incident ID provided");
      
      const feedbackData = {
        incident_id: parseInt(id),
        rating,
        comment,
        date: new Date().toISOString(),
      };

      let response;
      
      if (existingFeedback) {
        // Update existing feedback
        response = await supabase
          .from("feedback")
          .update(feedbackData)
          .eq("id", existingFeedback.id);
      } else {
        // Insert new feedback
        response = await supabase
          .from("feedback")
          .insert(feedbackData);
      }
      
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success(
        existingFeedback ? "Feedback mis à jour" : "Feedback soumis", 
        { description: "Merci pour votre évaluation!" }
      );
      queryClient.invalidateQueries({ queryKey: ["feedback", id] });
    },
    onError: (error) => {
      toast.error("Erreur", { 
        description: `Une erreur est survenue: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Veuillez attribuer une note");
      return;
    }
    submitFeedback.mutate();
  };

  const isLoading = isLoadingIncident || isLoadingFeedback;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card className="p-8 flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </Card>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card className="p-8">
          <h2 className="text-xl font-bold text-center mb-4">Incident non trouvé</h2>
          <p className="text-center text-gray-500 mb-6">
            L'incident que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Card className="p-6">
        {submitted ? (
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Merci pour votre feedback!</h2>
            <p className="text-gray-600 mb-6">
              Votre évaluation nous aide à améliorer notre service.
            </p>
            <Button onClick={() => navigate(`/incident/${id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux détails de l'incident
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Évaluez la résolution de l'incident</h2>
            <p className="text-gray-600 mb-6">
              Votre avis nous aide à améliorer notre service et à mieux répondre à vos besoins.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Comment évaluez-vous la résolution de cet incident?
                </label>
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size="large"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Commentaires additionnels (optionnel)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience..."
                  rows={4}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/incident/${id}`)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={rating === 0 || submitFeedback.isPending}
                >
                  {submitFeedback.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Soumettre"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
