"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import React from "react";
import Logo from "../Logo";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/login" && (
        <footer className='bg-primary text-muted py-12'>
          <div className='container'>
            <div className='flex flex-col gap-4 md:flex-row md:gap-12'>
              <div>
                <Logo />
              </div>

              <div className='hidden md:flex'>
                <Separator
                  orientation='vertical'
                  className='bg-muted w-[0.05rem] h-full'
                />
              </div>

              <ul className='flex gap-6'>
                <li>
                  <a href='mailto:pannarai.sht@gmail.com'>
                    <Mail />
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.linkedin.com/in/pannarai-sih/'
                    target='blank'
                  >
                    <Linkedin />
                  </a>
                </li>
                <li>
                  <a href='https://github.com/pannaraiSIH' target='blank'>
                    <Github />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
