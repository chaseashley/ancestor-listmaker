import React from 'react';
import styles from './linesstyles.module.css';
import { getAllAncestralLines } from './ancestralLine';
import db from './db';
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";

class Lines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      generations: this.props.location.generations,
      endAncestor: this.props.location.endAncestor,
      ancestorList: this.props.location.ancestorList,
      descendantJson: this.props.location.descendantJson,
      fullname: this.props.location.fullname,
      ancestralLines: null,
      maxLineLength: 0
    }
  }

  setOrResetState() {
    db.table('lines')
    .toArray()
    .then((storedState) => {
      if (storedState !== null && this.props.location.ancestorList === undefined) {
        this.setState(JSON.parse(storedState));
      } else {
        this.createAncestralLines(this.props.location.endAncestor,this.props.location.ancestorList, this.props.location.descendantJson);
        this.getMaxLineLength(this.state.ancestralLines)
      }
    });
  }

  createAncestralLines(endAncestor,ancestorList,descendantJson) {
    const ancestorListWithDescendant = ancestorList.slice();
    ancestorListWithDescendant.unshift(descendantJson);
    const ancestralLines = getAllAncestralLines(endAncestor, ancestorListWithDescendant);
    ancestralLines.sort(function (a, b) {
      return a.length - b.length;
    });
    this.setState({ancestralLines: ancestralLines});
  }

  getMaxLineLength(ancestralLines) {
    let maxLength = 0;
    for (let i=0; i < ancestralLines.length; i++) {
      if (ancestralLines[i].length > maxLength) {
        maxLength = ancestralLines[i].length;
      }
    }
    this.setState({maxLineLength: maxLength});
  }

  createHeadingsRow1(ancestralLines) {
    let headingsRow1;
    if (ancestralLines.length === 1) {
      headingsRow1 = <div></div>;
    } else {
      let headings1 = [];
      for (let i = 0; i < ancestralLines.length; i++) {
        headings1.push(
          <th className={styles.thline} colSpan="2">Line {i+1}</th>
        );
      }
      headingsRow1 = <tr>{headings1}</tr>;
    }
    return headingsRow1;
  }
  
  createHeadingsRow2(ancestralLines) {
    let headings2 = [];
    if (ancestralLines.length === 1) {
      headings2.push(
        <>
        <th className={styles.th1gen}>Gen</th>
        <th className={styles.th1name}>Name</th>
        <th className={styles.th1date}>Birth Date</th>
        <th className={styles.th1location}>Birth Location</th>
        <th className={styles.th1date}>Death Date</th>
        <th className={styles.th1location}>Death Location</th>
        </>
      );
    } else {
      for (let i = 0; i < ancestralLines.length; i++) {
        headings2.push(
          <>
          <th className={styles.th2gen}>Gen</th>
          <th className={styles.th2name}>Name</th>
          </>
          );
        }
      }
    const headingsRow2 = <tr>{headings2}</tr>;
    return headingsRow2;
  }

  createTableRows(ancestralLines) {
    if (ancestralLines !== null) {
      let rows = [];
      const maxLineLength = this.state.maxLineLength;
      for (let i = 0; i < maxLineLength; i++) {
        let row = [];
        if (ancestralLines.length === 1) {
          row.push(
            <>
            <td className={styles.gen1}>{ancestralLines[0][i]['Generation']}</td>
            <td className={styles.name1}>{(ancestralLines[0][i]['Id']<0) ? 'Private' : <a href={`https://www.wikitree.com/wiki/${ancestralLines[0][i]['Name']}`} target='_blank'>{this.state.fullname ? ancestralLines[0][i]['BirthName'] : ancestralLines[0][i]['BirthNamePrivate']}</a>}</td>
            <td className={styles.date1}>{ancestralLines[0][i]['BirthDate']}</td>
            <td className={styles.location1}>{ancestralLines[0][i]['BirthLocation']}</td>
            <td className={styles.date1}>{ancestralLines[0][i]['DeathDate']}</td>
            <td className={styles.location1}>{ancestralLines[0][i]['DeathLocation']}</td>
            </>
          );
        } else {
          for (let j = 0; j<ancestralLines.length; j++) {
            if (i < ancestralLines[j].length) {
              row.push(
                <>
                <td className={styles.gen2}>{ancestralLines[j][i]['Generation']}</td>
                <td className={styles.name2}>{(ancestralLines[j][i]['Id']<0) ? 'Private' : <a href={`https://www.wikitree.com/wiki/${ancestralLines[j][i]['Name']}`} target='_blank'>{(this.state.fullname) ? ancestralLines[j][i]['BirthName'] : ancestralLines[j][i]['BirthNamePrivate']}</a>}</td>
                </>
              );
            } else {
              row.push(<><td className={styles.gen}></td><td className={styles.name}></td></>);
            }
          }
        } 
        rows.push(<tr key={i}>{row}</tr>);    
      }
      return rows;
    }
  }

  getDownloadData(ancestralLines) {
    const downloadData = [];
    let headings;
    if (ancestralLines.length === 1) {
      headings = ['Gen', 'Name', 'Birth Date', 'Birth Location', 'Death Date', 'Death Location'];
    } else {
      headings = [];
      for (let i = 0; i < ancestralLines.length; i++) {
        headings.push('Gen');
        headings.push('Name');
      }
    }
    downloadData.push(headings);
    for (let i = 0; i < this.state.maxLineLength; i++) {
      let row;
      if (ancestralLines.length === 1) {
        row = [ancestralLines[0][i]['Generation'],
        `=HYPERLINK(""https://www.wikitree.com/wiki/${ancestralLines[0][i]['Name']}""` + `,""${ancestralLines[0][i]['BirthNamePrivate']}"")`,
        ancestralLines[0][i]['BirthDate'],
        ancestralLines[0][i]['BirthLocation'],
        ancestralLines[0][i]['DeathDate'],
        ancestralLines[0][i]['DeathLocation']]
      } else {
        row = [];
        for (let j = 0; j<ancestralLines.length; j++) {
          if (i < ancestralLines[j].length) {
            row.push(ancestralLines[j][i]['Generation']);
            row.push(`=HYPERLINK(""https://www.wikitree.com/wiki/${ancestralLines[j][i]['Name']}""` + `,""${ancestralLines[j][i]['BirthNamePrivate']}"")`);
          } else {
            row.push('');
            row.push('');
          }
        }
      }
      downloadData.push(row);
    } 
    return downloadData;
  }

  createDownloadButton(ancestralLines, descendantJson, endAncestor) {
    let downloadFileName = `${descendantJson['BirthNamePrivate']} - ${endAncestor['BirthNamePrivate']} Lines`;
    downloadFileName = `${downloadFileName.replace(/\./g, '')}.csv`;
    const downloadButton = <CSVLink data={this.getDownloadData(ancestralLines)} filename={downloadFileName}><button className={styles.button}>Download List</button></CSVLink>;
    return downloadButton;
  }

  render() {

    let downloadButton;
    let headingsRow1;
    let headingsRow2;
    let tableRows;
    if (this.state.ancestralLines !== null) {
      downloadButton = this.createDownloadButton(this.state.ancestralLines, this.state.descendantJson, this.state.endAncestor);
      headingsRow1 = this.createHeadingsRow1(this.state.ancestralLines);
      headingsRow2 = this.createHeadingsRow2(this.state.ancestralLines);
      tableRows = this.createTableRows(this.state.ancestralLines);
    } else {
      downloadButton = <div></div>
      headingsRow1 = <div></div>;
      headingsRow2 = <div></div>;
      tableRows = <div></div>;
    }
    
    let pageBody;
    if (this.state.ancestralLines === null) {
      pageBody = <div></div>;
    } else {
      pageBody = <div>
        <div className={styles.description}>
          The table below shows the {(this.state.ancestralLines.length===1) ? 'only': this.state.ancestralLines.length} {(this.state.ancestralLines.length===1) ? 'line': 'lines'} of descent from {this.state.endAncestor['BirthNamePrivate']} to {this.state.descendantJson['BirthNamePrivate']} that {(this.state.ancestralLines.length===1) ? 'is' : 'are'} present on WikiTree{((this.state.generations - this.state.maxLineLength+1) > 2) ? '' : ` and 
          that ${(this.state.ancestralLines.length===1) ? 'consists' : 'consist'} of persons within ${this.state.generations} generations of ${this.state.descendantJson['BirthNamePrivate']}`}. {(this.state.maxLineLength <= this.state.generations+1) ? '' : `Lines going back more than ${this.state.generations} generations are included if each person in the line has a line that connects them to ${this.state.descendantJson['BirthNamePrivate']} within ${this.state.generations} generations.`}
          {(this.state.generations <= 5 || (this.state.generations - this.state.maxLineLength+1) > Math.ceil(this.state.generations/10)) ? '' : ` Note that it is possible that expanding the range back more generations might reveal additional lines.`}
        </div>
        <table className={styles.formTable}><tbody>
          <tr className={styles.buttonsTr}>
                <td className={styles.buttonSpacer}></td>
                <td className={styles.buttonsTd}><Link to={{ pathname: '/'}}><button className={styles.button}>Return to List</button></Link>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {downloadButton}</td>
                <td></td>
            </tr></tbody>
        </table>
        <div className={styles.contact}>
          If you have any questions, comments, suggestions or problems, please post a comment on <a href='https://www.wikitree.com/wiki/Ashley-1950' target='_blank'>Chase Ashley's WikiTree page</a>.
        </div>
        <div className={styles.tableDiv}> 
          <table className={styles.table}>
            <thead>{headingsRow1}</thead>
            <thead>{headingsRow2}</thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      </div>
    }

    return (   
      <div className={styles.page}>
        <div className={styles.topBox}>
          <h1 className={styles.h1}>
            Ancestor Listmaker
          </h1>
        </div>
        {pageBody}
      </div>
    );
  }

  componentWillUnmount() {
    db.table('lines').put(JSON.stringify(this.state),0);
  }
  
  componentDidMount() {
    this.setOrResetState();
  }

}
   
export default Lines;