import Image from "next/image";
import React from "react";
import Logo from "@/public/elephant.png";

const Navbar = () => {
  return (
    <div className="bg-white">
      <nav className="container mx-auto flex items-center justify-between flex-wrap p-3">
        <div className="flex flex-shrink-0 items-center">
          <Image
            priority
            className="h-10 w-auto"
            src={Logo}
            alt="Your Company"
          />
          <span className="text-slate-800 font-bold text-xl mx-2">
            Social Hub
          </span>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
