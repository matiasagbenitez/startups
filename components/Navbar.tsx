import React from "react";
import { auth, signOut, signIn } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { BadgePlus, GithubIcon, LogOut, Rocket } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = async () => {
  const session = await auth();
  return (
    <div className="px-3 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-black">
          <Rocket className="size-6" />
          <span className="text-xl font-bold">
            Pitch
            <span className="font-normal">Express</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-black">
          {session && session.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden">Nueva idea</span>
                <BadgePlus className="size-5 sm:hidden text-green-700" />
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
                className="flex items-center gap-3"
              >
                <button type="submit">
                  <span className="max-sm:hidden">Cerrar sesión</span>
                  <LogOut className="size-5 sm:hidden text-red-700" />
                </button>
              </form>
              <Link href={`/user/${session.id}`}>
                <Avatar className="size-6">
                  <AvatarImage src={session?.user?.image || ""} alt="Avatar" />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button type="submit">
                <span className="flex items-center gap-2">
                  <GithubIcon className="size-5" />
                  Iniciar sesión
                </span>
              </button>
            </form>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
