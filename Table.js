import React from 'react';
import styles from './tablestyles.module.css';

export class Table extends React.Component {

  createRows(data) {
    let rows = [];
    for (let i = 0; i < data.length; i++) {
      rows.push(<tr key={i}><td className={styles.ancestor}><a href={`https://www.wikitree.com/wiki/${data[i]['Name']}`} target='_blank'>{data[i]['BirthNamePrivate']}</a></td>
      <td className={styles.date}>{data[i]['BirthDate']}</td>
      <td className={styles.location}>{data[i]['BirthLocation']}</td>
      <td className={styles.date}>{data[i]['DeathDate']}</td>
      <td className={styles.location}>{data[i]['DeathLocation']}</td></tr>);
    }
    return rows;
  }

  render() {
    return (
      <tbody>{this.createRows(this.props.tableData)}</tbody>
    );
  }

}