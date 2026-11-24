export type Categorie = "vetements" | "chaussures" | "accessoires" | "maison";

export type Produit = {
  readonly id: number;
  nom: string;
  prix: number;        // en francs CFA
  categorie: Categorie;
  stock: number;
  image?: string;      // facultatif (le bonus)
};

export type LignePanier = {
  produit: Produit;
  quantite: number;
};
