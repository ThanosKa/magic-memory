"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, Coins } from "lucide-react";
import useSWR from "swr";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function HeaderWithClerk() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const { data: creditsData } = useSWR(
    isSignedIn ? "/api/credits" : null,
    fetcher
  );
  const totalCredits = creditsData?.data?.totalCredits ?? 0;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    ...(isSignedIn ? [{ href: "/restore", label: "Restore" }] : []),
  ];

  return (
    <>
      <AnnouncementBanner />
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="Magic Memory Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold">Magic Memory</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {isLoaded && isSignedIn && (
              <Link
                href="/pricing"
                className="hidden items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/80 hover:text-primary sm:flex"
              >
                <Coins className="h-4 w-4 text-primary" />
                <span>{totalCredits} credits</span>
              </Link>
            )}

            {isLoaded && !isSignedIn && (
              <div className="hidden items-center gap-2 md:flex">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Get Started</Button>
                </SignUpButton>
              </div>
            )}

            {isLoaded && isSignedIn && <UserButton afterSignOutUrl="/" />}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 pt-6">
                  {isSignedIn && (
                    <Link
                      href="/pricing"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium w-fit transition-colors hover:bg-accent/80 hover:text-primary"
                    >
                      <Coins className="h-4 w-4 text-primary" />
                      <span>{totalCredits} credits</span>
                    </Link>
                  )}
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary ${pathname === link.href
                          ? "text-foreground"
                          : "text-muted-foreground"
                          }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  {!isSignedIn && (
                    <div className="flex flex-col gap-2 pt-4">
                      <SignInButton mode="modal">
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button className="w-full">Get Started</Button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

function HeaderWithoutClerk() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <>
      <AnnouncementBanner />
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="Magic Memory Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold">Magic Memory</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="ghost"
                size="sm"
                disabled
                title="Configure Clerk to enable sign in"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                disabled
                title="Configure Clerk to enable sign up"
              >
                Get Started
              </Button>
            </div>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 pt-6">
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary ${pathname === link.href
                          ? "text-foreground"
                          : "text-muted-foreground"
                          }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      disabled
                    >
                      Sign In
                    </Button>
                    <Button className="w-full" disabled>
                      Get Started
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

export function Header() {
  const [mounted, setMounted] = useState(false);
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <AnnouncementBanner />
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="Magic Memory Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold">Magic Memory</span>
            </Link>
          </div>
        </header>
      </>
    );
  }

  return hasClerk ? <HeaderWithClerk /> : <HeaderWithoutClerk />;
}
