//------------------------------------------------------------------------------------  
//Instituciones Map Settings
//------------------------------------------------------------------------------------
var mapInstituciones = L.map('map_instituciones').setView([-6.5411393, -79.04523], 3);
L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
}).addTo(mapInstituciones);

window.countries_institucions_geojson = null;
var politicalInstitucionsLayer = L.geoJson().addTo(mapInstituciones);

function getDataPoliticalInstitucions(){
    if(window.countries_institucions_geojson != null) return;
    $.get('https://cropobs-central.alliance.cgiar.org/api/v1/covid-seccion/encuestas-recolectadas', data => {
        //console.log(data);
        window.countries_institucions_geojson = data.data;
        controlCountryPoliticalInstitucionsLayer();
        //controlCountryDiagnostico();
    });
}

function controlCountryPoliticalInstitucionsLayer(){
    politicalInstitucionsLayer.clearLayers();
    politicalInstitucionsLayer = L.geoJson(
        window.countries_institucions_geojson,
        {
            style: politicalInstitucionsCountryStyle,
            onEachFeature: countryInstitucionsOnEachFeature
        }
    ).addTo(mapInstituciones);
}

function countryInstitucionsOnEachFeature(feature, layer){
    layer.on({
        click: controlCountryInstitucionsInfoFeature
    });
}

window.id_country_instituciones = null;
function controlCountryInstitucionsInfoFeature(e){
    let objectRef = e.target.feature.properties;
    window.idCountryPoliticalInstitucions = objectRef.id_country;
    createCardsPoliticalsInstitucions();
    //console.log(objectRef);
    window.id_country_instituciones = objectRef.id_country;
    mapInstituciones.setView([objectRef.latitude, objectRef.longitude], 5);
    // title = `${ window.prod_country_name }: ${ window.prod_region_name != null ? window.prod_region_name + ', ' :  '' }${ window.prod_admin2_name }`;
    // $('#title_produccion').html(`<i class="fa fa-undo" onclick="backToLevelProd();"></i> ${ title }`);
    let title =  objectRef.esp_name;
    $('#title_produccion').html(`<i class="fa fa-undo" "></i> ${ title }`);
    //createCardsPoliticalsInstitucions(objectRef.political_institucions);
    controlCountryPoliticalInstitucionsLayer();
}

function politicalInstitucionsCountryStyle(feature) {
    //console.log(window.id_country_instituciones, feature.properties.id_country);
    if(window.id_country_instituciones != null && feature.properties.id_country == window.id_country_instituciones){
        return {
            fillColor: getColorCountriesCovidSeccion(feature.properties.region),
            weight: 2,
            opacity: 1,
            color: '#666',
            dashArray: '0',
            fillOpacity: 0.6
        };    
    }
    return {
        fillColor: getColorCountriesCovidSeccion(feature.properties.region),
        weight: 0,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.6
    };

}


function createCardsPoliticalsInstitucions(){
    let request = '';
    let array = [];
    if(window.idCountryPoliticalInstitucions != null){
        request = `?id_country=${window.idCountryPoliticalInstitucions}`;
    }
    $.get(`https://cropobs-central.alliance.cgiar.org/api/v1/covid-seccion/instituciones-politicas${request}`, response => {
        //console.log(response.data);
        array = response.data;
        
        let container = document.getElementById('cardsPoliticalsI');  

        // Create the Range object
        var rangeObj = new Range();
    
        // Select all of theParent's children
        rangeObj.selectNodeContents(container);
    
        // Delete everything that is selected
        rangeObj.deleteContents();
        ///console.log(array);
        for (let idx = 0; idx < array.length; idx++) {
        
            let html = `<div class="col-lg-4 col-6">
                <div class="card border ">
                    <div class="card-body p-b-0 text-center">
                    ${ array[idx].logo_url != null ? `<img src="${ array[idx].logo_url }" alt="${ array[idx].resource }" onerror="this.src='https://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png';" style="max-height: 200px; max-width: 90%" />` : '' }
                    </div>
                    <div class="card-body p-t-0 text-center"><hr>
                        <a href="${array[idx].url}" target="_blank" class="flar-green">${ array[idx].resource }</a>
                    </div>
                </div>
            </div>`;
            $('#cardsPoliticalsI').append(html);

            // let divCardInstitucionPolitica = document.createElement('div');
            // divCardInstitucionPolitica.className = 'container-political-institucion';
            // //divCardInstitucionPolitica.style = 'display: flex; flex-flow: column wrap;'
            // divCardInstitucionPolitica.style.marginTop = '100px';
            // divCardInstitucionPolitica.style.paddingLeft = '10px';
            // divCardInstitucionPolitica.style.paddingRight = '10px';
            // divCardInstitucionPolitica.style.width = '100%';
            // //divCardInstitucionPolitica.style.height = '300px';    
    
            // let imgInstitucionPolitica = document.createElement('img');
            // imgInstitucionPolitica.id = 'img-institucion-politica-'+idx;
            // imgInstitucionPolitica.className= 'img-institucion-politica';
            // imgInstitucionPolitica.style.width = '100%';
            // imgInstitucionPolitica.style.height = '100%';
            // imgInstitucionPolitica.src = `${array[idx].logo_url}`;
            // //imgInstitucionPolitica.src = `https://agriculturers.com/wp-content/uploads/2015/04/La-autoridad-a.jpg`;
            // imgInstitucionPolitica.onerror = _ => {
            //     imgInstitucionPolitica.src = "https://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png";
            // };
            // imgInstitucionPolitica.alt = `Logo ${array[idx].resource}`;
    
            // let aLink = document.createElement('a');
            // aLink.target = '_blank';
            // aLink.href = `${array[idx].url}`;
            // let linkSpan = document.createElement('span');
            // linkSpan.innerText = `${array[idx].resource}`;
            // linkSpan.className = 'style-text-political-institucion';
            
            
            // aLink.appendChild(linkSpan);
            // divCardInstitucionPolitica.appendChild(imgInstitucionPolitica);
            // divCardInstitucionPolitica.appendChild(aLink);
            // container.appendChild(divCardInstitucionPolitica);

        }
    });
}

function resetHighLevelPoliticalInstitucions(){
    createCardsPoliticalsInstitucions();
    mapInstituciones.setView([-6.5411393, -79.04523], 3);
    $('#title_produccion').html(`América Latina y el Caribe`);
    window.id_country_instituciones = null;
    controlCountryPoliticalInstitucionsLayer();
}

function resetNewsFilter(){
    //console.log(window.jsonData.length);
    document.getElementById('datefilterfrom').value = '';
    document.getElementById('datefilterto').value = '';
    removeAllChildFromContainerDiv('cards');
    removeAllChildFromContainerDiv('filters');
    cardsAppendData(window.jsonData);
}

getDataPoliticalInstitucions();
createCardsPoliticalsInstitucions()