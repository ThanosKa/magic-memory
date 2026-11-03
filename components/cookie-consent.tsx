"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"

const COOKIE_CONSENT_KEY = "cookie-consent"

// Same shape as the home hero's secondary action: plain text that underlines on
// hover, so Decline never looks like the Accept pill.
const declineClass =
    "focus-ring group inline-flex min-h-11 cursor-pointer items-center px-2 text-[14px] font-medium text-paper/80 transition-colors hover:text-paper"

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false)
    const reduceMotion = useReducedMotion()
    // A short rise and fade, no spring: a notice should arrive, not bounce.
    // Full transform strings so Framer Motion runs it on the compositor.
    // Reduced motion: fade only.
    const hidden = { transform: `translateY(${reduceMotion ? 0 : 16}px)`, opacity: 0 }

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
        if (!consent) {
            const timer = setTimeout(() => setShowBanner(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
        setShowBanner(false)
    }

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
        setShowBanner(false)
    }

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={hidden}
                    animate={{ transform: "translateY(0px)", opacity: 1 }}
                    exit={hidden}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
                >
                    <div
                        role="region"
                        aria-label="Cookie notice"
                        className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-paper/15 bg-ink/95 p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-paper/15">
                                <Cookie className="size-5 text-ember" aria-hidden="true" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-serif text-xl leading-none text-paper">Cookie Notice</p>
                                <p className="text-sm leading-relaxed text-paper/70">
                                    We use essential cookies for authentication and session management.{" "}
                                    <Link
                                        href="/privacy"
                                        className="focus-ring mm-underline font-medium text-paper"
                                    >
                                        Learn more
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3 sm:ml-4">
                            <button type="button" onClick={handleDecline} className={declineClass}>
                                <span className="mm-underline">Decline</span>
                            </button>
                            <Button size="sm" onClick={handleAccept} className="min-w-[88px]">
                                Accept
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
