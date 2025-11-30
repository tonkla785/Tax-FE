import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HeaderComponent } from './header/header.component';
import { DetailComponent } from './detail/detail.component';
import { ThshdatePipe } from './pipe/thshdate.pipe';
import { thLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';

const thBeLocale = {
  ...thLocale,

  postformat: (str: string) => {
    return str.replace(/\b(\d{4})\b/g, (year) => {
      const y = parseInt(year, 10);
      return isNaN(y) ? year : (y + 543).toString();
    });
  },
};

defineLocale('th-be', thBeLocale);

@NgModule({
  declarations: [AppComponent, HeaderComponent, DetailComponent, ThshdatePipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NzTableModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
