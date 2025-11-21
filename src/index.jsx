import { render } from "preact";

import preactLogo from "./assets/preact.svg";
import FormDownload from "./components/form-download-component.jsx";
import DownloadTable from "./components/download-table-component.jsx";
import { useState, useEffect } from "preact/hooks";

export function App() {
  const [files, setFiles] = useState([]);

  async function loadFiles() {
    const res = await fetch("/api/downloaded-files");
    const data = await res.json();
    setFiles(data);
  }

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div class="flex min-h-screen w-full flex-col items-center justify-center bg-amber-50 px-4">
      <div class="flex w-full max-w-md flex-col items-center gap-6 rounded-xl bg-white p-8 shadow-2xl">
        <h1 class="text-2xl font-bold text-gray-800">DLP DOWNLOADER</h1>

        <FormDownload onDownload={loadFiles} />

        <DownloadTable files={files} />
      </div>
    </div>
  );
}

render(<App />, document.getElementById("app"));
