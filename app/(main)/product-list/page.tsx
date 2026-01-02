"use client"

import CommonButton from "@/app/components/button/CommonButton"
import CartDrawer from "@/app/components/CartDrawer"
import CommonHeading from "@/app/components/CommonHeading"
import CommonProductCard from "@/app/components/CommonProductCard"
import RangeSlider from "@/app/components/RangeSlider"
import CommonSelect from "@/app/components/select/CommonSelect"
import { Checkbox, Dialog, DialogPanel, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { Check, CheckIcon, ChevronDown, Filter } from "lucide-react"
import { useState } from "react"
import { useProducts } from "@/hooks/use-products"

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Best selling", value: "best-selling" },
  { label: "Alphabetically, A-Z", value: "az" },
  { label: "Alphabetically, Z-A", value: "za" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Date, old to new", value: "date-asc" },
  { label: "Date, new to old", value: "date-desc" },
]

export default function ProductList() {
  const [openCart, setOpenCart] = useState(false)
  const [inStock, setInStock] = useState(true)
  const [outOfStock, setOutOfStock] = useState(false)
  const [selected, setSelected] = useState(sortOptions[0])
  const [price, setPrice] = useState<[number, number]>([0, 500])
  const [openMobileFilter, setOpenMobileFilter] = useState(false)

  const { data, isLoading } = useProducts({
    sort: selected.value,
    minPrice: price[0],
    maxPrice: price[1],
    inStock,
    outOfStock,
    page: 1,
  })

  const products = data?.data || []
  const totalProducts = data?.meta.totalItems || 0

  const handleClearAll = () => {
    setPrice([0, 500])
    setInStock(true)
    setOutOfStock(false)
    setSelected(sortOptions[0])
  }

  return (
    <>
      <div className="gradientBg">
        <section className="max-w-full px-3 md:px-6 lg:px-10 md:py-6 lg:pt-6">
          <CommonHeading
            level={1}
            title="Pendant"
            description="Proudly Supporting Ethical Sourcing - Every Gemstone Has a Story."
          />

          {/* FILTER & SORT */}
          <div className="mb-10 space-y-6 hidden md:block">
            {/* FILTER ROW */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <span className="font-medium text-sm text-foreground">FILTER:</span>
                <Popover className="relative">
                  <PopoverButton className="outline-0 focus:outline-0 px-4 py-2 border border-foreground/20 rounded-lg flex items-center gap-5">
                    Availability <ChevronDown />
                  </PopoverButton>
                  <PopoverPanel
                    anchor="bottom"
                    className="translate-y-2 flex flex-col z-10 bg-background border border-foreground/20 rounded-lg w-56"
                  >
                    <div className="px-5 py-3 flex items-center justify-between gap-2 border-b border-foreground/20">
                      <p className="text-sm font-normal text-foreground">
                        {(inStock ? 1 : 0) + (outOfStock ? 1 : 0)} Selected
                      </p>
                      <button
                        onClick={() => {
                          setInStock(true)
                          setOutOfStock(false)
                        }}
                        className="commonLink"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="px-5 py-3 flex items-center gap-2">
                      <Checkbox
                        checked={inStock}
                        onChange={setInStock}
                        className="group size-6 rounded-md bg-foreground/10 p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-brand"
                      >
                        <Check className="hidden size-4 fill-transparent stroke-background group-data-checked:block text-brand" />
                      </Checkbox>
                      <p className="text-sm font-normal">In Stock (10)</p>
                    </div>
                    <div className="px-5 py-3 flex items-center gap-2">
                      <Checkbox
                        checked={outOfStock}
                        onChange={setOutOfStock}
                        className="group size-6 rounded-md bg-foreground/10 p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-brand"
                      >
                        <Check className="hidden size-4 fill-transparent stroke-background group-data-checked:block text-brand" />
                      </Checkbox>
                      <p className="text-sm font-normal">Out of Stock (0)</p>
                    </div>
                  </PopoverPanel>
                </Popover>

                <Popover className="relative">
                  <PopoverButton className="outline-0 focus:outline-0 px-4 py-2 border border-foreground/20 rounded-lg flex items-center gap-5">
                    Price
                    <ChevronDown />
                  </PopoverButton>
                  <PopoverPanel
                    anchor="bottom"
                    className="translate-y-2 px-6 py-6 flex flex-col z-10 bg-background border border-foreground/20 rounded-lg w-56"
                  >
                    <div className=" py-3 flex items-center gap-2">
                      <RangeSlider min={0} max={500} value={price} onChange={setPrice} />
                    </div>
                  </PopoverPanel>
                </Popover>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm">
                <p className="whitespace-nowrap text-sm text-foreground">
                  Sort by:
                  {/* <strong>Featured</strong> */}
                </p>
                <CommonSelect
                  name="availability"
                  options={sortOptions}
                  value={selected}
                  onChange={setSelected}
                  placeholder="Availability"
                  className="min-w-46"
                />
                <p className="whitespace-nowrap text-sm text-foreground">{totalProducts} Products</p>
              </div>
            </div>

            {/* ACTIVE FILTER */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full text-sm">
                Rs. {price[0]}.00 - Rs. {price[1]}.00
                <button className="text-lg leading-none" onClick={() => setPrice([0, 500])}>
                  ×
                </button>
              </span>

              <button className="text-sm underline" onClick={handleClearAll}>
                Clear all
              </button>
            </div>
          </div>
          {/* MOBILE FILTER BAR */}
          <div className="flex md:hidden items-center justify-between mb-6 gap-4">
            <button
              onClick={() => setOpenMobileFilter(true)}
              className="flex items-center gap-2.5 px-4 py-2 border border-foreground/20 rounded-lg text-sm font-medium"
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>
            <div className="w-1/2">
              <CommonSelect
                name="sort"
                options={sortOptions}
                value={selected}
                onChange={setSelected}
                placeholder="Sort by"
                className="min-w-40"
              />
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="productGrid">
            {isLoading ? (
              <div className="col-span-full py-10 text-center text-foreground/60">Loading products...</div>
            ) : (
              products.map((product) => (
                <CommonProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={product.image}
                  onAddToCart={() => setOpenCart(true)}
                  tag={product.tag}
                />
              ))
            )}
          </div>

          {/* <Pagination
                        currentPage={1}
                        totalPages={2}
                        pageSize={50}
                        totalRecords={56}
                    /> */}
          <div className="flex justify-center items-center mt-8">
            <CommonButton variant="secondaryBtn" className="max-w-fit">
              Load More
            </CommonButton>
          </div>
        </section>
      </div>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />

      <Dialog open={openMobileFilter} onClose={() => setOpenMobileFilter(false)} className="relative z-50 md:hidden">
        {/* BACKDROP */}
        <div className="fixed inset-0 bg-black/40" />

        {/* BOTTOM SHEET */}
        <div className="fixed inset-x-0 bottom-0 flex items-end">
          <DialogPanel className="w-full bg-background rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setOpenMobileFilter(false)} className="text-2xl leading-none">
                ×
              </button>
            </div>

            {/* AVAILABILITY */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Availability</h4>

              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  checked={inStock}
                  onChange={setInStock}
                  className="group size-5 rounded-md bg-foreground/10 p-1 data-checked:bg-brand"
                >
                  <CheckIcon className="hidden size-3 group-data-checked:block text-background" />
                </Checkbox>
                <p className="text-sm">In Stock (10)</p>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={outOfStock}
                  onChange={setOutOfStock}
                  className="group size-5 rounded-md bg-foreground/10 p-1 data-checked:bg-brand"
                >
                  <CheckIcon className="hidden size-3 group-data-checked:block text-background" />
                </Checkbox>
                <p className="text-sm">Out of Stock (0)</p>
              </div>
            </div>

            {/* PRICE */}
            <div className="mb-8">
              <h4 className="text-sm font-medium mb-3">Price</h4>
              <RangeSlider min={0} max={500} value={price} onChange={setPrice} />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <CommonButton variant="secondaryBtn" className="w-full" onClick={handleClearAll}>
                Clear
              </CommonButton>

              <CommonButton className="w-full" onClick={() => setOpenMobileFilter(false)}>
                Apply Filters
              </CommonButton>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
