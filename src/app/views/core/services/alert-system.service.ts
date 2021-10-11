import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertSystemService {
  public prompt(titl): Observable<SweetAlertResult<string>> {
    const p = Swal.fire({
      title: titl,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Create',
      showLoaderOnConfirm: true,
      allowOutsideClick: true
    });

    return from(p);
  }

  public promptMultiline(titl): Observable<SweetAlertResult<string>> {
    const p = Swal.fire({
      title: titl,
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Create',
      showLoaderOnConfirm: true,
      allowOutsideClick: true
    });

    return from(p);
  }
}
