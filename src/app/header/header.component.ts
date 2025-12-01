import { Component, OnInit } from '@angular/core';
import { TaxService } from '../service/taxservice';
import { Header } from '../interface/taxinterface';
import { formatDate } from '../util/datetostring';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
  alertErrorMessage,
  alertHandlerMessage,
  alertMessage,
} from '../util/alertmessage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  maxDate: Date;

  data: Header = {
    vdtNo: undefined,
    vdtDate: undefined,
    createBy: '',
    createDate: undefined,
    detailEntityList: [],
  };

  constructor(private taxService: TaxService) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {}

  searchData() {
    this.taxService
      .searchHeader(
        this.data.vdtNo,
        this.data.createDate ? formatDate(this.data.createDate) : undefined
      )
      .subscribe({
        next: (res) => {
          res.data;
          console.log('ค้นหาข้อมูล', res);
          alertMessage();
        },
        error: (err) => {
          console.error('ค้นหาไม่สำเร็จ', err);
          if (err.status === 404) {
            alertHandlerMessage('ไม่พบข้อมูลที่ค้นหา');
          } else {
            alertErrorMessage('กรุณกรอกข้อมูล');
          }
        },
      });
  }
}
