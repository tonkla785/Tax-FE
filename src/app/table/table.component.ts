import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Detail } from '../interface/taxinterface';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() dataHeader: Detail[] = [];
  @Output() editItem = new EventEmitter<Detail>();
  @Output() deleteItem = new EventEmitter<{ detail: Detail; index: number }>();
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  data: Detail[] = [];
  detailToDelete!: Detail;

  deleteIndex?: number;

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

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataHeader']) {
      this.data = this.dataHeader || [];
    }
  }

  onEdit(data: Detail, index: number) {
    this.editItem.emit({ ...data, index });
  }

  confirmDelete(data: Detail, index: number) {
    this.detailToDelete = data;
    this.deleteIndex = index;
    this.deleteModal.show();
  }

  onDeleteConfirm() {
    if (this.detailToDelete && this.deleteIndex !== undefined) {
      this.deleteItem.emit({
        detail: this.detailToDelete,
        index: this.deleteIndex,
      });
      this.deleteModal.hide();
    }
  }
}
