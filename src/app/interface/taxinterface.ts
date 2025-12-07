export interface Header {
  vdtNo?: number;
  vdtDate?: Date;
  createBy?: string;
  createDate?: Date;
  detailEntityList: Detail[];

  selected?: boolean;
}

export interface Detail {
  id: number;
  bdtNo: string;
  ndtNo: string;
  createDate?: Date;
  createBy: string;
  updateBy: string;
  updateDate?: Date;
  totalPurchase?: number;
  taxS?: number;
  vatBR?: number;
  vatBA?: number;
  vatTB?: number;
  branchNo: string;
  establishmentName: string;
  taxIden: string;

  index?: number;
}

export interface ApiResponse<T> {
  responseStatus: number;
  responseMessage: string;
  data: T;
}

export interface FormInput {
  vdtNo: string;
  createDate: Date | undefined;
}
