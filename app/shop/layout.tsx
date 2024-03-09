"use client";

import SubNavbarLink from "@/components/navigation/SubNavbarLink";
import { useNavbarStore } from "@/stores/useNavbarStore";
import Loading from "./loading";

import React, { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";

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
            href='/shop/body'
            selectedSubNavbarLink={selectedNavbarLink}
            handleSelectSubNavbar={handleSelectSubNavbar}
          >
            Body care
          </SubNavbarLink>
          <SubNavbarLink
            href='/shop/face'
            selectedSubNavbarLink={selectedNavbarLink}
            handleSelectSubNavbar={handleSelectSubNavbar}
          >
            Face care
          </SubNavbarLink>
          <SubNavbarLink
            href='/shop/oral'
            selectedSubNavbarLink={selectedNavbarLink}
            handleSelectSubNavbar={handleSelectSubNavbar}
          >
            Oral care
          </SubNavbarLink>
        </nav>
      </div>

      <div className='container py-16'>
        <Suspense fallback={<Loading />}>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {children}
          </div>
        </Suspense>
      </div>
    </main>
  );
};

export default Layout;
