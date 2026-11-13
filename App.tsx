import { FlatList, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { calculerStatistiques, evenements, filtrerEvenements, placesRestantes, statutEvenement } from './evenements';
import type { Evenement, Mode, Statut } from './evenements';

// Remplacer « tous » par « ateliers » pour afficher les ateliers disponibles.
const mode: Mode = 'tous';

const titresMode: Record<Mode, string> = {
  tous: 'Tous les événements',
  ateliers: 'Ateliers disponibles',
};

const couleursStatut: Record<Statut, { fond: string; texte: string }> = {
  Complet: { fond: '#FBE5E3', texte: '#8B312C' },
  'Presque complet': { fond: '#FFF0D6', texte: '#79460C' },
  Ouvert: { fond: '#DFEEE2', texte: '#285E3B' },
};

function BadgeEtat({ statut }: { statut: Statut }) {
  const couleur = couleursStatut[statut];

  return (
    <View style={[styles.badge, { backgroundColor: couleur.fond }]}>
      <Text style={[styles.texteBadge, { color: couleur.texte }]}>{statut}</Text>
    </View>
  );
}

function CarteEvenement({ evenement }: { evenement: Evenement }) {
  const places = placesRestantes(evenement);

  return (
    <View style={styles.carte}>
      <Text style={styles.categorie}>{evenement.categorie}</Text>
      <Text style={styles.titreCarte}>{evenement.titre}</Text>
      <View style={styles.detailsCarte}>
        <Text style={styles.places}>{places} {places > 1 ? 'places libres' : 'place libre'}</Text>
        <BadgeEtat statut={statutEvenement(evenement)} />
      </View>
    </View>
  );
}

type BlocStatistiqueProps = {
  libelle: string;
  valeur: number;
  deuxColonnes: boolean;
};

function BlocStatistique({ libelle, valeur, deuxColonnes }: BlocStatistiqueProps) {
  return (
    <View style={[styles.blocStatistique, { width: deuxColonnes ? '48%' : '100%' }]}>
      <Text style={styles.valeurStatistique}>{valeur}</Text>
      <Text style={styles.libelleStatistique}>{libelle}</Text>
    </View>
  );
}

export default function App() {
  const { width, fontScale } = useWindowDimensions();
  const deuxColonnes = Math.min(width, 640) - 36 >= 260 * fontScale;
  const statistiques = calculerStatistiques(evenements);
  const liste = filtrerEvenements(evenements, mode);
  const indicateurs = [
    { libelle: 'Événements au total', valeur: statistiques.total },
    { libelle: 'Événements complets', valeur: statistiques.complets },
    { libelle: 'Avec des places', valeur: statistiques.avecPlaces },
    { libelle: 'Places restantes', valeur: statistiques.places },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.ecran}>
        <StatusBar barStyle="dark-content" />
        <FlatList
          contentContainerStyle={styles.contenu}
          data={liste}
          keyExtractor={(evenement) => evenement.id}
          renderItem={({ item }) => <CarteEvenement evenement={item} />}
          ListHeaderComponent={
            <View>
              <View style={styles.entete}>
                <Text accessibilityRole="header" style={styles.titre}>CampusAgenda</Text>
                <Text style={styles.sousTitre}>Événements du campus</Text>
              </View>
              <View style={styles.statistiques}>
                {indicateurs.map(({ libelle, valeur }) => (
                  <BlocStatistique
                    key={libelle}
                    libelle={libelle}
                    valeur={valeur}
                    deuxColonnes={deuxColonnes}
                  />
                ))}
              </View>
              <Text accessibilityRole="header" style={styles.titreSection}>{titresMode[mode]}</Text>
            </View>
          }
          ListEmptyComponent={
            <Text style={[styles.carte, styles.places]}>Aucun événement à afficher pour ce mode.</Text>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: '#F5F3EB' },
  contenu: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 18 },
  entete: { backgroundColor: '#153A33', padding: 20, borderRadius: 18, marginBottom: 12 },
  titre: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  sousTitre: { color: '#D6E9DD', fontSize: 15, marginTop: 5 },
  statistiques: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8 },
  blocStatistique: { backgroundColor: '#E6EDE1', borderRadius: 12, padding: 12 },
  valeurStatistique: { color: '#153A33', fontSize: 24, fontWeight: '800' },
  libelleStatistique: { color: '#304D41', fontSize: 13, marginTop: 3 },
  titreSection: { color: '#153A33', fontSize: 22, fontWeight: '700', marginTop: 22, marginBottom: 10 },
  carte: { backgroundColor: '#FFFFFF', borderColor: '#DFE4D9', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 8 },
  categorie: { color: '#486557', fontSize: 12, fontWeight: '700' },
  titreCarte: { color: '#16362E', fontSize: 18, fontWeight: '700', marginTop: 3 },
  detailsCarte: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 8 },
  places: { color: '#40554B', fontSize: 14, flexShrink: 1 },
  badge: { borderRadius: 10, paddingVertical: 4, paddingHorizontal: 8, flexShrink: 1 },
  texteBadge: { fontSize: 12, fontWeight: '700' },
});
