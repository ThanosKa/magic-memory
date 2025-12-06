"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Cookie, X } from "lucide-react"

const COOKIE_CONSENT_KEY = "cookie-consent"

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false)

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
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
                >
                        <div className="mx-auto max-w-4xl">
                            <div className="relative flex flex-col gap-4 rounded-2xl border border-border bg-background/95 p-6 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                            <button
                                onClick={handleDecline}
                                className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex items-start gap-4 pr-8 sm:pr-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Cookie className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-foreground">Cookie Notice</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We use essential cookies for authentication and session management.{" "}
                                        <Link
                                            href="/privacy"
                                            className="font-medium text-primary underline-offset-4 hover:underline"
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
