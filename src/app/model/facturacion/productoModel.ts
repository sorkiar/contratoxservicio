export class ProductoModel {
  id: number | null = null;
  sku: string | null = null;
  name: string = '';
  categoryId: number | null = null;
  categoryName: string | null = null;
  unitMeasureId: number | null = null;
  unitMeasureName: string | null = null;
  salePricePen: number | null = null;
  estimatedCostPen: number | null = null;
  brand: string | null = null;
  model: string | null = null;
  shortDescription: string | null = null;
  technicalSpec: string | null = null;
  mainImageUrl: string | null = null;
  technicalSheetUrl: string | null = null;
  status: number = 1;
}
