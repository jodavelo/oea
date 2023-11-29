L.mapbox.accessToken = 'pk.eyJ1IjoiY2lhdGttIiwiYSI6ImNraGdmbDZjejAxNTMycXBwNXppeHIyYjkifQ.Ucfm2G0KapInAojq6f9BZw';

var mapImpactosProduccion = L.mapbox.map('map_impactos_produccion', 'mapbox.streets')
    .setView([-3.193883, -69.826556], 1);

var data_countries_impactos_produccion = null;

// function getDataImpactosProduccion() {
//     if (data_countries_impactos_produccion != null) return;

//     fetch('https://cropobs-central.alliance.cgiar.org/api/v2/flar/covid-section/production')
//         .then(response => response.json())
//         .then(data => {
//             data_countries_impactos_produccion = L.geoJson(data, {
//                 style: getImpactoProduccionStyle
//                 // Aquí puedes agregar más opciones como onEachFeature si necesitas interactividad
//             }).addTo(mapImpactosProduccion);
//         })
//         .catch(err => console.error(err));
// }

// function getImpactoProduccionStyle(feature) {
//     return {
//         fillColor: getColorImpactoProduccion(feature.properties.report_impact),
//         weight: 1,
//         color: '#666',
//         opacity: 1,
//         dashArray: '0',
//         fillOpacity: 0.6
//     };
// }

// function getColorImpactoProduccion(d) {
//     return d === 'reporto' ? '#f2b41c' : '#10ad87';
// }

// getDataImpactosProduccion();
