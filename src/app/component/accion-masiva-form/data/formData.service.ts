import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormData } from './formData.model';
import { FormGroup } from '@angular/forms';


@Injectable()
export class FormDataService {

    private formData: FormData = new FormData();



    //Get Personal Tab Data

    setDatosArchivo(data){

        this.formData.lineas = data
    
    }

    //Set Personal Tab Data
    setDatosPrimerFormulario(data: FormData) {
        // Update the Personal data only when the Personal Form had been validated successfully
      
        var datePipe = new DatePipe("en-US");
        const value = datePipe.transform(data.fecha, "dd/MM/yyyy");
       //const value = data.fecha;


        this.formData.fecha = value;
        this.formData.id_motivo_mov_stk = Number(data.id_motivo_mov_stk);
        this.formData.serie_guia = data.serie_guia;
        this.formData.nro_guia = data.nro_guia;
        this.formData.dicose = data.dicose;


    }
    setDatosSegundoFormulario(data: FormData) {
        // Update the Personal data only when the Personal Form had been validated successfully
       
        this.formData.id_propiedad_ganado = data.id_propiedad_ganado;
        this.formData.id_tipo_ganado = data.id_tipo_ganado;
        this.formData.id_raza_ganado = data.id_raza_ganado;
        this.formData.id_categoria_ganado = data.id_categoria_ganado;
        this.formData.peso_total_real = data.peso_total_real;
        this.formData.peso_total_facturado = data.peso_total_facturado;
        this.formData.id_tipo_peso = data.id_tipo_peso;
        this.formData.cantidad_total = data.cantidad_total;
        this.formData.anexo_lote = data.anexo_lote;
        

    }


    setDatosSegundoFormularioRegistroSanitario(data:FormData){

       
        this.formData.id_motivo_sanitario = data.id_motivo_sanitario;
        this.formData.observaciones = data.observaciones;
        this.formData.pesada_muestra = data.pesada_muestra;
        this.formData.id_motivo_mov_stk = 12;
        this.formData.cantidad_total=data.cantidad_total
        this.formData.peso_total_facturado = data.peso_total_facturado;
        this.formData.peso_total_real = data.peso_total_real;
  
        var datePipe = new DatePipe("en-US");
        const value = datePipe.transform(data.fecha, "dd/MM/yyyy");
       //const value = data.fecha;

        this.formData.fecha = value;      


    }


    setDatosSegundoFormularioRegistroPesada(data:FormData){

        this.formData.id_motivo_sanitario = data.id_motivo_sanitario;
        this.formData.observaciones = data.observaciones;
        this.formData.id_motivo_mov_stk = 11;
        this.formData.cantidad_total=data.cantidad_total
        this.formData.peso_total_facturado = data.peso_total_facturado;
        this.formData.peso_total_real = data.peso_total_real;
  
        var datePipe = new DatePipe("en-US");
        const value = datePipe.transform(data.fecha, "dd/MM/yyyy");
       //const value = data.fecha;

        this.formData.fecha = value;       
    }

    setDatosTercerFormulario(data: FormData) {
        // Update the Personal data only when the Personal Form had been validated successfully
       
        this.formData.bania_garrapata = data.bania_garrapata;
        this.formData.carbunco = data.carbunco;
        this.formData.parasitos_internos = data.parasitos_internos;
        this.formData.clostridiosis = data.clostridiosis;

        
    }
    setDatosArticulo(data){
        this.formData.cod_articulo = data;
    }

    saveDatosGeneralesBaja(data: FormData, grupo: FormGroup){
        this.formData.observaciones =  grupo.get('observaciones').value;
        this.formData.peso_total_real = data.peso_total_real;
        this.formData.cantidad_total = data.cantidad_total;
    }

    saveDatosMovimientos(data: FormData, grupo: FormGroup){
        //console.log(data)
        this.formData.id_sector_destino =  parseInt(grupo.get('id_sector_destino').value, 10);
        
    }




    setDatosExtra(){

        this.formData.cantidad = 1
        this.formData.id_empresa = 1
        this.formData.id_estado_stock = 1
        this.formData.id_unidad_stk = 1
        //tnego que obtener el id del deposito embarcadero y setearlo para la entradad
        const sectores = JSON.parse(localStorage.getItem('sector'));

        // Función de filtro para encontrar el sector con 'embarcadero' en 'true'
        const sectorConEmbarcadero = sectores.find((sector) => sector.embarcadero === true);
        
        // Si se encontró un sector con 'embarcadero' en 'true', lo mostrarás en la consola o realizarás cualquier otra acción necesaria
        if (sectorConEmbarcadero) {
            this.formData.id_sector = sectorConEmbarcadero.id;
        } else {
          console.log('No se encontró un sector con embarcadero en true.');
        }



        

    
    }

    getFormData(): FormData {
        // Return the entire Form Data
        return this.formData;
    }

    resetFormData(): FormData {
        // Reset the workflow
        ///this.workflowService.resetSteps();
        // Return the form data after all this.* members had been reset
        //this.formData.clear();
        //this.isPersonalFormValid = this.isWorkFormValid = this.isAddressFormValid = false;
        return this.formData;
    }


}