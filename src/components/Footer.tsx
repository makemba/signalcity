
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "À propos",
      links: [
        { label: "Notre mission", href: "/mission" },
        { label: "Notre équipe", href: "/equipe" },
        { label: "Partenaires", href: "/partenaires" },
        { label: "FAQ", href: "/faq" }
      ]
    },
    {
      title: "Services",
      links: [
        { label: "Signaler un incident", href: "/report-incident" },
        { label: "Analyse sonore", href: "/noise-analysis" },
        { label: "Statistiques", href: "/statistics" },
        { label: "Contact d'urgence", href: "/emergency-contact" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Centre d'aide", href: "/support" },
        { label: "Nous contacter", href: "/contact" },
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
    { Icon: Mail, info: "contact@reporthelperhub.org" },
    { Icon: Phone, info: "+242 06 123 45 67" },
    { Icon: MapPin, info: "123 Avenue de la République, Brazzaville, Congo" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-blue-900 to-blue-950 text-white" role="contentinfo">
      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Logo isFooter size="md" className="mb-4" />
            <p className="text-blue-100 mt-4 max-w-md">
              Report Helper Hub est une plateforme dédiée à la sensibilisation et au signalement des nuisances sonores 
              au Congo-Brazzaville, offrant des outils d'analyse pour améliorer le cadre de vie urbain.
            </p>
            <div className="flex space-x-4 mt-6" role="list" aria-label="Réseaux sociaux">
              {socialLinks.map(({ Icon, href, label }) => (
                <a 
                  key={label}
                  href={href}
                  aria-label={label}
                  className="bg-blue-800/40 p-2 rounded-full hover:bg-blue-700/60 transition-colors duration-200 group"
                  role="listitem"
                >
                  <Icon className="h-5 w-5 text-blue-200 group-hover:text-white" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title} role="navigation" aria-labelledby={`footer-heading-${column.title}`}>
              <h3 id={`footer-heading-${column.title}`} className="font-semibold text-lg mb-4 text-white">{column.title}</h3>
              <ul className="space-y-2" role="list">
                {column.links.map((link) => (
                  <li key={link.label} role="listitem">
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

        {/* Contact information */}
        <div className="mt-12 border-t border-blue-800/40 pt-8">
          <h3 className="font-semibold text-lg mb-4 text-white">Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactInfo.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="bg-blue-800/30 p-2 rounded-full">
                  <item.Icon className="h-5 w-5 text-blue-300" />
                </div>
                <span className="text-blue-200 text-sm">{item.info}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-center pt-6">
            <p className="text-blue-300 text-sm">
              © {currentYear} Report Helper Hub - Tous droits réservés
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
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400" role="presentation" />
    </footer>
  );
};

export default Footer;
