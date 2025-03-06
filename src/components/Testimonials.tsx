
import { Card, CardContent } from "@/components/ui/card";
import { User, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialProps {
  id: number;
  name: string;
  location: string;
  testimonial: string;
  rating: number;
  image?: string;
}

const testimonials: TestimonialProps[] = [
  {
    id: 1,
    name: "Jean Makaya",
    location: "Brazzaville, Poto-Poto",
    testimonial: "Grâce à cette application, j'ai pu signaler rapidement une fuite d'eau dans mon quartier. Les services municipaux sont intervenus en moins de 24h. Impressionnant!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Marie Loemba",
    location: "Pointe-Noire, Centre-ville",
    testimonial: "J'utilise cette plateforme depuis son lancement. Elle a considérablement amélioré la communication entre les citoyens et les autorités. Je me sens plus en sécurité.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Paul Mouanda",
    location: "Dolisie",
    testimonial: "L'analyse sonore m'a permis de documenter les nuisances nocturnes près de chez moi. Le problème a été résolu après plusieurs signalements. Merci!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/67.jpg"
  },
  {
    id: 4,
    name: "Sophie Ngoma",
    location: "Brazzaville, Bacongo",
    testimonial: "Interface simple et intuitive. J'apprécie particulièrement la possibilité de suivre l'évolution de mes signalements en temps réel.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/29.jpg"
  }
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};

export default function Testimonials() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Ce que disent nos utilisateurs</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Découvrez comment notre plateforme transforme le quotidien des citoyens congolais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full hover:shadow-lg transition-shadow border-t-4 border-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <Avatar className="h-12 w-12 border-2 border-blue-100">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-500">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <RatingStars rating={testimonial.rating} />
                <p className="mt-4 text-gray-600 italic">&ldquo;{testimonial.testimonial}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
