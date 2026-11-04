/**
 * Prepara a foto no navegador antes do envio (fotos de celular têm 5–10 MB):
 * - grande: JPEG com no máximo 1600px no lado maior (página da casa)
 * - miniatura: JPEG com 480px (cartões, mapa e painel), para economizar tráfego
 */
export async function prepararFoto(arquivo: File): Promise<{ grande: Blob; miniatura: Blob }> {
  const bitmap = await createImageBitmap(arquivo).catch(() => null);
  if (!bitmap) throw new Error(`Não foi possível abrir "${arquivo.name}". Envie fotos em JPG ou PNG.`);
  try {
    const grande = await redimensionar(bitmap, 1600, 0.82);
    const miniatura = await redimensionar(bitmap, 480, 0.72);
    return { grande, miniatura };
  } finally {
    bitmap.close();
  }
}

async function redimensionar(bitmap: ImageBitmap, ladoMax: number, qualidade: number): Promise<Blob> {
  const escala = Math.min(1, ladoMax / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", qualidade));
  if (!blob) throw new Error("Falha ao processar a imagem.");
  return blob;
}
