"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"

const COOKIE_CONSENT_KEY = "cookie-consent"

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false)
    const reduceMotion = useReducedMotion()
    // Full transform strings (not the `y` shorthand) so Framer Motion can run
    // this on the compositor. Reduced motion: fade only, no slide.
    const hidden = { transform: `translateY(${reduceMotion ? 0 : 100}px)`, opacity: 0 }

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
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
                >
                        <div className="mx-auto max-w-4xl">
                            <div className="flex flex-col gap-4 rounded-2xl border border-paper/15 bg-ink/95 p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/15">
                                    <Cookie className="size-5 text-ember" aria-hidden="true" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-serif text-xl leading-none text-paper">Cookie Notice</h3>
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

                            <div className="flex shrink-0 gap-2 sm:ml-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDecline}
                                    className="min-w-[80px]"
                                >
                                    Decline
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleAccept}
                                    className="min-w-[80px]"
                                >
                                    Accept
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
