import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-privacy-modal',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './privacy-modal.component.html',
  styleUrl: './privacy-modal.component.scss'
})
export class PrivacyModalComponent {

}
