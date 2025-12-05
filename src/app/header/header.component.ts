import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxService } from '../service/taxservice';
import { Detail, Header } from '../interface/taxinterface';
import { formatDate } from '../util/datetostring';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
  alertErrorMessage,
  alertHandlerMessage,
  alertMessage,
  alertSubmitMessage,
} from '../util/alertmessage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('seacrhModal') seacrhModal!: ModalDirective;
  @ViewChild('pdfModal') pdfModal!: ModalDirective;

  maxDate: Date;
  resetFlag = false;

  data: Header = {
    vdtNo: undefined,
    vdtDate: undefined,
    createBy: '',
    createDate: undefined,
    detailEntityList: [],
  };

  pdf: Header = {
    vdtNo: undefined,
    vdtDate: undefined,
    detailEntityList: [],
  };

  pdfUrl: string | null = null;

  selectedDetail?: Detail = {
    id: 0,
    bdtNo: '',
    ndtNo: '',
    createDate: undefined,
    createBy: '',
    updateBy: '',
    updateDate: undefined,
    totalPurchase: undefined,
    taxS: undefined,
    vatBR: undefined,
    vatBA: undefined,
    vatTB: undefined,
    branchNo: '',
    establishmentName: '',
    taxIden: '',
  };

  searchResult: Header[] = [];
  selectedHeader?: Header;

  deletedDetailIds: number[] = [];

  constructor(private taxService: TaxService) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {}

  validateVdtNoFormat(vdtNo: string | undefined): number | null {
    if (!vdtNo) return null;

    const regex = /^ID000(\d+)$/;
    const match = vdtNo.match(regex);

    if (!match) return null;

    return Number(match[1]);
  }

  searchData() {
    this.deletedDetailIds = [];
    this.data.detailEntityList = [];
    this.resetFlag = !this.resetFlag;
    const extractedId = this.validateVdtNoFormat(this.data.vdtNo?.toString());

    if (this.data.vdtNo && extractedId === null) {
      alertHandlerMessage(
        'รูปแบบเลขที่ใบสรุปต้องเป็น ID + 000 + รหัสจริง เช่น ID00020'
      );
      return;
    }

    this.taxService
      .searchHeader(
        extractedId ?? undefined,
        this.data.createDate ? formatDate(this.data.createDate) : undefined
      )
      .subscribe({
        next: (res) => {
          console.log('ค้นหาข้อมูล', res);
          this.searchResult = res.data ?? [];
          if (this.searchResult.length === 1) {
            this.data.detailEntityList = [
              ...this.searchResult[0].detailEntityList,
            ];
            this.pdf.vdtDate = this.searchResult[0].vdtDate
              ? new Date(this.searchResult[0].vdtDate)
              : undefined;
            this.pdf.vdtNo = this.searchResult[0].vdtNo;
            alertMessage();
          } else {
            this.seacrhModal.show();
          }
        },
        error: (err) => {
          console.error('ค้นหาไม่สำเร็จ', err);
          this.data.detailEntityList = [];
          if (err.status === 404) {
            alertHandlerMessage('ไม่พบข้อมูลที่ค้นหา');
          } else {
            alertErrorMessage('กรุณกรอกข้อมูลให้ถูกต้อง');
          }
        },
      });
  }

  addSelectedItems() {
    if (this.selectedHeader) {
      this.data.detailEntityList = [...this.selectedHeader.detailEntityList];
      this.pdf.vdtDate = this.selectedHeader.vdtDate
        ? new Date(this.selectedHeader.vdtDate)
        : undefined;
      this.pdf.vdtNo = this.selectedHeader.vdtNo;
      this.seacrhModal.hide();
      console.log('Table Data:', this.data.detailEntityList);
    }
  }

  onAddDetail(detail: Detail) {
    const hasIndex = detail.index !== undefined && detail.index !== null;

    if (hasIndex) {
      this.data.detailEntityList = this.data.detailEntityList.map((d, i) =>
        i === detail.index ? { ...detail } : d
      );
    } else {
      this.data.detailEntityList = [...this.data.detailEntityList, detail];
    }

    console.log('Table Data:', this.data.detailEntityList);
  }

  onEditDetail(detail: Detail) {
    this.selectedDetail = { ...detail };
  }

  saveData() {
    const hasDetails = this.data.detailEntityList?.length > 0;
    const hasDeleted = this.deletedDetailIds?.length > 0;

    if (!hasDetails && !hasDeleted) {
      alertSubmitMessage('ยังไม่มีข้อมูลรายละเอียดที่จะบันทึก');
      return;
    }

    let saveProcess;

    if (!this.data.vdtNo) {
      saveProcess = this.taxService.createTax(this.data.detailEntityList);
    } else {
      saveProcess = this.taxService.updateTax(
        this.data.vdtNo,
        this.data.detailEntityList
      );
    }

    saveProcess.subscribe({
      next: (res) => {
        alertMessage();
        console.log('Response save:', res);

        this.deleteMarkedDetails();
        this.clearScreen();
      },
      error: (err) => {
        console.error('บันทึกไม่สำเร็จ', err);
        alertErrorMessage('เกิดข้อผิดพลาดในการบันทึก');
      },
    });
  }

  deleteDetail(event: { detail: Detail; index: number }) {
    const detail = event.detail;
    const index = event.index;

    if (detail.id) {
      this.deletedDetailIds.push(detail.id);
    }

    this.data.detailEntityList = this.data.detailEntityList.filter(
      (_, i) => i !== index
    );
  }

  deleteMarkedDetails() {
    if (this.deletedDetailIds.length === 0) return;

    this.deletedDetailIds.forEach((id) => {
      this.taxService.deleteTax(id).subscribe({
        next: () => console.log('ลบข้อมูลจริงสำเร็จ:', id),
        error: () => console.error('ลบข้อมูลจริงไม่สำเร็จ:', id),
      });
    });

    this.deletedDetailIds = [];
  }

  clearScreen() {
    this.data = {
      vdtNo: undefined,
      vdtDate: undefined,
      createBy: '',
      createDate: undefined,
      detailEntityList: [],
    };

    this.selectedDetail = undefined;

    this.searchResult = [];
    this.deletedDetailIds = [];
    this.selectedHeader = undefined;

    this.resetFlag = !this.resetFlag;

    console.log('Cleared screen:', this.data);
  }

  printPdf() {
    if (this.data.detailEntityList.length === 0)
      return alertHandlerMessage('ไม่มีข้อมูลให้พิมพ์ pdf');

    const headerId = this.data.vdtNo
      ? this.validateVdtNoFormat(this.data.vdtNo?.toString())
      : this.pdf.vdtNo;

    const payload = {
      vdtNo: headerId,
      vdtDate: this.pdf.vdtDate ? formatDate(this.pdf.vdtDate) : undefined,
      detailEntityList: this.data.detailEntityList,
    };

    this.taxService.printReport(payload).subscribe({
      next: (blob: Blob) => {
        const pdfUrl = URL.createObjectURL(blob);
        this.pdfUrl = pdfUrl;
        this.pdfModal.show(); // เปิด Modal
      },
      error: () => alertErrorMessage('ไม่สามารถพิมพ์ใบสรุปได้'),
    });
  }
}
