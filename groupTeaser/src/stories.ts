export const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

export type Story = {
  id: string;
  title: string;
  image?: string;
  /** CSS object-position, used to vary the crop of an image */
  focus?: string;
  /** Visual feed extras */
  label?: string;
  intro?: string;
  author?: { kind: string; name: string; avatar: string };
};

export type Category = {
  id: string;
  label: string;
  /** true: shown inline in the storyblock; false: opens the visual feed */
  inline: boolean;
  stories: Story[];
};

export const CATEGORIES: Category[] = [
  {
    id: "vandaag",
    label: "Vandaag",
    inline: true,
    stories: [
      { id: "v1", title: "Agenten nemen verslaggever te grazen tijdens oefening" },
      {
        id: "v2",
        title:
          "TikTokkers zorgen voor onrust tijdens tenniswedstrijd op US Open: wedstrijd wordt tijdelijk stilgelegd",
        image: asset("1d6de.png"),
      },
      {
        id: "v3",
        title:
          "Ferrari van Michael Jordan duikt na 24 jaar op en moet nu dit megabedrag opleveren bij veiling",
        image: asset("1a480.png"),
      },
      {
        id: "v4",
        title: "Feyenoord weigert Saoedisch bod van bijna 30 miljoen euro op Anis Hadj Moussa",
        image: asset("d80c7.png"),
      },
      {
        id: "v5",
        title:
          "Spaanse premier Sánchez schept duidelijkheid: dit is de invloed van Marokko op toestroom in Ceuta",
        image: asset("29dda.png"),
      },
      {
        id: "v6",
        title: "Dit zijn de zes verhalen die vandaag het nieuws bepalen",
        image: asset("6405a.png"),
      },
    ],
  },
  {
    id: "basketball",
    label: "Basketball",
    inline: true,
    stories: [
      {
        id: "b1",
        title:
          "“Ik ben heel blij dat ik weer in de FIBA Europe Cup kan basketten”: Coretec Oostende rekent op Swenson (24), een Amerikaanse Belg met Europese ervaring",
        image: asset("ca8a4.png"),
      },
      {
        id: "b2",
        title:
          "“We beseffen dat het moeilijk zal worden”: moeten Kangoeroes-vrouwen hun Europese ambities bijstellen na twee pandoeringen op rij?",
        image: asset("27a83.png"),
      },
      {
        id: "b3",
        title:
          "Antwerpenaar Randy Oveneke (40) wordt assistent-coach van Belgian Lions: “Als het land roept, twijfel je niet”",
        image: asset("8b7dc.png"),
      },
      {
        id: "b4",
        title:
          "NBA. Toumani Camara pakt met Portland de zege op bezoek bij de LA Lakers, eindelijk winst voor New York",
        image: asset("5b1e5.png"),
        focus: "30% center",
      },
      {
        id: "b5",
        title:
          "Belgian Cats kennen hun tegenstanders voor het EK: “Een loting waar we tevreden mee mogen zijn”",
        image: asset("ca8a4.png"),
        focus: "85% center",
      },
      {
        id: "b6",
        title:
          "Play-offs in zicht: dit zijn de vijf spelers die het verschil kunnen maken in de BNXT League",
        image: asset("5b1e5.png"),
        focus: "75% center",
      },
    ],
  },
  {
    id: "politiek",
    label: "Amerikaanse Politiek",
    inline: false,
    stories: [
      {
        id: "p1",
        title: "Slagveld-technologie ingezet tegen eigen burgers: De nieuwe realiteit in de VS",
        image: asset("feed/2da7c.png"),
        label: "Sci-fi Writer",
        intro:
          "De huidige sciencefiction neigt sterk naar fatalisme, deels omdat een verwoeste wereld makkelijker te verbeelden is dan een complexe, geloofwaardige utopie.",
        author: { kind: "Opinie", name: "Anna Kirkegaard", avatar: asset("feed/a80c4.png") },
      },
      {
        id: "p2",
        title: "Achter de schermen in Washington: zo probeert het Witte Huis het Congres te paaien",
        image: asset("feed/06925.png"),
      },
      {
        id: "p3",
        title: "De handelsoorlog escaleert, maar Amerika treft vooral zichzelf",
        image: asset("6405a.png"),
        focus: "35% center",
        label: "Analyse",
        intro:
          "De nieuwe importheffingen moesten Amerikaanse fabrieken beschermen, maar het zijn vooral Amerikaanse consumenten die de rekening betalen.",
      },
      {
        id: "p4",
        title: "Wervelstorm aan complottheorieën losgebarsten na moordaanslag op Donald Trump",
        image: asset("83042.png"),
      },
      {
        id: "p5",
        title: "Wie Trump blijft bashen, maakt vooral zichzelf belachelijk",
        image: asset("fdb21.png"),
        focus: "70% center",
        label: "Column",
      },
    ],
  },
  {
    id: "koken",
    label: "Koken",
    inline: false,
    stories: [
      {
        id: "k1",
        title: "Het geheim van luchtige pannenkoeken? Deze ene stap slaan de meeste mensen over",
        image: asset("koken/pannenkoeken.jpg"),
        label: "Recept",
        intro:
          "Laat het beslag een halfuur rusten en klop de eiwitten apart op: zo krijg je dikke, fluffy pannenkoeken die niet inzakken in de pan.",
      },
      {
        id: "k2",
        title: "Pizza uit je eigen oven die smaakt als bij de Italiaan: zo krijg je een krokante bodem",
        image: asset("koken/pizza.jpg"),
        label: "Weekendkoken",
      },
      {
        id: "k3",
        title: "Pokébowl in 20 minuten: het snelle doordeweekse recept dat iedereen lust",
        image: asset("koken/pokebowl.jpg"),
        label: "Snel & makkelijk",
      },
      {
        id: "k4",
        title: "Minder vlees, meer smaak: vijf groenterecepten waar zelfs vleeseters voor vallen",
        image: asset("koken/groentebowl.jpg"),
        label: "Gezond",
        intro:
          "Geroosterde zoete aardappel, kikkererwten en een frisse dressing: met deze combinaties mis je het stukje vlees geen moment.",
      },
      {
        id: "k5",
        title: "Tafelen zoals in Azië: zo pak je een gezellig deelmaal voor vrienden aan",
        image: asset("koken/tafel.jpg"),
        focus: "40% center",
      },
    ],
  },
  {
    id: "achterklap",
    label: "Achterklap",
    inline: false,
    stories: [
      {
        id: "a1",
        title: "Bekend tv-koppel geniet van zonnige vakantie: “Even helemaal niets moeten”",
        image: asset("68929.png"),
      },
      {
        id: "a2",
        title: "Feestje van het jaar: zo vierden de sterren het einde van de festivalzomer",
        image: asset("c528e.png"),
        label: "Uitgaan",
      },
      {
        id: "a3",
        title: "Bekende Nederlander plant boom met familie: “Een moment om nooit te vergeten”",
        image: asset("2bfd8.png"),
        focus: "30% center",
      },
    ],
  },
];
