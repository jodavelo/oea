fetch(`locale/${get("lang")}.json`)
  .then(response => response.json())
  .then(lang => {
    console.log('Contenido del archivo JSON:', lang);

    let titleForumsEffectCovid = document.getElementById('title-forums-effect-covid');
    let forumsParagraph1 = document.getElementById('forums-paragraph1');
    let forumsParagraph2 = document.getElementById('forums-paragraph2');
    let forumsParagraph3 = document.getElementById('forums-paragraph3');
    let titlePerspectiveImpact = document.getElementById('perspective-impact-pandemic-opinion');
    let forumsParagraph4 = document.getElementById('forums-paragraph4');
    let forumsParagraph5 = document.getElementById('forums-paragraph5');
    let forumsParagraph6 = document.getElementById('forums-paragraph6');
    let forumsParagraph7 = document.getElementById('forums-paragraph7');
    let forumsParagraph8  = document.getElementById('forums-paragraph8');
    let forumsParagraph9 = document.getElementById('forums-paragraph9');
    let forumsParagraph9_1 = document.getElementById('forums-paragraph9-1');
    let forumsParagraph9_2 = document.getElementById('forums-paragraph9-2');
    let forumsParagraph9_3 = document.getElementById('forums-paragraph9-3');
    let forumsParagraph9_4 = document.getElementById('forums-paragraph9-4');
    let forumsParagraph9_5 = document.getElementById('forums-paragraph9-5');
    let forumsParagraph9_6 = document.getElementById('forums-paragraph9-6');
    let forumsParagraph10 = document.getElementById('forums-paragraph10');
    let forumsParagraph11 = document.getElementById('forums-paragraph11');
    let forumsParagraph11_1 = document.getElementById('forums-paragraph11-1');
    let forumsParagraph12 = document.getElementById('forums-paragraph12');
    let forumsParagraph12_1 = document.getElementById('forums-paragraph12-1');
    let forumsParagraph12_2 = document.getElementById('forums-paragraph12-2');
    let forumsParagraph12_3 = document.getElementById('forums-paragraph12-3');
    let forumsParagraph13 = document.getElementById('forums-paragraph13');
    let forumsParagraph14 = document.getElementById('forums-paragraph14');
    let forumsParagraph15 = document.getElementById('forums-paragraph15');



    titleForumsEffectCovid.innerText = lang.title_forums_effect_covid;
    forumsParagraph1.innerText = lang.forums_paragraph1;
    forumsParagraph2.innerText = lang.forums_paragraph2;
    forumsParagraph3.innerText = lang.forums_paragraph3;
    titlePerspectiveImpact.innerText =lang.perspective_impact_pandemic_opinion;
    forumsParagraph4.innerText = lang.forums_paragraph4;
    forumsParagraph5.innerText = lang.forums_paragraph5;
    forumsParagraph6.innerText = lang.forums_paragraph6;
    forumsParagraph7.innerText = lang.forums_paragraph7;
    forumsParagraph8.innerText = lang.forums_paragraph8;
    forumsParagraph9.innerText = lang.forums_paragraph9;
    forumsParagraph9_1.innerText = lang.forums_paragraph9_1;
    forumsParagraph9_2.innerText = lang.forums_paragraph9_2;
    forumsParagraph9_3.innerText = lang.forums_paragraph9_3;
    forumsParagraph9_4.innerText = lang.forums_paragraph9_4;
    forumsParagraph9_5.innerText = lang.forums_paragraph9_5;
    forumsParagraph9_6.innerText = lang.forums_paragraph9_6;
    forumsParagraph10.innerText = lang.forums_paragraph10;
    forumsParagraph11.innerText = lang.forums_paragraph11;
    forumsParagraph11_1.innerText = lang.forums_paragraph11_1;
    forumsParagraph12.innerText = lang.forums_paragraph12;
    forumsParagraph12_1.innerText = lang.forums_paragraph12_1;
    forumsParagraph12_2.innerText = lang.forums_paragraph12_2;
    forumsParagraph12_3.innerText = lang.forums_paragraph12_3;
    forumsParagraph13.innerText = lang.forums_paragraph13;
    forumsParagraph14.innerText = lang.forums_paragraph14;
    forumsParagraph15.innerText = lang.forums_paragraph15;




});

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
 }

// console.log(get("lang"))

var locale = get("lang");