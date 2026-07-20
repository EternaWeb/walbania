/* eslint-disable react-refresh/only-export-components */
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
} from "react";
import type { ReactElement, ReactNode } from "react";

export type SiteLocale = "en" | "fr";

const french: Record<string, string> = {
  "Talk with Us": "Parlez-nous",
  About: "À propos",
  Offers: "Offres",
  Destinations: "Destinations",
  Language: "Langue",
  Search: "Rechercher",
  Menu: "Menu",
  "Discover Albania": "Découvrez l’Albanie",
  "Couples Travel": "Voyages en couple",
  "Family Travel": "Voyages en famille",
  Hiking: "Randonnée",
  "Summer Secrets": "Secrets d’été",
  Popular: "Populaire",
  New: "Nouveau",
  Hot: "Tendance",
  "Read Reviews": "Lire les avis",
  "A brilliant first Original Travel trip, with a perfect mix of relaxing, cultural and adventure activities.":
    "Un premier voyage remarquable, avec un équilibre parfait entre détente, culture et aventure.",
  '"A brilliant first Original Travel trip, with a perfect mix of relaxing, cultural and adventure activities."':
    "« Un premier voyage remarquable, avec un équilibre parfait entre détente, culture et aventure. »",
  "Andre, France": "Andre, France",
  "All Inclusive Deals": "Séjours tout compris",
  "Melia Hotel 7 Days All Inclusive": "Hôtel Melia, 7 jours tout compris",
  "$356 per person": "356 $ par personne",
  "Experiences for you": "Des expériences pour vous",
  "What kind?": "Quel style ?",
  "Hiking Alps": "Randonnée dans les Alpes",
  Beach: "Plage",
  Cultural: "Culture",
  Foodie: "Gastronomie",
  "Who is going?": "Avec qui partez-vous ?",
  Family: "Famille",
  Couple: "Couple",
  Friends: "Amis",
  "Alpine Hiking Day": "Journée de randonnée alpine",
  "Local Food Tour": "Circuit gastronomique local",
  "Wild Camping": "Camping sauvage",
  "Riviera Sailing": "Voile sur la Riviera",
  "Old Town Photo Walk": "Balade photo dans la vieille ville",
  "Beach Escape": "Escapade à la plage",
  "Get wonderful ideas": "Trouvez de merveilleuses idées",
  "Not sure where to go?": "Vous ne savez pas où partir ?",
  "Get ideas": "Trouver des idées",
  "Get Ideas": "Trouver des idées",
  "How do I book a trip with WonderAlbania?": "Comment réserver un voyage avec WonderAlbania ?",
  "Choose a collection or deal, click through to the detail page, and follow the booking steps. Our team confirms every reservation within 24 hours.":
    "Choisissez une collection ou une offre, consultez sa page puis suivez les étapes de réservation. Notre équipe confirme chaque réservation sous 24 heures.",
  "Are flights included in the packages?": "Les vols sont-ils inclus dans les forfaits ?",
  "Most all-inclusive deals include stays, transfers and experiences. Flights are optional and can be added at checkout.":
    "La plupart des offres tout compris incluent le séjour, les transferts et les expériences. Les vols sont facultatifs et peuvent être ajoutés lors de la réservation.",
  "Can I customize an itinerary?": "Puis-je personnaliser un itinéraire ?",
  "Yes — every experience can be tailored. Use the 'Not sure where to go?' section or contact us directly.":
    "Oui, chaque expérience peut être adaptée. Utilisez la section « Vous ne savez pas où partir ? » ou contactez-nous directement.",
  "What is the cancellation policy?": "Quelle est la politique d’annulation ?",
  "Free cancellation up to 30 days before departure on most bookings. Details are shown on each package.":
    "L’annulation est gratuite jusqu’à 30 jours avant le départ pour la plupart des réservations. Les détails figurent sur chaque offre.",
  "Do you offer group discounts?": "Proposez-vous des réductions pour les groupes ?",
  "Groups of 6 or more receive automatic discounts. Reach out for tailored quotes.":
    "Les groupes de 6 personnes ou plus bénéficient automatiquement de réductions. Contactez-nous pour un devis personnalisé.",
  "Join the WonderAlbania newsletter": "Inscrivez-vous à la newsletter WonderAlbania",
  "Fresh itineraries, insider tips, and members-only deals — once a month.":
    "De nouveaux itinéraires, des conseils d’initiés et des offres réservées aux membres, une fois par mois.",
  Subscribe: "S’inscrire",
  "Curated Albania holidays. We design, book and support every journey with local experts on the ground.":
    "Des séjours en Albanie soigneusement sélectionnés. Nous concevons, réservons et accompagnons chaque voyage avec nos experts locaux.",
  Explore: "Explorer",
  Experiences: "Expériences",
  Collections: "Collections",
  "Group Travel": "Voyages en groupe",
  Company: "Entreprise",
  "About Us": "À propos",
  "Our Team": "Notre équipe",
  Careers: "Carrières",
  Press: "Presse",
  Contact: "Contact",
  Support: "Assistance",
  "Help Center": "Centre d’aide",
  "Travel Insurance": "Assurance voyage",
  "Booking Terms": "Conditions de réservation",
  Cancellations: "Annulations",
  Sustainability: "Développement durable",
  Legal: "Mentions légales",
  "Privacy Policy": "Politique de confidentialité",
  "Terms of Service": "Conditions d’utilisation",
  "Cookie Policy": "Politique relative aux cookies",
  "Modern Slavery": "Esclavage moderne",
  "Certifications & Memberships": "Certifications et affiliations",
  "IATA Accredited": "Accrédité IATA",
  "ATTA Member": "Membre de l’ATTA",
  "ABTOT Protected": "Protégé par ABTOT",
  "Travelife Certified": "Certifié Travelife",
  "Registered No. K12345678L. All rights reserved.":
    "N° d’immatriculation K12345678L. Tous droits réservés.",
  "WonderAlbania sh.p.k. — Registered No. K12345678L. All rights reserved.":
    "WonderAlbania sh.p.k. — N° d’immatriculation K12345678L. Tous droits réservés.",
  "Rr. Deshmoret e 4 Shkurtit, Tirana, Albania": "Rr. Deshmoret e 4 Shkurtit, Tirana, Albanie",
  "Scroll left": "Faire défiler vers la gauche",
  "Scroll right": "Faire défiler vers la droite",

  Home: "Accueil",
  Tours: "Circuits",
  "Albanian Riviera": "Riviera albanaise",
  "White coastal village beside clear blue water":
    "Village côtier blanc au bord d’une eau bleu clair",
  "Local favourite": "Coup de cœur local",
  "View 5 photos": "Voir les 5 photos",
  "Albanian Riviera · Southern Albania": "Riviera albanaise · Sud de l’Albanie",
  "Riviera secrets: villages, bays & blue water":
    "Secrets de la Riviera : villages, criques et eaux turquoise",
  "A private day along Albania’s wild southern coast, pairing hidden beaches, stone villages and lunch with a local family.":
    "Une journée privée sur la côte sauvage du sud de l’Albanie, entre plages secrètes, villages de pierre et déjeuner chez une famille locale.",
  "128 traveller reviews": "128 avis de voyageurs",
  "8 hours": "8 heures",
  "1 hr 15 min": "1 h 15",
  "2 hr": "2 h",
  "Check availability": "Vérifier les disponibilités",
  "Share tour": "Partager le circuit",
  "A private day along Albania’s wild southern coast with WonderAlbania.":
    "Une journée privée sur la côte sauvage du sud de l’Albanie avec WonderAlbania.",
  "Tour link copied": "Lien du circuit copié",
  "Link copied": "Lien copié",
  Overview: "Aperçu",
  Itinerary: "Itinéraire",
  Details: "Détails",
  Reviews: "Avis",
  Duration: "Durée",
  Location: "Lieu",
  "Southern Albania": "Sud de l’Albanie",
  Difficulty: "Difficulté",
  Easy: "Facile",
  "Group size": "Taille du groupe",
  "Up to 8": "Jusqu’à 8",
  "Tour type": "Type de circuit",
  Private: "Privé",
  Languages: "Langues",
  "Starts in": "Départ",
  "Ends in": "Arrivée",
  Accessibility: "Accessibilité",
  "Ask our team": "Demandez à notre équipe",
  "The experience": "L’expérience",
  "A slower way to see the Riviera": "Une autre façon de découvrir la Riviera",
  "This isn’t a checklist tour. It’s a locally shaped day of sea views, village tables and quiet coastal stops.":
    "Ce circuit n’est pas une simple liste d’étapes. C’est une journée imaginée localement, entre vues sur la mer, tables de village et haltes paisibles sur la côte.",
  "Your guide knows where the road opens to its best view, which café is worth a detour and when each bay is at its quietest. The pace balances easy exploration with time to swim, eat and take in the coast without rushing between stops.":
    "Votre guide connaît les plus beaux points de vue, les cafés qui méritent un détour et les heures les plus calmes dans chaque baie. Le rythme laisse le temps d’explorer, de se baigner, de déjeuner et de profiter de la côte sans se presser.",
  "Why you’ll love it": "Pourquoi vous allez l’aimer",
  "Tour highlights": "Les temps forts du circuit",
  "Hidden beaches": "Plages secrètes",
  "Swim in quiet coves with clear Ionian water.":
    "Baignez-vous dans des criques tranquilles aux eaux ioniennes cristallines.",
  "Local table": "Table locale",
  "Share a seasonal lunch at a family-run taverna.":
    "Partagez un déjeuner de saison dans une taverne familiale.",
  "Coastal villages": "Villages côtiers",
  "Wander the stone lanes of Qeparo and Himarë.":
    "Flânez dans les ruelles de pierre de Qeparo et Himarë.",
  "Golden hour": "Heure dorée",
  "See the Riviera soften into warm evening light.":
    "Voyez la Riviera se parer de la douce lumière du soir.",
  "Porto Palermo": "Porto Palermo",
  "Step inside the fortress above its dramatic bay.":
    "Entrez dans la forteresse qui domine sa baie spectaculaire.",
  "Mountain road": "Route de montagne",
  "Follow one of Albania’s most scenic coastal drives.":
    "Suivez l’une des plus belles routes côtières d’Albanie.",
  "Previous highlights": "Temps forts précédents",
  "Next highlights": "Temps forts suivants",
  "Tour gallery": "Galerie du circuit",
  "Tour highlight controls": "Commandes des temps forts du circuit",
  "Five views from the journey": "Cinq images du voyage",
  "Expand gallery": "Déployer la galerie",
  "Stack photos": "Empiler les photos",
  "Clear Ionian water along a sheltered beach": "Eau ionienne limpide le long d’une plage abritée",
  "Historic stone town in southern Albania": "Ville historique en pierre du sud de l’Albanie",
  "A shared table with fresh local food": "Une table partagée avec des produits locaux frais",
  "A boat crossing calm blue water": "Un bateau traversant une eau bleue et calme",
  "Golden evening light over the coast": "Lumière dorée du soir sur la côte",
  "Tour photo viewer": "Visionneuse de photos du circuit",
  "Close photo viewer": "Fermer la visionneuse",
  "Previous photo": "Photo précédente",
  "Next photo": "Photo suivante",
  "Your day": "Votre journée",
  "The full itinerary": "L’itinéraire complet",
  "Times are a guide. Your host keeps the day flexible for weather, traffic and the best local moments.":
    "Les horaires sont indicatifs. Votre hôte adapte la journée à la météo, à la circulation et aux meilleurs moments locaux.",
  Pickup: "Prise en charge",
  History: "Histoire",
  "Swim & lunch": "Baignade et déjeuner",
  "Village walk": "Balade au village",
  Viewpoint: "Point de vue",
  "Qeparo village": "Village de Qeparo",
  "Borsh viewpoint": "Point de vue de Borsh",
  "Meet your local guide at your hotel and settle into a private, air-conditioned vehicle.":
    "Retrouvez votre guide local à votre hôtel et installez-vous dans un véhicule privé climatisé.",
  "Explore the triangular fortress and hear the stories behind one of Albania’s most dramatic bays.":
    "Explorez la forteresse triangulaire et découvrez l’histoire de l’une des baies les plus spectaculaires d’Albanie.",
  "Swim, stroll the seafront and enjoy an unhurried lunch made with produce from the coast.":
    "Baignez-vous, promenez-vous sur le front de mer et savourez un déjeuner tranquille préparé avec les produits de la côte.",
  "Climb into the old village for slate roofs, mountain air and wide views across the Ionian Sea.":
    "Montez jusqu’au vieux village pour ses toits d’ardoise, son air de montagne et ses vues sur la mer Ionienne.",
  "Pause for coffee and a final panorama before the relaxed drive back to Sarandë.":
    "Faites une pause café devant un dernier panorama avant de reprendre tranquillement la route vers Sarandë.",
  "Southern Albania route": "Itinéraire du sud de l’Albanie",
  "The route": "Le parcours",
  "Illustrative tour route map": "Carte indicative de l’itinéraire du circuit",
  "Coastline, connected.": "La côte, étape par étape.",
  "An illustrative route from Sarandë through the Riviera’s villages, beaches and historic bays.":
    "Un itinéraire indicatif depuis Sarandë à travers les villages, plages et baies historiques de la Riviera.",
  "return route": "aller-retour",
  "door to door": "porte à porte",
  "Good to know": "Bon à savoir",
  "Everything, clearly explained": "Tout ce qu’il faut savoir",
  "What’s included": "Ce qui est inclus",
  "Private return transport": "Transport privé aller-retour",
  "Licensed local guide": "Guide local agréé",
  "Seasonal Albanian lunch": "Déjeuner albanais de saison",
  "Fortress entrance ticket": "Billet d’entrée à la forteresse",
  "Hotel pickup in Sarandë": "Prise en charge à l’hôtel à Sarandë",
  "Bottled water": "Eau en bouteille",
  "Not included": "Non inclus",
  "Personal purchases": "Achats personnels",
  "Additional drinks": "Boissons supplémentaires",
  "Guide gratuities": "Pourboires du guide",
  "Optional beach equipment": "Équipement de plage facultatif",
  "What to bring": "À emporter",
  "Comfortable shoes": "Chaussures confortables",
  "Swimwear & towel": "Maillot de bain et serviette",
  "Passport or ID": "Passeport ou pièce d’identité",
  "Refillable water bottle": "Gourde réutilisable",
  Sunscreen: "Crème solaire",
  "Light jacket": "Veste légère",
  "Best time to go": "Meilleure période",
  "Made for long, blue days.": "Pour de longues journées sous le ciel bleu.",
  "May through October is the classic season, with June and September balancing warm water and quieter roads.":
    "De mai à octobre, la saison est idéale ; juin et septembre offrent une eau chaude et des routes plus calmes.",
  "Typical summer high": "Maximum estival habituel",
  "Typical sea temperature": "Température habituelle de la mer",
  "Recommended window": "Période recommandée",
  "May–Oct": "Mai–oct.",
  "Traveller stories": "Récits de voyageurs",
  "Trusted by travellers, rated 4.9": "Plébiscité par les voyageurs, noté 4,9",
  "Based on 128 verified reviews": "D’après 128 avis vérifiés",
  Guide: "Guide",
  Value: "Rapport qualité-prix",
  Transport: "Transport",
  "Verified traveller": "Voyageur vérifié",
  "The day felt completely personal. Our guide knew exactly when to linger, and lunch overlooking the water was the moment we’ll remember.":
    "La journée semblait conçue rien que pour nous. Notre guide savait quand prendre son temps, et le déjeuner face à la mer restera notre meilleur souvenir.",
  "United Kingdom · Travelled as a couple": "Royaume-Uni · Voyage en couple",
  "A beautifully paced route with enough time to swim and explore. Porto Palermo and Qeparo were highlights, and the vehicle was spotless.":
    "Un itinéraire parfaitement rythmé, avec assez de temps pour se baigner et explorer. Porto Palermo et Qeparo ont été les temps forts, et le véhicule était impeccable.",
  "Germany · Travelled with family": "Allemagne · Voyage en famille",
  "“The day felt completely personal. Our guide knew exactly when to linger, and lunch overlooking the water was the moment we’ll remember.”":
    "« La journée semblait conçue rien que pour nous. Notre guide savait quand prendre son temps, et le déjeuner face à la mer restera notre meilleur souvenir. »",
  "“A beautifully paced route with enough time to swim and explore. Porto Palermo and Qeparo were highlights, and the vehicle was spotless.”":
    "« Un itinéraire parfaitement rythmé, avec assez de temps pour se baigner et explorer. Porto Palermo et Qeparo ont été les temps forts, et le véhicule était impeccable. »",
  "Read all 128 reviews": "Lire les 128 avis",
  "Before you go": "Avant de partir",
  "Frequently asked questions": "Questions fréquentes",
  "Can children join this tour?": "Les enfants peuvent-ils participer à ce circuit ?",
  "Yes. The relaxed pace works well for families, and child seats can be requested in advance.":
    "Oui. Le rythme tranquille convient bien aux familles et des sièges enfant peuvent être demandés à l’avance.",
  "Is October a good month to visit?": "Octobre est-il un bon mois pour venir ?",
  "October is usually quieter and mild. Sea conditions vary, so swimming is always weather-dependent.":
    "Octobre est généralement plus calme et doux. Les conditions de mer varient, la baignade dépend donc toujours de la météo.",
  "How much walking is involved?": "Quelle distance faut-il marcher ?",
  "Around 3 km in total, mostly easy, with some uneven stone lanes in Qeparo and at Porto Palermo.":
    "Environ 3 km au total, principalement faciles, avec quelques ruelles pavées irrégulières à Qeparo et Porto Palermo.",
  "Can dietary requirements be accommodated?":
    "Les régimes alimentaires particuliers peuvent-ils être pris en compte ?",
  "Vegetarian and common dietary needs can usually be arranged when shared before the tour.":
    "Les besoins végétariens et les régimes courants peuvent généralement être pris en compte s’ils sont signalés avant le circuit.",
  "Instant confirmation": "Confirmation instantanée",
  "Sample price from": "Prix indicatif à partir de",
  "€129": "129 €",
  "/ person": "/ personne",
  "Save 15%": "Économisez 15 %",
  "2 travellers": "2 voyageurs",
  "You won’t be charged. This page is a visual preview.":
    "Aucun débit ne sera effectué. Cette page est un aperçu visuel.",
  "Free cancellation preview": "Aperçu de l’annulation gratuite",
  "Local support": "Assistance locale",
  "View cancellation policy": "Voir la politique d’annulation",
  "Choose a tour date": "Choisir une date de circuit",
  "Previous month": "Mois précédent",
  "Next month": "Mois suivant",
  "Keep exploring": "Continuez à explorer",
  "More ways to see Albania": "D’autres façons de découvrir l’Albanie",
  "Full day · Culture": "Journée complète · Culture",
  "5 hours · Nature": "5 heures · Nature",
  "4 hours · Sea": "4 heures · Mer",
  "Blue Eye & Gjirokastër": "Œil Bleu et Gjirokastër",
  "Llogara Sunset Escape": "Escapade au coucher du soleil à Llogara",
  "Ksamil by Private Boat": "Ksamil en bateau privé",
  "From €95 per person": "À partir de 95 € par personne",
  "From €75 per person": "À partir de 75 € par personne",
  "From €110 per person": "À partir de 110 € par personne",
  "A little Albania, monthly": "Un peu d’Albanie chaque mois",
  "Travel stories worth opening.": "Des récits de voyage qui méritent d’être lus.",
  "Join us": "Inscrivez-vous",
  "Thoughtful Albania journeys, shaped by people who call it home.":
    "Des voyages en Albanie imaginés avec soin par ceux qui y vivent.",
  "About us": "À propos",
  "Local experts": "Experts locaux",
  "Tour details": "Détails du circuit",
  Stories: "Récits",
  "Booking terms": "Conditions de réservation",
  "Design preview.": "Aperçu du design.",
  "© 2026 WonderAlbania. Design preview.": "© 2026 WonderAlbania. Aperçu du design.",
  "WonderAlbania home": "Accueil WonderAlbania",
  "Tour sections": "Sections du circuit",
  "Quick tour facts": "Informations essentielles du circuit",
  "Booking preview": "Aperçu de la réservation",
  "Language and location": "Langue et localisation",
  "Choose location and language": "Choisissez votre localisation et votre langue",
  "Detect location": "Détecter ma position",
  "Location unavailable": "Localisation indisponible",
  "Location permission denied": "Autorisation de localisation refusée",
  "Detecting location…": "Détection de la position…",
  "Language selection": "Choix de la langue",
  Close: "Fermer",
  English: "Anglais",
  "Sep 2026": "sept. 2026",
  "Aug 2026": "août 2026",
  "4.9": "4,9",
  "4.8": "4,8",
};

const LocaleContext = createContext<SiteLocale>("en");

export function SiteLocaleProvider({
  locale,
  children,
}: {
  locale: SiteLocale;
  children: ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useSiteLocale() {
  return useContext(LocaleContext);
}

export function translate(locale: SiteLocale, value: string) {
  if (locale === "en") return value;
  const photoMatch = value.match(/^Open photo (\d+)$/);
  if (photoMatch) return `Ouvrir la photo ${photoMatch[1]}`;
  return french[value] ?? value;
}

function translateString(locale: SiteLocale, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  const translated = translate(locale, trimmed);
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

export function localizedPath(pathname: string, locale: SiteLocale) {
  const englishPath = pathname.replace(/^\/fr(?=\/|$)/, "") || "/";
  if (locale === "en") return englishPath;
  return englishPath === "/" ? "/fr/" : `/fr${englishPath}`;
}

function localizeNode(node: ReactNode, locale: SiteLocale): ReactNode {
  if (typeof node === "string") return translateString(locale, node);
  if (
    typeof node === "number" ||
    node === null ||
    node === undefined ||
    typeof node === "boolean"
  ) {
    return node;
  }
  if (Array.isArray(node)) return node.map((child) => localizeNode(child, locale));
  if (!isValidElement(node)) return node;

  const element = node as ReactElement<Record<string, unknown>>;
  const props = element.props;
  const nextProps: Record<string, unknown> = {};

  for (const key of ["aria-label", "alt", "placeholder", "title"]) {
    if (typeof props[key] === "string") nextProps[key] = translateString(locale, props[key]);
  }

  if (locale === "fr" && typeof props.href === "string" && props.href.startsWith("/")) {
    nextProps.href = localizedPath(props.href, locale);
  }

  if ("children" in props) {
    nextProps.children = Children.map(props.children as ReactNode, (child) =>
      localizeNode(child, locale),
    );
  }

  return cloneElement(element, nextProps);
}

export function useLocalize() {
  const locale = useSiteLocale();
  return useCallback((node: ReactNode) => localizeNode(node, locale), [locale]);
}
