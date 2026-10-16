// V2 — CONTENT / DATA ONLY
// Add, remove or edit dishes here without changing the visual design.

const sheet = "../assets/dishes-sheet.webp";
const pexels = "https://images.pexels.com/photos/";

export const dishes = [
  { id:"pad", name:"Pad Thaï", price:9, category:"Plats", emoji:"🍜", photo:"Pad thai.png", desc:"Nouilles de riz sautées façon thaïlandaise avec tofu, œuf, ail, échalote, sauce et cacahuètes. Au choix : porc, poulet ou crevettes.", spicy:true, proteinOptions:["Porc","Poulet","Crevettes"] },

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

  {
    id:"boeuf-huitre",
    name:"Bœuf sauté sauce huître",
    price:8,
    category:"Plats",
    emoji:"🥩",
    photo:"Boeuf sauté sauce huître.png",
    prep:8,
    desc:"Bœuf sauté à la sauce huître avec ail, oignon et champignons de Paris, servi avec du riz thaï. Piment au choix de 0 à 3.",
    spicy:true,
    fixedProtein:"Bœuf",
    proteinOptions:["Bœuf"],
    servedWithRice:true
  },

  {
    id:"bo-bun", name:"Bò Bún au bœuf", price:10.5, category:"Plats", emoji:"🥢", photo:"Bo bun.png", prep:10,
    desc:"Bò bún au bœuf : vermicelles de riz (150 g cuits), bœuf sauté mariné (100 g cru), 2 nems, salade, carotte, concombre, menthe, coriandre, oignons frits et cacahuètes concassées (10 g). Sauce nuoc-mâm servie à part. Les cacahuètes sont incluses dans le prix.",
    allergens:"Allergènes : arachides (cacahuètes). Présence possible de gluten, soja, sésame, poisson et crustacés selon les nems, marinades et sauces utilisées ; à confirmer sur les étiquettes fournisseurs.", spicy:false, fixedProtein:"Bœuf", proteinOptions:["Bœuf"], position:3
  },

  { id:"riz-saute", name:"Riz sauté façon thaï", price:9, category:"Plats", emoji:"🍚", photo:"Riz frit poulet.png", desc:"Riz sauté thaï préparé avec œuf, ail, carottes et coriandre. Au choix : porc, poulet ou crevettes.", spicy:false, proteinOptions:["Porc","Poulet","Crevettes"] },

  { id:"tom-kha-kai", name:"Tom kha kai", price:7, category:"Plats", emoji:"🥥", photo:"Tom kha kai.png", desc:"Soupe thaïlandaise au lait de coco et poulet, avec citronnelle, galanga, feuilles de combava et échalote. Piment au choix de 0 à 3.", spicy:true, servedWithRice:true },

  { id:"soupe-nouille-boeuf", name:"Soupe de nouilles au bœuf", price:9, category:"Plats", emoji:"🍜", photo:"Soupe de nouille au bœuf.png", desc:"Soupe de nouilles de riz au bœuf, servie dans un bouillon parfumé avec des boulettes de viande et de la coriandre. Piment au choix.", spicy:true },

  { id:"spring", name:"Rouleau de printemps", price:1.5, category:"Entrées", emoji:"🌯", photo:"Rouleau de printemps.png", desc:"Rouleau aux crevettes, salade, carotte, menthe, coriandre et nouilles chinoises, roulé dans une feuille de riz. Servi avec sa sauce.", spicy:false, cartAdjustable:true },

  {
    id:"salade-papaye",
    name:"Salade de papaye",
    price:6,
    category:"Entrées",
    emoji:"🥗",
    photo:"Salade papaye.png",
    desc:"Salade thaïlandaise de papaye verte râpée, carotte, tomate et citron vert, assaisonnée d’une sauce parfumée et parsemée de cacahuètes.",
    spicy:false
  },

  {
    id:"salade-viande-herbes",
    name:"Salade thaïe de viande hachée aux herbes fraîches",
    price:10,
    colleaguePrice:8,
    prepNotes:"Base : 1 échalote, 2 branches de menthe et ½ branche de citronnelle.",
    category:"Plats",
    emoji:"🥗",
    photo:"Salade thaïe de viande hachée aux herbes fraîches.png",
    desc:"Salade thaïe de viande hachée aux herbes fraîches, servie avec du riz.",
    spicy:true,
    proteinOptions:["Porc","Poulet"],
    servedWithRice:true
  },

  {
    id:"red-curry-soup",
    name:"Soupe de curry rouge",
    price:8,
    category:"Plats",
    emoji:"🍛",
    photo:"Soupe de curry rouge.png",
    desc:"Soupe thaïlandaise au curry rouge, lait de coco, feuilles de combava et légumes. Au choix : poulet, porc ou bœuf.",
    spicy:true,
    proteinOptions:["Porc","Poulet","Bœuf"],
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
    proteinOptions:["Porc","Poulet","Bœuf"],
    servedWithRice:true
  },

  {
    id:"sticky-rice-mangue",
    name:"Riz gluant à la mangue",
    price:6,
    category:"Desserts",
    emoji:"🥭",
    photo:"Sticky rice.png",
    desc:"Riz gluant au lait de coco, accompagné de mangue fraîche, de graines de sésame et d’une touche de sucre.",
    spicy:false
  },

  {
    id:"nems-maison",
    name:"Nems maison façon thaï",
    price:0.75,
    photo:"Nem.png",
    desc:"Nems maison au poulet, croustillants, préparés selon une recette traditionnelle thaïlandaise.",
    category:"Entrées",
    spicy:false,
    promo:"4 achetés + 1 offert",
    cartAdjustable:true
  }
];

export const categories=["Entrées","Plats","Desserts","Boissons"];
export const serviceWindows=[{label:"Service midi",start:"11:30",end:"14:00"},{label:"Service soir",start:"18:30",end:"21:00"}];
export const preparation={pad:{base:8,extra:2},"chicken-massena":{base:8,extra:1},"poulet-cajoux":{base:8,extra:1},"boeuf-huitre":{base:8,extra:1},"salade-papaye":{base:5,extra:1},"riz-saute":{base:8,extra:1},"tom-kha-kai":{base:8,extra:1},"soupe-nouille-boeuf":{base:8,extra:1},spring:{base:1.5,extra:.3},mango:{base:2,extra:.5}};
