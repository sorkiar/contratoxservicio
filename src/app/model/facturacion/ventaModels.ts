// ─── Formulario interno (estado local del form) ────────────────────────────

export class VentaItemForm {
  itemType: 'PRODUCT' | 'SERVICE' | 'QUICK_SERVICE' = 'PRODUCT';
  productId: number | null = null;
  serviceId: number | null = null;
  description: string = '';
  quantity: number = 1;
  unitPrice: number = 0;
  discountPercentage: number = 0;
  unitMeasureId: number | null = null;

  get subtotal(): number {
    return this.unitPrice * this.quantity * (1 - this.discountPercentage / 100);
  }
}

export class VentaPagoForm {
  paymentMethodId: number = 1;
  paymentMethodName: string = 'Efectivo';
  amount: number = 0;
  referenceNumber: string | null = null;
}

export class VentaCuotaForm {
  amount: number = 0;
  dueDate: string | null = null;
}

// ─── Request al backend ──────────────────────────────────────────────────────

export interface SaleItemRequest {
  itemType: string;
  productId: number | null;
  serviceId: number | null;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  unitMeasureId: number | null;
}

export interface SalePaymentRequest {
  paymentMethodId: number;
  amount: number;
  changeAmount: number;
  paymentDate: string;
  referenceNumber: string | null;
  notes: string | null;
}

export interface SaleInstallmentRequest {
  amount: number;
  dueDate: string | null;
}

export interface SaleRequest {
  clientId: number;
  saleDate: string;
  paymentType: string;
  taxPercentage: number;
  purchaseOrder: string | null;
  observations: string | null;
  items: SaleItemRequest[];
  payments: SalePaymentRequest[];
  installments: SaleInstallmentRequest[];
}

// ─── Response del backend ────────────────────────────────────────────────────

export interface SaleItemResponse {
  id: number;
  itemType: string;
  productId: number | null;
  serviceId: number | null;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  unitMeasureId: number | null;
  unitMeasureName: string | null;
}

export interface SalePaymentResponse {
  id: number;
  paymentMethodId: number;
  paymentMethodName: string;
  amount: number;
  changeAmount: number;
  paymentDate: string;
  referenceNumber: string | null;
  proofUrl: string | null;
  notes: string | null;
}

export interface SaleDocumentResponse {
  id: number;
  documentTypeCode: string;
  documentTypeName: string;
  series: string;
  sequence: number;
  issueDate: string;
  status: string;
  sunatResponseCode: string | null;
  sunatMessage: string | null;
  pdfUrl: string | null;
}

export interface SaleResponse {
  id: number;
  clientId: number;
  clientName: string;
  clientDocNumber: string;
  saleStatus: string;
  subtotalAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currencyCode: string;
  taxPercentage: number;
  saleDate: string;
  paymentType: string;
  purchaseOrder: string | null;
  observations: string | null;
  items: SaleItemResponse[];
  payments: SalePaymentResponse[];
  documents: SaleDocumentResponse[];
}
