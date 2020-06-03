const axios = require('axios');

/* Fetch and return string containing all pages listing links to a particular category */
export async function getCategoryPages(category) {
    // pageInfo holds the url and next page link info for the various categories
    const categoryUrl = {
        'American Revolution': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:1776&limit=5000&from=0',
        'European Royals and Aristocrats': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:European_Royals_and_Aristocrats&limit=5000&from=0',
        'Filles du Roi': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Filles_du_Roi&limit=5000',
        'French and Indian War': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:French_and_Indian_War&limit=500&from=0',
        'Huguenot': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Huguenot&limit=5000',
        'Huguenot Ancestor': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Huguenot_Ancestor&limit=5000&from=0',
        'Huguenot Emigrant': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Huguenot_Emigrant&limit=5000',
        'Huguenot Emigrant Family': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Huguenot_Emigrant_Family&limit=5000',
        'Huguenot non-Emigrant': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Huguenot_non-Emigrant&limit=500',
        'Jamestown': 'https://www.wikitree.com/wiki/Category:Jamestowne_Society_Qualifying_Ancestors',
        'Magna Carta Gateway': 'https://www.wikitree.com/wiki/Category:Gateway_Ancestors',
        'Mayflower Passengers': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Mayflower_Passenger&limit=500&from=0',
        'Mexican-American War': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Mexican-American_War&limit=5000&from=0',
        'New England Witches': 'https://www.wikitree.com/wiki/Category:Accused_Witches_of_New_England',
        'New Netherland Settlers': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:New_Netherland_Settler&limit=5000&from=0',
        'Notables': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Notables_Sticker&limit=5000&from=0',
        'Palatine Migration': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Palatine_Migration&limit=5000&from=0',
        'Puritan Great Migration': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Puritan_Great_Migration&limit=5000&from=0',
        'Quakers': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Quakers_Sticker&limit=5000&from=0',
        'U.S. Civil War': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:US_Civil_War&limit=5000&from=0'
        }

    const url = categoryUrl[category];

    // Get first page of category links
    let page = await getPage(url);
    let pages = page;

    console.log(pages.length);
    let nextLinkUrl = getNextLinkUrl(page);
    while (nextLinkUrl !== '') {
        // get next page
        page = await getPage(nextLinkUrl);
        // add new page to prior pages
        pages = pages + page;
        console.log(pages.length);
        // check if new page has a next page link; if so, loop
        nextLinkUrl = getNextLinkUrl(page);
    }
    return pages;
}

/* Uses axios to get page from url */
async function getPage(url) {
    return axios.get(url)
    .then(response => {
        return response.data;
    })
    .catch(error => {
        console.log(error);
    })
}

/* Deletes "amp;"" from url */
function deleteAmp(str) {
    let ampIndex = str.indexOf('amp;');
    while (ampIndex !== -1) {
        str = str.slice(0,ampIndex) + str.slice(ampIndex + 4);
        ampIndex = str.indexOf('amp;');
    }
    return str;
}

function getNextLinkUrl(page) {
    const nextLoc = page.indexOf('>next ');
    if (nextLoc === -1) {return ''};
    const endATag = page.indexOf('</a>', nextLoc);
    const nextNum = page.substring(nextLoc + 5, endATag).trim();
    const noCommaNextNum = +nextNum.replace(/,/g, '');
    if (isNaN(noCommaNextNum)) {return ''};
    const startATag = page.lastIndexOf('<a href=', nextLoc);
    if (startATag === -1 || (nextLoc - startATag) > 200) {return ''};
    const startOfNextUrl = startATag + 9;
    const endOfNextUrl = page.indexOf('"', startOfNextUrl);
    if (endOfNextUrl === -1 || endOfNextUrl > nextLoc) {
        return '';
    } else {
        let url = 'https://www.wikitree.com/' + page.substring(startOfNextUrl + 1, endOfNextUrl);
        return deleteAmp(url);
    }
}
