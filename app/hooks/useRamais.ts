import { ListDevicesRegisteredResponse } from "@/lib/api/nextbilling-types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  console.log(`[SWR] Buscando dados às ${new Date().toLocaleTimeString()}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar ramais");
  }

  console.log(
    `[SWR] Dados recebidos às ${new Date().toLocaleTimeString()}`
  );

  return response.json();
};

export function useRamais() {
  return useSWR<ListDevicesRegisteredResponse>("api/ramais", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
}
