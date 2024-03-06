import { Rainbow } from "lucide-react";
import React from "react";

interface Logo {
  className?: string;
}

const Logo = ({ className }: Logo) => {
  return (
    <div
      className={`flex items-center font-bold uppercase text-xl whitespace-nowrap ${className}`}
    >
      Shiny D
      <span>
        <Rainbow strokeWidth={1.5} size={28} />
      </span>
      y
    </div>
  );
};

export default Logo;
