import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular'
import { INavData } from '@coreui/angular';
;
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
// import { navItems } from './_nav';
import { DefaultLayoutService } from './default-layout.service';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss'],
    imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet
]
})
export class DefaultLayoutComponent implements OnInit {
  // public navItems = navItems;
  menuList:any[]=[]
  navItems: INavData[] = [];
  selectedRoleId: string | null = null;
  selectedUserId: string | null = null;
  constructor(
    private defaultLayoutService: DefaultLayoutService,
        private fb: FormBuilder,
        private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllResourcesList();
    this.getAllMenuList();
  }

  getAllResourcesList() {
    this.defaultLayoutService.getAllResources({languageId: '6751515ce8be630bc927fda4'}).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let allResourcesList = Response.data.resources;
        if (localStorage.getItem('resources')) {
          localStorage.removeItem('resources');
        }
    
        localStorage.setItem('resources', JSON.stringify(allResourcesList));
      }
    })
  }

  getAllMenuList() {
    const loginUserData = localStorage.getItem('LoginUserData');
  
    if (loginUserData) {
      const userData = JSON.parse(loginUserData);
      const roleId = userData.user.roleId; // Extract roleId
      const userId = userData.user._id;    // Extract userId
  
      this.defaultLayoutService.getAllSidebarMenu({ roleId, userId }).subscribe(
        (response: any) => {
          if (response.meta.code === 200) {
            this.menuList = response.data;
            this.generateNavItems(this.menuList);
          } else {
            console.error('Failed to load menu list:', response.meta.message);
          }
        },
        (error) => {
          console.error('Error fetching menu list:', error);
        }
      );
    } else {
      localStorage.clear();
    this.router.navigate(['/admin/login']); // Redirect to the login page
      console.error('LoginUserData not found in localStorage');
    }
  }
  
  generateNavItems(menuList: any[]) {
    this.navItems = menuList.map(menu => this.mapMenu(menu));
}

mapMenu(menu: any): INavData {
    return {
        name: menu.name,
        url: menu.url,
        icon: menu.icon,  
        children: menu.subMenus?.map((subMenu: any) => this.mapMenu(subMenu)) || []
    };
}

  

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}
