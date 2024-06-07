import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd, ActivatedRoute, Data } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule, Location} from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule, TablerIconsModule, CommonModule],
  templateUrl: './breadcrumb.component.html',
  styles: [`
  .iconDeselected{
      height: 40px;
      width: 40px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .iconSelected{
      height: 40px;
      width: 40px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .iconDeselected:hover{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 40px;
      background-color: rgba(0, 149, 255, 0.08);
      border-radius: 50%;
      transform: scale(1.15);
   
    }
    


  
  `],
})
export class AppBreadcrumbComponent {
  
  // @Input() layout;
  pageInfo: Data | any = Object.create(null);
  myurl: any = this.router.url.slice(1).split('/');
  back : boolean = false;
  showBackArrow : boolean = true;


  constructor(
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private location : Location,
  ) 
  {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map((route) => {

          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;

        })
      )
      .pipe(filter((route) => route.outlet === 'primary'))
      .pipe(mergeMap((route) => route.data))
      // tslint:disable-next-line - Disables all
      .subscribe((event) => {
        // tslint:disable-next-line - Disables all
        // this.titleService.setTitle(event['title'] + ' - Angular 17');
        this.pageInfo = event;
        this.showBackArrow = true;
        if(router.url === '/painel'){
          this.showBackArrow = false;
         }
      });
  }

  goBack(){
    this.back = true
    setTimeout(() => {
      this.back = false;
      this.location.back();
    }, 100);
  }
}
