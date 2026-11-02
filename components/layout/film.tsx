/**
 * The padded cream print frame (with its drop shadow) that every photo in
 * focus sits in: the home lens, the restore screen and the use-case heroes.
 */
export const PRINT_FRAME_CLASS =
  "rounded-[4px] bg-print p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85),0_2px_6px_rgba(0,0,0,0.3)] sm:p-3";

/** A row of film-strip sprocket holes, drawn above and below a strip of frames. */
export function Sprockets() {
  return <div className="mm-sprockets h-[14px] w-full" aria-hidden="true" />;
}
