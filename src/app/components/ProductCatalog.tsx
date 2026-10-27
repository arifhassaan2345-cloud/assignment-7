"use client";

import { useState } from "react";
import Link from "next/link";

type ProductItem = {
  id: number;
  name: string;
  emoji: string;
  price: string;
  rawPrice:number;
  unit: string;
  change: string;
  changeDirection: "up" | "down" | "flat";
  category: string;
  categoryName: string;
};

const categories = [
  { name: "সব পণ্য", slug: "" },
  { name: "চাল", slug: "chal" },
  { name: "ডাল", slug: "dal" },
  { name: "সবজি", slug: "sobji" },
  { name: "মাছ ও মাংস", slug: "mach-mangsho" },
  { name: "তেল", slug: "tel" },
];

function matchesCategory(item: ProductItem, slug: string) {
  if (!slug) return true;

  const category = item.category.toLowerCase();
  const name = item.categoryName;

  if (category === slug) return true;

  const names: Record<string, string[]> = {
    chal: ["চাল", "rice"],
    dal: ["ডাল", "lentil"],
    sobji: ["সবজি", "শাকসবজি", "vegetable"],
    "mach-mangsho": ["মাছ", "মাংস", "fish", "meat"],
    tel: ["তেল", "oil"],
  };

  return (names[slug] ?? []).some(
    (word) =>
      category.includes(word.toLowerCase()) ||
      name.toLowerCase().includes(word.toLowerCase())
  );
}

export default function ProductCatalog({
  items,
}: {
  items: ProductItem[];
}) {
  const [selected, setSelected] = useState("");
const [searchText, setSearchText] = useState("");
const [sortOrder, setSortOrder] = useState("default");

const filteredItems = items.filter(
  (item) =>
    matchesCategory(item, selected) &&
    item.name.toLowerCase().includes(searchText.trim().toLowerCase())
);

const sortedItems = [...filteredItems];

if (sortOrder === "low") {
  sortedItems.sort((a, b) => a.rawPrice - b.rawPrice);
} else if (sortOrder === "high") {
  sortedItems.sort((a, b) => b.rawPrice - a.rawPrice);
}




  return (
  <div>
    <div className="mb-5 flex items-center gap-3">
  <label htmlFor="price-sort">
    দাম অনুযায়ী:
  </label>

  <select
    id="price-sort"
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <option value="default">সাধারণ</option>
    <option value="low">কম দাম থেকে বেশি</option>
    <option value="high">বেশি দাম থেকে কম</option>
  </select>
</div>
    <div className="mb-6">
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="পণ্যের নাম লিখে খুঁজুন..."
        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
      />
    </div>

    <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.slug || "all"}
            type="button"
            onClick={() => setSelected(category.slug)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selected === category.slug
                ? "bg-green-800 text-white"
                : "bg-white text-stone-700 hover:bg-green-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>  

      {filteredItems.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedItems.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="block rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{item.emoji}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    item.changeDirection === "up"
                      ? "bg-red-50 text-red-600"
                      : item.changeDirection === "down"
                        ? "bg-green-50 text-green-700"
                        : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {item.change}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-stone-800">
                {item.name}
              </h3>

              <p className="mt-1 text-sm text-stone-500">{item.unit}</p>

              <p className="mt-5 border-t border-stone-100 pt-4 text-2xl font-extrabold text-stone-900">
                {item.price} <span className="text-sm">টাকা</span>
              </p>

              <p className="mt-3 text-sm font-semibold text-green-800">
                বিস্তারিত →
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl bg-white p-5 text-stone-600">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
        </p>
      )}
    </div>
  );
}