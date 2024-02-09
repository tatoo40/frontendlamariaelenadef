import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import {
  NgbModal,
  NgbAccordionModule,
  NgbCarouselModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ExporterService } from 'src/app/services/exporter.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { UtilesServices } from 'src/app/services/utiles-service';
import { Router, RouterModule, Routes } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-vertical-navigation',
  standalone: true,
  imports: [
    NgbAccordionModule,
    NgScrollbarModule,
    NgbCarouselModule,
    NgbDropdownModule, CommonModule
  ],
  templateUrl: './vertical-navigation.component.html',
})
export class VerticalNavigationComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public showSearch = false;
  nombre:string='';
  email:string='';
  usuarioId:number=0;
  //usuarioContectadoString = localStorage.getItem("usuarioConectado");
  //usuarioConectado = JSON.parse(this.usuarioContectadoString);
  //nombre:string = this.usuarioConectado.nombre  
  // This is for Notifications
  DatoList: any[] = [];
  cantNotificacionesTotales=0;






  //TENGO QUE GENERAR LAS NOTIFICACIONES
  notifications: any[] = [];

  // This is for Mymessages
  mymessages: any[] = [
    {
      useravatar: 'assets/images/users/user1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM',
    },
    {
      useravatar: 'assets/images/users/user2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM',
    },
    {
      useravatar: 'assets/images/users/user2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM',
    },
    {
      useravatar: 'assets/images/users/user4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM',
    },
  ];

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: 'us',
    },
    {
      language: 'Español',
      code: 'es',
      icon: 'es',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr',
    },
    {
      language: 'German',
      code: 'de',
      icon: 'de',
    },
  ];
 

  constructor(
    private modalService: NgbModal,
    private translate: TranslateService,
    private utiles:UtilesServices,
    private notificaciones:NotificacionesService,
    private exportoNotificaciones:ExporterService,
    private router: Router
  ) {
    translate.setDefaultLang('es');
 
  // Verifico que no exista animal sin peso
  this.notificaciones.getNotificacionGanadoSinPeso().subscribe((dato) => {
    this.DatoList = dato;
    //.log(dato);
    
    // Verificamos si hay registros en this.DatoList
    if (this.DatoList.length > 0) {
      // Agregamos una notificación al array de notifications
      this.notifications.push({
        btn: 'btn-danger',
        icon: 'ti-link',
        title: 'Ganado sin peso',
        subject: `Existen ${this.DatoList.length} animales sin peso registrado`,
        detalle: 'exportGanadoSinPesoAsXLSX',
      });

      this.cantNotificacionesTotales+=1;
    }
  });
  



  
  this.notificaciones.getNotificacionSanitaria().subscribe((dato) => {
    this.DatoList = dato;
    //console.log(dato);
    
    // Verificamos si hay registros en this.DatoList
    if (this.DatoList.length > 0) {
      // Agregamos una notificación al array de notifications
      this.notifications.push({
        btn: 'btn-danger',
        icon: 'ti-link',
        title: 'Sanitaria',
        subject: `Existen ${this.DatoList.length} animales con mas de 20 dias sin tener un registro sanitario`,
        detalle: 'exportGanadoSinRegistroSanitarioAsXLSX',
      });

      this.cantNotificacionesTotales+=1;
    }
  });
  this.notificaciones.getNotificacionEntradaSinFactura().subscribe((dato) => {
    this.DatoList = dato;
    //console.log(dato);
    
    // Verificamos si hay registros en this.DatoList
    if (this.DatoList.length > 0) {
      // Agregamos una notificación al array de notifications
      this.notifications.push({
        btn: 'btn-danger',
        icon: 'ti-link',
        title: 'Entradas sin factura',
        subject: `Existen ${this.DatoList.length} entradas sin registro de factura`,
        detalle: 'exportEntradasSinFacturaAsXLSX',
      });

      this.cantNotificacionesTotales+=1;
    }
  });


  }


  verPerfil(idUsuario: number) {
    // Navegar al componente de usuarios y pasar el ID del usuario como parámetro de ruta
      this.router.navigate(['/configuracion-sistema/usuarios', idUsuario]);
  }
  
  mostrarDatosEnExcel(detalle):void{

    switch (detalle){
      case 'exportGanadoSinPesoAsXLSX':
        this.exportoNotificaciones.exportToExcel(this.DatoList,'ganadosinpeso');
       break;
       case 'exportGanadoSinRegistroSanitarioAsXLSX':
        this.exportoNotificaciones.exportToExcel(this.DatoList,'ganadosinregistrosanitario');
       break;
       case 'exportEntradasSinFacturaAsXLSX':
        this.exportoNotificaciones.exportToExcel(this.DatoList,'entradassinfactura');
       break;
    }
    
    

  }
  
  ngOnInit(): void {
    const usuarioString = localStorage.getItem("usuario_contectado");
    if (usuarioString !== null) {
      // El objeto existe en el localStorage, procede a parsearlo y acceder a 'nombre'
      const usuario = JSON.parse(usuarioString);
      const nombre = usuario.nombre;
      this.nombre = nombre;
      this.email  = usuario.email;
      this.usuarioId=usuario.id;
      // Asigna 'nombre' a la propiedad correspondiente en el componente o utilízalo como sea necesario
    } else {
      // El objeto no existe en el localStorage, maneja esta situación en consecuencia
    }
  }

  changeLanguage(lang: any) {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }


  logoOut(){

    this.utiles.logout();

  }
  
}


