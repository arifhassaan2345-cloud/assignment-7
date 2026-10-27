import { getProductById } from "../../lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  markets: {
    division: string;
    market: string;
    min: number;
    max: number;
  }[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("bn-BD").format(price);
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

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId < 1) {
    notFound();
  }

  let product: Product;

  try {
    const data = await getProductById(productId);
    product = data.product ?? data.data ?? data;
    
    if (!product || !product.id) {
      notFound();
    }
  } catch {
    notFound();
  }
  const marketPrices = product.markets ?? [];

const minPrice =
  marketPrices.length > 0
    ? Math.min(...marketPrices.map((market) => market.min))
    : 0;

const maxPrice =
  marketPrices.length > 0
    ? Math.max(...marketPrices.map((market) => market.max))
    : 0;

const averagePrice =
  marketPrices.length > 0
    ? marketPrices.reduce(
        (total, market) => total + (market.min + market.max) / 2,
        0
      ) / marketPrices.length
    : 0;


  const difference = product.today - product.yesterday;
  const changeText =
    product.change.dir === "up"
      ? "দাম বেড়েছে"
      : product.change.dir === "down"
        ? "দাম কমেছে"
        : "দামের পরিবর্তন নেই";
  return (
    <main className="min-h-screen bg-[#f7f8f4] text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link
            href="/"
            className="text-2xl font-extrabold text-green-800"
          >
            🛒 বাজার দর
          </Link>

          <Link
            href="/#সব-পণ্য"
            className="rounded-full border border-green-700 px-4 py-2 font-semibold text-green-800 hover:bg-green-50"
          >
            সব পণ্য
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-10">
        <Link
          href="/"
          className="mb-7 inline-block text-sm font-semibold text-green-800 hover:underline"
        >
          ← হোমপেজে ফিরে যাও
        </Link>

        <div className="grid gap-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          <div className="flex min-h-64 items-center justify-center rounded-2xl bg-green-50 p-8">
            <span className="text-8xl">
              {product.image || product.categoryIcon || "🛒"}
            </span>
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold text-green-700">
              {product.categoryIcon} {product.categoryNameBn}
            </p>

            <h1 className="mb-3 text-3xl font-extrabold">
              {product.nameBn}
            </h1>

            <p className="mb-6 text-gray-500">
              {getUnit(product.unit)}
            </p>

            <p className="text-sm text-gray-500">আজকের বাজারদর</p>

            <p className="mt-1 text-4xl font-extrabold text-green-800">
              {formatPrice(product.today)} টাকা
            </p>

            <p
              className={`mt-4 font-semibold ${
                product.change.dir === "up"
                  ? "text-red-600"
                  : product.change.dir === "down"
                    ? "text-green-700"
                    : "text-gray-500"
              }`}
            >
              {changeText}:{" "}
              {product.change.pct > 0 ? "+" : ""}
              {formatPrice(product.change.pct)}%
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="col-span-2 rounded-xl border border-green-100 bg-green-50 p-4">
  <h2 className="mb-3 text-lg font-bold text-green-900">
    বাজারের দামের সারসংক্ষেপ
  </h2>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
    <div className="rounded-lg bg-white p-3">
      <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
      <p className="mt-1 text-xl font-bold text-green-700">
        {formatPrice(minPrice)} টাকা
      </p>
    </div>

    <div className="rounded-lg bg-white p-3">
      <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
      <p className="mt-1 text-xl font-bold text-red-600">
        {formatPrice(maxPrice)} টাকা
      </p>
    </div>

    <div className="rounded-lg bg-white p-3">
      <p className="text-sm text-gray-500">গড় দাম</p>
      <p className="mt-1 text-xl font-bold text-blue-700">
        {formatPrice(averagePrice)} টাকা
      </p>
    </div>
  </div>
</div>

<div className="col-span-2 mt-4">
  <h2 className="mb-3 text-xl font-bold">বাজারভিত্তিক আজকের দাম</h2>

  {marketPrices.length === 0 ? (
    <p className="text-gray-500">বাজারের তথ্য পাওয়া যায়নি।</p>
  ) : (
    <div className="space-y-3">
      {marketPrices.map((market, index) => (
        <div
          key={`${market.division}-${market.market}-${index}`}
          className="rounded-xl border border-gray-200 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-bold">{market.market}</h3>
              <p className="text-sm text-gray-500">{market.division} বিভাগ</p>
            </div>

            <div className="text-right text-sm">
              <p>
                সর্বনিম্ন: <strong>{formatPrice(market.min)} টাকা</strong>
              </p>
              <p>
                সর্বোচ্চ: <strong>{formatPrice(market.max)} টাকা</strong>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">গতকালের দাম</p>
                <p className="mt-1 text-lg font-bold">
                  {formatPrice(product.yesterday)} টাকা
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">গত সপ্তাহের দাম</p>
                <p className="mt-1 text-lg font-bold">
                  {formatPrice(product.lastWeek)} টাকা
                </p>
              </div>

              <div className="col-span-2 rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">গত মাসের দাম</p>
                <p className="mt-1 text-lg font-bold">
                  {formatPrice(product.lastMonth)} টাকা
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs text-gray-400">
              দামের পার্থক্য: {difference > 0 ? "+" : ""}
              {formatPrice(difference)} টাকা
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-10 border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        © বাজার দর — প্রতিদিনের বাজার, এক নজরে।
      </footer>
    </main>
  );
}
