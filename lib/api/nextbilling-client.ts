import "server-only";
import type {
  ListDevicesRegisteredResponse,
  NextBillingEnvelope,
  NextBillingDeviceRegistrado,
  NextBillingClienteLinhasBlock,
} from "./nextbilling-types";

interface Credenciais {
  baseUrl: string;
  token: string;
  key: string;
  id: string;
}

function obterCredenciais(): Credenciais | null {
  const baseUrl = process.env.NEXTBILLING_BASE_URL;
  const token = process.env.NEXTBILLING_API_TOKEN;
  const key = process.env.NEXTBILLING_API_KEY;
  const id = process.env.NEXTBILLING_CLIENT_ID;

  if (!baseUrl || !token || !key || !id) {
    return null;
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ""), token, key, id };
}

export function credenciaisConfiguradas(): boolean {
  return obterCredenciais() !== null;
}

async function chamarApi<T>(caminho: string): Promise<T> {
  const credenciais = obterCredenciais();
  if (!credenciais) {
    throw new Error(
      "Credenciais da NextBilling não configuradas (NEXTBILLING_BASE_URL / NEXTBILLING_API_TOKEN / NEXTBILLING_API_KEY / NEXTBILLING_CLIENT_ID)."
    );
  }

  const url = `${credenciais.baseUrl}${caminho}`;

  const resposta = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const corpo = await resposta.text();

  if (!resposta.ok) {
    throw new Error(
      `NextBilling respondeu ${resposta.status} para ${caminho}. Corpo: ${corpo.slice(0, 500) || "(vazio)"}`
    );
  }

  return JSON.parse(corpo) as T;
}

export interface LinhasDoCliente {
  idCliente: string;
  nomeFantasia: string;
  linhas: NextBillingDeviceRegistrado[];
}

export async function buscarAssinantes(): Promise<ListDevicesRegisteredResponse> {
  const credenciais = obterCredenciais();

  if (!credenciais) {
    throw new Error("Credenciais da NextBilling não configuradas.");
  }

  const json = await chamarApi<ListDevicesRegisteredResponse>(
    `/api/listDevicesRegistered/${credenciais.token}/${credenciais.key}/${credenciais.id}`
  );

  if (json.error) {
    throw new Error(json.reason || "Erro ao listar assinantes.");
  }

  return json;
}

export async function buscarLinhasDoCliente(idCliente: string): Promise<ListDevicesRegisteredResponse> {
  const credenciais = obterCredenciais();
  if (!credenciais) {
    throw new Error("Credenciais da NextBilling não configuradas.");
  }

  const json = await chamarApi<ListDevicesRegisteredResponse>(
    `/api/listDevicesRegistered/${credenciais.token}/${credenciais.key}`
  );

  if (json.error) {
    throw new Error(json.reason || `Erro ao listar linhas do cliente ${idCliente}.`);
  }

  //const bloco = json;

  return json;
}