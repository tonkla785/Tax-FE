export interface Header {
  vdtNo?: number;
  vdtDate?: Date;
  createBy: string;
  createDate?: Date;
  detailEntityList: Detail[];
}

export interface Detail {
  id: number;
  bdtNo: string;
  ndtNo: string;
  createDate: string | Date;
  createBy: string;
  updateBy: string;
  updateDate: string | Date;
  totalPurchase: number;
  taxS: number;
  vatBR: number;
  vatBA: number;
  vatTB: number;
  branchNo: string;
  establishmentName: string;
  taxIden: string;
}

export interface ApiResponse<T> {
  responseStatus: number;
  responseMessage: string;
  data: T;
}
