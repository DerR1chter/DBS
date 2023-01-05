import React, { useState } from 'react'
import Select from 'react-select'

const AddGroup = (props) => {
	const [options, setOptions] = useState([]);
	React.useEffect(() => {
		const data = props.schulungsleitIDs;
		let options = [];
		options = data.rows.map((item) => ({ value: item[0], label: item[0] }));
		setOptions(options);
		setSelectedOption(null);
	}, [props.groupAdded, props.schulungsleitIDs]);

	const handleMenuClose = () => {
		setSelectedOption({ value: null, label: null});
	};

	const [selectedOption, setSelectedOption] = useState(null);

	const handleChange = (selOpt) => {
		setSelectedOption(selOpt);
		selOpt === null ? props.groupChangeHandler(null) : props.groupChangeHandler(selOpt.value);
	};


  return (
	<form className='myForm' id='addGroup' onSubmit={props.addGroup}>
		<div className="home-container-row ">
			<span className="home-text-header">Add group:</span>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>Start date:</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
			<input type="date" 
			placeholder="Enter start date" 
			className="input"
			onChange={props.groupChangeHandler} 
			name="startDate"
			id="startDate"
			min="2022-01-01"
			maxLength={255}
			required
			/>
			</div>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>End Date:</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
			<input
				type="date"
				placeholder="Enter end date"
				className="input"
				onChange={props.groupChangeHandler}
				name="endDate"
				maxLength={255}
				id="endDate"
				required
			/>
			</div>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>Teacher's ID:</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
				{<Select 
				value={selectedOption} 
				options={options} 
				onChange={handleChange} 
				isClearable={true}
				handleMenuClose={handleMenuClose}
				/>}
				
			</div>
		</div>
		
		<div className="home-container-row">
			<div className="home-container-column-l">
				<button type="submit" className="home-button button">
				Add group
				</button>
			</div>
			<div className="home-container-column-r">
			{(() => {
				if (props.groupAdded === 1) {
				return <span className="home-text" id="goodResult">✓ Group added</span>
			} else if (props.groupAdded === -1) {
				return <span className="home-text" id="badResult">✗ An error occurred!</span>;
			} else {
				return null;
			}})()}
			</div>
			
		</div>
		
	</form>
  )};

  export default AddGroup;