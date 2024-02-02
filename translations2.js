fetch(`locale/${get("lang")}.json`)
  .then(response => response.json())
  .then(lang => {
    console.log('Contenido del archivo JSON:', lang);

    let policiesMap = document.getElementById('policy-map');
    let cluster = document.getElementById('cluster-option');
    let andean = document.getElementById('andean-option');
    let southernCone = document.getElementById('southern-cone-option');
    let latinAmericaCaribbean = document.getElementById('lac-option');
    let impactRiceSector = document.getElementById('impact-rice-sector');
    let policyAnalysis = document.getElementById('policy-analysis');
    let policyAnalysisParagraph = document.getElementById('policy-analysis-paragraph');

      policiesMap.innerText = lang.policies_map;
      cluster.innerText = lang.cluster;
      andean.innerText = lang.andean;
      southernCone.innerText = lang.southern_cone;
      latinAmericaCaribbean.innerText = lang.lac;
      impactRiceSector.innerText = lang.impact_rice_sector;
      policyAnalysis.innerText = lang.policy_analysis;
      policyAnalysisParagraph.innerText = lang.policy_analysis_paragraph;
});

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
 }

// console.log(get("lang"))

var locale = get("lang");