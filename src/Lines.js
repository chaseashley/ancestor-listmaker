import React from 'react';
import styles from './linesstyles.module.css';
import { getAllAncestralLines } from './ancestralLine';
import db from './db';
import { CSVLink } from "react-csv";

class Lines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      generations: this.props.location.generations,
      endAncestor: this.props.location.endAncestor,
      ancestorList: this.props.location.ancestorList,
      descendantJson: this.props.location.descendantJson,
      ancestralLines: null
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
    return maxLength;
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
      const maxLineLength = this.getMaxLineLength(ancestralLines);
      for (let i = 0; i < maxLineLength; i++) {
        let row = [];
        if (ancestralLines.length === 1) {
          row.push(
            <>
            <td className={styles.gen1}>{ancestralLines[0][i]['Generation']}</td>
            <td className={styles.name1}><a href={`https://www.wikitree.com/wiki/${ancestralLines[0][i]['Name']}`} target='_blank'>{ancestralLines[0][i]['BirthNamePrivate']}</a></td>
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
                <td className={styles.name2}><a href={`https://www.wikitree.com/wiki/${ancestralLines[j][i]['Name']}`} target='_blank'>{ancestralLines[j][i]['BirthNamePrivate']}</a></td>
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
    const maxLineLength = this.getMaxLineLength(ancestralLines);
    for (let i = 0; i < maxLineLength; i++) {
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
    const downloadButton = <CSVLink data={this.getDownloadData(ancestralLines)} filename={downloadFileName}><button className={styles.downloadButton}>Download List</button></CSVLink>;
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
      console.log(JSON.stringify(this.state.tableRows));
      pageBody = <div>
        <div className={styles.description}>
          The table below shows the {(this.state.ancestralLines.length===1) ? 'only': this.state.ancestralLines.length} {(this.state.ancestralLines.length===1) ? 'line': 'lines'} of descent from {this.state.endAncestor['BirthNamePrivate']} to {this.state.descendantJson['BirthNamePrivate']} that are present on WikiTree and that 
          involve persons within {this.state.generations} generations. Lines going back more than {this.state.generations} generations are included so long as each other person in the line has a line that connects to {this.state.descendantJson['BirthNamePrivate']} within {this.state.generations} generations. Note that, if the connection with {this.state.endAncestor['BirthNamePrivate']} is toward the end of the generational range, expanding the range back more generations may reveal additional lines.
          <tr className={styles.buttonsTr}>
              <td>{downloadButton}</td>
          </tr>
        </div>
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
            Ancestor ListMaker
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