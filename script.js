// window.onload = function () {
//     //displayShow('loaderNewsCovid');
//     setTimeout(() => {
//         // displayHide('option_metodologia');
//         displayHide('option_produccion');
//         displayHide('option_comercio');
//         displayHide('option_inventario_politicas');
//         displayHide('option_perspectivas');
//         displayHide('section_politicas');
//         displayHide('section_diagnostico');
//         displayHide('section_referencias');
//         displayHide('section_precios');
//     }, 100);
//     getDataNewsCovid();
//     //getDataPoliticalInstitucions();
//     //createCardsPoliticalsInstitucions();
//     //getDataImpactosProduccion();
//     //getDataImpactosComercio();
    
// };

window.covid_news_array = null;
window.jsonData = [];
async function getDataNewsCovid(){
    //displayShow('loader');
    await(async function(){
        fetch('/api/v1/covid-seccion/noticias').then(function(response){
            return response.json();
        }).then( function(data){
            data.sort(function(a, b){
                var c = new Date(a.date);
                var d = new Date(b.date);
                return d-c;
             });
            
            cardsAppendData(data);
            jsonData = data; 
        } ).catch(function(err){
            console.log(err);
        });
    })();
}

function cardsAppendData(data){
    let arrayDataCountryAndId = [];
    let mainContainer = document.getElementById('cards');
    for (let idx = 0; idx < data.length; idx++) {
        let divBlog = document.createElement('div');
        let meta = document.createElement('div');
        let photo = document.createElement('img');
        let description = document.createElement('div');
        let divContainerDate = document.createElement('div');
        let spanDate = document.createElement('span');
        let h3HeadLine = document.createElement('h4');
        let pDescription = document.createElement('p');
        let pReadMore = document.createElement('p');
        let aReadMore = document.createElement('a');
             
        aReadMore.innerText = 'Read More';
        aReadMore.href = `${data[idx].url}`;
        pReadMore.className = 'read-more';
        pDescription.innerText = data[idx].news_description;
        spanDate.innerText = data[idx].date;
        spanDate.id = `fecha-${data[idx].id_country}`;
        h3HeadLine.innerText = data[idx].news_headline;
        divContainerDate.className = 'container-date-icon';
        description.className = 'description';
        photo.className = 'photo';
        photo.style.width = '100%';
        //photo.style.backgroundImage = "url('"+data[idx].image_url+"')";
        photo.src = data[idx].image_url;
        photo.onerror = () => {
            photo.src = "https://agriculturers.com/wp-content/uploads/2015/04/La-autoridad-a.jpg";
        }
        meta.className = 'meta';
        divBlog.className = `blog-card card-${data[idx].id_country} show`;
        //divBlog.id = `card-${data[idx].id_country}`;

        pReadMore.appendChild(aReadMore);
        divContainerDate.appendChild(spanDate);
        description.appendChild(divContainerDate);
        description.appendChild(h3HeadLine);
        description.appendChild(pDescription);
        description.appendChild(pReadMore);
        meta.appendChild(photo);
        divBlog.appendChild(meta);
        divBlog.appendChild(description);
        mainContainer.appendChild(divBlog);
        if(data[idx].id_country == 'region'){
            arrayDataCountryAndId.push(
                { 'id': data[idx].id_country,  'country_name': 'Region' }
            );
        }else{
            arrayDataCountryAndId.push(
                { 'id': data[idx].id_country,  'country_name': data[idx].spa_name }
            );
        }
    }
    createSelectCountryElement(arrayDataCountryAndId);
    //displayHide('loaderNewsCovid');
}

function createSelectCountryElement(arrayData){
    var uniqueArray = removeDuplicates(arrayData, "id");
    let selectContainer = document.getElementById('filters');
    let selectCountry = document.createElement('select');
    let labelSelect = document.createElement('label');
    labelSelect.htmlFor = 'selectCountry';
    labelSelect.innerText = 'Filtrar por pais';
    selectCountry.setAttribute("id", "selectCountry");
    selectCountry.onchange = function(){
        let x = document.getElementById('selectCountry').value;
        ///console.log(x);
        if(x == 'all'){
            $('#cards > div').fadeIn(450);
        } else {
            let $el = $('.card-' + x).fadeIn(450);
            $('#cards > div').not($el).hide();
        }
    }
    selectCountry.className = 'form-control';
    selectContainer.appendChild(labelSelect);
    selectContainer.appendChild(selectCountry);
    let optionAll = document.createElement('option');
    optionAll.setAttribute("value", `all`);
    let textAll = document.createTextNode(`Todas`);
    optionAll.appendChild(textAll);
    document.getElementById("selectCountry").appendChild(optionAll);
    for (let idx = 0; idx < uniqueArray.length; idx++) {
        let optionCountry = document.createElement('option');
        optionCountry.setAttribute("value", `${uniqueArray[idx].id}`);
        let textCountry = document.createTextNode(`${uniqueArray[idx].country_name}`);
        optionCountry.appendChild(textCountry);
        document.getElementById("selectCountry").appendChild(optionCountry);
        selectContainer.appendChild(selectCountry);
    }

    // let $el = $('.32').fadeIn(450);
    // $('#cards > div').not($el).hide();
    
}
/**
 * @param originalArray => es un array con n datos
 * @param prop => key que hará match con cada elemento del array
 * Elimina los elementos duplicados de un array
 * @returns newArray
 */
function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}

$('#datefilterfrom').on("change", filterByDate);
$('#datefilterto').on("change", filterByDate);

function filterByDate(){

    let from = $('#datefilterfrom').val();
    let to = $('#datefilterto').val();
    if (!from && !to) { // no value for from and to
    return;
    }
    else if(!from) return;
    else if(!to) return;
    //console.log(from, to);
    let result = window.jsonData.filter(function(obj){
        return obj.date >= from && obj.date <= to;
    });
    removeAllChildFromContainerDiv('cards');
    removeAllChildFromContainerDiv('filters');
    cardsAppendData(result);
    //console.log(result);
    
  }

/**
 * Busca el elemento por el id y elimina todos los nodos 
 * hijos de dicho elemento
 * @param id, es el id del div container  
 * @returns void
 */
function removeAllChildFromContainerDiv(id){
    let container = document.getElementById(`${id}`);  
    // Create the Range object
    var rangeObj = new Range();
    // Select all of theParent's children
    rangeObj.selectNodeContents(container);
    // Delete everything that is selected
    rangeObj.deleteContents();
}


/**
 * 
 * @param {*} originalData: contiene un arreglo con todos los objetos para todos los paises
 * @returns cuatro objetos, cada objeto contiene un array de objetos, donde cada objecto
 *  cuenta con la estructura {id:.., text:..}  
 */
function getOptionsImpactoProduccionComercioSelect(originalData){
    let elementos = [];
    let categorias = [];
    let subcategorias = [];
    let impactos = [];
    //elementos.push({"id": 'no-seleccion', "text": 'Seleccione una opción'});
    originalData.forEach(object => {
        object.properties.data.forEach(elementObject => {
            elementos.push({
                "id": elementObject.id_element,
                "text": elementObject.descripcion
            });
            elementObject.categorias.forEach(categoryObject => {
                categorias.push({
                    "id": categoryObject.id_categoria,
                    "text": categoryObject.descripcion
                });
                categoryObject.subcategorias.forEach(subcategoryObject => {
                    //console.log(subcategoryObject);
                    subcategorias.push({
                        "id": subcategoryObject.id_subcategoria,
                        "text": subcategoryObject.descripcion
                    });
                    subcategoryObject.impactos.forEach(impactObject => {
                        impactos.push({
                            "id": impactObject.id_impacto,
                            "text": impactObject.impacto
                        });
                    });
                });
            });
        });
    });
    elementos = removeDuplicates(elementos, "id"); 
    categorias = removeDuplicates(categorias, "id");
    subcategorias = removeDuplicates(subcategorias, "id");
    impactos = removeDuplicates(impactos, "id");
    return {"elementos":elementos, "categorias":categorias, "subcategorias":subcategorias, "impactos":impactos};
}


/**
 * @param arrayItems => contiene un array de objetos con la estructura de 
 *  cada objeto de la siguiente manera: {id:.., text:...}
 * @param selectId  => nombre que se asignara como id del select
 * @param selectLabel => texto que se mostrara en el label del select
 * Construira el elemento select con sus opciones y se insertara
 * dentro del contenedor padre
 */
function buildSelectImpactosProduccion(idContainerSelect, arrayItems, selectId, selectLabel){
    let containerDiv = document.getElementById(`${idContainerSelect}`);
    //let containerDiv = document.getElementById(`container-selects-impactos-produccion`);
    
    let divCol = document.createElement('div');
    divCol.className = 'col-4';
    let divFormGroup = document.createElement('div');
    divFormGroup.className = 'form-group';

    let labelSelect = document.createElement('label');
    labelSelect.setAttribute('for', `${selectId}`);
    labelSelect.innerText = `${selectLabel}`;

    let selectList = document.createElement('select');
    selectList.id = selectId;
    selectList.style.width = '100%';
    for (let idx = 0; idx < arrayItems.length; idx++) {
        let option = document.createElement('option');
        option.value = arrayItems[idx].id;
        option.text = arrayItems[idx].text;
        selectList.appendChild(option);
    }

    divFormGroup.appendChild(labelSelect);
    divFormGroup.appendChild(selectList);
    divCol.appendChild(divFormGroup);
    containerDiv.appendChild(divCol);
}

function buildModalImpactoProduccion(objectCountryName, filteredData){
    
    let objectRefCategory = filteredData.categoria;
    let impacts = objectRefCategory.subcategoria.impactos;
    impacts = removeDuplicates(impacts, "id_impacto");
    //console.log(objectRefCategory.subcategoria.impactos);

    const fecha = impacts[0].fecha_impacto;
    const res = fecha.split("-")
    const year = res[0];
    let month = res[1] -1;

    const date = new Date(year, month);  // yyyy-mm-dd
    month = date.toLocaleString('es-mx', { month: 'long' });

    // Modal main container
    let divModal = document.getElementById('exampleModal');

    let divModalDialog = document.createElement('div');
    divModalDialog.className = 'modal-dialog modal-lg';

    // modal content
    let divModalContent = document.createElement('div');
    divModalContent.className = 'modal-content';

    // Modal header
    let divModalHeader = document.createElement('div');
    divModalHeader.className = 'modal-header d-block';
    let divSubModalHeader = document.createElement('div');
    divSubModalHeader.className = 'd-flex';
    let modalTitle = document.createElement('h4');
    modalTitle.className = 'modal-title';
    modalTitle.innerText = `Impactos para ${objectCountryName.spa_name}`;
    divSubModalHeader.appendChild(modalTitle);
    let dismissButton = document.createElement('button');
    dismissButton.type = 'button';
    dismissButton.className = 'close';
    dismissButton.setAttribute('data-dismiss', 'modal');
    dismissButton.innerHTML = "&times;";
    divSubModalHeader.appendChild(dismissButton);
    let reportDate = document.createElement('h5');
    reportDate.className = 'modal-title';
    reportDate.innerText = `Reporte ${month} ${year}`;
    divModalHeader.appendChild(divSubModalHeader);
    divModalHeader.appendChild(reportDate);

    // Modal body
    let divModalBody = document.createElement('div');
    divModalBody.className = 'modal-body';
    let h4ElementTitle = document.createElement('h4');
    h4ElementTitle.innerText = `${filteredData.descripcion} `;
    h4ElementTitle.style.display = 'inline';
    let h5CategoryTitle = document.createElement('h5');
    h5CategoryTitle.innerText = `> ${objectRefCategory.descripcion}`;
    h5CategoryTitle.style.display = 'inline';
    let h6SubcategoryTitle = document.createElement('h6');
    h6SubcategoryTitle.innerText = ` > ${objectRefCategory.subcategoria.descripcion}`;
    h6SubcategoryTitle.style.display = 'inline';
    let ulImpacts = document.createElement('ul');
    impacts.forEach(impact => {
        let liImpact = document.createElement('li');
        liImpact.innerText = `${impact.impacto}`;
        ulImpacts.appendChild(liImpact);
    });
    divModalBody.appendChild(h4ElementTitle);
    divModalBody.appendChild(h5CategoryTitle);
    divModalBody.appendChild(h6SubcategoryTitle);
    divModalBody.appendChild(ulImpacts);

    // Modal footer
    let divModalFooter = document.createElement('div');
    divModalFooter.className = 'modal-footer'
    let btnClose = document.createElement('button');
    btnClose.type = 'button';
    btnClose.className = 'btn btn-default';
    btnClose.setAttribute('data-dismiss', 'modal');
    btnClose.innerText = 'Cerrar';
    divModalFooter.appendChild(btnClose);

    divModalContent.appendChild(divModalHeader);
    divModalContent.appendChild(divModalBody);
    divModalContent.appendChild(divModalFooter);

    divModalDialog.appendChild(divModalContent);
    divModal.appendChild(divModalDialog);
}

function getColorCountriesCovidSeccion(d){
    return  d == 'Andina' ? '#f2b41c' :
            d == 'Cono sur' ? '#008aa0' :
            d == 'Centro América y Caribe' ? '#10ad87' :
                     '#A2FA70';
}