export default function DownloadsTable({ files }) {
  return (
    <div class="w-full mt-8">
      <h2 class="mb-4 text-lg font-semibold text-gray-700">
        Downloads recentes
      </h2>

      <div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table class="w-full table-auto bg-white">
          <thead class="bg-amber-100 text-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium">Arquivo</th>
              <th class="px-4 py-3 text-right text-sm font-medium">Ação</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 text-gray-600">
            {files.map((file) => (
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-4 text-sm">{file.name}</td>

                <td class="px-4 py-4 text-right">
                  <a
                    href={`/api/get-down/${encodeURIComponent(file.name)}`}
                    class="text-amber-600 hover:text-amber-800 text-sm font-medium"
                  >
                    Baixar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
