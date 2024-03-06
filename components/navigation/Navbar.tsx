"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { ChevronDownCircle, ShoppingCart } from "lucide-react";
import Logo from "../Logo";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavLink from "./NavLink";
import { usePathname, useRouter } from "next/navigation";
import { usePrimaryNavbarStore } from "@/stores/useNavbarStore";
import { useCartStore } from "@/stores/useShopStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const selectedPrimaryNavbarLink = usePrimaryNavbarStore(
    (state) => state.selectedPrimaryNavbarLink
  );
  const setSelectedPrimaryNavbarLink = usePrimaryNavbarStore(
    (state) => state.setSelectedPrimaryNavbarLink
  );
  const cart = useCartStore((state) => state.cart);
  const pathname = usePathname();
  const totalAmountOfItemsInCart = cart.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user.name;
  const role = session?.user.role;

  const handleSelectNavbarLink = (link: string) => {
    setSelectedPrimaryNavbarLink(link.toLocaleLowerCase());
  };

  const handleLogin = () => {
    if (!session) router.push("/login");
  };

  useEffect(() => {
    window.onscroll = () => {
      setScrollY(window.scrollY);
    };
  }, []);

  useEffect(() => {
    function checkSession() {
      if (session) setIsLogin(true);
    }

    checkSession();
  }, [session]);

  useEffect(() => {
    function activeLink() {
      const item = pathname.split("/")[1];
      const activeLink = item === "" ? "home" : item;
      setSelectedPrimaryNavbarLink(activeLink);
    }

    activeLink();
  }, [pathname, setSelectedPrimaryNavbarLink]);

  return (
    <>
      {pathname !== "/login" && (
        <header
          className={`fixed z-20 top-0 right-0 left-0 border-b border-black transition-all ${
            scrollY > 30 ? "bg-white" : ""
          }`}
        >
          <div className='container flex justify-between min-h-[4.5rem] '>
            <Logo />

            <nav className='hidden md:block'>
              <ul className='h-full flex items-center'>
                <NavLink
                  href='/'
                  selectedPrimaryNavbarLink={selectedPrimaryNavbarLink}
                  handleSelectNavbarLink={handleSelectNavbarLink}
                >
                  Home
                </NavLink>
                <NavLink
                  href='/shop/body'
                  selectedPrimaryNavbarLink={selectedPrimaryNavbarLink}
                  handleSelectNavbarLink={handleSelectNavbarLink}
                >
                  Shop
                </NavLink>
                <NavLink
                  selectedPrimaryNavbarLink={selectedPrimaryNavbarLink}
                  href='/wishlist'
                  handleSelectNavbarLink={handleSelectNavbarLink}
                >
                  Wishlist
                </NavLink>
              </ul>
            </nav>

            <div className='hidden md:flex md:items-center md:gap-4'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='rounded-full' onClick={handleLogin}>
                    <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback>
                        {username
                          ? username.substring(0, 2).toUpperCase()
                          : "LO"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                {isLogin && (
                  <>
                    <DropdownMenuContent className='w-56'>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>{username}</DropdownMenuItem>
                      </DropdownMenuGroup>
                      <Link href={"/admin/users"}>
                        <DropdownMenuItem
                          disabled={role !== "admin" ? true : false}
                        >
                          admin
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </>
                )}
              </DropdownMenu>

              <Link href={"/checkout"}>
                <div className='relative cursor-pointer'>
                  <ShoppingCart strokeWidth={1.5} />
                  <Badge className='absolute bottom-4 left-2 rounded-full'>
                    {totalAmountOfItemsInCart}
                  </Badge>
                </div>
              </Link>
            </div>

            <Sheet>
              <SheetTrigger className='md:hidden'>
                <ChevronDownCircle />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <nav className=''>
                    <ul className='h-full flex flex-col gap-4'>
                      <NavLink
                        href='/'
                        selectedPrimaryNavbarLink={selectedPrimaryNavbarLink}
                        handleSelectNavbarLink={handleSelectNavbarLink}
                      >
                        Home
                      </NavLink>
                      <NavLink
                        href='/shop/body'
                        selectedPrimaryNavbarLink={selectedPrimaryNavbarLink}
                        handleSelectNavbarLink={handleSelectNavbarLink}
                      >
                        Shop
                      </NavLink>
                      <NavLink
                        href='/wishlist'
                        selectedPrimaryNavbarLink={selectedPrimaryNavbarLink}
                        handleSelectNavbarLink={handleSelectNavbarLink}
                      >
                        Wishlist
                      </NavLink>
                      <NavLink
                        href='/checkout'
                        selectedPrimaryNavbarLink={selectedPrimaryNavbarLink}
                        handleSelectNavbarLink={handleSelectNavbarLink}
                      >
                        Checkout
                      </NavLink>
                    </ul>
                  </nav>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      )}
    </>
  );
};

export default Navbar;
