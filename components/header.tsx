"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, Coins } from "lucide-react";
import useSWR from "swr";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreditsSkeleton } from "@/components/ui/loading-states";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type NavLink = {
  href: string;
  label: string;
};

function HeaderWithClerk() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const { data: creditsData, isLoading: isCreditsLoading } = useSWR(
    isSignedIn ? "/api/credits" : null,
    fetcher
  );
  const totalCredits = creditsData?.data?.totalCredits ?? 0;

  const navLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/restore", label: "Restore" },
    { href: "/pricing", label: "Pricing" },
  ];

  const renderNavLink = (link: NavLink, variant: "desktop" | "mobile") => {
    const isActive = pathname === link.href;
    const classes =
      variant === "desktop"
        ? `text-sm font-medium transition-colors hover:text-primary ${
            isActive ? "text-foreground" : "text-muted-foreground"
          }`
        : `rounded-md px-2 py-1.5 text-lg font-medium transition-colors hover:bg-muted hover:text-primary ${
            isActive ? "bg-muted text-foreground" : "text-muted-foreground"
          }`;
    const handleClick =
      variant === "mobile" ? () => setMobileOpen(false) : undefined;

    if (link.href === "/restore" && isLoaded && !isSignedIn) {
      return (
        <SignInButton mode="modal" forceRedirectUrl="/restore" key={link.href}>
          <button
            type="button"
            className={`${classes} w-full text-left`}
            onClick={handleClick}
          >
            {link.label}
          </button>
        </SignInButton>
      );
    }

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={handleClick}
        className={classes}
      >
        {link.label}
      </Link>
    );
  };

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
            {navLinks.map((link) => renderNavLink(link, "desktop"))}
          </nav>

          <div className="flex items-center gap-4">
            {isLoaded &&
              isSignedIn &&
              (isCreditsLoading ? (
                <div className="hidden sm:flex">
                  <CreditsSkeleton />
                </div>
              ) : (
                <Link
                  href="/pricing"
                  className="hidden items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/80 hover:text-primary sm:flex"
                >
                  <Coins className="h-4 w-4 text-primary" />
                  <span>{totalCredits} credits</span>
                </Link>
              ))}

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
              <SheetContent side="right" className="w-80 max-w-[90vw] px-4">
                <div className="flex flex-col gap-6 pt-6">
                  {isSignedIn &&
                    (isCreditsLoading ? (
                      <CreditsSkeleton />
                    ) : (
                      <Link
                        href="/pricing"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium w-fit transition-colors hover:bg-accent/80 hover:text-primary"
                      >
                        <Coins className="h-4 w-4 text-primary" />
                        <span>{totalCredits} credits</span>
                      </Link>
                    ))}
                  <nav className="flex flex-col gap-3">
                    {navLinks.map((link) => renderNavLink(link, "mobile"))}
                  </nav>
                  {!isSignedIn && (
                    <div className="flex flex-col gap-3 pt-2">
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
    { href: "/restore", label: "Restore" },
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
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
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
              <SheetContent side="right" className="w-80 max-w-[90vw] px-4">
                <div className="flex flex-col gap-6 pt-6">
                  <nav className="flex flex-col gap-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`rounded-md px-2 py-1.5 text-lg font-medium transition-colors hover:bg-muted hover:text-primary ${
                          pathname === link.href
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-3 pt-2">
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
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return hasClerk ? <HeaderWithClerk /> : <HeaderWithoutClerk />;
}
