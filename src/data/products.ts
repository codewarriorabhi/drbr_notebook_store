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
}

export const products: Product[] = [
  { id: "p1", title: "Classic Hardcover Notebook", price: 12.99, image: notebookClassic, category: "notebooks" },
  { id: "p2", title: "Spiral School Notebook", price: 8.50, image: notebookSpiral, category: "notebooks" },
  { id: "p3", title: "Premium Dot Journal", price: 15.00, image: notebookJournal, category: "journals" },
  { id: "p4", title: "Eco Recycled Notebook", price: 10.75, image: notebookEco, category: "notebooks" },
];

export const featuredProducts: Product[] = [
  { id: "f1", title: "Signature Notebook", price: 18.00, image: notebookClassic, category: "notebooks" },
  { id: "f2", title: "Minimalist Planner", price: 22.50, image: notebookSpiral, category: "planners" },
  { id: "f3", title: "Leather Journal", price: 34.00, image: notebookJournal, category: "journals" },
  { id: "f4", title: "Pocket Notebook", price: 6.75, image: notebookEco, category: "notebooks" },
  { id: "f5", title: "Eco Notebook", price: 11.20, image: notebookEco, category: "notebooks" },
  { id: "f6", title: "Dot Journal XL", price: 20.00, image: notebookJournal, category: "journals" },
];
