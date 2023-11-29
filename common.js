// -------------------------------------------------
// Paleta de colores
// -------------------------------------------------
window.chartColors = {
    blue_dark: '#00697a',
    blue: '#008aa0',
    blue_ligth: '#10b7c9',
    blue_cloudy: '#96cfd6',
    green: '#10ad87',
    mustard_dark: '#f7941e',
    mustard: '#f2b41c',
    yellow: '#f8dc43',
    yellow_ligth: '#f6de7f',
    red: '#be1e2d',
    red_cloudy: '#FF562B',
    brown: '#6D4439',
    gray_dark: '#6d6e71',
    gray: '#919293',
    gray_ligth: '#e6e7e8',
    purple: '#9966FF',
    pink: '#FF6384',
};

window._colors = [
    '#10b7c9',
    '#FF562B',
    '#919293',
    '#f6de7f',
    '#9966FF',
    '#f2b41c',
    '#e6e7e8',
    '#be1e2d',
    '#6d6e71',
    '#6D4439',
    '#96cfd6',
    '#00697a',
    '#008aa0',
    '#bec1c3',
    '#de3141',
    '#f8dc43',
    '#FF6384',
    '#f7941e',
    '#10ad87',
];

// -------------------------------------------------
// 
// -------------------------------------------------
function displayHide(id) {
    let x = document.getElementById(id);
    x.className = x.className.replace("show", "hide");
}

function displayShow(id) {
    let x = document.getElementById(id);
    x.className = x.className.replace("hide", "show");
}

function displayHideByClass(className){
    let xs = document.getElementsByClassName(className);
    $.each(xs, function(key,x){
        x.className = x.className.replace("show", "hide");
    });
}

function displayShowByClass(className){
    let xs = document.getElementsByClassName(className);
    $.each(xs, function(key,x){
        x.className = x.className.replace("hide", "show");
    });
}

// -------------------------------------------------
// Chart helpers
// -------------------------------------------------
function indexes(length){
    let mitad = parseInt(length / 2);
    let d = length % 2 == 0 ? mitad + 1 : mitad + 2 ;

    let indexes = [0, 1, mitad, d, length - 2, length - 1];
    return indexes;
}

// To adjust chart yaxex label
function decimalAdjust(type, value, exp) {
    // Si el exp no está definido o es cero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

function commarize(value) {
    // Alter numbers larger than 1k
    if (value >= 1e3) {
        var units = ["k", "M", "B", "T"];

        var order = Math.floor(Math.log(value) / Math.log(1000));

        var unitname = units[(order - 1)];
        var num = decimalAdjust('round', value / 1000 ** order, -1)

        return num + unitname
    }

    return value.toLocaleString()
}

function downloadCanvasAsImage(id){
    let img = document.getElementById(id).toDataURL("image/jpg");
    document.getElementById(id + "_img").href = img;
}

//-------------------------------------------------------------------------------------------------------- 
// Global variables for download csv file
//--------------------------------------------------------------------------------------------------------
window.vsProduccionChartDataJsonUrl = null;
window.segregadaChartDataU = null;
window.vsProduccionSuperficieSembrada = null;
window.importacionesExportacionesChart = null;
window.importacionesExportacionesChartValor = null;
window.balanceSuministro;
window.exportacionesRelacion;
window.importacionesRelacion = null;
window.superficieArrozNal = null;
window.superficieArrozTemporalNal = null;

var flagForDownloadOptions = null;
function downloadChartJsonDataAsCSV(id){
    let data = [];
    switch(id){
        case 'agregadaChart':
            data = window.agregada_data;
            JSONToCSVConvertor(data.data, 'Producción de arroz' + data.label + '(Combinada)', true, 'vs_produccion_arroz');
            break;
        case 'segregadaChart':
            window.vsProduccionChartDataJsonUrl = null;
            window.segregadaChartDataU = 'segregadaChart';
            break;
        case 'vsProduccionChartData':    
            flagForDownloadOptions = 'vsProduccionChartData';
            break;
        case 'comercioDataImpExp':
            //console.log(window.importacionesExportacionesChart); // cantidad
            flagForDownloadOptions = 'comercioDataImpExp';
            break;
        case 'comercioDataImpExpValor':
            //console.log(window.importacionesExportacionesChartValor) // valor
            flagForDownloadOptions = 'comercioDataImpExpValor';
            break;
        case 'comercioDataNal':
            //console.log(window.balanceSuministro) // suministro
            flagForDownloadOptions = 'comercioDataNal';
            break;
        case 'comercioDataExportacionesRelacion':
           // console.log(window.exportacionesRelacion); // expor alimne
            flagForDownloadOptions = 'comercioDataExportacionesRelacion';
            break;
        case 'comercioDataImportacionesRelacion':
            //console.log(window.importacionesRelacion)// impor alimen
            flagForDownloadOptions = 'comercioDataImportacionesRelacion';
            break;
        case 'superficieCultivadaData':
            //console.log(window.superficieArrozNal)// impor alimen
            flagForDownloadOptions = 'superficieCultivadaData';
            break;
        case 'superficieTemporalData':
            //console.log(window.superficieArrozTemporalNal)
            flagForDownloadOptions = 'superficieTemporalData';
    }
}

// By Ashish Panwar
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel, chartname) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    let CSV = '';    
    //Set Report title in first row or line
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        let row = "";
        //This loop will extract the label from 1st index of on array
        for (let index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (let i = 0; i < arrData.length; i++) {
        let row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (let index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    let fileName = chartname + "_data";
    //Initialize file format you want csv or xls
    let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    let link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// -------------------------------------------------
// Loader gif controller
// -------------------------------------------------
let loaderId = 0;
function displayLoader(){
    loaderId ++;
    let html = `<div class="loader" style="margin-top: 200px;" id="loader_${ loaderId }"><img src="/images/new_gif_loader.gif"></div>`;
    $('#loaders').append(html);
    return loaderId;
}

function removeLoader(id){
    $('#loader_' + id).remove();
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Busca el elemento por el id y elimina todos los nodos 
 * hijos de dicho elemento
 * @param id, es el id del div contenedor
 * @returns void
 */
function removeAllChildFromDiv(id){
    let container = document.getElementById(`${id}`);  
    // Create the Range object
    let rangeObj = new Range();
    // Select all of theParent's children
    rangeObj.selectNodeContents(container);
    // Delete everything that is selected
    rangeObj.deleteContents();
}

window.server_response_status_csv = null;
window.json_url = null;
function sendMessageCSV(){
    if($('#contact_form_csv').valid()){

        //let _token =  $('#_token').val();

        let name = $('#inputName').val();
        let email = $('#inputEmail').val();
        let isoCountry = $('#select_countries_modal_downloadcsvfile').val();
        let institucion = $('#inputInstitucion').val();

        var reg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+.)+[A-Z]{2,4}$/i;
        
        if(name.trim() == '' ){
            alert('Please enter your name.');
            $('#inputName').focus();
            return false;
        }else if(email.trim() == '' ){
            alert('Please enter your email.');
            $('#inputEmail').focus();
            return false;
        }else if(email.trim() != '' && !reg.test(email)){
            alert('Please enter valid email.');
            $('#inputEmail').focus();
            return false;
        }
        //console.log(isoCountry)
        //console.log(name)
        //displayShow('loader');
        $.get(`/api/v1/save/data/download/csv?name=${name}&email=${email}&country_iso=${isoCountry}&institucion=${institucion}`, function(data){
            //console.log(data);
            window.server_response_status_csv = data;
            if(window.flagForDownloadOptions == 'sf_other_crops') downloadRelationToOtherCrops();
            if(window.flagForDownloadOptions == 'sf_other_cereals') downloadRelationToOtherCereals();
            if(window.flagForDownloadOptions == 'production_aggregate_data') downloadAreaProductionYieldChartData();
            if(window.flagForDownloadOptions == 'production_growth_rate_data') downloadGrowthRateChartData();
            if(window.flagForDownloadOptions == 'gross_production_value') downloadGrossProductionValueChartData();
            if(window.flagForDownloadOptions == 'growth_rate_production_value') downloadGrowthRateProductionValueData();
            // if(window.vsProduccionChartDataJsonUrl != null){    
            //     getReportProduccion();
            // }
            // else if (window.window.segregadaChartDataU != null){
            //     getReportSegregadaData();
            // }
            // else if(window.importacionesExportacionesChart != null && flagForDownloadOptions == 'comercioDataImpExp'){
            //     getReportImportacionesExportacionesCantidad();
            // }
            // else if(window.importacionesExportacionesChartValor != null && flagForDownloadOptions == 'comercioDataImpExpValor'){
            //     getReportImportacionesExportacionesValor();
            // }
            // else if(window.balanceSuministro != null && flagForDownloadOptions == 'comercioDataNal'){
            //     getReportBalanceSuminstro();
            // }
            // else if(window.exportacionesRelacion != null && flagForDownloadOptions == 'comercioDataExportacionesRelacion'){
            //     getReportRelacionesExportaciones();
            // }
            // else if(window.importacionesRelacion != null && flagForDownloadOptions == 'comercioDataImportacionesRelacion'){
            //     getReportRelacionesImportaciones();
            // }
            // else if(window.superficieArrozNal != null && flagForDownloadOptions == 'superficieCultivadaData'){
            //     getReportSuperficieNal();
            // }
            // else if(window.superficieArrozTemporalNal != null && flagForDownloadOptions == 'superficieTemporalData'){
            //     getReportSuperficieTemporalNal();
            // }
            //displayHide('loader');
		});
    }


}

const getReportProduccion  = async function(){
    if(window.server_response_status_csv == 200){
        let jsonUrl = `${window.vsProduccionChartDataJsonUrl}`;
        let res = await fetch(jsonUrl);
        let json= await res.json();
        let data = json.data;
        data = data.map(row => ({
            superficie: row.area,
            produccion: row.produccion,
            rendimiento: row.rendimiento,
            anio: row.year
        }))
        // console.log('puedes descargar')
        let csvData = objectToCsv(data);
        //console.log(csvData)
        download(csvData, 'Produccion de arroz')
    }
    
}

const getReportSegregadaData = function(){

    let objData = window.segregada_data;
    data = [];
    $.each(objData, function(key, resultObj){
        $.each(resultObj.data, function(key, objData){
            objData.id = resultObj.id;
            objData.label = resultObj.label;
            data.push(objData);
        });
    });
    JSONToCSVConvertor(data, 'Producción de arroz' , true, 'produccion_arroz');
}

const getReportImportacionesExportacionesCantidad = async function(){
    if(window.server_response_status_csv == 200){
        let jsonUrl = `${window.importacionesExportacionesChart}`;
        let res = await fetch(jsonUrl);
        let json= await res.json();
        //console.log(json)
        let data = json.data;
        data = data.map(row => ({
            importaciones: row.importaciones,
            exportaciones: row.exportaciones,
            anio: row.year
        }))
        let csvData = objectToCsv(data);
        download(csvData, 'Importaciones vs Exportaciones (Cantidad)')
    }
}

const getReportImportacionesExportacionesValor = async function(){
    if(window.server_response_status_csv == 200){
        let jsonUrl = `${window.importacionesExportacionesChartValor}`;
        let labelType = '(valor)';
        let res = await fetch(jsonUrl);
        let json= await res.json();
        //console.log(json)
        let data = json.data;
        data = data.map(row => ({
            importaciones: row.importaciones,
            exportaciones: row.exportaciones,
            anio: row.year
        }))
        let csvData = objectToCsv(data);
        download(csvData, 'Importaciones vs Exportaciones '+labelType)
    }
}

const getReportBalanceSuminstro = async function(){
    if(window.server_response_status_csv == 200){
        let jsonUrl = `${window.balanceSuministro}`;
        let res = await fetch(jsonUrl);
        let json= await res.json();
        let data = json.data;
        data = data.map(row => ({
            'produccion destinada al consumo interno': row.interno,
            exportaciones: row.exportaciones,
            importaciones: row.importaciones,
            anio: row.year
        }))
        // console.log('puedes descargar')
        let csvData = objectToCsv(data);
        //console.log(csvData)
        download(csvData, 'Balance del suminstro de arroz a nivel nacional')
    }
}

const getReportRelacionesExportaciones = async function(){
    let data = null;
    if(window.server_response_status_csv == 200){
        let jsonUrl = `${window.exportacionesRelacion}`;
        let labelType = 'Exportaciones de arroz en relación a las exportaciones de alimentos y bebidas';
        let res = await fetch(jsonUrl);
        let json= await res.json();
        data = json.data;
        data = data.map(row => ({
            'Valor de exportaciones de arroz': row.arroz,
            'Porcentaje del valor de las exportaciones del arroz sobre el total de las exportaciones de alimentos': row.porcentage,
            'Valor de las exportaciones de otros alimentos': row.otros_alimentos,
            anio: row.year
        }))
        // console.log('puedes descargar')
        let csvData = objectToCsv(data);
        //console.log(csvData)
        download(csvData, labelType);
    }
}

const getReportRelacionesImportaciones = async function(){
    if(window.server_response_status_csv == 200){
        let jsonUrl = `${window.importacionesRelacion}`;
        let labelType = 'Importaciones de arroz en relación a las importaciones de alimentos y bebidas';
        let res = await fetch(jsonUrl);
        let json= await res.json();
        data = json.data;
        data = data.map(row => ({
            'Valor de importaciones de arroz': row.arroz,
            'Porcentaje del valor de las importaciones del arroz sobre el total de las importaciones de alimentos': row.porcentage,
            'Valor de las importaciones de otros alimentos': row.otros_alimentos,
            anio: row.year
        }))
        let csvData = objectToCsv(data);
        //console.log(csvData)
        download(csvData, labelType);
    }
}

const getReportSuperficieNal = async function(){
    if(window.server_response_status_csv == 200){
        let jsonUrl = `${window.superficieArrozNal}`;
        let labelType = 'Superficie de arroz en relación a la superficie de tierras cultivables a nivel nacional';
        let res = await fetch(jsonUrl);
        let json= await res.json();
        data = json.results;
        //console.log(data)
        data = data.map(row => ({
            'Arroz': row.superficie_arroz,
            'Tierras de cultivo': row.superficie_cultivo,
            anio: row.year
        }))
        let csvData = objectToCsv(data);
        //console.log(csvData)
        download(csvData, labelType);
    }
}

const getReportSuperficieTemporalNal = async function(){
    if(window.server_response_status_csv == 200){
        let jsonUrl = `${window.superficieArrozTemporalNal}`;
        let labelType = 'Superficie de arroz en relación a la superficie destinada a cultivos temporales a nivel nacional';
        let res = await fetch(jsonUrl);
        let json= await res.json();
        data = json.results;
        //console.log(data)
        data = data.map(row => ({
            'Arroz': row.superficie_arroz,
            'Tierras destinadas a cultivos temporales': row.superficie_temporal,
            anio: row.year
        }))
        let csvData = objectToCsv(data);
        //console.log(csvData)
        download(csvData, labelType);
    }
}

const objectToCsv = function(data){

    const csvRows = [];

    // get the headers
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    // loop over the rows 
    for (const row of data){
        const values = headers.map(header => {
            const escaped = (''+row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','))
    }
    return csvRows.join('\n');
}

const download = function(data, labelFile){
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${labelFile}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

// Funcion extra para graficos de indicadores u otros graficos y demas que obtengan de manera desordenada por fecha los valores llamados de la DB
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

//console.log(document.getElementById("lngug-es").getAttribute("value"))
// Global variables for trade
window.adminLevelName = null;

function changeRadioButtonChecked(option){
    let radioButton = document.getElementById(`${option}`);
    radioButton.checked = true;
}

var getTranslationByLocale = (word) => words[locale][0][word];
var removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
var removeWhiteSpaces = (str) => str.replace(/\s/g, "");


//------------------------------------------------------------------------
// Get list of GeoRegions by macro region id
//------------------------------------------------------------------------
async function getGeoRegions(macroRegionId){
    let data = null;
    await $.get(`/api/v1/geojson/filters/map/regions/${ macroRegionId }`, function (objResult) {
        //console.log(`/api/v1/geojson/filters/map/regions/${ macroRegionId }`)
        data = objResult;
    });
    return new Promise((resolve, reject) => {
        resolve(data);
    });
}

//------------------------------------------------------------------------
// Get geocuntries by georegion
//------------------------------------------------------------------------
async function getGeoCountriesByRegion(regionId){
    let data = null;
    await $.get(`/api/v1/geojson/countries/by/region-id/${ regionId }`, function (objResult) {
        data = objResult;
    });
    return new Promise((resolve, reject) => {
        resolve(data);
    });
}

//------------------------------------------------------------------------
// Get list of regions and countries grouped by macro region
//------------------------------------------------------------------------
async function getGeoRegionsAndCountriesByMacroRegion(macroRegionId){
    let data = null;
    await $.get(`/api/v1/geojson/filters/map/regions/countries/${macroRegionId}`, function (objResult) {
        data = objResult;
    });
    return new Promise((resolve, reject) => {
        resolve(data);
    });
}

//------------------------------------------------------------------------
// Remove child of selects  
//------------------------------------------------------------------------
function removeOptions(selectElement) {
    let i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }

// For to determine number of ticks in plotly chart
function determineNTicks(datasetInX){
    //datasetInX = [1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]
    // datasetInX = 'jola'
    //console.log(datasetInX)
    if(Object.prototype.toString.call(datasetInX) === '[object Array]'){
        let len = datasetInX.length;
        let lastItemDataSetInX = datasetInX.at(-1);
        let dTick = null;
        let idx = 0;
        let result = [];
        if(len < 35) dTick = 5;
        else if(len >= 35) dTick = 8;
        while(idx < len){
            result.push(datasetInX[idx].toString());
            idx = idx + dTick;
        }
        const found = lastItemDataSetInX.toString() === result.at(-1) ? true : false;
        if(!found) result.push(lastItemDataSetInX.toString());
        return result;
    }else throw 'The parameter received is not a array';
}

// Check if data array in chartjs is not empty for to push into dataset object of chart 
function arrayDataSetIsNotEmpty(array){
    if(Object.prototype.toString.call(array) === '[object Array]'){
        let tmp = [];
        array.forEach(obj => {
            if(obj.y != null) tmp.push(obj)
        });
        if(tmp.length > 0) return true;
        return false;
    }else throw 'The parameter received is not a array';
}

// Check if data array in plotlyjs is not empty for to push into dataset object of chart 
function arrayDataSetIsNotEmptyDatasetPlotly(array){
    ///console.log(array)
    if(Object.prototype.toString.call(array) === '[object Array]'){
        // let tmp = [];
        // array.forEach(element =>{
        //     if(element != null) tmp.push(element);
        // });
        // if(tmp.length > 0) return true;
        // return false;
        if(array.arrayPlotlyValuesIsNull()) return false;
        return true;
    }else throw 'The parameter received is not a array';
}

//------------------------------------------------------------------------
// Get list with country Ids for the subregion selected
//------------------------------------------------------------------------
async function getCountriesIdsBySubRegion(subRegionId){
    let data = null;
    await $.get(`/api/v1/geojson/data/country-ids/by/subregion/${ subRegionId }`, function (objResult) {
        data = objResult;
    });
    if(data != "No data"){
        return new Promise((resolve, reject) => {
            resolve(data);
        });
    }else throw "Country ids not found";
}

//------------------------------------------------------------------------
// Check if element has className
//------------------------------------------------------------------------
function hasClass(elementId, classToFind){
    let classes = document.getElementById(elementId).className;
    if(classes.search(classToFind) != -1) return true;
    return false;
}

/**
 * Sets label with translated text depending of language variable
 * @param { string } labelId 
 * @type { object } geoJsonPropertie 
 */
 function administrativeLevelLabelController(labelId, geojsonProperties){
    if(window.jQuery) {
        if(locale == 'en')$(`#${ labelId }`).html(`${ geojsonProperties.country_name }`);
        else if(locale == 'es')$(`#${ labelId }`).html(`${ geojsonProperties.spanish_name }`);
        else if(locale == 'pt') $(`#${ labelId }`).html(`${ geojsonProperties.pt_name }`);
    }else throw "The web page isn't has JQuery into the libraries imports"; 
}

// Uses html2canvas library to download podium and map
function downloadElement (id_target, id, filename, map=false) {
    html2canvas(document.getElementById(id_target), map ? {allowTaint: true,
        useCORS: true} : {}).then(function (canvas) {                   
        var anchorTag = document.getElementById(id)
        anchorTag.download = filename;
        anchorTag.href = canvas.toDataURL();
        anchorTag.click();
        anchorTag.removeAttribute('download');
        anchorTag.removeAttribute('href');
    });
}

function getCountryNameTranslated(geojsonProperties){
    let str = '';
    if(locale == 'en') str = `${ geojsonProperties.country_name }`;
    else if(locale == 'es')str = `${ geojsonProperties.spanish_name }`;
    else if(locale == 'pt') str = `${ geojsonProperties.pt_name }`;
    return str;
}

Array.prototype.arrayPlotlyValuesIsNull = function (){
    return this.join().replace(/,/g,'').length === 0;
};

function getCropsNameTranslated(objectResult){
    let str = '';
    if(locale == 'en') str = `${ objectResult.producto }`;
    else if(locale == 'es')str = `${ objectResult.producto_es }`;
    else if(locale == 'pt') str = `${ objectResult.producto_pt }`;
    return str;
}

function getGeoRegionsNameTranslated(objectResult){
    let str = '';
    if(locale == 'en') str = `${ objectResult.geo_region_name }`;
    else if(locale == 'es')str = `${ objectResult.geo_region_name_es }`;
    else if(locale == 'pt') str = `${ objectResult.geo_region_name_pt }`;
    return str;
}

function activateSideBarButtons(arrayIdButtons){
    document.getElementById(arrayIdButtons[0]).style.backgroundColor = 'white';
    document.getElementById(arrayIdButtons[1]).style.backgroundColor = '#e5e5e5';
    document.getElementById(arrayIdButtons[2]).style.backgroundColor = '#e5e5e5';
}

function activateDropdownMenuQualityPostHarvestData(primaryLabel, secondaryLabel){
    let lblSideBar = document.getElementById(`${ primaryLabel }`);
    lblSideBar.style.color = '#0000009e';
    lblSideBar.style.fontWeight = 'bold';
    let secondLabel = document.getElementById(`${ secondaryLabel }`);
    secondLabel.style.color = '#a7a7a7';
    secondLabel.style.fontWeight = 'normal';
}