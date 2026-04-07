// ─── Tipos de nota ───────────────────────────────────────────────────────────

export interface TipoNotaModel {
  code: string;
  name: string;
  noteCategory: string; // 'CREDITO' | 'DEBITO'
  status: number;
}

// ─── Items del formulario ────────────────────────────────────────────────────

export class NotaItemForm {
  itemType: 'PRODUCTO' | 'SERVICIO' | 'PERSONALIZADO' = 'PRODUCTO';
  productId: number | null = null;
  serviceId: number | null = null;
  description: string = '';
  quantity: number = 1;
  unitPrice: number = 0;
  discountPercentage: number = 0;

  get subtotal(): number {
    return this.unitPrice * this.quantity * (1 - this.discountPercentage / 100);
  }
}

// ─── Request ─────────────────────────────────────────────────────────────────

export interface NotaItemRequest {
  itemType: string;
  productId: number | null;
  serviceId: number | null;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
}

export interface NotaRequest {
  saleId: number;
  originalDocumentId: number;
  documentTypeCode: string;
  documentSeriesId: number;
  creditDebitNoteTypeCode: string;
  reason: string;
  issueDate: string;
  items: NotaItemRequest[];
}

// ─── Response ────────────────────────────────────────────────────────────────

export interface NotaItemResponse {
  id: number;
  itemType: string;
  productId: number | null;
  serviceId: number | null;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface NotaResponse {
  id: number;
  saleId: number;
  originalDocumentId: number;
  originalDocumentNumber: string;
  documentTypeCode: string;
  series: string;
  sequence: number;
  issueDate: string;
  creditDebitNoteTypeCode: string;
  creditDebitNoteTypeName: string;
  reason: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  taxPercentage: number;
  currencyCode: string;
  status: string;
  sunatResponseCode: string | null;
  sunatMessage: string | null;
  pdfUrl: string | null;
  items: NotaItemResponse[];
}
