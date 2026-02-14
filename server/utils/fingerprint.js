import { spawn } from "child_process";
import logger from "./logger.js";

export async function getFingerPrint(filePath) {
  if (!filePath) throw new Error("Caminho do arquivo é obrigatório");

  return new Promise((resolve, reject) => {
    const proc = spawn("fpcalc", ["-json", filePath]);

    let output = "";
    let errorOutput = "";

    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    proc.on("error", (err) => {
      logger.error(`Falha ao iniciar fpcalc para ${filePath}: ${err.message}`);
      reject(new Error(`Não foi possível executar o fpcalc: ${err.message}`));
    });

    proc.on("close", (code) => {
      if (code === 0) {
        try {
          const json = JSON.parse(output);

          if (!json.fingerprint || json.duration === undefined) {
            throw new Error("Resposta do fpcalc incompleta");
          }

          resolve({
            fingerprint: json.fingerprint,
            duration: Math.round(json.duration),
          });
        } catch (e) {
          logger.error(
            `Erro ao processar JSON do fpcalc para ${filePath}. Saída: ${output}`,
          );
          reject(new Error("Falha ao processar resposta do fpcalc"));
        }
      } else {
        const errorMsg = `fpcalc falhou com código ${code}: ${errorOutput.trim()}`;
        logger.error(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  });
}
