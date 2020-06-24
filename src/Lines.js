import React from 'react';
import styles from './linesstyles.module.css';
import { getAllAncestralLines } from './ancestralLine';

class Lines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      endAncestor: this.props.location.endAncestor,
      descendantJson: this.props.location.descendantJson,
      ancestorList: this.props.location.ancestorList
    }
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

  createHeadings(endAncestor,ancestorList) {
    let numberOfOccurences = 0;
    for (let i = 0; i < ancestorList.length; i++) {
      if (ancestorList[i]['Id'] === endAncestor['Id']) {
        numberOfOccurences++;
      }
    }
    let headings = [];
    for (let i = 0; i < numberOfOccurences; i++) {
      headings.push(<th className={styles.thname}>Name</th>);
    }
    const headingsRow = <tr>{headings}</tr>;
    return headingsRow;
  }

  createRows(endAncestor,ancestorList,descendantJson) {
    let rows = [];
    const ancestorListWithDescendant = ancestorList.slice();
    ancestorListWithDescendant.unshift(descendantJson);
    const ancestralLines = getAllAncestralLines(endAncestor, ancestorListWithDescendant);
    const maxLineLength = this.getMaxLineLength(ancestralLines);
    for (let i = 0; i < maxLineLength; i++) {
      let row = [];
      for (let j = 0; j < ancestralLines.length; j++) {
        if (i < ancestralLines[j].length) {
          row.push(
            <td className={styles.ancestor}><a href={`https://www.wikitree.com/wiki/${ancestralLines[j][i]['Name']}`} target='_blank'>{ancestralLines[j][i]['BirthNamePrivate']}</a></td>
          )
        } else {
          row.push(<td></td>);
        }
      }
      rows.push(<tr key={i}>{row}</tr>);
      /*
      rows.push(<tr key={i}>
        <td className={styles.ahnen}>{ancestralLines[0][i]['Generation']}</td>
        <td className={styles.ancestor}><a href={`https://www.wikitree.com/wiki/${ancestralLines[0][i]['Name']}`} target='_blank'>{ancestralLines[0][i]['BirthNamePrivate']}</a></td>
        <td className={styles.date}>{ancestralLines[0][i]['BirthDate']}</td>
        <td className={styles.location}>{ancestralLines[0][i]['BirthLocation']}</td>
        <td className={styles.date}>{ancestralLines[0][i]['DeathDate']}</td>
        <td className={styles.location}>{ancestralLines[0][i]['DeathLocation']}</td>
      </tr>);
          */
    }
    return rows;
  }

  render() {

    let pageBody;
    if (this.state.ancestorList === undefined) {
      pageBody = <div></div>;
    } else {
      pageBody = <div>
        <div className={styles.description}>
          The table below shows the line of descent from {this.state.endAncestor['BirthNamePrivate']} to {this.state.descendantJson['BirthNamePrivate']}.
        </div>
        <div className={styles.contact}>
          If you have any questions, comments, suggestions or problems, please post a comment on <a href='https://www.wikitree.com/wiki/Ashley-1950' target='_blank'>Chase Ashley's WikiTree page</a>.
        </div>
        <div className={styles.tableDiv}> 
          <table className={styles.table}>
            <thead>{this.createHeadings(this.state.endAncestor, this.state.ancestorList)}</thead>
            <tbody>{this.createRows(this.state.endAncestor, this.state.ancestorList, this.state.descendantJson)}</tbody>
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
    sessionStorage.setItem('FLLinesState', JSON.stringify(this.state));
  }
  
  componentDidMount() {
    const storedState = sessionStorage.getItem('FLLinesState');
    if (storedState !== null && this.props.location.ancestorList === undefined) {
      this.setState(JSON.parse(storedState));
      sessionStorage.removeItem('FLLinesState');
    }
  }

}
   
export default Lines;