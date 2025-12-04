import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Detail } from '../interface/taxinterface';
import { VatRateService } from '../service/vatrateservice';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  @Input() editDetail?: Detail;
  @Input() reset: boolean = false;
  @Output() addDetail = new EventEmitter<Detail>();

  maxDate: Date;

  detailData: Detail = {
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

  vatRateList: any[] = [];

  errors = {
    bdtNo: false,
    ndtNo: false,
    createDate: false,
    totalPurchase: false,
    taxIden: false,
    branchNo: false,
    establishmentName: false,
  };

  errorMessages = {
    bdtNo: '',
    ndtNo: '',
    createDate: '',
    totalPurchase: '',
    taxIden: '',
    branchNo: '',
    establishmentName: '',
  };

  constructor(private vatRateService: VatRateService) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.fetchVatRates();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editDetail'] && this.editDetail) {
      this.detailData = {
        ...this.editDetail,
        createDate: this.editDetail.createDate
          ? new Date(this.editDetail.createDate)
          : undefined,
      };
    }

    if (changes['reset']) {
      this.clearForm();
    }
  }

  onAdd() {
    if (!this.validateFields()) {
      this.checkAllFields();
      return;
    }
    this.addDetail.emit({ ...this.detailData });
    this.clearForm();
  }

  clearForm() {
    this.detailData = {
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

    this.errors.bdtNo = false;
    this.errors.ndtNo = false;
    this.errors.createDate = false;
    this.errors.totalPurchase = false;
    this.errors.taxIden = false;
    this.errors.branchNo = false;
    this.errors.establishmentName = false;

    setTimeout(() => {
      this.errors.createDate = false;
    });
  }

  fetchVatRates() {
    this.vatRateService.getVatRate().subscribe({
      next: (res) => {
        this.vatRateList = res;
      },
      error: (err) => {
        console.error('Error fetching VAT rates', err);
      },
    });
  }

  onTotalPurchaseChange() {
    const total = parseFloat(
      String(this.detailData.totalPurchase).replace(/,/g, '')
    );

    if (!total || isNaN(total) || this.vatRateList.length === 0) {
      this.detailData.vatBR = undefined;
      this.detailData.vatBA = undefined;
      this.detailData.vatTB = undefined;
      this.detailData.taxS = undefined;
      return;
    }

    const matchedRate = this.vatRateList.find(
      (rate) => total >= rate.saleFrom && total <= rate.saleTo
    );

    if (matchedRate) {
      this.detailData.vatBR = matchedRate.vrtRate;
      this.detailData.vatBA = matchedRate.vrtRateAg;
      this.detailData.vatTB = matchedRate.vrtRate - matchedRate.vrtRateAg;
    } else {
      this.detailData.vatBR = 900;
      this.detailData.vatBA = 99;
      this.detailData.vatTB = this.detailData.vatBR - this.detailData.vatBA;
    }

    this.detailData.taxS = total * 0.07;
  }

  checkBdtNo() {
    if (!this.detailData.bdtNo?.trim()) {
      this.errors.bdtNo = true;
      this.errorMessages.bdtNo = 'กรุณากรอกเล่มที่';
    } else {
      this.errors.bdtNo = false;
      this.errorMessages.bdtNo = '';
    }
  }

  checkNdtNo() {
    if (!this.detailData.ndtNo) {
      this.errors.ndtNo = true;
      this.errorMessages.ndtNo = 'กรุณากรอกเลขที่';
    } else {
      this.errors.ndtNo = false;
      this.errorMessages.ndtNo = '';
    }
  }

  checkCreateDate() {
    if (!this.detailData.createDate) {
      this.errors.createDate = true;
      this.errorMessages.createDate = 'กรุณาเลือกวันที่จัดทำ ภ.พ.10';
    } else {
      this.errors.createDate = false;
      this.errorMessages.createDate = '';
    }
  }

  checkTotalPurchase() {
    if (!this.detailData.totalPurchase) {
      this.errors.totalPurchase = true;
      this.errorMessages.totalPurchase = 'กรุณากรอกยอดซื้อ';
    } else {
      this.errors.totalPurchase = false;
      this.errorMessages.totalPurchase = '';
    }
  }

  checkTaxIden() {
    if (!this.detailData.taxIden) {
      this.errors.taxIden = true;
      this.errorMessages.taxIden = 'กรุณากรอกเลขประจำตัวผู้เสียภาษี 13 หลัก';
      return;
    }

    if (this.detailData.taxIden.toString().length !== 13) {
      this.errors.taxIden = true;
      this.errorMessages.taxIden = 'ต้องมีความยาว 13 หลัก';
    } else {
      this.errors.taxIden = false;
      this.errorMessages.taxIden = '';
    }
  }

  checkBranchNo() {
    if (!this.detailData.branchNo) {
      this.errors.branchNo = true;
      this.errorMessages.branchNo = 'กรุณากรอกหมายเลขสาขา';
      return;
    }

    if (this.detailData.branchNo.toString().length !== 5) {
      this.errors.branchNo = true;
      this.errorMessages.branchNo = 'ต้องมีความยาว 5 หลัก';
    } else {
      this.errors.branchNo = false;
      this.errorMessages.branchNo = '';
    }
  }

  checkEstablishmentName() {
    if (!this.detailData.establishmentName?.trim()) {
      this.errors.establishmentName = true;
      this.errorMessages.establishmentName = 'กรุณากรอกชื่อสถานประกอบการ';
    } else {
      this.errors.establishmentName = false;
      this.errorMessages.establishmentName = '';
    }
  }

  checkAllFields() {
    this.checkBdtNo();
    this.checkNdtNo();
    this.checkCreateDate();
    this.checkTotalPurchase();
    this.checkTaxIden();
    this.checkBranchNo();
    this.checkEstablishmentName();
  }

  validateFields(): boolean {
    return (
      !!this.detailData.bdtNo?.trim() &&
      !!this.detailData.ndtNo &&
      !!this.detailData.createDate &&
      !!this.detailData.totalPurchase &&
      !!this.detailData.taxIden &&
      this.detailData.taxIden.toString().length === 13 &&
      !!this.detailData.branchNo &&
      this.detailData.branchNo.toString().length === 5 &&
      !!this.detailData.establishmentName?.trim()
    );
  }
}
