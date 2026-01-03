// "use client";

// import CommonButton from "@/app/components/button/CommonButton";
// import CartDrawer from "@/app/components/CartDrawer";
// import CommonHeading from "@/app/components/CommonHeading";
// import CommonProductCard from "@/app/components/CommonProductCard";
// import RangeSlider from "@/app/components/RangeSlider";
// import CommonSelect from "@/app/components/select/CommonSelect";
// import {
//   Checkbox,
//   Dialog,
//   DialogPanel,
//   Popover,
//   PopoverButton,
//   PopoverPanel,
// } from "@headlessui/react";
// import { Check, ChevronDown } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { useProductsInfinite } from "@/hooks/use-products";
// import type { ProductListResponse } from "@/services/product-service";

// const sortOptions = [
//   { label: "Featured", value: "featured" },
//   { label: "Best selling", value: "best-selling" },
//   { label: "Alphabetically, A-Z", value: "az" },
//   { label: "Alphabetically, Z-A", value: "za" },
//   { label: "Price, low to high", value: "price-asc" },
//   { label: "Price, high to low", value: "price-desc" },
//   { label: "Date, old to new", value: "date-asc" },
//   { label: "Date, new to old", value: "date-desc" },
// ];

// const MAX_PRODUCT_PRICE = 2500;

// export default function ProductList() {
//   const [openCart, setOpenCart] = useState(false);
//   const [selected, setSelected] = useState(sortOptions[0]);

//   // stock filter state
//   const [inStock, setInStock] = useState(false);
//   const [outOfStock, setOutOfStock] = useState(false);

//   const [price, setPrice] = useState<[number, number]>([0, MAX_PRODUCT_PRICE]);
//   const [debouncedPrice, setDebouncedPrice] = useState<[number, number]>(price);
//   const [openMobileFilter, setOpenMobileFilter] = useState(false);

//   // wait before api call
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedPrice(price), 250);
//     return () => clearTimeout(t);
//   }, [price]);

//   // decide stock value
//   const availabilityParam: boolean | undefined = useMemo(() => {
//     if (inStock && !outOfStock) return true;
//     if (!inStock && outOfStock) return false;
//     return undefined;
//   }, [inStock, outOfStock]);

//   const serverFilters = useMemo(
//     () => ({ minPrice: debouncedPrice[0], maxPrice: debouncedPrice[1] }),
//     [debouncedPrice]
//   );

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useProductsInfinite(serverFilters);

//   // merge all pages
//   const pages = (data?.pages ?? []) as ProductListResponse[];
//   const sourceProducts = useMemo(
//     () => pages.flatMap((p) => (Array.isArray(p.data) ? p.data : [])),
//     [pages]
//   );

//   // filter stock
//   const availabilityFiltered = useMemo(() => {
//     if (availabilityParam === undefined) return sourceProducts;
//     return sourceProducts.filter((p) =>
//       availabilityParam ? p.stockQty > 0 : p.stockQty === 0
//     );
//   }, [sourceProducts, availabilityParam]);

//   // sort products
//   const sortedProducts = useMemo(() => {
//     const arr = [...availabilityFiltered];

//     const by = (
//       cmp: (a: (typeof arr)[number], b: (typeof arr)[number]) => number
//     ) => arr.sort(cmp);

//     switch (selected.value) {
//       case "az":
//         return by((a, b) => a.title.localeCompare(b.title));
//       case "za":
//         return by((a, b) => b.title.localeCompare(a.title));
//       case "price-asc":
//         return by((a, b) => a.priceNumber - b.priceNumber);
//       case "price-desc":
//         return by((a, b) => b.priceNumber - a.priceNumber);
//       case "date-asc":
//         return by((a, b) => a.createdAtMs - b.createdAtMs);
//       case "date-desc":
//         return by((a, b) => b.createdAtMs - a.createdAtMs);
//       case "best-selling":
//         return by((a, b) => {
//           if (a.isBestSeller !== b.isBestSeller) return a.isBestSeller ? -1 : 1;
//           return b.createdAtMs - a.createdAtMs;
//         });
//       default:
//         return by((a, b) => {
//           if (a.isNewArrival !== b.isNewArrival) return a.isNewArrival ? -1 : 1;
//           if (a.isBestSeller !== b.isBestSeller) return a.isBestSeller ? -1 : 1;
//           return b.createdAtMs - a.createdAtMs;
//         });
//     }
//   }, [availabilityFiltered, selected.value]);

//   const handleClearAll = () => {
//     setPrice([0, MAX_PRODUCT_PRICE]);
//     setSelected(sortOptions[0]);
//     setInStock(false);
//     setOutOfStock(false);
//   };

//   const selectedAvailabilityCount = (inStock ? 1 : 0) + (outOfStock ? 1 : 0);

//   return (
//     <>
//       <div className="gradientBg">
//         <section className="max-w-full px-3 md:px-6 lg:px-10 md:py-6 lg:pt-6">
//           <CommonHeading
//             level={1}
//             title="Pendant"
//             description="Proudly Supporting Ethical Sourcing - Every Gemstone Has a Story."
//           />

//           <div className="mb-10 space-y-6 hidden md:block">
//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
//                 <span className="font-medium text-sm text-foreground">
//                   FILTER:
//                 </span>

//                 <Popover className="relative">
//                   <PopoverButton className="outline-0 px-4 py-2 border border-foreground/20 rounded-lg flex items-center gap-5">
//                     Availability <ChevronDown />
//                   </PopoverButton>
//                   <PopoverPanel className="translate-y-2 flex flex-col z-10 bg-background border border-foreground/20 rounded-lg w-56">
//                     <div className="px-5 py-3 flex items-center justify-between border-b border-foreground/20">
//                       <p className="text-sm">
//                         {selectedAvailabilityCount} Selected
//                       </p>
//                       <button
//                         className="commonLink"
//                         onClick={() => {
//                           setInStock(false);
//                           setOutOfStock(false);
//                         }}
//                       >
//                         Reset
//                       </button>
//                     </div>
//                     <div className="px-5 py-3 flex items-center gap-2">
//                       <Checkbox checked={inStock} onChange={setInStock}>
//                         <Check />
//                       </Checkbox>
//                       <p className="text-sm">In Stock</p>
//                     </div>
//                     <div className="px-5 py-3 flex items-center gap-2">
//                       <Checkbox checked={outOfStock} onChange={setOutOfStock}>
//                         <Check />
//                       </Checkbox>
//                       <p className="text-sm">Out of Stock</p>
//                     </div>
//                   </PopoverPanel>
//                 </Popover>

//                 <Popover className="relative">
//                   <PopoverButton className="outline-0 px-4 py-2 border border-foreground/20 rounded-lg flex items-center gap-5">
//                     Price <ChevronDown />
//                   </PopoverButton>
//                   <PopoverPanel className="translate-y-2 px-6 py-6 bg-background border border-foreground/20 rounded-lg w-56">
//                     <RangeSlider
//                       min={0}
//                       max={MAX_PRODUCT_PRICE}
//                       value={price}
//                       onChange={setPrice}
//                     />
//                   </PopoverPanel>
//                 </Popover>
//               </div>

//               <div className="flex items-center gap-4 text-sm">
//                 <p>Sort by:</p>
//                 <CommonSelect
//                   name="sort"
//                   options={sortOptions}
//                   value={selected}
//                   onChange={setSelected}
//                 />
//                 <p>{sortedProducts.length} Products</p>
//               </div>
//             </div>
//           </div>

//           <div className="productGrid">
//             {isLoading ? (
//               <div className="col-span-full py-10 text-center">
//                 Loading products...
//               </div>
//             ) : isError ? (
//               <div className="col-span-full py-10 text-center text-red-500">
//                 {error?.message}
//               </div>
//             ) : (
//               sortedProducts.map((product) => (
//                 <CommonProductCard
//                   key={product.id}
//                   productId={product.id}
//                   title={product.title}
//                   price={product.price}
//                   oldPrice={product.oldPrice}
//                   image={product.image}
//                   tag={product.tag}
//                   onAddToCart={() => setOpenCart(true)}
//                 />
//               ))
//             )}
//           </div>

//           <div className="flex justify-center mt-8">
//             <CommonButton
//               variant="secondaryBtn"
//               onClick={() => fetchNextPage()}
//               disabled={!hasNextPage || isFetchingNextPage}
//             >
//               {isFetchingNextPage
//                 ? "Loading..."
//                 : hasNextPage
//                 ? "Load More"
//                 : "All products loaded"}
//             </CommonButton>
//           </div>
//         </section>
//       </div>

//       <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />

//       <Dialog
//         open={openMobileFilter}
//         onClose={() => setOpenMobileFilter(false)}
//         className="relative z-50 md:hidden"
//       >
//         <div className="fixed inset-0 bg-black/40" />
//         <div className="fixed inset-x-0 bottom-0">
//           <DialogPanel className="w-full bg-background rounded-t-2xl p-6">
//             <RangeSlider
//               min={0}
//               max={MAX_PRODUCT_PRICE}
//               value={price}
//               onChange={setPrice}
//             />
//           </DialogPanel>
//         </div>
//       </Dialog>
//     </>
//   );
// }


import BestSeller from "../components/BestSeller";
import CommonHeading from "../components/CommonHeading";
import CommonProductCard from "../components/CommonProductCard";
import HomeCategoriesSection from "../components/HomeCategoriesSection";
import HomeCustomerFeedback from "../components/HomeCustomerFeedback";
import HomeFeaturedCollectionSection from "../components/HomeFeaturedCollectionSection";
import HomeFollowOnSocialSection from "../components/HomeFollowOnSocialSection";
import HomeHeroSection from "../components/HomeHeroSec";
import HomeStoreFeature from "../components/HomeStoreFeature";
import ProductFeatureStrip from "../components/ProductFeatureStrip";

export default function Home() {
  const PRODUCTS = [
    {
        id: 1,
        title: "Glossy Heart Stud",
        price: "Rs. 799.00",
        image: "/img/bracelet-img.webp",
    },
    {
        id: 2,
        title: "Interlocking Hoop Earring",
        price: "Rs. 1,299.00",
        image: "/img/bracelets.webp",
    },
    {
        id: 3,
        title: "Interlocking Hoop Earring",
        price: "Rs. 1,299.00",
        image: "/img/jewelrySet.webp",
    },
    {
        id: 4,
        title: "Interlocking Hoop Earring",
        price: "Rs. 1,299.00",
        image: "/img/pendant_old.webp",
    },
    {
        id: 5,
        title: "Interlocking Hoop Earring",
        price: "Rs. 1,299.00",
        image: "/img/necklace.webp",
    },
];
  return (
    <>
      <div className="homepageWrap gradientBg">
        <HomeHeroSection />

        <ProductFeatureStrip />

        {/* <h1 className="font-times uppercase text-8xl">WELCOME</h1> */}

        {/* <section className="px-5 md:px-8 lg:px-10">
          <CommonHeading
            level={1}
            title="Welcome to Privora"
            description="Welcome to White Bunny, where elegance meets simplicity. We are a contemporary jewelry brand crafted for the modern Indian woman who values minimalism, affordability, and self-expression. Our jewelry is designed to be more than just an accessory—it's a reflection of your personality, confidence, and unique style."
            noMargin
          />
        </section> */}
        {/* Categories Section */}
        <HomeCategoriesSection />


        <BestSeller />


        <HomeCustomerFeedback />

        <section className="px-3 md:px-8 lg:px-10 py-7 md:py-12 lg:py-20">
          <CommonHeading
            level={1}
            title="New Arrival"
            description="Jewelry crafted with care, guided by responsibility."
          />
          <div className="commonProductGrid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-10 max-w-[1560px] mx-auto">
            {PRODUCTS.map((product) => (
              <CommonProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        </section>

        <HomeFeaturedCollectionSection />

        <HomeFollowOnSocialSection />

        <HomeStoreFeature />

        {/* <HomeHeroSection />
        <HomeHeroSection /> */}
      </div>
    </>
  );
}