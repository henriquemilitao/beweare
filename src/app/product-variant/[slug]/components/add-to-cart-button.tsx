"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductToCart } from "@/actions/add-cart-product";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { LoginRequiredDialog } from "@/components/common/login-required-dialog";

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
  const { data: session } = authClient.useSession();
  const [showDialog, setShowDialog] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () => addProductToCart({ productVariantId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (variant === "default") {
        router.push("/cart/identification");
      }
    },
  });

  const handleClick = () => {
    if (!session?.user) {
      setShowDialog(true);
      return;
    }
    mutate();
  };

  return (
    <>
      <Button
        className="rounded-full"
        size="lg"
        variant={variant}
        disabled={isPending}
        onClick={handleClick}
      >
        {isPending && <Loader2 className="animate-spin mr-2" />}
        {text}
      </Button>
      <LoginRequiredDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
};

export default AddToCartButton;
