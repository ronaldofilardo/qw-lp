/**
 * @jest-environment node
 *
 * Testes para lib/storage/backblaze.ts e lib/storage/representante-storage.ts
 *
 * Coberturas:
 * - uploadToBackblaze: buffer vazio, credenciais ausentes (BACKBLAZE_CREDENTIALS_MISSING),
 *   endpoint inválido (SSRF), upload bem-sucedido, credenciais inválidas
 * - uploadDocumentoRepresentante: magic bytes inválidos, arquivo vazio,
 *   construção correta do path (PF/PJ, subpastas), propagação do erro de credenciais
 */

// ── Setup: guardar e restaurar env vars ────────────────────────────────────

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
  // Remover vars do Backblaze para começar "do zero"
  delete process.env.BACKBLAZE_KEY_ID;
  delete process.env.BACKBLAZE_ACCESS_KEY_ID;
  delete process.env.BACKBLAZE_APPLICATION_KEY;
  delete process.env.BACKBLAZE_SECRET_ACCESS_KEY;
  delete process.env.BACKBLAZE_ENDPOINT;
  delete process.env.BACKBLAZE_REGION;
  delete process.env.BACKBLAZE_REP_KEY_ID;
  delete process.env.BACKBLAZE_REP_APPLICATION_KEY;
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

// ── Helpers ────────────────────────────────────────────────────────────────

/** Cria um buffer com magic bytes corretos para o MIME informado */
function makeValidBuffer(mime: string): Buffer {
  switch (mime) {
    case "application/pdf":
      return Buffer.from([0x25, 0x50, 0x44, 0x46, ...new Array(100).fill(0x20)]);
    case "image/jpeg":
      return Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...new Array(100).fill(0x20)]);
    case "image/png":
      return Buffer.from([0x89, 0x50, 0x4e, 0x47, ...new Array(100).fill(0x20)]);
    default:
      return Buffer.from(new Array(104).fill(0x20));
  }
}

/** Cria um mock de File com conteúdo válido */
function makeFile(mime: string, name = "doc.pdf"): File {
  const buf = makeValidBuffer(mime);
  return new File([buf], name, { type: mime });
}

/** Cria um mock de File com conteúdo vazio */
function makeEmptyFile(mime = "application/pdf"): File {
  return new File([], "empty.pdf", { type: mime });
}

/** Cria um mock de S3Client.send() que resolve vazio */
function mockS3Send(resolveWith: object = {}) {
  return jest.fn().mockResolvedValue(resolveWith);
}

// ── Testes: uploadToBackblaze ──────────────────────────────────────────────

describe("uploadToBackblaze", () => {
  it("lança BACKBLAZE_CREDENTIALS_MISSING quando credenciais ausentes", async () => {
    const { uploadToBackblaze } = await import("@/lib/storage/backblaze");

    const buf = Buffer.from("content");
    await expect(
      uploadToBackblaze(buf, "test/key.pdf", "application/pdf", "rep-qwork"),
    ).rejects.toMatchObject({ code: "BACKBLAZE_CREDENTIALS_MISSING" });
  });

  it("lança erro ao tentar upload com buffer vazio", async () => {
    process.env.BACKBLAZE_KEY_ID = "0052abc123456789012345";
    process.env.BACKBLAZE_APPLICATION_KEY = "K005applicationkey0123456789012345";

    const { uploadToBackblaze } = await import("@/lib/storage/backblaze");

    await expect(
      uploadToBackblaze(
        Buffer.alloc(0),
        "test/key.pdf",
        "application/pdf",
        "rep-qwork",
      ),
    ).rejects.toThrow("Buffer vazio");
  });

  it("lança erro com endpoint inválido (proteção SSRF)", async () => {
    process.env.BACKBLAZE_KEY_ID = "0052abc123456789012345";
    process.env.BACKBLAZE_APPLICATION_KEY = "K005applicationkey0123456789012345";
    process.env.BACKBLAZE_ENDPOINT = "https://evil.attacker.com";

    const { uploadToBackblaze } = await import("@/lib/storage/backblaze");

    await expect(
      uploadToBackblaze(
        Buffer.from("data"),
        "test/key.pdf",
        "application/pdf",
        "rep-qwork",
      ),
    ).rejects.toThrow("Endpoint inválido");
  });

  it("usa endpoint padrão backblazeb2.com quando env não definida", async () => {
    process.env.BACKBLAZE_KEY_ID = "0052abc123456789012345";
    process.env.BACKBLAZE_APPLICATION_KEY = "K005applicationkey0123456789012345";

    // Mockar @aws-sdk/client-s3
    jest.doMock("@aws-sdk/client-s3", () => {
      const mockSend = jest.fn().mockResolvedValue({});
      const MockS3Client = jest.fn().mockImplementation(() => ({ send: mockSend }));
      const MockPutObjectCommand = jest.fn().mockImplementation((args) => args);
      return { S3Client: MockS3Client, PutObjectCommand: MockPutObjectCommand };
    });

    const { uploadToBackblaze } = await import("@/lib/storage/backblaze");

    const result = await uploadToBackblaze(
      Buffer.from("hello"),
      "PF/12345678901/CAD/cpf_123.pdf",
      "application/pdf",
      "rep-qwork",
    );

    expect(result.provider).toBe("backblaze");
    expect(result.bucket).toBe("rep-qwork");
    expect(result.key).toBe("PF/12345678901/CAD/cpf_123.pdf");
    expect(result.url).toMatch(/backblazeb2\.com/);
  });

  it("usa credenciais dedicadas quando fornecidas via parâmetro", async () => {
    // Sem env vars globais — usa apenas as fornecidas como parâmetro
    jest.doMock("@aws-sdk/client-s3", () => {
      const mockSend = jest.fn().mockResolvedValue({});
      const MockS3Client = jest.fn().mockImplementation(() => ({ send: mockSend }));
      const MockPutObjectCommand = jest.fn().mockImplementation((args) => args);
      return { S3Client: MockS3Client, PutObjectCommand: MockPutObjectCommand };
    });

    const { uploadToBackblaze } = await import("@/lib/storage/backblaze");

    const result = await uploadToBackblaze(
      Buffer.from("hello"),
      "PJ/12345678000190/CAD/cnpj_456.pdf",
      "application/pdf",
      "rep-qwork",
      {
        keyId: "0052dedicatedkeyid1234",
        applicationKey: "K005dedicatedapplicationkey0123456789",
      },
    );

    expect(result.provider).toBe("backblaze");
    expect(result.bucket).toBe("rep-qwork");
  });

  it("retorna URL corretamente construída", async () => {
    process.env.BACKBLAZE_KEY_ID = "0052abc123456789012345";
    process.env.BACKBLAZE_APPLICATION_KEY = "K005applicationkey0123456789012345";
    process.env.BACKBLAZE_ENDPOINT = "https://s3.us-east-005.backblazeb2.com";

    jest.doMock("@aws-sdk/client-s3", () => {
      const mockSend = jest.fn().mockResolvedValue({});
      const MockS3Client = jest.fn().mockImplementation(() => ({ send: mockSend }));
      const MockPutObjectCommand = jest.fn().mockImplementation((args) => args);
      return { S3Client: MockS3Client, PutObjectCommand: MockPutObjectCommand };
    });

    const { uploadToBackblaze } = await import("@/lib/storage/backblaze");

    const result = await uploadToBackblaze(
      Buffer.from("hello"),
      "PF/12345678901/CAD/cpf_123.pdf",
      "application/pdf",
      "rep-qwork",
    );

    expect(result.url).toBe(
      "https://s3.us-east-005.backblazeb2.com/rep-qwork/PF/12345678901/CAD/cpf_123.pdf",
    );
  });
});

// ── Testes: uploadDocumentoRepresentante ──────────────────────────────────

describe("uploadDocumentoRepresentante", () => {
  it("lança erro para arquivo vazio (0 bytes)", async () => {
    const { uploadDocumentoRepresentante } = await import(
      "@/lib/storage/representante-storage"
    );

    await expect(
      uploadDocumentoRepresentante(
        makeEmptyFile("application/pdf"),
        "cpf",
        "12345678901",
        "PF",
      ),
    ).rejects.toThrow(/vazio|0 bytes/i);
  });

  it("lança erro para magic bytes inválidos (arquivo adulterado)", async () => {
    const { uploadDocumentoRepresentante } = await import(
      "@/lib/storage/representante-storage"
    );

    // Arquivo declara ser PDF mas conteúdo é aleatório
    const fakeFile = new File([Buffer.from("NOT-A-PDF-CONTENT-AT-ALL")], "evil.pdf", {
      type: "application/pdf",
    });

    await expect(
      uploadDocumentoRepresentante(fakeFile, "cpf", "12345678901", "PF"),
    ).rejects.toThrow(/não corresponde ao tipo declarado/i);
  });

  it("propaga BACKBLAZE_CREDENTIALS_MISSING quando credenciais ausentes", async () => {
    const { uploadDocumentoRepresentante } = await import(
      "@/lib/storage/representante-storage"
    );

    const file = makeFile("application/pdf");

    const err = await uploadDocumentoRepresentante(
      file,
      "cpf",
      "12345678901",
      "PF",
    ).catch((e) => e);

    expect(err).toBeInstanceOf(Error);
    expect((err as any).code).toBe("BACKBLAZE_CREDENTIALS_MISSING");
  });

  it("constrói chave correta para PF/CAD", async () => {
    jest.doMock("../lib/storage/backblaze", () => ({
      uploadToBackblaze: jest.fn().mockImplementation(
        async (_buf: Buffer, key: string, _ct: string, bucket: string) => ({
          provider: "backblaze",
          bucket,
          key,
          url: `https://s3.us-east-005.backblazeb2.com/${bucket}/${key}`,
        }),
      ),
    }));

    const { uploadDocumentoRepresentante } = await import(
      "../lib/storage/representante-storage"
    );

    const file = makeFile("application/pdf");
    const result = await uploadDocumentoRepresentante(file, "cpf", "12345678901", "PF");

    expect(result.key).toMatch(/^PF\/12345678901\/CAD\/cpf_\d+-[a-z0-9]+\.pdf$/);
    expect(result.bucket).toBe("rep-qwork");
  });

  it("constrói chave correta para PJ/CAD com CNPJ", async () => {
    jest.doMock("../lib/storage/backblaze", () => ({
      uploadToBackblaze: jest.fn().mockImplementation(
        async (_buf: Buffer, key: string, _ct: string, bucket: string) => ({
          provider: "backblaze",
          bucket,
          key,
          url: `https://s3.us-east-005.backblazeb2.com/${bucket}/${key}`,
        }),
      ),
    }));

    const { uploadDocumentoRepresentante } = await import(
      "../lib/storage/representante-storage"
    );

    const file = makeFile("application/pdf");
    const result = await uploadDocumentoRepresentante(
      file,
      "cnpj",
      "12345678000190",
      "PJ",
    );

    expect(result.key).toMatch(/^PJ\/12345678000190\/CAD\/cnpj_\d+-[a-z0-9]+\.pdf$/);
  });

  it("constrói chave correta para PJ/CAD com cpf_responsavel", async () => {
    jest.doMock("../lib/storage/backblaze", () => ({
      uploadToBackblaze: jest.fn().mockImplementation(
        async (_buf: Buffer, key: string, _ct: string, bucket: string) => ({
          provider: "backblaze",
          bucket,
          key,
          url: `https://s3.us-east-005.backblazeb2.com/${bucket}/${key}`,
        }),
      ),
    }));

    const { uploadDocumentoRepresentante } = await import(
      "../lib/storage/representante-storage"
    );

    const file = makeFile("image/jpeg", "cpf_resp.jpg");
    const result = await uploadDocumentoRepresentante(
      file,
      "cpf_responsavel",
      "12345678000190",
      "PJ",
    );

    expect(result.key).toMatch(
      /^PJ\/12345678000190\/CAD\/cpf_responsavel_\d+-[a-z0-9]+\.jpg$/,
    );
  });

  it("usa subpasta RPA quando especificada (PF)", async () => {
    jest.doMock("../lib/storage/backblaze", () => ({
      uploadToBackblaze: jest.fn().mockImplementation(
        async (_buf: Buffer, key: string, _ct: string, bucket: string) => ({
          provider: "backblaze",
          bucket,
          key,
          url: `https://s3.us-east-005.backblazeb2.com/${bucket}/${key}`,
        }),
      ),
    }));

    const { uploadDocumentoRepresentante } = await import(
      "../lib/storage/representante-storage"
    );

    const file = makeFile("application/pdf");
    const result = await uploadDocumentoRepresentante(
      file,
      "cpf",
      "12345678901",
      "PF",
      "RPA",
    );

    expect(result.key).toMatch(/^PF\/12345678901\/RPA\//);
  });

  it("aceita imagem PNG com magic bytes corretos", async () => {
    jest.doMock("../lib/storage/backblaze", () => ({
      uploadToBackblaze: jest.fn().mockImplementation(
        async (_buf: Buffer, key: string, _ct: string, bucket: string) => ({
          provider: "backblaze",
          bucket,
          key,
          url: `https://s3.us-east-005.backblazeb2.com/${bucket}/${key}`,
        }),
      ),
    }));

    const { uploadDocumentoRepresentante } = await import(
      "../lib/storage/representante-storage"
    );

    const file = makeFile("image/png", "doc.png");
    const result = await uploadDocumentoRepresentante(file, "cpf", "12345678901", "PF");

    expect(result.key).toMatch(/\.png$/);
  });

  it("usa credenciais BACKBLAZE_REP_KEY_ID quando definidas", async () => {
    process.env.BACKBLAZE_REP_KEY_ID = "0052repkeyid12345678";
    process.env.BACKBLAZE_REP_APPLICATION_KEY = "K005repappkey0123456789012345678";

    const mockUpload = jest.fn().mockResolvedValue({
      provider: "backblaze",
      bucket: "rep-qwork",
      key: "PF/12345678901/CAD/cpf_123.pdf",
      url: "https://s3.us-east-005.backblazeb2.com/rep-qwork/PF/12345678901/CAD/cpf_123.pdf",
    });

    jest.doMock("../lib/storage/backblaze", () => ({
      uploadToBackblaze: mockUpload,
    }));

    const { uploadDocumentoRepresentante } = await import(
      "../lib/storage/representante-storage"
    );

    const file = makeFile("application/pdf");
    await uploadDocumentoRepresentante(file, "cpf", "12345678901", "PF");

    expect(mockUpload).toHaveBeenCalledWith(
      expect.any(Buffer),
      expect.any(String),
      "application/pdf",
      "rep-qwork",
      {
        keyId: "0052repkeyid12345678",
        applicationKey: "K005repappkey0123456789012345678",
      },
    );
  });
});
