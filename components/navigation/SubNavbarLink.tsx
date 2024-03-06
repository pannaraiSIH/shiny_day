import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SubNavbarProps {
  children: React.ReactNode;
  href: string;
  selectedSubNavbarLink: string;
  handleSelectSubNavbar: (state: string) => void;
}

const SubNavbarLink = ({
  children,
  href,
  selectedSubNavbarLink,
  handleSelectSubNavbar,
}: SubNavbarProps) => {
  return (
    <li
      className={`${
        selectedSubNavbarLink === href ? "text-muted bg-primary" : ""
      } uppercase text-sm text-center border border-primary rounded-md cursor-pointer transition-all list-none`}
      onClick={() => handleSelectSubNavbar(href)}
    >
      <Link href={href} replace={true} className='inline-block py-2 px-3 '>
        {children}
      </Link>
    </li>
  );
};

export default SubNavbarLink;
