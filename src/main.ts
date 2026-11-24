import type { Produit } from "./types";
import { catalogue } from "./catalogue";
import { formatPrix } from "./outils";
import "./style.css";
console.log("La boutique démarre");

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
  // 1. L'élément racine : un <article> avec la classe "carte"
  const carte = document.createElement("article");
  carte.className = "carte";

  // 2. Le titre <h3> avec le nom du produit
  const titre = document.createElement("h3");
  titre.textContent = produit.nom;

  // 3. Le paragraphe <p> avec la classe "prix" et le prix formaté
  const prix = document.createElement("p");
  prix.className = "prix";
  prix.textContent = formatPrix(produit.prix);

  // 4. Le bouton « Ajouter au panier » (ou « Épuisé » si stock = 0)
  const bouton = document.createElement("button");
  bouton.type = "button";
  if (produit.stock === 0) {
    bouton.textContent = "Épuisé";
    bouton.disabled = true;
  } else {
    bouton.textContent = "Ajouter au panier";
  }

  // 5. On assemble tout dans la carte
  carte.append(titre, prix, bouton);

  // 6. On renvoie la carte, SANS l'ajouter à la page
  return carte;
}

function afficherCatalogue(): void {
  // On crée une carte par produit du catalogue
  const cartes = catalogue.map(creerCarte);
  // On vide zoneCatalogue et on y place toutes les cartes d'un coup
  zoneCatalogue.replaceChildren(...cartes);
}

// À la fin de main.ts :
afficherCatalogue();