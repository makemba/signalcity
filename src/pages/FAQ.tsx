
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, HelpCircle, FileText, MapPin, Bell, Volume2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardShell } from "@/components/DashboardShell";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "Comment signaler un incident?",
      answer: "Pour signaler un incident, accédez à la page 'Signaler un incident' depuis le menu principal. Remplissez le formulaire en indiquant la nature de l'incident, sa localisation et ajoutez des photos si nécessaire.",
      category: "signalement",
    },
    {
      question: "Comment utiliser l'analyse sonore?",
      answer: "L'analyse sonore vous permet de mesurer le niveau de bruit environnant. Rendez-vous sur la page 'Analyse sonore', autorisez l'accès au microphone et lancez l'analyse. Vous pourrez visualiser le niveau sonore en temps réel et enregistrer des mesures.",
      category: "analyse",
    },
    {
      question: "Comment contacter les services d'urgence?",
      answer: "En cas d'urgence, utilisez la page 'Contact d'urgence' pour accéder rapidement aux numéros essentiels (police, pompiers, SAMU). En cas d'urgence immédiate, composez directement le 15, 17 ou 18 selon la situation.",
      category: "urgence",
    },
    {
      question: "Comment suivre l'état de mon signalement?",
      answer: "Vous pouvez suivre l'état de vos signalements depuis la page d'accueil ou en consultant la section 'Mes signalements' dans votre profil. Chaque incident possède un statut (en attente, en cours de traitement, résolu) qui est mis à jour par les équipes de gestion.",
      category: "suivi",
    },
    {
      question: "Comment fonctionne l'analyse des points chauds?",
      answer: "L'analyse des points chauds utilise les données de signalements pour identifier les zones géographiques présentant une concentration élevée d'incidents. Consultez la page 'Points chauds' pour visualiser ces zones sur une carte interactive.",
      category: "analyse",
    },
    {
      question: "Comment configurer les notifications?",
      answer: "Pour configurer vos notifications, accédez à votre profil utilisateur et sélectionnez l'onglet 'Notifications'. Vous pourrez alors choisir quelles alertes recevoir (mises à jour de signalements, incidents à proximité, etc.).",
      category: "compte",
    },
    {
      question: "Comment exporter mes données d'analyse sonore?",
      answer: "Dans la page 'Analyse sonore', vous trouverez un bouton d'exportation qui vous permet de télécharger vos mesures au format CSV. Ces données peuvent être utilisées pour des analyses plus approfondies ou comme preuves en cas de litige.",
      category: "analyse",
    },
    {
      question: "Comment contacter le support?",
      answer: "Pour contacter notre équipe de support, rendez-vous sur la page 'Support' depuis le menu principal. Vous pourrez y soumettre un ticket d'assistance ou utiliser le chat en direct pendant les heures d'ouverture.",
      category: "support",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickLinks = [
    { name: "Signaler un incident", path: "/report-incident", icon: Bell },
    { name: "Analyse sonore", path: "/noise-analysis", icon: Volume2 },
    { name: "Points chauds", path: "/hotspot-analysis", icon: MapPin },
    { name: "Statistiques", path: "/statistics", icon: FileText },
    { name: "Contact d'urgence", path: "/emergency-contact", icon: Shield },
    { name: "Support", path: "/support", icon: HelpCircle },
  ];

  return (
    <DashboardShell>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <HelpCircle className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-2">Centre d'aide</h1>
          <p className="text-muted-foreground max-w-md">
            Trouvez des réponses à vos questions et découvrez comment utiliser toutes les fonctionnalités de notre plateforme.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher dans les questions fréquentes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Questions fréquentes</h2>
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Aucun résultat pour "{searchQuery}". Essayez une autre recherche.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Réinitialiser la recherche
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Liens rapides</h2>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <Button
                    key={link.path}
                    variant="ghost"
                    className="w-full justify-start text-left"
                    asChild
                  >
                    <Link to={link.path}>
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Support direct</h2>
              <p className="text-muted-foreground mb-4">
                Vous ne trouvez pas la réponse à votre question? Contactez notre équipe de support.
              </p>
              <Button className="w-full" asChild>
                <Link to="/support">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Contacter le support
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
