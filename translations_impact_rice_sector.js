fetch(`locale/${get("lang")}.json`)
  .then(response => response.json())
  .then(lang => {
    console.log('Contenido del archivo JSON:', lang);

    let impactRiceSector = document.getElementById('impact-rice-sector');
    let policyAnalysis = document.getElementById('policy-analysis');
    let policyAnalysisParagraph1 = document.getElementById('policy-analysis-paragraph-1');
    let policyAnalysisParagraph2 = document.getElementById('policy-analysis-paragraph-2');
    let policyAnalysisParagraph3 = document.getElementById('policy-analysis-paragraph-3');
    let policyAnalysisParagraph4 = document.getElementById('policy-analysis-paragraph-4');
    let policyAnalysisParagraph5 = document.getElementById('policy-analysis-paragraph-5');
    let policyAnalysisParagraph6 = document.getElementById('policy-analysis-paragraph-6');


      impactRiceSector.innerText = lang.impact_rice_sector;
      policyAnalysis.innerText = lang.policy_analysis;
      policyAnalysisParagraph1.innerText = lang.policy_analysis_paragraph_1;
      policyAnalysisParagraph2.innerText = lang.policy_analysis_paragraph_2;
      policyAnalysisParagraph3.innerText = lang.policy_analysis_paragraph_3;
      policyAnalysisParagraph4.innerText = lang.policy_analysis_paragraph_4;
      policyAnalysisParagraph5.innerText = lang.policy_analysis_paragraph_5;
      policyAnalysisParagraph6.innerText = lang.policy_analysis_paragraph_6;

});

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
 }

// console.log(get("lang"))

var locale = get("lang");