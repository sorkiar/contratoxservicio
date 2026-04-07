export interface UbigeoModel {
  ubigeo: string;
  department: string;
  province: string;
  distrit: string;
  status: number;
}

export interface GuiaItemRequest {
  productId?: number;
  description: string;
  quantity: number;
  unitMeasureSunat: string;
  unitPrice: number;
}

export interface GuiaDriverRequest {
  docType: string;
  docNumber: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  vehiclePlate: string;
}

export interface GuiaRequest {
  documentSeriesId?: number;
  clientId: number;
  issueDate: string;
  transferDate: string;
  transferReason: string;
  transferReasonDescription?: string;
  transportMode: string;
  grossWeight: number;
  weightUnit: string;
  packageCount: number;
  minorVehicleTransfer: boolean;
  observations?: string;
  originAddress: string;
  originUbigeo: string;
  destinationAddress: string;
  destinationUbigeo: string;
  carrierRuc?: string;
  carrierName?: string;
  carrierAuthorizationCode?: string;
  items: GuiaItemRequest[];
  drivers?: GuiaDriverRequest[];
}

export interface GuiaItemResponse {
  id: number;
  productId?: number;
  description: string;
  quantity: number;
  unitMeasureSunat: string;
  unitPrice: number;
  subtotalAmount: number;
}

export interface GuiaDriverResponse {
  driverDocType: string;
  driverDocNumber: string;
  driverFirstName: string;
  driverLastName: string;
  driverLicenseNumber: string;
  vehiclePlate: string;
}

export interface GuiaResponse {
  id: number;
  clientId?: number;
  clientName?: string;
  series?: string;
  sequence?: number;
  issueDate?: string;
  transferDate: string;
  transferReason: string;
  transportMode: string;
  grossWeight: number;
  weightUnit?: string;
  packageCount?: number;
  originAddress: string;
  destinationAddress: string;
  status?: string;
  sunatResponseCode?: string;
  sunatMessage?: string;
  pdfUrl?: string;
  xmlUrl?: string;
  cdrUrl?: string;
  items: GuiaItemResponse[];
  drivers?: GuiaDriverResponse[];
}
