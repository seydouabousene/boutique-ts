
import type { LignePanier } from "./types";
import type { Produit } from "./types";
import { catalogue } from "./catalogue";
import { formatPrix } from "./outils";
import "./style.css";
import {
  ajouterAuPanier,
  retirerDuPanier,
  nombreArticles,
  totalPanier,
  changerQuantite,    // ← seulement si tu l'as ajoutée à panier.ts
} from "./panier";
console.log("La boutique démarre"); 

let panier: LignePanier[] = [];
function creerLignePanier(ligne: LignePanier): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "ligne-panier";

  const texte = document.createElement("span");
  texte.textContent = `${ligne.quantite} x ${ligne.produit.nom} : ${formatPrix(ligne.produit.prix * ligne.quantite)}`;

  const boutonRetirer = document.createElement("button");
  boutonRetirer.type = "button";
  boutonRetirer.textContent = "Retirer";
  boutonRetirer.addEventListener("click", () => {
    panier = retirerDuPanier(panier, ligne.produit.id);
    afficherPanier();
  });

 const boutonPlus = document.createElement("button");
boutonPlus.type = "button";
boutonPlus.textContent = "+";
boutonPlus.addEventListener("click", () => {
  panier = changerQuantite(panier, ligne.produit.id, +1);
  afficherPanier();
});

const boutonMoins = document.createElement("button");
boutonMoins.type = "button";
boutonMoins.textContent = "−";
boutonMoins.addEventListener("click", () => {
  panier = changerQuantite(panier, ligne.produit.id, -1);
  afficherPanier();
});

li.append(texte, boutonMoins, boutonPlus, boutonRetirer);
return li;   // ← OUBLIÉ dans ton code
}
function afficherPanier(): void {
  if (panier.length === 0) {
    const message = document.createElement("li");
    message.className = "panier-vide";
    message.textContent = "Votre panier est vide";
    listePanier.replaceChildren(message);
  } else {
    const lignes = panier.map(creerLignePanier);
    listePanier.replaceChildren(...lignes);
  }

  zoneTotal.textContent = formatPrix(totalPanier(panier));
  compteur.textContent = String(nombreArticles(panier));
}

function trouver<T extends HTMLElement>(selecteur: string): T {
  const element = document.querySelector<T>(selecteur);
  if (element === null) {
    throw new Error(`Élément ${selecteur} introuvable : vérifiez index.html.`);
  }
  return element;
}

const zoneCatalogue   = trouver<HTMLDivElement>("#catalogue");
const listePanier     = trouver<HTMLUListElement>("#lignes-panier");
const zoneTotal       = trouver<HTMLElement>("#total");
const compteur        = trouver<HTMLSpanElement>("#compteur");
const champRecherche  = trouver<HTMLInputElement>("#recherche");
const filtreCategorie = trouver<HTMLSelectElement>("#filtre-categorie");

function creerCarte(produit: Produit): HTMLElement {
  const carte = document.createElement("article");
  carte.className = "carte";

  const titre = document.createElement("h3");
  titre.textContent = produit.nom;

  const prix = document.createElement("p");
  prix.className = "prix";
  prix.textContent = formatPrix(produit.prix);

  const bouton = document.createElement("button");
  bouton.type = "button";
  if (produit.stock === 0) {
    bouton.textContent = "Épuisé";
    bouton.disabled = true;
    // ⚠️ Pas d'addEventListener ici : un bouton disabled ne déclenche pas le clic
  } else {
    bouton.textContent = "Ajouter au panier";
    bouton.addEventListener("click", () => {
      panier = ajouterAuPanier(panier, produit);
      afficherPanier();
    });
  }

  carte.append(titre, prix, bouton);
  return carte;
}

function afficherCatalogue(): void {
  const texte = champRecherche.value.trim().toLowerCase();
  const categorie = filtreCategorie.value;

  const produits = catalogue.filter(
    (p) =>
      p.nom.toLowerCase().includes(texte) &&
      (categorie === "" || p.categorie === categorie)
  );

  zoneCatalogue.replaceChildren(...produits.map(creerCarte));
}

champRecherche.addEventListener("input", afficherCatalogue);
filtreCategorie.addEventListener("change", afficherCatalogue);

// À la fin de main.ts :
afficherCatalogue();
afficherPanier();   // ← initialise l'affichage du panier vide