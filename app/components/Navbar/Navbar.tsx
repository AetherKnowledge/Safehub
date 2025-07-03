import React from "react";
import NavbarButton from "./NavbarButton";
import UserButton from "./UserButton";
import lcupLogo from "@/public/images/lcupLogo.png";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 p-5 fixed top-0 left-0 w-full z-1">
      <div className="navbar-start">
        <Image src={lcupLogo} alt="logo" width={60} height={60} priority />
        <h1 className="text-base-content font-bold pl-3 text-shadow-br">
          LCUP Mental Care
        </h1>
      </div>
      <div className="navbar-center pl-10">
        <div className="flex items-center space-x-15">
          <NavbarButton href="/user">Dashboard</NavbarButton>
          <NavbarButton href="/">Home</NavbarButton>
          <NavbarButton href="/about">About</NavbarButton>
          <NavbarButton href="/booking">Booking</NavbarButton>
          <NavbarButton href="/contact">Contact</NavbarButton>
        </div>
      </div>
      <div className="navbar-end">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
