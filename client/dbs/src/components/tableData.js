import React from 'react'


const TableData = (props) => {
  return (
	
	<table className="table table-bordered table-hover dt-responsive">
	<thead>
	  <tr>
	  {props.data.metaData.map((item, index) => (
		<th key={index}>{item.name !== 'RNUM' ? item.name : null}</th>
	  ))
	  }
	  </tr>
	</thead>
	<tbody>
	  {props.data.rows.map(item => {
		item = item.slice(0, -1);
		return (<tr key={item[0]}>
			{item.map((item, index) => {
				return (<td key={index}>{item}</td>)
			})}
		</tr>)
		})}
	</tbody>
  </table>
  )};

export default TableData;