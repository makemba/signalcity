
// Constantes pour l'analyse du bruit
export const NOISE_CATEGORIES = {
  SAFE: 'safe',
  MODERATE: 'moderate',
  HARMFUL: 'harmful',
  DANGEROUS: 'dangerous',
};

// Seuils de bruit en dB
export const NOISE_THRESHOLDS = {
  SAFE: 70,     // Environnement urbain moyen
  MODERATE: 85, // Bruits de voiture, rue animée
  HARMFUL: 95,  // Dommages auditifs possibles après exposition prolongée
  DANGEROUS: 110 // Dommages auditifs immédiats possibles
};

// Limites d'exposition recommandées (en minutes)
export const EXPOSURE_LIMITS = {
  HARMFUL: 60,  // 60 minutes maximum à ce niveau
  DANGEROUS: 5  // 5 minutes maximum à ce niveau
};

/**
 * Analyse le niveau de bruit et retourne sa catégorie et recommandations
 * @param decibels Niveau de bruit en dB
 */
export function analyzeNoiseLevel(decibels: number) {
  let category;
  let impact;
  let recommendations = [];
  let exposureLimit = null;

  // Déterminer la catégorie du bruit
  if (decibels <= NOISE_THRESHOLDS.SAFE) {
    category = NOISE_CATEGORIES.SAFE;
    impact = "Ce niveau sonore est considéré comme sûr et acceptable dans un environnement urbain.";
    recommendations.push("Aucune mesure particulière n'est nécessaire.");
    recommendations.push("Ce niveau est adapté aux zones résidentielles.");
  } else if (decibels <= NOISE_THRESHOLDS.MODERATE) {
    category = NOISE_CATEGORIES.MODERATE;
    impact = "Ce niveau sonore peut être gênant sur la durée mais n'est pas directement nocif pour l'audition.";
    recommendations.push("Envisagez des mesures d'insonorisation si ce niveau est constant.");
    recommendations.push("Limitez l'exposition à ce niveau de bruit pendant les périodes de sommeil ou de repos.");
  } else if (decibels <= NOISE_THRESHOLDS.HARMFUL) {
    category = NOISE_CATEGORIES.HARMFUL;
    impact = "Ce niveau sonore peut causer de la fatigue auditive et des dommages auditifs en cas d'exposition prolongée.";
    exposureLimit = EXPOSURE_LIMITS.HARMFUL;
    recommendations.push("Limitez l'exposition à ce niveau à maximum " + exposureLimit + " minutes par jour.");
    recommendations.push("Utilisez des protections auditives si l'exposition est régulière ou prolongée.");
    recommendations.push("Ces niveaux sonores peuvent constituer une nuisance sonore selon les réglementations locales.");
  } else {
    category = NOISE_CATEGORIES.DANGEROUS;
    impact = "Ce niveau sonore est dangereux et peut causer des dommages auditifs immédiats ou permanents.";
    exposureLimit = EXPOSURE_LIMITS.DANGEROUS;
    recommendations.push("Évitez toute exposition de plus de " + exposureLimit + " minutes.");
    recommendations.push("Des protections auditives sont obligatoires à ce niveau.");
    recommendations.push("Ce niveau constitue une nuisance sonore et peut faire l'objet d'un signalement aux autorités.");
  }

  return {
    decibels,
    category,
    impact,
    recommendations,
    exposureLimit,
    isHarmful: category === NOISE_CATEGORIES.HARMFUL || category === NOISE_CATEGORIES.DANGEROUS,
    isLegal: decibels <= NOISE_THRESHOLDS.MODERATE
  };
}

/**
 * Génère un rapport d'analyse sonore complet
 * @param decibels Niveau de bruit en dB
 * @param duration Durée d'exposition en minutes
 * @param context Contexte de mesure
 */
export function generateNoiseReport(decibels: number, duration: number = 5, context: string = 'urbain') {
  const analysis = analyzeNoiseLevel(decibels);
  const timestamp = new Date().toISOString();
  
  // Calculer l'exposition relative par rapport aux limites recommandées
  let exposureRisk = 'Faible';
  if (analysis.exposureLimit) {
    const exposureRatio = duration / analysis.exposureLimit;
    if (exposureRatio > 1) {
      exposureRisk = 'Élevé - Exposition excessive de ' + Math.round((exposureRatio - 1) * 100) + '% au-delà de la limite recommandée';
    } else if (exposureRatio > 0.5) {
      exposureRisk = 'Modéré - ' + Math.round(exposureRatio * 100) + '% de la limite d\'exposition recommandée';
    }
  }
  
  // Construire le rapport
  return {
    timestamp,
    measurements: {
      decibels,
      duration,
      context,
    },
    analysis: {
      ...analysis,
      exposureRisk,
    },
    conclusion: analysis.isHarmful 
      ? 'Ce niveau sonore est considéré comme une nuisance sonore potentielle et pourrait avoir des impacts sur la santé.'
      : 'Ce niveau sonore est dans des limites acceptables pour le contexte spécifié.',
    legalStatus: analysis.isLegal 
      ? 'Ce niveau est généralement dans les limites légales pour un environnement ' + context + '.'
      : 'Ce niveau pourrait dépasser les limites légales pour un environnement ' + context + ' et constituer une nuisance sonore.'
  };
}
