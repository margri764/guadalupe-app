import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-consent',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './consent-modal.component.html',
  styleUrl: './consent-modal.component.scss'
})
export class ConsentModalComponent {

}
