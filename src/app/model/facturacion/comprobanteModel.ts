export interface ComprobanteModel {
  tipoEntidad: string; // "VENTA_DOC" | "NOTA" | "GUIA"
  id: number;
  tipoDocumentoCodigo: string;
  tipoDocumentoNombre?: string;
  serie?: string;
  correlativo?: number;
  fechaEmision?: string;
  status?: string;
  sunatResponseCode?: string;
  sunatMessage?: string;
  pdfUrl?: string;
  saleId?: number;
  clientId?: number;
}
