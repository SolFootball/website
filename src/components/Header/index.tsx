"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import SessionUser from "../SessionUser";

export default function Header() {
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const MENU_ITEMS = [
    { text: "About", href: "/about" },
    { text: "Pricing", href: "/pricing" },
    { text: "Leaderboards", href: "/leaderboards" },
    { text: "dApp", href: "/dapp" },
  ];

  return (
    <div className="flex z-[40] py-2 text-white bg-[#37003c] justify-between items-center gap-8 fixed top-0 right-0 w-full font-medium px-8 backdrop-blur-lg">
      <Link href={"/"}>
        <div className="flex justify-center items-center gap-4">
          <Image src={"/fpl.png"} alt="logo" width={40} height={40} />
          <p>DGNTASY</p>
        </div>
      </Link>

      <div className="flex justify-center items-center gap-4">
        <Image src={"/solana.png"} alt="logo" width={40} height={40} />
        <p className="tracking-widest font-bold ps-2">
          BET ON FANTASY PREMIER LEAGUE FOR GAMEWEEK 7
        </p>
        <Image src={"/usdc.png"} alt="logo" width={50} height={50} />
      </div>

      {/* Ensure this button is only rendered after the client-side mount */}
      <div className="px-4 text-theme font-semibold rounded-lg">
        {isMounted && <SessionUser />} {/* Conditional rendering */}
      </div>
    </div>
  );
}
