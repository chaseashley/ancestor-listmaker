/* This module contains functions that check a list of ancestors against a particular criteria and return
** those that match */
const fetch = require("node-fetch");

export function filterOrphans(ancestors) {
    let matchingAncestors = [];
    for (let i = 0; i < ancestors.length; i++) {
        if (ancestors[i]['Manager'] === 0) {
            matchingAncestors.push(ancestors[i]);
        }
    }
    return matchingAncestors;
}

export function filterLocationText(ancestors, locationText) {
    //uppercase text and remove commas
    locationText = locationText.replace(/[&\/\\#+()$~%"*?<>{}]/g, '');
    locationText = locationText.replace(/'/g,'%27');
    locationText = locationText.replace('.','').toUpperCase();

    const birthLocStart = locationText.indexOf('B:');
    const deathLocStart = locationText.indexOf('D:');
    let birthLoc;
    let birthLocationText;
    if (birthLocStart == -1) {
        birthLoc = false;
    } else {
        birthLoc = true;
        if (deathLocStart > birthLocStart) {
            birthLocationText = locationText.slice(birthLocStart+2,deathLocStart);
        } else {
            birthLocationText = locationText.slice(birthLocStart+2);
        }
    }

    let deathLoc;
    let deathLocationText;
    if (deathLocStart == -1) {
        deathLoc = false;
    } else {
        deathLoc = true;
        if (birthLocStart > deathLocStart) {
            deathLocationText = locationText.slice(deathLocStart+2,birthLocStart);
        } else {
            deathLocationText = locationText.slice(deathLocStart+2);
        }
    }

    if (birthLoc && deathLoc) {
        const birthLocMatches = getLocationTextMatches('birth',birthLocationText, ancestors);
        const deathLocMatches = getLocationTextMatches('death',deathLocationText, ancestors);
        return getCommonMatches(birthLocMatches,deathLocMatches)
    } else if (birthLoc) {
        return getLocationTextMatches('birth',birthLocationText, ancestors);
    } else if (deathLoc) {
        return getLocationTextMatches('death',deathLocationText, ancestors);
    } else {
        return getLocationTextMatches('both', locationText, ancestors);
    }
}

function getLocationTextMatches(field, locationText, ancestors) {
    
    //parse location text by commas
    let searchTerms = locationText.split(',');
    if (searchTerms.length === 0) {
        return null;
    } else {
        let searchTerm = '';
        let rxText = '';
        let rxOmitText = ''
        for (let i=0; i<searchTerms.length; i++) {
            searchTerm = searchTerms[i].trim();
            if (searchTerm!==''){
                if (searchTerm[0] === '!') {
                    rxOmitText = rxOmitText + searchTerm.slice(1) + '|';
                } else {
                    rxText = rxText + searchTerm + '|';
                }
            }
        }
        if (rxText !== '') {
            rxText = rxText.slice(0,rxText.length-1);
        }
        if (rxOmitText !== '') {
            rxOmitText = rxOmitText.slice(0,rxOmitText.length-1);
            rxOmitText= rxOmitText.trim();
        }
        const regex = new RegExp(rxText);
        const regexOmit = new RegExp(rxOmitText);
        let matchingAncestors = [];

        if (field === 'birth') {
            for (let i = 0; i < ancestors.length; i++) {
                if (ancestors[i]['BirthLocation'] !== null) {
                    if (rxText !== '') { //do a regex test
                        if (regex.test(ancestors[i]['BirthLocation'].toUpperCase()) && (rxOmitText === '' || !regexOmit.test(ancestors[i]['BirthLocation'].toUpperCase()))) {
                            matchingAncestors.push(ancestors[i]);
                        }
                    }  else if (rxOmitText !== '') { //do a regexOmit test
                        if (!regexOmit.test(ancestors[i]['BirthLocation'].toUpperCase())) {
                            matchingAncestors.push(ancestors[i]);
                        }
                    } 
                }
             }
        } else if (field === 'death') {
            for (let i = 0; i < ancestors.length; i++) {
                if (ancestors[i]['DeathLocation'] !== null) {
                    if (rxText !== '') { //do a regex test
                        if (regex.test(ancestors[i]['DeathLocation'].toUpperCase()) && (rxOmitText === '' || !regexOmit.test(ancestors[i]['DeathLocation'].toUpperCase()))) {
                            matchingAncestors.push(ancestors[i]);
                        }
                    }  else if (rxOmitText !== '') { //do a regexOmit test
                        if (!regexOmit.test(ancestors[i]['DeathLocation'].toUpperCase())) {
                            matchingAncestors.push(ancestors[i]);
                        }
                    } 
                }
             }
        } else {
            for (let i = 0; i < ancestors.length; i++) {
                if (ancestors[i]['BirthLocation'] !== null && ancestors[i]['DeathLocation'] !== null) {
                    if (rxText !== '') { //do a regex test
                        if (regex.test(ancestors[i]['BirthLocation'].toUpperCase()) && (rxOmitText === '' || !regexOmit.test(ancestors[i]['BirthLocation'].toUpperCase()))) {
                            matchingAncestors.push(ancestors[i]);
                        }
                        if (regex.test(ancestors[i]['DeathLocation'].toUpperCase()) && (rxOmitText === '' || !regexOmit.test(ancestors[i]['DeathLocation'].toUpperCase()))) {
                            matchingAncestors.push(ancestors[i]);
                        }
                    }  else if (rxOmitText !== '') { //do a regexOmit test
                        if (!regexOmit.test(ancestors[i]['BirthLocation'].toUpperCase()) && !regexOmit.test(ancestors[i]['DeathLocation'].toUpperCase())) {
                            matchingAncestors.push(ancestors[i]);
                        }
                    } 
                }
             }
             matchingAncestors = removeDuplicates(matchingAncestors);
        }
        return matchingAncestors;
    }
}

function getCommonMatches(birthLocMatches,deathLocMatches) {
    let commonMatches = [];
    for (let i=0; i<birthLocMatches.length; i++) {
        for (let j=0; j<deathLocMatches.length; j++) {
            if (birthLocMatches[i]['Id'] === deathLocMatches[j]['Id']) {
                commonMatches.push(birthLocMatches[i]);
                break;
            }
        }
    }
    return commonMatches;
}

export function filterCanadianImmigrants(ancestors) {
    const regex = /Canada| Can[.]| CAN|Nouvelle-France|Nouvelle France|Quebec|Québec|Nova Scotia|N[.]S[.]|New Brunswick|N[.]B[.]|Newfoundland|Ontario|Prince Edward Island|P[.]E[.]I[.]|British Columbia|B[.]C[.]|Alberta|Manitoba|Northwest Territories|Labrador|Nunavut|Saskatchewan|Yukon|Acadie|Acadia/;
    let matchingAncestors = [];
    for (let i = 0; i < ancestors.length; i++) {
        if (!regex.test(ancestors[i]['BirthLocation']) && regex.test(ancestors[i]['DeathLocation'])) {
            matchingAncestors.push(ancestors[i]);
        }
     }
     return matchingAncestors;
}

export function filterAustralianImmigrants(ancestors) {
    const regex = /Australia| AUS|Tasmania|New South Wales|Queensland|Van Dieman|Victoria/;
    let matchingAncestors = [];
    for (let i = 0; i < ancestors.length; i++) {
        if (!regex.test(ancestors[i]['BirthLocation']) && regex.test(ancestors[i]['DeathLocation'])) {
            matchingAncestors.push(ancestors[i]);
        }
     }
     return matchingAncestors;
}

export function filterUSImmigrants(ancestors) {
    const regex = /United States of America|United States|USA|U[.]S[.]A[.]|Alabama|AL|Alaska|AK|Arizona|AZ|Arkansas|AR|California|CA|Colorado|CO|Connecticut|Conn[.]|CT|Delaware|Del[.]|DE|Florida|FL|Georgia|GA|Hawaii|HI|Idaho|ID|Illinois|Ill[.]|IL|Indiana|IN|Iowa|IA|Kansas|KS|Kentucky|K[.]y|KY|Louisiana|LA|Maine|ME|Maryland|MD|Massachusetts|Mass[.]|MA|Michigan|Mich[.]|MI|Minnesota|MN|Mississippi|Miss[.]|MS|Missouri|MO|Montana|MT|Nebraska|NE|Nevada|NV|New Hampshire|N[.]H[.]|NH|New Jersey|N[.]J[.]|NJ|New Mexico|N[.]M[.]|NM|New York|N[.]Y[.]|NY|North Carolina|N[.]C[.]|NC|North Dakota|N[.]D[.]|Ohio|OH|Oklahoma|OK|Oregon|OR|Pennsylvania|Penn[.]|PA|Rhode Island|R[.]I[.]|RI|South Carolina|S[.]C[.]|SC|South Dakota|S[.]D[.]|SD|Tennessee|Tenn[.]|TN|Texas|TX|Utah|UT|Vermont|VT|Virginia|VA|Washington|WA|West Virginia|W[.]V[.]|WV|Wisconsin|WI|Wyoming|WY|Plymouth Colony|New Haven|Long Island/;
    let matchingAncestors = [];
    for (let i = 0; i < ancestors.length; i++) {
        if (!regex.test(ancestors[i]['BirthLocation']) && regex.test(ancestors[i]['DeathLocation'])) {
            matchingAncestors.push(ancestors[i]);
        }
     }
     return matchingAncestors;
}

export function filterUnknownFather(ancestors) {
    let matchingAncestors = [];
    for (let i = 0; i < ancestors.length; i++) {
        if (ancestors[i]['Father'] === 0) { // Father of 0 indicates no father attached
            matchingAncestors.push(ancestors[i]);
        } else if (ancestors[i]['Father'] > 0) {
            for (let j = 0; j < ancestors.length; j++) { // Check if Name of father includes Unknown - eg Unknown-35425
                if (ancestors[i]['Father'] === ancestors[j]['Id'] && ancestors[j]['Name'].toUpperCase().indexOf('UNKNOWN') !== -1) {
                    matchingAncestors.push(ancestors[i]);
                }
              }  
            }
        }
    return matchingAncestors;
}

export function filterUnknownMother(ancestors) {
    let matchingAncestors = [];
    for (let i = 0; i < ancestors.length; i++) {
        if (ancestors[i]['Mother'] === 0) { // Mother of 0 indicates no father attached
            matchingAncestors.push(ancestors[i]);
        } else if (ancestors[i]['Mother'] > 0) {
            for (let j = 0; j < ancestors.length; j++) { // Check if Name of mother includes Unknown - eg Unknown-35425
                if (ancestors[i]['Mother'] === ancestors[j]['Id'] && ancestors[j]['Name'].toUpperCase().indexOf('UNKNOWN') !== -1) {
                    matchingAncestors.push(ancestors[i]);
                }
              }  
            }
        }
    return matchingAncestors;
}

export function filterCategoryArefs(ancestors, categoryArefs) {
    const matchingAncestors = [];
    for (let i = 0; i < ancestors.length; i++) {
        let ancestorName = ancestors[i]['Name'];
        if (categoryArefs.indexOf(`/${ancestorName}*`) !== -1) {
            matchingAncestors.push(ancestors[i]);
        }
        if (ancestorName.indexOf(' ') !==-1) {
            let ancestorNameWithoutUnderline = ancestorName.replace(' ', '_');
            if (categoryArefs.indexOf(`/${ancestorNameWithoutUnderline}*`) !== -1) {
                matchingAncestors.push(ancestors[i]);
            }
        }
    }
    return matchingAncestors;
}

export async function filterByWikiTreePlus(descendantJson, ancestors, filterName) {

    const wtPlusSearchPersons = getWTPlusSearchPersons(descendantJson, ancestors);

    let combinedWtPlusIdArray = []
    for (let i=0; i<wtPlusSearchPersons.length; i++) {
        const wtPlusIdArray = await getWtPlusIdArray(wtPlusSearchPersons[i]['Name'], filterName);
        if (wtPlusIdArray !== undefined) {
            combinedWtPlusIdArray = combinedWtPlusIdArray.concat(wtPlusIdArray);
        }
    }

    const matchingAncestors = []
    for (let i = 0; i < ancestors.length; i++) {
        let ancestorId = ancestors[i]['Id'];
        if (combinedWtPlusIdArray.indexOf(ancestorId) !== -1) {
            matchingAncestors.push(ancestors[i]);
        }
    }
    return matchingAncestors;
}

async function getWtPlusIdArray(descendant, filterName) {

    let databaseSearch = '';
    if (filterName === 'Unsourced') {
        databaseSearch = `Ancestors%3D${descendant}+Template%3DUnsourced`;
    } else if (filterName === 'GEDCOM Junk') {
        databaseSearch = `Ancestors%3D${descendant}+GEDCOMJunk`;
    } else if (filterName === 'Five-Star Profiles') {
        databaseSearch = `Ancestors%3D${descendant}+Stars%3D5stars`;
    } else if (filterName === 'Witches') {
        databaseSearch = `Ancestors%3D${descendant}+CategoryWord%3Dwitches+CategoryWord%3Daccused`;
    }
    const wtplusJson = await getWtPlusJson(databaseSearch);

    let wtPlusIdArray;
    if (wtplusJson['response']['found'] > 0) {
        wtPlusIdArray = wtplusJson['response']['profiles'];
    }
    return wtPlusIdArray;
}

async function getWtPlusJson(databaseSearch) {
    const url = `https://wikitree.sdms.si/function/WTWebProfileSearch/Profiles.json?Query=${databaseSearch}&format=json`;
    try {
        const response = await fetch(url);
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch(err) {
        alert('No categories matching the entered terms have been found.');
        console.log(err);
        return null;
    }
}

/* Removes duplicate ancestor objects from an array */
export function removeDuplicates(arr) {
    return arr.reduce(function (p, c) {
        // if the next object's id is not found in the output array
        // push the object into the output array
        if (!p.some(function (el) {return el['Id'] === c['Id']; })) p.push(c);
        return p;
      }, []);
}

export function getMultiples(ancestors) {
    const counter = {};
    for (let i=0; i<ancestors.length; i++) {
        if (counter.hasOwnProperty(ancestors[i]['Id'])) {
            counter[ancestors[i]['Id']]++
        } else {
            counter[ancestors[i]['Id']] = 1;
        }
    }
    return counter;
}

export async function filterCategoryText(descendantJson, ancestors, categoryText) {
    //uppercase text and remove commas
    categoryText = categoryText.replace(/[&\/\\#()$~%":*?<>{}]/g, '');
    categoryText = categoryText.replace(/'/g,'%27');
    categoryText = categoryText.replace('.','');
    
    //parse location text by commas
    let searchTerms = categoryText.split(',');
    if (searchTerms.length === 0) {
        return null;
    } else {
        const wtPlusSearchPersons = getWTPlusSearchPersons(descendantJson, ancestors);
        let combinedWtPlusIdArray = []
        for (let i=0; i<wtPlusSearchPersons.length; i++) {
            let descendant = wtPlusSearchPersons[i]['Name'];
            let searchTerm = '';
            let databaseSearch = '';
            for (let i=0; i<searchTerms.length; i++) {
                searchTerm = searchTerms[i].trim();
                if (searchTerm[0] === '!') {
                    databaseSearch = `${databaseSearch}+NOT+Ancestors%3D${descendant}+CategoryWord%3D${searchTerm.slice(1).trim()}`;
                } else if (searchTerm[0] === '+') {
                    if (i === 0) {
                        databaseSearch = `${databaseSearch}+Ancestors%3D${descendant}+CategoryWord%3D${searchTerm.slice(1).trim()}`;
                    } else {
                        databaseSearch = `${databaseSearch}+CategoryWord%3D${searchTerm.slice(1).trim()}`;
                    }
                } else {
                    databaseSearch = `${databaseSearch}+OR+Ancestors%3D${descendant}+CategoryWord%3D${searchTerm}`;
                }
            }

            if (databaseSearch.slice(0,4) == '+NOT+') {
                databaseSearch = `${databaseSearch.slice(5)}`;
            } else if (databaseSearch.slice(0,4) == '+OR+') {
                databaseSearch = `${databaseSearch.slice(4)}`;
            } else {
                databaseSearch = `${databaseSearch.slice(1)}`;
            }

            const wtplusJson = await getWtPlusJson(databaseSearch);

            let wtPlusIdArray;
            if (wtplusJson['response']['found'] > 0) {
                wtPlusIdArray = wtplusJson['response']['profiles'];
            }
            if (wtPlusIdArray !== undefined) {
                combinedWtPlusIdArray = combinedWtPlusIdArray.concat(wtPlusIdArray);
            }
        }

        const matchingAncestors = []
        for (let i = 0; i < ancestors.length; i++) {
            let ancestorId = ancestors[i]['Id'];
            if (combinedWtPlusIdArray.indexOf(ancestorId) !== -1) {
                matchingAncestors.push(ancestors[i]);
            }
        }
        return matchingAncestors;
    }
}

function getWTPlusSearchPersons(descendant, ancestors) {


    const startingPersons = [descendant];

    const father = getPersonFromID(descendant['Father'], ancestors);
    let grandfather = getPersonFromID(father['Father'], ancestors);
    let grandmother = getPersonFromID(father['Mother'], ancestors);
    if (father['Id'] < 0 && grandfather['Id'] > 0 ) {
        startingPersons.push(grandfather);
    } else if (grandfather['Id'] < 0 ){
        let greatGrandfather = getPersonFromID(grandfather['Father'], ancestors);
        startingPersons.push(greatGrandfather);
        let greatGrandmother = getPersonFromID(grandfather['Mother'], ancestors);
        startingPersons.push(greatGrandmother);
    }
    if (father['Id'] < 0 && grandmother['Id'] > 0 ) {
        startingPersons.push(grandmother);
    } else if (grandmother['Id'] < 0 ){
        let greatGrandfather = getPersonFromID(grandmother['Father'], ancestors);
        startingPersons.push(greatGrandfather);
        let greatGrandmother = getPersonFromID(grandmother['Mother'], ancestors);
        startingPersons.push(greatGrandmother);
    }

    const mother = getPersonFromID(descendant['Mother'], ancestors);
    grandfather = getPersonFromID(mother['Father'], ancestors);
    grandmother = getPersonFromID(mother['Mother'], ancestors);
    if (mother['Id'] < 0 && grandfather['Id'] > 0 ) {
        startingPersons.push(grandfather);
    } else if (grandfather['Id'] < 0 ){
        let greatGrandfather = getPersonFromID(grandfather['Father'], ancestors);
        startingPersons.push(greatGrandfather);
        let greatGrandmother = getPersonFromID(grandfather['Mother'], ancestors);
        startingPersons.push(greatGrandmother);
    }
    if (mother['Id'] < 0 && grandmother['Id'] > 0 ) {
        startingPersons.push(grandmother);
    } else if (grandmother['Id'] < 0 ){
        let greatGrandfather = getPersonFromID(grandmother['Father'], ancestors);
        startingPersons.push(greatGrandfather);
        let greatGrandmother = getPersonFromID(grandmother['Mother'], ancestors);
        startingPersons.push(greatGrandmother);
    }

    return startingPersons;
}

function getPersonFromID(personID, ancestors) {
    for (let i=0; i<ancestors.length; i++) {
        if (ancestors[i]['Id'] === personID) {
            return ancestors[i];
        }
    }
}