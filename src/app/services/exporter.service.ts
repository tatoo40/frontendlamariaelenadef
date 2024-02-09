import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
//import { FileSaver } from 'file-saver';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx'
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXT  = '.xlsx'


@Injectable({

    providedIn:'root'
})

export class ExporterService{

    constructor(){

    }


    exportToExcel(data:any[],excelFileName:string): void {

        const worksheet:XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const workbook:XLSX.WorkBook = {
            Sheets:{'data': worksheet },
            SheetNames:['data']
        }

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        this.saveAsExcel(excelBuffer,excelFileName);

      }

    private saveAsExcel(buffer:any, fileName:string):void{
        const data:Blob = new Blob([buffer],{type:EXCEL_TYPE});
        //XLSX.writeFile(buffer, fileName+'_export_'+ new Date().getTime()+EXCEL_EXT);
       
        //FileSaver.saveAs(data,fileName+'_export_'+ EXCEL_EXT)
        FileSaver.saveAs(data,fileName+'_export_'+ new Date().getTime()+EXCEL_EXT)

    }
}
