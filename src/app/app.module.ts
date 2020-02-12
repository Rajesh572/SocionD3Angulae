import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SharedmoduleModule } from './sharedmodule/sharedmodule.module';
import { HeaderComponent } from './components/header/header.component';
import { UsermenuComponent } from './components/header/components/usermenu/usermenu.component';
import { NotificationComponent } from './components/header/components/notification/notification.component';
import { RouterModule } from '@angular/router';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './searchmodule/search.module';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatFormFieldModule, MatSelectModule, MatDialogModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { UploadmodalComponent } from './uploadmodal/uploadmodal.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HeaderComponent,
    UsermenuComponent,
    NotificationComponent,
    UploadmodalComponent
  ],
  entryComponents:[UploadmodalComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    FontAwesomeModule,
    AppRoutingModule,
    SearchModule,
    DashboardModule,
    UserModule,
    SharedmoduleModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
