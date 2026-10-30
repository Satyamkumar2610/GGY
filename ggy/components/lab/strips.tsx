import Image from "next/image";
import { photos, type PhotoKey } from "@/content/ggy";

/** One photograph cut into n seamless strips (vertical or horizontal). Inner layers carry [data-si]. */
export function Strips({ n, axis, photo = "highCourt", sizes = "100vw" }: { n: number; axis: "v" | "h"; photo?: PhotoKey; sizes?: string }) {
  const p = photos[photo];
  return (
    <div className="absolute inset-0">
      {Array.from({ length: n }, (_, i) => (
        <div
          key={i}
          data-s
          className="absolute overflow-hidden"
          style={axis === "v" ? { top: 0, bottom: 0, left: `${(100 / n) * i}%`, width: `${100 / n}%` } : { left: 0, right: 0, top: `${(100 / n) * i}%`, height: `${100 / n}%` }}
        >
          <div
            data-si
            className="absolute"
            style={axis === "v" ? { top: 0, height: "100%", width: `${n * 100}%`, left: `${-i * 100}%`, transformOrigin: "56% 42%" } : { left: 0, width: "100%", height: `${n * 100}%`, top: `${-i * 100}%`, transformOrigin: "56% 42%" }}
          >
            <Image src={p.src} alt={i === 0 ? p.alt : ""} fill sizes={sizes} className="object-cover" style={{ objectPosition: "56% 40%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
