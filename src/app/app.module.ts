import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimpleTableComponent } from './core/comps/simple-table/simple-table.component';
import { DialogComponent } from './main/dialog/dialog.component';
import { UsersComponent } from './main/users/users.component';
import { NotFoundComponent } from './main/not-found/not-found.component';
import { ButtonComponent } from './core/comps/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValidationDirective } from './core/directives/form-validation.directive';
import { PopupComponent } from './core/comps/popup/popup.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleTableComponent,
    DialogComponent,
    UsersComponent,
    NotFoundComponent,
    ButtonComponent,
    FormValidationDirective,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
