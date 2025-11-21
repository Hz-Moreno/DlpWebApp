import { useState } from "preact/hooks";

export default function Downloader({ onDownload }) {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("mp3");
  const [isLoading, setIsLoading] = useState(false);

  async function execDownload() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ url, type }),
      });

      if (!response.ok) return alert("Erro ao baixar");

      onDownload();
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
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
          disable={isLoading}
          onClick={execDownload}
          class="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 transition"
        >
          {isLoading ? (
            <>
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processando...
            </>
          ) : (
            "BAIXAR"
          )}
        </button>
      </div>
    </>
  );
}
