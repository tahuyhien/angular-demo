import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'vision-api',
  templateUrl: './vision-api.component.html',
  styleUrls: ['vision-api.component.scss']
})

export class VisionApiComponent implements OnInit {
  public imageUrlPath: SafeUrl;
  public uploader: FileUploader = new FileUploader({url: '', itemAlias: 'photo'});
  public textDetection: string = '';
  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  public ngOnInit() {

    this.uploader.onAfterAddingFile = (file) => {
      this.imageUrlPath  =
        this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
        const reader = new FileReader();
        reader.onload =  (event) => {
          // console.log(extract(reader.result));
          let rawData = reader.result.split('base64,');
          console.log(rawData[1]);

          let data = {
            'requests': [
              {
                'image': {
                  'content': rawData[1]
                },
                'features': [
                  {
                    'type': 'DOCUMENT_TEXT_DETECTION'
                  }
                ]
              }
            ]
          };
          const api = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCJSYXAN6l-BrydI1LCzFS1QTBu7OLjc9g';
          this.http.post(api, data).subscribe((res: any) => {
            this.textDetection = res.responses[0].fullTextAnnotation.text;
          });

        };
        reader.readAsDataURL(file._file);
    };
  }
}
