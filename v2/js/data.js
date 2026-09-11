// V2 — CONTENT / DATA ONLY
// Add, remove or edit dishes here without changing the visual design.

export const dishes = [
  { id:"pad", name:"Pad Thaï", price:11, category:"Plats", emoji:"🍜", desc:"Nouilles de riz sautées, crevettes, œuf, tofu, pousses de soja et cacahuètes.", spicy:true },
  { id:"jour", name:"Plat thaï du jour", price:9, category:"Plats", emoji:"🍛", desc:"Une recette thaï différente selon les jours.", spicy:true },
  { id:"kids", name:"Menu enfant", price:6, category:"Plats", emoji:"🍗", desc:"2 pilons de poulet frit + frites, ou 2 nems + riz.", spicy:false },
  { id:"nems", name:"Nems", price:1, category:"Entrées", emoji:"🥢", desc:"Nems thaïlandais croustillants, à l’unité.", spicy:false },
  { id:"samoussa", name:"Samoussa", price:1.5, category:"Entrées", emoji:"🥟", desc:"Samoussa croustillant, à l’unité.", spicy:false },
  { id:"spring", name:"Spring roll", price:3, category:"Entrées", emoji:"🌯", desc:"Rouleaux croustillants servis avec une garniture fraîche.", spicy:false },
  { id:"mango", name:"Sticky rice mangue", price:4, category:"Desserts", emoji:"🥭", desc:"Riz gluant au lait de coco et mangue fraîche, selon saison.", spicy:false },
  { id:"cola", name:"Cola", price:2, category:"Boissons", emoji:"🥤", desc:"Boisson fraîche.", spicy:false },
  { id:"ice-tea", name:"Ice Tea", price:2, category:"Boissons", emoji:"🍋", desc:"Thé glacé au citron.", spicy:false },
  { id:"thai-tea", name:"Thai Iced Tea", price:3, category:"Boissons", emoji:"🧋", desc:"Thé glacé thaï traditionnel, servi bien frais.", spicy:false }
];

export const categories = ["Tous", "Plats", "Entrées", "Desserts", "Boissons"];

export const serviceWindows = [
  { label:"Service midi", start:"11:30", end:"14:00" },
  { label:"Service soir", start:"18:30", end:"21:00" }
];

// Preparation rules retained from V1 for the future ordering module.
export const preparation = {
  pad:{base:8,extra:2}, jour:{base:7,extra:2}, kids:{base:5,extra:1.5},
  nems:{base:2,extra:.5}, samoussa:{base:2,extra:.5}, spring:{base:1.5,extra:.3},
  mango:{base:2,extra:.5}, cola:{base:.5,extra:.2}, "ice-tea":{base:.5,extra:.2}, "thai-tea":{base:.7,extra:.2}
};
