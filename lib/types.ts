/**
 * Modelo de domínio da aplicação — o que a UI consome.
 * Fica desacoplado do formato cru retornado pela API da NextBilling
 * (ver lib/api/nextbilling-types.ts), então se o payload deles mudar,
 * só precisamos ajustar o mapeamento em lib/api/ramais-repository.ts.
 */
export interface UnidadeRamaisStatus {
  /** id_cliente na NextBilling */
  id: string;
  /** nome_fantasia do assinante — o nome exibido no card (ex: "PMC Barracão") */
  nome: string;
  totalRamais: number;
  ramaisOnline: number;
  ramaisOffline: number;
}
