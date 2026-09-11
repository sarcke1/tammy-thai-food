// V2 — CONTENT / DATA ONLY
// Add, remove or edit dishes here without changing the visual design.

const sheet = "../assets/dishes-sheet.webp";
const pexels = "https://images.pexels.com/photos/";

export const dishes = [
  { id:"pad", name:"Pad Thaï", price:11, category:"Plats", emoji:"🍜", photo:sheet, position:"0% 0%", desc:"Nouilles de riz sautées, crevettes, œuf, tofu, pousses de soja et cacahuètes.", spicy:true },
  { id:"jour", name:"Plat thaï du jour", price:9, category:"Plats", emoji:"🍛", photo:sheet, position:"33.333% 0%", desc:"Une recette thaï différente selon les jours.", spicy:true },
  { id:"kids", name:"Menu enfant", price:6, category:"Plats", emoji:"🍗", photo:pexels+"36879224/pexels-photo-36879224.jpeg?auto=compress&cs=tinysrgb&w=900", desc:"2 pilons de poulet frit + frites, ou 2 nems + riz.", spicy:false },
  { id:"nems", name:"Nems", price:1, category:"Entrées", emoji:"🥢", photo:pexels+"12356601/pexels-photo-12356601.jpeg?auto=compress&cs=tinysrgb&w=900", desc:"Nems thaïlandais croustillants, à l’unité.", spicy:false },
  { id:"samoussa", name:"Samoussa", price:1.5, category:"Entrées", emoji:"🥟", photo:pexels+"28075291/pexels-photo-28075291.jpeg?auto=compress&cs=tinysrgb&w=900", desc:"Samoussa croustillant, à l’unité.", spicy:false },
  { id:"spring", name:"Spring roll", price:3, category:"Entrées", emoji:"🌯", photo:pexels+"840216/pexels-photo-840216.jpeg?auto=compress&cs=tinysrgb&w=900", desc:"Rouleaux croustillants servis avec une garniture fraîche.", spicy:false },
  { id:"mango", name:"Sticky rice mangue", price:4, category:"Desserts", emoji:"🥭", photo:sheet, position:"100% 100%", desc:"Riz gluant au lait de coco et mangue fraîche, selon saison.", spicy:false },
  { id:"cola", name:"Cola", price:2, category:"Boissons", emoji:"🥤", photo:pexels+"844875/pexels-photo-844875.jpeg?auto=compress&cs=tinysrgb&w=900", desc:"Boisson fraîche.", spicy:false },
  { id:"ice-tea", name:"Ice Tea", price:2, category:"Boissons", emoji:"🍋", photo:pexels+"20240640/pexels-photo-20240640.jpeg?auto=compress&cs=tinysrgb&w=900", desc:"Thé glacé au citron.", spicy:false },
  { id:"thai-tea", name:"Thai Iced Tea", price:3, category:"Boissons", emoji:"🧋", photo:pexels+"32751729/pexels-photo-32751729.jpeg?auto=compress&cs=tinysrgb&w=900", desc:"Thé glacé thaï traditionnel, servi bien frais.", spicy:false }
];

export const categories = ["Tous", "Plats", "Entrées", "Desserts", "Boissons"];

export const serviceWindows = [
  { label:"Service midi", start:"11:30", end:"14:00" },
  { label:"Service soir", start:"18:30", end:"21:00" }
];

export const preparation = {
  pad:{base:8,extra:2}, jour:{base:7,extra:2}, kids:{base:5,extra:1.5},
  nems:{base:2,extra:.5}, samoussa:{base:2,extra:.5}, spring:{base:1.5,extra:.3},
  mango:{base:2,extra:.5}, cola:{base:.5,extra:.2}, "ice-tea":{base:.5,extra:.2}, "thai-tea":{base:.7,extra:.2}
};
