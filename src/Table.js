import React from 'react';
import { Link } from "react-router-dom";
import styles from './tablestyles.module.css';
import rfimage from './rf.gif';

export class Table extends React.Component {


  createRows(data, descendantJson, ancestorList) {
    let rows = [];
    for (let i = 0; i < data.length; i++) {
      /* following was taken out of end of first <td>:
      &nbsp;      
        <Link to={{ pathname: `${data[i]['Name']}/lines`, endAncestor: data[i], descendantJson: descendantJson, ancestorList: ancestorList}}><img src={rfimage}/></Link>
      */
      rows.push(<tr key={i}>
        <td className={styles.ancestor}><a href={`https://www.wikitree.com/wiki/${data[i]['Name']}`} target='_blank'>{this.props.fullname ? data[i]['BirthName'] : data[i]['BirthNamePrivate']}</a></td>
        <td className={styles.date}>{data[i]['BirthDate']}</td>
        <td className={styles.location}>{data[i]['BirthLocation']}</td>
        <td className={styles.date}>{data[i]['DeathDate']}</td>
        <td className={styles.location}>{data[i]['DeathLocation']}</td></tr>);
    }
    return rows;
  }

  render() {
    return (
      <tbody>{this.createRows(this.props.tableData, this.props.descendantJson, this.props.ancestorList)}</tbody>
    );
  }

}