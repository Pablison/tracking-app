export interface RomaneioItem {
  id: number;
  codigo: string;
  descricao: string;
  qtd: number;
  local?: string;
}

export interface RomaneioItemMini {
  itemId: number;
  qtd: number;
}

export interface RomaneioVolume {
  id: number;
  tipo: string;
  items: RomaneioItemMini[];
}

export interface RomaneioData {
  id: string;
  cliente: string;
  dataEnvio: string;
  volumes: number;
  itens: number;
  itemsList?: RomaneioItem[];
  volumesList?: RomaneioVolume[];
}

export type ReceiptStatus =
  | "loading_info"
  | "idle"
  | "loading_confirm"
  | "success"
  | "error";

export interface ConfirmReceiptPayload {
  token: string;
  recipientName: string;
  observation: string;
}
