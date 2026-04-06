export class ServicioModel {
  id: number | null = null;
  sku: string | null = null;
  name: string = '';
  serviceCategoryId: number | null = null;
  serviceCategoryName: string | null = null;
  chargeUnitId: number | null = null;
  chargeUnitName: string | null = null;
  pricePen: number | null = null;
  estimatedTime: string | null = null;
  expectedDelivery: string | null = null;
  requiresMaterials: boolean = false;
  requiresSpecification: boolean = false;
  includesDescription: string | null = null;
  excludesDescription: string | null = null;
  conditions: string | null = null;
  shortDescription: string | null = null;
  detailedDescription: string | null = null;
  imageUrl: string | null = null;
  technicalSheetUrl: string | null = null;
  status: number = 1;
}
