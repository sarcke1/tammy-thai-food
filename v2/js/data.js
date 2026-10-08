// V2 — CONTENT / DATA ONLY
// Add, remove or edit dishes here without changing the visual design.

const sheet = "../assets/dishes-sheet.webp";
const pexels = "https://images.pexels.com/photos/";

export const dishes = [
  { id:"pad", name:"Pad Thaï", price:9, category:"Plats", emoji:"🍜", photo:"Pad thai.png", desc:"Nouilles de riz sautées façon thaïlandaise avec tofu, œuf, ail, échalote, sauce et cacahuètes. Au choix : crevettes, porc ou poulet.", spicy:true, proteinOptions:["Crevettes","Porc","Poulet"] },

  {
    id:"chicken-massena",
    name:"Chicken Massena",
    price:8,
    category:"Plats",
    emoji:"🥜",
    photo:"Chicken massena.png",
    prep:8,
    desc:"Poulet au curry Massena, préparé avec lait de coco, oignon, sucre et pomme de terre. Servi avec du riz thaï et relevé avec un piment niveau 1.",
    spicy:true,
    fixedSpice:1,
    fixedProtein:"Poulet",
    proteinOptions:["Poulet"],
    servedWithRice:true
  },

  {
    id:"poulet-cajoux",
    name:"Sauté de poulet aux noix de cajou",
    price:8,
    category:"Plats",
    emoji:"🥜",
    photo:"Sauté poulet cajoux.png",
    prep:8,
    desc:"Poulet sauté aux noix de cajou, poivrons rouges et verts, oignons et cibettes dans une sauce thaïlandaise savoureuse. Servi avec du riz thaï.",
    spicy:false,
    fixedProtein:"Poulet",
    proteinOptions:["Poulet"],
    servedWithRice:true
  },

  { id:"riz-saute", name:"Riz sauté au choix", price:9, category:"Plats", emoji:"🍚", photo:"Riz frit poulet.png", desc:"Riz sauté thaïlandais préparé avec œuf, ail, carotte, sauce et coriandre. Au choix : poulet, bœuf, porc ou crevettes.", spicy:false },

  { id:"tom-kha-kai", name:"Tom kha kai", price:7, category:"Plats", emoji:"🥥", photo:"Tom kha kai.png", desc:"Soupe thaïlandaise au lait de coco et poulet, avec citronnelle, galanga, feuilles de combava et échalote. Piment au choix de 0 à 3.", spicy:true, servedWithRice:true },

  { id:"soupe-nouille-boeuf", name:"Soupe de nouille au bœuf", price:9, category:"Plats", emoji:"🍜", photo:"Soupe de nouille au bœuf.png", desc:"Soupe de nouilles de riz au bœuf, servie dans un bouillon parfumé avec des boulettes de viande et de la coriandre. Piment au choix.", spicy:true },

  { id:"spring", name:"Rouleau de printemps", price:1.5, category:"Entrées", emoji:"🌯", photo:"Rouleau de printemps.png", desc:"Rouleau de printemps aux crevettes, salade, carotte, menthe, coriandre et nouilles chinoises, roulé dans une feuille de riz. Servi avec sa sauce.", spicy:false, cartAdjustable:true },

  {
    id:"red-curry-soup",
    name:"Soupe de curry rouge",
    price:8,
    category:"Plats",
    emoji:"🍛",
    photo:"Soupe de curry rouge.png",
    desc:"Soupe thaïlandaise au curry rouge, lait de coco, feuilles de combava et légumes. Au choix : poulet, porc ou bœuf.",
    spicy:true,
    proteinOptions:["Poulet","Porc","Bœuf"],
    servedWithRice:true
  },

  {
    id:"green-curry-soup",
    name:"Soupe de curry vert",
    price:8,
    category:"Plats",
    emoji:"🍛",
    photo:"soupe de curry vert.png",
    desc:"Soupe thaïlandaise au curry vert, lait de coco, aubergines thaïes, basilic thaï et légumes. Au choix : poulet, porc ou bœuf.",
    spicy:true,
    proteinOptions:["Poulet","Porc","Bœuf"],
    servedWithRice:true
  },

  {
    id:"nems-maison",
    name:"Nems maison",
    price:0.75,
    photo:"Nem.png",
    desc:"Nems maison croustillants préparés selon une recette traditionnelle thaïlandaise.",
    category:"Entrées",
    spicy:false,
    promo:"4 achetés + 1 offert",
    cartAdjustable:true
  }
];

export const categories=["Entrées","Plats","Desserts","Boissons"];
export const serviceWindows=[{label:"Service midi",start:"11:30",end:"14:00"},{label:"Service soir",start:"18:30",end:"21:00"}];
export const preparation={pad:{base:8,extra:2},"chicken-massena":{base:8,extra:1},"poulet-cajoux":{base:8,extra:1},"riz-saute":{base:8,extra:1},"tom-kha-kai":{base:8,extra:1},"soupe-nouille-boeuf":{base:8,extra:1},spring:{base:1.5,extra:.3},mango:{base:2,extra:.5}};
