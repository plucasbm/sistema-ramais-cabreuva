export interface NextBillingEnvelope<T> {
  error: 0 | 1;
  reason: string;
  records: number;
  data: T[];
}

export interface NextBillingClienteLinhasBlock {
  error: 0 | 1;
  reason: string;
  id_cliente: number;
  nome_fantasia: string;
  records: number;
  data: NextBillingDeviceRegistrado[];
}

export interface NextBillingDeviceRegistrado {
  device_id: string;
  device_username: string;
  latency_ms: string;
  last_registration: string | null;
  sip_contact: string;
  device_registered: boolean;
}

export type ListDevicesRegisteredResponse = NextBillingEnvelope<NextBillingDeviceRegistrado>;