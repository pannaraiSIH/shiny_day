import React from "react";

interface HeaderText {
  children: React.ReactNode;
}

const HeaderText = ({ children }: HeaderText) => {
  return <h2 className='text-xl uppercase'>{children}</h2>;
};

export default HeaderText;
