import Link from "next/link";
import React from "react";

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
  selectedPrimaryNavbarLink: string;
  handleSelectNavbarLink: (link: string) => void;
}

const NavLink = ({
  children,
  href,
  selectedPrimaryNavbarLink,
  handleSelectNavbarLink,
}: NavLinkProps) => {
  return (
    <li
      className={`h-full cursor-pointer  border-b-2  transition-all ${
        selectedPrimaryNavbarLink === String(children).toLocaleLowerCase()
          ? "border-primary"
          : "border-transparent"
      } `}
    >
      <div className='h-full flex items-center capitalize '>
        <Link
          href={href}
          onClick={() => handleSelectNavbarLink(String(children))}
          className='flex h-full w-full px-4 items-center'
        >
          {children}
        </Link>
      </div>
    </li>
  );
};

export default NavLink;
