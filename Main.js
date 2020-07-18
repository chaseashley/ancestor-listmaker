import React from 'react';
import styles from './appstyles.module.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { CSVLink } from "react-csv";
import { getAncestorsJson, getAdditionalGens, replaceUndefinedFields, deletePrivateProfiles } from './ancestors';
import { getAllRelatedCategoryArefs } from "./categoryPages";
import { getMultiples, filterEnglishMonarchs, filterCompanionsOfTheConqueror, filterMCSuretyBarons, filterCategoryText, filterByWikiTreePlus, filterUnknownFather, filterUnknownMother, filterOrphans, filterLocationText, filterUSImmigrants, filterAustralianImmigrants, filterCanadianImmigrants, filterCategoryArefs, removeDuplicates } from './filters';
import { Table } from './Table';
import { sortByName, sortByDOB, sortByDOD, sortByPOB, sortByPOD, sortByAhnen } from './sort';
import { AhnenTable } from './AhnenTable';
import { addGensAndAhnens} from './ahnentafel';
import db from './db';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onClickNameSort = this.onClickNameSort.bind(this);
    this.onClickDOBSort = this.onClickDOBSort.bind(this);
    this.onClickDODSort = this.onClickDODSort.bind(this);
    this.onClickPOBSort = this.onClickPOBSort.bind(this);
    this.onClickPODSort = this.onClickPODSort.bind(this);
    this.onClickAhnenSort = this.onClickAhnenSort.bind(this);
    this.getDownloadData = this.getDownloadData.bind(this);
    this.onClickPrematureDownload = this.onClickPrematureDownload.bind(this);
    this.onChangeAhnen = this.onChangeAhnen.bind(this);
    this.state = {
      descendant: '',
      lastDescendant: '',
      category: null,
      lastCategory: null,
      locationText: '',
      lastLocationText: '',
      categoryText: '',
      lastCategoryText: '',
      generations: null,
      lastGenerations: null,
      ahnentafel: false,
      lastAhnentafel: false,
      fullname: false,
      lastFullname: false,
      multiples: false,
      lastMultiples: false,
      descendantJson: null,
      ancestors: null,
      matchingAncestors: null,
      matchingMultiples: null,
      processingStatus: null,
      lastSort: '',
      ancestorLists: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], //1-20 gens
      'American Immigrants': null,
      'American Revolution': null,
      'Arbroath Signatories': null,
      'European Aristocrats': null,
      'Filles du Roi': null,
      'French and Indian War': null,
      'Huguenot': null,
      'Jamestown': null,
      'Magna Carta Gateway': null,
      'Mayflower Passengers': null,
      'Mexican-American War': null,
      'Native Americans': null,
      'New England Witches': null,
      'New Netherland Settlers': null,
      'Notables': null,
      'Palatine Migration': null,
      'Puritan Great Migration': null,
      'Quakers': null,
      'Scottish Monarchs': null,
      'US Civil War': null,
      categoryOptions: [
        {value:'All', label: 'All - All ancestors'},
        {value:'American Immigrants', label: 'American Immigrants - Ancestors who immigrated or may have immigrated to America (USA or areas that became a part thereof), as indicated by the birth and death locations on their profiles'},
        {value:'American Revolution', label: 'American Revolution - Ancestors who participated in the American Revolution, as indicated by the 1776 sticker or project template on their profile or their inclusion in the NSDAR or NSSAR Patriot Ancestor categories'},
        {value:'Arbroath Signatories', label: 'Arbroath Signatories - Ancestors who signed the Declaration of Arbroath. Note that since the Declaration was signed in 1320, Signatory ancestors of a living Descendant may be further than 20 generations back.'},
        {value:'Australian Immigrants', label: 'Australian Immigrants - Ancestors who immigrated or may have immigrated to Australia (or areas that became a part thereof), as indicated by the birth and death locations on their profiles'},
        {value:'Canadian Immigrants', label: 'Canadian Immigrants - Ancestors who immigrated or may have immigrated to Canada (or areas that became a part thereof), as indicated by the birth and death locations on their profiles'},
        {value:'Category Text', label: 'Category Text - Ancestors who are in a category whose name contains the search terms you enter. When this list option is selected, a text box will appear in which to enter the search terms.'},
        {value:'Companions of the Conqueror', label: 'Companions of the Conqueror - Ancestors who fought with William the Conqueror at the Battle of Hastings. Generally only useful for Descendants born before 1700 since the Companions are at least 30 generations back from living people.'},
        {value:'English Monarchs', label: 'English Monarchs - Ancestors who were English monarchs'},
        {value:'European Aristocrats', label: 'European Aristocrats - Ancestors who were European aristocrats, as indicated by the presence of the EuroAristo sticker or the British Isles Aristo, European Aristocrat, or European Royals and Aristocrats template on their profile'},
        {value:'Filles du Roi', label: 'Filles du Roi - Ancestors who were among the Filles du Roi, as indicated by the presence of the Filles du Roi template on their profile'},
        {value:'Five-Star Profiles', label: 'Five-Star Profiles - Ancestors whose profiles have had 1,000 or more total page views and 100 or more different visitors in the past year. (Note that the ancestor data used for this list is only updated weekly.)'},
        {value:'French and Indian War', label: 'French and Indian War - Ancestors who participated in the French and Indian War, as indicated by the presence of the French and Indian War sticker or project template on their profile'},
        {value:'GEDCOM Junk', label: 'GEDCOM Junk - Ancestors whose profiles contain headings considered GEDCOM junk. (Note that the ancestor data used for this list is only updated weekly.)'},
        {value:'Huguenot', label: 'Huguenot - Ancestors who were Huguenots, as indicated by the presence of the Huguenot, Huguenot Ancestor, Huguenot Emigrant, Huguenot Emigrant Family or Huguenot non-Emigrant template on their profile'},
        {value:'Jamestown', label: 'Jamestown - Ancestors who are Jamestowne Society Qualifying Ancestors, as indicated by their inclusion in the Jamestowne Society Qualifying Ancestors category'},
        {value:'Location Text', label: 'Location Text - Ancestors whose Birth or Death Location fields contain the search terms you enter. When this list option is selected, a text box will appear in which to enter the search terms.'},
        {value:'Magna Carta Gateway', label: 'Magna Carta Gateway - Ancestors who were U.S. immigrants descended from a Magna Carta Surety Baron, as indicated by their inclusion in the Gateway Ancestors category'},
        {value:'Magna Carta Surety Barons', label: 'Magna Carta Surety Barons - Ancestors who were Magna Carta Surety Barons. Generally only useful if Descendant is at least 3 gens before living people since the Barons are generally at least 23 gens back from living people.'},
        {value:'Mayflower Passengers', label: 'Mayflower Passengers - Ancestors who were passengers on the Mayflower, as indicated by the presence of the Mayflower Passenger template on their profile'},
        {value:'Mexican-American War', label: 'Mexican-American War - Ancestors who participated in the Mexican-American War, as indicated by the presence of the Mexican-American War sticker or project template on their profile'},
        {value:'Native Americans', label: 'Native Americans - Ancestors who were Native Americans, as indicated by the presence of the Native American sticker or project template on their profile'},
        {value:'New Netherland Settlers', label: 'New Netherland Settlers - Ancestors who lived in New Netherland before 1675, as indicated by the presence of the New Netherland Settler sticker or project template on their profile'},
        {value:'Notables', label: 'Notables - Ancestors who have the Notables sticker on their profile'},
        {value:'Orphans', label: 'Orphans - Ancestors whose profiles do not currently have a Profile Manager'},
        {value:'Palatine Migration', label: 'Palatine Migration - Ancestors who immigrated to America from a German-speaking area of Europe in 1700-1776, as indicated by the presence of the Palatine Migration template on their profile'},
        {value:'Puritan Great Migration', label: 'Puritan Great Migration - Ancestors who immigrated to New England in 1621-1640, as indicated by the presence of the Puritan Great Migration template on their profile'},
        {value:'Quakers', label: 'Quakers - Ancestors who were Quakers, as indicated by the presence of the Quakers sticker or project template on their profile'},
        {value:'Scottish Monarchs', label: 'Scottish Monarchs - Ancestors who were Scottish monarchs'},
        {value:'Unknown/Missing Father', label: 'Unknown/Missing Father - Ancestors whose father\'s surname is "Unknown" or who have no father attached to their profile'},
        {value:'Unknown/Missing Mother', label: 'Unknown/Missing Mother - Ancestors whose mother\'s surname is "Unknown" or who have no mother attached to their profile'},
        {value:'Unsourced', label: 'Unsourced - Ancestors whose profiles have the Unsourced template on them. (Note that the ancestor data used for this list is only updated weekly.)'},
        {value:'US Civil War', label: 'U.S. Civil War - Ancestors who participated in the U.S. Civil War, as indicated by the presence of the US Civil War sticker or project template on their profile'},
        {value:'Witches', label: 'Witches - Ancestors accused as being witches, as indicated by their inclusion in a category including the terms "witches" and "accused." (Note that the ancestor data used for this list is only updated weekly.)'},
      ],
      generationOptions: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']
    };
  }

  ////////////// Helper functions for Find Ancestors handleClick
  setAncestorListsState(i, ancestors) {
    const newAncestorListsState = this.state.ancestorLists.slice(); //copy the array
    newAncestorListsState[i] = ancestors;
    this.setState({ancestorLists: newAncestorListsState}) //set the new state
  }

  nullAncestorListsState() {
    this.setState({ancestorLists: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]}); //1-20 gens
    this.setState({ahnenAncestorLists: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]}); //1-20 gens
  }

  ////////////////

  async onClickSubmit() { // the Find Ancestors button click event

    // First get named descendant's ancestors for the specified number of generations
    if (this.state.descendant === '' || this.state.category === null || this.state.generations === null) {
      alert('Make sure a Wikitree ID has been entered in the top text box and the number of generations and a category have been selected');
    } else if ((this.state.descendant !== null && this.state.category !== null && this.state.generations !== null) &&
        ((this.state.descendant !== this.state.lastDescendant) || (this.state.category !== this.state.lastCategory) || (this.state.generations !== this.state.lastGenerations))) {
      await this.setState({descendant: this.state.descendant.trim()})
      this.setState({processingStatus: 'Collecting'});
      let ancestors;
      if (this.state.descendant !== this.state.lastDescendant) { //new descendant, so null out the saved lists and start from scratch
        ancestors = await getAncestorsJson(this.state.descendant, this.state.generations);
        if (ancestors === null) { //will be null if there is a problem getting ancestors - eg ID number is not valid
          this.setState({processingStatus: null}); 
        } else {
          ancestors = replaceUndefinedFields(ancestors);
          this.setState({descendantJson: ancestors[0]});
          this.nullAncestorListsState();
          if (this.state.generations > 10 ) {
            this.setAncestorListsState(9,ancestors);
            ancestors = await getAdditionalGens(ancestors, this.state.generations-10);
          }
          this.setAncestorListsState(this.state.generations-1, ancestors);
        }
        await this.setState({processingStatus: 'CalculatingAhnentafel'});
        ancestors = addGensAndAhnens(ancestors);
        if (ancestors === null) {
          await this.setState({processingStatus: 'null'});
        }
        this.setState({ancestors: ancestors});
      } else if ((this.state.descendant === this.state.lastDescendant) && (this.state.generations !== this.state.lastGenerations)){ //same descendant, but diff number of gens, so need to get ancestors for that number of gens
        if (this.state.ancestorLists[this.state.generations-1] !== null) {
          ancestors = this.state.ancestorLists[this.state.generations-1];
        } else {
          if (this.state.generations <10) { //if less then 10, gens don't bother checking lower stored, just get
            ancestors = await getAncestorsJson(this.state.descendant, this.state.generations);
            if (ancestors === null) {
              this.setState({processingStatus: null}); 
            } else {
              ancestors = replaceUndefinedFields(ancestors);
              this.setState({descendantJson: ancestors[0]});
            }
          } else { // if gens >=10 use the next lower stored value
            if (this.state.ancestorLists[9] === null) { //nothing saved worth using, so start froms scratch
              ancestors = await getAncestorsJson(this.state.descendant, this.state.generations);
              if (ancestors === null) { //will be null if problem fetching ancestors - eg if Wikitree ID is invalid
                this.setState({processingStatus: null}); 
              } else {
                ancestors = replaceUndefinedFields(ancestors);
                this.setState({descendantJson: ancestors[0]});
                this.setAncestorListsState(9,ancestors);
                if (this.state.generations > 10) {
                  ancestors = await getAdditionalGens(ancestors, this.state.generations-10);
                }
              }
            } else {//is a nextLowestStoredGen >= 10
              ancestors = this.state.ancestorLists[9];
              ancestors = await getAdditionalGens(ancestors, this.state.generations-10);
            }
          }
          this.setAncestorListsState(this.state.generations-1, ancestors);
        }
        await this.setState({processingStatus: 'CalculatingAhnentafel'});
        ancestors = addGensAndAhnens(ancestors);
        if (ancestors === null) {
          await this.setState({processingStatus: 'null'});
        }
        this.setState({ancestors: ancestors});
      }
    }

    //Then filter the ancestors against the specified category/criteria and create a table of the matches
    if (this.state.ancestors !== null) {
      await this.setState({processingStatus: 'Filtering'});
      let matchingAncestors;
      if (this.state.descendant !== this.state.lastDescendant || this.state.category !== this.state.lastCategory ||
        this.state.generations !== this.state.lastGenerations || this.state.ahnentafel !== this.state.lastAhnentafel ||
        this.state.fullname !== this.state.lastFullname || this.state.multiples !== this.state.lastMultiples ||
        (this.state.category==='Location Text' && this.state.locationText !== this.state.lastLocationText) || 
        (this.state.category==='Category Text' && this.state.categoryText !== this.state.lastcategoryText) ){
        matchingAncestors = this.state.ancestors.slice(1); //take of Descendant so doesn't display in list of ancestors
        if (this.state.category !== 'All') {
          if (this.state.category === 'Orphans') {
            matchingAncestors = filterOrphans(matchingAncestors);
          } else if (this.state.category === 'American Immigrants') {
            matchingAncestors = filterUSImmigrants(matchingAncestors);
          } else if (this.state.category === 'Australian Immigrants') {
            matchingAncestors = filterAustralianImmigrants(matchingAncestors);
          } else if (this.state.category === 'Canadian Immigrants') {
            matchingAncestors = filterCanadianImmigrants(matchingAncestors);
          } else if (this.state.category === 'Location Text') {
            matchingAncestors = filterLocationText(matchingAncestors, this.state.locationText);
            await this.setState({lastLocationText: this.state.locationText});
          } else if (this.state.category === 'Category Text') {
            matchingAncestors = await filterCategoryText(this.state.descendantJson, matchingAncestors, this.state.categoryText);
            await this.setState({lastCategoryText: this.state.categoryText});
          } else if (this.state.category === 'Unknown/Missing Father') {
            matchingAncestors = filterUnknownFather(matchingAncestors);
          } else if (this.state.category === 'Unknown/Missing Mother') {
            matchingAncestors = filterUnknownMother(matchingAncestors);
          } else if (this.state.category === 'Unsourced') {
            matchingAncestors = await filterByWikiTreePlus(this.state.descendantJson, matchingAncestors, 'Unsourced');
          } else if (this.state.category === 'GEDCOM Junk') {
            matchingAncestors = await filterByWikiTreePlus(this.state.descendantJson, matchingAncestors, 'GEDCOM Junk');
          } else if (this.state.category === 'Five-Star Profiles') {
            matchingAncestors = await filterByWikiTreePlus(this.state.descendantJson, matchingAncestors, 'Five-Star Profiles');
          } else if (this.state.category === 'Witches') {
            matchingAncestors = await filterByWikiTreePlus(this.state.descendantJson, matchingAncestors, 'Witches');
          } else if (this.state.category === 'Companions of the Conqueror') {
            matchingAncestors = filterCompanionsOfTheConqueror(matchingAncestors);
          } else if (this.state.category === 'Magna Carta Surety Barons') {
            matchingAncestors = filterMCSuretyBarons(matchingAncestors);
          } else if (this.state.category === 'English Monarchs') {
            matchingAncestors = filterEnglishMonarchs(matchingAncestors);
          } else {
            if (this.state[this.state.category] === null) { // if no pages saved for the category, need to get them; otherwise use the save pages
              const categoryArefs = await getAllRelatedCategoryArefs(this.state.category);
              await this.setState({[this.state.category]: categoryArefs});
            }
            matchingAncestors = filterCategoryArefs(matchingAncestors, this.state[this.state.category]);
          }
        }
        matchingAncestors = deletePrivateProfiles(matchingAncestors);
        this.state.matchingMultiples = getMultiples(matchingAncestors);
        if (this.state.ahnentafel) {
          matchingAncestors = sortByAhnen(matchingAncestors, 'forward');
          await this.setState({lastSort: 'Ahnen'});
        } else {
          matchingAncestors = removeDuplicates(matchingAncestors);
          matchingAncestors = sortByName(matchingAncestors, 'forward');
          await this.setState({lastSort: 'Name'});
        }
        await this.setState({lastDescendant: this.state.descendant});
        await this.setState({lastGenerations: this.state.generations});
        await this.setState({lastCategory: this.state.category});
        await this.setState({matchingAncestors: matchingAncestors});
        await this.setState({lastAhnentafel: this.state.ahnentafel})
        await this.setState({lastFullname: this.state.fullname})
        await this.setState({lastMultiples: this.state.multiples})  
      } else {
        matchingAncestors = this.state.matchingAncestors;
      }
      await this.setState({processingStatus: 'Done'});
      db.table('main').put(JSON.stringify(this.state),0)
        .catch(function(e){alert('The ancestor data is too large to be stored. Therefore, if you use a link in the ancestor list to view an ancestral line and return to this page, you will need to generate the ancestor list again if you wish to see it. If you want to make the ancestor data small enough to be stored, try going back fewer generations.')});
    }
  }

  async onClickNameSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'Name') {
      newSortedMatchingAncestors = await sortByName(this.state.matchingAncestors, 'backward');
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = await sortByName(this.state.matchingAncestors, 'forward');
      this.setState({lastSort: 'Name'});
    }
    this.setState({matchingAncestors: newSortedMatchingAncestors});
    db.table('main').put(JSON.stringify(this.state),0).catch(function(e){console.log('Dixie IndexedDB error:',e)});
  }

  async onClickDOBSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'DOB') {
      newSortedMatchingAncestors = sortByDOB(this.state.matchingAncestors, false);
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = sortByDOB(this.state.matchingAncestors, true);
      this.setState({lastSort: 'DOB'});
    }
    this.setState({matchingAncestors: newSortedMatchingAncestors});
    db.table('main').put(JSON.stringify(this.state),0).catch(function(e){console.log('Dixie IndexedDB error:',e)});
  }

  async onClickDODSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'DOD') {
      newSortedMatchingAncestors = sortByDOD(this.state.matchingAncestors, false);
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = sortByDOD(this.state.matchingAncestors, true);
      this.setState({lastSort: 'DOD'});
    }
    this.setState({matchingAncestors: newSortedMatchingAncestors});
    db.table('main').put(JSON.stringify(this.state),0).catch(function(e){console.log('Dixie IndexedDB error:',e)});
  }

  async onClickPOBSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'POB') {
      newSortedMatchingAncestors = sortByPOB(this.state.matchingAncestors, false);
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = sortByPOB(this.state.matchingAncestors, true);
      this.setState({lastSort: 'POB'});
    }
    this.setState({matchingAncestors: newSortedMatchingAncestors});
    db.table('main').put(JSON.stringify(this.state),0).catch(function(e){console.log('Dixie IndexedDB error:',e)});
  }

  async onClickPODSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'POD') {
      newSortedMatchingAncestors = sortByPOD(this.state.matchingAncestors, false);
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = sortByPOD(this.state.matchingAncestors, true);
      this.setState({lastSort: 'POD'});
    }
    this.setState({matchingAncestors: newSortedMatchingAncestors});
    db.table('main').put(JSON.stringify(this.state),0).catch(function(e){console.log('Dixie IndexedDB error:',e)});
  }

  async onClickAhnenSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'Ahnen') {
      newSortedMatchingAncestors = await sortByAhnen(this.state.matchingAncestors, false);
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = await sortByAhnen(this.state.matchingAncestors, true);
      this.setState({lastSort: 'Ahnen'});
    }
    this.setState({matchingAncestors: newSortedMatchingAncestors});
    db.table('main').put(JSON.stringify(this.state),0).catch(function(e){console.log('Dixie IndexedDB error:',e)});
  }

  onChangeAhnen() {
    if (this.state.ahnentafel===false) {
      this.setState({ahnentafel: true});
    } else {
      this.setState({ahnentafel: false});
    }
  }

  getDownloadData(matchingAncestors) {
    let downloadData;
    if (this.state.lastAhnentafel) {
      downloadData = [['Gen-Ahnen', 'Name', 'Birth Date', 'Birth Location', 'Death Date', 'Death Location']];
      for (let i=0; i<matchingAncestors.length; i++) {
        const ancestor = this.state.matchingAncestors[i];
        let ancestorLink;
        if (this.state.lastFullname) {
          ancestorLink = `=HYPERLINK(""https://www.wikitree.com/wiki/${ancestor['Name']}""` + `,""${ancestor['BirthName']}"")`;
        } else {
          ancestorLink = `=HYPERLINK(""https://www.wikitree.com/wiki/${ancestor['Name']}""` + `,""${ancestor['BirthNamePrivate']}"")`;
        }
        const ancestorDownloadData = [[ancestor['Generation'] + '-' + ancestor['Ahnen'], ancestorLink, ancestor['BirthDate'], ancestor['BirthLocation'], ancestor['DeathDate'], ancestor['DeathLocation']]];
        downloadData = downloadData.concat(ancestorDownloadData);
      }
    } else {
      downloadData = [['Name', 'Birth Date', 'Birth Location', 'Death Date', 'Death Location']];
      for (let i=0; i<matchingAncestors.length; i++) {
        const ancestor = this.state.matchingAncestors[i];
        let ancestorLink;
        if (this.state.lastFullname) {
          ancestorLink = `=HYPERLINK(""https://www.wikitree.com/wiki/${ancestor['Name']}""` + `,""${ancestor['BirthName']}"")`;
        } else {
          ancestorLink = `=HYPERLINK(""https://www.wikitree.com/wiki/${ancestor['Name']}""` + `,""${ancestor['BirthNamePrivate']}"")`;
        }
        const ancestorDownloadData = [[ancestorLink, ancestor['BirthDate'], ancestor['BirthLocation'], ancestor['DeathDate'], ancestor['DeathLocation']]];
        downloadData = downloadData.concat(ancestorDownloadData);
      }
    }
    return downloadData;
  }

  onClickPrematureDownload() {
    if (this.state.ancestors === null) {
      alert('A list cannot be downloaded until it has first been generated');
    } else if (this.state.processingStatus !== 'Done') {
      alert('A list cannot be downnloaded until generation of the list has been completed');
    } else if (this.state.matchingAncestorsList.length === 0) {
      alert('A list cannot be downloaded unless it contains at least one ancestor');
    }
  }

  render() {
  
    let status;
    if (this.state.processingStatus === 'Collecting') {
      status = <div className={styles.statusElipsis}>Collecting ancestors</div>;
    } else if (this.state.processingStatus === 'CalculatingAhnentafel') {
      status = <div className={styles.statusElipsis}>Calculating generation and ahnentafel numbers</div>;
    } else if (this.state.processingStatus === 'Filtering') {
      status = <div className={styles.statusElipsis}>Collecting criteria information and filtering ancestors</div>;
    } else if (this.state.processingStatus === 'Reloading') {
      status = <div className={styles.statusElipsis}>Reloading ancestor data</div>;
    } else if (this.state.processingStatus === 'Done') {
      let sumOfCopies = 0;
      for (let [key, value] of Object.entries(this.state.matchingMultiples)) {
        sumOfCopies = sumOfCopies + value;
      }
      const uniqueMatches = removeDuplicates(this.state.matchingAncestors).length;
      const numberOfDupes = sumOfCopies - uniqueMatches;
      let meetsCategory;
      if (this.state.lastCategory === 'All') {
        meetsCategory = '';
      } else if (uniqueMatches !== 1) {
        meetsCategory = ` who meet the ${this.state.lastCategory} list criteria`;
      } else {
        meetsCategory = ` who meets the ${this.state.lastCategory} list criteria`;
      }
      let talkAboutDupes;
      if (numberOfDupes === 0 || (!this.state.lastAhnentafel && !this.state.lastMultiples)) {
        talkAboutDupes = false;
      } else {
        talkAboutDupes = true;
      }
      let duplicatesPhrase;
      if (talkAboutDupes) {
        duplicatesPhrase = ` and ${numberOfDupes} duplicate ${(numberOfDupes>1)?'ancestors (additional lines of descent from a unique ancestor)':'ancestor (an additional line of descent from a unique ancestor)'}`;
      } else {
        duplicatesPhrase = '';
      }
      status = <div className={styles.status}>{this.state.lastDescendant} (<a href={`https://www.wikitree.com/wiki/${this.state.lastDescendant}`} target='_blank'>{this.state.descendantJson['BirthNamePrivate']}</a>) has {uniqueMatches} {(talkAboutDupes) ? ' unique ':''} {uniqueMatches === 1 ? 'ancestor' : 'ancestors'}{duplicatesPhrase} within {this.state.lastGenerations} {this.state.lastGenerations > 1 ? 'generations' : 'generation'}{meetsCategory}</div>
    } else {
      status = <div></div>;
    }

    let downloadButton;
    if (this.state.processingStatus ==='Done' && this.state.matchingAncestors.length !== 0) {
      let downloadFileName = `${this.state.descendant} - ${this.state.generations} Generations - ${this.state.category}`;
      downloadFileName = `${downloadFileName.replace(/\./g, '')}.csv`;
      downloadButton = <CSVLink data={this.getDownloadData(this.state.matchingAncestors)} filename={downloadFileName}><button className={styles.downloadButton}>Download List</button></CSVLink>;
    } else {
      downloadButton = <button className={styles.downloadButton} onClick={this.onClickPrematureDownload}>Download List</button>;
    }

    let locationTextBox;
    if (this.state.category === 'Location Text') {
      locationTextBox = <td><textarea className={styles.categoryTextBox} type="text" name="locationText" value={this.state.locationText} onChange={(e) => this.setState({locationText: e.target.value})} placeholder="Enter Birth and Death Location field search term(s). Multiple search terms may be entered, separated by commas. To limit search terms to the Birth Location or Death Location, precede the terms with b: or d: To exclude certain terms, precede them with a ! As examples, entering New England will generate a list of all ancestors whose profiles have New England in either the Birth Location or the Death Location field; entering !New England will generate a list of all ancestors whose profiles do not have New England in either the Birth Location or Death Location field; entering b:Germany,d:England,!New England will generate a list of ancestors with Germany in the Birth Location field and England (but not New England) in the Death Location field. Case and periods are ignored - e.g., USA and u.s.a are treated the same."/></td>
    } else {
      locationTextBox = '';
    }

    let categoryTextBox;
    if (this.state.category === 'Category Text') {
      categoryTextBox = <td><textarea className={styles.categoryTextBox} type="text" name="categoryText" value={this.state.categoryText} onChange={(e) => this.setState({categoryText: e.target.value})} placeholder="Enter category search term(s). Multiple search terms may be entered, separated by commas. To exclude certain terms, precede them with a ! To require that a second term be included, precede it with a + As examples, entering War,American Revolution will generate a list all ancestors in a category whose name includes either War or American Revolution; entering War,!Civil War will generate a list of all ancestors in a category whose name includes War but not Civil War; entering Texas,+Cemetery will generate a list all ancestors in a category whose name includes both Texas and Cemetery. Case and periods are ignored - e.g., USA and u.s.a are treated the same."/></td>
    } else {
      categoryTextBox = '';
    }

    let tableHeadings;
    if (this.state.processingStatus !=='Done' || this.state.matchingAncestors === null || this.state.matchingAncestors.length === 0 ) {
      tableHeadings = <thead></thead>;
    } else if (this.state.lastAhnentafel) {
      tableHeadings = 
        <thead><tr>
        <th className={styles.thahnen}><button onClick={this.onClickAhnenSort} className={styles.sortButton}>Gen-Ahnen</button></th>
        <th className={styles.thname}><button onClick={this.onClickNameSort} className={styles.sortButton}>Name</button></th>
        <th className={styles.thdate}><button onClick={this.onClickDOBSort} className={styles.sortButton}>Birth Date</button></th>
        <th className={styles.thlocation}><button onClick={this.onClickPOBSort} className={styles.sortButton}>Birth Location</button></th>
        <th className={styles.thdate}><button onClick={this.onClickDODSort} className={styles.sortButton}>Death Date</button></th>
        <th className={styles.thlocation}><button onClick={this.onClickPODSort} className={styles.sortButton}>Death Location</button></th>
        </tr></thead>;
    } else {
      tableHeadings = 
        <thead><tr>
        <th className={styles.thname}><button onClick={this.onClickNameSort} className={styles.sortButton}>Name</button></th>
        <th className={styles.thdate}><button onClick={this.onClickDOBSort} className={styles.sortButton}>Birth Date</button></th>
        <th className={styles.thlocation}><button onClick={this.onClickPOBSort} className={styles.sortButton}>Birth Location</button></th>
        <th className={styles.thdate}><button onClick={this.onClickDODSort} className={styles.sortButton}>Death Date</button></th>
        <th className={styles.thlocation}><button onClick={this.onClickPODSort} className={styles.sortButton}>Death Location</button></th>
        </tr></thead>;
    }

    let displayedTable;
    if (this.state.processingStatus ==='Done') {
      if (this.state.lastAhnentafel) {
        displayedTable = <AhnenTable tableData={this.state.matchingAncestors} fullname={this.state.lastFullname} descendantJson={this.state.descendantJson} ancestors={this.state.ancestors} generations={this.state.lastGenerations} multiples={this.state.lastMultiples} multiplesArray={this.state.matchingMultiples}/>;
      } else {
        displayedTable = <Table tableData={this.state.matchingAncestors} fullname={this.state.lastFullname} descendantJson={this.state.descendantJson} ancestors={this.state.ancestors} generations={this.state.lastGenerations} multiples={this.state.lastMultiples} multiplesArray={this.state.matchingMultiples}/>;
      }  
    } else {
      displayedTable = <tbody></tbody>;
    }

    let bottomLine;
    if (this.state.processingStatus !=='Done' || this.state.matchingAncestors === null || this.state.matchingAncestors.length === 0 ) {
      bottomLine = <div></div>;
    } else {
      bottomLine = <p className={styles.bottomLine}></p>
    }
      
    return (
      <div className={styles.page}>
        <div className={styles.topBox}>
          <h1 className={styles.h1}>
            Ancestor Listmaker
          </h1>
        </div>
        <div className={styles.description}>
          This app allows you to:
          <li>See a sortable list of all ancestors of a particular person (Descendant) for up to 20 
          generations back.</li>
          <li>See sortable lists of all ancestors of Descendent up to 20 generations back who meet selected criteria.</li>
          <li>Click on the icon next to any ancestor in an ancestor list to see all lines of descent from that ancestor to the Descendant.</li>
          <li>Download any of the ancestor lists or lines of descent to a .csv file, which can then be opened in a spreadsheet.</li>
        </div>
        <div className={styles.contact}>
          If you have any questions, comments, suggestions or problems, please post a comment on <a href='https://www.wikitree.com/wiki/Ashley-1950' target='_blank'>Chase Ashley's WikiTree page</a>.
        </div>
        <div className={styles.formContainer}>
          <table className={styles.formTable}>
            <tbody>
              <tr className={styles.topdiv}>
                <td className={styles.label}>Wikitree ID of Descendant:</td>
                <td><input className={styles.idTextBox} type="text" name="descendant" value={this.state.descendant} onChange={(e) => this.setState({descendant: e.target.value})} placeholder="e.g., Ashley-1950"/></td>
                <td></td>
              </tr>
              <tr>
                <td className={styles.label}>Number of ancestor generations back:</td>
                <td><Dropdown value={String(this.state.generations ? String(this.state.generations) : 'Select a number from 1-20')} options={this.state.generationOptions} onChange={(option) => this.setState({generations: Number(option.value)})} placeholder="Select a number from 1-20" width="50"/></td>
                <td></td>
              </tr>
              <tr className={styles.categoryTr}>
                <td className={styles.label}>List type/criteria:</td>
                <td><Dropdown value={this.state.category} options={this.state.categoryOptions} onChange={(option) => this.setState({category: option.value})} placeholder="Select list type/criteria"/></td>
                <td>{locationTextBox}{categoryTextBox}</td> 
              </tr>
              <tr>
                <td className={styles.label}>Optional display features:</td>
                <td><input type="checkbox" name="ahnentafelCheckbox" checked={this.state.ahnentafel} onChange={(e) => this.setState({ahnentafel: e.target.checked})}/>
                    <label for="ahnentafelCheckbox">Include generation and ahnentafel number column</label></td>
                <td><input type="checkbox" name="fullnameCheckbox" checked={this.state.fullname} onChange={(e) => this.setState({fullname: e.target.checked})}/>
                    <label for="ahnentafelCheckbox">Show full name at birth (includes middle name)</label></td>
              </tr>
              <tr>
                <td></td>
                <td colSpan='2' ><input type="checkbox" name="multiplesCheckbox" checked={this.state.multiples} onChange={(e) => this.setState({multiples: e.target.checked})}/>
                  <label for="multipleCheckbox">Show number of lines to same ancestor (if multiple lines of descent)</label>
                </td> 
              </tr>
              <tr className={styles.buttonsTr}>
                <td></td>
                <td className={styles.buttonsTd}><button onClick={this.onClickSubmit} className={styles.getListButton}>Generate List</button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {downloadButton}</td>
                <td className={styles.version}>(ver 7p.9.Jul.2020)</td>
              </tr>
            </tbody>
          </table>
        </div>
        {status}
        <div className={styles.tableDiv}>
          <table className={styles.table}>
            {tableHeadings}
            {displayedTable}
          </table>
          {bottomLine}
        </div>
      </div>
    )
  }
  
  async setReloadStatus() {
    await this.setState({processingStatus: 'Reloading'});
  }

  componentDidMount() {
    this.setReloadStatus();
    db.table('main')
    .toArray()
    .then((storedState) => {
      if (storedState !== null) {
        this.setState(JSON.parse(storedState));
      }
      const url = window.location.href;
      if (this.state.descendant === '' && url.includes('?id=')) {
        const startLoc = url.indexOf('?id=') + 4;
        this.setState({descendant: url.slice(startLoc)});
      }
      const scrollPosition = localStorage.getItem('scrollPosition');
      window.scrollTo(0,scrollPosition);
    });
  }

  componentWillUnmount() {
    localStorage.setItem('scrollPosition', window.pageYOffset);
  }

}

export default Main;