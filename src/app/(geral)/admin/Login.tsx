"use client";

import { useActionState } from "react";
import { entrar } from "./actions";

export function Login() {
  const [erro, acao, pendente] = useActionState(entrar, null);
  return (
    <form action={acao} className="cartao mx-auto flex max-w-sm flex-col gap-4 p-8">
      <h2 className="font-festiva text-center text-3xl font-bold text-vermelho">Área da organização</h2>
      <label className="flex flex-col gap-1.5">
        <span className="font-bold">Senha</span>
        <input type="password" name="senha" required className="campo" autoComplete="current-password" autoFocus />
      </label>
      {erro && (
        <p role="alert" className="font-bold text-vermelho">
          {erro}
        </p>
      )}
      <button disabled={pendente} className="btn btn-verde">
        {pendente ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
