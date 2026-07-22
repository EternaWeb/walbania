-- Wonder Albania: six enriched destination pages in one idempotent seed.
-- Creates or updates Fier, Korce, Gjirokaster, Lushnje, Pogradec and Lezhe.
--
-- Run once in the Supabase SQL editor AFTER these migrations:
--   202607220001_places_and_global_media.sql
--   202607220002_place_story_design_fields.sql
--   202607220003_place_seo_and_thumbnails.sql
--
-- Re-running is safe: matching destinations are updated, not duplicated.
-- Each destination has exactly three story sections, and existing manual tour links are preserved.
--
-- This file is intentionally limited to the six destinations listed above.

begin;

do $seed_block$
declare
  destination jsonb;
  image_item jsonb;
  section_item jsonb;
  fact_item jsonb;
  highlight_item jsonb;
  current_place_id uuid;
  current_asset_id uuid;
  hero_asset_id uuid;
  culture_asset_id uuid;
  landscape_asset_id uuid;
  asset_ids jsonb;
  hero_image jsonb;
  culture_image jsonb;
  landscape_image jsonb;
begin
  if to_regclass('public.places') is null
     or to_regclass('public.place_translations') is null
     or to_regclass('public.place_sections') is null
     or to_regclass('public.place_media') is null then
    raise exception 'Run the Wonder Albania place migrations before this seed.';
  end if;

  for destination in
    select value
    from jsonb_array_elements($destinations$
[
  {
    "slug": "fier",
    "title_en": "Fier",
    "title_fr": "Fier",
    "seo_title_en": "Fier — Gateway to Ancient Apollonia | Wonder Albania",
    "seo_title_fr": "Fier — Porte de l’antique Apollonia | Wonder Albania",
    "seo_description_en": "Discover Fier through ancient Apollonia, the modern Myzeqe city, Karavasta Lagoon, local food and linked tours across western Albania.",
    "seo_description_fr": "Découvrez Fier, l’antique Apollonia, la ville moderne de Myzeqe, la lagune de Karavasta, sa cuisine et les circuits liés de l’ouest albanais.",
    "hero_intro_en": "Fier is the practical centre of the fertile Myzeqe plain and the gateway to Apollonia, Adriatic wetlands, rural kitchens and some of western Albania’s deepest history.",
    "hero_intro_fr": "Fier est le centre pratique de la fertile plaine de Myzeqe et la porte d’Apollonia, des zones humides de l’Adriatique, des cuisines rurales et d’une histoire très ancienne.",
    "hero_alt_en": "Aerial view across Fier and the surrounding Myzeqe plain",
    "hero_alt_fr": "Vue aérienne de Fier et de la plaine de Myzeqe",
    "story_title_en": "Three ways to understand Fier",
    "story_title_fr": "Trois façons de comprendre Fier",
    "story_intro_en": "Read the modern city as a crossroads, step back into the classical world at Apollonia, then follow the flat agricultural landscape toward forests, lagoons and the Adriatic coast.",
    "story_intro_fr": "Découvrez la ville moderne comme un carrefour, remontez vers le monde antique à Apollonia, puis suivez la plaine agricole jusqu’aux forêts, lagunes et rivages de l’Adriatique.",
    "longitude": 19.5628,
    "latitude": 40.7239,
    "map_zoom": 11.0,
    "tour_radius": 0.18,
    "tour_terms": ["fier", "fieri", "apollonia", "apolonia"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Fier%20from%20the%20air%2010.jpg?width=2400",
        "width": 2400,
        "height": 1350,
        "credit_name": "Arianit / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Fier_from_the_air_10.jpg",
        "alt_en": "Fier seen from above with the Myzeqe plain beyond",
        "alt_fr": "Fier vue du ciel avec la plaine de Myzeqe à l’horizon"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Apollonia%2C%20Albania%20%28by%20Pudelek%29%20-%20Monument%20of%20Agonothetes.JPG?width=2400",
        "width": 2400,
        "height": 1600,
        "credit_name": "Pudelek / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Apollonia,_Albania_(by_Pudelek)_-_Monument_of_Agonothetes.JPG",
        "alt_en": "The restored Monument of the Agonothetes at ancient Apollonia",
        "alt_fr": "Le monument restauré des Agonothètes dans l’antique Apollonia"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Karavasta%20lagoon%20from%20tower.jpg?width=2400",
        "width": 2400,
        "height": 1595,
        "credit_name": "Albinfo / Wikimedia Commons (CC0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Karavasta_lagoon_from_tower.jpg",
        "alt_en": "Karavasta Lagoon and Divjakë pine forest from the lookout tower",
        "alt_fr": "La lagune de Karavasta et la forêt de pins de Divjakë depuis la tour"
      }
    ],
    "sections": [
      {
        "image_key": "hero",
        "title_en": "A modern crossroads in the Myzeqe plain",
        "title_fr": "Un carrefour moderne dans la plaine de Myzeqe",
        "body_en": "Fier developed as a commercial and transport centre in one of Albania’s most productive agricultural regions. Its broad streets, central park, theatre and galleries reveal a comparatively young city whose identity comes from movement between coast, countryside, Berat and the southern road rather than from a single preserved old quarter.",
        "body_fr": "Fier s’est développée comme centre commercial et routier dans l’une des régions agricoles les plus productives d’Albanie. Ses larges rues, son parc central, son théâtre et ses galeries révèlent une ville relativement jeune, façonnée par les échanges entre côte, campagne, Berat et route du sud.",
        "secondary_body_en": "The city is most rewarding when treated as the living centre of a wider territory. Markets and neighbourhood restaurants bring Myzeqe produce directly to the table: vegetables, dairy, lamb, pies and roshnica-style dishes. A night here also makes early visits to the archaeological sites and wetlands much easier.",
        "secondary_body_fr": "La ville prend tout son sens comme centre vivant d’un territoire plus vaste. Marchés et restaurants de quartier mettent les produits de Myzeqe à table : légumes, laitages, agneau, tourtes et plats de type roshnica. Une nuit sur place facilite aussi les visites matinales des sites et zones humides."
      },
      {
        "image_key": "culture",
        "title_en": "Apollonia and two thousand years of memory",
        "title_fr": "Apollonia et deux millénaires de mémoire",
        "body_en": "A short drive west of Fier, Apollonia began as a Greek colony and grew into an important Roman centre on the route toward the Adriatic. The Monument of the Agonothetes, odeon, bouleuterion, temples and long lines of excavated stone sit across an open hill where archaeology and landscape remain inseparable.",
        "body_fr": "À quelques kilomètres à l’ouest de Fier, Apollonia naquit comme colonie grecque avant de devenir un important centre romain tourné vers l’Adriatique. Monument des Agonothètes, odéon, bouleutérion, temples et pierres fouillées s’étendent sur une colline où archéologie et paysage restent indissociables.",
        "secondary_body_en": "The medieval monastery of Saint Mary, built within the ancient site, now holds the archaeological museum and adds Byzantine and Orthodox layers to the visit. Allow several hours, bring water in summer and walk beyond the headline monuments: quieter paths reveal olive groves, fragments of walls and wide Myzeqe views.",
        "secondary_body_fr": "Le monastère médiéval Sainte-Marie, construit au cœur du site antique, abrite aujourd’hui le musée archéologique et ajoute des strates byzantines et orthodoxes. Prévoyez plusieurs heures et dépassez les monuments principaux : les sentiers calmes révèlent oliviers, murs anciens et vues sur Myzeqe."
      },
      {
        "image_key": "landscape",
        "title_en": "From working farmland to the Adriatic wetlands",
        "title_fr": "Des terres agricoles aux zones humides de l’Adriatique",
        "body_en": "West and north of Fier, canals, fields and villages lead toward the protected landscapes of Divjakë–Karavasta. The lagoon, pine forest, dunes and bird-rich shallows create a natural counterpoint to Apollonia’s stone, with observation towers and quiet paths offering access to one of Albania’s most important wetland systems.",
        "body_fr": "À l’ouest et au nord de Fier, canaux, champs et villages conduisent aux paysages protégés de Divjakë–Karavasta. Lagune, pinède, dunes et eaux peu profondes riches en oiseaux contrastent avec la pierre d’Apollonia, grâce aux tours d’observation et sentiers tranquilles.",
        "secondary_body_en": "The region is ideal for a combined heritage-and-food itinerary: archaeology in the morning, a farm or village lunch, then the lagoon in softer afternoon light. Distances are manageable but public connections between rural sites are limited, so a linked tour or private vehicle produces a more coherent day.",
        "secondary_body_fr": "La région convient parfaitement à un itinéraire patrimoine et gastronomie : archéologie le matin, déjeuner à la ferme ou au village, puis lagune dans la lumière douce. Les distances restent raisonnables, mais un circuit lié ou un véhicule privé rend la journée plus cohérente."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Western Lowlands", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "Mar–Jun · Sep–Oct", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "2–3 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "landmark", "value": "Apollonia", "label_en": "Signature site", "label_fr": "Site majeur"},
      {"group": "weather", "icon": "sun", "value": "Hot and dry", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Mild and wet", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "landmark", "label_en": "Apollonia", "label_fr": "Apollonia", "text_en": "Greek and Roman ruins above the plain", "text_fr": "Ruines grecques et romaines dominant la plaine"},
      {"icon": "church", "label_en": "Saint Mary", "label_fr": "Sainte-Marie", "text_en": "Monastery and archaeological museum", "text_fr": "Monastère et musée archéologique"},
      {"icon": "binoculars", "label_en": "Karavasta", "label_fr": "Karavasta", "text_en": "Lagoon birdlife and pine forest", "text_fr": "Oiseaux de la lagune et forêt de pins"},
      {"icon": "utensils", "label_en": "Myzeqe food", "label_fr": "Cuisine de Myzeqe", "text_en": "Farm produce and generous regional dishes", "text_fr": "Produits fermiers et plats régionaux généreux"},
      {"icon": "route", "label_en": "Crossroads", "label_fr": "Carrefour", "text_en": "Easy links to Berat, coast and south", "text_fr": "Liaisons vers Berat, la côte et le sud"}
    ]
  },
  {
    "slug": "korce",
    "title_en": "Korçë",
    "title_fr": "Korçë",
    "seo_title_en": "Korçë — Albania’s City of Serenades | Wonder Albania",
    "seo_title_fr": "Korçë — La ville albanaise des sérénades | Wonder Albania",
    "seo_description_en": "Explore Korçë’s Old Bazaar, museums, serenades, food, festivals and nearby mountain villages, with linked tours across southeastern Albania.",
    "seo_description_fr": "Explorez le vieux bazar de Korçë, ses musées, sérénades, saveurs, festivals et villages de montagne avec des circuits liés dans le sud-est.",
    "hero_intro_en": "Korçë combines elegant boulevards, Albania’s strongest museum scene, romantic serenades, winter atmosphere and a ring of historic mountain villages in the southeast.",
    "hero_intro_fr": "Korçë réunit boulevards élégants, riche réseau de musées, sérénades romantiques, atmosphère hivernale et villages historiques de montagne dans le sud-est.",
    "hero_alt_en": "Korçë city centre, cathedral and surrounding mountains seen from above",
    "hero_alt_fr": "Le centre de Korçë, sa cathédrale et les montagnes vus du ciel",
    "story_title_en": "Three rhythms of Korçë",
    "story_title_fr": "Trois rythmes de Korçë",
    "story_intro_en": "Walk from civic boulevards into the Old Bazaar, follow the city’s art and education through its museums, then take the serenades and table traditions into the mountain villages beyond.",
    "story_intro_fr": "Passez des boulevards civiques au Vieux Bazar, suivez l’art et l’éducation dans les musées, puis prolongez sérénades et traditions de table dans les villages de montagne.",
    "longitude": 20.7808,
    "latitude": 40.6186,
    "map_zoom": 11.2,
    "tour_radius": 0.18,
    "tour_terms": ["korca", "korçë", "korce", "korçe", "voskopojë", "voskopoje"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kor%C3%A7a%20city%20center%20from%20above.jpg?width=2400",
        "width": 2400,
        "height": 1796,
        "credit_name": "Leeturtle / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Kor%C3%A7a_city_center_from_above.jpg",
        "alt_en": "Korçë city centre and the Resurrection Cathedral from above",
        "alt_fr": "Le centre de Korçë et la cathédrale de la Résurrection vus du ciel"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Korca%20%2853103221389%29.jpg?width=2400",
        "width": 2400,
        "height": 1600,
        "credit_name": "Marmontel / Wikimedia Commons (CC BY 2.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Korca_(53103221389).jpg",
        "alt_en": "Restored stone buildings and terraces in Korçë’s Old Bazaar",
        "alt_fr": "Bâtiments de pierre restaurés et terrasses du Vieux Bazar de Korçë"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Church%20of%20Saint%20Paraskevi%2C%20Voskopoj%C3%AB.jpg?width=2400",
        "width": 2400,
        "height": 1350,
        "credit_name": "Arbenllapashtica / Wikimedia Commons (CC BY 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Church_of_Saint_Paraskevi,_Voskopoj%C3%AB.jpg",
        "alt_en": "Church of Saint Paraskevi in the mountain village of Voskopojë",
        "alt_fr": "L’église Sainte-Parascève dans le village de montagne de Voskopojë"
      }
    ],
    "sections": [
      {
        "image_key": "hero",
        "title_en": "Boulevards, landmarks and the first Albanian school",
        "title_fr": "Boulevards, monuments et première école albanaise",
        "body_en": "Korçë’s centre feels composed and walkable, with tree-lined boulevards, stone villas, the monumental Resurrection Cathedral and a lively pedestrian spine. The National Museum of Education occupies the building where the first official Albanian-language school opened in 1887, making language and learning central to the city’s identity.",
        "body_fr": "Le centre de Korçë est harmonieux et facile à parcourir, avec boulevards arborés, villas de pierre, cathédrale monumentale de la Résurrection et axe piéton animé. Le Musée national de l’Éducation occupe le bâtiment où ouvrit en 1887 la première école officielle en langue albanaise.",
        "secondary_body_en": "Nearby institutions reward a full cultural day: the National Museum of Medieval Art presents an exceptional icon collection, while the Gjon Mili Museum, Bratko collection and Vangjush Mio house reveal photography, international art and local painting. Korçë merits time beyond a lunch stop precisely because these collections are unusually concentrated.",
        "secondary_body_fr": "Les institutions voisines méritent une journée culturelle : le Musée national d’Art médiéval présente une remarquable collection d’icônes, tandis que les musées Gjon Mili, Bratko et Vangjush Mio révèlent photographie, art international et peinture locale. Cette concentration justifie un véritable séjour."
      },
      {
        "image_key": "culture",
        "title_en": "The Old Bazaar after dark",
        "title_fr": "Le Vieux Bazar à la tombée du jour",
        "body_en": "The restored Old Bazaar translates Korçë’s mercantile history into courtyards, inns, stone façades, cafés and small shops. During the day, architectural details and former caravanserais are easiest to read; in the evening, terraces fill and the quarter becomes one of Albania’s most atmospheric places for a slow drink or meal.",
        "body_fr": "Le Vieux Bazar restauré traduit l’histoire marchande de Korçë en cours, auberges, façades de pierre, cafés et petites boutiques. Le jour révèle les détails architecturaux et anciens caravansérails ; le soir, les terrasses s’animent et le quartier devient l’un des plus agréables du pays.",
        "secondary_body_en": "Korçë’s table is part of the experience: lakror baked under a saç, beans, pickles, grilled meat and local beer pair naturally with tavern music. Summer brings the Beer Festival; winter, Orthodox celebrations and snow-season weekends. In every season, the city’s famous love serenades remain its most intimate cultural signature.",
        "secondary_body_fr": "La table fait partie de l’expérience : lakror cuit sous le saç, haricots, conserves, viandes grillées et bière locale accompagnent la musique des tavernes. L’été accueille la Fête de la bière, l’hiver les célébrations orthodoxes ; en toute saison, les sérénades d’amour restent la signature intime de la ville."
      },
      {
        "image_key": "landscape",
        "title_en": "Villages, frescoes and four-season mountains",
        "title_fr": "Villages, fresques et montagnes en toute saison",
        "body_en": "Korçë is the natural base for Voskopojë, Dardhë, Vithkuq and Boboshticë. These highland communities combine forests, stone houses, winter snow and Byzantine churches whose surviving frescoes recall periods of scholarship, trade and artistic patronage far beyond their present size.",
        "body_fr": "Korçë est la base naturelle pour Voskopojë, Dardhë, Vithkuq et Boboshticë. Ces communautés d’altitude associent forêts, maisons de pierre, neige hivernale et églises byzantines dont les fresques rappellent une histoire de savoir, commerce et mécénat dépassant leur taille actuelle.",
        "secondary_body_en": "Extend the journey to Prespa National Park, Drenova’s forests or the Kamenica Tumulus for nature and archaeology. Spring and autumn favour walking and food-focused travel, summer offers cooler mountain air, and winter gives Korçë its distinctive festive character—one of the few Albanian city breaks that genuinely changes with all four seasons.",
        "secondary_body_fr": "Prolongez vers le parc national de Prespa, les forêts de Drenova ou le tumulus de Kamenica. Printemps et automne favorisent marche et gastronomie, l’été offre l’air frais des montagnes et l’hiver donne à Korçë son caractère festif, rare destination urbaine albanaise véritablement différente à chaque saison."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Southeast Albania", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "Year-round", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "3–4 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "mountain", "value": "Mountain basin", "label_en": "Setting", "label_fr": "Cadre"},
      {"group": "weather", "icon": "sun", "value": "Warm, cool nights", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Cold with snow", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "footprints", "label_en": "Old Bazaar", "label_fr": "Vieux Bazar", "text_en": "Stone lanes, inns and evening terraces", "text_fr": "Ruelles de pierre, auberges et terrasses"},
      {"icon": "camera", "label_en": "Museums", "label_fr": "Musées", "text_en": "Icons, education, painting and photography", "text_fr": "Icônes, éducation, peinture et photographie"},
      {"icon": "sparkles", "label_en": "Serenades", "label_fr": "Sérénades", "text_en": "The romantic music of Korçë", "text_fr": "La musique romantique de Korçë"},
      {"icon": "utensils", "label_en": "At the table", "label_fr": "À table", "text_en": "Lakror, taverns and local beer", "text_fr": "Lakror, tavernes et bière locale"},
      {"icon": "mountain", "label_en": "Highland villages", "label_fr": "Villages d’altitude", "text_en": "Voskopojë, Dardhë and Vithkuq", "text_fr": "Voskopojë, Dardhë et Vithkuq"}
    ]
  },
  {
    "slug": "gjirokaster",
    "title_en": "Gjirokastër",
    "title_fr": "Gjirokastër",
    "seo_title_en": "Gjirokastër — The UNESCO Stone City | Wonder Albania",
    "seo_title_fr": "Gjirokastër — La cité de pierre de l’UNESCO | Wonder Albania",
    "seo_description_en": "Explore UNESCO-listed Gjirokastër through its castle, stone-roofed houses, Old Bazaar, regional food and linked tours across the Drino Valley.",
    "seo_description_fr": "Explorez Gjirokastër classée par l’UNESCO, son château, ses maisons aux toits de pierre, le Vieux Bazar, sa cuisine et les circuits de la vallée du Drino.",
    "hero_intro_en": "Gjirokastër climbs the slopes above the Drino Valley in silver-grey stone, joining fortified houses, a vast castle, artisan streets and southern Albanian food.",
    "hero_intro_fr": "Gjirokastër gravit les pentes au-dessus de la vallée du Drino dans une pierre gris argenté, réunissant maisons fortifiées, vaste château, rues artisanales et cuisine du sud.",
    "hero_alt_en": "Stone-roofed old town of Gjirokastër climbing toward the castle",
    "hero_alt_fr": "La vieille ville aux toits de pierre de Gjirokastër montant vers le château",
    "story_title_en": "Three layers of the Stone City",
    "story_title_fr": "Trois strates de la Cité de pierre",
    "story_intro_en": "Look across the slate-roofed city, enter the defensive world of its tower houses, then climb to the fortress where the whole Drino Valley and Gjirokastër’s cultural memory come together.",
    "story_intro_fr": "Contemplez la ville aux toits de pierre, entrez dans l’univers défensif des maisons-tours, puis montez à la forteresse où se rejoignent la vallée du Drino et la mémoire culturelle de Gjirokastër.",
    "longitude": 20.1389,
    "latitude": 40.0758,
    "map_zoom": 11.5,
    "tour_radius": 0.16,
    "tour_terms": ["gjirokaster", "gjirokastër", "gjirokastra", "argyrokastro"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Gjirokast%C3%ABr%20-%20Altstadt%201.jpg?width=2400",
        "width": 2400,
        "height": 1800,
        "credit_name": "Wolfgang Sauber / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Gjirokast%C3%ABr_-_Altstadt_1.jpg",
        "alt_en": "Traditional stone houses and layered rooftops in Gjirokastër old town",
        "alt_fr": "Maisons traditionnelles et toits de pierre superposés dans la vieille ville"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Gjirokast%C3%ABr%20-%20Steinernes%20Dach.jpg?width=2400",
        "width": 2400,
        "height": 1800,
        "credit_name": "Wolfgang Sauber / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Gjirokast%C3%ABr_-_Steinernes_Dach.jpg",
        "alt_en": "Close view of a characteristic stone-slab roof in Gjirokastër",
        "alt_fr": "Vue rapprochée d’un toit caractéristique en dalles de pierre à Gjirokastër"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Gjirokast%C3%ABr%20Castle.jpg?width=2400",
        "width": 2400,
        "height": 1800,
        "credit_name": "Radosław Botev / Wikimedia Commons (CC BY 3.0 PL)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Gjirokast%C3%ABr_Castle.jpg",
        "alt_en": "Massive stone walls of Gjirokastër Castle above the city",
        "alt_fr": "Les imposants remparts de pierre du château de Gjirokastër"
      }
    ],
    "sections": [
      {
        "image_key": "hero",
        "title_en": "A UNESCO city written in stone",
        "title_fr": "Une ville UNESCO écrite dans la pierre",
        "body_en": "Gjirokastër’s historic centre is recognised by UNESCO for an urban landscape shaped by steep cobbled streets, stone-roofed houses and a remarkably intact Ottoman-era character. From across the valley, the old quarters appear to grow from Mount Gjerë; inside them, every turn changes the relationship between roof, wall, mountain and sky.",
        "body_fr": "Le centre historique de Gjirokastër est reconnu par l’UNESCO pour son paysage de rues pavées abruptes, maisons aux toits de pierre et caractère ottoman remarquablement préservé. Depuis la vallée, les quartiers anciens semblent naître du mont Gjerë ; chaque virage change le rapport entre toit, mur, montagne et ciel.",
        "secondary_body_en": "The Old Bazaar is the social and commercial heart, with restored façades, craft workshops and routes branching toward residential lanes. Explore early before day-trip traffic, wear shoes suited to polished stone, and pause at viewpoints between the bazaar and upper neighbourhoods rather than treating the climb only as a route to the castle.",
        "secondary_body_fr": "Le Vieux Bazar est le cœur social et commercial, avec façades restaurées, ateliers et ruelles menant aux quartiers résidentiels. Venez tôt, portez des chaussures adaptées aux pierres lisses et profitez des belvédères entre bazar et quartiers hauts au lieu de considérer la montée comme un simple accès au château."
      },
      {
        "image_key": "culture",
        "title_en": "Tower houses built for family and defence",
        "title_fr": "Des maisons-tours pour la famille et la défense",
        "body_en": "The great houses of Gjirokastër combine domestic comfort with defensive architecture. Skënduli and Zekate houses reveal guest rooms, winter and summer spaces, carved ceilings, fireplaces, water systems and commanding views, explaining how prosperous extended families organised life behind high stone walls.",
        "body_fr": "Les grandes demeures de Gjirokastër associent confort domestique et architecture défensive. Les maisons Skënduli et Zekate dévoilent pièces d’apparat, espaces d’hiver et d’été, plafonds sculptés, cheminées, systèmes d’eau et vues dominantes, montrant l’organisation des familles élargies derrière de hauts murs.",
        "secondary_body_en": "The Ethnographic Museum and Ismail Kadare House add different perspectives on clothing, household culture and literature. In the bazaar, look for locally worked stone, wood, textiles and metal rather than generic souvenirs. At the table, qifqi rice balls, pasha qofte, oshaf and slow-cooked dishes express the region just as clearly as its architecture.",
        "secondary_body_fr": "Le Musée ethnographique et la maison d’Ismail Kadare apportent d’autres regards sur vêtements, culture domestique et littérature. Au bazar, recherchez pierre, bois, textiles et métal travaillés localement. À table, qifqi, pasha qofte, oshaf et plats mijotés expriment la région autant que son architecture."
      },
      {
        "image_key": "landscape",
        "title_en": "The fortress above the Drino Valley",
        "title_fr": "La forteresse au-dessus de la vallée du Drino",
        "body_en": "Gjirokastër Castle stretches along the ridge above the old town and commands the entire Drino Valley. Its passages contain the Arms Museum, former prison spaces, artillery and a Cold War-era aircraft, while the clock tower and open terraces deliver the clearest view of the city’s defensive geography.",
        "body_fr": "Le château de Gjirokastër s’étire sur la crête au-dessus de la vieille ville et domine toute la vallée du Drino. Ses passages abritent Musée des Armes, ancienne prison, artillerie et avion de la guerre froide, tandis que tour de l’horloge et terrasses révèlent la géographie défensive de la cité.",
        "secondary_body_en": "The fortress also hosts the National Folklore Festival, linking military architecture to living music, dress and dance traditions. Beyond the city, Antigonea, Libohovë, the Kordhoca Bridge and rural food producers make the valley worth additional time. Two nights allow Gjirokastër to be experienced after the day crowds leave.",
        "secondary_body_fr": "La forteresse accueille aussi le Festival folklorique national, reliant architecture militaire aux traditions vivantes de musique, costume et danse. Au-delà, Antigonea, Libohovë, le pont de Kordhoca et les producteurs ruraux méritent du temps. Deux nuits permettent de vivre la ville après le départ des visiteurs."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Southern Albania", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "Apr–Jun · Sep–Oct", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "2–3 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "landmark", "value": "UNESCO old town", "label_en": "Heritage", "label_fr": "Patrimoine"},
      {"group": "weather", "icon": "sun", "value": "Hot and bright", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Cool and rainy", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "landmark", "label_en": "The castle", "label_fr": "Le château", "text_en": "Fortress panoramas over the Drino Valley", "text_fr": "Panoramas de la forteresse sur la vallée"},
      {"icon": "home", "label_en": "Tower houses", "label_fr": "Maisons-tours", "text_en": "Skënduli and Zekate family architecture", "text_fr": "Architecture familiale de Skënduli et Zekate"},
      {"icon": "footprints", "label_en": "Old Bazaar", "label_fr": "Vieux Bazar", "text_en": "Cobbled lanes and artisan workshops", "text_fr": "Ruelles pavées et ateliers d’artisans"},
      {"icon": "sparkles", "label_en": "Folklore", "label_fr": "Folklore", "text_en": "Music and dance inside the fortress", "text_fr": "Musique et danse dans la forteresse"},
      {"icon": "utensils", "label_en": "Local table", "label_fr": "Table locale", "text_en": "Qifqi, oshaf and southern recipes", "text_fr": "Qifqi, oshaf et recettes du sud"}
    ]
  },
  {
    "slug": "lushnje",
    "title_en": "Lushnjë",
    "title_fr": "Lushnjë",
    "seo_title_en": "Lushnjë — Heart of the Myzeqe Plain | Wonder Albania",
    "seo_title_fr": "Lushnjë — Au cœur de la plaine de Myzeqe | Wonder Albania",
    "seo_description_en": "Discover Lushnjë through the 1920 Congress Museum, Myzeqe farms, Ardenica Monastery, regional food and linked central Albania tours.",
    "seo_description_fr": "Découvrez Lushnjë, le Musée du Congrès de 1920, les fermes de Myzeqe, le monastère d’Ardenica, la cuisine locale et les circuits liés.",
    "hero_intro_en": "Lushnjë offers a quieter Albania shaped by the decisive Congress of 1920, the productive Myzeqe plain, market life, family cooking and nearby Ardenica Monastery.",
    "hero_intro_fr": "Lushnjë révèle une Albanie plus calme, façonnée par le décisif Congrès de 1920, la plaine productive de Myzeqe, les marchés, la cuisine familiale et le monastère d’Ardenica.",
    "hero_alt_en": "Lushnjë’s central Bashkia Square and surrounding city buildings",
    "hero_alt_fr": "La place centrale Bashkia de Lushnjë et les bâtiments environnants",
    "story_title_en": "Three reasons to stop in Lushnjë",
    "story_title_fr": "Trois raisons de s’arrêter à Lushnjë",
    "story_intro_en": "Begin with the political moment that helped secure the Albanian state, understand the city through its agricultural plain and everyday food, then climb to Ardenica for art, history and long rural views.",
    "story_intro_fr": "Commencez par le moment politique qui consolida l’État albanais, comprenez la ville par sa plaine agricole et sa cuisine quotidienne, puis montez à Ardenica pour l’art, l’histoire et les vues rurales.",
    "longitude": 19.7050,
    "latitude": 40.9419,
    "map_zoom": 11.0,
    "tour_radius": 0.20,
    "tour_terms": ["lushnje", "lushnjë", "lushnja", "ardenica", "myzeqe"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/230%20Lushnje%20Bashkia%20Square.jpg?width=2400",
        "width": 2400,
        "height": 1786,
        "credit_name": "Arianit / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:230_Lushnje_Bashkia_Square.jpg",
        "alt_en": "Open civic square in the centre of Lushnjë",
        "alt_fr": "Grande place civique au centre de Lushnjë"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Aerial%20view%20of%20Lushnj%C3%AB%20Muzeu%20Historik.jpg?width=2400",
        "width": 2400,
        "height": 1350,
        "credit_name": "Arianit / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Aerial_view_of_Lushnj%C3%AB_Muzeu_Historik.jpg",
        "alt_en": "Aerial view of the Congress of Lushnjë Museum",
        "alt_fr": "Vue aérienne du Musée du Congrès de Lushnjë"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ardenica%20Monastery%20exterior%2002.jpg?width=2400",
        "width": 2400,
        "height": 1350,
        "credit_name": "Adert / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Ardenica_Monastery_exterior_02.jpg",
        "alt_en": "Stone exterior and courtyard of Ardenica Monastery",
        "alt_fr": "Extérieur en pierre et cour du monastère d’Ardenica"
      }
    ],
    "sections": [
      {
        "image_key": "culture",
        "title_en": "The congress that strengthened the Albanian state",
        "title_fr": "Le congrès qui consolida l’État albanais",
        "body_en": "In January 1920, delegates met in Lushnjë at a decisive moment for Albania’s territorial integrity and political independence. The Congress established new national institutions and moved the capital toward Tirana, giving this modest central city a permanent place in the story of the modern Albanian state.",
        "body_fr": "En janvier 1920, des délégués se réunirent à Lushnjë à un moment décisif pour l’intégrité territoriale et l’indépendance politique de l’Albanie. Le Congrès établit de nouvelles institutions nationales et orienta la capitale vers Tirana, donnant à cette ville une place durable dans l’histoire de l’État moderne.",
        "secondary_body_en": "The Congress Museum preserves the meeting house, period rooms, documents and objects that make the event understandable at human scale. Pair it with the local historical museum, civic monuments and a walk through the central square. The experience is compact, quiet and especially valuable for travellers following Albania’s twentieth-century history.",
        "secondary_body_fr": "Le Musée du Congrès conserve la maison de réunion, les pièces d’époque, documents et objets qui rendent l’événement concret. Associez-le au musée historique local, aux monuments civiques et à la place centrale. L’expérience est compacte, paisible et précieuse pour comprendre le XXe siècle albanais."
      },
      {
        "image_key": "hero",
        "title_en": "Everyday life on Albania’s agricultural plain",
        "title_fr": "Vie quotidienne dans la grande plaine agricole",
        "body_en": "Lushnjë sits in the heart of Myzeqe, a broad lowland of fields, irrigation channels, orchards and farming communities. The city’s markets and service streets reflect this working landscape more honestly than a polished visitor district would, making Lushnjë a useful stop for understanding how central-western Albania produces, trades and eats.",
        "body_fr": "Lushnjë se trouve au cœur de Myzeqe, vaste plaine de champs, canaux d’irrigation, vergers et communautés agricoles. Marchés et rues commerçantes reflètent ce paysage actif avec plus de vérité qu’un quartier touristique, permettant de comprendre comment le centre-ouest produit, échange et se nourrit.",
        "secondary_body_en": "Food is the most direct introduction: Myzeqe-style lakror, japrak and dollma, cornbread, butter, cheese and seasonal vegetables appear in homes, bakeries and rural restaurants. Seek out farm visits and agrotourism rather than rushing through; the region’s appeal lies in conversation, fresh ingredients and the unhurried scale of village life.",
        "secondary_body_fr": "La cuisine est la meilleure introduction : lakror de Myzeqe, japrak et dollma, pain de maïs, beurre, fromage et légumes de saison apparaissent dans maisons, boulangeries et tables rurales. Privilégiez fermes et agrotourismes : l’attrait vient des échanges, produits frais et rythme paisible des villages."
      },
      {
        "image_key": "landscape",
        "title_en": "Ardenica above the fields",
        "title_fr": "Ardenica au-dessus des champs",
        "body_en": "Ardenica Monastery rises on a wooded hill above the Myzeqe plain, its enclosed courtyards, church and monastic buildings creating a calm contrast with the open farmland below. The complex preserves important Orthodox art and is traditionally associated with the marriage of Skanderbeg and Donika Arianiti.",
        "body_fr": "Le monastère d’Ardenica se dresse sur une colline boisée au-dessus de Myzeqe. Ses cours fermées, son église et ses bâtiments monastiques contrastent avec les terres ouvertes. Le complexe conserve un art orthodoxe important et est traditionnellement associé au mariage de Skanderbeg et Donika Arianiti.",
        "secondary_body_en": "The terrace views help explain Lushnjë’s geography, stretching from agricultural lowlands toward the Adriatic. Combine Ardenica with Divjakë–Karavasta, Apollonia or a farm lunch for a complete regional day. A car or linked tour is useful because the best experiences sit across the municipality rather than in one walkable cluster.",
        "secondary_body_fr": "Les vues de la terrasse expliquent la géographie de Lushnjë, des basses terres agricoles vers l’Adriatique. Associez Ardenica à Divjakë–Karavasta, Apollonia ou un déjeuner fermier. Voiture ou circuit lié est utile car les meilleures expériences sont dispersées dans la municipalité."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Central-west Albania", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "Mar–Jun · Sep–Nov", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "1–2 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "route", "value": "Myzeqe plain", "label_en": "Landscape", "label_fr": "Paysage"},
      {"group": "weather", "icon": "sun", "value": "Hot and dry", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Mild and damp", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "landmark", "label_en": "1920 Congress", "label_fr": "Congrès de 1920", "text_en": "A decisive chapter of modern Albania", "text_fr": "Un chapitre décisif de l’Albanie moderne"},
      {"icon": "home", "label_en": "The museum", "label_fr": "Le musée", "text_en": "The original meeting house and documents", "text_fr": "Maison de réunion et documents originaux"},
      {"icon": "utensils", "label_en": "Myzeqe table", "label_fr": "Table de Myzeqe", "text_en": "Lakror, dairy and seasonal produce", "text_fr": "Lakror, laitages et produits de saison"},
      {"icon": "church", "label_en": "Ardenica", "label_fr": "Ardenica", "text_en": "Hilltop monastery and Orthodox art", "text_fr": "Monastère perché et art orthodoxe"},
      {"icon": "compass", "label_en": "Rural Albania", "label_fr": "Albanie rurale", "text_en": "Farms, canals and authentic village life", "text_fr": "Fermes, canaux et vie villageoise authentique"}
    ]
  },
  {
    "slug": "pogradec",
    "title_en": "Pogradec",
    "title_fr": "Pogradec",
    "seo_title_en": "Pogradec — Albania’s Lake Ohrid Escape | Wonder Albania",
    "seo_title_fr": "Pogradec — L’échappée albanaise du lac d’Ohrid | Wonder Albania",
    "seo_description_en": "Plan Pogradec with Lake Ohrid, its promenade, Drilon, Tushemisht, Lin, koran cuisine and linked tours across southeastern Albania.",
    "seo_description_fr": "Préparez Pogradec avec le lac d’Ohrid, sa promenade, Drilon, Tushemisht, Lin, le koran et les circuits liés dans le sud-est albanais.",
    "hero_intro_en": "Pogradec brings calm lake mornings, a long promenade, UNESCO-listed natural heritage, freshwater cuisine and easy excursions to Drilon, Tushemisht and Lin.",
    "hero_intro_fr": "Pogradec réunit matins paisibles au bord du lac, longue promenade, patrimoine naturel UNESCO, cuisine d’eau douce et excursions vers Drilon, Tushemisht et Lin.",
    "hero_alt_en": "Pogradec and the Albanian shore of Lake Ohrid seen from the southern pass",
    "hero_alt_fr": "Pogradec et la rive albanaise du lac d’Ohrid vues depuis le col au sud",
    "story_title_en": "Three ways to slow down in Pogradec",
    "story_title_fr": "Trois façons de ralentir à Pogradec",
    "story_intro_en": "Follow the lake through morning light and evening promenade, uncover the city’s older settlements and literary spirit, then continue east and west to springs, villages and archaeological landscapes.",
    "story_intro_fr": "Suivez le lac entre lumière du matin et promenade du soir, découvrez les anciens établissements et l’esprit littéraire de la ville, puis partez vers sources, villages et paysages archéologiques.",
    "longitude": 20.6525,
    "latitude": 40.9025,
    "map_zoom": 11.2,
    "tour_radius": 0.18,
    "tour_terms": ["pogradec", "pogradeci", "drilon", "tushemisht", "lin village"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Pogradec%20from%20South.jpg?width=2400",
        "width": 2400,
        "height": 1600,
        "credit_name": "Albinfo / Wikimedia Commons (CC BY 3.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Pogradec_from_South.jpg",
        "alt_en": "Pogradec spread along the blue shoreline of Lake Ohrid",
        "alt_fr": "Pogradec s’étendant le long de la rive bleue du lac d’Ohrid"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Pogradec%2C%20Albania%202013-09%2001.jpg?width=2400",
        "width": 2400,
        "height": 1590,
        "credit_name": "Pasztilla / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Pogradec,_Albania_2013-09_01.jpg",
        "alt_en": "Beach and lakeside promenade on Lake Ohrid at Pogradec",
        "alt_fr": "Plage et promenade au bord du lac d’Ohrid à Pogradec"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dilon%20pogradec.jpg?width=2400",
        "width": 2400,
        "height": 1350,
        "credit_name": "Alesia Gjonaj / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Dilon_pogradec.jpg",
        "alt_en": "Clear spring water, trees and footpaths at Drilon near Pogradec",
        "alt_fr": "Eaux claires, arbres et sentiers de Drilon près de Pogradec"
      }
    ],
    "sections": [
      {
        "image_key": "hero",
        "title_en": "Life beside an ancient lake",
        "title_fr": "La vie au bord d’un lac ancien",
        "body_en": "Pogradec faces one of Europe’s oldest and deepest lakes, with the Albanian shore included in the transboundary UNESCO World Heritage property of the Lake Ohrid region. Mountains frame a vast changing surface whose colour, wind and light shape the city from the first fishing boats at dawn to the evening promenade.",
        "body_fr": "Pogradec fait face à l’un des lacs les plus anciens et profonds d’Europe. La rive albanaise appartient au bien transfrontalier UNESCO de la région du lac d’Ohrid. Les montagnes encadrent une surface changeante dont couleur, vent et lumière rythment la ville des bateaux matinaux à la promenade du soir.",
        "secondary_body_en": "The waterfront supports swimming, boating, cycling and unhurried café stops, but its ecological value is as important as recreation. The endemic koran fish is the city’s culinary symbol; choose responsible local restaurants and pair it with regional vegetables, pickles and wine while remembering that this rare lake ecosystem needs careful protection.",
        "secondary_body_fr": "Le front de lac se prête à la baignade, au bateau, au vélo et aux cafés tranquilles, mais sa valeur écologique compte autant que les loisirs. Le koran endémique est le symbole culinaire : choisissez des restaurants responsables et accompagnez-le de légumes, conserves et vins régionaux en respectant cet écosystème rare."
      },
      {
        "image_key": "culture",
        "title_en": "Promenade, poetry and the older town above",
        "title_fr": "Promenade, poésie et ville ancienne sur les hauteurs",
        "body_en": "The lakeside promenade is Pogradec’s social centre, especially during the evening xhiro. Behind it, streets climb toward the older settlement and the hill traditionally known as Pogradec Castle, where traces of fortification and broad views connect the modern resort city to much earlier habitation.",
        "body_fr": "La promenade au bord du lac est le centre social de Pogradec, surtout pendant le xhiro du soir. Derrière elle, les rues montent vers l’ancien établissement et la colline dite château de Pogradec, où traces de fortification et vues larges relient la station moderne à une occupation bien plus ancienne.",
        "secondary_body_en": "Pogradec is also closely associated with poet Lasgush Poradeci and writer Mitrush Kuteli, whose work gives the lake a powerful place in Albanian literature. Markets, neighbourhood bakeries and cultural events add a lived dimension beyond the beach. Stay overnight to experience the calm that returns after day visitors leave.",
        "secondary_body_fr": "Pogradec est étroitement liée au poète Lasgush Poradeci et à l’écrivain Mitrush Kuteli, dont les œuvres donnent au lac une place forte dans la littérature albanaise. Marchés, boulangeries et événements culturels dépassent la plage. Une nuit permet de retrouver le calme après le départ des visiteurs."
      },
      {
        "image_key": "landscape",
        "title_en": "Drilon, Tushemisht and the road to Lin",
        "title_fr": "Drilon, Tushemisht et la route de Lin",
        "body_en": "East of the city, the springs and channels of Drilon flow through a shaded park of trees, footbridges and water birds before reaching Lake Ohrid. Nearby Tushemisht adds traditional houses, a long lakeshore, restaurants and film history, creating an easy half-day extension that feels greener and more village-like than central Pogradec.",
        "body_fr": "À l’est, les sources et canaux de Drilon traversent un parc ombragé d’arbres, passerelles et oiseaux avant de rejoindre le lac. Tushemisht ajoute maisons traditionnelles, longue rive, restaurants et histoire du cinéma, formant une excursion verte et villageoise à une demi-journée du centre.",
        "secondary_body_en": "Westward, Lin occupies a dramatic peninsula above the water, with early Christian mosaics and archaeological evidence of very ancient lakeside settlement. Farther inland, Selca’s royal tombs and mountain trails broaden the story. Pogradec works best as a three-day base linking water, heritage, villages and southeastern cuisine.",
        "secondary_body_fr": "À l’ouest, Lin occupe une péninsule spectaculaire, avec mosaïques paléochrétiennes et traces d’un habitat lacustre très ancien. Plus loin, les tombes royales de Selca et les sentiers de montagne élargissent le récit. Pogradec est une excellente base de trois jours entre eau, patrimoine, villages et cuisine du sud-est."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Lake Ohrid", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "May–Oct", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "3–4 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "landmark", "value": "UNESCO lake region", "label_en": "Heritage", "label_fr": "Patrimoine"},
      {"group": "weather", "icon": "sun", "value": "Warm, lake breeze", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Cold and quiet", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "sunset", "label_en": "Lake Ohrid", "label_fr": "Lac d’Ohrid", "text_en": "Ancient water and mountain sunsets", "text_fr": "Eaux anciennes et couchers de soleil"},
      {"icon": "footprints", "label_en": "Promenade", "label_fr": "Promenade", "text_en": "Morning calm and evening xhiro", "text_fr": "Calme matinal et xhiro du soir"},
      {"icon": "sparkles", "label_en": "Drilon", "label_fr": "Drilon", "text_en": "Clear springs and shaded waterways", "text_fr": "Sources claires et canaux ombragés"},
      {"icon": "home", "label_en": "Lin + Tushemisht", "label_fr": "Lin + Tushemisht", "text_en": "Lakeside villages and deep heritage", "text_fr": "Villages lacustres et patrimoine ancien"},
      {"icon": "utensils", "label_en": "Koran", "label_fr": "Koran", "text_en": "The lake fish defining local cuisine", "text_fr": "Le poisson emblématique de la cuisine locale"}
    ]
  },
  {
    "slug": "lezhe",
    "title_en": "Lezhë",
    "title_fr": "Lezhë",
    "seo_title_en": "Lezhë — Where Albanian History Meets the Sea | Wonder Albania",
    "seo_title_fr": "Lezhë — Là où l’histoire rencontre la mer | Wonder Albania",
    "seo_description_en": "Explore Lezhë through its castle, Skanderbeg Memorial, Kune–Vain Lagoon, Shëngjin coast, Kallmet wine, agrotourism and linked tours.",
    "seo_description_fr": "Explorez Lezhë, son château, le mémorial de Skanderbeg, la lagune Kune–Vain, Shëngjin, le vin de Kallmet, l’agrotourisme et les circuits liés.",
    "hero_intro_en": "Lezhë brings Illyrian and Venetian walls, Skanderbeg’s national story, the Drin plain, Adriatic lagoons and one of Albania’s strongest food-and-farm cultures into a compact region.",
    "hero_intro_fr": "Lezhë rassemble murs illyriens et vénitiens, histoire nationale de Skanderbeg, plaine du Drin, lagunes adriatiques et l’une des plus fortes cultures gastronomiques et agricoles du pays.",
    "hero_alt_en": "Lezhë Castle above the city, Drin plain and Adriatic landscape",
    "hero_alt_fr": "Le château de Lezhë au-dessus de la ville, de la plaine du Drin et du paysage adriatique",
    "story_title_en": "Three landscapes of Lezhë",
    "story_title_fr": "Trois paysages de Lezhë",
    "story_intro_en": "Climb through the ancient layers of Lissus, return to the city for the memory of Skanderbeg, then follow the Drin toward lagoons, beaches, vineyards and the farm tables that define modern Lezhë.",
    "story_intro_fr": "Montez à travers les strates de l’ancienne Lissus, revenez en ville sur les traces de Skanderbeg, puis suivez le Drin vers lagunes, plages, vignes et tables fermières qui définissent la Lezhë actuelle.",
    "longitude": 19.6436,
    "latitude": 41.7836,
    "map_zoom": 11.0,
    "tour_radius": 0.18,
    "tour_terms": ["lezhe", "lezhë", "lezha", "shengjin", "shëngjin", "kune-vain", "kallmet"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kalaja%20e%20Lezh%C3%ABs%20-%20panoramio.jpg?width=2400",
        "width": 2400,
        "height": 1800,
        "credit_name": "Xhevahir Bushpepa / Wikimedia Commons (CC BY-SA 3.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Kalaja_e_Lezh%C3%ABs_-_panoramio.jpg",
        "alt_en": "Stone walls of Lezhë Castle overlooking northern Albania",
        "alt_fr": "Les remparts de pierre du château de Lezhë dominant le nord albanais"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Lezh%C3%AB%2C%20Albania%20%E2%80%93%20Skanderbeg%20Memorial%202016%2004.jpg?width=1600",
        "width": 1600,
        "height": 1059,
        "credit_name": "Pasztilla / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Lezh%C3%AB,_Albania_%E2%80%93_Skanderbeg_Memorial_2016_04.jpg",
        "alt_en": "Stone remains and memorial architecture at Skanderbeg’s burial place",
        "alt_fr": "Vestiges de pierre et architecture du mémorial au lieu de sépulture de Skanderbeg"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Laguna%20Kune%20-%20Vain%2C%20Lezh%C3%AB.jpg?width=2400",
        "width": 2400,
        "height": 1600,
        "credit_name": "Kevi-kola / Wikimedia Commons (CC BY 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Laguna_Kune_-_Vain,_Lezh%C3%AB.jpg",
        "alt_en": "Sunset reflected across the Kune–Vain Lagoon near Lezhë",
        "alt_fr": "Coucher de soleil reflété sur la lagune Kune–Vain près de Lezhë"
      }
    ],
    "sections": [
      {
        "image_key": "hero",
        "title_en": "Ancient Lissus and the castle on the hill",
        "title_fr": "Lissus antique et le château sur la colline",
        "body_en": "Lezhë grew from ancient Lissus at a strategic point between the Adriatic, the Drin routes and northern plains. Its hilltop castle preserves Illyrian origins and Roman, Byzantine, Venetian and Ottoman rebuilding, allowing the region’s long history to be read through walls, gates, cisterns and foundations.",
        "body_fr": "Lezhë est née de l’ancienne Lissus, à un point stratégique entre Adriatique, routes du Drin et plaines du nord. Son château perché conserve des origines illyriennes et des reconstructions romaines, byzantines, vénitiennes et ottomanes, lisibles dans murs, portes, citernes et fondations.",
        "secondary_body_en": "The panorama explains why the site mattered: below lie the modern city, Drin corridor, Zadrima fields and distant coast. Climb in the cooler morning or late afternoon, then look for traces of the ancient lower city around central Lezhë. The castle is not only a viewpoint but the key to the destination’s geography.",
        "secondary_body_fr": "Le panorama explique l’importance du site : ville moderne, corridor du Drin, champs de Zadrima et côte lointaine s’étendent en contrebas. Montez le matin ou en fin d’après-midi, puis cherchez les traces de la ville basse antique. Le château est la clé géographique de la destination."
      },
      {
        "image_key": "culture",
        "title_en": "The League of Lezhë and Skanderbeg’s memory",
        "title_fr": "La Ligue de Lezhë et la mémoire de Skanderbeg",
        "body_en": "Lezhë occupies a central place in Albania’s national history. In 1444, regional leaders gathered here in the alliance remembered as the League of Lezhë under Gjergj Kastrioti Skanderbeg. After his death in 1468, Skanderbeg was buried in the former Cathedral of Saint Nicholas in the city.",
        "body_fr": "Lezhë occupe une place centrale dans l’histoire nationale albanaise. En 1444, des chefs régionaux s’y réunirent dans l’alliance connue comme la Ligue de Lezhë sous Gjergj Kastrioti Skanderbeg. Après sa mort en 1468, Skanderbeg fut enterré dans l’ancienne cathédrale Saint-Nicolas.",
        "secondary_body_en": "The present Skanderbeg Memorial preserves the church’s archaeological fabric within an open modern structure, creating one of Albania’s most symbolic commemorative spaces. Nearby monuments and the town centre can be explored on foot. A guided visit adds valuable context about medieval alliances, Venetian Lezhë and the changing meaning of the site.",
        "secondary_body_fr": "Le mémorial actuel de Skanderbeg conserve la trame archéologique de l’église dans une structure moderne ouverte, créant l’un des espaces commémoratifs les plus symboliques d’Albanie. Les monuments voisins se découvrent à pied ; une visite guidée éclaire alliances médiévales, Lezhë vénitienne et sens du lieu."
      },
      {
        "image_key": "landscape",
        "title_en": "Lagoons, vineyards and Albania’s farm-to-table north",
        "title_fr": "Lagunes, vignobles et gastronomie fermière du nord",
        "body_en": "West of the city, the Drin approaches the Adriatic through beaches and the Kune–Vain wetland system. Lagoons, reed beds, woodland and shallow coastal water support birdlife and fishing traditions, while nearby Shëngjin adds a working port, long beaches and access to the sculpted sand slope of Rana e Hedhun.",
        "body_fr": "À l’ouest, le Drin rejoint l’Adriatique à travers plages et zones humides de Kune–Vain. Lagunes, roselières, bois et eaux côtières peu profondes abritent oiseaux et traditions de pêche, tandis que Shëngjin ajoute port actif, longues plages et accès à la pente sableuse de Rana e Hedhun.",
        "secondary_body_en": "Inland, Kallmet vineyards and the villages around Fishtë have made Lezhë a national reference for agrotourism. Kallmet wine, artisan raki, dairy, meat, vegetables and lagoon fish move directly from producers to celebrated regional tables. Combine castle, memorial, wetland and a long farm lunch for the fullest Lezhë day.",
        "secondary_body_fr": "À l’intérieur, les vignes de Kallmet et les villages autour de Fishtë ont fait de Lezhë une référence nationale de l’agrotourisme. Vin de Kallmet, raki artisanal, laitages, viandes, légumes et poissons des lagunes passent directement des producteurs aux tables régionales. Associez château, mémorial, zone humide et long déjeuner fermier."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Northwest Albania", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "Apr–Oct", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "2–3 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "compass", "value": "History + coast", "label_en": "Character", "label_fr": "Caractère"},
      {"group": "weather", "icon": "sun", "value": "Hot and coastal", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Mild with rain", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "landmark", "label_en": "Lezhë Castle", "label_fr": "Château de Lezhë", "text_en": "Ancient layers and Drin panoramas", "text_fr": "Strates antiques et panoramas sur le Drin"},
      {"icon": "sparkles", "label_en": "Skanderbeg", "label_fr": "Skanderbeg", "text_en": "The League and national memorial", "text_fr": "La Ligue et le mémorial national"},
      {"icon": "binoculars", "label_en": "Kune–Vain", "label_fr": "Kune–Vain", "text_en": "Lagoon trails, birds and sunsets", "text_fr": "Sentiers, oiseaux et couchers de soleil"},
      {"icon": "sun", "label_en": "Shëngjin", "label_fr": "Shëngjin", "text_en": "Adriatic beaches and Rana e Hedhun", "text_fr": "Plages adriatiques et Rana e Hedhun"},
      {"icon": "wine", "label_en": "Kallmet + Fishtë", "label_fr": "Kallmet + Fishtë", "text_en": "Wine, farms and destination dining", "text_fr": "Vin, fermes et gastronomie de destination"}
    ]
  }
]
$destinations$::jsonb)
  loop
    asset_ids := '{}'::jsonb;

    for image_item in
      select value from jsonb_array_elements(destination->'images')
    loop
      insert into public.media_assets (
        source_kind,
        bucket_id,
        storage_path,
        public_url,
        mime_type,
        width,
        height,
        credit_name,
        credit_url,
        updated_at
      ) values (
        'url',
        null,
        null,
        image_item->>'url',
        'image/jpeg',
        (image_item->>'width')::integer,
        (image_item->>'height')::integer,
        image_item->>'credit_name',
        image_item->>'credit_url',
        now()
      )
      on conflict (public_url) do update set
        mime_type = excluded.mime_type,
        width = excluded.width,
        height = excluded.height,
        credit_name = excluded.credit_name,
        credit_url = excluded.credit_url,
        updated_at = now()
      returning id into current_asset_id;

      asset_ids := asset_ids || jsonb_build_object(image_item->>'key', current_asset_id::text);
    end loop;

    hero_asset_id := (asset_ids->>'hero')::uuid;
    culture_asset_id := (asset_ids->>'culture')::uuid;
    landscape_asset_id := (asset_ids->>'landscape')::uuid;

    select value into hero_image
    from jsonb_array_elements(destination->'images')
    where value->>'key' = 'hero';

    select value into culture_image
    from jsonb_array_elements(destination->'images')
    where value->>'key' = 'culture';

    select value into landscape_image
    from jsonb_array_elements(destination->'images')
    where value->>'key' = 'landscape';

    current_place_id := null;
    select p.id into current_place_id
    from public.places p
    join public.place_translations pt on pt.place_id = p.id and pt.locale = 'en'
    where p.kind = 'destination'
      and (
        pt.slug = destination->>'slug'
        or lower(pt.title) = lower(destination->>'title_en')
      )
    order by case when pt.slug = destination->>'slug' then 0 else 1 end
    limit 1;

    if current_place_id is null then
      current_place_id := gen_random_uuid();
    end if;

    insert into public.places (
      id,
      kind,
      parent_destination_id,
      status,
      featured,
      longitude,
      latitude,
      map_zoom,
      published_at,
      updated_at
    ) values (
      current_place_id,
      'destination',
      null,
      'published',
      true,
      (destination->>'longitude')::double precision,
      (destination->>'latitude')::double precision,
      (destination->>'map_zoom')::numeric,
      now(),
      now()
    )
    on conflict (id) do update set
      kind = 'destination',
      parent_destination_id = null,
      status = 'published',
      featured = true,
      longitude = excluded.longitude,
      latitude = excluded.latitude,
      map_zoom = excluded.map_zoom,
      published_at = coalesce(public.places.published_at, now()),
      updated_at = now();

    insert into public.place_translations (
      place_id,
      locale,
      slug,
      title,
      seo_title,
      seo_description,
      hero_intro,
      hero_alt,
      story_title,
      story_intro,
      updated_at
    ) values
      (
        current_place_id,
        'en',
        destination->>'slug',
        destination->>'title_en',
        destination->>'seo_title_en',
        destination->>'seo_description_en',
        destination->>'hero_intro_en',
        destination->>'hero_alt_en',
        destination->>'story_title_en',
        destination->>'story_intro_en',
        now()
      ),
      (
        current_place_id,
        'fr',
        destination->>'slug',
        destination->>'title_fr',
        destination->>'seo_title_fr',
        destination->>'seo_description_fr',
        destination->>'hero_intro_fr',
        destination->>'hero_alt_fr',
        destination->>'story_title_fr',
        destination->>'story_intro_fr',
        now()
      )
    on conflict (place_id, locale) do update set
      slug = excluded.slug,
      title = excluded.title,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      hero_intro = excluded.hero_intro,
      hero_alt = excluded.hero_alt,
      story_title = excluded.story_title,
      story_intro = excluded.story_intro,
      updated_at = now();

    delete from public.place_sections where place_id = current_place_id;

    for section_item in
      select value || jsonb_build_object('sort_order', ordinality - 1)
      from jsonb_array_elements(destination->'sections') with ordinality
    loop
      insert into public.place_sections (
        place_id,
        title_en,
        title_fr,
        body_en,
        body_fr,
        secondary_body_en,
        secondary_body_fr,
        image_alt_en,
        image_alt_fr,
        media_asset_id,
        sort_order
      ) values (
        current_place_id,
        section_item->>'title_en',
        section_item->>'title_fr',
        section_item->>'body_en',
        section_item->>'body_fr',
        section_item->>'secondary_body_en',
        section_item->>'secondary_body_fr',
        (
          select image_value->>'alt_en'
          from jsonb_array_elements(destination->'images') image_value
          where image_value->>'key' = section_item->>'image_key'
        ),
        (
          select image_value->>'alt_fr'
          from jsonb_array_elements(destination->'images') image_value
          where image_value->>'key' = section_item->>'image_key'
        ),
        (asset_ids->>(section_item->>'image_key'))::uuid,
        (section_item->>'sort_order')::smallint
      );
    end loop;

    delete from public.place_media where place_id = current_place_id;
    insert into public.place_media (
      place_id,
      asset_id,
      role,
      alt_en,
      alt_fr,
      sort_order
    ) values
      (current_place_id, hero_asset_id, 'hero', hero_image->>'alt_en', hero_image->>'alt_fr', 0),
      (current_place_id, hero_asset_id, 'card', hero_image->>'alt_en', hero_image->>'alt_fr', 0),
      -- The dedicated thumbnail drives og:image and social/search previews.
      (current_place_id, hero_asset_id, 'thumbnail', hero_image->>'alt_en', hero_image->>'alt_fr', 0),
      (current_place_id, culture_asset_id, 'gallery', culture_image->>'alt_en', culture_image->>'alt_fr', 0),
      (current_place_id, landscape_asset_id, 'gallery', landscape_image->>'alt_en', landscape_image->>'alt_fr', 1);

    delete from public.place_facts where place_id = current_place_id;
    for fact_item in
      select value || jsonb_build_object('sort_order', ordinality - 1)
      from jsonb_array_elements(destination->'facts') with ordinality
    loop
      insert into public.place_facts (
        place_id,
        group_key,
        icon_key,
        value,
        label_en,
        label_fr,
        sort_order
      ) values (
        current_place_id,
        fact_item->>'group',
        fact_item->>'icon',
        fact_item->>'value',
        fact_item->>'label_en',
        fact_item->>'label_fr',
        (fact_item->>'sort_order')::integer
      );
    end loop;

    delete from public.place_highlights where place_id = current_place_id;
    for highlight_item in
      select value || jsonb_build_object('sort_order', ordinality - 1)
      from jsonb_array_elements(destination->'highlights') with ordinality
    loop
      insert into public.place_highlights (
        place_id,
        icon_key,
        label_en,
        label_fr,
        text_en,
        text_fr,
        sort_order
      ) values (
        current_place_id,
        highlight_item->>'icon',
        highlight_item->>'label_en',
        highlight_item->>'label_fr',
        highlight_item->>'text_en',
        highlight_item->>'text_fr',
        (highlight_item->>'sort_order')::integer
      );
    end loop;

    -- Refresh generated itinerary links only. Manually curated admin links remain intact.
    delete from public.place_tours
    where place_id = current_place_id and source = 'itinerary';

    insert into public.place_tours (
      place_id,
      tour_id,
      relationship,
      source,
      visible,
      sort_order
    )
    select
      current_place_id,
      candidate.tour_id,
      'area',
      'itinerary',
      true,
      row_number() over (
        order by candidate.duration_rank, candidate.title, candidate.tour_id
      )::integer - 1
    from (
      select
        tis.tour_id,
        max(coalesce(nullif(tt.title, ''), nullif(tis.place_en, ''), 'Tour')) as title,
        min(case
          when t.duration_unit = 'hours'
            or (t.duration_unit = 'days' and t.duration_value <= 1)
          then 0
          else 1
        end) as duration_rank
      from public.tour_itinerary_stops tis
      join public.tours t on t.id = tis.tour_id
      left join public.tour_translations tt
        on tt.tour_id = tis.tour_id and tt.locale = 'en'
      where exists (
        select 1
        from jsonb_array_elements_text(destination->'tour_terms') term
        where lower(
          coalesce(tis.location_label, '') || ' ' ||
          coalesce(tis.place_en, '') || ' ' ||
          coalesce(tis.place_fr, '')
        ) like '%' || lower(term.value) || '%'
      )
      or (
        tis.longitude between
          (destination->>'longitude')::double precision - (destination->>'tour_radius')::double precision
          and (destination->>'longitude')::double precision + (destination->>'tour_radius')::double precision
        and tis.latitude between
          (destination->>'latitude')::double precision - (destination->>'tour_radius')::double precision
          and (destination->>'latitude')::double precision + (destination->>'tour_radius')::double precision
      )
      group by tis.tour_id
    ) candidate
    on conflict (place_id, tour_id) do nothing;
  end loop;
end
$seed_block$;

commit;

-- Expected result: six published destination pages at
-- /destinations/fier
-- /destinations/korce
-- /destinations/gjirokaster
-- /destinations/lushnje
-- /destinations/pogradec
-- /destinations/lezhe

select
  pt.slug,
  pt.title,
  pt.seo_title,
  p.status,
  count(distinct ps.id) as story_sections,
  count(distinct case when pm.role = 'thumbnail' then pm.id end) as seo_thumbnails
from public.places p
join public.place_translations pt on pt.place_id = p.id and pt.locale = 'en'
left join public.place_sections ps on ps.place_id = p.id
left join public.place_media pm on pm.place_id = p.id
where pt.slug in (
  'fier', 'korce', 'gjirokaster', 'lushnje', 'pogradec', 'lezhe'
)
group by pt.slug, pt.title, pt.seo_title, p.status
order by pt.slug;
