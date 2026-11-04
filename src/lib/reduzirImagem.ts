/**
 * Reduz a foto no navegador antes do envio (fotos de celular têm 5–10 MB).
 * Resultado: JPEG com no máximo 1600px no lado maior.
 */
export async function reduzirImagem(arquivo: File, ladoMax = 1600, qualidade = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(arquivo).catch(() => null);
  if (!bitmap) throw new Error(`Não foi possível abrir "${arquivo.name}". Envie fotos em JPG ou PNG.`);
  const escala = Math.min(1, ladoMax / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", qualidade));
  if (!blob) throw new Error("Falha ao processar a imagem.");
  return blob;
}
