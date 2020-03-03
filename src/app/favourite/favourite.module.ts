import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouriteRoutingModule } from './favourite-routing.module';
import { FavouriteComponent } from './favourite/favourite.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';



@NgModule({
  declarations: [FavouriteComponent],
  imports: [
    CommonModule,
    FavouriteRoutingModule,
    SharedmoduleModule
  ]
})
export class FavouriteModule { }
