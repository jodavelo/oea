fetch(`locale/${get("lang")}.json`)
  .then(response => response.json())
  .then(lang => {
    console.log('Contenido del archivo JSON:', lang);
    getDataImpactosProduccion(lang)


    // // ----------------------------------------------------------
    // // Impactos produccion Color legend
    // // ----------------------------------------------------------
    var impacto_produccion_legend = L.control({ position: 'bottomright' });

    impacto_produccion_legend.onAdd = function (calidad_map) {

        var div = L.DomUtil.create('div', 'info legend');

        div.innerHTML += `<i style="background: #f2b41c;"></i>${lang.reported_impact}<br>`;
        div.innerHTML += `<i style="background: #10ad87;"></i>${lang.not_reported_impact}<br>`;

        return div;
    };

    impacto_produccion_legend.addTo(mapImpactosProduccion);
    })
//************************************************************************************  
//Impactos produccion Map Settings
//************************************************************************************
mapboxgl.accessToken = 'pk.eyJ1IjoiY2lhdGttIiwiYSI6ImNraGdmbDZjejAxNTMycXBwNXppeHIyYjkifQ.Ucfm2G0KapInAojq6f9BZw';
// var mapImpactosProduccion = L.map('map_impactos_produccion').setView([-6.5411393, -79.04523], 3);
// L.mapbox.styleLayer(lang_style, styleLayerOptions).addTo(mapImpactosProduccion);

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
 }

// console.log(get("lang"))

var locale = get("lang");

var mapImpactosProduccion = L.map('map_impactos_produccion').setView([-6.5411393, -79.04523], 2);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(mapImpactosProduccion);


window.data_countries_impactos_produccion = null;
window.data_countries_impactos_produccion_copy;

var impactosProduccionLayer = L.geoJson().addTo(mapImpactosProduccion);


async function getDataImpactosProduccion(lang){
    if(window.data_countries_impactos_produccion != null) return;
    await (async function(){  
        fetch('https://cropobs-central.ciat.cgiar.org/api/v2/flar/covid-section/production')
            .then( response  => response.json())
            .then( data => {
                window.data_countries_impactos_produccion = data.data;
                window.data_countries_impactos_produccion_copy = data.data;
                let opciones = getOptionsImpactoProduccionComercioSelect(data.data.features);
                console.log(opciones, 'opcioneeeeees')
                buildSelectImpactosProduccion('container-selects-impactos-produccion',opciones.elementos, 'select-elementos', lang.element);
                buildSelectImpactosProduccion('container-selects-impactos-produccion',opciones.categorias, 'select-categorias', lang.categories);
                buildSelectImpactosProduccion('container-selects-impactos-produccion',opciones.subcategorias, 'select-subcategorias', lang.subcategories);
                //buildSelectImpactosProduccion(opciones.impactos, 'select-impactos', 'Impactos');
                listenerSelectsImpactos();
                
                mapColorBySelectedOptions();
                //updateMapWithData();
            } )
            .catch(err => console.log(err));
    })();
}

function updateMapWithData() {
    if (mapImpactosProduccion.getSource('impactosProduccion')) {
        mapImpactosProduccion.getSource('impactosProduccion').setData(window.data_countries_impactos_produccion);
    } else {
        mapImpactosProduccion.addSource('impactosProduccion', {
            'type': 'geojson',
            'data': window.data_countries_impactos_produccion
        });

        mapImpactosProduccion.addLayer({
            'id': 'impactosProduccionLayer',
            'type': 'fill',
            'source': 'impactosProduccion',
            'paint': {
                'fill-color': ['case',
                    ['==', ['get', 'report_impact'], 'reporto'], '#f2b41c',
                    '#10ad87'
                ],
                'fill-opacity': 0.6
            }
        });
    }
}

function controlCountryLayerImpactoProduccion(){
    impactosProduccionLayer.clearLayers();
    impactosProduccionLayer = L.geoJson(
        window.data_countries_impactos_produccion,
        {
            style: impactoProduccionCountryStyle,
            onEachFeature: countryImpactosProduccionOnEachFeature
        }
    ).addTo(mapImpactosProduccion);
}

function countryImpactosProduccionOnEachFeature(feature, layer){
    layer.on({
        click: controlCountryImpactoProduccionInfoFeature
    });
}

function controlCountryImpactoProduccionInfoFeature(e){
    //console.log(e.target.feature.properties);
    let properties = e.target.feature.properties;
    let objectCountryName = { 'spa_name':properties.spa_name, 'eng_name': properties.eng_name };
    const resultadoFiltros = filterDataImpactosProduccion(e.target.feature.properties);
    if(resultadoFiltros == undefined){
        alert('No se encontro resultados para el elemento seleccionado');
        return;
    }
    let divModal = document.getElementById('exampleModal');
    divModal.className = 'modal faded';
    divModal.style.display = 'none';
    removeAllChildFromContainerDiv('exampleModal');
    buildModalImpactoProduccion(objectCountryName, resultadoFiltros);
    $("#exampleModal").modal('show');
    
}

function getColorImpactoProduccion(d){
    return  d == 'reporto' ? '#f2b41c' : '#10ad87';
}

function impactoProduccionCountryStyle(feature) {
    return {
        fillColor: getColorImpactoProduccion(feature.properties.report_impact),
        weight: 1,
        color: '#666',
        opacity: 1,
        dashArray: '0',
        fillOpacity: 0.6
    };

}

function removeIfHaveImpactReports(){
    window.data_countries_impactos_produccion.features.forEach(object => {
        if(object.properties.report_impact != undefined){
            delete object.properties.report_impact;
        };
    });
}

function listenerSelectsImpactos(){
    let categoria = document.getElementById('select-categorias');
    let subcategorias = document.getElementById('select-subcategorias');
    let elemento = document.getElementById('select-elementos');
    elemento.addEventListener("change", function(){
        removeIfHaveImpactReports();
        mapColorBySelectedOptions();
    });
    categoria.addEventListener("change", function(){
        removeIfHaveImpactReports();
        mapColorBySelectedOptions();
    });
    subcategorias.addEventListener("change", function(){
        removeIfHaveImpactReports();
        mapColorBySelectedOptions();
        
    });
}

/**
 * 
 */
function mapColorBySelectedOptions(){

    let valueSelectElementos = document.getElementById('select-elementos').selectedOptions[0].value;
    let impactId = document.getElementById('select-categorias').selectedOptions[0].value;
    let valueSelectSubcategorias = document.getElementById('select-subcategorias').selectedOptions[0].value;
    let arrayLocal = [];
    // console.log(window.data_countries_impactos_produccion)
    window.data_countries_impactos_produccion.features.forEach(obj => { 
        obj.properties.data.forEach(element => {
            if(element.id_element == valueSelectElementos){     
                element.categorias.forEach(categoria => {
                    if(categoria.id_categoria == impactId){
                        categoria.subcategorias.forEach(subcategoria => {
                            if(subcategoria.id_subcategoria == valueSelectSubcategorias){
                                obj.properties.report_impact = "reporto";
                            }
                        });
                    }
                });
            }
            arrayLocal.push(obj);
        });
    });

    //arrayLocal = removeDuplicates(arrayLocal, "properties.id_country");
    window.data_countries_impactos_produccion = arrayLocal;
    let unique = arrayLocal.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    });
    window.data_countries_impactos_produccion = { "type": "FeatureCollection", "features":  unique};

    controlCountryLayerImpactoProduccion();
}

function filterDataImpactosProduccion(dataImpactosProduccion){
    let valueSelectElementos = document.getElementById('select-elementos').selectedOptions[0].value;
    let valueSelectCategorias = document.getElementById('select-categorias').selectedOptions[0].value;
    let valueSelectSubcategorias = document.getElementById('select-subcategorias').selectedOptions[0].value;

    let obj;

    let elementoFiltrado = dataImpactosProduccion.data.filter(function(elemento){
        return elemento.id_element == valueSelectElementos;
    });
    let categoriaFiltrada;
    let subcategoriaFiltrada;
    if(elementoFiltrado.length > 0){
        categoriaFiltrada = elementoFiltrado[0].categorias.filter(categoria => {
            return categoria.id_categoria == valueSelectCategorias
        });
        if(categoriaFiltrada.length > 0){
            subcategoriaFiltrada = categoriaFiltrada[0].subcategorias.filter(subcategoria => {
                return subcategoria.id_subcategoria == valueSelectSubcategorias
            });
            if(subcategoriaFiltrada.length > 0){
                obj = {
                    'id_element': elementoFiltrado[0].id_element,
                    'descripcion': elementoFiltrado[0].descripcion,
                    'categoria' : {
                        'id_categoria': categoriaFiltrada[0].id_categoria,
                        'descripcion': categoriaFiltrada[0].descripcion,
                        'subcategoria': {
                            'id_subcategoria': subcategoriaFiltrada[0].id_subcategoria,
                            'descripcion': subcategoriaFiltrada[0].descripcion,
                            'impactos': subcategoriaFiltrada[0].impactos
                        }
                    }
                }
            }
        }

    }
    return obj;
}

