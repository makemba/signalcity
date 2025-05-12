
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";

export const FAQSection = () => {
  return (
    <section className="py-8 mb-12">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold mb-3">Des questions? Besoin d'aide?</h2>
              <p className="text-gray-600 mb-4">
                Consultez notre centre d'aide et notre FAQ pour trouver des réponses à vos questions
                et apprendre à tirer le meilleur parti de notre plateforme.
              </p>
              <Button asChild>
                <Link to="/faq">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Consulter la FAQ
                </Link>
              </Button>
            </div>
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="h-16 w-16 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
