"use client";

import {
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  PackageIcon,
  ShoppingBasketIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Cart } from "./cart";
import { Separator } from "../ui/separator";
import { categoryTable } from "@/db/schema";
import { PersonilazedDialog } from "./personalized-dialog";
import { useCart } from "@/hooks/queries/use-cart";

interface HeaderProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

export const Header = ({ categories }: HeaderProps) => {
  const { data: session } = authClient.useSession();
  const { data: cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  const [showDialog, setShowDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState<{
    title?: string;
    description?: string;
    buttonText?: string;
  }>({});

  const handleOrdersClick = () => {
    if (!session?.user) {
      setDialogProps({});
      setShowDialog(true);
      return;
    }
    router.push("/my-orders");
  };

  const handleCartClick = () => {
    if (!session?.user) {
      setDialogProps({});
      setShowDialog(true);
      return;
    }

    if (!cart || cart.items.length === 0) {
      setDialogProps({
        title: "Seu carrinho está vazio",
        description: "Adicione produtos ao seu carrinho antes de continuar.",
        buttonText: "Explorar produtos",
      });
      setShowDialog(true);
      return;
    }

    router.push("/cart/identification");
  };

  const handleHomeClick = () => {
  if (pathname === "/") {
    setIsSheetOpen(false); // fecha primeiro
    setTimeout(() => {
      router.refresh(); // só depois de fechar, dá refresh
    }, 300); // tempo da animação do Sheet
  } else {
    setIsSheetOpen(false);
    router.push("/");
  }
};

  return (
    <header className="flex items-center justify-between p-5 sticky top-0 bg-white h-16 shadow z-50 mb-4 shadow-none">
      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-3">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-6 px-5">
              {/* Login ou Perfil */}
              {session?.user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={session?.user?.image as string | undefined}
                      />
                      <AvatarFallback>
                        {session?.user?.name?.split(" ")?.[0]?.[0]}
                        {session?.user?.name?.split(" ")?.[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{session?.user?.name}</h3>
                      <span className="text-muted-foreground block text-xs">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      authClient.signOut();
                      router.refresh();
                    }}
                  >
                    <LogOutIcon />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
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
              )}

              <Separator />

              {/* Links principais */}
              <nav className="flex flex-col gap-4 text-sm">
                <SheetClose asChild>
                  <button
                    onClick={() => handleHomeClick()}
                    className="flex items-center gap-2 text-left cursor-pointer"
                  >
                    <HomeIcon className="w-4 h-4" />
                    Início
                  </button>
                </SheetClose>

                <button
                  onClick={handleOrdersClick}
                  className="flex items-center gap-2 text-left cursor-pointer"
                >
                  <PackageIcon className="w-4 h-4" />
                  Meus pedidos
                </button>

                <button
                  onClick={handleCartClick}
                  className="flex items-center gap-2 text-left cursor-pointer"
                >
                  <ShoppingBasketIcon className="w-4 h-4" />
                  Carrinho
                </button>
              </nav>

              <Separator />

              {/* Categorias */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold">Categorias</h4>
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="text-sm hover:font-semibold"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Cart />
      </div>

      {/* Dialog personalizado */}
      <PersonilazedDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={dialogProps.title}
        description={dialogProps.description}
        buttonText={dialogProps.buttonText}
      />
    </header>
  );
};
