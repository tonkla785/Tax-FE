import { Component, OnInit } from '@angular/core';
import { Detail } from '../interface/taxinterface';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  maxDate: Date;

  detailData: Detail = {
    id: 0,
    bdtNo: '',
    ndtNo: '',
    createDate: undefined,
    createBy: '',
    updateBy: '',
    updateDate: undefined,
    totalPurchase: 0,
    taxS: 0,
    vatBR: 0,
    vatBA: 0,
    vatTB: 0,
    branchNo: '',
    establishmentName: '',
    taxIden: '',
  };

  constructor() {
    this.maxDate = new Date();
  }

  ngOnInit(): void {}
}
