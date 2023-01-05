import React from 'react'

const AddPayment = (props) => {

  return (
	<form className='myForm' id='addPayment' onSubmit={props.addPayment}>
		<div className="home-container-row ">
			<span className="home-text-header">Add payment:</span>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>Date:</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
			<input type="date" 
			placeholder="Date" 
			className="input"
			onChange={props.paymentChangeHandler} 
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
				<span>Sum:</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
			<input
				type="text"
				placeholder="Enter sum"
				className="input"
				onChange={props.paymentChangeHandler}
				name="sum"
				maxLength={255}
				id="sum"
				pattern="[0-9]*"
				title="Please enter digits only"
				required
			/>
			</div>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>&nbsp;</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
			
			</div>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-l">
				<button type="submit" className="home-button button">
				Add payment
				</button>
			</div>
			<div className="home-container-column-r">
			{(() => {
				if (props.paymentAdded === 1) {
				return <span className="home-text" id="goodResult">✓ Payment added</span>
			} else if (props.paymentAdded === -1) {
				return <span className="home-text" id="badResult">✗ An error occurred!</span>;
			} else {
				return null;
			}})()}
			</div>
			
		</div>
		
	</form>
  )};

  export default AddPayment;