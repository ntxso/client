import React from "react";
import { Link } from "react-router-dom"; // EKLENDİ
import categories from "../data/categories.json";

type Category = {
  id: number;
  name: string;
  image: string;
};

const CategoryGrid: React.FC = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category: Category) => (
          <Link
            to={`/products/categoryid/${category.id}`} // 🌟 Link buraya eklendi
            key={category.id}
            className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group max-h-[220px]"
          >
            <div className="aspect-square w-full max-h-[220px]">
              <img
                src={`/src/assets/categories/${category.image}`}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Karanlık şeffaf katman */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-xl font-bold px-2 text-center drop-shadow-[2px_2px_2px_rgba(0,0,0,0.8)]">
                  {category.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
