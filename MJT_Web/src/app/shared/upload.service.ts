import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Upload } from './upload.model';
// import {ma[]}
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map'
// import 'rxjs/add/operator/toPromise'


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  selectedUpload: Upload;
  upload: Upload[];
  //보내줄 base주소 설정해줌
  readonly baseURL = 'http://localhost:3000/Upload';

  constructor(private http : HttpClient) { }

  postUpload(uld : Upload){
    return this.http.post(this.baseURL, uld);
  }

}
