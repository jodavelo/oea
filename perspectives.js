//************************************************************************************  
//Impactos perspectivas Map Settings
//************************************************************************************
var mapImpactosPerspectivas = L.map('map_impactos_perspectivas').setView([-6.5411393, -79.04523], 2);
L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(mapImpactosPerspectivas);

window.data_countries_impactos_perspectivas = null;
var impactosPerspetivasLayer = L.geoJson().addTo(mapImpactosPerspectivas);

// ----------------------------------------------------------
// Perspectivas map Color legend
// ----------------------------------------------------------
var impacto_perspectivas_legend = L.control({ position: 'bottomright' });

impacto_perspectivas_legend.onAdd = function (calidad_map) {

    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML += `<i style="background: #ED8C95;"></i>Disminuirá<br>`;
    div.innerHTML += `<i style="background: #f2b41c;"></i>Mantendrá<br>`;
    div.innerHTML += `<i style="background: #10ad87;"></i>Incrementará<br>`;
    div.innerHTML += `<i style="background: #919293;"></i>No reportó<br>`;

    return div;
};

impacto_perspectivas_legend.addTo(mapImpactosPerspectivas);

async function getDataPerspectivas(){
    if(window.data_countries_impactos_perspectivas != null) return;
    //displayShow('loader');
    await (async function(){
        fetch('https://cropobs-central.alliance.cgiar.org/api/v1/covid-seccion/perspectivas')
            .then( response  => response.json())
            .then( data => {
                window.data_countries_impactos_perspectivas = data.data;
                let opciones = getOptionsImpactoPerspectivasSelect(data.data.features);
                buildSelectImpactosProduccion('container-selects-impactos-perspectivas',opciones.elementos, 'select-elementos-perspectivas', 'Elementos');
                buildSelectImpactosProduccion('container-selects-impactos-perspectivas',opciones.categorias, 'select-categorias-perspectivas', 'Categorias');
                //displayHide('loader');
                listenerSelectsPerspectivas();
                mapColorPerspectivas();
                //controlCountryLayerPerspectivas();
            } )
            .catch(err => console.log(err)
        );
    })();
}


function controlCountryLayerPerspectivas(){
    impactosPerspetivasLayer.clearLayers();
    impactosPerspetivasLayer = L.geoJson(
        window.data_countries_impactos_perspectivas,
        {
            style: impactoPerspectivasCountryStyle,
            onEachFeature: countryImpactosPerspectivasOnEachFeature
        }
    ).addTo(mapImpactosPerspectivas);
}

function countryImpactosPerspectivasOnEachFeature(feature, layer){
    layer.on({
        click: controlCountryImpactoPerspectivasInfoFeature
    });
}

function controlCountryImpactoPerspectivasInfoFeature(e){
    let properties = e.target.feature.properties;
    let objectCountryName = { 'spa_name':properties.spa_name, 'eng_name': properties.eng_name };
    const resultadoFiltros = filterDataImpactosPerspectivas(e.target.feature.properties);
    if(resultadoFiltros == undefined){
        alert('No se encontro resultados para el elemento seleccionado');
        return;
    }
    let divModal = document.getElementById('exampleModal');
    divModal.className = 'modal faded';
    divModal.style.display = 'none';
    removeAllChildFromContainerDiv('exampleModal');
    buildModalImpactoPerspectivas(objectCountryName, resultadoFiltros);
    $("#exampleModal").modal('show');
    
}

function impactoPerspectivasCountryStyle(feature) {
    return {
        fillColor: getColorPerspectivas(feature.properties.report_impact),
        weight: 1,
        color: '#666',
        opacity: 1,
        dashArray: '0',
        fillOpacity: 0.6
    };

}

function getColorPerspectivas(d){
    return  d == 'mantendra' ? '#f2b41c' : 
                d == 'disminuira' ? '#ED8C95' : 
                    d == 'incrementara' ? '#10ad87' : '#919293';//'#EBAD77';
}

function listenerSelectsPerspectivas(){
    let elemento = document.getElementById('select-elementos-perspectivas');
    let categoria = document.getElementById('select-categorias-perspectivas');
    
    elemento.addEventListener("change", function(){
        removeIfHaveImpactReportsForPerspectivas();
        mapColorPerspectivas();
    });
    categoria.addEventListener("change", function(){
        removeIfHaveImpactReportsForPerspectivas();
        mapColorPerspectivas();
    });
}

function getOptionsImpactoPerspectivasSelect(originalData){
    let elementos = [];
    let categorias = [];
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
            });
        });
    });
    elementos = removeDuplicates(elementos, "id"); 
    categorias = removeDuplicates(categorias, "id");
    return {"elementos":elementos, "categorias":categorias};
}

function filterDataImpactosPerspectivas(dataImpactosPerspectivas){
    let valueSelectElementos = document.getElementById('select-elementos-perspectivas').selectedOptions[0].value;
    let valueSelectCategorias = document.getElementById('select-categorias-perspectivas').selectedOptions[0].value;
    let obj;

    let elementoFiltrado = dataImpactosPerspectivas.data.filter(function(elemento){
        return elemento.id_element == valueSelectElementos;
    });
    let categoriaFiltrada;
    if(elementoFiltrado.length > 0){
        categoriaFiltrada = elementoFiltrado[0].categorias.filter(categoria => {
            return categoria.id_categoria == valueSelectCategorias
        });
        if(categoriaFiltrada.length > 0){
            obj = {
                'id_element': elementoFiltrado[0].id_element,
                'descripcion': elementoFiltrado[0].descripcion,
                'categoria' : {
                    'id_categoria': categoriaFiltrada[0].id_categoria,
                    'descripcion': categoriaFiltrada[0].descripcion,
                    'subcategoria': {
                        'id_subcategoria': categoriaFiltrada[0].subcategorias[0].id_subcategoria,
                        'descripcion': categoriaFiltrada[0].subcategorias[0].descripcion,
                        'fecha': categoriaFiltrada[0].subcategorias[0].fecha_impacto
                    }
                }
            }
        }

    }
    return obj;
}

function removeIfHaveImpactReportsForPerspectivas(){
    window.data_countries_impactos_perspectivas.features.forEach(object => {
        if(object.properties.report_impact != undefined){
            delete object.properties.report_impact;
        };
    });
}

function buildModalImpactoPerspectivas(objectCountryName, filteredData){
    
    let objectRefCategory = filteredData.categoria;
    // let subcategoria = objectRefCategory.subcategoria;

    const fecha = objectRefCategory.subcategoria.fecha;
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
    modalTitle.innerText = `Perspectiva(s) para ${objectCountryName.spa_name}`;
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
    let h4ElementTitle = document.createElement('h5');
    h4ElementTitle.innerText = `${filteredData.descripcion} `;
    h4ElementTitle.style.display = 'inline';
    let h5CategoryTitle = document.createElement('h5');
    h5CategoryTitle.innerText = `> ${objectRefCategory.descripcion}`;
    h5CategoryTitle.style.display = 'inline';
    let h6SubcategoryTitle = document.createElement('h5');
    h6SubcategoryTitle.innerText = ` > ${objectRefCategory.subcategoria.descripcion}`;
    h6SubcategoryTitle.style.display = 'inline';
    divModalBody.appendChild(h4ElementTitle);
    divModalBody.appendChild(h5CategoryTitle);
    divModalBody.appendChild(h6SubcategoryTitle);

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

function mapColorPerspectivas(){

    let valueSelectElementos = document.getElementById('select-elementos-perspectivas').selectedOptions[0].value;
    let impactId = document.getElementById('select-categorias-perspectivas').selectedOptions[0].value;
    let arrayLocal = [];
    
    window.data_countries_impactos_perspectivas.features.forEach(object => {
        object.properties.data.forEach(elemento => {
            if(elemento.id_element == valueSelectElementos){
                elemento.categorias.forEach(categoria => {
                    if(categoria.id_categoria == impactId){
                        categoria.subcategorias.forEach(subcategoria => {
                            object.properties.report_impact =  removeAccentsInString(subcategoria.descripcion.toLowerCase());
                        });
                    }
                });
            }
            arrayLocal.push(object);
        });
    });
    
    let unique = arrayLocal.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    });

    window.data_countries_impactos_perspectivas = { "type": "FeatureCollection", "features":  unique};
    controlCountryLayerPerspectivas();
}

function removeAccentsInString(str){ 
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

getDataPerspectivas()

