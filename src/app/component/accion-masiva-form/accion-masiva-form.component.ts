import { Component, OnInit, ViewChild } from '@angular/core';
import { CsvService } from '../../services/csv.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

import { FormData } from './data/formData.model';
import { FormDataService } from './data/formData.service';
import { CargaMasivaService } from 'src/app/services/carga-masiva.service';
import Swal from 'sweetalert2';
import { UtilesServices } from 'src/app/services/utiles-service';
import { Router } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';
import { PorcentajeSinDecimalesPipe } from 'src/app/porcentajeSinDecimales.pipe';

declare var require: any;
const data: any = [];
const dataQuemado: any = require('./ejemploarchivo.json');
let  procedimientoXTipoArchivo: number = 0; 

interface Linea {
  EID: string;
  EIDMADRE: string;
  peso: string; // Aquí estamos permitiendo que el campo peso sea una cadena o nulo
}

@Component({
  selector: 'app-accion-masiva-form',
  templateUrl: './accion-masiva-form.component.html',
  styleUrls: ['./accion-masiva-form.component.scss'],
})
export class AccionMasivaFormComponent implements OnInit {
  public activeModal: NgbActiveModal;

  segundoPasoForm: FormGroup;
  segundoPasoFormRegSanitario:FormGroup;
  segundoPasoFormRegPesada:FormGroup;
  tercerPasoForm: FormGroup;
  tercerPasoFormRegistroSanitario:FormGroup;
  tercerPasoFormRegistroPesada:FormGroup;
  tercerPasoFormTraslado: FormGroup;
  cuartoPasoForm: FormGroup;

  estadoGanado = JSON.parse(localStorage.getItem('estado_ganado'));
  motivosMovimiento = JSON.parse(localStorage.getItem('motivo_mov_stock'));
  tipoGanado = JSON.parse(localStorage.getItem('tipo_ganado'));
  razaGanado = JSON.parse(localStorage.getItem('marca_ganado'));
  categoriaGanado = JSON.parse(localStorage.getItem('categoria_ganado'));
  razaGanadoOrigin = JSON.parse(localStorage.getItem('marca_ganado'));
  categoriaGanadoOrigin = JSON.parse(localStorage.getItem('categoria_ganado'));
  tipoPeso = JSON.parse(localStorage.getItem('tipo_toma_peso'));
  articulos = JSON.parse(localStorage.getItem('articulo'));
  dicoses = JSON.parse(localStorage.getItem('dicose'));
  depositos = JSON.parse(localStorage.getItem('deposito'));
  sectores = JSON.parse(localStorage.getItem('sector'));
  motivosSanitarios=JSON.parse(localStorage.getItem('motivo_sanitario'));

  idMotivoFiltro = 1;
  idTipoGanado = 0;
  fechaActual = new Date();

  // Obtener los componentes de la fecha
  year = this.fechaActual.getFullYear();
  month = (this.fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Agregar cero a la izquierda si es necesario
  day = this.fechaActual.getDate().toString().padStart(2, '0'); // Agregar cero a la izquierda si es necesario

  // Formar la cadena combinada
  loteCargaInicial = 'LOTECI-' + this.year + this.month + this.day;
  loteCompra= 'LOTECOMPRA-' + this.year + this.month + this.day;
  form: any;

  editing: any = {};
  rows: any = new Array();
  temp = [...data];

  loadingIndicator = true;
  reorderable = true;
  noPasoAun: boolean = false;
  existeCaravana: boolean;

  esMovimiento: boolean = false;
  pasoUno: boolean = true;
  pasoDos: boolean = false;
  pasoTres: boolean = false;
  pasoTresTraslado: boolean = false;
  pasoCuatro: boolean = false;
  pasoDosRegistroPesada:boolean=false;
  pasoDosRegistroSanitario:boolean=false;
  pasoTresRegistroSanitario:boolean=false;
  pasoTresRegistroPesada:boolean=false;
  pesoTotal: number = 0;
  cantidad_total: number = 0;
  pesoTotalFacturado: number = 0;
  dateNow: Date = new Date();
  strArrayDepositosOrigenes='';
  afectaPeso=false;
  animalesSaneados = 0;
  animalesPesados = 0;
  kilosAnimalesSaneadosMuestraNueva = 0;
  kilosAnimalesSaneadosMuestraActual = 0;
  porcentajeKilosAumentados = '';
  nombreProcesoSanitario = ''

  private datos: FormData = new FormData();

  columns2: any[] = [];
  columns = [
    
    { prop: 'EID' },
    { name: 'VID' }
  ];




  @ViewChild(AccionMasivaFormComponent) table: AccionMasivaFormComponent | any;
  id_propiedad_ganado: any;
  selectedTeam: string;
  procesoInferidoXArchivo: any;

  constructor(
    private CsvService: CsvService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private formDataService: FormDataService,
    private cargaMasivaService: CargaMasivaService,
    private utiles: UtilesServices,
    private router: Router,
    private stockService: StockService,
    private porcentajePipe: PorcentajeSinDecimalesPipe
  ) {
    this.rows = data;
    this.temp = [...data];
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
    this.createForm();
  }

  ngOnInit() {
    this.tercerPasoForm
      .get('id_tipo_ganado')
      .valueChanges.subscribe((id_tipo_ganado) => {
        //console.log(tipoGanado)
        this.tercerPasoForm.get('id_raza_ganado').reset();
        //this.tercerPasoForm.get('razaGanado').disable();
        if (id_tipo_ganado) {
          //console.log("El valor del ganado")
          //console.log(tipoGanado)
          this.razaGanado = this.filtrarRazas(
            this.razaGanadoOrigin,
            id_tipo_ganado
          );

          this.categoriaGanado = this.filtrarCategorias(
            this.categoriaGanadoOrigin,
            id_tipo_ganado
          );
          //this.razaGanado.disable();
        }
      });

    const currentDate = new Date().toISOString().substring(0, 10);
    this.segundoPasoForm.controls['fecha'].setValue(currentDate);
    this.segundoPasoForm.controls['dicose'].setValue(1);
    this.segundoPasoForm.controls['id_motivo_mov_stk'].setValue(1);
    this.tercerPasoForm.controls['id_propiedad_ganado'].setValue(1);
    this.tercerPasoForm.controls['id_tipo_ganado'].setValue(1);
    this.tercerPasoForm.controls['id_tipo_peso'].setValue(1);
    this.cuartoPasoForm.controls['bania_garrapata'].setValue(true);
    this.cuartoPasoForm.controls['clostridiosis'].setValue(true);
    this.cuartoPasoForm.controls['parasitos_internos'].setValue(true);
    this.cuartoPasoForm.controls['carbunco'].setValue(true);    
    this.cuartoPasoForm.controls['banio'].setValue(true);   
    this.cuartoPasoForm.controls['banio_nitromic'].setValue(true);   
    this.segundoPasoFormRegSanitario.controls['fecha'].setValue(currentDate);

    this.segundoPasoFormRegPesada.controls['fecha'].setValue(currentDate);
    //this.segundoPasoFormRegSanitario['pesada_muestra'].setValue(false)
  }
  savePrimerFormulario(form: any) {
    if (!form.valid) return;

    //
    const dicoseId=form.value.dicose;

    if(dicoseId!==1){
      this.tercerPasoForm.controls['id_propiedad_ganado'].setValue(2);
    }else{
      this.tercerPasoForm.controls['id_propiedad_ganado'].setValue(1);
    }

    this.formDataService.setDatosPrimerFormulario(form.value);
  }

  saveTercerFormulario(form: any) {
    if (!form.valid) return;

    this.formDataService.setDatosTercerFormulario(form.value);
  }

  saveSegundoFormulario(form: any) {
    if (!form.valid) return;

    //Asigno la suma de los pesos reales de los bichos
    form.value.peso_total_real = this.pesoTotal;

    //Asigno la cantidad total de bichos
    form.value.cantidad_total = this.cantidad_total;

    // Construyo el objeto y asigno valores
    this.formDataService.setDatosSegundoFormulario(form.value);

    this.pesoTotalFacturado = form.value.peso_total_facturado;

    switch (this.formDataService.getFormData().id_motivo_mov_stk) {
      case 1:
      case 3:
      case 4:
      case 19:
        // Obtengo el articulo en funcion de la categoria de ganado y de la raza
        const articulo = this.buscoArticulo(
          form.value.id_categoria_ganado,
          form.value.id_raza_ganado
        );
        this.formDataService.setDatosArticulo(articulo[0].cod_articulo);
        break;
    }
    //console.log(this.formDataService.getFormData());

    //this.datos = form.value;
  }

  saveSegundoFormularioRegistroSanitario(form: any) {
    if (!form.valid) return;

    //Asigno la suma de los pesos reales de los bichos
    
    form.value.peso_total_real = this.kilosAnimalesSaneadosMuestraActual;
    form.value.peso_total_facturado = this.kilosAnimalesSaneadosMuestraNueva;
    form.value.cantidad_total = this.animalesSaneados;
    form.value.cantidad_muestra = this.animalesPesados;
    // Construyo el objeto y asigno valores
    //console.log(form)
    this.formDataService.setDatosSegundoFormularioRegistroSanitario(form.value);

    

   
  }


  saveSegundoFormularioRegistroPesada(form: any) {
    if (!form.valid) return;

    //Asigno la suma de los pesos reales de los bichos
    
    form.value.peso_total_real = this.kilosAnimalesSaneadosMuestraActual;
    form.value.peso_total_facturado = this.kilosAnimalesSaneadosMuestraNueva;
    form.value.cantidad_total = this.animalesPesados;

    // Construyo el objeto y asigno valores
    //console.log(form)
    this.formDataService.setDatosSegundoFormularioRegistroPesada(form.value);

    

   
  }

  createForm() {
    this.segundoPasoForm = this.fb.group({
      fecha: [this.dateNow, Validators.required],
      id_motivo_mov_stk: ['', Validators.required],
      serie_guia: ['', Validators.required],
      nro_guia: ['', Validators.required],
      dicose: ['', Validators.required],
      observaciones: [''],
    });

    this.tercerPasoForm = this.fb.group({
      id_propiedad_ganado: ['', Validators.required],
      id_tipo_ganado: ['', Validators.required],
      id_raza_ganado: ['', Validators.required],
      id_categoria_ganado: ['', Validators.required],
      id_tipo_peso: ['', Validators.required],
      peso_total_facturado: ['', Validators.required],
      anexo_lote: [''],
    });


    this.tercerPasoFormTraslado = this.fb.group({
      id_sector_destino: ['', Validators.required],

    });


    this.cuartoPasoForm = this.fb.group({
      bania_garrapata: [false],
      clostridiosis: [false],
      parasitos_internos: [false],
      carbunco: [false],
      banio:[false],
      banio_nitromic:[false]
   
    });


    this.segundoPasoFormRegSanitario = this.fb.group({
      fecha: [this.dateNow, Validators.required],
      id_motivo_sanitario: ['', Validators.required],
      observaciones:[''],
      pesada_muestra:[false]
    })
    this.segundoPasoFormRegPesada = this.fb.group({
      fecha: [this.dateNow, Validators.required],
      observaciones:['']
    })
    this.tercerPasoFormRegistroSanitario = this.fb.group({
    
    });
    this.tercerPasoFormRegistroPesada= this.fb.group({
    
    }); 
  }

  public importedData: Array<any> = [];

  public async importDataFromCSV(event: any) {

    this.noPasoAun = true;

  


    let fileContent = await this.getTextFromFile(event);
    
    //console.log('aca')
    //console.log(fileContent)
    //console.log(this.noPasoAun)
    
    procedimientoXTipoArchivo = await this.CsvService.getProcedimientoXTipoArchivo(fileContent);
    // aca obtengo de la storage el tipo de archivo y el proceso que tengo que hacer en base al archivo
    //Ejemplo carga inical posicio 5
    //this.columns
    // Separar el texto en columnas utilizando '|'
    
    const camposTexto = procedimientoXTipoArchivo['campos'];

    const campos = camposTexto.split('|');

    // Agregar las columnas al array columns
    this.columns2.push({ prop: campos[0] });

    // Recorrer las columnas restantes y agregarlas como 'name'
    for (let i = 1; i < campos.length; i++) {
      this.columns2.push({ name: campos[i].trim() });
    }
    
    this.columns =  [...this.columns2]

    this.procesoInferidoXArchivo =  procedimientoXTipoArchivo['id_proceso'];

    switch(this.procesoInferidoXArchivo){

      case 19:
        this.tercerPasoForm.controls['anexo_lote'].setValue(this.loteCargaInicial);
        this.tercerPasoForm.controls['peso_total_facturado'].setValue(0);
      break;
      case 1:
        this.tercerPasoForm.controls['anexo_lote'].setValue(this.loteCompra);

      break;
    }

    this.importedData = this.CsvService.importDataFromCSV(fileContent);

    //console.log(this.importedData);

    //si pasa es porque se verifico largo de las caravanas y duplicados
    if (this.utiles.verificoArchivoCsv(this.importedData)) {
      // se verifica si son nuevas o ya estan para realizar sus respectivos procesos
      this.existeCaravana = this.CsvService.verificoDatosASubir(this.importedData);

      //console.log(this.importedData)
      this.rows = [...this.importedData];
      this.pesoTotal = this.CsvService.sumarPesoGanado(this.importedData);
      this.cantidad_total = this.importedData.length;
      this.temp = [...this.importedData];
      this.formDataService.setDatosArchivo(this.importedData);
      this.formDataService.getFormData();
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1500);
    }
  }

  private async getTextFromFile(event: any) {
    const file: File = event.target.files[0];
    let fileContent = await file.text();

    return fileContent;
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.EID.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = data;
  }

  updateValue(event: any, cell: any, rowIndex: number) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  modalOpenRegiser(modalRegiser: any) {
    this.modalService.open(modalRegiser);
  }

  submitPasoUnoRegSanitario(form: any, motivo: number) {
    if (!form.valid) return;

    //this.idMotivoFiltro = motivo;
    //cargo motivos sanitarios
    this.pasoUno = false;
    this.pasoDosRegistroSanitario = true;
    this.pasoTres = false;
    this.pasoCuatro = false;


  }

  submitPasoUnoRegPesada(form: any, motivo: number) {
    if (!form.valid) return;

    //this.idMotivoFiltro = motivo;
    //cargo motivos sanitarios
    this.pasoUno = false;
    this.pasoDosRegistroPesada = true;
    this.pasoTres = false;
    this.pasoCuatro = false;
 
  }  


  submitPasoUno(form: any, motivo: number) {
    if (!form.valid) return;

    this.idMotivoFiltro = motivo;
    if (motivo === 1) {
      this.segundoPasoForm.controls['id_motivo_mov_stk'].setValue(1);
    }
    if (motivo === 3) {
      this.segundoPasoForm.controls['id_motivo_mov_stk'].setValue(5);
    }
    this.pasoUno = false;
    this.pasoDos = true;
    this.pasoTres = false;
    this.pasoCuatro = false;
  }

  buscoArticulo(id_categoria: number, id_raza: number) {
    //console.log(this.articulos);
    return this.articulos.filter(
      (m) =>
        m.id_categoria_ganado == id_categoria && m.id_marca_ganado == id_raza
    );
  }

  filtrarMotivo(motivos: any[]): any[] {
    //console.log(motivos);
    return motivos.filter((m) => m.id_tipo_mov_stk == this.idMotivoFiltro);
  }

  filtrarRazas(razas: any[], filtroId: number): any[] {
    return razas.filter((m) => m.id_tipo_ganado == filtroId);
  }

  filtrarCategorias(categorias: any[], filtroId: number): any[] {
    return categorias.filter((m) => m.id_tipo_ganado == filtroId);
  }

  submitPasoDos(form: any) {
    if (!form.valid) return;
    //console.log(form.fecha)
    this.savePrimerFormulario(form);
    this.pasoUno = false;
    this.pasoDos = false;
    this.pasoTres = true;
    this.pasoCuatro = false;
  }
  submitPasoDosAjusteMenos(form: any) {
    if (!form.valid) return;
    //console.log(form.fecha)
    this.savePrimerFormulario(form);
    this.saveSegundoFormulario(form);
    this.pasoUno = false;
    this.pasoDos = false;
    this.pasoTres = false;
    this.pasoCuatro = true;
  }

  submitPasoDosTraslado(form: any) {
    if (!form.valid) return;
    //console.log(form.fecha)

    //Tengo que obtener el deposito orgien en funcion de los bichos que me enviaron
    this.stockService.getDepositoStkSeleccionado(this.formDataService.getFormData().lineas).subscribe((resp) => {

      //console.log(resp);
      const arrayDepositos = [];

      for (const key in resp) {
        if (resp.hasOwnProperty(key)) {
          const deposito = {
            id: key,
            nombre: resp[key],
          };
          arrayDepositos.push(deposito);
        }
      }
      
      // Extraer los nombres de las estancias utilizando map()
      const nombresDepositos = arrayDepositos.map(deposito => deposito.nombre);
      
      // Unir los nombres en una cadena utilizando join()
      const depositosString = nombresDepositos.join(', ');
      
      //console.log(depositosString);

      this.strArrayDepositosOrigenes = depositosString;
    });
    this.savePrimerFormulario(form);
    this.saveSegundoFormulario(form);
    this.pasoUno = false;
    this.pasoDos = false;
    this.pasoTresTraslado = true;
    this.pasoCuatro = false;
    this.esMovimiento =true;
  }


  

  submitPasoTres(form: any) {
    if (!form.valid) return;
    //console.log(form.fecha)
    this.saveSegundoFormulario(form);
    this.pasoUno = false;
    this.pasoDos = false;
    this.pasoTres = false;
    this.pasoTresTraslado = false;
    this.pasoCuatro = true;
  }


  submitPasoTresRegistroSanitario(form: any) {
    if (!form.valid) return;
    //console.log(form.fecha)

    this.animalesSaneados = this.cantidad_total;
  
    const stockActivo = JSON.parse(localStorage.getItem('stockActivo'));
    //console.log(stockActivo)
    //console.log(this.formDataService.getFormData().lineas);

    const arrayCaravanasProcesadas:Linea[]=this.formDataService.getFormData().lineas;


    // Filtrar los objetos cuyo atributo 'PESO' es mayor que cero
    const caravanasConPesoMayorCero = arrayCaravanasProcesadas.filter(objeto => parseFloat(objeto.peso) > 0);

    // Calcular la suma de pesos y la cantidad de registros
    const { sumaPesos, cantidadRegistros } = caravanasConPesoMayorCero.reduce((acumulador, objeto) => {
        // Sumar el peso al acumulador
        acumulador.sumaPesos += parseFloat(objeto.peso);
        // Incrementar la cantidad de registros
        acumulador.cantidadRegistros++;
        return acumulador;
    }, { sumaPesos: 0, cantidadRegistros: 0 }); // Inicializar el acumulador con valores iniciales

    //console.log('Suma de pesos:', sumaPesos);
    //console.log('Cantidad de registros:', cantidadRegistros);
    this.animalesPesados = cantidadRegistros;

  
    //console.log(caravanasConPesoMayorCero);
    //const caravanasEncontradas = caravanasConPesoMayorCero.map((objeto) => objeto.EID);
    
     //el peso de la bichas en stock
    const caravanasEncontradas = stockActivo[0].filter(objeto =>
      arrayCaravanasProcesadas.some(caravana => caravana.EID === objeto.cod_identidad)
    );
  
    const sumaCantidad2 = caravanasEncontradas.reduce((acumulador, caravana) => {
      return acumulador + caravana.cantidad2;
    }, 0);
    


    // Obtengo cantidad total de animales saneados.
    this.kilosAnimalesSaneadosMuestraNueva = sumaPesos;
    this.kilosAnimalesSaneadosMuestraActual = sumaCantidad2;


    let cuentaPorcentaje = this.kilosAnimalesSaneadosMuestraActual/this.kilosAnimalesSaneadosMuestraNueva;
    this.porcentajeKilosAumentados = this.porcentajePipe.transform((1-cuentaPorcentaje)*100); 

    

    this.saveSegundoFormularioRegistroSanitario(form);
    
    
    const idMotivoAFiltrar:number = this.formDataService.getFormData().id_motivo_sanitario;

    //console.log(this.motivosSanitarios);
    //console.log(idMotivoAFiltrar);

    const motivoSanitarioEncontrado = this.motivosSanitarios.find(motivo => motivo.id==idMotivoAFiltrar)


    //let miPerro = ;


    //console.log(motivoSanitarioEncontrado);

    //const motivoSanitarioEncontrado = motivosSanitarios.find(motivo => motivo.id === id_motivo_sanitario);
    //console.log(motivoSanitarioEncontrado);

    this.nombreProcesoSanitario  =  motivoSanitarioEncontrado.descripcion;
    
   
    this.afectaPeso = this.formDataService.getFormData().pesada_muestra;


    //obtengo 
  
    this.pasoUno = false;
    this.pasoDosRegistroSanitario = false;
    this.pasoTresRegistroSanitario = true;
    this.pasoCuatro = false;
  }



  submitPasoTresRegistroPesada(form: any) {
    if (!form.valid) return;
    //console.log(form.fecha)

    this.animalesPesados = this.cantidad_total;
  
    const stockActivo = JSON.parse(localStorage.getItem('stockActivo'));
    //console.log(stockActivo)
    //console.log(this.formDataService.getFormData().lineas);

    const arrayCaravanasPesoMayorCero:Linea[]=this.formDataService.getFormData().lineas;

    const caravanasConPesoMayorCero = arrayCaravanasPesoMayorCero
    .filter((objeto) => parseFloat(objeto.peso) > 0)
    .map((objeto) => ({ EID: Number(objeto.EID) }));
  
    //console.log(caravanasConPesoMayorCero);


    const caravanasEncontradas = caravanasConPesoMayorCero.map((objeto) => objeto.EID);
    const sumaTotalCantidad2 = stockActivo[0]
      .filter((objeto) => caravanasEncontradas.includes(Number(objeto.cod_identidad)))
      .reduce((acumulador, objeto) => acumulador + objeto.cantidad2, 0);

    //console.log(sumaTotalCantidad2);



    // Obtengo cantidad total de animales saneados.
    this.kilosAnimalesSaneadosMuestraNueva = arrayCaravanasPesoMayorCero.reduce((acumulador, objeto) => acumulador + parseFloat(objeto.peso), 0);
    this.kilosAnimalesSaneadosMuestraActual = sumaTotalCantidad2;
    this.porcentajeKilosAumentados = this.porcentajePipe.transform((1-(this.kilosAnimalesSaneadosMuestraActual/this.kilosAnimalesSaneadosMuestraNueva))*100); 

    

    this.saveSegundoFormularioRegistroPesada(form);
    
    

    this.pasoUno = false;
    this.pasoDosRegistroPesada = false;
    this.pasoTresRegistroPesada = true;
    this.pasoCuatro = false;
  }


  submitPasoCuatro(form: any) {
    if (!form.valid) return;

    let proceso = '';
    //console.log(form.getFormData().id_motivo_mov_stk);

    switch (this.formDataService.getFormData().id_motivo_mov_stk) {
      case 1:
        proceso = 'compraganadomasiva';

        this.saveTercerFormulario(form);
        this.formDataService.setDatosExtra();
        var myJsonString = JSON.stringify(this.formDataService);

        break;
        case 19:
          proceso = 'cargainicialmasiva';
  
          this.saveTercerFormulario(form);
          this.formDataService.setDatosExtra();
          var myJsonString = JSON.stringify(this.formDataService);
  
          break;        
      ///NEGATIVO
      case 2:
        proceso = 'vtaganadomasiva';

        this.saveTercerFormulario(form);
        this.formDataService.setDatosExtra();
        var myJsonString = JSON.stringify(this.formDataService);

        break;
      case 3:
        proceso = 'ajumasganadomasiva';

        this.saveTercerFormulario(form);
        this.formDataService.setDatosExtra();
        var myJsonString = JSON.stringify(this.formDataService);

        break;
      case 4:
        proceso = 'nacganadomasiva';
        this.saveTercerFormulario(form);
        this.formDataService.setDatosExtra();
        var myJsonString = JSON.stringify(this.formDataService);

        break;
      ///NEGATIVO
      case 5:
        proceso = 'ajumenganadomasiva';
        this.formDataService.saveDatosGeneralesBaja(form,this.segundoPasoForm);
        this.formDataService.setDatosExtra();
        var myJsonString = JSON.stringify(this.formDataService);

        break;
        case 7:
          proceso = 'muerte';
          this.formDataService.saveDatosGeneralesBaja(form,this.segundoPasoForm);
          this.formDataService.setDatosExtra();
          var myJsonString = JSON.stringify(this.formDataService);
  
          break;

        case 6:
        case 13:
        case 14:
        case 15:    
        case 16:
        case 17: 
          proceso = 'movimientoStk';
          this.formDataService.saveDatosMovimientos(form,this.tercerPasoFormTraslado);
          this.formDataService.setDatosExtra();
          var myJsonString = JSON.stringify(this.formDataService);
  
          break;

        // EL id lo lleno manualmente porque no son movimientos de sotck. Son otros procesos
        case 11:

            proceso = 'pesadastk';
  
            this.formDataService.setDatosExtra();
            var myJsonString = JSON.stringify(this.formDataService);
    
          break;
        case 12:

            proceso = 'registrosanitario';
            //this.formDataService.saveDatosRegistoSanitario(form,this.tercerPasoFormTraslado);
            this.formDataService.setDatosExtra();
            var myJsonString = JSON.stringify(this.formDataService);
    
          break;

    }



    this.cargaMasivaService.suboGanadoMasiva(myJsonString, proceso).subscribe(
      (resp) => {
        var mensaje = '';

        switch (this.formDataService.getFormData().id_motivo_mov_stk) {
          case 1:
          case 3:
          case 4:
          case 19:
            mensaje =
              'Se ha realizado el proceso correctamente<br> El nro de transaccion es el: ' +
              resp.nro_trans +
              '<br> El nro del lote de alta es: ' +
              resp.nro_lote;

            break;
          ///NEGATIVO
          case 2:
            mensaje =
            'Se ha realizado el proceso correctamente<br> El nro de transaccion es el: ' +
            resp.nro_trans +
            '<br> El nro del lote de alta es: ' +
            resp.nro_lote;

          break;
          case 5:
          case 6:
          case 11:
          case 12:
            mensaje =
              'Se ha realizado el proceso correctamente<br> El nro de transaccion es el: ' +
              resp.nro_trans;

            break;

   

        }

        //actualizo ganado activo

        this.stockService.getStockActivo().subscribe((resp) => {
          localStorage.removeItem('stockActivo');
          localStorage.setItem('stockActivo', JSON.stringify(resp));
        });
        Swal.fire('Felicitaciones', mensaje, 'success');

        this.modalService.dismissAll();
      },
      (err) => {
        Swal.fire('Error', err.error.message, 'error');
      }
    );
  }

  onSelected(value: string): void {
    if (value !== '1') {
      this.segundoPasoForm.controls['nro_guia'].setValue(0);
      this.segundoPasoForm.controls['serie_guia'].setValue(0);
    } else {
      this.segundoPasoForm.controls['nro_guia'].setValue('');
      this.segundoPasoForm.controls['serie_guia'].setValue('');
    }
  }
}
