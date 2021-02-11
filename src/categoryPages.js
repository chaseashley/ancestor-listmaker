const axios = require('axios');
const cheerio = require('cheerio');

/* Fetch and return string containing all pages listing links to a particular category */
async function getCategoryArefs(category) {
    // pageInfo holds the url and next page link info for the various categories
    const categoryUrl = {
        'American Revolution Project': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:1776_Project&limit=500&from=0',
        'American Revolution Old Sticker': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:1776&limit=5000&from=0',
        'American Revolution New Sticker': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:1776_Sticker&limit=5000&from=0',
        'Arbroath Signatories': 'https://www.wikitree.com/wiki/Category:Declaration_of_Arbroath',
        'British Aristo': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:British_Isles_Aristo&limit=5000&from=0',
        'Domesday': 'https://www.wikitree.com/wiki/Category:Domesday_Book',
        'EuroAristo': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:EuroAristo_Sticker&limit=5000&from=0',
        'European Aristocrat': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:European_Aristocrat&limit=5000&from=0',
        'European Royals and Aristocrats': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:European_Royals_and_Aristocrats&limit=5000&from=0',
        'Filles du Roi': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Filles_du_Roi&limit=5000',
        'French and Indian War Project': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:French_and_Indian_War_Project&limit=500&from=0',
        'French and Indian War Sticker': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:French_and_Indian_War&limit=500&from=0',
        'Huguenot': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Huguenot&limit=5000',
        'Huguenot Ancestor': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Huguenot_Ancestor&limit=5000&from=0',
        'Huguenot Emigrant': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Huguenot_Emigrant&limit=5000',
        'Huguenot Emigrant Family': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Huguenot_Emigrant_Family&limit=5000',
        'Huguenot non-Emigrant': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Huguenot_non-Emigrant&limit=500',
        'Jamestown': 'https://www.wikitree.com/wiki/Category:Jamestowne_Society_Qualifying_Ancestors',
        'Magna Carta Gateway': 'https://www.wikitree.com/wiki/Category:Gateway_Ancestors',
        'Mayflower Passengers': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Mayflower_Passenger&limit=500&from=0',
        'Mexican-American War Project': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Mexican-American_War_Project&limit=5000&from=0',
        'Mexican-American War Sticker': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Mexican-American_War&limit=5000&from=0',
        'Native Americans Project': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Native_American&limit=5000&from=0',
        'Native Americans Sticker': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Native_American_Sticker&limit=5000&from=0',
        'New England Witches': 'https://www.wikitree.com/wiki/Category:Accused_Witches_of_New_England',
        'New Netherland Settler': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:New_Netherland_Settler&limit=5000&from=0',
        'New Netherland Settler Sticker': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:New_Netherland_Settler_Sticker&limit=5000&from=0',
        'Notables Project': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Notables&limit=5000&from=0',
        'Notables Sticker': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Notables_Sticker&limit=5000&from=0',
        'NSDAR': 'https://www.wikitree.com/wiki/Category:NSDAR_Patriot_Ancestors',
        'NSSAR': 'https://www.wikitree.com/wiki/Category:NSSAR_Patriot_Ancestors',
        'Palatine Migration': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Palatine_Migration&limit=5000&from=0',
        'Puritan Great Migration': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Puritan_Great_Migration&limit=5000&from=0',
        'Quakers Project': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Quakers_Project&limit=500&from=0',
        'Quakers Sticker': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:Quakers_Sticker&limit=5000&from=0',
        'Scottish Monarchs': 'https://www.wikitree.com/wiki/Category:Scottish_Royalty',
        'US Civil War Project': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:US_Civil_War_Project&limit=5000&from=0',
        'US Civil War Sticker': 'https://www.wikitree.com/index.php?title=Special:Whatlinkshere/Template:US_Civil_War&limit=5000&from=0'
        }

    const url = categoryUrl[category];

    // Get first page of category links
    let page = await getPage(url);
    // Use Cheerio to extract just the link text, preceding by a '/' and followed by a '*' to set it off
    let ahrefs = extractAhrefs(page);

    let nextLinkUrl = getNextLinkUrl(page);
    while (nextLinkUrl !== '') {
        // get next page
        page = await getPage(nextLinkUrl);
        // Use Cheerio to extract just the link text, preceding by a '/' and followed by a '*' to set it off
        let newAhrefs = extractAhrefs(page);
        // add new page to prior pages
        ahrefs = ahrefs + newAhrefs;
        // check if new page has a next page link; if so, loop
        nextLinkUrl = getNextLinkUrl(page);
    }
    return ahrefs;
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
    let nextLoc = page.indexOf('>next ');
    if (nextLoc === -1) {
        nextLoc = page.indexOf('>Next ');
        if (nextLoc === -1) {
            return '';
        }
    }
    const endATag = page.indexOf('<', nextLoc);
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

function extractAhrefs (page) {
    const $ = cheerio.load(page);
    let ahrefPage = '';
    $('a').each(function(i,elem) {
        const link = $(this).attr('href');
        if(link && link.match('/wiki/')){
            const url = $(this).attr('href');
            const slashLoc = url.lastIndexOf('/');
            const slashAndWtId = url.slice(slashLoc) + '*';
            ahrefPage = ahrefPage + slashAndWtId;
        };
    });
    return ahrefPage;
}

export async function getAllRelatedCategoryArefs(category) {
    let categoryArefs;
    if (category === 'Huguenot') {
        const huguenotArefs = await getCategoryArefs('Huguenot');
        const huguenotAncestorArefs = await getCategoryArefs('Huguenot Ancestor');
        const huguenotEmigrantArefs = await getCategoryArefs('Huguenot Emigrant');
        const huguenotEmigrantFamilyArefs = await getCategoryArefs('Huguenot Emigrant Family');
        const huguenotNonEmigrantArefs = await getCategoryArefs('Huguenot non-Emigrant');
        categoryArefs = huguenotArefs + huguenotAncestorArefs + huguenotEmigrantArefs +  huguenotEmigrantFamilyArefs + huguenotNonEmigrantArefs;
    } else if (category === 'Quakers') {
        const quakersProjectArefs = await getCategoryArefs('Quakers Project');
        const quakersStickerArefs = await getCategoryArefs('Quakers Sticker');
        categoryArefs = quakersProjectArefs + quakersStickerArefs;
    } else if (category === 'American Revolution') {
        const amRevProjectArefs = await getCategoryArefs('American Revolution Project');
        const amRevOldStickerArefs = await getCategoryArefs('American Revolution Old Sticker');
        const amRevNewStickerArefs = await getCategoryArefs('American Revolution New Sticker');
        const nsdarArefs = await getCategoryArefs('NSDAR');
        const nssarArefs = await getCategoryArefs('NSSAR');
        categoryArefs = amRevProjectArefs + amRevOldStickerArefs + amRevNewStickerArefs + nsdarArefs + nssarArefs;
    } else if (category === 'US Civil War') {
        const usCivilWarProjectArefs = await getCategoryArefs('US Civil War Project');
        const usCivilWarStickerArefs = await getCategoryArefs('US Civil War Sticker');
        categoryArefs = usCivilWarProjectArefs + usCivilWarStickerArefs;
    } else if (category === 'European Aristocrats') {
        const britishAristoArefs = await getCategoryArefs('British Aristo');
        const euroAristoArefs = await getCategoryArefs('EuroAristo');
        const euroAristocratArefs = await getCategoryArefs('European Aristocrat');
        const euroRoyalOrAristoArefs = await getCategoryArefs('European Royals and Aristocrats');
        categoryArefs = britishAristoArefs + euroAristoArefs + euroAristocratArefs + euroRoyalOrAristoArefs;
    } else if (category === 'French and Indian War') {
        const fandIWarProjectArefs = await getCategoryArefs('French and Indian War Project');
        const fandIWarStickerArefs = await getCategoryArefs('French and Indian War Sticker');
        categoryArefs = fandIWarProjectArefs + fandIWarStickerArefs;
    } else if (category === 'Mexican-American War') {
        const mexAmWarProjectArefs = await getCategoryArefs('Mexican-American War Project');
        const mexAmWarStickerArefs = await getCategoryArefs('Mexican-American War Sticker');
        categoryArefs = mexAmWarProjectArefs + mexAmWarStickerArefs;
    } else if (category === 'Native Americans') {
        const nativeAmProjectArefs = await getCategoryArefs('Native Americans Project');
        const nativeAmStickerArefs = await getCategoryArefs('Native Americans Sticker');
        categoryArefs = nativeAmProjectArefs + nativeAmStickerArefs;
    } else if (category === 'New Netherland Settlers') {
        const newNetherlandSettlerArefs = await getCategoryArefs('New Netherland Settler');
        const newNetherlandSettlerStickerArefs = await getCategoryArefs('New Netherland Settler Sticker');
        categoryArefs = newNetherlandSettlerArefs + newNetherlandSettlerStickerArefs;
    } else if (category === 'Notables') {
        const notablesProjectArefs = await getCategoryArefs('Notables Project');
        const notablesStickerArefs = await getCategoryArefs('Notables Sticker');
        categoryArefs = notablesProjectArefs + notablesStickerArefs;    
    } else {
        categoryArefs = await getCategoryArefs(category);
    }
    return decodeURI(categoryArefs);
}
