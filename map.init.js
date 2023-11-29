//************************************************************************************  
//Map vars
//************************************************************************************
L.mapbox.accessToken = 'pk.eyJ1IjoiY2lhdGttIiwiYSI6ImNraGdmbDZjejAxNTMycXBwNXppeHIyYjkifQ.Ucfm2G0KapInAojq6f9BZw';

const southWest = [36.691456, -31.628195],
    northEast = [-46.720170, -114.772726],
    originalView = [-4.1442028, -74.3780018],
    originalZoom = 3,
    options = {
        minZoom: 3,
        worldCopyJump: false,
        // maxBounds: L.latLngBounds(southWest, northEast)
    };
    
const styleLayerOptions = { attribution: 'Data provided by <a href="http://ciat.cgiar.org" class="blue">Observatorio del arroz</a>' };

const clustersInfo = {
    1: { 'label': 'Andina', 'view' : [-5.9732176, -78.5028957], 'zoom' : 4, 'color': '#f2b41c'},
    2: { 'label': 'Centro América y Caribe', 'view' : [7.4192503,-86.9427867], 'zoom' : 3, 'color': '#10ad87'},
    3: { 'label': 'Cono sur', 'view' : [-25.9652833, -68.2470993], 'zoom' : 3, 'color': '#008aa0'}
};

// **************************************************************
// Multiples opciones de lenguaje. Hay un bug con los poligonos
// **************************************************************
// const lang_style = {
//     EN: L.mapbox.styleLayer('mapbox://styles/mapbox/light-v9', {
//         attribution: 'Data provided by <a href="http://ciat.cgiar.org" class="blue">Observatorio del arroz</a>. <a href="/politica" target="_blank"><b>Data policy</b></a>',
//     }),
//     ES: L.mapbox.styleLayer('mapbox://styles/ciatkm/ckhgfstwq018818o06dqero91', {
//         attribution: 'Data provided by <a href="http://ciat.cgiar.org" class="blue">Observatorio del arroz</a>. <a href="/politica" target="_blank"><b>Data policy</b></a>',
//     }),
//     PT: L.mapbox.styleLayer('mapbox://styles/ciatkm/ckhgg16y61fot19nlo5sbe9el', {
//         attribution: 'Data provided by <a href="http://ciat.cgiar.org" class="blue">Observatorio del arroz</a>. <a href="/politica" target="_blank"><b>Data policy</b></a>',
//     })
// };

// Seleccionar el lang_style según el idioma que esté activo
const lang_style = 'mapbox://styles/ciatkm/ckhgfstwq018818o06dqero91';