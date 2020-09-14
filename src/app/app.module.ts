import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SimplemattableModule } from 'simplemattable';
import { DocsComponent } from './docs/docs.component';
import { DocsSimplemattableComponent } from './docs-simplemattable/docs-simplemattable.component';

@NgModule({
  declarations: [
    AppComponent,
    DocsComponent,
    DocsSimplemattableComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MaterialModule,
    FlexLayoutModule,
    SimplemattableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
