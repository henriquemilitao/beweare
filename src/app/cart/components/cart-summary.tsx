"use client";

import Image from "next/image";
import { toast } from "sonner";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";

import { useCart } from "@/hooks/queries/use-cart";
import { useRemoveProductFromCart } from "@/hooks/mutations/use-remove-product-from-cart";
import { useDecreaseCartProduct } from "@/hooks/mutations/use-decrease-cart-product";
import { useIncreaseCartProduct } from "@/hooks/mutations/use-increase-cart-product";
import Link from "next/link";

interface CartSummaryProps {
  final?: boolean
}

export default function CartSummary({final = true}: CartSummaryProps) {
  // Busca reativa do carrinho (fica em sync com os botões)
  const { data: cart } = useCart();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Totais */}
        <div className="flex justify-between">
          <p className="text-sm">Subtotal</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(cart?.totalPriceInCents ?? 0)}
          </p>
        </div>

        <div className="flex justify-between">
          <p className="text-sm">Frete</p>
          <p className="text-muted-foreground text-sm font-medium">GRÁTIS</p>
        </div>

        <div className="flex justify-between">
          <p className="text-sm">Total</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(cart?.totalPriceInCents ?? 0)}
          </p>
        </div>

        <div className="py-3">
          <Separator />
        </div>

        {/* Lista de itens com +/–/excluir */}
        <div className="flex flex-col gap-6">
          {(!cart?.items || cart.items.length === 0) ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <p className="text-muted-foreground text-sm">
                Seu carrinho está vazio.
              </p>
              <Button
                className="rounded-full"
                variant="outline"
                size="lg"
                asChild
              >
                <Link href="/">Voltar para a loja</Link>
              </Button>
            </div>
          ) : (
            cart.items.map((item) => (
              <SummaryRow
                key={item.id}
                id={item.id}
                name={item.productVariant.product.name}
                variantName={item.productVariant.name}
                imageUrl={item.productVariant.imageUrl}
                priceInCents={item.productVariant.priceInCents}
                quantity={item.quantity}
                productVariantId={item.productVariant.id}
                final={final}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/** Linha de item reutilizável (client) */
function SummaryRow(props: {
  id: string; // cartItemId
  productVariantId: string;
  name: string;
  variantName: string;
  imageUrl: string;
  priceInCents: number;
  quantity: number;
  final: boolean
}) {
  const removeMutation = useRemoveProductFromCart(props.id);
  const decMutation = useDecreaseCartProduct(props.id);
  const incMutation = useIncreaseCartProduct(props.productVariantId);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={props.imageUrl}
          alt={props.name}
          width={78}
          height={78}
          className="rounded-lg"
        />

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{props.name}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {props.variantName}
          </p>

          {/* controles de quantidade */}
          {props.final ? <div className="flex w-[112px] items-center justify-between rounded-lg border p-1">
            <Button
              variant="outline"
              className="h-5 w-5"
              onClick={() =>
                decMutation.mutate(undefined)
              }
            >
              <MinusIcon className="h-3 w-3" />
            </Button>

            <p className="text-xs font-medium">{props.quantity}</p>

            <Button
              variant="outline"
              className="h-5 w-5"
              onClick={() =>
                incMutation.mutate(undefined)
              }
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div> : 
          <p className="text-xs font-medium">Quantidade: {props.quantity }</p>
          }
        </div>
      </div>

      <div className="flex flex-col items-end justify-center gap-2">
        {props.final && <Button
          variant="outline"
          size="icon"
          onClick={() =>
            removeMutation.mutate(undefined, {
              onSuccess: () => toast.success("Produto removido do carrinho."),
              onError: () => toast.error("Erro ao remover produto do carrinho."),
            })
          }
        >
          <TrashIcon className="h-4 w-4" />
        </Button>}

        <p className="text-sm font-bold">
          {formatCentsToBRL(props.priceInCents)}
        </p>
      </div>
    </div>
  );
}
