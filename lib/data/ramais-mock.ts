import type { UnidadeRamaisStatus } from "@/lib/types";

/**
 * Dados de apoio para desenvolvimento local, usados automaticamente quando
 * NEXTBILLING_BASE_URL / NEXTBILLING_API_TOKEN / NEXTBILLING_API_KEY não
 * estão configurados (ver lib/api/ramais-repository.ts).
 *
 * Contagens inspiradas no print de referência que você mandou — os nomes
 * reais das unidades e os totais certos só vêm da API de verdade.
 */
const UNIDADES_MOCK: ReadonlyArray<{ id: number; nome: string; total: number; online: number }> = [
  { id: 1, nome: "Assistência Social", total: 3, online: 3 },
  { id: 2, nome: "PMC Barracão", total: 9, online: 0 },
  { id: 3, nome: "PMC Cem", total: 5, online: 1 },
  { id: 4, nome: "PMC Cultura e Turismo", total: 8, online: 5 },
  { id: 5, nome: "PMC Ouvidoria", total: 2, online: 1 },
  { id: 6, nome: "PMC Poli Milena", total: 5, online: 1 },
  { id: 7, nome: "PMC Poli Wilson", total: 10, online: 7 },
];

export function gerarUnidadesMock(): UnidadeRamaisStatus[] {
  return UNIDADES_MOCK.map(({ id, nome, total, online }) => ({
    id: id.toString(),
    nome,
    totalRamais: total,
    ramaisOnline: online,
    ramaisOffline: total - online,
  }));
}
