import { getProducts } from "./lib/api";
import Link from "next/link";
import ProductCatalog from "./components/ProductCatalog";
const categories = [
  { name: "সব পণ্য", slug: "" },
  { name: "চাল", slug: "chal" },
  { name: "ডাল", slug: "dal" },
  { name: "সবজি", slug: "sobji" },
  { name: "মাছ ও মাংস", slug: "mach-mangsho" },
  { name: "তেল", slug: "tel" },
];

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  image: string;
  unit: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("bn-BD").format(price);
}

function formatChange(change: number) {
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toLocaleString("bn-BD")}%`;
}

function getUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
  };

  return units[unit] ?? unit;
}

function toMarketItem(product: Product) {
  return {
    id: product.id,
    emoji: product.image || product.categoryIcon || "🛒",
    category: product.category ?? "",
categoryName: product.categoryNameBn ?? "",
    name: product.nameBn,
    price: formatPrice(product.today),
    rawPrice:Number(product.today),
    unit: getUnit(product.unit),
    change: formatChange(product.change.pct),
    changeDirection: product.change.dir,
  };
}

type MarketItem = ReturnType<typeof toMarketItem>;

function PriceCard({ item }: { item: MarketItem }) {
  const up = item.changeDirection === "up";
  const flat = item.changeDirection === "flat";

  return (
    <Link
      href={`/products/${item.id}`}
      className="block rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-3xl">
          {item.emoji}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            flat
              ? "bg-stone-100 text-stone-500"
              : up
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-700"
          }`}
        >
          {flat ? "— " : up ? "▲ " : "▼ "}
          {item.change.replace("+", "").replace("-", "")}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold text-stone-800">
        {item.name}
      </h3>

      <p className="mt-1 text-sm text-stone-500">{item.unit}</p>

      <div className="mt-5 flex items-end justify-between border-t border-stone-100 pt-4">
        <div>
          <p className="text-xs text-stone-500">আজকের দাম</p>
          <p className="mt-1 text-2xl font-extrabold text-stone-900">
            {item.price}{" "}
            <span className="text-sm font-medium">টাকা</span>
          </p>
        </div>

        <span className="text-sm font-semibold text-green-800">
          বিস্তারিত →
        </span>
      </div>
    </Link>
  );
}

export default async function Home() {
  const response = await getProducts();
  const products: Product[] = Array.isArray(response)
    ? response
    : response.products ?? response.data ?? [];

  const marketItems = products.map(toMarketItem);

  const risingItems = marketItems.filter(
    (item) => item.changeDirection === "up"
  );

  const fallingItems = marketItems.filter(
    (item) => item.changeDirection === "down"
  );

  const featuredItems = marketItems.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#fffdf8] text-stone-800">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl">🛒</span>
            <span>
              <span className="block text-2xl font-black text-green-800">
                বাজার দর
              </span>
              <span className="block text-xs text-stone-500">
                প্রতিদিনের বাজার, এক নজরে
              </span>
            </span>
          </Link>

          <div className="flex gap-2">
            <Link
              href="/signin"
              className="rounded-xl border border-green-700 px-4 py-2 font-semibold text-green-800 hover:bg-green-50"
            >
              সাইন ইন
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-green-800 px-4 py-2 font-semibold text-white hover:bg-green-900"
            >
              সাইন আপ
            </Link>
          </div>

          <nav className="flex w-full gap-2 overflow-x-auto pb-1">
            {categories.map((category, index) => (
              <Link
                key={category.slug || "all"}
                href={
                  category.slug
                    ? `/category/${category.slug}`
                    : "#সব-পণ্য"
                }
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                  index === 0
                    ? "bg-green-800 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-green-50"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="overflow-hidden bg-green-900 py-3 text-sm text-white">
          <div className="flex w-max animate-[ticker_25s_linear_infinite] gap-10 whitespace-nowrap px-4">
            {[...marketItems, ...marketItems].map((item, index) => (
              <span key={`${item.id}-${index}`}>
                {item.emoji} {item.name} · {item.price} টাকা ·{" "}
                {item.change}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
            🌿 বাংলাদেশের বাজারদরের বিশ্বস্ত ঠিকানা
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
            প্রতিদিনের বাজার,
            <span className="block text-green-800">
              এখন আপনার হাতেই
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-stone-600 sm:text-lg">
            চাল, ডাল, মাছ, মাংস ও নিত্যপ্রয়োজনীয় পণ্যের দাম এক
            জায়গায় দেখুন। দাম বাড়ছে নাকি কমছে, জেনে নিন সহজেই।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-8 inline-flex rounded-xl bg-green-800 px-7 py-4 font-bold text-white shadow-lg shadow-green-900/15 transition hover:bg-green-900"
          >
            সব পণ্যের দাম দেখুন <span className="ml-2">→</span>
          </a>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-stone-600">
            <span>✓ সহজে দাম দেখুন</span>
            <span>✓ বাজার তুলনা করুন</span>
          </div>
        </div>

        <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-green-100 via-amber-50 to-orange-100 p-8 sm:min-h-96">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-green-200/50 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-orange-200/60 blur-2xl" />

          <div className="relative grid grid-cols-2 gap-4">
            {featuredItems.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="flex h-32 w-32 flex-col items-center justify-center rounded-2xl border border-white bg-white/80 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-lg sm:h-36 sm:w-36"
              >
                <span className="text-5xl">{item.emoji}</span>
                <span className="mt-2 text-center text-sm font-bold">
                  {item.name}
                </span>
                <span className="text-sm font-extrabold text-green-800">
                  {item.price} টাকা
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-red-600">
              ▲ আজকের বাজার
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              আজ দাম বেড়েছে
            </h2>
          </div>
          <span className="text-sm text-stone-500">
            দাম পরিবর্তনের তথ্য
          </span>
        </div>

        {risingItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {risingItems.map((item) => (
              <PriceCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-5 text-stone-500">
            বর্তমানে দাম বেড়েছে এমন কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <p className="text-sm font-bold text-green-700">
            ▼ আজকের বাজার
          </p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            আজ দাম কমেছে
          </h2>
        </div>

        {fallingItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fallingItems.map((item) => (
              <PriceCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-5 text-stone-500">
            বর্তমানে দাম কমেছে এমন কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      <section
        id="সব-পণ্য"
        className="scroll-mt-48 bg-stone-100/70 py-14"
      >
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-bold text-green-800">
            আপনার প্রতিদিনের বাজার
          </p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            সব পণ্য
          </h2>
          <p className="mt-3 text-stone-600">
            নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে দেখে নিন।
          </p>

          <ProductCatalog items={marketItems} />

          <p className="mt-8 text-center text-sm text-stone-500">
            প্রদর্শিত দাম API থেকে পাওয়া তথ্য অনুযায়ী দেখানো হচ্ছে।
          </p>
        </div>
      </section>

      <footer className="bg-green-950 px-4 py-8 text-sm text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 sm:flex-row">
          <p className="font-bold">
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
          <p className="text-green-100">
            বাজার ও সময়ভেদে পণ্যের দাম পরিবর্তিত হতে পারে।
          </p>
        </div>
      </footer>
    </main>
  );
}