"use client";

/* eslint-disable @next/next/no-img-element */
import { Camera, CircleCheck, House, LoaderCircle, MapPinned, Sparkles, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Selo } from "@/components/Icones";
import { MapaLocalizacao, type Ponto } from "@/components/MapaLocalizacao";
import { mascararTelefone } from "@/lib/cpf";
import { EVENTO } from "@/lib/config";
import { reduzirImagem } from "@/lib/reduzirImagem";

interface Foto {
  blob: Blob;
  url: string;
}

function Campo({ rotulo, dica, children }: { rotulo: string; dica?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-bold">{rotulo}</span>
      {children}
      {dica && <span className="text-sm text-tinta-suave">{dica}</span>}
    </label>
  );
}

export function FormInscricao() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [whats, setWhats] = useState("");
  const [local, setLocal] = useState<Ponto | null>(null);
  const [processando, setProcessando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<{ protocolo: string } | null>(null);

  async function adicionarFotos(lista: FileList | null) {
    if (!lista?.length) return;
    setErro(null);
    setProcessando(true);
    try {
      const novas: Foto[] = [];
      for (const arq of Array.from(lista).slice(0, EVENTO.maxFotos - fotos.length)) {
        const blob = await reduzirImagem(arq);
        novas.push({ blob, url: URL.createObjectURL(blob) });
      }
      setFotos((f) => [...f, ...novas]);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setProcessando(false);
    }
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    if (!local) {
      setErro("Marque no mapa onde fica a sua casa.");
      document.getElementById("onde-fica")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (fotos.length === 0) {
      setErro("Envie pelo menos uma foto da decoração.");
      return;
    }
    const dados = new FormData(e.currentTarget);
    fotos.forEach((f, i) => dados.append("fotos", f.blob, `foto-${i + 1}.jpg`));
    setEnviando(true);
    try {
      const r = await fetch("/api/inscricao", { method: "POST", body: dados });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(json.erro ?? "Não foi possível enviar. Tente novamente.");
      setSucesso({ protocolo: json.protocolo });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="cartao p-8 text-center">
        <Selo icone={CircleCheck} cor="verde" tamanho={72} />
        <h2 className="font-festiva mt-3 text-4xl font-bold text-verde">Inscrição recebida!</h2>
        <p className="mt-3 text-lg">
          Seu protocolo é <strong className="rounded bg-dourado/30 px-2 py-0.5 font-mono">{sucesso.protocolo}</strong>
        </p>
        <p className="mt-3 text-tinta-suave">
          A organização vai conferir as informações. Depois de aprovada, sua casa aparece na página de participantes e
          entra na votação. Qualquer dúvida, entraremos em contato pelo WhatsApp informado.
        </p>
        <Link href="/" className="btn btn-verde mt-6">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="cartao flex flex-col gap-6 p-6 sm:p-8">
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 flex items-center gap-3 text-xl font-extrabold">
          <Selo icone={User} tamanho={40} /> Responsável
        </legend>
        <Campo rotulo="Nome completo *">
          <input name="responsavel" required maxLength={120} className="campo" autoComplete="name" />
        </Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="WhatsApp *">
            <input
              name="whatsapp"
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="(11) 90000-0000"
              value={whats}
              onChange={(e) => setWhats(mascararTelefone(e.target.value))}
              className="campo"
            />
          </Campo>
          <Campo rotulo="E-mail">
            <input name="email" type="email" maxLength={160} className="campo" autoComplete="email" />
          </Campo>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 flex items-center gap-3 text-xl font-extrabold">
          <Selo icone={House} tamanho={40} /> Endereço da casa
        </legend>
        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <Campo rotulo="Rua *">
            <input name="rua" required maxLength={120} className="campo" autoComplete="address-line1" />
          </Campo>
          <Campo rotulo="Número *">
            <input name="numeroCasa" required maxLength={12} className="campo" />
          </Campo>
        </div>
        <Campo rotulo="Complemento / ponto de referência">
          <input name="complemento" maxLength={120} className="campo" />
        </Campo>
      </fieldset>

      <fieldset id="onde-fica" className="flex flex-col gap-3">
        <legend className="mb-2 flex items-center gap-3 text-xl font-extrabold">
          <Selo icone={MapPinned} tamanho={40} /> Onde fica a casa *
        </legend>
        <p className="text-sm text-tinta-suave">
          Só participam as casas dentro do contorno vermelho. Aproxime o mapa e toque em cima do telhado da sua casa.
        </p>
        <MapaLocalizacao valor={local} aoMudar={setLocal} />
        <input type="hidden" name="latitude" value={local?.lat ?? ""} />
        <input type="hidden" name="longitude" value={local?.lng ?? ""} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 flex items-center gap-3 text-xl font-extrabold">
          <Selo icone={Sparkles} tamanho={40} /> A decoração
        </legend>
        <Campo rotulo="Nome da casa (opcional)" dica='Ex.: "Casa da Família Silva" ou "Vila do Papai Noel".'>
          <input name="titulo" maxLength={60} className="campo" />
        </Campo>
        <Campo rotulo="Conte um pouco sobre a decoração (opcional)">
          <textarea name="descricao" rows={3} maxLength={500} className="campo" />
        </Campo>

        <div className="flex flex-col gap-2">
          <span className="font-bold">
            Fotos da decoração * <span className="font-normal text-tinta-suave">(até {EVENTO.maxFotos})</span>
          </span>
          <div className="grid grid-cols-3 gap-3">
            {fotos.map((f, i) => (
              <div key={f.url} className="relative aspect-square overflow-hidden rounded-xl border border-borda">
                <img src={f.url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(f.url);
                    setFotos((l) => l.filter((x) => x !== f));
                  }}
                  className="absolute top-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
                  aria-label={`Remover foto ${i + 1}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {fotos.length < EVENTO.maxFotos && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-verde/40 bg-verde/5 text-center text-sm font-bold text-verde hover:bg-verde/10">
                {processando ? <LoaderCircle size={28} className="animate-spin" aria-hidden /> : <Camera size={28} aria-hidden />}
                {processando ? "Processando…" : "Adicionar foto"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  disabled={processando}
                  onChange={(e) => {
                    adicionarFotos(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
          <span className="text-sm text-tinta-suave">
            Dica: uma foto à noite com as luzes acesas faz toda a diferença! Inscreva-se quando a decoração estiver pronta.
          </span>
        </div>
      </fieldset>

      {/* Campo-armadilha contra robôs: fica invisível para pessoas */}
      <input type="text" name="site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <label className="flex items-start gap-3 rounded-xl bg-creme p-4">
        <input type="checkbox" name="aceite" required className="mt-1 h-5 w-5 accent-verde" />
        <span className="text-sm">
          Li e aceito o{" "}
          <Link href="/regulamento" target="_blank" className="font-bold text-verde underline">
            regulamento
          </Link>{" "}
          e autorizo a divulgação das fotos, do nome da rua e do número da casa no site e nas redes do concurso. Meu
          telefone e e-mail não serão divulgados.
        </span>
      </label>

      {erro && (
        <p role="alert" className="rounded-xl bg-vermelho/10 p-3 font-bold text-vermelho">
          {erro}
        </p>
      )}

      <button type="submit" disabled={enviando || processando} className="btn btn-vermelho self-center text-lg">
        {enviando ? "Enviando…" : "Enviar inscrição"}
      </button>
    </form>
  );
}
