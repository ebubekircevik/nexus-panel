import type { ProductCategory } from "../types/index";

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "home", label: "Home" },
  { value: "sports", label: "Sports" },
];

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    electronics: "blue",
    clothing: "purple",
    books: "green",
    home: "orange",
    sports: "red",
  };
  return colors[category] || "default";
};

