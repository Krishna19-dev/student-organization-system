export interface MerchSize {
  size: string;
  stock: number;
  available: boolean;
}

export interface MerchProduct {
  id: string;
  name: string;
  category: string;
  badge: string;
  image: string;
  price: number;
  memberPrice: number;
  description: string;
  sizes: MerchSize[];
  inStock: boolean;
}

export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    id: "mch-0",
    name: "Classic Odoo Developer T-Shirt",
    category: "Apparel",
    badge: "Apparel",
    image: "/images/merch/odoo-tshirt.jpg",
    price: 599,
    memberPrice: 479,
    description: "Ultra-comfortable 100% combed ringspun cotton tee with durable screen-printed front branding. Pre-shrunk fabric tailored for everyday campus wear.",
    sizes: [
      { size: "S", stock: 14, available: true },
      { size: "M", stock: 28, available: true },
      { size: "L", stock: 22, available: true },
      { size: "XL", stock: 0, available: false },
    ],
    inStock: true,
  },
  {
    id: "mch-1",
    name: "Official Odoo Canvas Tote Bag",
    category: "Gear",
    badge: "Gear",
    image: "/images/merch/odoo-tote-bag.jpg",
    price: 399,
    memberPrice: 319,
    description: "Eco-friendly heavy-duty canvas tote bag featuring official embroidered signature branding. Reinforced handles with ample 18L storage capacity.",
    sizes: [
      { size: "One Size", stock: 35, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-2",
    name: "Insulated Stainless Steel Water Bottle",
    category: "Drinkware",
    badge: "Drinkware",
    image: "/images/merch/odoo-water-bottle.jpg",
    price: 499,
    memberPrice: 399,
    description: "Premium double-wall vacuum insulated stainless steel water bottle with ergonomic carry loop lid. Keeps cold for 24h and hot for 12h.",
    sizes: [
      { size: "750ml", stock: 24, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-3",
    name: "Classic Structured Campus Cap",
    category: "Headwear",
    badge: "Headwear",
    image: "/images/merch/odoo-cap.jpg",
    price: 349,
    memberPrice: 279,
    description: "Clean minimalist 6-panel structured cotton twill cap with embroidered crest, breathable eyelets, and adjustable brass buckle strap.",
    sizes: [
      { size: "Adjustable", stock: 40, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-4",
    name: "Executive Hardcover Notebook & Pen Set",
    category: "Stationery",
    badge: "Stationery",
    image: "/images/merch/odoo-notebook-pen-set.jpg",
    price: 549,
    memberPrice: 439,
    description: "Matte black debossed leatherette A5 notebook with signature ribbon bookmark, bundled with premium dual rollerball pens in presentation box.",
    sizes: [
      { size: "Standard Set", stock: 18, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-5",
    name: "Custom Campus Limited Sneakers",
    category: "Footwear",
    badge: "Footwear",
    image: "/images/merch/odoo-sneakers.jpg",
    price: 1999,
    memberPrice: 1599,
    description: "Signature low-top skate sneakers featuring dual-tone plum and teal color accents, cushioned EVA midsoles, and vulcanized rubber grip outsoles.",
    sizes: [
      { size: "UK 7", stock: 6, available: true },
      { size: "UK 8", stock: 12, available: true },
      { size: "UK 9", stock: 9, available: true },
      { size: "UK 10", stock: 0, available: false },
    ],
    inStock: true,
  },
];
