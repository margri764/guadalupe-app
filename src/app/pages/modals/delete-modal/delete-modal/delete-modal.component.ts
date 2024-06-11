import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { AssociationService } from 'src/app/services/association.service';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { DiocesisCidadeService } from 'src/app/services/diocesis-cidade.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { ResultFuenteService } from 'src/app/services/result-fuente.service';
import { SegmentationService } from 'src/app/services/segmentation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent  {
  component : string = '';
  action : string = '';
  
  constructor(
                  @Inject(MAT_DIALOG_DATA) public data: any,
                  private matDialogRef : MatDialogRef<DeleteModalComponent>,
                   private userService : UserService,
                   private alarmGroupService : AlarmGroupService,
                   private imageUploadService : ImageUploadService,
                   private diocesisCityService : DiocesisCidadeService,
                   private resultFuenteService : ResultFuenteService,
                   private associationService : AssociationService,
                   private propulsaoService : PropulsaoService,
                   private bankCreditcardService : BankCreditcardService,
                   private currenciesService : CurrenciesService,
                   private segmentationService : SegmentationService

  ) { }

  ngOnInit(): void {

    this.component = this.data.component;
    this.action = this.data.action;
  }

  closeViewModal(){

    if(this.component === "edit-user" && this.action === 'single'){
      this.userService.authDelDocument$.emit(false);

    }else if(this.component === "edit-user" && this.action === 'bulk'){
      this.userService.authDelBulkDocument$.emit(false);

    }else if(this.component === "upload-documents" && this.action === 'single'){
      this.userService.authDelUploadDocument$.emit(false);

    }else if(this.component === "upload-documents" && this.action === 'bulk'){
      this.userService.authDelBulkUploadDocument$.emit(false);

    }else if(this.component === "personal-alarm" ){
      this.alarmGroupService.authDelPersonalAlarm$.emit(false);
    }

    else if(this.component === "edit-user" && this.action === 'delUser' ){
      this.userService.authDelUser$.emit(false);
    }

    else if(this.component === "alarms" && this.action === 'delAlarm' ){
      this.alarmGroupService.authDelAlarm$.emit(false);
    }

    else if(this.component === "groups" && this.action === 'delGroup' ){
      this.alarmGroupService.authDelGroup$.emit(false);
    }

    else if(this.component === "view-groupusers" && this.action === 'delUserGroup' ){
      this.alarmGroupService.authDelUserGroup$.emit(false);
    }

    else if(this.component === "background" && this.action === 'delFundo' ){
      this.imageUploadService.authDelBackground$.emit(false);
    }

    else if(this.component === "city" && this.action === 'delCity' ){
      this.diocesisCityService.authDelCity$.emit(false);
    }

    else if(this.component === "diocese" && this.action === 'delDiocese' ){
      this.diocesisCityService.authDelDiocese$.emit(false);
    }

    else if(this.component === "view-citiesdioceses" && this.action === 'delCityDiocese' ){
      this.diocesisCityService.authDelCityDiocese$.emit(false);
    }

    else if(this.component === "result" && this.action === 'delResult' ){
      this.resultFuenteService.authDelResult$.emit(false);
    }

    else if(this.component === "fonte" && this.action === 'delFonte' ){
      this.resultFuenteService.authDelFonte$.emit(false);
    }

    else if(this.component === "view-resultfonte" && this.action === 'delResultFonte' ){
      this.resultFuenteService.authDelResultFonte$.emit(false);
    }

    else if(this.component === "associations" && this.action === 'delAssociation' ){
      this.associationService.authDelAssociation$.emit(false);
    }

    else if(this.component === "propulsaos" && this.action === 'delPropulsao' ){
      this.propulsaoService.authDelPropulsao$.emit(false);
    }

    else if(this.component === "bank" && this.action === 'delBank' ){
      this.bankCreditcardService.authDelBank$.emit(false);
    }

    else if(this.component === "credit-card" && this.action === 'delCreditCard' ){
      this.bankCreditcardService.authDelCreditCard$.emit(false);
    }

    else if(this.component === "currency" && this.action === 'delCurrency' ){
      this.currenciesService.authDelCurrency$.emit(false);
    }

    else if(this.component === "view-bankassociation" && this.action === 'delBankAsso' ){
      this.bankCreditcardService.authDelBankAssociation$.emit(false);
    }

    else if(this.component === "view-cardassociation" && this.action === 'delCardAsso' ){
      this.bankCreditcardService.authDelCardBank$.emit(false);
    }

    else if(this.component === "bank-agreement" && this.action === 'delBankAgreement' ){
      this.bankCreditcardService.authDelBankAgreement$.emit(false);
    }

    else if(this.component === "view-cardbankagreement" && this.action === 'delCardBankAgreement' ){
      this.bankCreditcardService.authDelResultBankAgreement$.emit(false);
    }

    else if(this.component === "new-file" && this.action === 'delSingleFile' ){
      this.imageUploadService.authDelSingleFile$.emit(false);
    }

    else if(this.component === "new-file" && this.action === 'delBulkFile' ){
      this.imageUploadService.authDelBulkFile$.emit(false);
    }

    else if(this.component === "new-file" && this.action === 'delPreset' ){
      this.imageUploadService.authDelPreset$.emit(false);
    }

    else if(this.component === "edit-file" && this.action === 'delSingleFile' ){
      this.imageUploadService.authDelFile$.emit(false);
    }

    else if(this.component === "edit-file" && this.action === 'delBulkFile' ){
      this.imageUploadService.authDelBulkFile$.emit(false);
    }

    else if(this.component === "file" && this.action === 'delFilePack' ){
      this.imageUploadService.authDelFilePack$.emit(false);
    }

    else if(this.component === "tratamento" && this.action === 'delTratamento' ){
      this.segmentationService.authDelTratamento$.emit(false);
    }

    else if(this.component === "profession" && this.action === 'delProfession' ){
      this.segmentationService.authDelProfession$.emit(false);
    }

    else if(this.component === "mail-segmentation" && this.action === 'delEmailSegmentation' ){
      this.segmentationService.authDelEmailSegmentation$.emit(false);
    }

    else if(this.component === "relationship" && this.action === 'delRelationship' ){
      this.segmentationService.authDelRelationship$.emit(false);
    }

    else if(this.component === "address-segmentation" && this.action === 'delAddressSegmentation' ){
      this.segmentationService.authDelAddressSegmentation$.emit(false);
    }
    else if(this.component === "phone-segmentation" && this.action === 'delPhoneSegmentation' ){
      this.segmentationService.authDelPhoneSegmentation$.emit(false);
    }


      this.matDialogRef.close();
  }





  continue(){

    if(this.component === "edit-user" && this.action === 'single'){
      this.userService.authDelDocument$.emit(true);

    }else if(this.component === "edit-user" && this.action === 'bulk'){
      this.userService.authDelBulkDocument$.emit(true);

    }else if(this.component === "upload-documents" && this.action === 'single'){
      this.userService.authDelUploadDocument$.emit(true);

    }else if(this.component === "upload-documents" && this.action === 'bulk'){
      this.userService.authDelBulkUploadDocument$.emit(true);

    }else if(this.component === "personal-alarm" ){
      this.alarmGroupService.authDelPersonalAlarm$.emit(true);
    }

    else if(this.component === "edit-user" && this.action === 'delUser' ){
      this.userService.authDelUser$.emit(true);
    }

    else if(this.component === "alarms" && this.action === 'delAlarm' ){
      this.alarmGroupService.authDelAlarm$.emit(true);
    }

    else if(this.component === "groups" && this.action === 'delGroup' ){
      this.alarmGroupService.authDelGroup$.emit(true);
    }

    else if(this.component === "view-groupusers" && this.action === 'delUserGroup' ){
      this.alarmGroupService.authDelUserGroup$.emit(true);
    }

    else if(this.component === "background" && this.action === 'delFundo' ){
      this.imageUploadService.authDelBackground$.emit(true);
    }

    else if(this.component === "city" && this.action === 'delCity' ){
      this.diocesisCityService.authDelCity$.emit(true);
    }

    else if(this.component === "diocese" && this.action === 'delDiocese' ){
      this.diocesisCityService.authDelDiocese$.emit(true);
    }

    else if(this.component === "view-citiesdioceses" && this.action === 'delCityDiocese' ){
      this.diocesisCityService.authDelCityDiocese$.emit(true);
    }

    else if(this.component === "result" && this.action === 'delResult' ){
      this.resultFuenteService.authDelResult$.emit(true);
    }
      
    else if(this.component === "fonte" && this.action === 'delFonte' ){
      this.resultFuenteService.authDelFonte$.emit(true);
    }

    else if(this.component === "view-resultfonte" && this.action === 'delResultFonte' ){
      this.resultFuenteService.authDelResultFonte$.emit(true);
    }

    else if(this.component === "associations" && this.action === 'delAssociation' ){
      this.associationService.authDelAssociation$.emit(true);
    }

    else if(this.component === "propulsaos" && this.action === 'delPropulsao' ){
      this.propulsaoService.authDelPropulsao$.emit(true);
    }

    else if(this.component === "bank" && this.action === 'delBank' ){
      this.bankCreditcardService.authDelBank$.emit(true);
    }

    else if(this.component === "credit-card" && this.action === 'delCreditCard' ){
      this.bankCreditcardService.authDelCreditCard$.emit(true);
    }

    else if(this.component === "currency" && this.action === 'delCurrency' ){
      this.currenciesService.authDelCurrency$.emit(true);
    }

    else if(this.component === "view-bankassociation" && this.action === 'delBankAsso' ){
      this.bankCreditcardService.authDelBankAssociation$.emit(true);
    }

    else if(this.component === "view-cardassociation" && this.action === 'delCardAsso' ){
      this.associationService.authDelCreditardFromAsso$.emit(true);
    }

    else if(this.component === "bank-agreement" && this.action === 'delBankAgreement' ){
      this.bankCreditcardService.authDelBankAgreement$.emit(true);
    }

    else if(this.component === "view-cardbankagreement" && this.action === 'delCardBankAgreement' ){
      this.bankCreditcardService.authDelResultBankAgreement$.emit(true);
    }

    else if(this.component === "new-file" && this.action === 'delSingleFile' ){
      this.imageUploadService.authDelSingleFile$.emit(true);
    }

    else if(this.component === "new-file" && this.action === 'delBulkFile' ){
      this.imageUploadService.authDelBulkFile$.emit(true);
    }

    else if(this.component === "new-file" && this.action === 'delPreset' ){
      this.imageUploadService.authDelPreset$.emit(true);
    }

    else if(this.component === "edit-file" && this.action === 'delSingleFile' ){
      this.imageUploadService.authDelFile$.emit(true);
    }

    else if(this.component === "edit-file" && this.action === 'delBulkFile' ){
      this.imageUploadService.authDelBulkFile$.emit(true);
    }

    else if(this.component === "file" && this.action === 'delFilePack' ){
      this.imageUploadService.authDelFilePack$.emit(true);
    }

    else if(this.component === "tratamento" && this.action === 'delTratamento' ){
      this.segmentationService.authDelTratamento$.emit(true);
    }

    else if(this.component === "profession" && this.action === 'delProfession' ){
      this.segmentationService.authDelProfession$.emit(true);
    }

    else if(this.component === "relationship" && this.action === 'delRelationship' ){
      this.segmentationService.authDelRelationship$.emit(true);
    }

    else if(this.component === "email-segmentation" && this.action === 'delEmailSegmentation' ){
      this.segmentationService.authDelEmailSegmentation$.emit(true);
    }

    else if(this.component === "address-segmentation" && this.action === 'delAddressSegmentation' ){
      this.segmentationService.authDelAddressSegmentation$.emit(true);
    }

    else if(this.component === "phone-segmentation" && this.action === 'delPhoneSegmentation' ){
      this.segmentationService.authDelPhoneSegmentation$.emit(true);
    }


    this.closeViewModal()
  }

  

}
