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
// 	<table className="table table-bordered table-hover dt-responsive">
// 	<thead>
// 	  <tr>
// 		<th>ID</th>
// 		<th>Name</th>
// 		<th>Surname</th>
// 		<th>Role</th>
// 	  </tr>
// 	</thead>
// 	<tbody>
// 	  {props.data.rows.map(item => (
// 		<tr key={item[0]}>
// 		  <td>{item[0]}</td>
// 		  <td>{item[1]}</td>
// 		  <td>{item[2]}</td>
// 		  <td>{item[3]}</td>
// 		</tr>
// 	  ))}
// 	</tbody>
//   </table>
  )};

export default TableData;