import crypto from "crypto";
import fs from "fs";
import path from "path";

const IMAGE_TYPES = {
  "image/jpeg": { extension: ".jpg", signature: (buffer) => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  "image/png": { extension: ".png", signature: (buffer) => buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/webp": { extension: ".webp", signature: (buffer) => buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" },
};

function proofDirectory() {
  return process.env.REFUND_PROOF_DIR || path.resolve(__dirname, "../../data/refund-proofs");
}

export async function saveRefundProof(file) {
  const imageType = IMAGE_TYPES[file?.mimetype];
  if (!imageType || !Buffer.isBuffer(file.buffer) || !imageType.signature(file.buffer)) {
    throw new Error("Ảnh minh chứng không hợp lệ. Chỉ chấp nhận JPEG, PNG hoặc WebP.");
  }

  const fileKey = crypto.randomUUID();
  const filePath = path.join(proofDirectory(), `${fileKey}${imageType.extension}`);
  await fs.promises.mkdir(proofDirectory(), { recursive: true });
  await fs.promises.writeFile(filePath, file.buffer, { flag: "wx" });
  return { fileKey, mimeType: file.mimetype, uploadedAt: new Date() };
}

export function resolveRefundProofFile(booking) {
  const imageType = IMAGE_TYPES[booking?.refundProofMimeType];
  const fileKey = String(booking?.refundProofKey || "");
  if (!imageType || !/^[0-9a-f-]{36}$/i.test(fileKey)) return null;

  const filePath = path.join(proofDirectory(), `${fileKey}${imageType.extension}`);
  return fs.existsSync(filePath) ? { filePath, mimeType: booking.refundProofMimeType } : null;
}

export async function deleteRefundProof(proof) {
  if (!proof?.fileKey || !IMAGE_TYPES[proof.mimeType] || !/^[0-9a-f-]{36}$/i.test(proof.fileKey)) return;
  const filePath = path.join(proofDirectory(), `${proof.fileKey}${IMAGE_TYPES[proof.mimeType].extension}`);
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}