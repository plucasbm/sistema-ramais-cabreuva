"use client";

import useSWR from "swr";
import type { UnidadeRamaisStatus } from "@/lib/types";

const INTERVALO_ATUALIZACAO_MS = 30_000;

async function fetcher(url: string): Promise<UnidadeRamaisStatus[]> {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("Falha ao buscar dados dos ramais");
  }
  return resposta.json();
}

export function useRamaisStatus() {
  const { data, error, isLoading } = useSWR<UnidadeRamaisStatus[]>(
    "/api/ramais",
    fetcher,
    {
      refreshInterval: INTERVALO_ATUALIZACAO_MS,
      revalidateOnFocus: true,
      // mantém os dados antigos na tela enquanto a próxima leva chega,
      // pra não "piscar" o dashboard a cada atualização em background
      keepPreviousData: true,
    }
  );

  return {
    unidades: data ?? [],
    carregando: isLoading,
    erro: Boolean(error),
  };
}
