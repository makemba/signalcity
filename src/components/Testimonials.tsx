
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  organization: string;
  image?: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Jean-Pierre Mboungou",
    role: "Directeur",
    organization: "Police Nationale",
    image: "/testimonials/police.jpg",
    content: "Cette plateforme a révolutionné notre capacité à répondre aux incidents en temps réel. Nos équipes sont maintenant plus réactives et les citoyens nous font davantage confiance.",
    rating: 5
  },
  {
    id: 2,
    name: "Marie Okemba",
    role: "Citoyenne",
    organization: "Brazzaville",
    image: "/testimonials/citizen1.jpg",
    content: "Grâce à cette application, j'ai pu signaler plusieurs problèmes dans mon quartier qui ont été résolus rapidement. C'est un outil essentiel pour notre communauté.",
    rating: 5
  },
  {
    id: 3,
    name: "Dr. Pascal Nguesso",
    role: "Responsable",
    organization: "Hôpital Général",
    image: "/testimonials/doctor.jpg",
    content: "La coordination entre nos services d'urgence et cette plateforme a permis de sauver de nombreuses vies. L'analyse des données nous aide à mieux préparer nos équipes.",
    rating: 4
  },
  {
    id: 4,
    name: "Clarice Massamba",
    role: "Directrice",
    organization: "Agence Environnementale",
    image: "/testimonials/env.jpg",
    content: "L'outil d'analyse sonore nous permet enfin de documenter et d'agir contre les nuisances environnementales avec des preuves concrètes et quantifiables.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Ce qu'ils disent de nous</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Découvrez comment Report Helper Hub transforme la gestion des incidents au Congo-Brazzaville
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.organization}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-700 flex-grow">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
