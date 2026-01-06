"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { X } from "lucide-react";
import CommonButton from "@/app/components/button/CommonButton";
import Link from "next/link";
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "@/hooks/use-cart";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { data: cart, isLoading } = useCart();
  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();

  const cartItems = cart?.items ?? [];
  const cartTotal = typeof cart?.total === "number" ? cart.total : 0;

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity ?? 1),
    0
  );

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* BACKDROP */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* DRAWER */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-full max-w-5xl bg-background shadow-xl flex">
                {/* LEFT */}
                <div className="hidden md:block w-1/2 border-r border-foreground/20 p-6 overflow-y-auto">
                  <h3 className="font-times text-lg mb-5">YOU MAY ALSO LIKE</h3>

                  <div className="space-y-6">
                    <SuggestedProduct
                      title="Black Heart Pendant Necklace"
                      price="₹899.00"
                      image="/img/pendant_old.webp"
                    />
                    <SuggestedProduct
                      title="Abstract White & Gold Earrings"
                      price="₹299.00"
                      image="/img/bracelets.webp"
                    />
                    <SuggestedProduct
                      title="Butterfly Chain Anklet"
                      price="₹799.00"
                      image="/img/bracelet-img.webp"
                    />
                  </div>
                </div>

                {/* RIGHT */}
                <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col">
                  {/* HEADER */}
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-medium">
                      Cart <span className="ml-1 text-sm">({cartCount})</span>
                    </h3>
                    <button onClick={onClose} aria-label="Close cart">
                      <X />
                    </button>
                  </div>

                  {/* ITEMS */}
                  <div className="flex-1 overflow-y-auto space-y-6">
                    {isLoading ? (
                      <p className="text-sm text-center py-8">
                        Loading cart...
                      </p>
                    ) : cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <CartItem
                          key={item.id}
                          title={item.name}
                          price={item.price}
                          image={item.image}
                          quantity={item.quantity}
                          onUpdateQuantity={(qty) =>
                            updateQuantity.mutate({
                              cartItemId: item.id,
                              quantity: qty,
                            })
                          }
                          onRemove={() => removeFromCart.mutate(item.id)}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-center py-8">
                        Your cart is empty
                      </p>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="border-t border-foreground/20 pt-5 mt-5">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Total:</span>
                      <span className="font-medium">
                        ₹{cartTotal.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs mb-4">
                      Taxes and shipping calculated at checkout
                    </p>

                    <CommonButton
                      href="/checkout"
                      disabled={cartItems.length === 0}
                    >
                      CHECK OUT
                    </CommonButton>

                    <Link
                      href="/cart"
                      className="mt-4 commonLink flex justify-center"
                    >
                      VIEW CART
                    </Link>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* -------------------- */
/* Helper components    */
/* -------------------- */

function SuggestedProduct({
  title,
  price,
  image,
}: {
  title: string;
  price: string;
  image: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm">{price}</p>
        <Link href="#" className="mt-1 commonLink">
          + Add to Cart
        </Link>
      </div>
    </div>
  );
}

function CartItem({
  title,
  price,
  image,
  quantity,
  onUpdateQuantity,
  onRemove,
}: {
  title: string;
  price: number | null | undefined;
  image: string;
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  const safePrice = typeof price === "number" ? price : 0;
  const safeQty = typeof quantity === "number" ? quantity : 1;

  return (
    <div className="flex gap-4">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-foreground/10">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm">
          ₹{safePrice.toFixed(2)} × {safeQty}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border rounded-full overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(Math.max(1, safeQty - 1))}
              className="px-4 py-2"
            >
              -
            </button>
            <span className="px-4">{safeQty}</span>
            <button
              onClick={() => onUpdateQuantity(safeQty + 1)}
              className="px-4 py-2"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button onClick={onRemove} className="text-sm commonLink">
        Remove
      </button>
    </div>
  );
}