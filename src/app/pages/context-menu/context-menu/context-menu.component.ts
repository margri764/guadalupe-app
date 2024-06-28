import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {


  @Input() showContextMenu = false;
  @Input() contextMenuPosition = { x: 0, y: 0 };

  subscription!: Subscription ;
  selected : boolean = false;
  downloadAll : boolean = false;

  constructor(
              private userService : UserService
  ) { }

  ngOnInit(): void {

    this.subscription = this.userService.changeMenuStates$.subscribe((menuStates) => { this.checkMenuStates(menuStates)
    });
  }

  menuItemClicked(item: string): void {
    
    switch (item) {

      case 'selectAll':
                         this.userService.selectAllDocuments$.emit(true);

        break;

      case 'deleteAll':
                         this.userService.deleteSelectedDocuments$.emit(true);
        break;

      case 'deselectAll':
                         this.userService.deSelectAllDocuments$.emit(true);
                        
        break;
      case 'downloadAll':
                        this.userService.downloadSelectedDocuments$.emit(true);
      
        break;
    
      default:
        break;
    }


    
    // this.showContextMenu = false; 
  }

  checkMenuStates( menuStates:any ): void {
    if(menuStates){
      this.selected = menuStates.selected;
      this.downloadAll = menuStates.selected;
    }
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe()
 }
 


}
