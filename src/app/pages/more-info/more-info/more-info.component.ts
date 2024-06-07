import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { OpenPdfComponent } from '../../modals/open-pdf/open-pdf/open-pdf.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-more-info',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './more-info.component.html',
  styleUrl: './more-info.component.scss'
})
export class MoreInfoComponent implements OnInit {

  phone : boolean = false;
  program : any;

  constructor(
              private dialog : MatDialog,
              private authService : AuthService
             )

  {
    (screen.width < 800) ? this.phone = true : this.phone = false;
  }

  ngOnInit(): void {
         this.authService.getProgramByConferenceId('1').subscribe(
        ( {success, document} )=>{
          if(success){
            this.program = document;
          }
        });
  }

  openDialogProgram() {

    this.dialog.open(OpenPdfComponent,{
      maxWidth: (this.phone) ? "97vw": '',
      width:'1000px',
      // maxHeight: (this.phone) ? "98vh": '',
      // height:(this.phone) ? "90vh": '700px',
      data: this.program
    });
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

  async sharePdf() {
    
    try {

    let pdfUrl = '';

    if (this.program && this.program.filePath && this.program.filePath !== '') {

      const fileName = this.program.filePath.split('/').pop();

      const serverURL = 'https://congressovirgofloscarmeli.org/document/';

      pdfUrl = `${serverURL}${fileName}`;
    }
      // Descargar el archivo PDF
      const pdfResponse = await fetch(pdfUrl);

      const pdfBlob = await pdfResponse.blob();
      
      // Crear un objeto File a partir del blob
      const file = new File([pdfBlob], 'document.pdf', { type: 'application/pdf' });
      
      // Comprobar si el navegador admite el API de Web Share
      if (navigator.share) {
        // Compartir el archivo PDF utilizando el API de Web Share
        await navigator.share({ files: [file] });
      } else {
        // Si el navegador no admite Web Share, maneja el error o proporciona una alternativa
        console.error('El navegador no admite la API de Web Share.');
        // Aquí podrías proporcionar una alternativa, como abrir un enlace de descarga directa del PDF
      }
    } catch (error) {
      console.error('Error al compartir el PDF:', error);
      // Maneja el error aquí
    }
  }
  
  

}
