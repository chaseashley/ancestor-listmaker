import React from 'react';
import { Link } from "react-router-dom";
import styles from './tablestyles.module.css';
import rfimage from './rf.gif';

export class Table extends React.Component {


  createRows(data, descendantJson, ancestors, generations, fullname, multiples, multiplesArray) {
    let rows = [];
    for (let i = 0; i < data.length; i++) {
      rows.push(<tr key={i}>
        <td className={styles.ancestor}><a href={`https://www.wikitree.com/wiki/${data[i]['Name']}`} target='_blank'>{fullname ? data[i]['BirthName'] : data[i]['BirthNamePrivate']}</a>
        {(multiples && multiplesArray[data[i]['Id']]>1) ? <span className={styles.multiples}>&nbsp;({multiplesArray[data[i]['Id']]})</span>:''}
        &nbsp;<Link to={{ pathname: '/lines', endAncestor: data[i], descendantJson: descendantJson, ancestors: ancestors, generations: generations, fullname: fullname}}><img src={rfimage}/></Link>
        </td>
        <td className={styles.date}>{data[i]['BirthDate']}</td>
        <td className={styles.location}>{data[i]['BirthLocation']}</td>
        <td className={styles.date}>{data[i]['DeathDate']}</td>
        <td className={styles.location}>{data[i]['DeathLocation']}</td></tr>
      );
    }
    return rows;
  }

  render() {
    return (
      <tbody>{this.createRows(this.props.tableData, this.props.descendantJson, this.props.ancestors, this.props.generations, this.props.fullname, this.props.multiples, this.props.multiplesArray)}</tbody>
    );
  }

}