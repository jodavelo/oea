//************************************************************************************  
//Political Map Settings
//************************************************************************************
// var politicalMap = L.map('map_politicas').setView([-6.5411393, -79.04523], 3);
// L.mapbox.styleLayer(lang_style, styleLayerOptions).addTo(politicalMap);

var politicalMap = L.map('map_politicas').setView([-6.5411393, -79.04523], 3);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(politicalMap);

window.countries_covid_seccion = null;
var politicalLayer = L.geoJson().addTo(politicalMap);

window.political_id_country = null;
window.political_id_region = null;

// ----------------------------------------------------------
// Color legend
// ----------------------------------------------------------
var political_legend = L.control({ position: 'bottomright' });

political_legend.onAdd = function (politicalMap) {

    var div = L.DomUtil.create('div', 'info legend');
    for (var i = 1; i < 4; i++) {
        div.innerHTML += `<i style="background:${clustersInfo[i].color}"></i><a href="#" onclick="window.political_id_region=${i};">${clustersInfo[i].label}</a><br>`;
    }

    return div;
};

political_legend.addTo(politicalMap);

async function getCountriesCovidSeccion() {
    if (window.countries_covid_seccion != null) return;
    //displayShow('loader');
    await (async function () {
        fetch('https://cropobs-central.alliance.cgiar.org/api/v1/covid-seccion/countries').then(function (response) {
            return response.json();
        }).then(function (data) {
            window.countries_covid_seccion = data.data;
            controlCountryLayerPoliticals();
            console.log(data);
            //displayHide('loader');
        }).catch(function (err) {
            console.log(err);
        });
    })();
}

// ***********************************************************************************
//  Map Country controller
// ***********************************************************************************
function controlCountryLayerPoliticals() {
    politicalLayer.clearLayers();
    politicalLayer = L.geoJson(
        window.countries_covid_seccion,
        {
            style: politicalCountryStyle,
            onEachFeature: countryPoliticalOnEachFeature
        }
    ).addTo(politicalMap);
}

function countryPoliticalOnEachFeature(feature, layer) {
    layer.on({
        click: controlCountryPoliticalInfoFeature
    });
}

function controlCountryPoliticalInfoFeature(e) {
    //console.log(e.target.feature.properties);
    let properties = e.target.feature.properties;
    window.political_id_country = properties.id_country;
    removeAllChildFromContainerDiv('politicals_table_container');
    //console.log(properties);
    dataTablePoliticalController(`?id_country=${properties.id_country}`);
    let title = document.getElementById('title_politicals');
    title.innerHTML = `${properties.esp_name}`;
    let btnBack = document.getElementById('back_political_sc_level');
    btnBack.style.display = 'inline';
    politicalMap.setView([e.target.feature.properties.latitude, e.target.feature.properties.longitude], 5);
    controlCountryLayerPoliticals();
    //console.log(e.target.feature.properties.latitude);
}

function politicalCountryStyle(feature) {
    if (window.political_id_country != null && window.political_id_country == feature.properties.id_country) {
        return {
            fillColor: getColorCountriesCovidSeccion(feature.properties.region),
            weight: 2,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.6
        }
    } else if (window.political_id_country == null && window.political_id_region != null && feature.properties.id_region == window.political_id_region) {
        return {
            fillColor: clustersInfo[feature.properties.id_region].color,
            weight: 2,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.6
        }
    }
    return {
        fillColor: getColorCountriesCovidSeccion(feature.properties.region),
        weight: 0,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.6
    };
    // return {
    //     fillColor: getColorCountriesCovidSeccion(feature.properties.region),
    //     weight: 0,
    //     opacity: 1,
    //     color: 'white',
    //     dashArray: '3',
    //     fillOpacity: 0.6
    // };
}

// ***********************************************************************************
// Data table controller
// ***********************************************************************************
async function dataTablePoliticalController(request) {

    await (async function () {
        fetch('https://cropobs-central.alliance.cgiar.org/api/v1/covid-seccion/politicas').then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data.data)
            let container = document.getElementById('politicals_table_container');
            let table = document.createElement('table');
            table.className = 'table table-hover';
            let tHead = document.createElement('thead');
            let tr = document.createElement('tr');
            let thMedida = document.createElement('th');
            thMedida.setAttribute('scope', 'col');
            thMedida.innerText = 'Medida';
            let thDescripcion = document.createElement('th');
            thDescripcion.setAttribute('scope', 'col');
            thDescripcion.innerText = 'Descripcion';
            let thEnfoques = document.createElement('th');
            thEnfoques.setAttribute('scope', 'col');
            thEnfoques.innerText = 'Enfoques';
            let thUrl = document.createElement('th');
            thUrl.setAttribute('scope', 'col');
            thUrl.innerText = 'Url';

            let tBody = document.createElement('tbody');
            for (let idx = 0; idx < data.data.length; idx++) {
                let trBody = document.createElement('tr');
                let tdMedida = document.createElement('td');
                tdMedida.innerHTML = data.data[idx].medida;
                let tdDescripcion = document.createElement('td');
                tdDescripcion.innerHTML = data.data[idx].descripcion;
                let tdEnfoques = document.createElement('td');
                let ulEnfoques = document.createElement('ul');
                for (let idx2 = 0; idx2 < data.data[idx].enfoques.length; idx2++) {
                    let liEnfoque = document.createElement('li');
                    liEnfoque.innerHTML = `${data.data[idx].enfoques[idx2].enfoque}, ${data.data[idx].enfoques[idx2].tipo}`;
                    ulEnfoques.appendChild(liEnfoque);
                }
                tdEnfoques.appendChild(ulEnfoques);
                let tdUrl = document.createElement('td');
                let aUrl = document.createElement('a');
                aUrl.setAttribute('data-toggle', 'tooltip');
                aUrl.setAttribute('data-original-title', "@lang('View more')");
                aUrl.setAttribute('data-toggle', 'tooltip');
                aUrl.href = `${data.data[idx].url}`;
                aUrl.target = '_blank';
                let tagI = document.createElement('i');
                tagI.className = 'fa fa-eye text-inverse m-r-10';
                aUrl.appendChild(tagI);
                tdUrl.appendChild(aUrl);
                trBody.appendChild(tdMedida);
                trBody.appendChild(tdDescripcion);
                trBody.appendChild(tdEnfoques);
                trBody.appendChild(tdUrl);
                tBody.appendChild(trBody);
            }

            tr.appendChild(thMedida);
            tr.appendChild(thDescripcion);
            tr.appendChild(thEnfoques);
            tr.appendChild(thUrl);

            tHead.appendChild(tr);
            table.appendChild(tHead);
            table.appendChild(tBody);
            container.appendChild(table);
        }).catch(function (err) {
            console.log(err);
        });
    })();

    // console.log('https://cropobs-central.alliance.cgiar.org/api/v1/covid-seccion/politicas/' + request);
    // //displayShow('loader');
    // $.get('https://cropobs-central.alliance.cgiar.org/api/v1/covid-seccion/politicas/' + request, function (res) {
    //     console.log(res.data);
    //     if (window.countries_covid_seccion != null) {
    //         //displayHide('loader');
    //     }
    //     let container = document.getElementById('politicals_table_container');
    //     let table = document.createElement('table');
    //     table.className = 'table table-hover';
    //     let tHead = document.createElement('thead');
    //     let tr = document.createElement('tr');
    //     let thMedida = document.createElement('th');
    //     thMedida.setAttribute('scope', 'col');
    //     thMedida.innerText = 'Medida';
    //     let thDescripcion = document.createElement('th');
    //     thDescripcion.setAttribute('scope', 'col');
    //     thDescripcion.innerText = 'Descripcion';
    //     let thEnfoques = document.createElement('th');
    //     thEnfoques.setAttribute('scope', 'col');
    //     thEnfoques.innerText = 'Enfoques';
    //     let thUrl = document.createElement('th');
    //     thUrl.setAttribute('scope', 'col');
    //     thUrl.innerText = 'Url';

    //     let tBody = document.createElement('tbody');
    //     for (let idx = 0; idx < res.data.length; idx++) {
    //         let trBody = document.createElement('tr');
    //         let tdMedida = document.createElement('td');
    //         tdMedida.innerHTML = res.data[idx].medida;
    //         let tdDescripcion = document.createElement('td');
    //         tdDescripcion.innerHTML = res.data[idx].descripcion;
    //         let tdEnfoques = document.createElement('td');
    //         let ulEnfoques = document.createElement('ul');
    //         for (let idx2 = 0; idx2 < res.data[idx].enfoques.length; idx2++) {
    //             let liEnfoque = document.createElement('li');
    //             liEnfoque.innerHTML = `${res.data[idx].enfoques[idx2].enfoque}, ${res.data[idx].enfoques[idx2].tipo}`;
    //             ulEnfoques.appendChild(liEnfoque);
    //         }
    //         tdEnfoques.appendChild(ulEnfoques);
    //         let tdUrl = document.createElement('td');
    //         let aUrl = document.createElement('a');
    //         aUrl.setAttribute('data-toggle', 'tooltip');
    //         aUrl.setAttribute('data-original-title', "@lang('View more')");
    //         aUrl.setAttribute('data-toggle', 'tooltip');
    //         aUrl.href = `${res.data[idx].url}`;
    //         aUrl.target = '_blank';
    //         let tagI = document.createElement('i');
    //         tagI.className = 'fa fa-eye text-inverse m-r-10';
    //         aUrl.appendChild(tagI);
    //         tdUrl.appendChild(aUrl);
    //         trBody.appendChild(tdMedida);
    //         trBody.appendChild(tdDescripcion);
    //         trBody.appendChild(tdEnfoques);
    //         trBody.appendChild(tdUrl);
    //         tBody.appendChild(trBody);
    //     }

    //     tr.appendChild(thMedida);
    //     tr.appendChild(thDescripcion);
    //     tr.appendChild(thEnfoques);
    //     tr.appendChild(thUrl);

    //     tHead.appendChild(tr);
    //     table.appendChild(tHead);
    //     table.appendChild(tBody);
    //     container.appendChild(table);
    // })
}

function resetPoliticalLevel() {
    let btnBack = document.getElementById('back_political_sc_level');
    btnBack.style.display = 'none';
    removeAllChildFromContainerDiv('politicals_table_container');
    dataTablePoliticalController('');
    document.getElementById('title_politicals').innerHTML = 'América Latina y el Caribe';
    window.political_id_country = null;
    window.political_id_region = null;
    controlCountryLayerPoliticals();
    politicalMap.setView([-6.5411393, -79.04523], 3);
}

// ***********************************************************************************
// Map select controller
// ***********************************************************************************
$('#political_sel_cluster').change(function () {
    let political_cluster_inp = $('#political_sel_cluster option:selected');
    window.political_id_country = null;
    // if(cntx_cluster_inp.val() != ""){
    //     window.contexto_id_cluster = cntx_cluster_inp.val();
    //     window.contexto_cluster_name = cntx_cluster_inp.text();
    // }else{
    //     window.contexto_id_cluster = null;
    //     window.contexto_cluster_name = null;
    //}
    //contextoClusterController();
    let title = 'América Latina y el Caribe';
    let request = '';
    if (political_cluster_inp.val() != '') {
        title = political_cluster_inp.text();
        politicalMap.setView(clustersInfo[political_cluster_inp.val()].view, clustersInfo[political_cluster_inp.val()].zoom);
        window.political_id_region = political_cluster_inp.val();
        request = `?id_region=${political_cluster_inp.val()}`;
        document.getElementById('title_politicals').innerHTML = title;
    } else {
        // window.political_id_region = null;
        // document.getElementById('title_politicals').innerHTML = 'América Latina y el Caribe';
        // politicalMap.setView([-6.5411393, -79.04523], 3)
        resetPoliticalLevel();
    }
    removeAllChildFromContainerDiv('politicals_table_container');
    dataTablePoliticalController(request);
    controlCountryLayerPoliticals();
});

getCountriesCovidSeccion();
dataTablePoliticalController()