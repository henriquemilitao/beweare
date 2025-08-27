"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginRequiredDialog({ open, onOpenChange }: LoginRequiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center">
        <DialogTitle className="mt-4 text-2xl">Faça login para continuar</DialogTitle>
        <DialogDescription className="font-medium">
          Você precisa estar logado para adicionar produtos ao carrinho ou finalizar sua compra.
        </DialogDescription>
        <DialogFooter>
          <Button className="rounded-full" size="lg" asChild>
            <Link href="/authentication">Fazer login</Link>
          </Button>
          <Button
            className="rounded-full"
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}