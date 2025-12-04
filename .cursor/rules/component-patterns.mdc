# Component Patterns for Cursor

## Client Component Template

\`\`\`tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface MyComponentProps {
  title: string
  initialValue?: number
  onComplete: (value: number) => void
}

export function MyComponent({ 
  title, 
  initialValue = 0,
  onComplete 
}: MyComponentProps) {
  const [value, setValue] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // async operation
      onComplete(value)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </Button>
    </motion.div>
  )
}
\`\`\`

## Server Component Template

\`\`\`tsx
import { auth } from "@clerk/nextjs/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ClientComponent } from "./client-component"

export async function ServerComponent() {
  const { userId } = await auth()
  
  if (!userId) {
    return <div>Please sign in</div>
  }

  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", userId)
    .single()

  return <ClientComponent initialData={data} />
}
\`\`\`

## Animation Patterns

Use Framer Motion for all animations:

\`\`\`tsx
// Fade in on mount
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>

// Fade in when scrolled into view
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>

// Stagger children
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map(i => (
    <motion.li key={i} variants={item}>{i}</motion.li>
  ))}
</motion.ul>
\`\`\`

## Data Fetching

Client components use SWR:

\`\`\`tsx
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

function MyComponent() {
  const { data, error, isLoading, mutate } = useSWR("/api/data", fetcher)
  
  if (isLoading) return <Skeleton />
  if (error) return <Error />
  
  return <div>{data.value}</div>
}
\`\`\`

Never fetch in useEffect. Use SWR or pass data from Server Components.
