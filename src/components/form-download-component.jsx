import { useState } from "preact/hooks";

export default function Downloader({ onDownload }) {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("mp3");

  async function execDownload() {
    const response = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ url, type }),
    });

    if (!response.ok) return alert("Erro ao baixar");

    onDownload();
  }

  return (
    <>
      <input
        value={url}
        onInput={(e) => setUrl(e.target.value)}
        placeholder="URL"
        class="w-full rounded-lg border border-gray-300 p-3 text-gray-700 placeholder-gray-400 focus:border-amber-500 focus:ring-2  focus:ring-amber-400 focus:outline-none"
      />

      <div class="flex w-full gap-3">
        <select
          style="color:black"
          value={type}
          onInput={(e) => setType(e.target.value)}
          class="flex-1 rounded-lg border border-gray-300 p-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
        >
          <option value="mp3">.MP3 (Áudio)</option>
          <option value="mp4">.MP4 (Vídeo)</option>
        </select>

        <button
          onClick={execDownload}
          class="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 transition"
        >
          BAIXAR
        </button>
      </div>
    </>
  );
}
