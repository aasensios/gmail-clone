import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Doc } from './doc.model';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  docs: Doc[]

  constructor() {}

  getAllDocs() {
    return [

    ]
  }
}
