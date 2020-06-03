/* This module contains functions for retrieving a list of ancetors back a specificied number of generations */
const fetch = require("node-fetch");

/* Makes a getAncestors call to the wikitree api in order to fetch all ancestors of descendantName back numGen
** generations; strips out list of ancestor profile objects from returned json and removes duplicate profiles
** and returns and ancestors array of non-duplicate ancestor profile objects */
export async function getAncestors(descendantName, numGens) {
    let gens;
    if (numGens < 10) {
        gens = numGens;
    } else {
        gens = 10;
    }
    const url = `https://api.wikitree.com/api.php?action=getAncestors&key=${descendantName}&depth=${gens}`;
    try {
        const response = await fetch(url);
        const jsonResponse = await response.json();
        let ancestors = await jsonResponse[0]['ancestors'].slice(1); //strip response down to array of ancestor objects
        return ancestors = removeDuplicates(ancestors);
    } catch(err) {
        alert('Unable to collect ancestors. The Wikitree ID may be incorrect or the Descendant\'s family tree may be private.');
        console.log(err);
        return null;
    }
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

/* Checks if each ancestor in the ancestors array has a parent who is not also included in the ancestors
** array and returns an array of those ancestors who are missing a parent */
function createAncestorsMissingParents(ancestors){
    const ancestorsMissingParents = [];
    ancestors.forEach((ancestor) => {
        if (missingParent(ancestor, ancestors)) {
            ancestorsMissingParents.push(ancestor['Name']);
        }
    })
    return ancestorsMissingParents;
}

/* Checks to see if both of an ancestor's parents are unknown or are in the list of ancestors;
** returns true if a parent exists that is not in the list of ancestors. Used in createAncestorsMissingParents */
function missingParent(ancestor, ancestors){
    let missingFather = true;
    let missingMother = true;
    if (ancestor['Father']<=0){
        missingFather = false;
    } else {
        for(let i=0; i < ancestors.length; i++) {
            if (ancestor['Father']===ancestors[i]['Id']){
                missingFather = false;
                break;
            }
        };
    }
    if (ancestor['Mother']<=0){
        missingMother = false;
    } else {
        for(let i=0; i < ancestors.length; i++) {
            if (ancestor['Mother']===ancestors[i]['Id']){
                missingMother = false;
                break;
            }
        };
    }
    if (missingFather || missingMother) {
        return true;
    } else {
        return false;
    }
}

/* Fetches additionalGens of each ancestor in ancestorsMissingParents;
** returns additionalAncestors array that contains the additional ancestors */ 
async function getAdditionalAncestors(ancestorsMissingParents, additionalGens) {
    let ancestorCallUrls = [];
    ancestorsMissingParents.forEach((ancestorName) => {
        const url = `https://api.wikitree.com/api.php?action=getAncestors&key=${ancestorName}&depth=${additionalGens}`;
        ancestorCallUrls.push(url);
    })
    const ancestorRequests = [];
    ancestorCallUrls.forEach((callUrl) => {
        ancestorRequests.push(getData(callUrl))
    })
    let result = await Promise.all(ancestorRequests).then((additionalAncestorData) => {
        let additionalAncestors = [];
        additionalAncestorData.forEach((additionalAncestor) => {
            let additionalAncestorSelectedData = additionalAncestor[0]['ancestors'].slice(1);
            additionalAncestors = additionalAncestors.concat(additionalAncestorSelectedData);
        })
        additionalAncestors = removeDuplicates(additionalAncestors);
        return additionalAncestors;
    })
    console.log(4);
    return result;
}

/* fetches json of a profile; used in getAdditionalAncestors */
function getData(url) {
    return new Promise((resolve, reject) => {
        fetch_retry(url, 5)
            .then((resp) => resp.json())
            .then((data) => {resolve(data)})
            .catch((err) => {console.log(err)})
    })
}

/* fetches a profile; tries n times; used in getData */
function fetch_retry(url, n) {
    return fetch(url).catch(function(error) {
        if (n === 1) throw error;
        return fetch_retry(url, n - 1);
    })
}

export async function getAdditionalGens(ancestors, nextGens){
    const ancestorsMissingParents = createAncestorsMissingParents(ancestors);
    const additionalAncestors = await getAdditionalAncestors(ancestorsMissingParents, nextGens);
    ancestors = ancestors.concat(additionalAncestors);
    ancestors = removeDuplicates(ancestors);
    return ancestors;
}

export function deletePrivateProfiles(ancestors) {
    return ancestors.filter(x=>x['Id']>1);
}

export function replaceUndefinedFields(ancestors) {
    for (let i=0; i<ancestors.length; i++) {
        if (ancestors[i]['BirthDate'] === undefined) {
            ancestors[i]['BirthDate'] = '';
        }
        if (ancestors[i]['DeathDate'] === undefined) {
            ancestors[i]['DeathDate'] = '';
        }
        if (ancestors[i]['BirthLocation'] === undefined) {
            ancestors[i]['BirthLocation'] = '';
        }
        if (ancestors[i]['DeathLocation'] === undefined) {
            ancestors[i]['DeathLocation'] = '';
        }
        if (ancestors[i]['FirstName'] === undefined) {
            ancestors[i]['FirstName'] = ancestors[i]['RealName'];
        }
    }
    return ancestors;
}