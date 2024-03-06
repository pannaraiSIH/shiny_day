"use client";

import SubNavbarLink from "@/components/navigation/SubNavbarLink";
import { useNavbarStore } from "@/stores/useNavbarStore";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const selectedNavbarLink = useNavbarStore(
    (state) => state.selectedNavbarLink
  );
  const setSelectedNavbarLink = useNavbarStore(
    (state) => state.setSelectedNavbarLink
  );
  const pathname = usePathname();

  const handleSelectSubNavbar = (path: string) => {
    setSelectedNavbarLink(path);
  };

  useEffect(() => {
    function activeNavbarLink() {
      setSelectedNavbarLink(pathname);
    }

    activeNavbarLink();
  }, [pathname, setSelectedNavbarLink]);

  return (
    <main className='flex-1 pt-[4.5rem]'>
      <div className=' border-b border-primary'>
        <nav className='container flex justify-center py-12 gap-4'>
          <SubNavbarLink
            href='/admin/users'
            selectedSubNavbarLink={selectedNavbarLink}
            handleSelectSubNavbar={handleSelectSubNavbar}
          >
            Users
          </SubNavbarLink>
          <SubNavbarLink
            href='/admin/products'
            selectedSubNavbarLink={selectedNavbarLink}
            handleSelectSubNavbar={handleSelectSubNavbar}
          >
            Products
          </SubNavbarLink>
          <SubNavbarLink
            href='/admin/promotions'
            selectedSubNavbarLink={selectedNavbarLink}
            handleSelectSubNavbar={handleSelectSubNavbar}
          >
            Promotions
          </SubNavbarLink>
        </nav>
      </div>

      <div className='container py-16'>{children}</div>
    </main>
  );
};

export default Layout;
