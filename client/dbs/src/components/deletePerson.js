import React, {useState} from 'react'
import Select from 'react-select'

const DeletePerson = (props) => {
	
	const [options, setOptions] = useState([]);
	React.useEffect(() => {
		const data = props.data;
		let options = [];
		options = data.rows.map((item) => ({ value: item[0], label: item[0] }));
		setOptions(options);
		setSelectedOption(null);
	}, [props.userDeleted, props.data]);

	const handleMenuClose = () => {
		setSelectedOption({ value: null, label: null});
	};

	const [selectedOption, setSelectedOption] = useState(null);

  	const handleChange = (selOpt) => {
		setSelectedOption(selOpt);
		selOpt === null ? props.idToDeleteHandler(null) : props.idToDeleteHandler(selOpt);
  	};

  return (
	<form className='myForm' id='deletePerson' onSubmit={props.deletePerson}>
		<div className="home-container-row ">
			<span className="home-text-header">Delete person:</span>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>Person's ID:</span>
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
				Delete person
				</button>
			</div>
			<div className="home-container-column-r">
			{(() => {
				if (props.userDeleted === 1) {
				return <span className="home-text" id="goodResult">✓ User deleted</span>
			} else if (props.userDeleted === -1) {
				return <span className="home-text" id="badResult">✗ An error has occurred!</span>;
			} else {
				return null;
			}})()}
			</div>
			
		</div>
		
	</form>
  )};

  export default DeletePerson;