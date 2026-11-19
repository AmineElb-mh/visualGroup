import { asset } from "./stories";

export type Article = {
  id: string;
  title: string;
  image?: string;
  label?: string;
  time?: string;
  premium?: boolean;
  video?: boolean;
  comments?: boolean;
  /** Red editorial badge shown on top of the image, e.g. "7 vragen" */
  badge?: string;
  /** CSS object-position for the image crop */
  focus?: string;
};

export const topics = [
  "Kabinetscrisis",
  "Nieuws",
  "Sport",
  "Financieel",
  "Entertainment",
  "Video",
  "Lifestyle",
  "Puzzels",
];

export const breaking = {
  hero: {
    id: "br-hero",
    title: "De handelsoorlog escaleert, maar Amerika treft vooral zichzelf",
    image: asset("6405a.png"),
    label: "Buitenland",
    time: "16:31",
    premium: true,
    badge: "7 vragen",
    focus: "center 30%",
  } satisfies Article,
  related: [
    {
      id: "br-1",
      title: "Familiegevoel bij weekend met rockband Marillion in Ouddorp",
      image: asset("c528e.png"),
      label: "Entertainment",
      premium: true,
    },
    {
      id: "br-2",
      title: "Gestapo-chef Klaus Barbie zaaide dood en verderf in Amsterdam: ’Het was een gevecht van huis tot huis’",
      image: asset("99667.png"),
      label: "Geschiedenis",
      premium: true,
    },
    {
      id: "br-3",
      title: "Caroline van der Plas bijt van zich af: ‘Veel te vroeg hiervoor!’",
      image: asset("03481.png"),
      label: "Politiek",
      premium: true,
    },
  ] satisfies Article[],
  row: [
    {
      id: "br-4",
      title: "Van ‘Unibet’ naar ‘U-Experts’: Belgische voetbalclubs wagen gokje met creatieve shirtreclame",
      image: asset("4d500.png"),
      label: "Sport",
      premium: true,
    },
    {
      id: "br-5",
      title: "Washington zoekt uitweg uit tarievenstrijd, maar de markten blijven onrustig",
      image: asset("6405a.png"),
      label: "Financieel",
      focus: "70% center",
    },
    {
      id: "br-6",
      title: "Moordenaar stak Louise neer uit frustratie omdat hij spelletje Fortnite verloor",
      image: asset("c1202.png"),
      label: "Misdaad",
      premium: true,
    },
    {
      id: "br-7",
      title: "De bocht van Europa over AI: minder regels, meer innovatie",
      image: asset("ff170.png"),
      label: "Tech",
      premium: true,
    },
  ] satisfies Article[],
};

export const opening = {
  hero: {
    id: "op-hero",
    title: "’Verdachte drama Stampersgat zou wapens inleveren’",
    image: asset("d9a89.png"),
    label: "Binnenland",
    time: "16:31",
    premium: true,
    comments: true,
  } satisfies Article,
  secondary: [
    {
      id: "op-1",
      title: "Salou rouwt na gewelddadige dood Nederlandse Trudy (76): ’We zijn gewaarschuwd, maar toen was het al gebeurd’",
      image: asset("f4920.png"),
      label: "Buitenland",
      premium: true,
    },
    {
      id: "op-2",
      title: "Wervelstorm aan complottheorieën losgebarsten na moordaanslag op Donald Trump",
      image: asset("83042.png"),
      label: "Buitenland",
      premium: true,
    },
  ] satisfies Article[],
};

export const latest: Article[] = [
  { id: "ln-1", time: "16:48", title: "Na Franse sportminister duikt ook burgemeester Parijs Seine in" },
  { id: "ln-2", time: "16:35", title: "Uitverkocht stadion Real Madrid ziet stralende Kylian Mbappé" },
  { id: "ln-3", time: "16:22", title: "File op A2 na ongeval bij Vianen, verkeer staat urenlang stil", premium: true },
  { id: "ln-4", time: "16:04", title: "KNMI waarschuwt voor onweersbuien en hagel in het zuiden" },
  { id: "ln-5", time: "15:51", title: "Ajax rondt komst van Deense middenvelder af" },
  { id: "ln-6", time: "15:37", title: "Huizenprijzen stijgen voor het eerst in maanden minder hard", premium: true },
];

export const recommended: Article[] = [
  {
    id: "rc-1",
    title: "Pim (32) zou dag voor ramp MH17 vertrekken: stelde reis uit om verjaardag moeder",
    image: asset("2bfd8.png"),
    label: "Binnenland",
    time: "16:31",
    premium: true,
    video: true,
  },
  {
    id: "rc-2",
    title: "Kersvers kabinet-Schoof voor grote uitdaging: ’Het geld is op’",
    image: asset("e095e.png"),
    label: "Financieel",
    time: "16:12",
    premium: true,
    comments: true,
  },
  {
    id: "rc-3",
    title: "Spaanse premier Sánchez schept duidelijkheid over de toestroom in Ceuta",
    image: asset("29dda.png"),
    label: "Buitenland",
    time: "15:58",
    premium: true,
  },
  {
    id: "rc-4",
    title: "Feyenoord weigert Saoedisch bod van bijna 30 miljoen euro op Anis Hadj Moussa",
    image: asset("d80c7.png"),
    label: "Sport",
    time: "15:40",
    comments: true,
  },
];

export const more: Article[] = [
  {
    id: "mo-1",
    title: "Overheid waarschuwt voor gevaarlijke trend op TikTok: ’Ernstige gezondheidsrisico’s’",
    image: asset("68929.png"),
    label: "Binnenland",
    premium: true,
  },
  {
    id: "mo-2",
    title: "Wie Trump blijft bashen, maakt vooral zichzelf belachelijk",
    image: asset("fdb21.png"),
    label: "Column",
    premium: true,
  },
  {
    id: "mo-3",
    title: "Support het Nederlands Elftal in stijl",
    image: asset("39cbf.png"),
    label: "Shop",
  },
  {
    id: "mo-4",
    title: "Drugsvangst tussen de bananen: ton cocaïne onderschept met bestemming Rotterdam",
    image: asset("ae652.png"),
    label: "Buitenland",
    premium: true,
    video: true,
  },
];

export const closing: Article[] = [
  {
    id: "cl-1",
    title: "Slachtoffers zorgboerderij opnieuw de klos: ’Hoe haal je het in je kop dat toe te passen op cliënt uit Wedde?’",
    image: asset("bf96b.png"),
    label: "Binnenland",
    time: "14:05",
    premium: true,
    video: true,
  },
  {
    id: "cl-2",
    title: "Zó geniet Nederland van het zomerse weer",
    image: asset("86481.png"),
    label: "Binnenland",
    time: "13:47",
  },
];

export const footerColumns = [
  { title: "Rubrieken", links: ["Nieuws", "Sport", "Financieel", "Entertainment", "Lifestyle"] },
  { title: "Services", links: ["Nieuwsbrieven", "Puzzels", "Weer", "Tv-gids", "Familieberichten"] },
  { title: "Account", links: ["Mijn profiel", "Mijn abonnement", "Abonneren", "Inloggen", "Help"] },
  { title: "Over ons", links: ["Klantenservice", "Adverteren", "Vacatures", "Tip de redactie", "Colofon"] },
];

export const legalLinks = ["Privacy", "Cookies", "Gebruiksvoorwaarden", "Toegankelijkheid"];
