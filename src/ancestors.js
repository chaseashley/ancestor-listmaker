/* This module contains functions for retrieving a list of ancetors back a specificied number of generations */
//const fetch = require("node-fetch");

/*use axios get rather than fetch because for some reason a simple fetch was causing an
a pre-fligth OPTIONS request in Firefox and Safari
*/

import { removeDuplicates } from './filters';
const axios = require('axios'); 

export function get_retry(url, n) {
  return axios.get(url)
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('first error n=',n);
        console.log('response.date', error.response.data);
        console.log('response.status', error.response.status);
        console.log('response.headers', error.response.headers);
        if (error.response.status !== 500 || n === 1) {
          /*
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);*/
        } else {
          return get_retry(url, n-1);
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('second error n=',n);
        console.log(error.request);
        if (n === 1) {
          //console.log(error.request);
        } else {
          return get_retry(url, n-1);
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
}

/* Makes a getAncestors call to the wikitree api in order to fetch all ancestors of descendantName back numGen
** generations; strips out list of ancestor profile objects from returned json and removes duplicate profiles
** and returns and ancestors array of non-duplicate ancestor profile objects */
export async function getAncestorsJson(descendantName, numGens) {
    let gens;
    if (numGens < 10) {
        gens = numGens;
    } else {
        gens = 10;
    }
    const url = `https://api.wikitree.com/api.php?action=getAncestors&key=${descendantName}&depth=${gens}`;
    try {
        const response = await get_retry(url,1);
        const condensedAncestorJson = condenseAncestorsJson(response.data);
        //const jsonResponse = await response.json();
        //const condensedAncestorJson = condenseAncestorsJson(jsonResponse);
        return condensedAncestorJson;
    } catch(err) {
        alert('Unable to collect ancestors. The Wikitree ID may be incorrect or Descendant\'s profile may Unlisted or Private. The app will only work for a Descendant whose privacy level is set to Private with Public Family Tree, Private with Public Biography and Family Tree, Public, or Open.');
        console.log(err);
        return null;
    }
}

function condenseAncestorsJson(jsonReponse) {
    const ancestors = jsonReponse[0]['ancestors'];
    const condensedJsonResponse = [];
    for (let i=0; i<ancestors.length; i++) {
        let p = ancestors[i];
        condensedJsonResponse.push({
            'Id':p['Id'],
            'Name':p['Name'],
            'FirstName':p['FirstName'],
            'RealName':p['RealName'],
            'LastNameAtBirth':p['LastNameAtBirth'],
            'BirthDate':p['BirthDate'],
            'DeathDate':p['DeathDate'],
            'BirthLocation':p['BirthLocation'],
            'DeathLocation':p['DeathLocation'],
            'Father':p['Father'],
            'Mother':p['Mother'],
            'Manager':p['Manager'],
            'BirthName':p['BirthName'],
            'BirthNamePrivate':p['BirthNamePrivate']});
    }
    return condensedJsonResponse;
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
            //let additionalAncestorSelectedData = additionalAncestor[0]['ancestors'].slice(1);
            let additionalAncestorSelectedData = condenseAncestorsJson(additionalAncestor);
            additionalAncestors = additionalAncestors.concat(additionalAncestorSelectedData);
            //additionalAncestors = additionalAncestors.concat(additionalAncestor);
        })
        return additionalAncestors;
    })
    return result;
}

/* fetches json of a profile; used in getAdditionalAncestors
function getData(url) {
    return new Promise((resolve, reject) => {
        fetch_retry(url, 5)
            .then((resp) => resp.json())
            .then((data) => {resolve(data)})
            .catch((err) => {console.log(err)})
    })
}*/

function getData(url) {
    return new Promise((resolve, reject) => {
        get_retry(url, 5)
            .then((resp) => resp.data)
            .then((data) => {resolve(data)})
            .catch((err) => {console.log(err)})
    })
}

/* fetches a profile; tries n times; used in getData
function fetch_retry(url, n) {
    return fetch(url).catch(function(error) {
        if (n === 1) throw error;
        return fetch_retry(url, n - 1);
    })
}*/

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
        if (ancestors[i]['BirthName'] === undefined) {
            ancestors[i]['BirthName'] = ancestors[i]['BirthNamePrivate'];
        }
        if (ancestors[i]['Name'] === undefined) {
            ancestors[i]['Name'] = 'Private';
        }
    }
    return ancestors;
}