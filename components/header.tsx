"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, Coins } from "lucide-react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { PageContainer } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreditsSkeleton } from "@/components/ui/loading-states";
import { ThemeToggle } from "@/components/theme/theme-toggle";


const headerClass =
  "sticky top-0 z-50 w-full border-b border-paper/10 bg-ink/85 backdrop-blur supports-[backdrop-filter]:bg-ink/70";

const creditsPillClass =
  "focus-ring font-mono items-center gap-2 rounded-full border border-paper/15 px-3.5 py-2 text-[12px] uppercase tracking-[0.12em] text-paper transition-colors hover:border-paper/40 hover:bg-paper/[0.06]";

function navLinkClass(isActive: boolean, variant: "desktop" | "mobile") {
  return variant === "desktop"
    ? cn(
        "focus-ring mm-underline text-sm transition-colors hover:text-paper",
        isActive ? "text-paper" : "text-paper/70"
      )
    : cn(
        "focus-ring flex min-h-11 w-full items-center border-b border-paper/10 py-3 font-serif text-[32px] leading-none tracking-[-0.01em] transition-colors hover:text-paper",
        isActive ? "text-paper" : "text-paper/70"
      );
}

function Brand() {
  return (
    <Link href="/" className="focus-ring flex min-h-11 items-center gap-2.5 rounded-md">
      <BrandMark className="text-paper" />
      <span className="font-serif text-[22px] leading-none tracking-[-0.01em] text-paper">
        Magic Memory
      </span>
    </Link>
  );
}

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
    { href: "/blog", label: "Blog" },
  ];

  const renderNavLink = (link: NavLink, variant: "desktop" | "mobile") => {
    const isActive = pathname === link.href;
    const classes = navLinkClass(isActive, variant);
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
      <header className={headerClass}>
        <PageContainer className="flex h-16 items-center justify-between">
          <Brand />

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => renderNavLink(link, "desktop"))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle className="hidden md:inline-flex" />
            {isLoaded &&
              isSignedIn &&
              (isCreditsLoading ? (
                <div className="hidden sm:flex">
                  <CreditsSkeleton />
                </div>
              ) : (
                <Link
                  href="/pricing"
                  className={cn(creditsPillClass, "hidden sm:flex")}
                >
                  <Coins className="size-4 text-ember" aria-hidden="true" />
                  <span>{totalCredits} credits</span>
                </Link>
              ))}

            {/* Rendered while Clerk is still loading too, so the header is never
                empty; Clerk queues a click until it has loaded. */}
            {!isSignedIn && (
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

            {isLoaded && isSignedIn && <UserButton />}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 max-w-[90vw] px-5">
                <div className="flex flex-col gap-6 pt-14">
                  {isSignedIn &&
                    (isCreditsLoading ? (
                      <CreditsSkeleton />
                    ) : (
                      <Link
                        href="/pricing"
                        onClick={() => setMobileOpen(false)}
                        className={cn(creditsPillClass, "flex w-fit")}
                      >
                        <Coins className="size-4 text-ember" aria-hidden="true" />
                        <span>{totalCredits} credits</span>
                      </Link>
                    ))}
                  <nav className="flex flex-col">
                    {navLinks.map((link) => renderNavLink(link, "mobile"))}
                  </nav>
                  <ThemeToggle variant="row" />
                  {!isSignedIn && (
                    <div className="flex flex-col gap-3 pt-2">
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full">
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
        </PageContainer>
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
    { href: "/blog", label: "Blog" },
  ];

  return (
    <>
      <header className={headerClass}>
        <PageContainer className="flex h-16 items-center justify-between">
          <Brand />

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(pathname === link.href, "desktop")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle className="hidden md:inline-flex" />
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
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 max-w-[90vw] px-5">
                <div className="flex flex-col gap-6 pt-14">
                  <nav className="flex flex-col">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={navLinkClass(pathname === link.href, "mobile")}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <ThemeToggle variant="row" />
                  <div className="flex flex-col gap-3 pt-2">
                    <Button variant="outline" className="w-full" disabled>
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
        </PageContainer>
      </header>
    </>
  );
}

export function Header() {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return hasClerk ? <HeaderWithClerk /> : <HeaderWithoutClerk />;
}
