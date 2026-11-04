"use client";

/* eslint-disable @next/next/no-img-element */
import { CircleCheck, ShieldCheck, Vote } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CartaoCasa, nomeCasa, type CasaPublica } from "@/components/CartaoCasa";
import { Selo } from "@/components/Icones";
import { cpfValido, mascararCpf } from "@/lib/cpf";

export function Votacao({ casas, inicial }: { casas: CasaPublica[]; inicial: string | null }) {
  const [escolhida, setEscolhida] = useState<CasaPublica | null>(() => casas.find((x) => x.id === inicial) ?? null);
  const [confirmado, setConfirmado] = useState<CasaPublica | null>(null);
  const [busca, setBusca] = useState("");

  if (confirmado) {
    return (
      <div className="cartao mx-auto max-w-xl p-8 text-center">
        <Selo icone={CircleCheck} cor="verde" tamanho={72} />
        <h2 className="font-festiva mt-3 text-4xl font-bold text-verde">Voto registrado!</h2>
        <p className="mt-3 text-lg">
          Você votou em <strong>{nomeCasa(confirmado)}</strong>. Obrigado por participar do Natal Iluminado!
        </p>
        <p className="mt-2 text-tinta-suave">Chame a família e os amigos para votar também — cada CPF vale um voto.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => setConfirmado(null)} className="btn btn-verde">
            Votar com outro CPF
          </button>
          <Link href="/" className="btn btn-contorno text-verde">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const termo = busca.trim().toLowerCase();
  const filtradas = termo
    ? casas.filter((c) =>
        [nomeCasa(c), c.rua, c.numeroCasa, String(c.numero)].some((v) => v.toLowerCase().includes(termo)),
      )
    : casas;

  return (
    <>
      <div className="mx-auto mb-8 flex max-w-xl flex-col gap-2 text-center">
        <p className="text-tinta-suave">Escolha sua casa favorita e toque em “Votar”. Você vai informar seu nome e CPF.</p>
        <input
          type="search"
          placeholder="Buscar por número, rua ou nome…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="campo"
          aria-label="Buscar casa"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtradas.map((c) => (
          <CartaoCasa key={c.id} casa={c}>
            <button onClick={() => setEscolhida(c)} className="btn btn-vermelho w-full">
              <Vote size={18} aria-hidden /> Votar nesta casa
            </button>
          </CartaoCasa>
        ))}
      </div>
      {filtradas.length === 0 && <p className="text-center text-tinta-suave">Nenhuma casa encontrada.</p>}
      {escolhida && (
        <JanelaVoto
          casa={escolhida}
          fechar={() => setEscolhida(null)}
          concluido={() => {
            setConfirmado(escolhida);
            setEscolhida(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </>
  );
}

function JanelaVoto({ casa, fechar, concluido }: { casa: CasaPublica; fechar: () => void; concluido: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const cpfCompleto = cpf.replace(/\D/g, "").length === 11;
  const cpfInvalido = cpfCompleto && !cpfValido(cpf);

  async function votar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    if (!cpfValido(cpf)) {
      setErro("CPF inválido. Confira os números.");
      return;
    }
    setEnviando(true);
    try {
      const dados = new FormData(e.currentTarget);
      const r = await fetch("/api/votar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ casa: casa.id, nome, cpf, aceite: dados.get("aceite") === "on", site: dados.get("site") }),
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(json.erro ?? "Não foi possível registrar o voto. Tente novamente.");
      concluido();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={fechar}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-3xl bg-papel p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="bengala h-2" />
      <form onSubmit={votar} className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-4">
          {casa.fotos[0] && <img src={casa.fotos[0]} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />}
          <div>
            <p className="text-sm font-bold text-tinta-suave">Seu voto vai para</p>
            <p className="text-xl leading-tight font-extrabold">{nomeCasa(casa)}</p>
            <p className="text-sm text-tinta-suave">
              #{String(casa.numero ?? 0).padStart(2, "0")} · {casa.rua}, {casa.numeroCasa}
            </p>
          </div>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="font-bold">Seu nome completo</span>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required maxLength={120} className="campo" autoComplete="name" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-bold">Seu CPF</span>
          <input
            value={cpf}
            onChange={(e) => setCpf(mascararCpf(e.target.value))}
            required
            inputMode="numeric"
            placeholder="000.000.000-00"
            className="campo"
            aria-invalid={cpfInvalido}
          />
          {cpfInvalido && <span className="text-sm font-bold text-vermelho">CPF inválido. Confira os números.</span>}
          <span className="flex items-start gap-1.5 text-xs text-tinta-suave">
            <ShieldCheck size={14} className="mt-px shrink-0 text-verde" aria-hidden /> O CPF é usado só para garantir um voto por pessoa e é guardado de forma criptografada.
          </span>
        </label>
        <input type="text" name="site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="aceite" required className="mt-0.5 h-5 w-5 accent-verde" />
          <span>Declaro que o CPF informado é meu. Sei que cada CPF vota uma única vez e o voto não pode ser alterado.</span>
        </label>
        {erro && (
          <p role="alert" className="rounded-xl bg-vermelho/10 p-3 font-bold text-vermelho">
            {erro}
          </p>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => ref.current?.close()} className="btn btn-contorno text-tinta-suave">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="btn btn-vermelho">
            {enviando ? "Registrando…" : "Confirmar voto"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
