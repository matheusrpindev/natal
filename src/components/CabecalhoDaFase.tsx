import { faseAtual } from "@/lib/db";
import { MENU_FASE } from "@/lib/phase";
import { Cabecalho } from "./Cabecalho";

export async function CabecalhoDaFase() {
  const { fase } = await faseAtual();
  return <Cabecalho itensFase={MENU_FASE[fase]} />;
}
