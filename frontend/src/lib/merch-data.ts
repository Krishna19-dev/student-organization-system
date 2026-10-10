export interface SizeVariant {
  size: string;
  initialStock: number;
  sold: number;
  stock: number; // Available stock (initialStock - sold + manual adjustments)
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  size: string;
  change: number; // positive for addition, negative for reduction/damaged
  previousStock: number;
  newStock: number;
  reason: string;
  adminName: string;
  timestamp: string;
}

export interface MerchProduct {
  id: string;
  sku: string;
  name: string;
  category: "Apparel" | "Gear" | "Drinkware" | "Headwear" | "Stationery" | "Footwear" | "Accessories";
  price: number;
  memberPrice: number;
  description: string;
  image: string;
  badge: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  variants: SizeVariant[];
  createdAt: string;
}

export const INITIAL_MERCH_PRODUCTS: MerchProduct[] = [
  {
    id: "mch-0",
    sku: "ODO-TSH-001",
    name: "Official Odoo Classic White Campus T-Shirt",
    category: "Apparel",
    badge: "badge-primary",
    image: "/images/merch/odoo-tshirt.jpg",
    price: 499,
    memberPrice: 425,
    description: "Premium 240 GSM 100% combed ringspun cotton crewneck tee featuring front Odoo bold logo and rear nape signature crest. Breathable, pre-shrunk daily wear fit.",
    status: "ACTIVE",
    createdAt: "2026-09-15",
    variants: [
      { size: "XS", initialStock: 10, sold: 3, stock: 7 },
      { size: "S", initialStock: 25, sold: 11, stock: 14 },
      { size: "M", initialStock: 45, sold: 17, stock: 28 },
      { size: "L", initialStock: 35, sold: 13, stock: 22 },
      { size: "XL", initialStock: 20, sold: 10, stock: 10 },
    ],
  },
  {
    id: "mch-1",
    sku: "ODO-TOT-002",
    name: "Official Odoo Canvas Tote Bag",
    category: "Gear",
    badge: "badge-primary",
    image: "/images/merch/odoo-tote-bag.jpg",
    price: 399,
    memberPrice: 339,
    description: "Eco-friendly heavy-duty canvas tote bag featuring official embroidered Odoo signature branding. Reinforced handles with ample 18L storage capacity.",
    status: "ACTIVE",
    createdAt: "2026-09-18",
    variants: [
      { size: "One Size", initialStock: 50, sold: 15, stock: 35 },
    ],
  },
  {
    id: "mch-2",
    sku: "ODO-BTL-003",
    name: "Odoo Insulated Stainless Steel Water Bottle",
    category: "Drinkware",
    badge: "badge-secondary",
    image: "/images/merch/odoo-water-bottle.jpg",
    price: 499,
    memberPrice: 420,
    description: "Premium double-wall vacuum insulated stainless steel water bottle with ergonomic carry loop lid. Keeps cold for 24h and hot for 12h.",
    status: "ACTIVE",
    createdAt: "2026-09-20",
    variants: [
      { size: "750ml", initialStock: 40, sold: 16, stock: 24 },
    ],
  },
  {
    id: "mch-3",
    sku: "ODO-CAP-004",
    name: "Odoo Classic Structured Campus Cap",
    category: "Headwear",
    badge: "badge-info",
    image: "/images/merch/odoo-cap.jpg",
    price: 349,
    memberPrice: 295,
    description: "Clean minimalist 6-panel structured cotton twill cap with embroidered Odoo crest, breathable eyelets, and adjustable brass buckle strap.",
    status: "ACTIVE",
    createdAt: "2026-09-22",
    variants: [
      { size: "Adjustable", initialStock: 55, sold: 15, stock: 40 },
    ],
  },
  {
    id: "mch-4",
    sku: "ODO-NTB-005",
    name: "Odoo Executive Hardcover Notebook & Pen Gift Set",
    category: "Stationery",
    badge: "badge-warning",
    image: "/images/merch/odoo-notebook-pen-set.jpg",
    price: 549,
    memberPrice: 465,
    description: "Matte black debossed leatherette A5 notebook with signature magenta ribbon bookmark and pen loop, bundled with premium dual rollerball pens in presentation box.",
    status: "ACTIVE",
    createdAt: "2026-09-25",
    variants: [
      { size: "Set", initialStock: 30, sold: 12, stock: 18 },
    ],
  },
  {
    id: "mch-5",
    sku: "ODO-SNK-006",
    name: "Odoo Signature Colorblock Campus Sneakers",
    category: "Footwear",
    badge: "badge-primary",
    image: "/images/merch/odoo-sneakers.jpg",
    price: 1499,
    memberPrice: 1275,
    description: "Limited collector-edition low-top canvas skate sneakers with custom suede purple accents, emerald toe cap, and vulcanized rubber sole.",
    status: "ACTIVE",
    createdAt: "2026-09-28",
    variants: [
      { size: "UK 7", initialStock: 10, sold: 4, stock: 6 },
      { size: "UK 8", initialStock: 20, sold: 8, stock: 12 },
      { size: "UK 9", initialStock: 18, sold: 8, stock: 10 },
      { size: "UK 10", initialStock: 10, sold: 6, stock: 4 },
    ],
  },
];

export const INITIAL_STOCK_ADJUSTMENTS: StockAdjustment[] = [
  {
    id: "ADJ-1001",
    productId: "mch-0",
    productName: "Official Odoo Classic White Campus T-Shirt",
    size: "M",
    change: +10,
    previousStock: 18,
    newStock: 28,
    reason: "New supplier shipment batch received (Box #04)",
    adminName: "Krishna Choudhary",
    timestamp: "Oct 08, 2026 14:32",
  },
  {
    id: "ADJ-1002",
    productId: "mch-5",
    productName: "Odoo Signature Colorblock Campus Sneakers",
    size: "UK 10",
    change: -2,
    previousStock: 6,
    newStock: 4,
    reason: "Damaged packaging in storage warehouse",
    adminName: "Krishna Choudhary",
    timestamp: "Oct 06, 2026 11:15",
  },
  {
    id: "ADJ-1003",
    productId: "mch-1",
    productName: "Official Odoo Canvas Tote Bag",
    size: "One Size",
    change: +15,
    previousStock: 20,
    newStock: 35,
    reason: "Campus event restock delivery",
    adminName: "Krishna Choudhary",
    timestamp: "Oct 04, 2026 09:40",
  },
];

export const AVAILABLE_MERCH_IMAGES = [
  { label: "Classic White T-Shirt", path: "/images/merch/odoo-tshirt.jpg" },
  { label: "Canvas Tote Bag", path: "/images/merch/odoo-tote-bag.jpg" },
  { label: "Insulated Water Bottle", path: "/images/merch/odoo-water-bottle.jpg" },
  { label: "Structured Campus Cap", path: "/images/merch/odoo-cap.jpg" },
  { label: "Notebook & Pen Set", path: "/images/merch/odoo-notebook-pen-set.jpg" },
  { label: "Colorblock Sneakers", path: "/images/merch/odoo-sneakers.jpg" },
];
