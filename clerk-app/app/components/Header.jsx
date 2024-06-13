import React from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  const { userId } = auth();
  console.log("This is the User Id : ", userId);
  return (
    <>
      <nav className="bg-primary py-4 px-6 flex items-center justify-between mb-5">
        <div className="flex item-center">
          <Link href="/">
            <div className="text-lg uppercase font-bold text-white">
              Clerk <span className="lowercase">.io</span>
            </div>
          </Link>
        </div>
        {userId ? (
          <div className="flex items-center justify-center p-2 gap-3 text-gray-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/profile" className="hover:text-white">Profile</Link>
            <UserButton />
          </div>
        ) : (
          <div className="flex gap-3 items-center p-2 font-medium tex-lg text-white">
            <Link href="/sign-in" className="hover:text-black">
              Log In
            </Link>
            <Link href="/sign-up" className="hover:text-black ">
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
