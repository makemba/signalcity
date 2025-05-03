
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "À propos",
      links: [
        { label: "Notre mission", href: "/mission" },
        { label: "Équipe", href: "/equipe" },
        { label: "Partenaires", href: "/partenaires" },
        { label: "FAQ", href: "/faq" }
      ]
    },
    {
      title: "Services",
      links: [
        { label: "Signalements", href: "/report-incident" },
        { label: "Analyse sonore", href: "/noise-analysis" },
        { label: "Statistiques", href: "/statistics" },
        { label: "Urgence", href: "/emergency-contact" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Centre d'aide", href: "/support" },
        { label: "Contact", href: "/contact" },
        { label: "Mentions légales", href: "/mentions-legales" },
        { label: "Confidentialité", href: "/confidentialite" }
      ]
    }
  ];

  const socialLinks = [
    { Icon: Facebook, href: "#", label: "Facebook" },
    { Icon: Twitter, href: "#", label: "Twitter" },
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  const contactInfo = [
    { Icon: Mail, info: "contact@reporthelperhub.com" },
    { Icon: Phone, info: "+33 (0)1 23 45 67 89" },
    { Icon: MapPin, info: "123 Avenue de la République, 75011 Paris" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-blue-900 to-blue-950 text-white">
      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Logo isFooter size="md" className="mb-4" />
            <p className="text-blue-100 mt-4 max-w-md">
              Report Helper Hub est une plateforme dédiée à simplifier le processus de signalement 
              et d'analyse des incidents, offrant des solutions intelligentes pour améliorer 
              la sécurité et le bien-être communautaire.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map(({ Icon, href, label }) => (
                <a 
                  key={label}
                  href={href}
                  aria-label={label}
                  className="bg-blue-800/40 p-2 rounded-full hover:bg-blue-700/60 transition-colors duration-200 group"
                >
                  <Icon className="h-5 w-5 text-blue-200 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-lg mb-4 text-white">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-blue-200 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-center pt-6">
            <p className="text-blue-300 text-sm">
              © {currentYear} Report Helper Hub. Tous droits réservés.
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-x-8 gap-y-2 text-sm text-blue-300">
              <Link to="/mentions-legales" className="hover:text-white transition-colors duration-200">Mentions légales</Link>
              <Link to="/confidentialite" className="hover:text-white transition-colors duration-200">Politique de confidentialité</Link>
              <Link to="/cookies" className="hover:text-white transition-colors duration-200">Gestion des cookies</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400" />
    </footer>
  );
};

export default Footer;
