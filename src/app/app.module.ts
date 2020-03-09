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
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatFormFieldModule, MatSelectModule, MatDialogModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MetricsModule } from './metrics/metrics.module';
import { FavouriteModule } from './favourite/favourite.module';
import { UploadmodalComponent } from './uploadmodal/uploadmodal.component';
import { ModalComponent } from './sharedmodule/components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HeaderComponent,
    UsermenuComponent,
    NotificationComponent,
    UploadmodalComponent
  ],
  entryComponents: [UploadmodalComponent, ModalComponent],
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
    DashboardModule,
    SharedmoduleModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MetricsModule,
    FavouriteModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
