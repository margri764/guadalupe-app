import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, filter, interval, map, observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private baseUrl = environment.baseUrl;
  authDelBackground$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  showSearchCadMsg$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelSingleFile$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelFile$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelFilePack$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authBulkDeleteFiles$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelBulkFile$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelPreset$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  closeEditPresetDrawer$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successEditPreset$ : EventEmitter<boolean> = new EventEmitter<boolean>; 

  constructor(
               private http: HttpClient,
  ) { 

  }


  
  uploadImage(file: File) {

    console.log(file);
    const formData = new FormData();
    formData.append('file', file);


      return this.http.post<any>(`${this.baseUrl}api/image/uploadBackground/`, formData) 
      
      .pipe(
        tap( ( res) =>{
                      console.log("from uploadImage service: ",res);
                  }  
        ),            
        map( res => res )
      )
  }

  uploadUserImg( file: File, id:any) {

    const formData = new FormData();
    formData.append('file', file);


      return this.http.post<any>(`${this.baseUrl}api/image/uploadUserImg/${id}`, formData) 
      
      .pipe(
        tap( ( res) =>{
                      console.log("from uploadUserImg service: ",res);
                  }  
        ),            
        map( res => res )
      )
  }

  getAllBackground( ) {

    return this.http.get<any>(`${this.baseUrl}api/image/getAllBackground`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllBackground service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  onOffBackground( id: any, action:any ){

    
    return this.http.patch<any>(`${this.baseUrl}api/image/onOffBackground/${id}/?action=${action}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from onOffBackground service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteBackgroundById( id:any ) {

      return this.http.patch<any>(`${this.baseUrl}api/image/deleteBackgroundById/${id}`, null) 
      
      .pipe(
        tap( ( res) =>{
                      console.log("from deleteBackgroundById service: ",res);
                  }  
        ),            
        map( res => res )
      )
  }

  bulkDeleteDocuments( body:any ) {

      return this.http.patch<any>(`${this.baseUrl}api/document/bulkDeleteDocuments/`, body) 
      
      .pipe(
        tap( ( res) =>{
                      console.log("from bulkDeleteDocuments service: ",res);
                  }  
        ),            
        map( res => res )
      )
  }
  
  searchInCAD( query:any ) {

    return this.http.get<any>(`${this.baseUrl}api/document/searchInCAD?querySearch=${query}`) 
      .pipe(
        tap( ( res) =>{
                      console.log("from searchInCAD service: ",res);
                    
                  }  
        ),            
        map( res => res )
      )
  }

getAdminCadastro(){

  return this.http.get<any>(`${this.baseUrl}api/document/getAdminCadastro`) 
  .pipe(
    tap( ( res) =>{
                  console.log("from getAdminCadastro service: ",res);

              }  
    ),            
    map( res => res )
  )

}

// FILES

createFilePack(body:any, file: File) {

  const JSONbody = JSON.stringify(body)
    const formData = new FormData();
    formData.append('file', file )
    formData.append('body', JSONbody )

    return this.http.post<any>(`${this.baseUrl}api/file/createFilePack/`, formData) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createFilePack service: ",res);
                }  
      ),            
      map( res => res )
    )
}

editFilePackById(body: any, id: any, file: File | File[] | null) {

    const JSONbody = JSON.stringify(body);
    const formData = new FormData();

    if (file instanceof File) {
        formData.append('file', file);
    } else if (Array.isArray(file)) {
        file.forEach(f => formData.append('files[]', f));
    }
    
    formData.append('body', JSONbody);
    return this.http.put<any>(`${this.baseUrl}api/file/editFilePackById/${id}`, formData) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editFilePackById service: ",res);
                }  
      ),            
      map( res => res )
    )
}

getListFromFilesPack(id:any) {

    return this.http.get<any>(`${this.baseUrl}api/file/getListFromFilesPack/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getListFromFilesPack service: ",res);
                }  
      ),            
      map( res => res )
    )
}
getFilePackById(id:any) {

    return this.http.get<any>(`${this.baseUrl}api/file/getFilePackById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getFilePackById service: ",res);
                }  
      ),            
      map( res => res )
    )
}

removeFileFromFilePack(id:any) {

  return this.http.delete<any>(`${this.baseUrl}api/file/removeFileFromFilePack/${id}`) 
  
  .pipe(
    tap( ( res) =>{
                  console.log("from removeFileFromFilePack service: ",res);
              }  
    ),            
    map( res => res )
  )
}

bulkRemoveFileFromFilePack( body:any ) {

  return this.http.post<any>(`${this.baseUrl}api/file/bulkRemoveFileFromFilePack`, body) 
  
  .pipe(
    tap( ( res) =>{
                  console.log("from bulkRemoveFileFromFilePack service: ",res);
              }  
    ),            
    map( res => res )
  )
}

bulkFilesInPack( formData: FormData) {

  return this.http.post<any>(`${this.baseUrl}api/file/bulkFilesInPack/`, formData).pipe(
    tap((res) => {
      console.log('from bulkFilesInPack service:', res);
    }),
    map(res => res)
  );
}

getAllFilesPack( ) {

  return this.http.get<any>(`${this.baseUrl}api/file/getAllFilesPack/`,)
  .pipe(
    tap((res) => {
      console.log('from getAllFilesPack service:', res);
    }),
    map(res => res)
  );
}

editDonorById( id:any, body:any ) {

  return this.http.put<any>(`${this.baseUrl}api/file/editDonorById/${id}`, body)
  .pipe(
    tap((res) => {
      console.log('from editDonorById service:', res);
    }),
    map(res => res)
  );
}
getDonorFromOriginalList( id:string, cod_cad:string ) {

  return this.http.get<any>(`${this.baseUrl}api/file/getDonorFromOriginalList/${id}?cod_cad=${cod_cad}`)
  .pipe(
    tap((res) => {
      console.log('from getDonorFromOriginalList service:', res);
    }),
    map(res => res)
  );
}


getPackUsersFiles( ) {

  return this.http.get<any>(`${this.baseUrl}api/file/getPackUsersFiles/`,)
  .pipe(
    tap((res) => {
      console.log('from getPackUsersFiles service:', res);
    }),
    map(res => res)
  );
}

notifyFilesPackOpen( id:any ) {

  return this.http.put<any>(`${this.baseUrl}api/file/notifyFilesPackOpen/${id}`, null)
  .pipe(
    tap((res) => {
      console.log('from notifyFilesPackOpen service:', res);
    }),
    map(res => res)
  );
}

getUserListFromFilePack( id:any ) {

  return this.http.get<any>(`${this.baseUrl}api/file/getUserListFromFilePack/${id}`,)
  .pipe(
    tap((res) => {
      console.log('from getUserListFromFilePack service:', res);
    }),
    map(res => res)
  );
}

deleteFilePackById( id:any ) {

  return this.http.delete<any>(`${this.baseUrl}api/file/deleteFilePackById/${id}`,)
  .pipe(
    tap((res) => {
      console.log('from deleteFilePackById service:', res);
    }),
    map(res => res)
  );
}

createPreset( body:any) {

  return this.http.post<any>(`${this.baseUrl}api/file/createPreset/`, body)
  .pipe(
    tap((res) => {
      console.log('from createPreset service:', res);
    }),
    map(res => res)
  );
}

getAllPresets( ) {

  return this.http.get<any>(`${this.baseUrl}api/file/getAllPresets/`)
  .pipe(
    tap((res) => {
      console.log('from getAllPresets service:', res);
    }),
    map(res => res)
  );
}

getPresetById( id:any  ) {

  return this.http.get<any>(`${this.baseUrl}api/file/getPresetById/${id}`)
  .pipe(
    tap((res) => {
      console.log('from getPresetById service:', res);
    }),
    map(res => res)
  );
}

editPresetById( id:any, body:any ) {

  return this.http.put<any>(`${this.baseUrl}api/file/editPresetById/${id}`, body)
  .pipe(
    tap((res) => {
      console.log('from editPresetById service:', res);
    }),
    map(res => res)
  );
}

deletePresetById( id:any ) {

  return this.http.delete<any>(`${this.baseUrl}api/file/deletePresetById/${id}`)
  .pipe(
    tap((res) => {
      console.log('from deletePresetById service:', res);
    }),
    map(res => res)
  );
}

// downloadZip(selectedIds: any) {
//   const options = {
//     responseType: 'blob' as const,
//   };

//   return this.http.post(`${this.baseUrl}api/document/generateAndDownloadZIP`, { selectedIds }, options)
//     .pipe(
//       filter((res: Blob) => res.size > 0),
//       tap((res: Blob) => {
//         // La respuesta contiene datos
//         console.log("from downloadZip service:", res);

//         // Crea un enlace (link) para descargar el archivo
//         const downloadLink = document.createElement('a');
//         downloadLink.href = URL.createObjectURL(res);
//         downloadLink.download = 'archivo.zip';
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
        
//       }),
//       map((res: Blob) => {
//         return { success: true };
//       })
//     );
// }





genAndDownloadZIPFromFiles( id: any ) {

    const options = {
        responseType: 'blob' as const,
      };

      const body = null;
  
  return this.http.post(`${this.baseUrl}api/file/genAndDownloadZIPFromFiles/${id}`,{body}, options)
  .pipe(
          // filter((res: Blob) => res.size > 0),
          tap((res: Blob) => {
            // La respuesta contiene datos
            console.log("from genAndDownloadZIPFromFiles service:", res);
    
            // Crea un enlace (link) para descargar el archivo
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(res);
            downloadLink.download = 'files.zip';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
          }),
          map((res: Blob) => {
            return { success: true };
          })
        );
}



// bulkFilesInPack(body:any, file: File) {

//   const JSONbody = JSON.stringify(body)
//     const formData = new FormData();
//     formData.append("file", file )
//     formData.append("body", JSONbody )

//     return this.http.post<any>(`${this.baseUrl}api/file/bulkFilesInPack/`, formData) 
    
//     .pipe(
//       tap( ( res) =>{
//                     console.log("from bulkFilesInPack service: ",res);
//                 }  
//       ),            
//       map( res => res )
//     )
// }




}
