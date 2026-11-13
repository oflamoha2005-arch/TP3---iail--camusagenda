export type Evenement = {
  id: string;
  titre: string;
  categorie: 'Atelier' | 'Conférence' | 'Rencontre';
  capacite: number;
  inscrits: number;
};

export type Statut = 'Complet' | 'Presque complet' | 'Ouvert';
export type Mode = 'tous' | 'ateliers';

export const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

export function placesRestantes(evenement: Evenement): number {
  return Math.max(0, evenement.capacite - evenement.inscrits);
}

export function statutEvenement(evenement: Evenement): Statut {
  const places = placesRestantes(evenement);

  if (places === 0) return 'Complet';
  if (places <= 3) return 'Presque complet';
  return 'Ouvert';
}

export function calculerStatistiques(liste: Evenement[]) {
  const avecPlaces = liste.filter((evenement) => placesRestantes(evenement) > 0);

  return {
    total: liste.length,
    complets: liste.length - avecPlaces.length,
    avecPlaces: avecPlaces.length,
    places: liste.reduce((total, evenement) => total + placesRestantes(evenement), 0),
  };
}

export function filtrerEvenements(liste: Evenement[], mode: Mode): Evenement[] {
  if (mode === 'tous') return liste;

  return liste.filter(
    (evenement) => evenement.categorie === 'Atelier' && placesRestantes(evenement) > 0,
  );
}
