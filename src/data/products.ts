import notebookClassic from "@/assets/notebook-classic.jpg";
import notebookSpiral from "@/assets/notebook-spiral.jpg";
import notebookJournal from "@/assets/notebook-journal.jpg";
import notebookEco from "@/assets/notebook-eco.jpg";

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  brand?: string;
  size?: string;
  pages?: number;
  color?: string;
  description?: string;
  stock?: number;
}

export const products: Product[] = [
  {
    id: "p1",
    title: "Classic Hardcover Notebook",
    price: 12.99,
    image: notebookClassic,
    category: "notebooks",
    brand: "Dr. Br.",
    size: "A5",
    pages: 200,
    color: "Midnight Black",
    description: "Premium hardcover notebook with ivory cream pages, ideal for journaling, note-taking, and creative writing. Features a lay-flat binding and ribbon bookmark.",
    stock: 45,
  },
  {
    id: "p2",
    title: "Spiral School Notebook",
    price: 8.50,
    image: notebookSpiral,
    category: "notebooks",
    brand: "Dr. Br.",
    size: "A4",
    pages: 150,
    color: "Ocean Blue",
    description: "Durable spiral-bound notebook with perforated sheets for easy tear-out. Ruled pages perfect for school, college, or office use.",
    stock: 120,
  },
  {
    id: "p3",
    title: "Premium Dot Journal",
    price: 15.00,
    image: notebookJournal,
    category: "journals",
    brand: "Dr. Br.",
    size: "A5",
    pages: 256,
    color: "Forest Green",
    description: "Dot-grid journal with thick 120 GSM paper that prevents bleed-through. Perfect for bullet journaling, sketching, and creative planning.",
    stock: 32,
  },
  {
    id: "p4",
    title: "Eco Recycled Notebook",
    price: 10.75,
    image: notebookEco,
    category: "notebooks",
    brand: "Dr. Br.",
    size: "B5",
    pages: 180,
    color: "Natural Kraft",
    description: "100% recycled paper notebook with a minimalist kraft cover. Eco-friendly and sustainable — great for everyday notes and to-do lists.",
    stock: 78,
  },
];

export const featuredProducts: Product[] = [
  { id: "f1", title: "Signature Notebook", price: 18.00, image: notebookClassic, category: "notebooks", brand: "Dr. Br.", size: "A5", pages: 240, color: "Charcoal", description: "Our signature notebook with premium paper and elegant cover.", stock: 25 },
  { id: "f2", title: "Minimalist Planner", price: 22.50, image: notebookSpiral, category: "planners", brand: "Dr. Br.", size: "A5", pages: 192, color: "Ivory White", description: "Clean, undated planner for organizing your life with style.", stock: 40 },
  { id: "f3", title: "Leather Journal", price: 34.00, image: notebookJournal, category: "journals", brand: "Dr. Br.", size: "A5", pages: 320, color: "Rich Brown", description: "Hand-stitched genuine leather journal for the discerning writer.", stock: 12 },
  { id: "f4", title: "Pocket Notebook", price: 6.75, image: notebookEco, category: "notebooks", brand: "Dr. Br.", size: "A6", pages: 96, color: "Sky Blue", description: "Compact pocket notebook that fits anywhere. Jot ideas on the go.", stock: 200 },
  { id: "f5", title: "Eco Notebook", price: 11.20, image: notebookEco, category: "notebooks", brand: "Dr. Br.", size: "A5", pages: 160, color: "Sage Green", description: "Sustainable notebook made from responsibly sourced materials.", stock: 65 },
  { id: "f6", title: "Dot Journal XL", price: 20.00, image: notebookJournal, category: "journals", brand: "Dr. Br.", size: "A4", pages: 300, color: "Dusty Rose", description: "Extra-large dot journal for expansive creative projects.", stock: 18 },
];

export const allProducts = [...products, ...featuredProducts];
