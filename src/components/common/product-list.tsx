"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { productTable, productVariantTable } from "@/db/schema";

import ProductItem from "./product-item";

interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductList = ({ title, products }: ProductListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -clientWidth : clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-6 relative">
      <h3 className="px-5 font-semibold">{title}</h3>

      <div className="relative">
        {/* Lista */}
        <div
          ref={scrollRef}
          className="flex w-full gap-4 overflow-x-auto px-5 scroll-smooth [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>

        {/* Botão esquerdo */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md p-2 rounded-full cursor-pointer"
        >
          <ChevronLeft />
        </button>

        {/* Botão direito */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md p-2 rounded-full cursor-pointer"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ProductList;
