"use client";

import SubNavbarLink from "@/components/navigation/SubNavbarLink";
import { useNavbarStore } from "@/stores/useNavbarStore";

import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const selectedNavbarLink = useNavbarStore(
    (state) => state.selectedNavbarLink
  );
  const setSelectedNavbarLink = useNavbarStore(
    (state) => state.setSelectedNavbarLink
  );

  const handleSelectSubNavbar = (path: string) => {
    setSelectedNavbarLink(path);
  };

  useEffect(() => {
    function activeNavbarLink() {
      setSelectedNavbarLink("/shop/body");
    }

    activeNavbarLink();
  }, [setSelectedNavbarLink]);

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
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {children}
        </div>
      </div>
    </main>
  );
};

export default Layout;