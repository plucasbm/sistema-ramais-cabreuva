import "server-only";
import { credenciaisConfiguradas, buscarLinhasDoCliente } from "./nextbilling-client";
import { gerarUnidadesMock } from "@/lib/data/ramais-mock";
import type { UnidadeRamaisStatus } from "@/lib/types";
import { ListDevicesRegisteredResponse } from "./nextbilling-types";

export async function obterStatusPorUnidade(): Promise<ListDevicesRegisteredResponse> {
  // if (!credenciaisConfiguradas()) {
  //   console.warn("[ramais] Credenciais não configuradas — retornando dados mock.");
  //   return gerarUnidadesMock();
  // }

  const idClienteRaw = process.env.NEXTBILLING_CLIENT_ID;
  if (!idClienteRaw) {
    throw new Error("NEXTBILLING_CLIENT_ID não configurado em .env.local.");
  }

  const response = await buscarLinhasDoCliente(idClienteRaw);

  return response;

  // const { idCliente, nomeFantasia, linhas } = await buscarLinhasDoCliente(idClienteRaw);
  // const online = linhas.filter((linha) => linha.device_registered).length;

  // return [
  //   {
  //     id: idCliente,
  //     nome: nomeFantasia,
  //     totalRamais: linhas.length,
  //     ramaisOnline: online,
  //     ramaisOffline: linhas.length - online,
  //   },
  // ];
}