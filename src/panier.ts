import type { LignePanier, Produit } from "./types";

/**
 * Ajoute un produit au panier.
 * - Si le produit n'y est pas : ajoute une ligne avec quantité 1.
 * - S'il y est déjà : augmente sa quantité de 1.
 * Ne modifie pas le panier reçu : renvoie un NOUVEAU panier.
 */
export function ajouterAuPanier(
  panier: LignePanier[],
  produit: Produit
): LignePanier[] {
  // 1. Le produit est-il déjà dans le panier ?
  const produitPresent = panier.some(
    (ligne) => ligne.produit.id === produit.id
  );

  // 2. Non : on ajoute une nouvelle ligne
  if (!produitPresent) {
    return [...panier, { produit, quantite: 1 }];
  }

  // 3. Oui : on recopie chaque ligne en incrémentant celle du produit
  return panier.map((ligne) =>
  ligne.produit.id === produit.id
    ? { ...ligne, quantite: Math.min(ligne.quantite + 1, produit.stock) }
    : ligne
);
}

/**
 * Retire un produit du panier par son id.
 * Renvoie un NOUVEAU panier sans la ligne correspondante.
 */
export function retirerDuPanier(
  panier: LignePanier[],
  idProduit: number
): LignePanier[] {
  return panier.filter((ligne) => ligne.produit.id !== idProduit);
}

/**
 * Nombre total d'articles dans le panier (somme des quantités).
 * Pour un panier vide, renvoie 0.
 */
export function nombreArticles(panier: LignePanier[]): number {
  return panier.reduce((total, ligne) => total + ligne.quantite, 0);
}

/**
 * Total du panier en francs CFA (somme des prix × quantités).
 * Pour un panier vide, renvoie 0.
 */
export function totalPanier(panier: LignePanier[]): number {
  return panier.reduce(
    (total, ligne) => total + ligne.produit.prix * ligne.quantite,
    0
  );
}

export function changerQuantite(
  panier: LignePanier[],
  idProduit: number,
  delta: number
): LignePanier[] {
  return panier
    .map((ligne) => {
      if (ligne.produit.id !== idProduit) return ligne;
      const nouvelle = ligne.quantite + delta;
      // on ne dépasse jamais le stock
      return { ...ligne, quantite: Math.min(nouvelle, ligne.produit.stock) };
    })
    .filter((ligne) => ligne.quantite > 0);

}



