//************************************************************************************  
//Impactos produccion Map Settings
//************************************************************************************
var mapImpactosProduccion = L.map('map_impactos_produccion').setView([-6.5411393, -79.04523], 3);
L.mapbox.styleLayer(lang_style, styleLayerOptions).addTo(mapImpactosProduccion);

window.data_countries_impactos_produccion = null;
window.data_countries_impactos_produccion_copy;
var impactosProduccionLayer = L.geoJson().addTo(mapImpactosProduccion);

// ----------------------------------------------------------
// Impactos produccion Color legend
// ----------------------------------------------------------
var impacto_produccion_legend = L.control({ position: 'bottomright' });

impacto_produccion_legend.onAdd = function (calidad_map) {

    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML += `<i style="background: #f2b41c;"></i>Reportó impactos<br>`;
    div.innerHTML += `<i style="background: #10ad87;"></i>No reportó impacto<br>`;

    return div;
};

impacto_produccion_legend.addTo(mapImpactosProduccion);

async function getDataImpactosProduccion(){
    alert('alabajkkja')
    if(window.data_countries_impactos_produccion != null) return;
    await (async function(){  
        fetch('https://cropobs-central.alliance.cgiar.org/api/v2/flar/covid-section/production')
            .then( response  => response.json())
            .then( data => {
                window.data_countries_impactos_produccion = data;
                window.data_countries_impactos_produccion_copy = data;
                console.log(data)
                // let opciones = getOptionsImpactoProduccionComercioSelect(data.features);
                // buildSelectImpactosProduccion('container-selects-impactos-produccion',opciones.elementos, 'select-elementos', 'Elementos');
                // buildSelectImpactosProduccion('container-selects-impactos-produccion',opciones.categorias, 'select-categorias', 'Categorias');
                // buildSelectImpactosProduccion('container-selects-impactos-produccion',opciones.subcategorias, 'select-subcategorias', 'Subcategorias');
                // //buildSelectImpactosProduccion(opciones.impactos, 'select-impactos', 'Impactos');
                // displayHide('loader');
                // listenerSelectsImpactos();
                
                // mapColorBySelectedOptions();
                //controlCountryLayerImpactoProduccion();
            } )
            .catch(err => console.log(err));
    })();
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

getDataImpactosProduccion()