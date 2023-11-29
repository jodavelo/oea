//Chart.defaults.global.defaultFontSize = 10;

//************************************************************************************  
//Prices Map Settings
//************************************************************************************

var map_precios = L.map('map_precios').setView([-6.5411393, -79.04523], 3);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map_precios);

window.countries_prices_covid_seccion = null; 
var pricesLayer = L.geoJson().addTo(map_precios);

window.prices_id_country = null;

async function getGeoJsonPrices(){
    if(window.countries_prices_covid_seccion != null) return;
    await(async function(){
        fetch('https://cropobs-central.alliance.cgiar.org/api/v1/covid-seccion/countries').then(function(response){
            return response.json();
        }).then( function(data){
            window.countries_prices_covid_seccion = data.data;
            controlCountryLayerPrices();
            //console.log( data );
            updatePreciosCharts();
        } ).catch(function(err){
            console.error(err);
        });
    })();
}

// ***********************************************************************************
//  Map Country controller
// ***********************************************************************************
function controlCountryLayerPrices(){
    pricesLayer.clearLayers();
    pricesLayer = L.geoJson(
        window.countries_prices_covid_seccion,
        {
            style: pricesCountryStyle,
            onEachFeature: countryPricesOnEachFeature
        }
    ).addTo(map_precios);
}

function countryPricesOnEachFeature(feature, layer){
    layer.on({
        click: ()=>{}//controlCountryPricesInfoFeature
    });
}

var titlePrecios = document.getElementById('title_precios');

function controlCountryPricesInfoFeature(e){
    let properties = e.target.feature.properties;
    window.prices_id_country = properties.id_country;
    map_precios.setView([e.target.feature.properties.latitude, e.target.feature.properties.longitude], 5);
    titlePrecios.innerHTML = properties.esp_name;
    controlCountryLayerPrices();
    updatePreciosCharts(`?id_country=${window.prices_id_country}`);
    let back = document.getElementById('back_prices_sc_level');
    back.style.display = 'inline';
    let divChartFao = document.getElementById('div-precios-internacionales');
    divChartFao.style.display = 'none';
    let divChartNominal = document.getElementById('div-precios-internacionales-nominal');
    divChartNominal.style.display = 'none';
    let divChartPrecio = document.getElementById('div-precios-nacionales');
    divChartPrecio.style.display = 'block';
    //console.log(properties)
}

function pricesCountryStyle(feature) {
    if (window.prices_id_country != null && window.prices_id_country == feature.properties.id_country) {
        return {
            fillColor: getColorCountriesCovidSeccion(feature.properties.region),
            weight: 2,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.6
        }
    }
    // } else if (window.political_id_country == null && window.political_id_region != null && feature.properties.id_region == window.political_id_region) {
    //     return {
    //         fillColor: clustersInfo[feature.properties.id_region].color,
    //         weight: 2,
    //         color: '#666',
    //         dashArray: '',
    //         fillOpacity: 0.6
    //     }
    // }
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

$(document).ready(function(){

    // ************************************************************************************
    // Precios charts
    // ************************************************************************************
    window.preciosChartData = {
        labels: [],
        datasets: [],
    };

    let preciosChart = document.getElementById('nalPricesChart').getContext('2d');
    window.preciosLine = Chart.Line(preciosChart, {
        data: preciosChartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Precios',
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                // callbacks: {
                //     label: function(tooltipItem, data) {
                //         let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y;
                //         let country = data.datasets[tooltipItem.datasetIndex].label;
                //         return `${country}: ${value} ${data.units}`;
                //     }
                // }
            },
            hover: {
                mode: 'nearest',
                intersect: true,
            },
            scales: {
                xAxes: [
                    {
                        ticks:{
                            maxRotation: 0,
                            display: true,
                            autoSkip: true,
                            maxTicksLimit: 30,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Gráficos provistos por Observatorio del arroz para América Latina y el Caribe',
                            fontColor: '#757575',
                            fontSize: 8
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '',
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return commarize(value);
                            }
                        },
                    },
                ],
            },
            legend: {
                position: 'bottom',
            },
        },
    });

    window.preciosFaoChartData = {
        labels: [],
        datasets: [],
    };

    let preciosChartFao = document.getElementById('pricesChartFao').getContext('2d');
    window.preciosFaoLine = Chart.Line(preciosChartFao, {
        data: preciosFaoChartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Precios fao',
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                // callbacks: {
                //     label: function(tooltipItem, data) {
                //         let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y;
                //         let country = data.datasets[tooltipItem.datasetIndex].label;
                //         return `${country}: ${value} ${data.units}`;
                //     }
                // }
            },
            hover: {
                mode: 'nearest',
                intersect: true,
            },
            scales: {
                xAxes: [
                    {
                        ticks:{
                            maxRotation: 0,
                            display: true,
                            autoSkip: true,
                            maxTicksLimit: 30,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Gráficos provistos por Observatorio del arroz para América Latina y el Caribe',
                            fontColor: '#757575',
                            fontSize: 8
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '',
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return commarize(value);
                            }
                        },
                    },
                ],
            },
            legend: {
                position: 'bottom',
            },
        },
    });

    window.preciosNominalChartData = {
        labels: [],
        datasets: [],
    };
    let preciosChartNominal = document.getElementById('pricesChartNominal').getContext('2d');
    window.preciosNominalLine = Chart.Line(preciosChartNominal, {
        data: preciosNominalChartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Precios nominal',
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                // callbacks: {
                //     label: function(tooltipItem, data) {
                //         let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y;
                //         let country = data.datasets[tooltipItem.datasetIndex].label;
                //         return `${country}: ${value} ${data.units}`;
                //     }
                // }
            },
            hover: {
                mode: 'nearest',
                intersect: true,
            },
            scales: {
                xAxes: [
                    {
                        ticks:{
                            maxRotation: 0,
                            display: true,
                            autoSkip: true,
                            maxTicksLimit: 30,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Gráficos provistos por Observatorio del arroz para América Latina y el Caribe',
                            fontColor: '#757575',
                            fontSize: 8
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '',
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return commarize(value);
                            }
                        },
                    },
                ],
            },
            legend: {
                position: 'bottom',
            },
        },
    });
});

async function updatePreciosCharts(request = "") {
    //displayShow('loader');
    let arrayCountryCurrency = [];
    let arrayCountryCurrencyData2 = [];
    let colorChart = [..._colors];
    let dates = [];
    let dates2 = [];
    let datesWithFormat = [];
    let dates2WithFormat = [];
    let arrayChartObjects = [];
    let arrayChart2Objects = [];
    //console.log(colorChart);
    await $.get(`https://cropobs-central.alliance.cgiar.org/api/v1/covid-seccion/get-prices-nales${ request }`, function (objResult) {
        //displayHide('loader');
        let titleFaoChart = 'Índice FAO para distintos tipos de arroz '+objResult.data[0].comments;
        objResult.data.forEach( object => {
            arrayCountryCurrency.push(object.label);
            let dataArray = [];
            object.dataset.forEach( e => {
                dates.push(e.date);
                dataArray.push(e.value);
            } )
            let color = colorChart.pop();
            
            //console.log(object.dataset);
            let dataFirst = {
                label: object.currency,
                data: dataArray,
                lineTension: 0,
                fill: false,
                borderColor: color,
                backgroundColor: color,
            };
            arrayChartObjects.push(dataFirst);
        });
        let currencyUnique = getUniqueArray(arrayCountryCurrency);
        dates = getUniqueArray(dates);
        let sort = sortDateArray(dates);
        //var longDateStr = moment(sort[0], 'Y-M-D').format('D Y  MMMM dddd');
        //let longDateStr = moment(sort[0], 'Y-M-D').locale('es').format('MMMM Y');
        datesWithFormat = formatForDate(sort);
        if(objResult.data2 != null){
            let titleNominalChart = 'Precios internacionales de arroz '+objResult.data2[0].comments;
            objResult.data2.forEach( object => {
                arrayCountryCurrencyData2.push(object.label);
                let data2Array = [];
                object.dataset.forEach( e => {
                    dates2.push(e.date);
                    data2Array.push(e.value);
                } )
                let color = colorChart.pop();
                
                //console.log(object.dataset);
                let dataSecond = {
                    label: object.currency,
                    data: data2Array,
                    lineTension: 0,
                    fill: false,
                    borderColor: color,
                    backgroundColor: color,
                };
                arrayChart2Objects.push(dataSecond);
            });
            let currency2Unique = getUniqueArray(arrayCountryCurrencyData2);
            dates2 = getUniqueArray(dates2);
            let sort2 = sortDateArray(dates2);
            dates2WithFormat = formatForDate(sort2);
            //console.log(dates2WithFormat);
            window.preciosNominalLine.options.title.text = titleNominalChart;
            window.preciosNominalChartData.labels = dates2WithFormat;
            window.preciosNominalChartData.datasets = arrayChart2Objects;
            window.preciosNominalLine.options.scales.yAxes[0].scaleLabel.labelString = 'Valor nominal (USD/ton)';
            window.preciosNominalLine.update();
        }
        if(window.prices_id_country != null){
            window.preciosChartData.labels = datesWithFormat;
            window.preciosChartData.datasets = arrayChartObjects;
            window.preciosLine.options.scales.yAxes[0].scaleLabel.labelString = currencyUnique[0] + ' / Kg';
            window.preciosLine.update();
        }
        window.preciosFaoLine.options.title.text = titleFaoChart;
        window.preciosFaoChartData.labels = datesWithFormat;
        window.preciosFaoChartData.datasets = arrayChartObjects;
        window.preciosFaoLine.options.scales.yAxes[0].scaleLabel.labelString = 'índice FAO para distintos tipos de arroz';
        window.preciosFaoLine.update();
    });
}


function getUniqueArray( array ){
    return array.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    });
}

function sortDateArray(array){
    return array.sort(function(a, b){
        return new Date(b.date) - new Date(a.date);
    });
}

function formatForDate(array){
    let temp = [];
    array.forEach( d => {
        //datesWithFormat.push( moment(d, 'Y-M-D').locale('es').format('MMMM Y') )
        let splitDate = d.split('-');
        let dateFormat = splitDate[1]+'-'+splitDate[0];
        //console.log(dateFormat);
        temp.push(dateFormat);
    });
    return temp;
}

function resetPricesLevel(){
    window.prices_id_country = null;
    let divChartPrecio = document.getElementById('div-precios-nacionales');
    divChartPrecio.style.display = 'none';
    let divChartFao = document.getElementById('div-precios-internacionales');
    divChartFao.style.display = 'block';
    let divChartNominal = document.getElementById('div-precios-internacionales-nominal');
    divChartNominal.style.display = 'block';
    let back = document.getElementById('back_prices_sc_level');
    back.style.display = 'none';
    titlePrecios.innerHTML = 'Precios internacionales';
    map_precios.setView([-6.5411393, -79.04523], 3);
    controlCountryLayerPrices();
    updatePreciosCharts();
}

getGeoJsonPrices();