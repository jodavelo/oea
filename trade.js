//************************************************************************************  
// Map Settings
//************************************************************************************
mapboxgl.accessToken = 'pk.eyJ1IjoiY2lhdGttIiwiYSI6ImNraGdmbDZjejAxNTMycXBwNXppeHIyYjkifQ.Ucfm2G0KapInAojq6f9BZw';
// var mapImpactosComercio = L.map('map_impactos_produccion').setView([-6.5411393, -79.04523], 3);
// L.mapbox.styleLayer(lang_style, styleLayerOptions).addTo(mapImpactosComercio);

var mapImpactosComercio = L.map('map_impactos_comercio').setView([-6.5411393, -79.04523], 2);
L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(mapImpactosComercio);


window.data_countries_impactos_comercio = null;
window.data_countries_impactos_comercio_copy;

var impactosComercioLayer = L.geoJson().addTo(mapImpactosComercio);

// // ----------------------------------------------------------
// // Impactos produccion Color legend
// // ----------------------------------------------------------
var impacto_comercio_legend = L.control({ position: 'bottomright' });

impacto_comercio_legend.onAdd = function (calidad_map) {

    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML += `<i style="background: #ED8C95;"></i>Disminuyeron<br>`;
    div.innerHTML += `<i style="background: #f2b41c;"></i>Se mantuvieron<br>`;
    div.innerHTML += `<i style="background: #10ad87;"></i>Incrementaron<br>`;
    div.innerHTML += `<i style="background: #919293;"></i>No reportó<br>`;

    return div;
};

impacto_comercio_legend.addTo(mapImpactosComercio);

async function getDataImpactosComercio(){
    if(window.data_countries_impactos_comercio != null) return;
    //displayShow('loader');
    await (async function(){
        fetch('https://cropobs-central.alliance.cgiar.org/api/v1/covid-seccion/comercio')
            .then( response  => response.json())
            .then( data => {
                window.data_countries_impactos_comercio = data.data;
                //console.log(window.data_countries_impactos_comercio);
                let opciones = getOptionsImpactoProduccionComercioSelect(data.data.features);
                buildSelectImpactosProduccion('container-selects-impactos-comercio',opciones.elementos, 'select-elementos-comercio', 'Elementos');
                buildSelectImpactosProduccion('container-selects-impactos-comercio',opciones.categorias, 'select-categorias-comercio', 'Categorias');
                //buildSelectImpactosProduccion('container-selects-impactos-comercio',opciones.subcategorias, 'select-subcategorias-comercio', 'Subcategorias');
                // //buildSelectImpactosProduccion(opciones.impactos, 'select-impactos', 'Impactos');
                //displayHide('loader');
                listenerSelectsImpactosComercio();
                
                mapComercioColorGeneral();
                //controlCountryLayerImpactoComercio();
            } )
            .catch(err => console.log(err));
    })();
}

function controlCountryLayerImpactoComercio(){
    impactosComercioLayer.clearLayers();
    impactosComercioLayer = L.geoJson(
        window.data_countries_impactos_comercio,
        {
            style: impactoComercioCountryStyle,
            onEachFeature: countryImpactosComercioOnEachFeature
        }
    ).addTo(mapImpactosComercio);
}

function countryImpactosComercioOnEachFeature(feature, layer){
    layer.on({
        click: controlCountryImpactoComercioInfoFeature
    });
}

function controlCountryImpactoComercioInfoFeature(e){
    let properties = e.target.feature.properties;
    let objectCountryName = { 'spa_name':properties.spa_name, 'eng_name': properties.eng_name };
    const resultadoFiltros = filterDataImpactosComercio(e.target.feature.properties);
    if(resultadoFiltros == undefined){
        alert('No se encontro resultados para el elemento seleccionado.');
        return;
    }
    let divModal = document.getElementById('exampleModal');
    divModal.className = 'modal faded';
    divModal.style.display = 'none';
    removeAllChildFromContainerDiv('exampleModal');
    buildModalImpactoProduccion(objectCountryName, resultadoFiltros);
    $("#exampleModal").modal('show');

}

function impactoComercioCountryStyle(feature) {
    return {
        fillColor: getColorImpactoComercio(feature.properties.report_impact),
        weight: 1,
        color: '#666',
        opacity: 1,
        dashArray: '0',
        fillOpacity: 0.6
    };

}

function getColorImpactoComercio(d){
    return  d == 'se mantuvieron' ? '#f2b41c' : 
                d == 'disminuyeron' ? '#ED8C95' : 
                    d == 'incrementaron' ? '#10ad87' : '#919293';//'#EBAD77';
}

function listenerSelectsImpactosComercio(){
    let elemento = document.getElementById('select-elementos-comercio');
    let categoria = document.getElementById('select-categorias-comercio');
    let subcategorias = document.getElementById('select-subcategorias-comercio');
    elemento.addEventListener("change", function(){
        removeIfHaveImpactReportsForComercio();
        mapComercioColorGeneral();
    });
    categoria.addEventListener("change", function(){
        removeIfHaveImpactReportsForComercio();
        mapComercioColorGeneral();
    });
}

function mapComercioColorGeneral(){

    let valueSelectElementos = document.getElementById('select-elementos-comercio').selectedOptions[0].value;
    let impactId = document.getElementById('select-categorias-comercio').selectedOptions[0].value;
    let arrayLocal = [];
    
    window.data_countries_impactos_comercio.features.forEach(object => {
        object.properties.data.forEach(elemento => {
            if(elemento.id_element == valueSelectElementos){
                elemento.categorias.forEach(categoria => {
                    if(categoria.id_categoria == impactId){
                        categoria.subcategorias.forEach(subcategoria => {
                            object.properties.report_impact =  subcategoria.descripcion.toLowerCase();
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
    //console.log(unique);
    window.data_countries_impactos_comercio = { "type": "FeatureCollection", "features":  unique};
    controlCountryLayerImpactoComercio();
}

function filterDataImpactosComercio(dataImpactosComercio){
    let valueSelectElementos = document.getElementById('select-elementos-comercio').selectedOptions[0].value;
    let valueSelectCategorias = document.getElementById('select-categorias-comercio').selectedOptions[0].value;
    let obj;

    let elementoFiltrado = dataImpactosComercio.data.filter(function(elemento){
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
                        'impactos': categoriaFiltrada[0].subcategorias[0].impactos
                    }
                }
            }
        }

    }
    
    
    return obj;
}

function removeIfHaveImpactReportsForComercio(){
    window.data_countries_impactos_comercio.features.forEach(object => {
        if(object.properties.report_impact != undefined){
            delete object.properties.report_impact;
        };
    });
}


getDataImpactosComercio();