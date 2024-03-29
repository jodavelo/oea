fetch(`locale/${get("lang")}.json`)
  .then(response => response.json())
  .then(lang => {
    console.log('Contenido del archivo JSON:', lang);

    let policiesMitigateEffects = document.getElementById('policies-mitigate-effects');
    let approach = document.getElementById('approach-title');
    let extent = document.getElementById('extent-title');
    let countries = document.getElementById('country-title');
    let mesuresGaranteeSector1 = document.getElementById('mesures-garantee-sector1');
    let producerSupportMesures = document.getElementById('producer-support-mesures');
    let consumerSupportPolicies = document.getElementById('consumer-support-policies');
    let foreignTradePolicies = document.getElementById('foreign-trade-policies');
    let digitalizationProcess = document.getElementById('digitization-process');
    let logisticDevelopment = document.getElementById('logistic-development');
    let safetyStandards= document.getElementById('safety-standards');
    let financialRelief = document.getElementById('financial-relief');
    let directPurchases = document.getElementById('direct-purchases');
    let financing = document.getElementById('financing');
    let deliverySupplies = document.getElementById('delivery-supplies');
    let foodBags = document.getElementById('food-bags');
    let monetaryTransfers = document.getElementById('monetary-transfers');
    let controlledMarketing= document.getElementById('controlled-marketing');
    let exportFacilitation = document.getElementById('export-facilitation');
    let importFacilitation = document.getElementById('import-facilitation');
    let country1 = document.getElementById('countries-1');
    let country2 = document.getElementById('countries-2');
    let country3 = document.getElementById('countries-3');
    let country4 = document.getElementById('countries-4');
    let country5 = document.getElementById('countries-5');
    let country6 = document.getElementById('countries-6');
    let country7 = document.getElementById('countries-7');
    let country8 = document.getElementById('countries-8');
    let country9 = document.getElementById('countries-9');
    let country10 = document.getElementById('countries-10');
    let country11 = document.getElementById('countries-11');
    let country12 = document.getElementById('countries-12');
    let policesTitle = document.getElementById('policies-title');
    let policiesParagraph = document.getElementById('policies-paragraph');
    let linkPoliciesAgrifood = document.getElementById('link-agrifood-policies');
    let policiesParagraph2 = document.getElementById('policies-paragraph2');
    let policiesParagraph3 = document.getElementById('policies-paragraph3');
    let mesuresGaranteeSector1Title = document.getElementById('mesures-garantee-sector1-title');
    let digitalizationProcessTitle = document.getElementById('digitization-process-title');
    let logisticDevelopmentTitle = document.getElementById('logistic-development-title');
    let safetyStandardsTitle = document.getElementById('safety-standards-title');
    let producerSupportMesuresTitle = document.getElementById('producer-support-mesures-title');
    let financialReliefTitle = document.getElementById('financial-relief-title');
    let directPurchasesTitle = document.getElementById('direct-purchases-title');
    let financingTitle = document.getElementById('financing-title');
    let deliverySuppliesTitle = document.getElementById('delivery-supplies-title');
    let consumerSupportTitle = document.getElementById('consumer-support-policies-title');
    let foodBagsTitle = document.getElementById('food-bags-title');
    let monetaryTransfersTitle= document.getElementById('monetary-transfers-title');
    let priceControlTitle = document.getElementById('price-control-title');
    let foreignTradeTitle = document.getElementById('foreign-trade-policies-title');
    let importFacilitationTitle = document.getElementById('import-facilitation-title');
    let exportFacilitationTitle = document.getElementById('export-facilitation-title');
    let mesuresGaranteeSector1Text = document.getElementById('mesures-garantee-sector1-text');
    let digitalizationProcessText = document.getElementById('digitization-process-text');
    let logisticDevelopmentText = document.getElementById('logistic-development-text');
    let safetyStandardsText = document.getElementById('safety-standards-text');
    let producerSupportMesuresText = document.getElementById('producer-support-mesures-text');
    let financialReliefText = document.getElementById('financial-relief-text');
    let directPurchasesText = document.getElementById('direct-purchases-text');
    let financingText = document.getElementById('financing-text');
    let deliverySuppliesText = document.getElementById('delivery-supplies-text');
    let consumerSupportText = document.getElementById('consumer-support-policies-text');
    let foodBagsText = document.getElementById('food-bags-text');
    let monetaryTransfersText = document.getElementById('monetary-transfers-text');
    let priceControlText = document.getElementById('price-control-text');
    let foreignTradeText = document.getElementById('foreign-trade-policies-text');
    let importFacilitationText = document.getElementById('import-facilitation-text');
    let exportFacilitationText = document.getElementById('export-facilitation-text');


        policiesMitigateEffects.innerText =lang.policies_mitigate_effects;
        approach.innerText = lang.approach;
        extent.innerText = lang.extent;
        countries.innerText = lang.countries_where_implemented;
        mesuresGaranteeSector1.innerText = lang.mesures_garantee_sector1;
        producerSupportMesures.innerText = lang.producer_support_mesures;
        consumerSupportPolicies.innerText = lang.consumer_support_policies;
        foreignTradePolicies.innerText = lang.foreign_trade_policies;
        digitalizationProcess.innerText = lang.digitalization_process;
        logisticDevelopment.innerText = lang.logistics_development;
        safetyStandards.innerText = lang.safety_standards;
        financialRelief.innerText = lang.financial_relief;
        directPurchases.innerText = lang.direct_purchases;
        financing.innerText = lang.financing;
        deliverySupplies.innerText = lang.delivery_supplies;
        foodBags.innerText = lang.food_bags;
        monetaryTransfers.innerText = lang.monetary_transfers;
        controlledMarketing.innerText = lang.controlled_marketing;
        exportFacilitation.innerText = lang.export_facilitation;
        importFacilitation.innerText = lang.import_facilitation;
        country1.innerText = lang.countries_1;
        country2.innerText = lang.countries_2;
        country3.innerText = lang.countries_3;
        country4.innerText = lang.countries_4;
        country5.innerText = lang.countries_5;
        country6.innerText = lang.countries_6;
        country7.innerText = lang.countries_7;
        country8.innerText = lang.countries_8;
        country9.innerText = lang.countries_9;
        country10.innerText = lang.countries_10;
        country11.innerText = lang.countries_11;
        country12.innerText = lang.countries_12;
        policesTitle.innerText = lang.policies_title;
        policiesParagraph.innerText = lang.policies_paragraph;
        linkPoliciesAgrifood.innerText = lang.link_agrifood_policies;
        policiesParagraph2.innerText = lang.policies_paragraph2;
        policiesParagraph3.innerText = lang.policies_paragraph3;
        mesuresGaranteeSector1Title.innerText = lang.mesures_garantee_sector1_title;
        digitalizationProcessTitle.innerText = lang.digitalization_process_title;
        logisticDevelopmentTitle.innerText = lang.logistics_development_title;
        safetyStandardsTitle.innerText = lang.safety_standards_title;
        producerSupportMesuresTitle.innerText = lang.producer_support_mesures_title;
        financialReliefTitle.innerText = lang.financial_relief_title;
        directPurchasesTitle.innerText = lang.direct_purchases_title;
        financingTitle.innerText = lang.financing_title;
        deliverySuppliesTitle.innerText = lang.delivery_supplies_title;
        consumerSupportTitle.innerText = lang.consumer_support_policies_title;
        foodBagsTitle.innerText = lang.food_bags_title;
        monetaryTransfersTitle.innerText = lang.monetary_transfers_title;
        priceControlTitle.innerText = lang.price_control_title;
        foreignTradeTitle.innerText = lang.foreign_trade_policies_title;
        importFacilitationTitle.innerText = lang.import_facilitation_title;
        exportFacilitationTitle.innerText = lang.export_facilitation_title;
        mesuresGaranteeSector1Text.innerText = lang.mesures_garantee_sector1_text;
        digitalizationProcessText.innerText = lang.digitalization_process_text;
        logisticDevelopmentText.innerText = lang.logistics_development_text;
        safetyStandardsText.innerText = lang.safety_standards_text;
        producerSupportMesuresText.innerText = lang.producer_support_mesures_text;
        financialReliefText.innerText = lang.financial_relief_text;
        directPurchasesText.innerText = lang.direct_purchases_text;
        financingText.innerText = lang.financing_text;
        deliverySuppliesText.innerText = lang.delivery_supplies_text;
        consumerSupportText.innerText = lang.consumer_support_policies_text;
        foodBagsText.innerText = lang.food_bags_text;
        monetaryTransfersText.innerText = lang.monetary_transfers_text;
        priceControlText.innerText = lang.price_control_text;
        foreignTradeText.innerText = lang.foreign_trade_policies_text;
        importFacilitationText.innerText = lang.import_facilitation_text;
        exportFacilitationText.innerText = lang.export_facilitation_text;
        
       
});

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
 }

// console.log(get("lang"))

var locale = get("lang");