import { NextResponse } from "next/server";
import {
  credenciaisConfiguradas,
  buscarAssinantes,
  buscarLinhasDoCliente,
} from "@/lib/api/nextbilling-client";
import { gerarUnidadesMock } from "@/lib/data/ramais-mock";

export async function GET() {
  try {
    if (!credenciaisConfiguradas()) {
      return NextResponse.json(gerarUnidadesMock());
    }

    console.log(`[API] Atualizando ramais - ${new Date().toISOString()}`);

    const assinantes = await buscarLinhasDoCliente("006");
    return NextResponse.json(assinantes);
  } catch (error) {
    console.error("[api/ramais] Erro:", error);
    return NextResponse.json(
      { error: "Não foi possível listar os assinantes." },
      { status: 502 },
    );
  }
}
