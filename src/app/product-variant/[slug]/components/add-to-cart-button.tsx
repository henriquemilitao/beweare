"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductToCart } from "@/actions/add-cart-product";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
  text: string;
  variant: "outline" | "default";
}

const AddToCartButton = ({
  productVariantId,
  quantity,
  text,
  variant
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () => addProductToCart({ productVariantId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // Redirecionar só se for botão "Comprar agora"
      if (variant === "default") {
        router.push("/cart/identification");
      }
    },
  });

  return (
    <Button
      className="rounded-full"
      size="lg"
      variant={variant}
      disabled={isPending}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="animate-spin mr-2" />}
      {text}
    </Button>
  );
};

export default AddToCartButton;
