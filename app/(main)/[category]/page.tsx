"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import CommonButton from "@/app/components/button/CommonButton";
import CartDrawer from "@/app/components/CartDrawer";
import CommonHeading from "@/app/components/CommonHeading";
import CommonProductCard from "@/app/components/CommonProductCard";
import RangeSlider from "@/app/components/RangeSlider";
import CommonSelect from "@/app/components/select/CommonSelect";

import {
  Checkbox,
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { Check, ChevronDown, Filter } from "lucide-react";

import { useProductsByCategory } from "@/hooks/use-products";
import { getCategoryBySlug } from "@/services/category-service";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Best selling", value: "best-selling" },
  { label: "Alphabetically, A-Z", value: "az" },
  { label: "Alphabetically, Z-A", value: "za" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Date, old to new", value: "date-asc" },
  { label: "Date, new to old", value: "date-desc" },
];

const MAX_PRODUCT_PRICE = 2500;

export default function CategoryProductList() {
  const { category: categorySlug } = useParams<{ category: string }>();

  /* ---------- category ---------- */

  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category", categorySlug],
    queryFn: () => getCategoryBySlug(categorySlug),
    enabled: Boolean(categorySlug),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!isCategoryLoading && !category) notFound();
  }, [isCategoryLoading, category]);

  /* ---------- local state ---------- */

  const [openCart, setOpenCart] = useState(false);
  const [selected, setSelected] = useState(sortOptions[0]);
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [price, setPrice] = useState<[number, number]>([0, MAX_PRODUCT_PRICE]);
  const [debouncedPrice, setDebouncedPrice] = useState(price);
  const [openMobileFilter, setOpenMobileFilter] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedPrice(price), 250);
    return () => clearTimeout(t);
  }, [price]);

  /* ---------- availability ---------- */

  const availabilityParam = useMemo<boolean | undefined>(() => {
    if (inStock && !outOfStock) return true;
    if (!inStock && outOfStock) return false;
    return undefined;
  }, [inStock, outOfStock]);

  /* ---------- server filters ---------- */

  const serverFilters = useMemo(
    () => ({
      minPrice: debouncedPrice[0],
      maxPrice: debouncedPrice[1],
    }),
    [debouncedPrice]
  );

  /* ---------- products ---------- */

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsByCategory(categorySlug, serverFilters);

  const pages = data?.pages ?? [];

  const allProducts = useMemo(() => pages.flatMap((p) => p.data), [pages]);

  const totalFromBackend = pages[0]?.meta?.totalItems ?? 0;

  /* ---------- availability filter ---------- */

  const availabilityFiltered = useMemo(() => {
    if (availabilityParam === undefined) return allProducts;
    return allProducts.filter((p) =>
      availabilityParam ? p.stockQty > 0 : p.stockQty === 0
    );
  }, [allProducts, availabilityParam]);

  /* ---------- sorting ---------- */

  const sortedProducts = useMemo(() => {
    const arr = [...availabilityFiltered];

    switch (selected.value) {
      case "az":
        return arr.sort((a, b) => a.title.localeCompare(b.title));
      case "za":
        return arr.sort((a, b) => b.title.localeCompare(a.title));
      case "price-asc":
        return arr.sort((a, b) => a.priceNumber - b.priceNumber);
      case "price-desc":
        return arr.sort((a, b) => b.priceNumber - a.priceNumber);
      case "date-asc":
        return arr.sort((a, b) => a.createdAtMs - b.createdAtMs);
      case "date-desc":
        return arr.sort((a, b) => b.createdAtMs - a.createdAtMs);
      case "best-selling":
        return arr.sort((a, b) =>
          a.isBestSeller === b.isBestSeller
            ? b.createdAtMs - a.createdAtMs
            : a.isBestSeller
            ? -1
            : 1
        );
      default:
        return arr.sort((a, b) =>
          a.isNewArrival === b.isNewArrival
            ? b.createdAtMs - a.createdAtMs
            : a.isNewArrival
            ? -1
            : 1
        );
    }
  }, [availabilityFiltered, selected.value]);

  const selectedAvailabilityCount = (inStock ? 1 : 0) + (outOfStock ? 1 : 0);

  /* ---------- UI ---------- */

  return (
    <>
      <div className="gradientBg">
        <section className="max-w-full px-3 md:px-6 lg:px-10 md:py-6 lg:pt-6">
          <CommonHeading
            level={1}
            title={category?.title ?? "Products"}
            description="Proudly Supporting Ethical Sourcing - Every Gemstone Has a Story."
          />

          {/* Desktop filters */}
          <div className="mb-10 space-y-6 hidden md:block">
            <div className="flex justify-between gap-4 flex-wrap">
              <div className="flex gap-4 items-center flex-wrap">
                <span className="text-sm font-medium">FILTER</span>

                <Popover className="relative">
                  <PopoverButton className="px-4 py-2 border rounded-lg flex gap-3">
                    Availability <ChevronDown />
                  </PopoverButton>

                  <PopoverPanel className="translate-y-2 bg-background border rounded-lg w-56">
                    <div className="px-5 py-3 flex justify-between border-b">
                      <p className="text-sm">
                        {selectedAvailabilityCount} Selected
                      </p>
                      <button
                        className="commonLink"
                        onClick={() => {
                          setInStock(false);
                          setOutOfStock(false);
                        }}
                      >
                        Reset
                      </button>
                    </div>

                    <div className="px-5 py-3 flex gap-2">
                      <Checkbox checked={inStock} onChange={setInStock}>
                        <Check />
                      </Checkbox>
                      <p>In Stock</p>
                    </div>

                    <div className="px-5 py-3 flex gap-2">
                      <Checkbox checked={outOfStock} onChange={setOutOfStock}>
                        <Check />
                      </Checkbox>
                      <p>Out of Stock</p>
                    </div>
                  </PopoverPanel>
                </Popover>

                <Popover className="relative">
                  <PopoverButton className="px-4 py-2 border rounded-lg flex gap-3">
                    Price <ChevronDown />
                  </PopoverButton>

                  <PopoverPanel className="translate-y-2 px-6 py-6 bg-background border rounded-lg w-56">
                    <RangeSlider
                      min={0}
                      max={MAX_PRODUCT_PRICE}
                      value={price}
                      onChange={setPrice}
                    />
                  </PopoverPanel>
                </Popover>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <p>Sort by</p>
                <CommonSelect
                  name="sort"
                  options={sortOptions}
                  value={selected}
                  onChange={setSelected}
                />
                <p>{totalFromBackend} Products</p>
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="productGrid">
            {isLoading ? (
              <div className="col-span-full py-10 text-center">
                Loading products
              </div>
            ) : isError ? (
              <div className="col-span-full py-10 text-center text-red-500">
                {error?.message || "Something went wrong"}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="col-span-full py-10 text-center">
                No products found
              </div>
            ) : (
              sortedProducts.map((product) => (
                <CommonProductCard
                  key={product.id}
                  productId={product.id}
                  title={product.title}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={product.image}
                  tag={product.tag}
                  onAddToCart={() => setOpenCart(true)}
                />
              ))
            )}
          </div>

          {/* Load more */}
          <div className="flex justify-center mt-8">
            <CommonButton
              variant="secondaryBtn"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading..."
                : hasNextPage
                ? "Load More"
                : "All products loaded"}
            </CommonButton>
          </div>
        </section>
      </div>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
}