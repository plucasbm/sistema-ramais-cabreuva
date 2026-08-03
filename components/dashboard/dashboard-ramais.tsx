"use client";

import { useRamais } from "@/app/hooks/useRamais";
import { NextBillingDeviceRegistrado } from "@/lib/api/nextbilling-types";

export default function DashboardRamais() {
  const { data, error, isLoading, isValidating } = useRamais();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar os ramais.</p>;
  }

  if (!data) {
    return null;
  }

  interface GrupoRamais {
    nome: string;
    ramais: NextBillingDeviceRegistrado[];
  }

  const grupos = data.data.reduce<Record<string, GrupoRamais>>((acc, ramal) => {
    const prefixo = ramal.device_username.split(".")[0];

    if (!acc[prefixo]) {
      acc[prefixo] = {
        nome: prefixo,
        ramais: [],
      };
    }

    acc[prefixo].ramais.push(ramal);

    return acc;
  }, {});

  function formatarNomeSetor(prefixo: string): string {
    return prefixo
      .replace(/[-_]+/g, " ") // troca - e _ por espaço
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ");
  }

  const total = data.data.length;
  const online = data.data.filter((r) => r.device_registered).length;
  const offline = total - online;
  const unidades = Object.values(grupos);
  const linhas = Math.min(Math.ceil(unidades.length / 5), 8);

  return (
    <div className="h-screen bg-black px-2">
      {isValidating && (
        <div className="mb-1 text-center text-xs text-yellow-400">
          🔄 Atualizando...
        </div>
      )}

      <div
        className="grid grid-cols-5 gap-2"
      >
        {unidades.map((unidade) => {
          const total = unidade.ramais.length;
          const online = unidade.ramais.filter(
            (r) => r.device_registered,
          ).length;
          const offline = total - online;

          return (
            <div
              key={unidade.nome}
              className="flex h-[85px] flex-col overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900"
            >
              <div className="bg-neutral-800 text-center">
                <h2
                  className="truncate text-lg font-semibold text-white"
                  title={formatarNomeSetor(unidade.nome)}
                >
                  {formatarNomeSetor(unidade.nome)}
                </h2>
              </div>

              <div className="grid flex-1 grid-cols-3">
                <div className="flex flex-col items-center justify-center bg-[#1E3A8A]">
                  <span className="text-sm text-white">Total</span>
                  <span className="text-2xl font-light text-white">
                    {total}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center bg-[#166534]">
                  <span className="text-sm text-white">Online</span>
                  <span className="text-2xl font-light text-white">
                    {online}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center bg-[#991B1B]">
                  <span className="text-sm text-white">Offline</span>
                  <span className="text-2xl font-light text-white">
                    {offline}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
