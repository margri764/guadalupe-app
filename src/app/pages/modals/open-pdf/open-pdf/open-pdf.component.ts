import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule } from 'src/app/material.module';
import { ImagenDocPathPipe } from 'src/app/pipe/imagen-doc-path.pipe';

@Component({
  selector: 'app-open-pdf',
  standalone: true,
  imports: [MaterialModule, PdfViewerModule, ImagenDocPathPipe ],
  templateUrl: './open-pdf.component.html',
  styleUrl: './open-pdf.component.scss'
})

export class OpenPdfComponent implements OnInit {

  program : any;

constructor(
             @Inject(MAT_DIALOG_DATA) public data: any,
           )

{

}

  
  ngOnInit(): void {
    console.log(this.data);
    this.program = this.data

  }

  downloadPdf() {

    if ( this.program  &&  this.program .filePath) {
      
      const urlSegment = this.program.filePath.split('/').pop();
  
      const serverURL = 'https://congressovirgofloscarmeli.org/document/';
  
      const link = document.createElement('a');
  
      link.href = `${serverURL}${urlSegment}`;
  
      link.download = "programa do congresso";
  
      link.target = '_blank';
  
      link.click();
    }
  }
  


}
