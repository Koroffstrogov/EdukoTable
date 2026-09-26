import type { FairyCard, FairyCollection, FairyFamilyId, FairyRarity } from "./types";

export const FAIRY_RARITIES: { id: FairyRarity; label: string }[] = [
  { id: "choupinette", label: "Choupinette" },
  { id: "pailletee", label: "Pailletée" },
  { id: "etincelante", label: "Étincelante" },
  { id: "feerique", label: "Féerique" },
  { id: "royalissime", label: "Royalissime" },
  { id: "mythique", label: "Mythique" },
  { id: "galactastique", label: "Galactastique" },
  { id: "ultime", label: "WOUAH ULTIME !" },
];

export const FAIRY_FAMILIES: { id: FairyFamilyId; name: string; world: string; description: string }[] = [
  { id: "ronronova", name: "Ronronova", world: "Le Bal des Princesses Cosmiques", description: "Un petit ronron… et tout un ciel s’illumine." },
  { id: "lunabelle", name: "Lunabelle", world: "Le Royaume des Nuages Sucrés", description: "Elle fait pousser des rêves à chaque petit galop." },
  { id: "pralinette", name: "Pralinette", world: "La Confiserie des Dragonnes", description: "Son super-pouvoir ? Des bêtises croustillantes !" },
  { id: "petalipop", name: "Pétalipop", world: "Le Jardin des Fées Farceuses", description: "Une pirouette, trois pétales… et le jardin éclate de rire." },
  { id: "pomponnette", name: "Pomponnette", world: "Le Royaume des Nuages Sucrés", description: "De bond en bond, elle sème des rêves tout doux." },
  { id: "coralie", name: "Coralie Glouglou", world: "L’Archipel des Sirènes Pétillantes", description: "Elle chante si joliment que même les coquillages font des bulles." },
  { id: "flutinelle", name: "Flûtinelle", world: "Le Bal des Princesses Cosmiques", description: "Sa flûte traversière fait danser les étoiles… et les chaussettes !" },
  { id: "ninachou", name: "Ninachou", world: "Le Bal des Princesses Cosmiques", description: "Un pas de velours, une pirouette… et une pluie de paillettes." },
  { id: "basketoile", name: "Baskétoile", world: "Le Bal des Princesses Cosmiques", description: "Elle dribble entre les nuages et vise les paniers de la galaxie." },
  { id: "poussinelle", name: "Poussinelle", world: "Le Jardin des Fées Farceuses", description: "Une petite pousse, de grandes idées… et des feuilles qui chatouillent !" },
  { id: "loutrelune", name: "Loutrelune", world: "L’Archipel des Sirènes Pétillantes", description: "Elle cache des secrets de lune entre deux galipettes dans l’eau." },
  { id: "shampouff", name: "Shampouff", world: "Le Palais des Bulles Malicieuses", description: "Un flacon futé, une coiffure de mousse et mille idées qui pétillent !" },
  { id: "fluoribelle", name: "Fluoribelle", world: "L’Atelier des Couleurs Impossibles", description: "Un coup de surligneur… et les idées prennent toutes les couleurs !" },
  { id: "sacapouic", name: "Sacapouic", world: "Le Manoir des Cartables Farceurs", description: "Deux petites cornes, un zip malicieux et un cartable plein de bêtises !" },
  { id: "uranounet", name: "Uranounet 235", world: "L’Observatoire des Atomes Rêveurs", description: "Ce petit atome d’uranium 235 rêve de devenir la vedette du bal cosmique." },
];

const STAGE_SESSIONS = [1, 2, 4, 7] as const;

type CardStory = Pick<FairyCard, "title" | "rarity" | "power" | "secret">;

function familyCards(familyId: FairyFamilyId, firstNumber: number, stories: [CardStory, CardStory, CardStory, CardStory]): FairyCard[] {
  const family = FAIRY_FAMILIES.find((item) => item.id === familyId)!;
  return stories.map((story, index) => ({
    ...story,
    id: `${familyId}-${index + 1}`,
    familyId,
    name: family.name,
    stage: (index + 1) as FairyCard["stage"],
    number: firstNumber + index,
    requiredSessions: STAGE_SESSIONS[index],
    artwork: `/cards/fabuleuses/${familyId}-${index + 1}.webp`,
  }));
}

export const FAIRY_CARDS: FairyCard[] = [
  ...familyCards("ronronova", 81, [
    { title: "Mini-Miaou", rarity: "choupinette", power: "Un ronron qui rallume les petites étoiles fatiguées.", secret: "Elle confond les croissants de lune avec son goûter." },
    { title: "Chasseuse de lunes", rarity: "pailletee", power: "Elle attrape les rêves perdus dans son ruban de lune.", secret: "Son record : trois pirouettes et un éternuement pailleté." },
    { title: "Duchesse des aurores", rarity: "feerique", power: "D’un battement d’ailes, elle peint le ciel en rose.", secret: "Elle a nommé toutes les étoiles… Minou." },
    { title: "Impératrice des étoiles", rarity: "galactastique", power: "Son grand ronron fait danser des galaxies entières.", secret: "Même sur son trône, elle préfère encore les cartons." },
  ]),
  ...familyCards("lunabelle", 21, [
    { title: "Bouton de rêve", rarity: "choupinette", power: "Ses petits sabots réveillent les fleurs endormies.", secret: "Elle a le hoquet quand un papillon lui dit bonjour." },
    { title: "Galop de rosée", rarity: "etincelante", power: "Elle saute de goutte en goutte sans mouiller sa crinière.", secret: "Elle collectionne les nœuds… et les emmêle tous." },
    { title: "Princesse des nuages", rarity: "royalissime", power: "Elle transforme les nuages gris en jardins flottants.", secret: "Son oreiller préféré est un nuage en forme de brocoli." },
    { title: "Reine des pétales", rarity: "mythique", power: "Son galop fait éclore un printemps de lumière.", secret: "Elle signe ses invitations avec de la confiture de rose." },
  ]),
  ...familyCards("pralinette", 61, [
    { title: "Pralipouf", rarity: "pailletee", power: "Elle souffle des petits cœurs qui sentent le caramel.", secret: "Elle rugit tout bas pour ne pas réveiller les macarons." },
    { title: "Flamme chantilly", rarity: "etincelante", power: "Ses flammes transforment les cailloux en nuages sucrés.", secret: "Elle met de la chantilly même sur ses chaussettes." },
    { title: "Duchesse croquante", rarity: "royalissime", power: "Elle bâtit des palais de cristal avec un seul souffle.", secret: "Son garde royal est un biscuit très, très sérieux." },
    { title: "Dragonne des cristaux", rarity: "ultime", power: "Ses ailes déploient un feu d’artifice de cristaux arc-en-ciel.", secret: "Son plus grand trésor reste le premier dessin de ses amis." },
  ]),
  ...familyCards("petalipop", 1, [
    { title: "Pousse-Paillette", rarity: "choupinette", power: "Elle chatouille les graines pour les faire éclore.", secret: "Sa tasse préférée est une fleur… qui éternue." },
    { title: "Pirouette fleurie", rarity: "etincelante", power: "Ses pirouettes réveillent des ribambelles de papillons.", secret: "Elle apprend la danse aux radis. Ils sont très timides." },
    { title: "Marquise des jardins", rarity: "feerique", power: "Elle fait pousser des toboggans de lianes entre les fleurs.", secret: "Son jardin secret contient surtout des chaussettes à pois." },
    { title: "Impératrice du printemps", rarity: "mythique", power: "D’un éclat de rire, elle fait fleurir des royaumes entiers.", secret: "Sa couronne abrite une coccinelle qui ronfle très fort." },
  ]),
  ...familyCards("pomponnette", 25, [
    { title: "Pompon de coton", rarity: "choupinette", power: "Ses câlins transforment les nuages en coussins moelleux.", secret: "Elle cache des carottes dans les poches de son nuage." },
    { title: "Saute-Nuage", rarity: "pailletee", power: "Elle rebondit sur les nuages pour rattraper les étoiles filantes.", secret: "Ses oreilles servent parfois d’antennes à histoires drôles." },
    { title: "Duchesse du ciel", rarity: "royalissime", power: "Ses bonds dessinent des ponts arc-en-ciel entre les châteaux.", secret: "Elle exige une carotte en forme de cœur à chaque goûter." },
    { title: "Gardienne des rêves", rarity: "galactastique", power: "Ses grandes ailes enveloppent la nuit de rêves merveilleux.", secret: "Elle compte les moutons… mais ils lui demandent tous un câlin." },
  ]),
  ...familyCards("coralie", 41, [
    { title: "Bulle-Bisou", rarity: "pailletee", power: "Ses bulles portent des petits mots doux à travers l’océan.", secret: "Elle dit bonjour aux cailloux, au cas où ils seraient timides." },
    { title: "Valse des perles", rarity: "etincelante", power: "Elle fait danser les perles au rythme de sa chanson.", secret: "Son hippocampe chante faux… et beaucoup trop fort." },
    { title: "Princesse des marées", rarity: "feerique", power: "Elle tisse des rubans de lumière entre les récifs.", secret: "Elle a appris à un crabe à applaudir les deux pinces en l’air." },
    { title: "Reine des abysses", rarity: "mythique", power: "Sa voix allume mille jardins de corail au fond des océans.", secret: "Sa majestueuse baguette sert aussi à touiller sa soupe d’algues." },
  ]),
  ...familyCards("flutinelle", 85, [
    { title: "Souffle-Bisou", rarity: "choupinette", power: "Une note de sa flûte traversière fait éclore une fleur lumineuse.", secret: "Elle s’échauffe avec un escargot qui chante beaucoup trop lentement." },
    { title: "Mélodie pailletée", rarity: "etincelante", power: "Ses mélodies dessinent des rubans de notes dans le ciel.", secret: "Son pupitre danse la polka dès qu’elle lui tourne le dos." },
    { title: "Virtuose des vents", rarity: "feerique", power: "Sa flûte fait tournoyer les nuages en un immense ballet.", secret: "Elle a appris le solfège à un courant d’air très distrait." },
    { title: "Symphonie des aurores", rarity: "galactastique", power: "Son grand concert allume des aurores aux quatre coins du ciel.", secret: "Même les étoiles lui demandent de rejouer la chanson du cornichon." },
  ]),
  ...familyCards("ninachou", 89, [
    { title: "Pas de velours", rarity: "pailletee", power: "Elle avance si doucement que les fleurs ne se réveillent pas.", secret: "Elle réussit tous ses pas discrets… sauf avec ses chaussons qui couinent." },
    { title: "Pirouette invisible", rarity: "etincelante", power: "Une pirouette la cache dans un tourbillon de rubans lumineux.", secret: "Elle oublie parfois de cacher son énorme nœud rose." },
    { title: "Gardienne de la lune", rarity: "royalissime", power: "Elle bondit entre les toits pour raccompagner les étoiles égarées.", secret: "Son entraînement préféré consiste à attraper des tartines en vol." },
    { title: "Éclipse de paillettes", rarity: "mythique", power: "Son saut légendaire déploie un ciel entier de constellations.", secret: "Elle disparaît dans les paillettes, mais son fou rire la trahit toujours." },
  ]),
  ...familyCards("basketoile", 93, [
    { title: "Mini-Rebond", rarity: "choupinette", power: "Chaque rebond de son ballon fait jaillir une petite étoile.", secret: "Son ballon rebondit parfois tout seul pour réclamer un câlin." },
    { title: "Dribble comète", rarity: "feerique", power: "Ses dribbles tracent une piste de comètes entre les nuages.", secret: "Elle donne un prénom à ses baskets : Pouf et Paf." },
    { title: "Duchesse du dunk", rarity: "royalissime", power: "Elle saute par-dessus les arcs-en-ciel pour marquer des paniers magiques.", secret: "Son filet de basket lui réclame des spaghettis au goûter." },
    { title: "Reine du panier cosmique", rarity: "ultime", power: "Son dunk fait briller toute la galaxie dans une explosion de couleurs.", secret: "Son plus beau panier ? Celui où elle range les dessins de ses amis." },
  ]),
  ...familyCards("poussinelle", 5, [
    { title: "Pousse-Pouce", rarity: "choupinette", power: "Ses petites feuilles font éclore des fleurs en forme de sourire.", secret: "Elle réclame une histoire avant chaque arrosage." },
    { title: "Liane malicieuse", rarity: "pailletee", power: "Ses lianes tressent des balançoires pour les papillons fatigués.", secret: "Elle fait des chatouilles aux arrosoirs pour déclencher la pluie." },
    { title: "Duchesse chlorophylle", rarity: "feerique", power: "Elle transforme un rayon de soleil en un jardin suspendu.", secret: "Son jardinier est un escargot qui prend trois semaines de pause." },
    { title: "Floraison cosmique", rarity: "mythique", power: "Ses pétales géants font fleurir les constellations.", secret: "Elle cherche encore un pot assez grand pour ses racines." },
  ]),
  ...familyCards("loutrelune", 45, [
    { title: "Galipette de rosée", rarity: "choupinette", power: "Elle roule sur l’eau et laisse des perles de lumière derrière elle.", secret: "Son caillou préféré s’appelle Monsieur Patate." },
    { title: "Perle de lune", rarity: "etincelante", power: "Elle berce une perle qui éclaire les rêves de la rivière.", secret: "Elle dort sur le dos pour ne pas décoiffer ses moustaches." },
    { title: "Gardienne des brumes", rarity: "royalissime", power: "Elle guide les petits voyageurs avec des rubans de brume argentée.", secret: "Elle perd toujours sa couronne au fond de sa piscine." },
    { title: "Oracle des marées", rarity: "galactastique", power: "Sa grande perle de lune révèle des rivières d’étoiles.", secret: "Elle prédit surtout l’heure de la prochaine sieste." },
  ]),
  ...familyCards("shampouff", 65, [
    { title: "Bulle-Malice", rarity: "pailletee", power: "Ses bulles coiffent les mèches rebelles en petits cœurs.", secret: "Il se fait une moustache de mousse pour passer incognito." },
    { title: "Mousse futée", rarity: "etincelante", power: "Il invente des bulles qui démêlent les nœuds en un clin d’œil.", secret: "Son peigne lui raconte des histoires à dormir debout." },
    { title: "Prince du démêlage", rarity: "royalissime", power: "Son sceptre de mousse dénoue même les rubans des nuages.", secret: "Sa couronne fait pouic à chaque fois qu’il s’incline." },
    { title: "Génie des bulles", rarity: "mythique", power: "Il fait flotter un palais de bulles aux reflets de mille aurores.", secret: "Son grand secret : il répète ses discours devant un canard de bain." },
  ]),
  ...familyCards("fluoribelle", 9, [
    { title: "Trait-Malice", rarity: "pailletee", power: "Elle surligne les bonnes idées d’un petit arc-en-ciel.", secret: "Elle souligne aussi les blagues… surtout celles qui ne font rire qu’elle." },
    { title: "Arc-en-Surligne", rarity: "etincelante", power: "Ses traits multicolores deviennent des toboggans pour les mots.", secret: "Son capuchon joue à cache-cache dans les trousses." },
    { title: "Marquise des couleurs", rarity: "feerique", power: "Elle dessine des ponts de lumière entre les pages des livres.", secret: "Elle a inventé une couleur qui s’appelle Prout-de-Licorne." },
    { title: "Aurore fluo", rarity: "galactastique", power: "Son grand trait arc-en-ciel illumine la bibliothèque des étoiles.", secret: "Même en reine du fluo, elle dépasse encore un peu des lignes." },
  ]),
  ...familyCards("sacapouic", 69, [
    { title: "Mini-Diablotin", rarity: "choupinette", power: "Sa poche secrète attrape les crayons avant qu’ils tombent.", secret: "Il fait grr… mais son zip répond toujours pouic." },
    { title: "Zip infernal", rarity: "pailletee", power: "Ses petites ailes transportent les cahiers dans un tourbillon de confettis.", secret: "Il cache les gommes, puis oublie dans quelle poche." },
    { title: "Duc des bêtises", rarity: "royalissime", power: "Il ouvre des passages magiques entre toutes les trousses du manoir.", secret: "Il a peur des devoirs… surtout quand ils sont déjà terminés." },
    { title: "Seigneur du bazar", rarity: "mythique", power: "Son grand sac déploie un château volant de fournitures enchantées.", secret: "Son plus terrible secret : il adore qu’on range ses chaussettes." },
  ]),
  ...familyCards("uranounet", 97, [
    { title: "Noyau-Chou", rarity: "choupinette", power: "Dans son monde magique, ses petites lumières dansent autour des rêves.", secret: "Ses amis l’appellent U-235, mais lui préfère Monsieur Câlin." },
    { title: "Pirouette quantique", rarity: "etincelante", power: "Il fait tournoyer ses anneaux en un ballet de rubans étoilés.", secret: "Il donne le tournis à son propre nœud papillon." },
    { title: "Prince des orbitales", rarity: "feerique", power: "Il tisse une couronne de lumières pour les petits rêveurs du ciel.", secret: "Ses électrons refusent de se mettre en rang pour la photo." },
    { title: "Majesté atomique", rarity: "ultime", power: "Son grand ballet cosmique dessine un palais de constellations.", secret: "Son trône est minuscule, mais il exige un coussin gigantesque." },
  ]),
];

export function getFairyCard(id: string): FairyCard | undefined {
  return FAIRY_CARDS.find((card) => card.id === id);
}

export function getFairyRarityLabel(rarity: FairyRarity): string {
  return FAIRY_RARITIES.find((item) => item.id === rarity)!.label;
}

export function createInitialFairyCollection(): FairyCollection {
  return {
    selectedFamilyId: "ronronova",
    sessionsByFamily: Object.fromEntries(FAIRY_FAMILIES.map((family) => [family.id, 0])) as Record<FairyFamilyId, number>,
    unlockedCardIds: [],
  };
}

export function getFairyProgress(collection: FairyCollection, familyId = collection.selectedFamilyId) {
  const cards = FAIRY_CARDS.filter((card) => card.familyId === familyId);
  const sessions = collection.sessionsByFamily[familyId];
  const nextCard = cards.find((card) => !collection.unlockedCardIds.includes(card.id));
  const latestCard = cards.filter((card) => collection.unlockedCardIds.includes(card.id)).at(-1);
  return { cards, sessions, nextCard, latestCard, remaining: nextCard ? Math.max(0, nextCard.requiredSessions - sessions) : 0 };
}

/** A completed ten-question mission helps the chosen companion, whatever the score. */
export function advanceFairyCollection(previous: FairyCollection): { collection: FairyCollection; cardIds: string[] } {
  const familyId = previous.selectedFamilyId;
  const sessions = Math.min(7, previous.sessionsByFamily[familyId] + 1);
  const cardIds = FAIRY_CARDS.filter((card) =>
    card.familyId === familyId && card.requiredSessions <= sessions && !previous.unlockedCardIds.includes(card.id),
  ).map((card) => card.id);
  return {
    collection: {
      ...previous,
      sessionsByFamily: { ...previous.sessionsByFamily, [familyId]: sessions },
      unlockedCardIds: [...previous.unlockedCardIds, ...cardIds],
    },
    cardIds,
  };
}
