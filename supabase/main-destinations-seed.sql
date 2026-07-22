-- Wonder Albania: thirteen enriched destination pages in one idempotent seed.
-- Creates or updates Tirana, Vlora, Durres, Saranda, Shkoder, Kukes, Elbasan,
-- Fier, Korce, Gjirokaster, Lushnje, Pogradec and Lezhe.
--
-- Run once in the Supabase SQL editor AFTER these migrations:
--   202607220001_places_and_global_media.sql
--   202607220002_place_story_design_fields.sql
--   202607220003_place_seo_and_thumbnails.sql
--
-- Re-running is safe: matching destinations are updated, not duplicated.
-- Each destination has exactly three story sections, matching the layered
-- destination-detail design. Existing manual tour links are preserved.
--
-- SEO image note:
-- Each `thumbnail` is a landscape Wikimedia Commons image served at 2400px
-- wide (well above Google's 1200px recommendation). Keep future thumbnails
-- landscape, at least 1200px wide, representative of the page, and publicly
-- crawlable. Credits and source-page URLs are stored with every asset.
--
-- Editorial reference pages (Albanian National Tourism Agency):
-- https://akt.gov.al/en/cities/tirane/
-- https://akt.gov.al/en/cities/vlore/
-- https://akt.gov.al/en/cities/durres/
-- https://akt.gov.al/en/qytetet/sarande/
-- https://akt.gov.al/en/qytetet/shkoder/
-- https://akt.gov.al/en/qytetet/kukes/
-- https://akt.gov.al/en/cities/elbasan/
-- https://akt.gov.al/en/qytetet/fier/
-- https://akt.gov.al/en/qytetet/korce/
-- https://akt.gov.al/en/cities/gjirokaster/
-- https://akt.gov.al/en/qytetet/lushnje/
-- https://akt.gov.al/en/cities/pogradec/
-- https://akt.gov.al/en/qytetet/lezhe/

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
    "slug": "tirana",
    "title_en": "Tirana",
    "title_fr": "Tirana",
    "seo_title_en": "Tirana — Albania’s Colorful Capital | Wonder Albania",
    "seo_title_fr": "Tirana — La capitale colorée de l’Albanie | Wonder Albania",
    "seo_description_en": "Discover Tirana through Skanderbeg Square, the New Bazaar, museums, neighbourhood cafés and easy day trips to Dajti, with linked Albania tours.",
    "seo_description_fr": "Découvrez Tirana, la place Skanderbeg, le Nouveau Bazar, ses musées, ses cafés de quartier et les excursions vers Dajti, avec des circuits liés.",
    "hero_intro_en": "Albania’s energetic capital blends Ottoman traces, Italian-era boulevards, communist landmarks and a confident contemporary culture within one walkable centre.",
    "hero_intro_fr": "La capitale énergique de l’Albanie réunit traces ottomanes, boulevards de l’époque italienne, monuments communistes et culture contemporaine dans un centre facile à parcourir.",
    "hero_alt_en": "Skanderbeg Square and the centre of Tirana beneath a blue sky",
    "hero_alt_fr": "La place Skanderbeg et le centre de Tirana sous un ciel bleu",
    "story_title_en": "Three ways to experience Tirana",
    "story_title_fr": "Trois façons de vivre Tirana",
    "story_intro_en": "Begin with the civic heart, follow the city’s appetite through its markets and cafés, then read the changing architecture and landscapes that make Tirana more than a short stopover.",
    "story_intro_fr": "Commencez par le cœur civique, suivez l’appétit de la ville dans ses marchés et cafés, puis découvrez l’architecture et les paysages qui font de Tirana bien plus qu’une simple étape.",
    "longitude": 19.8187,
    "latitude": 41.3275,
    "map_zoom": 11.5,
    "tour_radius": 0.15,
    "tour_terms": ["tirana", "tiranë"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Skanderbeg%20Square%2C%20Tirana%20%2849593901587%29.jpg?width=2400",
        "width": 2400,
        "height": 1600,
        "credit_name": "Andrew Milligan sumo / Wikimedia Commons (CC BY 2.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Skanderbeg_Square,_Tirana_(49593901587).jpg",
        "alt_en": "Skanderbeg Square in central Tirana",
        "alt_fr": "La place Skanderbeg au centre de Tirana"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/New%20Bazaar%20%28Pazari%20i%20Ri%29%2C%20Tirana%2C%20Albania.jpg?width=2400",
        "width": 2400,
        "height": 1800,
        "credit_name": "Ridiculopathy / Wikimedia Commons (CC0 1.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:New_Bazaar_(Pazari_i_Ri),_Tirana,_Albania.jpg",
        "alt_en": "Colourful façades and cafés at Tirana’s New Bazaar",
        "alt_fr": "Façades colorées et cafés du Nouveau Bazar de Tirana"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bashkia%20e%20Tiran%C3%ABs.jpg?width=2400",
        "width": 2400,
        "height": 1595,
        "credit_name": "Francesco Crippa / Wikimedia Commons (CC BY 2.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Bashkia_e_Tiran%C3%ABs.jpg",
        "alt_en": "Tirana City Hall and the architecture around Skanderbeg Square",
        "alt_fr": "L’hôtel de ville de Tirana et l’architecture de la place Skanderbeg"
      }
    ],
    "sections": [
      {
        "image_key": "hero",
        "title_en": "The square where Albania tells its story",
        "title_fr": "La place où l’Albanie raconte son histoire",
        "body_en": "Skanderbeg Square is Tirana’s natural starting point. The broad pedestrian space gathers the National History Museum, the Et’hem Bey Mosque, the Clock Tower and monumental civic buildings around the equestrian figure of Albania’s national hero. Within a few minutes on foot, different centuries and political eras become visible side by side.",
        "body_fr": "La place Skanderbeg est le point de départ naturel de Tirana. Ce vaste espace piéton rassemble le Musée historique national, la mosquée Et’hem Bey, la Tour de l’Horloge et de grands édifices civiques autour de la statue équestre du héros national. En quelques minutes à pied, plusieurs siècles et régimes se lisent côte à côte.",
        "secondary_body_en": "Continue along the main boulevard to the Pyramid, Mother Teresa Square and the Blloku district. Bunk’Art 2 and the House of Leaves add essential context to the communist period, while converted public spaces show how quickly the capital is rewriting its identity.",
        "secondary_body_fr": "Poursuivez sur le grand boulevard vers la Pyramide, la place Mère-Teresa et le quartier de Blloku. Bunk’Art 2 et la Maison des Feuilles éclairent la période communiste, tandis que les espaces publics réinventés montrent à quelle vitesse la capitale redéfinit son identité."
      },
      {
        "image_key": "culture",
        "title_en": "Markets, coffee and life after sunset",
        "title_fr": "Marchés, café et vie après le coucher du soleil",
        "body_en": "At Pazari i Ri, fruit stalls, spice shops and small restaurants turn a historic market quarter into one of the city’s most sociable corners. Tirana’s café culture is not simply a break between sights: it is part of the city’s rhythm, from morning espresso to long evening conversations under the trees.",
        "body_fr": "À Pazari i Ri, étals de fruits, boutiques d’épices et petits restaurants transforment un ancien quartier marchand en l’un des lieux les plus conviviaux de la ville. La culture du café n’est pas une simple pause entre deux visites : elle rythme Tirana, de l’espresso matinal aux longues conversations du soir.",
        "secondary_body_en": "Taste byrek, grilled meats, seasonal vegetables and recipes shaped by every region of Albania. Blloku offers design shops, cocktail bars and late-night energy; quieter streets near the Lana River reveal neighbourhood bakeries, galleries and everyday capital life.",
        "secondary_body_fr": "Goûtez le byrek, les viandes grillées, les légumes de saison et des recettes venues de toutes les régions d’Albanie. Blloku réunit boutiques de créateurs, bars à cocktails et soirées animées ; les rues plus calmes près de la Lana dévoilent boulangeries, galeries et vie quotidienne."
      },
      {
        "image_key": "landscape",
        "title_en": "A changing capital with mountains on the horizon",
        "title_fr": "Une capitale en mouvement, face aux montagnes",
        "body_en": "Tirana’s painted façades, modern towers and rationalist landmarks create a cityscape that is still evolving. Look beyond the centre and Mount Dajti frames the eastern skyline, a reminder that cable-car viewpoints, forest walks and mountain restaurants sit within easy reach of the city.",
        "body_fr": "Les façades peintes, les tours contemporaines et les monuments rationalistes composent un paysage urbain en constante évolution. À l’est, le mont Dajti encadre l’horizon et rappelle que téléphérique, promenades en forêt, points de vue et restaurants de montagne restent proches du centre.",
        "secondary_body_en": "Use Tirana as a base for Kruja, Petrela Castle or central Albania’s lakes and countryside, but allow at least two full days for the capital itself. Early mornings favour museums and markets; late afternoons are best for parks, rooftop views and the evening promenade.",
        "secondary_body_fr": "Tirana est une bonne base pour Kruja, le château de Petrela, les lacs et la campagne du centre, mais réservez au moins deux journées à la capitale. Les matinées conviennent aux musées et marchés ; les fins d’après-midi aux parcs, terrasses panoramiques et promenades du soir."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Central Albania", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "Mar–Jun · Sep–Nov", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "2–3 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "navigation", "value": "Main air gateway", "label_en": "Access", "label_fr": "Accès"},
      {"group": "weather", "icon": "sun", "value": "Hot and bright", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Cool with rain", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "landmark", "label_en": "Civic heart", "label_fr": "Cœur civique", "text_en": "Skanderbeg Square, mosque and Clock Tower", "text_fr": "Place Skanderbeg, mosquée et Tour de l’Horloge"},
      {"icon": "home", "label_en": "Neighbourhood", "label_fr": "Quartier", "text_en": "Blloku’s cafés, design and nightlife", "text_fr": "Cafés, design et vie nocturne de Blloku"},
      {"icon": "sparkles", "label_en": "Market", "label_fr": "Marché", "text_en": "Local flavours at Pazari i Ri", "text_fr": "Saveurs locales à Pazari i Ri"},
      {"icon": "mountain", "label_en": "Day trip", "label_fr": "Excursion", "text_en": "Cable-car views from Mount Dajti", "text_fr": "Panoramas du mont Dajti en téléphérique"},
      {"icon": "camera", "label_en": "Museums", "label_fr": "Musées", "text_en": "History, surveillance and modern art", "text_fr": "Histoire, surveillance et art moderne"}
    ]
  },
  {
    "slug": "vlora",
    "title_en": "Vlora",
    "title_fr": "Vlorë",
    "seo_title_en": "Vlora — Where Two Seas Meet | Wonder Albania",
    "seo_title_fr": "Vlorë — Là où deux mers se rencontrent | Wonder Albania",
    "seo_description_en": "Explore Vlora’s independence history, restored old town, seafront and the meeting point of the Adriatic and Ionian, with nearby tours and nature escapes.",
    "seo_description_fr": "Explorez l’histoire de l’indépendance de Vlorë, sa vieille ville, son front de mer et la rencontre de l’Adriatique et de l’Ionienne, avec circuits et nature.",
    "hero_intro_en": "Vlora combines a foundational chapter of Albanian history with a long seafront, southern flavours and immediate access to lagoons, mountains and two different coastlines.",
    "hero_intro_fr": "Vlorë associe un chapitre fondateur de l’histoire albanaise à un long front de mer, aux saveurs du sud et à un accès direct aux lagunes, montagnes et deux littoraux.",
    "hero_alt_en": "Panoramic view across Vlora and its bay",
    "hero_alt_fr": "Vue panoramique sur Vlorë et sa baie",
    "story_title_en": "Three sides of Vlora",
    "story_title_fr": "Trois visages de Vlorë",
    "story_intro_en": "Trace the city’s independence story, settle into the rhythm of the waterfront, then use the bay as a launch point for some of southern Albania’s most varied landscapes.",
    "story_intro_fr": "Suivez le récit de l’indépendance, adoptez le rythme du front de mer, puis faites de la baie votre point de départ vers les paysages variés du sud albanais.",
    "longitude": 19.4897,
    "latitude": 40.4661,
    "map_zoom": 11.0,
    "tour_radius": 0.14,
    "tour_terms": ["vlora", "vlorë", "vlore"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Vlora%2C%20pohled%20na%20m%C4%9Bsto.jpg?width=2400",
        "width": 2400,
        "height": 1599,
        "credit_name": "Aktron / Wikimedia Commons (CC BY 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Vlora,_pohled_na_m%C4%9Bsto.jpg",
        "alt_en": "Vlora city, hills and the blue water of the bay",
        "alt_fr": "La ville de Vlorë, ses collines et les eaux bleues de la baie"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Rruga%20Justin%20Godart%202020.jpg?width=2400",
        "width": 2400,
        "height": 1595,
        "credit_name": "Albinfo / Wikimedia Commons (CC BY 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Rruga_Justin_Godart_2020.jpg",
        "alt_en": "Restored historic buildings on Justin Godard Street in Vlora",
        "alt_fr": "Bâtiments historiques restaurés de la rue Justin Godard à Vlorë"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Public%20Beach%20In%20Vlora.jpg?width=2400",
        "width": 2400,
        "height": 1348,
        "credit_name": "DenisaRucaj / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Public_Beach_In_Vlora.jpg",
        "alt_en": "Public beach and clear coastal water in Vlora",
        "alt_fr": "Plage publique et eau claire sur la côte de Vlorë"
      }
    ],
    "sections": [
      {
        "image_key": "culture",
        "title_en": "Independence, old streets and living heritage",
        "title_fr": "Indépendance, ruelles anciennes et patrimoine vivant",
        "body_en": "Vlora holds a singular place in the national story: Albania’s declaration of independence was proclaimed here in 1912. The Flag Square area and Independence Museum provide the historical frame, while the Muradie Mosque, attributed to the Ottoman architect Sinan, carries the story further back.",
        "body_fr": "Vlorë occupe une place unique dans l’histoire nationale : l’indépendance de l’Albanie y fut proclamée en 1912. La place du Drapeau et le Musée de l’Indépendance en donnent le cadre, tandis que la mosquée Muradie, attribuée à l’architecte ottoman Sinan, remonte plus loin dans le temps.",
        "secondary_body_en": "The restored old-town streets around Justin Godard are made for a slower walk between colourful façades, small cafés, craft shops and shaded courtyards. Visit in the morning for detail and atmosphere, then return after dark when the pedestrian lanes fill with local life.",
        "secondary_body_fr": "Les rues restaurées de la vieille ville autour de Justin Godard invitent à marcher lentement entre façades colorées, petits cafés, ateliers et cours ombragées. Venez le matin pour les détails, puis revenez le soir lorsque les voies piétonnes s’animent."
      },
      {
        "image_key": "hero",
        "title_en": "A waterfront shaped by two seas",
        "title_fr": "Un front de mer façonné par deux mers",
        "body_en": "Vlora Bay sits where the Adriatic coast begins to turn toward the Ionian. The Lungomare promenade connects city beaches, cafés, restaurants and sunset viewpoints, giving the city a holiday rhythm without separating visitors from everyday urban life.",
        "body_fr": "La baie de Vlorë se trouve là où la côte adriatique commence à s’orienter vers l’Ionienne. La promenade du Lungomare relie plages urbaines, cafés, restaurants et points de vue au coucher du soleil, donnant à la ville un air de vacances sans l’isoler de la vie quotidienne.",
        "secondary_body_en": "Seafood is central here: look for grilled fish, mussels, octopus and simple plates built around olive oil and local produce. The waterfront is longest and liveliest in the evening, while early mornings bring calmer water and space for walking or swimming.",
        "secondary_body_fr": "Les produits de la mer occupent une place centrale : poissons grillés, moules, poulpe et assiettes simples à l’huile d’olive et aux produits locaux. Le front de mer est le plus animé le soir ; le matin offre une eau plus calme pour marcher ou nager."
      },
      {
        "image_key": "landscape",
        "title_en": "Lagoons, headlands and the road south",
        "title_fr": "Lagunes, caps et route vers le sud",
        "body_en": "Beyond the city, Narta Lagoon and Zvërnec Island offer wetlands, birdlife and a monastery reached by a wooden footbridge. Across the bay, the Karaburun Peninsula and Sazan Island open a wilder maritime landscape of coves, cliffs and clear water best explored by organised boat trip.",
        "body_fr": "Au-delà de la ville, la lagune de Narta et l’île de Zvërnec offrent zones humides, oiseaux et un monastère accessible par une passerelle en bois. Face à la baie, la péninsule de Karaburun et l’île de Sazan dévoilent criques, falaises et eaux limpides, à explorer en bateau organisé.",
        "secondary_body_en": "Vlora is also the hinge between central Albania and the Riviera. The coastal road climbs toward Llogara Pass before descending to villages and beaches farther south, making the city a practical base for boat days, mountain viewpoints and longer journeys along the Ionian shore.",
        "secondary_body_fr": "Vlorë est aussi la charnière entre le centre du pays et la Riviera. La route côtière monte vers le col de Llogara avant de redescendre vers villages et plages, faisant de la ville une base pratique pour sorties en bateau, panoramas de montagne et itinéraires ioniennes."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Southwest coast", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "Apr–Oct", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "2–4 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "compass", "value": "Adriatic + Ionian", "label_en": "Coast", "label_fr": "Littoral"},
      {"group": "weather", "icon": "sun", "value": "Hot and dry", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Mild and changeable", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "landmark", "label_en": "History", "label_fr": "Histoire", "text_en": "Birthplace of Albanian independence", "text_fr": "Berceau de l’indépendance albanaise"},
      {"icon": "footprints", "label_en": "Old town", "label_fr": "Vieille ville", "text_en": "Restored lanes and colourful façades", "text_fr": "Ruelles restaurées et façades colorées"},
      {"icon": "sunset", "label_en": "Lungomare", "label_fr": "Lungomare", "text_en": "Long waterfront evenings by the bay", "text_fr": "Longues soirées sur le front de mer"},
      {"icon": "binoculars", "label_en": "Nature", "label_fr": "Nature", "text_en": "Narta Lagoon and Zvërnec Island", "text_fr": "Lagune de Narta et île de Zvërnec"},
      {"icon": "navigation", "label_en": "Boat days", "label_fr": "Bateau", "text_en": "Karaburun coves and Sazan Island", "text_fr": "Criques de Karaburun et île de Sazan"}
    ]
  },
  {
    "slug": "durres",
    "title_en": "Durrës",
    "title_fr": "Durrës",
    "seo_title_en": "Durrës — Albania’s Ancient Adriatic Port | Wonder Albania",
    "seo_title_fr": "Durrës — Le port antique de l’Adriatique | Wonder Albania",
    "seo_description_en": "Explore Durrës from its Roman amphitheatre and Byzantine walls to the Adriatic promenade, beaches and seafood, with destination-linked Albania tours.",
    "seo_description_fr": "Explorez Durrës, de l’amphithéâtre romain et des remparts byzantins à la promenade adriatique, aux plages et aux fruits de mer, avec circuits liés.",
    "hero_intro_en": "One of the Adriatic’s oldest port cities brings Roman archaeology, Byzantine walls, seafront promenades and relaxed beach life together less than an hour from Tirana.",
    "hero_intro_fr": "L’une des plus anciennes villes portuaires de l’Adriatique réunit archéologie romaine, remparts byzantins, promenades maritimes et plages à proximité de Tirana.",
    "hero_alt_en": "The waterfront promenade and Adriatic coast at Durrës",
    "hero_alt_fr": "La promenade maritime et la côte adriatique à Durrës",
    "story_title_en": "Three layers of Durrës",
    "story_title_fr": "Trois strates de Durrës",
    "story_intro_en": "Follow a city that has faced the Adriatic for more than two millennia, moving from buried monuments and old walls to the harbour promenade and the broad beaches beyond it.",
    "story_intro_fr": "Découvrez une ville tournée vers l’Adriatique depuis plus de deux millénaires, des monuments enfouis et vieux remparts à la promenade du port et aux grandes plages voisines.",
    "longitude": 19.4465,
    "latitude": 41.3231,
    "map_zoom": 11.5,
    "tour_radius": 0.12,
    "tour_terms": ["durres", "durrës", "dyrrachium", "dyrrhachium"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Seafront%20Promenade%2C%20Durr%C3%ABs%2C%20Albania%20%2849817338482%29.jpg?width=2400",
        "width": 2400,
        "height": 1600,
        "credit_name": "Andrew Milligan sumo / Wikimedia Commons (CC BY 2.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Seafront_Promenade,_Durr%C3%ABs,_Albania_(49817338482).jpg",
        "alt_en": "Durrës seafront promenade beside the Adriatic",
        "alt_fr": "Promenade maritime de Durrës au bord de l’Adriatique"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Amphitheatre%20of%20Durr%C3%ABs%2001.jpg?width=2400",
        "width": 2400,
        "height": 1590,
        "credit_name": "Carole Raddato / Wikimedia Commons (CC BY-SA 2.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Amphitheatre_of_Durr%C3%ABs_01.jpg",
        "alt_en": "Stone seating and ruins of the Roman amphitheatre of Durrës",
        "alt_fr": "Gradins de pierre et ruines de l’amphithéâtre romain de Durrës"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Durr%C3%ABs%20seafront%20promenade%20%28Albania%29%2023.jpg?width=2400",
        "width": 2400,
        "height": 1350,
        "credit_name": "GentiBehramaj / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Durr%C3%ABs_seafront_promenade_(Albania)_23.jpg",
        "alt_en": "Modern Durrës promenade and the Adriatic at sunset",
        "alt_fr": "Promenade moderne de Durrës et Adriatique au coucher du soleil"
      }
    ],
    "sections": [
      {
        "image_key": "culture",
        "title_en": "From Epidamnos to the Via Egnatia",
        "title_fr": "D’Epidamnos à la Via Egnatia",
        "body_en": "Known in antiquity as Epidamnos and later Dyrrachium, Durrës became a strategic Adriatic gateway and the western starting point of the Via Egnatia. Its Roman amphitheatre, partly embedded in the modern city, is the largest known in the Balkans and preserves a small chapel with rare mosaics.",
        "body_fr": "Connue dans l’Antiquité sous les noms d’Epidamnos puis Dyrrachium, Durrës devint une porte stratégique de l’Adriatique et le départ occidental de la Via Egnatia. Son amphithéâtre romain, intégré à la ville actuelle, est le plus grand connu des Balkans et conserve une chapelle ornée de mosaïques.",
        "secondary_body_en": "Nearby Byzantine walls, the Venetian Tower and archaeological finds compress centuries into a compact walking route. Allow time for the Archaeological Museum and for streets where fragments of the ancient city appear between apartments, cafés and the working port.",
        "secondary_body_fr": "Les remparts byzantins, la Tour vénitienne et les découvertes archéologiques condensent les siècles dans un parcours compact. Prévoyez le Musée archéologique et les rues où des fragments de la cité antique surgissent entre immeubles, cafés et port actif."
      },
      {
        "image_key": "hero",
        "title_en": "A port city that lives outdoors",
        "title_fr": "Une ville portuaire qui vit dehors",
        "body_en": "The seafront promenade is Durrës’s contemporary living room. Palm-lined paths, the harbour, public art and open views across the Adriatic create an easy route from the old centre toward the water, especially atmospheric during the evening xhiro when residents come out to walk.",
        "body_fr": "La promenade maritime est le salon contemporain de Durrës. Allées bordées de palmiers, port, art public et vues sur l’Adriatique forment un parcours naturel du centre ancien vers la mer, particulièrement vivant lors du xhiro du soir.",
        "secondary_body_en": "Restaurants draw directly on the city’s maritime character, serving fish, shellfish, risotto and pasta alongside Albanian staples. Rooftops and waterfront terraces are excellent at sunset, but the back streets reward visitors with bakeries, neighbourhood cafés and a less polished view of port-city life.",
        "secondary_body_fr": "Les restaurants puisent dans l’identité maritime avec poissons, coquillages, risotto et pâtes, aux côtés des classiques albanais. Terrasses et toits sont parfaits au coucher du soleil ; les rues arrière révèlent boulangeries, cafés de quartier et une vie portuaire plus authentique."
      },
      {
        "image_key": "landscape",
        "title_en": "Beaches, sunsets and an easy coastal base",
        "title_fr": "Plages, couchers de soleil et base côtière facile",
        "body_en": "South of the historic centre, long sandy beaches extend through the resort districts of Plazh and Golem. Their shallow Adriatic water and broad shore suit relaxed swimming days, families and travellers who want a coastal stay without giving up quick access to a major city.",
        "body_fr": "Au sud du centre historique, de longues plages de sable s’étendent vers Plazh et Golem. Les eaux peu profondes de l’Adriatique et le large rivage conviennent aux baignades tranquilles, aux familles et aux voyageurs souhaitant la mer sans renoncer à l’accès rapide à une grande ville.",
        "secondary_body_en": "Durrës works well as a first or final stop around Tirana airport, yet it deserves more than a transit night. Pair one archaeology-focused day with a slower beach or waterfront day, or use the city for excursions toward Cape Rodon, wineries and the historic towns of central Albania.",
        "secondary_body_fr": "Durrës fonctionne bien comme première ou dernière étape près de l’aéroport de Tirana, mais mérite mieux qu’une nuit de transit. Associez une journée archéologique à une journée de plage, ou partez vers le cap Rodon, les domaines viticoles et les villes historiques du centre."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Adriatic coast", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "Apr–Oct", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "1–3 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "route", "value": "Via Egnatia", "label_en": "Ancient route", "label_fr": "Route antique"},
      {"group": "weather", "icon": "sun", "value": "Hot and sunny", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Mild and damp", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "landmark", "label_en": "Antiquity", "label_fr": "Antiquité", "text_en": "Roman amphitheatre and ancient mosaics", "text_fr": "Amphithéâtre romain et mosaïques antiques"},
      {"icon": "route", "label_en": "Crossroads", "label_fr": "Carrefour", "text_en": "Western gateway of the Via Egnatia", "text_fr": "Porte occidentale de la Via Egnatia"},
      {"icon": "footprints", "label_en": "Promenade", "label_fr": "Promenade", "text_en": "Harbour walks and evening xhiro", "text_fr": "Port et xhiro du soir"},
      {"icon": "sun", "label_en": "Beaches", "label_fr": "Plages", "text_en": "Long sandy Adriatic shoreline", "text_fr": "Long littoral sablonneux de l’Adriatique"},
      {"icon": "utensils", "label_en": "Flavours", "label_fr": "Saveurs", "text_en": "Fresh seafood in a working port", "text_fr": "Produits de la mer dans un port actif"}
    ]
  },
  {
    "slug": "saranda",
    "title_en": "Saranda",
    "title_fr": "Saranda",
    "seo_title_en": "Saranda — Gateway to the Albanian Riviera | Wonder Albania",
    "seo_title_fr": "Saranda — La porte de la Riviera albanaise | Wonder Albania",
    "seo_description_en": "Plan Saranda with its Ionian promenade, Lëkurësi views, Butrint, Ksamil and the Blue Eye, plus destination-linked Riviera tours and practical highlights.",
    "seo_description_fr": "Préparez Saranda avec sa promenade ionienne, Lëkurësi, Butrint, Ksamil et l’Œil Bleu, ainsi que des circuits liés sur la Riviera albanaise.",
    "hero_intro_en": "Facing Corfu across a bright Ionian bay, Saranda is both a lively seaside city and the practical gateway to Butrint, Ksamil and Albania’s southern Riviera.",
    "hero_intro_fr": "Face à Corfou, de l’autre côté d’une baie ionienne lumineuse, Saranda est à la fois une ville balnéaire animée et la porte de Butrint, Ksamil et de la Riviera du sud.",
    "hero_alt_en": "Saranda’s curved Ionian coastline and hillside city",
    "hero_alt_fr": "Le littoral ionien incurvé de Saranda et la ville sur les collines",
    "story_title_en": "Three perspectives on Saranda",
    "story_title_fr": "Trois perspectives sur Saranda",
    "story_intro_en": "Start with the bay and its evening promenade, climb for the longer historical view, then connect the city to the archaeological sites, springs, islands and beaches that surround it.",
    "story_intro_fr": "Commencez par la baie et sa promenade du soir, prenez de la hauteur pour lire l’histoire, puis reliez la ville aux sites archéologiques, sources, îles et plages environnantes.",
    "longitude": 20.0050,
    "latitude": 39.8750,
    "map_zoom": 11.5,
    "tour_radius": 0.12,
    "tour_terms": ["saranda", "sarandë", "sarande"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Saranda%20Coast.jpg?width=2400",
        "width": 2400,
        "height": 1800,
        "credit_name": "NestedLoops / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Saranda_Coast.jpg",
        "alt_en": "Saranda’s waterfront curving around the Ionian bay",
        "alt_fr": "Le front de mer de Saranda autour de la baie ionienne"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Sarand%C3%AB%20harbour.jpg?width=2400",
        "width": 2400,
        "height": 1800,
        "credit_name": "Radosław Botev / Wikimedia Commons (CC BY 3.0 PL)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Sarand%C3%AB_harbour.jpg",
        "alt_en": "Boats and waterfront buildings at Saranda harbour",
        "alt_fr": "Bateaux et bâtiments du front de mer au port de Saranda"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/L%C3%ABkur%C3%ABsi%20Castle%2C%20Saranda%2C%20Albania%202015-09-25%2001.jpg?width=2400",
        "width": 2400,
        "height": 1590,
        "credit_name": "Pasztilla / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:L%C3%ABkur%C3%ABsi_Castle,_Saranda,_Albania_2015-09-25_01.jpg",
        "alt_en": "Stone walls of Lëkurësi Castle above Saranda",
        "alt_fr": "Murs de pierre du château de Lëkurësi au-dessus de Saranda"
      }
    ],
    "sections": [
      {
        "image_key": "hero",
        "title_en": "An Ionian city built around the bay",
        "title_fr": "Une ville ionienne construite autour de la baie",
        "body_en": "Saranda opens in a broad curve toward Corfu, with a palm-lined promenade connecting the port, city beaches, cafés and restaurants. The water is never far from view, and the daily ferry traffic gives the city an outward-looking character that feels both Albanian and unmistakably Mediterranean.",
        "body_fr": "Saranda s’ouvre en large courbe face à Corfou. Une promenade bordée de palmiers relie port, plages urbaines, cafés et restaurants. L’eau reste toujours visible et le trafic quotidien des ferries donne à la ville un caractère ouvert, à la fois albanais et profondément méditerranéen.",
        "secondary_body_en": "Walk the waterfront early, before beach traffic builds, or join the evening promenade when the whole bay lights up. Restaurants range from simple fish taverns to modern terraces; seek out mussels from nearby Butrint Lake, grilled seafood and southern Albanian dishes influenced by Greece.",
        "secondary_body_fr": "Parcourez le front de mer tôt, avant l’affluence des plages, ou rejoignez la promenade du soir quand la baie s’illumine. Des tavernes aux terrasses modernes, goûtez les moules du lac de Butrint, les poissons grillés et les recettes du sud marquées par la Grèce."
      },
      {
        "image_key": "landscape",
        "title_en": "Hilltop views and deeper history",
        "title_fr": "Panoramas en hauteur et histoire profonde",
        "body_en": "Lëkurësi Castle rises above the city with a complete view of Saranda, Corfu, the islands of Ksamil and the surrounding mountains. Its strategic position makes the geography immediately clear and turns sunset into one of the destination’s defining experiences.",
        "body_fr": "Le château de Lëkurësi domine la ville et offre une vue complète sur Saranda, Corfou, les îlots de Ksamil et les montagnes. Sa position stratégique rend la géographie immédiatement lisible et fait du coucher de soleil une expérience emblématique.",
        "secondary_body_en": "Saranda’s history reaches beyond the castle. The remains of the ancient synagogue sit within the modern centre, while the Monastery of the Forty Saints on the opposite ridge recalls the settlement that gave the city its present name. Together they add depth to a place often seen only through its beaches.",
        "secondary_body_fr": "L’histoire de Saranda dépasse le château. Les vestiges de la synagogue antique se trouvent dans le centre moderne, tandis que le monastère des Quarante-Saints, sur la crête opposée, rappelle l’origine du nom actuel. Ils donnent de la profondeur à une destination souvent réduite à ses plages."
      },
      {
        "image_key": "culture",
        "title_en": "The base for Butrint, Ksamil and the Blue Eye",
        "title_fr": "La base pour Butrint, Ksamil et l’Œil Bleu",
        "body_en": "South of Saranda, UNESCO-listed Butrint layers Greek, Roman, Byzantine and Venetian remains within a wooded lagoon landscape. Ksamil’s pale coves and small islands lie on the same route, making archaeology and swimming an unusually easy combination when the day is planned outside peak traffic.",
        "body_fr": "Au sud, Butrint, inscrit à l’UNESCO, superpose vestiges grecs, romains, byzantins et vénitiens dans un paysage boisé de lagune. Les criques claires et îlots de Ksamil sont sur le même itinéraire, permettant d’associer facilement archéologie et baignade hors des heures de pointe.",
        "secondary_body_en": "Inland, the Blue Eye spring and villages of the Drinos Valley offer a cooler counterpoint to the coast. Saranda can anchor three to five days of varied travel, but reserve transport in high summer and start popular excursions early for a calmer, more rewarding visit.",
        "secondary_body_fr": "À l’intérieur, la source de l’Œil Bleu et les villages de la vallée du Drinos offrent un contraste plus frais. Saranda peut servir de base pendant trois à cinq jours, mais réservez vos transports en plein été et partez tôt vers les sites les plus fréquentés."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Southern Ionian", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "May–Oct", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "3–5 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "navigation", "value": "Ferries to Corfu", "label_en": "Connection", "label_fr": "Liaison"},
      {"group": "weather", "icon": "sun", "value": "Hot and dry", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Mild with rain", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "sunset", "label_en": "Waterfront", "label_fr": "Front de mer", "text_en": "Ionian sunsets facing Corfu", "text_fr": "Couchers de soleil ionien face à Corfou"},
      {"icon": "landmark", "label_en": "World heritage", "label_fr": "Patrimoine mondial", "text_en": "Ancient Butrint in its lagoon landscape", "text_fr": "Butrint antique dans son paysage de lagune"},
      {"icon": "sun", "label_en": "Beaches", "label_fr": "Plages", "text_en": "Clear coves and islands around Ksamil", "text_fr": "Criques claires et îlots de Ksamil"},
      {"icon": "mountain", "label_en": "Viewpoint", "label_fr": "Panorama", "text_en": "Lëkurësi Castle above the bay", "text_fr": "Château de Lëkurësi au-dessus de la baie"},
      {"icon": "sparkles", "label_en": "Fresh water", "label_fr": "Source", "text_en": "The deep-blue spring at the Blue Eye", "text_fr": "La source bleu profond de l’Œil Bleu"}
    ]
  },
  {
    "slug": "shkoder",
    "title_en": "Shkodër",
    "title_fr": "Shkodër",
    "seo_title_en": "Shkodër — Albania’s City of Culture and Lakes | Wonder Albania",
    "seo_title_fr": "Shkodër — La ville de culture et de lacs | Wonder Albania",
    "seo_description_en": "Discover Shkodër through Rozafa Castle, Gjuhadol, Marubi photography, Lake Shkodër and the gateway to the Albanian Alps, with linked tours.",
    "seo_description_fr": "Découvrez Shkodër, le château de Rozafa, Gjuhadol, la photographie Marubi, le lac et la porte des Alpes albanaises, avec des circuits liés.",
    "hero_intro_en": "Shkodër is a northern cultural capital shaped by castle legends, rivers, lake light, religious diversity and the mountain routes leading into the Albanian Alps.",
    "hero_intro_fr": "Shkodër est une capitale culturelle du nord, façonnée par les légendes du château, les rivières, la lumière du lac, la diversité religieuse et les routes vers les Alpes albanaises.",
    "hero_alt_en": "Shkodër, its rivers and mountains seen from Rozafa Castle",
    "hero_alt_fr": "Shkodër, ses rivières et ses montagnes vues depuis le château de Rozafa",
    "story_title_en": "Three routes into Shkodër",
    "story_title_fr": "Trois chemins pour comprendre Shkodër",
    "story_intro_en": "Climb to the legendary fortress, explore the creative streets and archives of the centre, then follow the water toward the lake or the roads that begin Albania’s great northern journeys.",
    "story_intro_fr": "Montez à la forteresse légendaire, explorez les rues créatives et les archives du centre, puis suivez l’eau vers le lac ou les routes des grands voyages du nord albanais.",
    "longitude": 19.5126,
    "latitude": 42.0683,
    "map_zoom": 11.2,
    "tour_radius": 0.14,
    "tour_terms": ["shkoder", "shkodër", "shkodra"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Shkodra%20from%20Rozafa%20Castle.jpg?width=2400",
        "width": 2400,
        "height": 1800,
        "credit_name": "Artemiss.B / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Shkodra_from_Rozafa_Castle.jpg",
        "alt_en": "Shkodër and its waterways viewed from Rozafa Castle",
        "alt_fr": "Shkodër et ses cours d’eau vus depuis le château de Rozafa"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Shkod%C3%ABr%2C%20Albania%20%E2%80%93%20Rruga%20Gjuhadol%202018-05%2001.jpg?width=2400",
        "width": 2400,
        "height": 1590,
        "credit_name": "Pasztilla / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Shkod%C3%ABr,_Albania_%E2%80%93_Rruga_Gjuhadol_2018-05_01.jpg",
        "alt_en": "Historic façades and pedestrians on Gjuhadol Street in Shkodër",
        "alt_fr": "Façades historiques et passants dans la rue Gjuhadol à Shkodër"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Peaceful%20Shkodra%20lake%20view.jpg?width=2400",
        "width": 2400,
        "height": 1600,
        "credit_name": "Anna Ilieva-Alikaj / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Peaceful_Shkodra_lake_view.jpg",
        "alt_en": "Calm water and mountains at Lake Shkodër",
        "alt_fr": "Eaux calmes et montagnes du lac de Shkodër"
      }
    ],
    "sections": [
      {
        "image_key": "hero",
        "title_en": "Rozafa above three rivers",
        "title_fr": "Rozafa au-dessus de trois rivières",
        "body_en": "Rozafa Castle occupies the rocky height where the Buna and Drin meet near the Kir. The fortress has Illyrian foundations and later Roman, Venetian and Ottoman layers, but its most enduring story is the legend of Rozafa, whose sacrifice is woven into Albanian oral tradition.",
        "body_fr": "Le château de Rozafa occupe l’éperon rocheux où la Buna et le Drin se rencontrent près du Kir. La forteresse possède des fondations illyriennes et des strates romaines, vénitiennes et ottomanes, mais son récit le plus durable reste la légende du sacrifice de Rozafa.",
        "secondary_body_en": "From the walls, the whole geography of northern Albania opens at once: Shkodër, the lake, river plains and the first mountain ridges. Visit early or late for softer light and cooler paths, then continue to the Lead Mosque and old neighbourhoods below the castle.",
        "secondary_body_fr": "Depuis les remparts, toute la géographie du nord se révèle : Shkodër, le lac, les plaines fluviales et les premiers reliefs. Venez tôt ou tard pour une lumière douce, puis poursuivez vers la Mosquée de Plomb et les anciens quartiers au pied du château."
      },
      {
        "image_key": "culture",
        "title_en": "Photography, faith and the streets of Gjuhadol",
        "title_fr": "Photographie, religions et rues de Gjuhadol",
        "body_en": "Shkodër has long been one of Albania’s centres of literature, music and visual culture. The Marubi National Museum of Photography preserves a remarkable archive beginning in the nineteenth century, turning portraits, street scenes and historical events into an intimate record of Albanian life.",
        "body_fr": "Shkodër est depuis longtemps un centre albanais de littérature, musique et culture visuelle. Le Musée national de la photographie Marubi conserve des archives remarquables depuis le XIXe siècle, transformant portraits, scènes de rue et événements historiques en mémoire intime du pays.",
        "secondary_body_en": "Around pedestrian Gjuhadol, restored houses, galleries and cafés sit close to the Ebu Bekr Mosque, Franciscan Church and Catholic Cathedral. This proximity reflects the religious coexistence central to the city’s identity. Rent a bicycle to follow Shkodër’s flat streets at a local pace.",
        "secondary_body_fr": "Autour de la rue piétonne Gjuhadol, maisons restaurées, galeries et cafés voisinent avec la mosquée Ebu Bekr, l’église franciscaine et la cathédrale catholique. Cette proximité incarne la coexistence religieuse de la ville. Le vélo permet d’en suivre le rythme local."
      },
      {
        "image_key": "landscape",
        "title_en": "Lake light and the road to the Alps",
        "title_fr": "Lumière du lac et route vers les Alpes",
        "body_en": "Lake Shkodër spreads west of the city, shared with Montenegro and edged by wetlands, fishing villages and mountain silhouettes. The lakeside route toward Shiroka and Zogaj is ideal for cycling, sunset walks and unhurried meals built around carp, eel and local wine.",
        "body_fr": "Le lac de Shkodër s’étend à l’ouest, partagé avec le Monténégro et bordé de zones humides, villages de pêcheurs et silhouettes montagneuses. La route vers Shiroka et Zogaj convient au vélo, aux promenades au coucher du soleil et aux repas de carpe, anguille et vin local.",
        "secondary_body_en": "For many travellers, Shkodër is also the logistical doorway to Theth, the Valbona Valley and the Accursed Mountains. Spend time in the city before or after the trek: its museums, food and evening life provide cultural context for the northern landscapes rather than merely a place to change buses.",
        "secondary_body_fr": "Pour beaucoup, Shkodër est aussi la porte logistique de Theth, de la vallée de Valbona et des Montagnes Maudites. Prenez le temps d’y séjourner avant ou après la randonnée : musées, cuisine et soirées donnent un contexte culturel aux paysages du nord."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Northwest Albania", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "Apr–Oct", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "2–4 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "mountain", "value": "Albanian Alps", "label_en": "Gateway", "label_fr": "Porte vers"},
      {"group": "weather", "icon": "sun", "value": "Hot and clear", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Cool and rainy", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "landmark", "label_en": "Fortress", "label_fr": "Forteresse", "text_en": "Rozafa legends and sweeping river views", "text_fr": "Légende de Rozafa et vues sur les rivières"},
      {"icon": "camera", "label_en": "Marubi", "label_fr": "Marubi", "text_en": "A pioneering national photo archive", "text_fr": "Archives pionnières de la photographie albanaise"},
      {"icon": "footprints", "label_en": "Gjuhadol", "label_fr": "Gjuhadol", "text_en": "Pedestrian lanes and restored houses", "text_fr": "Rues piétonnes et maisons restaurées"},
      {"icon": "sunset", "label_en": "The lake", "label_fr": "Le lac", "text_en": "Cycling and dining toward Shiroka", "text_fr": "Vélo et cuisine vers Shiroka"},
      {"icon": "mountain", "label_en": "The Alps", "label_fr": "Les Alpes", "text_en": "Starting point for Theth and Valbona", "text_fr": "Départ vers Theth et Valbona"}
    ]
  },
  {
    "slug": "kukes",
    "title_en": "Kukës",
    "title_fr": "Kukës",
    "seo_title_en": "Kukës — Gateway to Albania’s Wild Northeast | Wonder Albania",
    "seo_title_fr": "Kukës — La porte du nord-est sauvage | Wonder Albania",
    "seo_description_en": "Explore Kukës between Fierza Lake and Mount Gjallica, discover northeast Albanian culture, mountain villages and linked tours near the Kosovo border.",
    "seo_description_fr": "Explorez Kukës entre le lac de Fierza et le mont Gjallica, la culture du nord-est, les villages de montagne et les circuits près du Kosovo.",
    "hero_intro_en": "Set between reservoir waters and the steep profile of Mount Gjallica, Kukës is a resilient modern city and a gateway to Albania’s least-travelled mountain northeast.",
    "hero_intro_fr": "Installée entre les eaux du réservoir et le profil abrupt du mont Gjallica, Kukës est une ville moderne et résiliente, porte du nord-est montagneux encore peu parcouru.",
    "hero_alt_en": "Kukës city beneath Mount Gjallica in northeast Albania",
    "hero_alt_fr": "La ville de Kukës sous le mont Gjallica, au nord-est de l’Albanie",
    "story_title_en": "Three ways to discover Kukës",
    "story_title_fr": "Trois façons de découvrir Kukës",
    "story_intro_en": "Understand the city that moved uphill, follow the Drin waters through a dramatic engineered landscape, then continue into highland villages where hospitality and mountain traditions remain central.",
    "story_intro_fr": "Comprenez la ville déplacée sur les hauteurs, suivez les eaux du Drin dans un paysage spectaculaire, puis rejoignez les villages où hospitalité et traditions montagnardes restent essentielles.",
    "longitude": 20.4210,
    "latitude": 42.0767,
    "map_zoom": 11.0,
    "tour_radius": 0.16,
    "tour_terms": ["kukes", "kukës", "kukësi"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Gjallica%20dhe%20qyteti%20Kukes.JPG?width=2400",
        "width": 2400,
        "height": 1600,
        "credit_name": "Visar Kola / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Gjallica_dhe_qyteti_Kukes.JPG",
        "alt_en": "Mount Gjallica rising behind the city of Kukës",
        "alt_fr": "Le mont Gjallica s’élevant derrière la ville de Kukës"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Lake%20Fierza%20at%20Kuk%C3%ABs%20%28WPWTR17%29.jpg?width=2400",
        "width": 2400,
        "height": 1595,
        "credit_name": "Albinfo / Wikimedia Commons (CC BY 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Lake_Fierza_at_Kuk%C3%ABs_(WPWTR17).jpg",
        "alt_en": "Fierza Lake and mountain slopes beside Kukës",
        "alt_fr": "Le lac de Fierza et les versants montagneux près de Kukës"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Kuk%C3%ABs%20Bridge%20is%20a%20vehicular%20structure%20spanning%20the%20Black%20Drin%20River%20in%20the%20city%20of%20Kuk%C3%ABs%2C%20northern%20Albania.jpg?width=2400",
        "width": 2400,
        "height": 1801,
        "credit_name": "Julianruizp / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:The_Kuk%C3%ABs_Bridge_is_a_vehicular_structure_spanning_the_Black_Drin_River_in_the_city_of_Kuk%C3%ABs,_northern_Albania.jpg",
        "alt_en": "Kukës Bridge spanning the Black Drin in a mountain landscape",
        "alt_fr": "Le pont de Kukës franchissant le Drin noir dans un paysage montagneux"
      }
    ],
    "sections": [
      {
        "image_key": "hero",
        "title_en": "A city rebuilt above the water",
        "title_fr": "Une ville reconstruite au-dessus des eaux",
        "body_en": "Modern Kukës was built on higher ground after the original town was submerged during the creation of the Fierza reservoir in the 1970s. That unusual history explains its broad plan, open viewpoints and strong relationship with the water and mountains on every side.",
        "body_fr": "La ville moderne de Kukës fut construite sur les hauteurs après l’engloutissement de l’ancienne cité lors de la création du réservoir de Fierza dans les années 1970. Cette histoire explique son plan ouvert, ses belvédères et son lien constant avec l’eau et les montagnes.",
        "secondary_body_en": "The city also became internationally known in 1999, when residents welcomed a vast number of refugees from Kosovo. Local museums and memorial spaces connect that humanitarian chapter with the wider history of the Gora and Lumë highlands, where kinship and hospitality remain defining values.",
        "secondary_body_fr": "La ville fut aussi connue en 1999, lorsque ses habitants accueillirent un très grand nombre de réfugiés du Kosovo. Musées et lieux de mémoire relient cet épisode humanitaire à l’histoire des hautes terres de Gora et Lumë, où parenté et hospitalité restent fondamentales."
      },
      {
        "image_key": "culture",
        "title_en": "Where two Drin rivers become a lake",
        "title_fr": "Là où les deux Drin deviennent un lac",
        "body_en": "Near Kukës, the White Drin and Black Drin meet before flowing into the long Fierza reservoir. The result is a striking geography of blue water, peninsulas, bridges and steep slopes that changes character with the weather and the reservoir level.",
        "body_fr": "Près de Kukës, le Drin blanc et le Drin noir se rejoignent avant de se fondre dans le long réservoir de Fierza. Il en résulte une géographie saisissante d’eaux bleues, péninsules, ponts et pentes abruptes, changeant avec la météo et le niveau du lac.",
        "secondary_body_en": "Viewpoints around the city reveal the scale, but the landscape rewards a guided drive or hike into the surrounding hills. Mount Gjallica dominates the skyline and offers demanding routes for experienced walkers; lower village paths provide gentler introductions to the region’s geology and pastoral life.",
        "secondary_body_fr": "Les belvédères urbains en montrent l’ampleur, mais une route guidée ou une randonnée permet d’aller plus loin. Le mont Gjallica domine l’horizon et propose des itinéraires exigeants ; les sentiers de village offrent une introduction plus douce à la géologie et à la vie pastorale."
      },
      {
        "image_key": "landscape",
        "title_en": "Highland villages and borderland culture",
        "title_fr": "Villages d’altitude et culture frontalière",
        "body_en": "Kukës is the natural base for exploring Shishtavec, the Korab–Koritnik Nature Park and remote settlements along Albania’s northeastern border. Stone houses, high pastures and winter snow distinguish this region sharply from the Mediterranean coast, while roads reveal wide views toward Kosovo and North Macedonia.",
        "body_fr": "Kukës est la base naturelle pour explorer Shishtavec, le parc naturel Korab–Koritnik et les villages reculés de la frontière nord-est. Maisons de pierre, hauts pâturages et neige hivernale distinguent nettement cette région de la côte méditerranéenne, avec de vastes vues vers le Kosovo et la Macédoine du Nord.",
        "secondary_body_en": "Local food is substantial and seasonal: flija, maize breads, mountain dairy products, beans and slow-cooked meat suit the climate. Travel with time, check mountain conditions and use local guides for remote routes. The reward is a generous region still outside most standard Albania itineraries.",
        "secondary_body_fr": "La cuisine locale est généreuse et saisonnière : flija, pains de maïs, laitages de montagne, haricots et viandes mijotées répondent au climat. Prenez votre temps, vérifiez les conditions et engagez un guide pour les routes isolées : la récompense est une région encore hors des itinéraires classiques."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Northeast Albania", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "May–Oct", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "2–3 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "mountain", "value": "Gjallica + Koritnik", "label_en": "Landscape", "label_fr": "Paysage"},
      {"group": "weather", "icon": "sun", "value": "Warm, cool nights", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Cold with snow", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "home", "label_en": "Resilience", "label_fr": "Résilience", "text_en": "A city rebuilt above the old town", "text_fr": "Une ville reconstruite au-dessus de l’ancienne"},
      {"icon": "sparkles", "label_en": "Fierza", "label_fr": "Fierza", "text_en": "Blue reservoir at the Drin confluence", "text_fr": "Réservoir bleu au confluent des Drin"},
      {"icon": "mountain", "label_en": "Gjallica", "label_fr": "Gjallica", "text_en": "The mountain defining the city skyline", "text_fr": "La montagne qui domine l’horizon"},
      {"icon": "route", "label_en": "Highlands", "label_fr": "Hautes terres", "text_en": "Shishtavec and Korab–Koritnik routes", "text_fr": "Routes de Shishtavec et Korab–Koritnik"},
      {"icon": "utensils", "label_en": "Traditions", "label_fr": "Traditions", "text_en": "Flija and generous mountain hospitality", "text_fr": "Flija et hospitalité montagnarde"}
    ]
  },
  {
    "slug": "elbasan",
    "title_en": "Elbasan",
    "title_fr": "Elbasan",
    "seo_title_en": "Elbasan — The City Within the Walls | Wonder Albania",
    "seo_title_fr": "Elbasan — La ville au cœur des remparts | Wonder Albania",
    "seo_description_en": "Discover Elbasan’s inhabited castle quarter, Via Egnatia heritage, religious landmarks, ballokume traditions and nearby mountain escapes, with linked tours.",
    "seo_description_fr": "Découvrez le quartier habité du château d’Elbasan, la Via Egnatia, ses lieux religieux, le ballokume et les montagnes voisines, avec circuits liés.",
    "hero_intro_en": "Elbasan is a lived-in fortress city on the ancient Via Egnatia, known for religious coexistence, spring celebrations, generous food and easy access to central Albania’s mountains.",
    "hero_intro_fr": "Elbasan est une ville-forteresse habitée sur l’ancienne Via Egnatia, connue pour la coexistence religieuse, les fêtes du printemps, sa cuisine et l’accès aux montagnes du centre.",
    "hero_alt_en": "Stone walls and gate of Elbasan Castle",
    "hero_alt_fr": "Murs de pierre et porte du château d’Elbasan",
    "story_title_en": "Three layers of Elbasan",
    "story_title_fr": "Trois dimensions d’Elbasan",
    "story_intro_en": "Enter through Roman and Ottoman walls, meet a city where faiths and neighbourhood life share the same streets, then follow its spring traditions and mountain routes beyond the Shkumbin valley.",
    "story_intro_fr": "Franchissez des murs romains et ottomans, découvrez une ville où religions et vie de quartier partagent les mêmes rues, puis suivez ses traditions printanières vers les montagnes de la vallée du Shkumbin.",
    "longitude": 20.0822,
    "latitude": 41.1125,
    "map_zoom": 11.5,
    "tour_radius": 0.13,
    "tour_terms": ["elbasan", "elbasani", "scampis"],
    "images": [
      {
        "key": "hero",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Elbasan%2C%20Albania%2C%20Castle%202013%2001.jpg?width=2400",
        "width": 2400,
        "height": 1590,
        "credit_name": "Pasztilla / Wikimedia Commons (CC BY-SA 4.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Elbasan,_Albania,_Castle_2013_01.jpg",
        "alt_en": "Historic stone entrance and walls of Elbasan Castle",
        "alt_fr": "Entrée historique et remparts de pierre du château d’Elbasan"
      },
      {
        "key": "culture",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Clock%20Tower%20of%20Elbasan%2C%20Albania.jpg?width=2400",
        "width": 2400,
        "height": 1776,
        "credit_name": "Leeturtle / Wikimedia Commons (CC BY-SA 3.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Clock_Tower_of_Elbasan,_Albania.jpg",
        "alt_en": "The Clock Tower rising above Elbasan’s castle quarter",
        "alt_fr": "La Tour de l’Horloge au-dessus du quartier du château d’Elbasan"
      },
      {
        "key": "landscape",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Elbasan%20Castle%2C%20Elbasan%2C%20Albania%20-%20Outside%20the%20City%20Walls.jpg?width=2400",
        "width": 2400,
        "height": 1800,
        "credit_name": "Sharon Hahn Darlin / Wikimedia Commons (CC BY 2.0)",
        "credit_url": "https://commons.wikimedia.org/wiki/File:Elbasan_Castle,_Elbasan,_Albania_-_Outside_the_City_Walls.jpg",
        "alt_en": "Street life outside the old walls of Elbasan Castle",
        "alt_fr": "Vie de rue à l’extérieur des anciens remparts d’Elbasan"
      }
    ],
    "sections": [
      {
        "image_key": "hero",
        "title_en": "Scampis and the road across the Balkans",
        "title_fr": "Scampis et la route à travers les Balkans",
        "body_en": "Elbasan grew at a strategic point on the Via Egnatia, the Roman road linking the Adriatic with Thessaloniki and Constantinople. The fortified settlement of Scampis established the city’s enduring geometry; Ottoman reconstruction later reinforced the walls and shaped the castle quarter visible today.",
        "body_fr": "Elbasan s’est développée sur un point stratégique de la Via Egnatia, route romaine reliant l’Adriatique à Thessalonique et Constantinople. Le camp fortifié de Scampis fixa la géométrie de la ville ; la reconstruction ottomane renforça ensuite les murs et façonna le quartier actuel du château.",
        "secondary_body_en": "Unlike a monument sealed off from daily life, the castle remains an inhabited neighbourhood. Enter through the surviving gate to find homes, gardens, lanes, cafés and archaeological fragments. The Clock Tower gives the district its vertical landmark while sections of wall reveal different building periods.",
        "secondary_body_fr": "Contrairement à un monument isolé, le château reste un quartier habité. Passez la porte conservée pour découvrir maisons, jardins, ruelles, cafés et fragments archéologiques. La Tour de l’Horloge sert de repère vertical et les murs révèlent plusieurs périodes de construction."
      },
      {
        "image_key": "culture",
        "title_en": "Faiths sharing one historic quarter",
        "title_fr": "Plusieurs religions dans un même quartier historique",
        "body_en": "Inside the walls, the King Mosque stands among Albania’s oldest surviving mosques, while the Orthodox Church of Saint Mary preserves carved woodwork and icons. A short walk beyond the castle reaches the Catholic church and newer places of worship, making Elbasan’s tradition of religious coexistence tangible within everyday streets.",
        "body_fr": "À l’intérieur des murs, la Mosquée du Roi compte parmi les plus anciennes conservées d’Albanie, tandis que l’église orthodoxe Sainte-Marie abrite boiseries sculptées et icônes. À quelques pas se trouvent l’église catholique et d’autres lieux de culte, rendant tangible la coexistence religieuse d’Elbasan.",
        "secondary_body_en": "The city also has a deep educational and linguistic legacy, associated with the Normal School and the development of Albanian-language teaching. Small museums, traditional houses and conversations with residents give this history a human scale often missed by travellers crossing central Albania too quickly.",
        "secondary_body_fr": "La ville possède également un important héritage éducatif et linguistique, lié à l’École normale et au développement de l’enseignement en albanais. Petits musées, maisons traditionnelles et échanges avec les habitants donnent à cette histoire une échelle humaine souvent ignorée des voyageurs pressés."
      },
      {
        "image_key": "landscape",
        "title_en": "Spring traditions and the Shkumbin valley",
        "title_fr": "Traditions du printemps et vallée du Shkumbin",
        "body_en": "Elbasan is the symbolic home of Dita e Verës, Albania’s great Spring Day celebration on 14 March. The signature food is ballokume, a rich corn-flour biscuit whose aroma fills bakeries and family kitchens. Taverns add grilled meats, vegetable dishes and recipes rooted in the fertile Shkumbin valley.",
        "body_fr": "Elbasan est la patrie symbolique de Dita e Verës, grande fête albanaise du printemps le 14 mars. Sa spécialité est le ballokume, biscuit riche à la farine de maïs dont le parfum emplit boulangeries et cuisines familiales. Les tavernes proposent aussi viandes grillées et recettes de la vallée fertile du Shkumbin.",
        "secondary_body_en": "Beyond the city, the road climbs toward Gjinar and the Shpat Mountains for pine forests, village meals and cooler summer air. Elbasan can be a compact day trip, but an overnight stay allows the castle after the crowds, a slower dinner and a fuller view of central Albania beyond the capital.",
        "secondary_body_fr": "Au-delà de la ville, la route monte vers Gjinar et les monts Shpat, leurs pins, repas de village et air frais en été. Elbasan se visite en une journée, mais une nuit permet de profiter du château après l’affluence, d’un dîner tranquille et d’un regard plus complet sur le centre du pays."
      }
    ],
    "facts": [
      {"group": "quick", "icon": "map", "value": "Central Albania", "label_en": "Region", "label_fr": "Région"},
      {"group": "quick", "icon": "calendar", "value": "Mar–Jun · Sep–Oct", "label_en": "Best time", "label_fr": "Meilleure période"},
      {"group": "quick", "icon": "clock", "value": "1–2 days", "label_en": "Ideal stay", "label_fr": "Séjour idéal"},
      {"group": "quick", "icon": "route", "value": "Via Egnatia", "label_en": "Historic route", "label_fr": "Route historique"},
      {"group": "weather", "icon": "sun", "value": "Hot and dry", "label_en": "Summer", "label_fr": "Été"},
      {"group": "weather", "icon": "cloud-sun", "value": "Cool and damp", "label_en": "Winter", "label_fr": "Hiver"}
    ],
    "highlights": [
      {"icon": "home", "label_en": "Living castle", "label_fr": "Château habité", "text_en": "Homes and cafés inside the old walls", "text_fr": "Maisons et cafés à l’intérieur des murs"},
      {"icon": "route", "label_en": "Via Egnatia", "label_fr": "Via Egnatia", "text_en": "Roman crossroads at ancient Scampis", "text_fr": "Carrefour romain de l’ancienne Scampis"},
      {"icon": "church", "label_en": "Coexistence", "label_fr": "Coexistence", "text_en": "Mosque and churches within a short walk", "text_fr": "Mosquée et églises à quelques pas"},
      {"icon": "sparkles", "label_en": "Spring Day", "label_fr": "Jour du printemps", "text_en": "Dita e Verës and traditional ballokume", "text_fr": "Dita e Verës et ballokume traditionnel"},
      {"icon": "mountain", "label_en": "Gjinar", "label_fr": "Gjinar", "text_en": "Pine forests in the Shpat Mountains", "text_fr": "Forêts de pins des monts Shpat"}
    ]
  },
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

-- Expected result: thirteen published destination pages at
-- /destinations/tirana
-- /destinations/vlora
-- /destinations/durres
-- /destinations/saranda
-- /destinations/shkoder
-- /destinations/kukes
-- /destinations/elbasan
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
  'tirana', 'vlora', 'durres', 'saranda', 'shkoder', 'kukes', 'elbasan',
  'fier', 'korce', 'gjirokaster', 'lushnje', 'pogradec', 'lezhe'
)
group by pt.slug, pt.title, pt.seo_title, p.status
order by pt.slug;
