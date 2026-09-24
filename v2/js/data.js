// V2 — CONTENT / DATA ONLY
// Add, remove or edit dishes here without changing the visual design.

const sheet = "../assets/dishes-sheet.webp";
const pexels = "https://images.pexels.com/photos/";

export const dishes = [
  { id:"pad", name:"Pad Thaï", price:11, category:"Plats", emoji:"🍜", photo:"Pad thai.png", desc:"Nouilles de riz sautées façon thaïlandaise avec tofu, œuf, ail, échalote, sauce et cacahuètes. Au choix : crevettes, porc ou poulet.", spicy:true, proteinOptions:["Crevettes","Porc","Poulet"] },
  { id:"chicken-massena", name:"Chicken Massena", price:11, category:"Plats", emoji:"🥜", photo:"Chicken massena.png", prep:8, desc:"Poulet sauté aux noix de cajou, poivrons rouges et verts, oignons et cibettes dans une sauce thaïlandaise savoureuse. Servi avec 150 g de riz jasmin.", spicy:false },
  { id:"jour", name:"Plat thaï du jour", price:9, category:"Plats", emoji:"🍛", photo:sheet, position:"33.333% 0%", desc:"Une recette thaï différente selon les jours.", spicy:true },
  { id:"riz-saute", name:"Riz sauté au choix", price:10, category:"Plats", emoji:"🍚", photo:"Riz frit poulet.png", desc:"Riz sauté thaïlandais préparé avec œuf, ail, carotte, sauce et coriandre. Au choix : poulet, bœuf, porc ou crevettes.", spicy:false },
  { id:"tom-kha-kai", name:"Tom kha kai", price:9, category:"Plats", emoji:"🥥", photo:"Tom kha kai.png", desc:"Soupe thaïlandaise au lait de coco et poulet, avec citronnelle, galanga, feuilles de combava et échalote. Piment au choix de 0 à 3.", spicy:true },
  { id:"spring", name:"Rouleau de printemps", price:2, category:"Entrées", emoji:"🌯", photo:"Rouleau de printemps.png", desc:"Rouleau de printemps aux crevettes, salade, carotte, menthe, coriandre et nouilles chinoises, roulé dans une feuille de riz. Servi avec sa sauce.", spicy:false },
  { id:"mango", name:"Sticky rice mangue", price:4, category:"Desserts", emoji:"🥭", photo:sheet, position:"100% 100%", desc:"Riz gluant au lait de coco et mangue fraîche, selon saison.", spicy:false },
  { id:"ice-tea", name:"Ice Tea", price:2, category:"Boissons", emoji:"🍋", photo:pexels+"20240640/pexels-photo-20240640.jpeg?auto=compress&cs=tinysrgb&w=900", desc:"Thé glacé au citron.", spicy:false },
  { id:"thai-tea", name:"Thai Iced Tea", price:3, category:"Boissons", emoji:"🧋", photo:pexels+"32751729/pexels-photo-32751729.jpeg?auto=compress&cs=tinysrgb&w=900", desc:"Thé glacé thaï traditionnel, servi bien frais.", spicy:false }
];

export const categories = ["Tous", "Plats", "Entrées", "Desserts", "Boissons"];
export const serviceWindows=[{label:"Service midi",start:"11:30",end:"14:00"},{label:"Service soir",start:"18:30",end:"21:00"}];
export const preparation={pad:{base:8,extra:2},"chicken-massena":{base:8,extra:1},jour:{base:7,extra:2},"riz-saute":{base:8,extra:1},"tom-kha-kai":{base:8,extra:1},spring:{base:1.5,extra:.3},mango:{base:2,extra:.5},"ice-tea":{base:.5,extra:.2},"thai-tea":{base:.7,extra:.2}};