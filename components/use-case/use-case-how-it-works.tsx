import { Upload, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "1",
    title: "Upload Your Photo",
    description: "Upload a JPEG, PNG, or WebP photo up to 10MB.",
  },
  {
    icon: Sparkles,
    step: "2",
    title: "AI Restores It",
    description: "GFPGAN AI restores faces and enhances photo quality in 5–15 seconds.",
  },
  {
    icon: Download,
    step: "3",
    title: "Download Your Result",
    description: "Download your restored photo in full resolution, ready to share or print.",
  },
];

export function UseCaseHowItWorks() {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three steps to restore your photo in seconds.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -right-4 top-6 hidden text-4xl font-bold text-muted-foreground/20 sm:block">
                {item.step}
              </div>
              <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
