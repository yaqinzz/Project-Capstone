import Link from "next/link";
import { Button } from "../ui/button";
import { supabase } from "~/lib/supabase/client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async function () {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    })();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b-2 border-border bg-secondary px-4 md:h-20 md:px-8">
      <Link
        href={"/"}
        className="flex gap-2 text-2xl font-bold text-primary hover:cursor-pointer md:text-3xl"
      >
        <Image src="logos/logo.svg" alt="logo" width={36} height={36} />
        <span className="hidden md:inline">OptiHealth</span>
      </Link>
      <nav className="flex gap-4">
        <Link
          href={"/"}
          className={`text-lg hover:cursor-pointer ${
            usePathname() === "/" ? "border-b-4 border-purple-500" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href={"/dataset"}
          className={`text-lg hover:cursor-pointer ${
            usePathname() === "/dataset" ? "border-b-4 border-purple-500" : ""
          }`}
        >
          Dataset
        </Link>
      </nav>
      <div className="flex gap-4">
        {isLoading ? null : isLoggedIn ? (
          <Button onClick={logout} className="bg-red-500">
            Logout
          </Button>
        ) : (
          <>
            <Link href={"/login"}>
              <Button className="bg-blue-500">Login</Button>
            </Link>
            <Link href={"/register"}>
              <Button>Register</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
