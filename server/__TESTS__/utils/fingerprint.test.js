import { expect, jest } from "@jest/globals";
import { EventEmitter } from "events";

jest.unstable_mockModule("child_process", () => ({
  spawn: jest.fn(),
}));

jest.unstable_mockModule("../../utils/logger.js", () => ({
  default: {
    error: jest.fn(),
  },
}));

const { spawn } = await import("child_process");
const { default: logger } = await import("../../utils/logger.js");
const { getFingerPrint } = await import("../../utils/fingerprint.js");

describe("getFingerPrint", () => {
  let mockProc;

  beforeEach(() => {
    jest.clearAllMocks();

    mockProc = new EventEmitter();
    mockProc.stdout = new EventEmitter();
    mockProc.stderr = new EventEmitter();
    spawn.mockReturnValue(mockProc);
  });

  test("should return fingerprint and rounded duration on success", async () => {
    const mockData = { fingerprint: "hash123", duration: 180.52 };
    const promise = getFingerPrint("music.mp3");

    mockProc.stdout.emit("data", Buffer.from(JSON.stringify(mockData)));

    mockProc.emit("close", 0);

    const result = await promise;

    expect(result).toEqual({ fingerprint: "hash123", duration: 181 });
    expect(spawn).toHaveBeenCalledWith("fpcalc", ["-json", "music.mp3"]);
  });

  test("should reject if filePath is not provided", async () => {
    await expect(getFingerPrint(null)).rejects.toThrow(
      "Caminho do arquivo é obrigatório",
    );
  });

  test("should handle execution error when fpcalc binary is not found (error event)", async () => {
    const promise = getFingerPrint("music.mp3");

    mockProc.emit("error", new Error("ENOENT"));

    await expect(promise).rejects.toThrow(
      "Não foi possível executar o fpcalc: ENOENT",
    );
    expect(logger.error).toHaveBeenCalled();
  });

  test("should reject if the exit code is non-zero", async () => {
    const promise = getFingerPrint("corrupted_file.mp3");

    mockProc.stderr.emit("data", Buffer.from("Invalid file format"));
    mockProc.emit("close", 1);

    await expect(promise).rejects.toThrow(
      /fpcalc falhou com código 1: Invalid file format/,
    );
    expect(logger.error).toHaveBeenCalled();
  });

  test("should reject and log if the returned output is not valid JSON", async () => {
    const promise = getFingerPrint("music.mp3");

    mockProc.stdout.emit("data", Buffer.from("Internal Server Error"));
    mockProc.emit("close", 0);

    await expect(promise).rejects.toThrow(
      "Falha ao processar resposta do fpcalc",
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Erro ao processar JSON"),
    );
  });

  test("should reject if the fpcalc response is missing required fields", async () => {
    const promise = getFingerPrint("music.mp3");

    mockProc.stdout.emit(
      "data",
      Buffer.from(JSON.stringify({ duration: 100 })),
    );
    mockProc.emit("close", 0);

    await expect(promise).rejects.toThrow(
      "Falha ao processar resposta do fpcalc",
    );
  });
});
