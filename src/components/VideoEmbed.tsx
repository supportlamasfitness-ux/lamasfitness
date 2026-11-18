import { videoEmbed } from "@/lib/exercise-store";

// Vista previa del video sugerido (YouTube, Vimeo o archivo directo). Si el enlace no se reconoce, muestra un enlace.
export default function VideoEmbed({ url }: { url: string }) {
  const v = videoEmbed(url);
  if (!url.trim()) return null;
  if (!v) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-red-500 underline">
        Ver video ↗
      </a>
    );
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
      {v.kind === "iframe" ? (
        <iframe src={v.src} title="Video del ejercicio" className="h-full w-full" loading="lazy"
          allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen />
      ) : (
        <video src={v.src} controls preload="metadata" className="h-full w-full" />
      )}
    </div>
  );
}
