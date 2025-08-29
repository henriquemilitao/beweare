"use client";

import { LogInIcon, ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PersonilazedDialog } from "./personalized-dialog";


export const Cart = () => {
  const { data: cart } = useCart();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [showDialog, setShowDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState<{
    title?: string;
    description?: string;
    buttonText?: string;
  }>({});

  return (
    <>
      <PersonilazedDialog {...dialogProps} open={showDialog} onOpenChange={setShowDialog} />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <ShoppingBasketIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Carrinho</SheetTitle>
          </SheetHeader>

          {!session?.user ? (
            // 1. Usuário não logado
            <div className="flex items-center justify-between m-5">
              <h2 className="font-semibold">Olá. Faça seu login!</h2>
              <Button asChild className="rounded-full">
                <Link
                  href="/authentication"
                  className="flex items-center gap-2"
                >
                  <LogInIcon className="w-4 h-4" />
                  Login
                </Link>
              </Button>
            </div>
          ) : !cart?.items || cart.items.length === 0 ? (
            // 2. Usuário logado e carrinho vazio
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-muted-foreground text-lg font-medium">Seu carrinho está vazio.</p>
            </div>
          ) : (
            // 3. Usuário logado e carrinho com itens
            <div className="flex h-full flex-col px-5 pb-5">
              <div className="flex h-full max-h-full flex-col overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="flex h-full flex-col gap-8">
                    {cart.items.map((item) => (
                      <CartItem
                        key={item.id}
                        id={item.id}
                        productVariantId={item.productVariant.id}
                        productName={item.productVariant.product.name}
                        productVariantName={item.productVariant.name}
                        productVariantImageUrl={item.productVariant.imageUrl}
                        productVariantPriceInCents={
                          item.productVariant.priceInCents
                        }
                        quantity={item.quantity}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex flex-col gap-4">
                <Separator />

                <div className="flex items-center justify-between text-xs font-medium">
                  <p>Subtotal</p>
                  <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs font-medium">
                  <p>Entrega</p>
                  <p>GRÁTIS</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs font-medium">
                  <p>Total</p>
                  <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
                </div>

                <Button className="mt-5 rounded-full" asChild>
                  <Link href="/cart/identification">Finalizar compra</Link>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

// SERVER ACTION