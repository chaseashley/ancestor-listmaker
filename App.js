import React from 'react';
import styles from './appstyles.module.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { CSVLink } from "react-csv";
import { getAncestorsJson, getAdditionalGens, replaceUndefinedFields, deletePrivateProfiles } from './ancestors';
import { getAllRelatedCategoryArefs } from "./categoryPages";
import { filterCategoryText, filterByWikiTreePlus, filterUnknownFather, filterUnknownMother, filterOrphans, filterLocationText, filterUSImmigrants, filterAustralianImmigrants, filterCanadianImmigrants, filterCategoryArefs, removeDuplicates } from './filters';
import { Table } from './Table';
import { sortByName, sortByDOB, sortByDOD, sortByPOB, sortByPOD, sortByAhnen } from './sort';
import { AhnenTable } from './AhnenTable';
import { assignAhnens} from './ahnentafel';

class App extends React.Component {

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
    this.state = {
      descendant: null,
      category: null,
      generations: null,
      ahnentafel: false,
      displayName: 'BirthNamePrivate',
      fullname: false,
      lastDescendant: null,
      descendantJson: null,
      lastCategory: null,
      lastGenerations: null,
      lastAhnentafel: false,
      ancestorList: null,
      ancestorLists: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], //1-20 gens
      ahnenAncestorList: null,
      ahnenAncestorLists: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], //1-20 gens
      'American Immigrants': null,
      'American Revolution': null,
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
      'US Civil War': null,
      matchingAncestorsList: null,
      processingStatus: null,
      outputTable: <div></div>,
      lastSort: null,
      locationText: '',
      categoryText: '',
      categoryOptions: [
        {value:'All', label: 'All - All ancestors'},
        {value:'American Immigrants', label: 'American Immigrants - Ancestors who immigrated or may have immigrated to America (USA or areas that became a part thereof), as indicated by the birth and death locations on their profiles'},
        {value:'American Revolution', label: 'American Revolution - Ancestors who participated in the American Revolution, as indicated by the 1776 sticker or project template on their profile or their inclusion in the NSDAR or NSSAR Patriot Ancestor categories'},
        {value:'Australian Immigrants', label: 'Australian Immigrants - Ancestors who immigrated or may have immigrated to Australia (or areas that became a part thereof), as indicated by the birth and death locations on their profiles'},
        {value:'Canadian Immigrants', label: 'Canadian Immigrants - Ancestors who immigrated or may have immigrated to Canada (or areas that became a part thereof), as indicated by the birth and death locations on their profiles'},
        {value:'Category Text', label: 'Category Text - Ancestors who are in a category whose name contains the search terms you enter. When this list option is selected, a text box will appear in which to enter the search terms.'},
        {value:'European Aristocrats', label: 'European Aristocrats - Ancestors who were European aristocrats, as indicated by the presence of the EuroAristo sticker or the British Isles Aristo, European Aristocrat, or European Royals and Aristocrats template on their profile'},
        {value:'Filles du Roi', label: 'Filles du Roi - Ancestors who were among the Filles du Roi, as indicated by the presence of the Filles du Roi template on their profile'},
        {value:'Five-Star Profiles', label: 'Five-Star Profiles - Ancestors whose profiles have had 1,000 or more total page views and 100 or more different visitors in the past year. (Note that the ancestor data used for this list is only updated weekly.)'},
        {value:'French and Indian War', label: 'French and Indian War - Ancestors who participated in the French and Indian War, as indicated by the presence of the French and Indian War sticker or project template on their profile'},
        {value:'GEDCOM Junk', label: 'GEDCOM Junk - Ancestors whose profiles contain headings considered GEDCOM junk. (Note that the ancestor data used for this list is only updated weekly.)'},
        {value:'Huguenot', label: 'Huguenot - Ancestors who were Huguenots, as indicated by the presence of the Huguenot, Huguenot Ancestor, Huguenot Emigrant, Huguenot Emigrant Family or Huguenot non-Emigrant template on their profile'},
        {value:'Jamestown', label: 'Jamestown - Ancestors who are Jamestowne Society Qualifying Ancestors, as indicated by their inclusion in the Jamestowne Society Qualifying Ancestors category'},
        {value:'Location Text', label: 'Location Text - Ancestors whose Birth or Death Location fields contain the search terms you enter. When this list option is selected, a text box will appear in which to enter the search terms.'},
        {value:'Magna Carta Gateway', label: 'Magna Carta Gateway - Ancestors who were U.S. immigrants descended from a Magna Carta Surety Baron, as indicated by their inclusion in the Gateway Ancestors category'},
        {value:'Mayflower Passengers', label: 'Mayflower Passengers - Ancestors who were passengers on the Mayflower, as indicated by the presence of the Mayflower Passenger template on their profile'},
        {value:'Mexican-American War', label: 'Mexican-American War - Ancestors who participated in the Mexican-American War, as indicated by the presence of the Mexican-American War sticker or project template on their profile'},
        {value:'Native Americans', label: 'Native Americans - Ancestors who were Native Americans, as indicated by the presence of the Native American sticker or project template on their profile'},
        {value:'New England Witches', label: 'New England Witches - New England ancestors accused as being witches, as indicated by their inclusion in the Accused Witches of New England category'},
        {value:'New Netherland Settlers', label: 'New Netherland Settlers - Ancestors who lived in New Netherland before 1675, as indicated by the presence of the New Netherland Settler sticker or project template on their profile'},
        {value:'Notables', label: 'Notables - Ancestors who have the Notables sticker on their profile'},
        {value:'Orphans', label: 'Orphans - Ancestors whose profiles do not currently have a Profile Manager'},
        {value:'Palatine Migration', label: 'Palatine Migration - Ancestors who immigrated to America from a German-speaking area of Europe in 1700-1776, as indicated by the presence of the Palatine Migration template on their profile'},
        {value:'Puritan Great Migration', label: 'Puritan Great Migration - Ancestors who immigrated to New England in 1621-1640, as indicated by the presence of the Puritan Great Migration template on their profile'},
        {value:'Quakers', label: 'Quakers - Ancestors who were Quakers, as indicated by the presence of the Quakers sticker or project template on their profile'},
        {value:'Unknown/Missing Father', label: 'Unknown/Missing Father - Ancestors whose father\'s surname is "Unknown" or who have no father attached to their profile'},
        {value:'Unknown/Missing Mother', label: 'Unknown/Missing Mother - Ancestors whose mother\'s surname is "Unknown" or who have no mother attached to their profile'},
        {value:'Unsourced', label: 'Unsourced - Ancestors whose profiles have the Unsourced template on them. (Note that the ancestor data used for this list is only updated weekly.)'},
        {value:'US Civil War', label: 'U.S. Civil War - Ancestors who participated in the U.S. Civil War, as indicated by the presence of the US Civil War sticker or project template on their profile'}
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

  setAhnenAncestorListsState(i, ahnenAncestors) {
    const newAhnenAncestorListsState = this.state.ahnenAncestorLists.slice(); //copy the array
    newAhnenAncestorListsState[i] = ahnenAncestors;
    this.setState({ahnenAncestorLists: newAhnenAncestorListsState}) //set the new state
  }

  nullAncestorListsState() {
    this.setState({ancestorLists: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]}); //1-20 gens
    this.setState({ahnenAncestorLists: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]}); //1-20 gens
  }

  nextLowestStoredGeneration(gens) { //find next lowest generation that has a stored ancestorList
    let i = gens-2; //gens-2 is index next lower number of gens
    while (this.state.ancestorLists[i] === null && i >= 9) {
      i = i-1;
    }
    return i+1; //return generations, not index
  }
  ////////////////

  async onClickSubmit() { // the Find Ancestors button click event

    // First get named descendant's ancestors for the specified number of generations
    if (this.state.descendant === null || this.state.category === null || this.state.generations === null) {
      alert('Make sure a Wikitree ID has been entered in the top text box and the number of generations and a category have been selected');
    } else if ((this.state.descendant !== null && this.state.category !== null && this.state.generations !== null) &&
        ((this.state.descendant !== this.state.lastDescendant) || (this.state.category !== this.state.lastCategory) || (this.state.generations !== this.state.lastGenerations))) {
          await this.setState({descendant: this.state.descendant.trim()})
          this.setState({processingStatus: 'Collecting'});
          if (this.state.descendant !== this.state.lastDescendant) { //new descendant, so null out the saved lists and start from scratch
            let ancestorsJson = await getAncestorsJson(this.state.descendant, this.state.generations);
            if (ancestorsJson === null) { //will be null if there is a problem getting ancestors - eg ID number is not valid
              this.setState({processingStatus: null}); 
            } else {
              let ancestors = ancestorsJson[0]['ancestors'].slice(1); //strip response down to array of ancestor objects
              ancestors = removeDuplicates(ancestors);
              this.setState({descendantJson: ancestorsJson[0]['ancestors'][0]});
              this.nullAncestorListsState();
              if (this.state.generations > 10 ) {
                this.setAncestorListsState(9,ancestors);
                ancestors = await getAdditionalGens(ancestors, this.state.generations-10);
              }
              ancestors = replaceUndefinedFields(ancestors);
              this.setAncestorListsState(this.state.generations-1, ancestors);
              this.setState({lastDescendant: this.state.descendant});
              this.setState({lastGenerations: this.state.generations});
            }
          } else if ((this.state.descendant === this.state.lastDescendant) && (this.state.generations !== this.state.lastGenerations)){ //same descendant, but diff number of gens, so need to get ancestors for that number of gens
            if (this.state.ancestorLists[this.state.generations-1] === null) {
              let ancestors;
              if (this.state.generations <10) { //if less then 10, gens don't bother checking lower stored, just get
                let ancestorsJson = await getAncestorsJson(this.state.descendant, this.state.generations);
                if (ancestorsJson === null) {
                  this.setState({processingStatus: null}); 
                } else {
                  ancestors = ancestorsJson[0]['ancestors'].slice(1); //strip response down to array of ancestor objects
                  ancestors = removeDuplicates(ancestors);
                  this.setState({descendantJson: ancestorsJson[0]['ancestors'][0]});
                }
              } else { // if gens >=10 use the next lower stored value
                const nextLowestStoredGen = this.nextLowestStoredGeneration(this.state.generations);
                if (nextLowestStoredGen < 10) { //nothing saved worth using, so start froms scratch
                  let ancestorsJson = await getAncestorsJson(this.state.descendant, this.state.generations);
                  if (ancestorsJson === null) { //will be null if problem fetching ancestors - eg if Wikitree ID is invalid
                    this.setState({processingStatus: null}); 
                  } else {
                    ancestors = ancestorsJson[0]['ancestors'].slice(1); //strip response down to array of ancestor objects
                    ancestors = removeDuplicates(ancestors);
                    this.setState({descendantJson: ancestorsJson[0]['ancestors'][0]});
                    this.setAncestorListsState(9,ancestors);
                    if (this.state.generations > 10) {
                      ancestors = await getAdditionalGens(ancestors, this.state.generations-10);
                    }
                  }
                } else {//is a nextLowestStoredGen >= 10
                  ancestors = this.state.ancestorLists[nextLowestStoredGen-1];
                  ancestors = await getAdditionalGens(ancestors, this.state.generations-nextLowestStoredGen);
                }
              }
              if (ancestors !== null) {
                ancestors = replaceUndefinedFields(ancestors);
                this.setAncestorListsState(this.state.generations-1, ancestors);
              }
            }
        }
      }

      if (this.state.processingStatus !== null) {
        if (this.state.ahnentafel) { //if ahnentafel checkbox selected, get or create ahnentafel ancestor list and set ancestorList to it
          if (this.state.ahnenAncestorLists[this.state.generations-1] !== null) {
            await this.setState({ancestorList: this.state.ahnenAncestorLists[this.state.generations-1]});
          } else {
            await this.setState({ahnenAncestorList: null});
            let ahnenAncestors = this.state.ancestorLists[this.state.generations-1].slice();
            for (let i=0; i<ahnenAncestors.length; i++) {
              ahnenAncestors[i]['Ahnen'] = -1;
            }
            let descendantJson = this.state.descendantJson;
            descendantJson['Ahnen'] = 1;
            ahnenAncestors = (assignAhnens(descendantJson, ahnenAncestors));
            for (let i = 0; i<ahnenAncestors.length; i++) {
              ahnenAncestors[i]['Generation'] = Math.floor(Math.log2(ahnenAncestors[i]['Ahnen']));
            }
            await this.setState({ancestorList: ahnenAncestors});
            await this.setState({ahnenAncestorList: ahnenAncestors});
            await this.setAhnenAncestorListsState(this.state.generations-1, ahnenAncestors);
          }
        } else { //if ahnentafel checkbox not selected, set ancestorList to non-ahnentafel ancestor list
          await this.setState({ancestorList: this.state.ancestorLists[this.state.generations-1]});
        }
      }

      //Then filter the ancestors against the specified category/criteria and create a table of the matches
      if (this.state.ancestorList !== null) {
        await this.setState({processingStatus: 'Filtering'});
        let matchingAncestors = deletePrivateProfiles(this.state.ancestorList);
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
          } else if (this.state.category === 'Category Text') {
            matchingAncestors = await filterCategoryText(this.state.descendant, matchingAncestors, this.state.categoryText);
          } else if (this.state.category === 'Unknown/Missing Father') {
            matchingAncestors = filterUnknownFather(matchingAncestors);
          } else if (this.state.category === 'Unknown/Missing Mother') {
            matchingAncestors = filterUnknownMother(matchingAncestors);
          } else if (this.state.category === 'Unsourced') {
            matchingAncestors = await filterByWikiTreePlus(this.state.descendant, matchingAncestors, 'Unsourced');
          } else if (this.state.category === 'GEDCOM Junk') {
            matchingAncestors = await filterByWikiTreePlus(this.state.descendant, matchingAncestors, 'GEDCOM Junk');
          } else if (this.state.category === 'Five-Star Profiles') {
            matchingAncestors = await filterByWikiTreePlus(this.state.descendant, matchingAncestors, 'Five-Star Profiles');
          } else {
            if (this.state[this.state.category] === null) { // if no pages saved for the category, need to get them; otherwise use the save pages
              const categoryArefs = await getAllRelatedCategoryArefs(this.state.category);
              await this.setState({[this.state.category]: categoryArefs});
            }
            matchingAncestors = filterCategoryArefs(matchingAncestors, this.state[this.state.category]);
          }
        }
        await this.setState({matchingAncestorsList: matchingAncestors});
        this.setState({lastGenerations: this.state.generations});
        this.setState({lastCategory: this.state.category});
        this.setState({lastAhnentafel: this.state.ahnentafel});
        if (this.state.fullname) {
          this.setState({displayName: 'BirthName'});
        } else {
          this.setState({displayName: 'BirthNamePrivate'});
        }
        if (this.state.lastAhnentafel) {
          let sortedMatchingAncestorsList = sortByAhnen(this.state.matchingAncestorsList, 'forward');
          this.setState({lastSort: 'Ahnen'});
          this.setState({outputTable: <AhnenTable tableData={sortedMatchingAncestorsList} displayName={this.state.displayName}/>});
        } else {
          let sortedMatchingAncestorsList = sortByName(this.state.matchingAncestorsList, 'forward');
          this.setState({lastSort: 'Name'});
          this.setState({outputTable: <Table tableData={sortedMatchingAncestorsList} displayName={this.state.displayName}/>});
        }
        this.setState({processingStatus: 'Done'});
      }   
  }

  async onClickNameSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'Name') {
      newSortedMatchingAncestors = await sortByName(this.state.matchingAncestorsList, 'backward');
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = await sortByName(this.state.matchingAncestorsList, 'forward');
      this.setState({lastSort: 'Name'});
    }
    this.setState({matchingAncestorsList: newSortedMatchingAncestors});
    if (this.state.lastAhnentafel) {
      this.setState({outputTable: <AhnenTable tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    } else {
      this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    }
  }

  async onClickDOBSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'DOB') {
      newSortedMatchingAncestors = sortByDOB(this.state.matchingAncestorsList, false);
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = sortByDOB(this.state.matchingAncestorsList, true);
      this.setState({lastSort: 'DOB'});
    }
    this.setState({matchingAncestorsList: newSortedMatchingAncestors});
    if (this.state.lastAhnentafel) {
      this.setState({outputTable: <AhnenTable tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    } else {
      this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    }  
  }

  async onClickDODSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'DOD') {
      newSortedMatchingAncestors = sortByDOD(this.state.matchingAncestorsList, false);
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = sortByDOD(this.state.matchingAncestorsList, true);
      this.setState({lastSort: 'DOD'});
    }
    this.setState({matchingAncestorsList: newSortedMatchingAncestors});
    if (this.state.lastAhnentafel) {
      this.setState({outputTable: <AhnenTable tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    } else {
      this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    }
  }

  async onClickPOBSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'POB') {
      newSortedMatchingAncestors = sortByPOB(this.state.matchingAncestorsList, false);
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = sortByPOB(this.state.matchingAncestorsList, true);
      this.setState({lastSort: 'POB'});
    }
    this.setState({matchingAncestorsList: newSortedMatchingAncestors});
    if (this.state.lastAhnentafel) {
      this.setState({outputTable: <AhnenTable tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    } else {
      this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    }  
  }

  async onClickPODSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'POD') {
      newSortedMatchingAncestors = sortByPOD(this.state.matchingAncestorsList, false);
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = sortByPOD(this.state.matchingAncestorsList, true);
      this.setState({lastSort: 'POD'});
    }
    this.setState({matchingAncestorsList: newSortedMatchingAncestors});
    if (this.state.lastAhnentafel) {
      this.setState({outputTable: <AhnenTable tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    } else {
      this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    }  
  }

  async onClickAhnenSort() {
    let newSortedMatchingAncestors;
    if (this.state.lastSort === 'Ahnen') {
      newSortedMatchingAncestors = await sortByAhnen(this.state.matchingAncestorsList, false);
      this.setState({lastSort: null});
    } else {
      newSortedMatchingAncestors = await sortByAhnen(this.state.matchingAncestorsList, true);
      this.setState({lastSort: 'Ahnen'});
    }
    this.setState({matchingAncestorsList: newSortedMatchingAncestors});
    if (this.state.lastAhnentafel) {
      this.setState({outputTable: <AhnenTable tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    } else {
      this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} displayName={this.state.displayName}/>});
    }
  }

  getDownloadData(matchingAncestorsList) {
    let downloadData;
    if (this.state.lastAhnentafel) {
      downloadData = [['Gen-Ahen', 'Name', 'Birth Date', 'Birth Location', 'Death Date', 'Death Location']];
      for (let i=0; i<matchingAncestorsList.length; i++) {
        const ancestor = matchingAncestorsList[i];
        const ancestorLink = `=HYPERLINK(""https://www.wikitree.com/wiki/${ancestor['Name']}""` + `,""${ancestor[this.state.displayName]}"")`;
        const ancestorDownloadData = [[ancestor['Generation'] + '-' + ancestor['Ahnen'], ancestorLink, ancestor['BirthDate'], ancestor['BirthLocation'], ancestor['DeathDate'], ancestor['DeathLocation']]];
        downloadData = downloadData.concat(ancestorDownloadData);
      }
    } else {
      downloadData = [['Name', 'Birth Date', 'Birth Location', 'Death Date', 'Death Location']];
      for (let i=0; i<matchingAncestorsList.length; i++) {
        const ancestor = matchingAncestorsList[i];
        const ancestorLink = `=HYPERLINK(""https://www.wikitree.com/wiki/${ancestor['Name']}""` + `,""${ancestor[this.state.displayName]}"")`;
        const ancestorDownloadData = [[ancestorLink, ancestor['BirthDate'], ancestor['BirthLocation'], ancestor['DeathDate'], ancestor['DeathLocation']]];
        downloadData = downloadData.concat(ancestorDownloadData);
      }
    }
    return downloadData;
  }

  onClickPrematureDownload() {
    if (this.state.ancestorList === null) {
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
    } else if (this.state.processingStatus === 'Filtering') {
      status = <div className={styles.statusElipsis}>Collecting criteria information and filtering ancestors</div>;
    } else if (this.state.processingStatus === 'Done') {
      let meetsCategory;
      if (this.state.lastCategory === 'All') {
        meetsCategory = '';
      } else if (removeDuplicates(this.state.matchingAncestorsList).length !== 1) {
        meetsCategory = `who meet the ${this.state.lastCategory} list criteria`;
      } else {
        meetsCategory = `who meets the ${this.state.lastCategory} list criteria`;
      }
      status = <div className={styles.status}>{this.state.lastDescendant} (<a href={`https://www.wikitree.com/wiki/${this.state.lastDescendant}`} target='_blank'>{this.state.descendantJson['BirthNamePrivate']}</a>) has {removeDuplicates(this.state.matchingAncestorsList).length} {removeDuplicates(this.state.matchingAncestorsList).length === 1 ? 'ancestor' : 'ancestors'} within {this.state.lastGenerations} {this.state.lastGenerations > 1 ? 'generations' : 'generation'} {meetsCategory}</div>
    } else {
      status = <div></div>;
    }

    let downloadButton;
    if (this.state.processingStatus ==='Done' && this.state.matchingAncestorsList.length !== 0) {
      let downloadFileName = `${this.state.descendant} - ${this.state.generations} Generations - ${this.state.category}`;
      downloadFileName = `${downloadFileName.replace(/\./g, '')}.csv`;
      downloadButton = <CSVLink data={this.getDownloadData(this.state.matchingAncestorsList)} filename={downloadFileName}><button className={styles.downloadButton}>Download List</button></CSVLink>;
    } else {
      downloadButton = <button className={styles.downloadButton} onClick={this.onClickPrematureDownload}>Download List</button>;
    }

    let locationTextBox;
    if (this.state.category === 'Location Text') {
      locationTextBox = <td><textarea className={styles.categoryTextBox} type="text" name="locationText" onChange={(e) => this.setState({locationText: e.target.value})} placeholder="Enter location search term(s). Multiple search terms may be entered, separated by commas - e.g. entering Italy, Italia will list all profiles that have either Italy or Italia in a location field. Case and periods are ignored - e.g., U.S.A. and usa are treated the same. To omit profiles that include a term, start the term with a ! - e.g. entering !England will list all profiles that do not have England in a location field, while entering France, !Nouvelle-France will list all profiles with France but not Nouvelle-France in a location field."/></td>
    } else {
      locationTextBox = '';
    }

    let categoryTextBox;
    if (this.state.category === 'Category Text') {
      categoryTextBox = <td><textarea className={styles.categoryTextBox} type="text" name="categoryText" onChange={(e) => this.setState({categoryText: e.target.value})} placeholder="Enter profile search term(s). Multiple search terms may be entered, separated by commas - e.g. entering War, American Revolution will list all ancestors who are in a category whose name includes either War or American Revolution. Case and periods are ignored - e.g., U.S.A. and usa are treated the same. To omit certain categories that include a term, start the term with a ! - e.g. entering War, !Civil War will list all ancestors in a category whose name includes War but not Civil War."/></td>
    } else {
      categoryTextBox = '';
    }

    let tableHeadings;
    if (this.state.matchingAncestorsList === null || this.state.matchingAncestorsList.length === 0 ) {
      tableHeadings = <div></div>;
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
      displayedTable = this.state.outputTable;
    } else {
      displayedTable = <div></div>;
    }

    let bottomLine;
    if (this.state.matchingAncestorsList === null || this.state.matchingAncestorsList.length === 0 ) {
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
          <li>Download any of the lists to a .csv 
          file, which can then be opened in a spreadsheet (e.g., to use as a tracking sheet).</li>
        </div>
        <div className={styles.contact}>
          If you have any questions, comments, suggestions or problems, please post a comment on <a href='https://www.wikitree.com/wiki/Ashley-1950' target='_blank'>Chase Ashley's WikiTree page</a>.
        </div>
        <div className={styles.formContainer}>
          <table className={styles.formTable}>
            <tbody>
              <tr className={styles.topdiv}>
                <td className={styles.label}>Wikitree ID of Descendant:</td>
                <td><input className={styles.idTextBox} type="text" name="descendant" onChange={(e) => this.setState({descendant: e.target.value})} placeholder="e.g., Ashley-1950"/></td>
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
                <td><input type="checkbox" name="ahnentafelCheckbox" onClick={(e) => this.setState({ahnentafel: e.target.checked})}/>
                    <label for="ahnentafelCheckbox">Include generation and ahnentafel number column</label></td>
                <td><input type="checkbox" name="fullnameCheckbox" onClick={(e) => this.setState({fullname: e.target.checked})}/>
                    <label for="ahnentafelCheckbox">Show full name at birth (includes middle name)</label></td>
              </tr>
              <tr className={styles.buttonsTr}>
                <td></td>
                <td className={styles.buttonsTd}><button onClick={this.onClickSubmit} className={styles.getListButton}>Generate List</button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {downloadButton}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        {status}
        <div className={styles.tableDiv}>
          <table className={styles.table}>
            {tableHeadings}
            {this.state.outputTable}
          </table>
          {bottomLine}
        </div>
      </div>
    )
  }
}

export default App;