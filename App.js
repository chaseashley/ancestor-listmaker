import React from 'react';
import styles from './appstyles.module.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { CSVLink } from "react-csv";
import { getAncestors, getAdditionalGens, replaceUndefinedFields, deletePrivateProfiles } from './ancestors';
import { getCategoryPages } from "./categoryPages";
import { filterOrphans, filterLocationText, filterUSImmigrants, filterAustralianImmigrants, filterCanadianImmigrants, filterCategoryPages } from './filters';
import { Table } from './Table';
import { sortByName, sortByDOB, sortByDOD, sortByPOB, sortByPOD } from './sort';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onClickNameSort = this.onClickNameSort.bind(this);
    this.onClickDOBSort = this.onClickDOBSort.bind(this);
    this.onClickDODSort = this.onClickDODSort.bind(this);
    this.onClickPOBSort = this.onClickPOBSort.bind(this);
    this.onClickPODSort = this.onClickPODSort.bind(this);
    this.getDownloadData = this.getDownloadData.bind(this);
    this.state = {
      descendant: null,
      category: null,
      generations: null,
      lastDescendant: null,
      lastCategory: null,
      lastGenerations: null,
      ancestorList: null,
      ancestorLists: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], //1-20 gens
      'American Immigrants': null,
      'American Revolution': null,
      'EuroAristo': null,
      'Filles du Roi': null,
      'French and Indian War': null,
      'Huguenot': null,
      'Jamestown': null,
      'Magna Carta Gateway': null,
      'Mayflower Passengers': null,
      'Mexican-American War': null,
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
      locationText: ''
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
            let ancestors = await getAncestors(this.state.descendant, this.state.generations);
            if (ancestors === null) { //will be null if there is a problem getting ancestors - eg ID number is not valid
              this.setState({processingStatus: null}); 
            } else {
              this.nullAncestorListsState();
              if (this.state.generations > 10 ) {
                this.setAncestorListsState(9,ancestors);
                ancestors = await getAdditionalGens(ancestors, this.state.generations-10);
              }
              ancestors = deletePrivateProfiles(ancestors);
              ancestors = replaceUndefinedFields(ancestors);
              this.setState({ancestorList: ancestors});
              this.setAncestorListsState(this.state.generations-1, ancestors);
              this.setState({lastDescendant: this.state.descendant});
              this.setState({lastGenerations: this.state.generations});
            }
          } else if ((this.state.descendant === this.state.lastDescendant) && (this.state.generations !== this.state.lastGenerations)){ //same descendant, but diff number of gens, so need to get ancestors for that number of gens
            if (this.state.ancestorLists[this.state.generations-1] !== null) { //if have stored ancestors for that number of gens, use it
              await this.setState({ancestorList: this.state.ancestorLists[this.state.generations-1]});
            } else { //no stored ancestorList for that number of generations, so need to get ancestors
              let ancestors;
              if (this.state.generations <10) { //if less then 10, gens don't bother checking lower stored, just get
                ancestors = await getAncestors(this.state.descendant, this.state.generations);
                if (ancestors === null) {
                  this.setState({processingStatus: null}); 
                }
              } else { // if gens >=10 use the next lower stored value
                const nextLowestStoredGen = this.nextLowestStoredGeneration(this.state.generations);
                if (nextLowestStoredGen < 10) { //nothing saved worth using, so start froms scratch
                  ancestors = await getAncestors(this.state.descendant, this.state.generations);
                  if (ancestors === null) { //will be null if problem fetching ancestors - eg if Wikitree ID is invalid
                    this.setState({processingStatus: null}); 
                  } else {
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
                ancestors = deletePrivateProfiles(ancestors)
                ancestors = replaceUndefinedFields(ancestors);
                this.setState({ancestorList: ancestors});
                this.setAncestorListsState(this.state.generations-1, ancestors);
              }
            }
          this.setState({lastGenerations: this.state.generations});
        }
      }

      //Then filter the ancestors against the specified category/criteria and create a table of the matches
      if (this.state.ancestorList !== null) {
        await this.setState({processingStatus: 'Filtering'});
        if (this.state.category === 'All') {
          await this.setState({matchingAncestorsList: this.state.ancestorList});
        } else {
          let matchingAncestors;
          if (this.state.category === 'Orphans') {
            matchingAncestors = filterOrphans(this.state.ancestorList);
            this.setState({matchingAncestorsList: matchingAncestors});
          } else if (this.state.category === 'American Immigrants') {
            matchingAncestors = filterUSImmigrants(this.state.ancestorList);
            this.setState({matchingAncestorsList: matchingAncestors});
          } else if (this.state.category === 'Australian Immigrants') {
            matchingAncestors = filterAustralianImmigrants(this.state.ancestorList);
            this.setState({matchingAncestorsList: matchingAncestors});
          } else if (this.state.category === 'Canadian Immigrants') {
            matchingAncestors = filterCanadianImmigrants(this.state.ancestorList);
            this.setState({matchingAncestorsList: matchingAncestors});
          } else if (this.state.category === 'Location Text') {
            matchingAncestors = filterLocationText(this.state.ancestorList, this.state.locationText);
            this.setState({matchingAncestorsList: matchingAncestors});
          } else {
            if (this.state[this.state.category] === null) { // if no pages saved for the category, need to get them; otherwise use the save pages
              let categoryPages;
              if (this.state.category === 'Huguenot') {
                const huguenotPages = await getCategoryPages('Huguenot');
                const huguenotAncestorPages = await getCategoryPages('Huguenot Ancestor');
                const huguenotEmigrantPages = await getCategoryPages('Huguenot Emigrant');
                const huguenotEmigrantFamilyPages = await getCategoryPages('Huguenot Emigrant Family');
                const huguenotNonEmigrantPages = await getCategoryPages('Huguenot non-Emigrant');
                categoryPages = huguenotPages + huguenotAncestorPages + huguenotEmigrantPages +  huguenotEmigrantFamilyPages + huguenotNonEmigrantPages;
              } else if (this.state.category === 'Quakers') {
                const quakersProjectPages = await getCategoryPages('Quakers Project');
                const quakersStickerPages = await getCategoryPages('Quakers Sticker');
                categoryPages = quakersProjectPages + quakersStickerPages;
              } else if (this.state.category === 'American Revolution') {
                const amRevProjectPages = await getCategoryPages('American Revolution Project');
                const amRevStickerPages = await getCategoryPages('American Revolution Sticker');
                const nsdarPages = await getCategoryPages('NSDAR');
                const nssarPages = await getCategoryPages('NSSAR');
                categoryPages = amRevProjectPages + amRevStickerPages + nsdarPages + nssarPages;
              } else if (this.state.category === 'US Civil War') {
                const usCivilWarProjectPages = await getCategoryPages('US Civil War Project');
                const usCivilWarStickerPages = await getCategoryPages('US Civil War Sticker');
                categoryPages = usCivilWarProjectPages + usCivilWarStickerPages;
              } else if (this.state.category === 'EuroAristo') {
                const euroAristoPages = await getCategoryPages('EuroAristo');
                const euroRoyalOrAristoPages = await getCategoryPages('European Royals and Aristocrats');
                categoryPages = euroAristoPages + euroRoyalOrAristoPages;
              } else if (this.state.category === 'French and Indian War') {
                const fandIWarProjectPages = await getCategoryPages('French and Indian War Project');
                const fandIWarStickerPages = await getCategoryPages('French and Indian War Sticker');
                categoryPages = fandIWarProjectPages + fandIWarStickerPages;
              } else if (this.state.category === 'New Netherland Settlers') {
                const newNetherlandSettlerPages = await getCategoryPages('New Netherland Settler');
                const newNetherlandSettlerStickerPages = await getCategoryPages('New Netherland Settler Sticker');
                categoryPages = newNetherlandSettlerPages + newNetherlandSettlerStickerPages;
              } else {
                categoryPages = await getCategoryPages(this.state.category);
              }
              await this.setState({[this.state.category]: categoryPages});
            }
            matchingAncestors = filterCategoryPages(this.state.ancestorList, this.state[this.state.category]);
            await this.setState({matchingAncestorsList: matchingAncestors});
          }
        }
        this.setState({lastCategory: this.state.category});
        let sortedMatchingAncestorsList = sortByName(this.state.matchingAncestorsList, 'forward');
        this.setState({lastSort: 'Name'});
        this.setState({outputTable: <Table tableData={sortedMatchingAncestorsList} descendant={this.state.descendant} generations={this.state.generations} category={this.state.category}/>});
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
    this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} descendant={this.state.descendant} generations={this.state.generations} category={this.state.category}/>});
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
    this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} descendant={this.state.descendant} generations={this.state.generations} category={this.state.category}/>});
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
    this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} descendant={this.state.descendant} generations={this.state.generations} category={this.state.category}/>});
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
    this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} descendant={this.state.descendant} generations={this.state.generations} category={this.state.category}/>});
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
    this.setState({outputTable: <Table tableData={newSortedMatchingAncestors} descendant={this.state.descendant} generations={this.state.generations} category={this.state.category}/>});
  }

  getDownloadData(matchingAncestorsList) {
    let downloadData = [['Name', 'Birth Date', 'Birth Location', 'Death Date', 'Death Location']];
    for (let i=0; i<matchingAncestorsList.length; i++) {
      const ancestor = matchingAncestorsList[i];
      const ancestorLink = `=HYPERLINK(""https://www.wikitree.com/wiki/${ancestor['Name']}""` + `,""${ancestor['BirthNamePrivate']}"")`;
      const ancestorDownloadData = [[ancestorLink, ancestor['BirthDate'], ancestor['BirthLocation'], ancestor['DeathDate'], ancestor['DeathLocation']]];
      downloadData = downloadData.concat(ancestorDownloadData);
    }
    return downloadData;
  }

  render() {
    const categoryOptions = [
      {value:'All', label: 'All - All ancestors'},
      {value:'American Immigrants', label: 'American Immigrants - Ancestors who immigrated or may have immigrated to America (USA or areas that became a part thereof), as indicated by the birth and death locations on their profiles'},
      {value:'American Revolution', label: 'American Revolution - Ancestors who participated in the American Revolution, as indicated by the 1776 sticker or 1776 Project template on their profile or their inclusion in the NSDAR or NSSAR Patriot Ancestor categories'},
      {value:'Australian Immigrants', label: 'Australian Immigrants - Ancestors who immigrated or may have immigrated to Australia (or areas that became a part thereof), as indicated by the birth and death locations on their profiles'},
      {value:'Canadian Immigrants', label: 'Canadian Immigrants - Ancestors who immigrated or may have immigrated to Canada (or areas that became a part thereof), as indicated by the birth and death locations on their profiles'},
      {value:'EuroAristo', label: 'European Royals and Aristocrats - Ancestors who were European royals or aristocrats, as indicated by the presence of the EuroAristo sticker or European Royals and Aristocrats template on their profile'},
      {value:'Filles du Roi', label: 'Filles du Roi - Ancestors who were among the Filles du Roi, as indicated by the presence of the Filles du Roi template on their profile'},
      {value:'French and Indian War', label: 'French and Indian War - Ancestors who participated in the French and Indian War, as indicated by the presence of the French and Indian War sticker or French and Indian War Project template on their profile'},
      {value:'Huguenot', label: 'Huguenot - Ancestors who were Huguenots, as indicated by the presence of the Huguenot, Huguenot Ancestor, Huguenot Emigrant, Huguenot Emigrant Family or Huguenot non-Emigrant template on their profile'},
      {value:'Jamestown', label: 'Jamestown - Ancestors who are Jamestowne Society Qualifying Ancestors, as indicated by their inclusion in the Jamestowne Society Qualifying Ancestors category'},
      {value:'Location Text', label: 'Location Text - Ancestors whose Birth or Death Location fields contain the search terms you enter. When this category is selected, a text box will open up to enter the search terms.'},
      {value:'Magna Carta Gateway', label: 'Magna Carta Gateway - Ancestors who were U.S. immigrants descended from a Magna Carta Surety Baron, as indicated by their inclusion in the Gateway Ancestors category'},
      {value:'Mayflower Passengers', label: 'Mayflower Passengers - Ancestors who were passengers on the Mayflower, as indicated by the presence of the Mayflower Passenger template on their profile'},
      {value:'Mexican-American War', label: 'Mexican-American War - Ancestors who participated in the Mexican-American War, as indicated by the presence of the Mexican-American War template on their profile'},
      {value:'New England Witches', label: 'New England Witches - New England ancestors accused as being witches, as indicated by their inclusion in the Accused Witches of New England category'},
      {value:'New Netherland Settlers', label: 'New Netherland Settlers - Ancestors who lived in New Netherland before 1675, as indicated by the presence of the New Netherland Settler sticker or template on their profile'},
      {value:'Notables', label: 'Notables - Ancestors who have the Notables sticker on their profile'},
      {value:'Orphans', label: 'Orphans - Ancestors whose profiles do not currently have a Profile Manager'},
      {value:'Palatine Migration', label: 'Palatine Migration - Ancestors who immigrated to America from a German-speaking area of Europe in 1700-1776, as indicated by the presence of the Palatine Migration template on their profile'},
      {value:'Puritan Great Migration', label: 'Puritan Great Migration - Ancestors who immigrated to New England in 1621-1640, as indicated by the presence of the Puritan Great Migration template on their profile'},
      {value:'Quakers', label: 'Quakers - Ancestors who were Quakers, as indicated by the presence of the Quakers sticker or Quakers Project template on their profile'},
      {value:'US Civil War', label: 'U.S. Civil War - Ancestors who participated in the U.S. Civil War, as indicated by the presence of the US Civil War sticker or US Civil War Project template on their profile'}
    ];
    const generationOptions = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];
    
    let status;
    if (this.state.processingStatus === 'Collecting') {
      status = <div className={styles.statusElipsis}>Collecting ancestors</div>;
    } else if (this.state.processingStatus === 'Filtering') {
      status = <div className={styles.statusElipsis}>Collecting category information and filtering ancestors</div>;
    } else if (this.state.processingStatus === 'Done') {
      status = <div className={styles.status}>{this.state.lastDescendant} has {this.state.matchingAncestorsList.length} ancestors within {this.state.lastGenerations} generations who meet the critera for the {this.state.lastCategory} category</div>
    } else {
      status = <div></div>;
    }

    let downloadButton;
    if (this.state.processingStatus ==='Done' && this.state.matchingAncestorsList.length !== 0) {
      let downloadFileName = `${this.state.descendant} - ${this.state.generations} Generations - ${this.state.category}`;
      downloadFileName = `${downloadFileName.replace(/\./g, '')}.csv`;
      downloadButton = <CSVLink data={this.getDownloadData(this.state.matchingAncestorsList)} filename={downloadFileName}><button className={styles.downloadButton}>Download List</button></CSVLink>;
    } else {
      downloadButton = '';
    }

    let locationTextBox;
    if (this.state.category === 'Location Text') {
      locationTextBox = <td><textarea className={styles.categoryTextBox} type="text" name="locationText" onChange={(e) => this.setState({locationText: e.target.value})} placeholder="Enter location search term(s). Multiple search terms may be entered, separated by commas - e.g. entering Italy, Italia will list all profiles that have either Italy or Italia in a location field. Case and periods are ignored - e.g., U.S.A. and usa are treated the same. To omit profiles that include a term, start the term with a ! - e.g. entering !England will list all profiles that do not have England in a location field, while entering France, !Nouvelle-France will list all profiles with France but not Nouvelle-France in a location field."/></td>
    } else {
      locationTextBox = '';
    }

    let tableHeadings;
    if (this.state.matchingAncestorsList === null || this.state.matchingAncestorsList.length === 0 ) {
      tableHeadings = <div></div>;
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
          <li>See a sortable list of all ancestors of Descendant who fall 
          within a selected category up to 20 generations back.</li>
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
                <td className={styles.gens}><Dropdown value={String(this.state.generations ? String(this.state.generations) : 'Select a number from 1-20')} options={generationOptions} onChange={(option) => this.setState({generations: Number(option.value)})} placeholder="Select a number from 1-20" width="50"/></td>
                <td></td>
              </tr>
              <tr className={styles.categoryTr}>
                <td className={styles.label}>Category:</td>
                <td className={styles.category}><Dropdown value={this.state.category} options={categoryOptions} onChange={(option) => this.setState({category: option.value})} placeholder="Select a category"/></td>
                <td>{locationTextBox}</td> 
              </tr>
              <tr>
                <td></td>
                <td className={styles.submit}><button onClick={this.onClickSubmit} className={styles.button}>Find Ancestors</button></td>
                <td>{downloadButton}</td>
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