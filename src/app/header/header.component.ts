import { Component, OnInit } from '@angular/core';
import { TaxService } from '../service/taxservice';
import { Header } from '../interface/taxinterface';

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
}
