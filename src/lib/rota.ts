import { notFound } from "next/navigation";
import { regiaoOuNula, type Regiao } from "./regioes";

/** Região da URL (/scaffid-ii/..., /marengo/...); página 404 se não existir. */
export async function regiaoDaRota(params: Promise<{ regiao: string }>): Promise<Regiao> {
  const regiao = regiaoOuNula((await params).regiao);
  if (!regiao) notFound();
  return regiao;
}
