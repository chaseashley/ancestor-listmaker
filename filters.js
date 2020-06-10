/* This module contains functions that check a list of ancestors against a particular criteria and return
** those that match */

export function filterOrphans(ancestors) {
    let matchingAncestors = [];
    for (let i = 0; i < ancestors.length; i++) {
        if (ancestors[i]['Manager'] === 0) {
            let test = ancestors[i];
            matchingAncestors.push(ancestors[i]);
        }
    }
    return matchingAncestors;
}

export function filterLocationText(ancestors, locationText) {
    //uppercase text and remove commas
    locationText = locationText.replace(/[&\/\\#+()$~%'":*?<>{}]/g, '');
    locationText = locationText.replace('.','').toUpperCase();
    
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
            if (searchTerm[0] === '!') {
                rxOmitText = rxOmitText + searchTerm.slice(1) + '|';
            } else {
                rxText = rxText + searchTerm + '|';
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
         return matchingAncestors;
    }
}

export function filterCanadianImmigrants(ancestors) {
    const regex = /Canada| Can| CAN|Nouvelle-France|Nouvelle France|Quebec|Québec|Nova Scotia|N.S.|New Brunswick|N.B.|Newfoundland|Ontario|Prince Edward Island|P.E.I.|British Columbia|B.C.|Alberta|Manitoba|Northwest Territories|Labrador|Nunavut|Saskatchewan|Yukon|Acadie|Acadia/;
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
    const regex = /United States of America|United States|USA|U.S.A|Alabama|AL|Alaska|AK|Arizona|AZ|Arkansas|AR|California|CA|Colorado|CO|Connecticut|CT|Delaware|DE|Florida|FL|Georgia|GA|Hawaii|HI|Idaho|ID|Illinois|IL|Indiana|IN|Iowa|IA|Kansas|KS|Kentucky|KY|Louisiana|Maine|ME|Maryland|MD|Massachusetts|MA|Michigan|MI|Minnesota|MN|Mississippi|MS|Missouri|MO|Montana|MT|Nebraska|NE|Nevada|NV|New Hampshire|NH|New Jersey|NJ|New Mexico|NM|New York|NY|North Carolina|NC|North Dakota|Ohio|OH|Oklahoma|OK|Oregon|OR|Pennsylvania|PA|Rhode Island|RI|South Carolina|SC|South Dakota|SD|Tennessee|TN|Texas|TX|Utah|UT|Vermont|VT|Virginia|VA|Washington|WA|West Virginia|WV|Wisconsin|WI|Wyoming|WY|Plymouth Colony|New Haven|Long Island/;
    let matchingAncestors = [];
    for (let i = 0; i < ancestors.length; i++) {
        if (!regex.test(ancestors[i]['BirthLocation']) && regex.test(ancestors[i]['DeathLocation'])) {
            matchingAncestors.push(ancestors[i]);
        }
     }
     return matchingAncestors;
}

export function filterCategoryPages(ancestors, categoryPages) {
    const matchingAncestors = [];
    for (let i = 0; i < ancestors.length; i++) {
        let ancestorName = ancestors[i]['Name'];
        if (categoryPages.indexOf(`/${ancestorName}*`) !== -1) {
            matchingAncestors.push(ancestors[i]);
        }
        if (ancestorName.indexOf(' ') !==-1) {
            let ancestorNameWithoutUnderline = ancestorName.replace(' ', '_');
            if (categoryPages.indexOf(`/${ancestorNameWithoutUnderline}*`) !== -1) {
                matchingAncestors.push(ancestors[i]);
            }
        }
    }
    return matchingAncestors;
}

/* Removes duplicate ancestor objects from an array */
export function removeDuplicates(arr) {
    return arr.reduce(function (p, c) {
        // if the next object's id is not found in the output array
        // push the object into the output array
        if (!p.some(function (el) {return el['Name'] === c['Name']; })) p.push(c);
        return p;
      }, []);
}