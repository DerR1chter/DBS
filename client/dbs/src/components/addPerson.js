import React from 'react'


const AddPerson = (props) => {
	const schulungsleitIDs = props.schulungsleitIDs;
	const managerIDs = props.managerIDs;
	const gruppenIDs = props.gruppenIDs;

	  
	function renderSwitch(param) {
		switch(param) {
		  case 'manager':
			return (
				<>
					<div className="home-container-row">
						<div className="home-container-column-l">
						<span className="home-text">
							<span>Gehalt:</span>
							<br></br>
						</span>
						</div>
						<div className="home-container-column-r">
						<input
							type="text"
							placeholder="Enter salary"
							className="input"
							onChange={props.personChangeHandler}
							name="gehalt"
							id="gehalt"
							maxLength={255}
							pattern="[0-9]*"
							title="Please enter digits only"
							required
						/>
						</div>
					</div>
					
					<div className="home-container-row">
						<div className="home-container-column-l">
						<span className="home-text">
							<span>Beschreibung:</span>
							<br></br>
						</span>
						</div>
						<div className="home-container-column-r">
						<input
							type="text"
							placeholder="Enter description"
							className="input"
							onChange={props.personChangeHandler}
							name="description"
							maxLength={255}
							required
						/>
						</div>
					</div>
			</>
			);
		  
		  case 'lehrer':
			return (
				<>
					<div className="home-container-row">
						<div className="home-container-column-l">
						<span className="home-text">
							<span>Skype-login:</span>
							<br></br>
						</span>
						</div>
						<div className="home-container-column-r">
						<input
							type="text"
							placeholder="Enter Skype-login"
							className="input"
							onChange={props.personChangeHandler}
							name="skype"
							maxLength={255}
							required
						/>
						</div>
					</div>
					
					<div className="home-container-row">
						<div className="home-container-column-l">
						<span className="home-text">
							<span>Arbeitswochen:</span>
							<br></br>
						</span>
						</div>
						<div className="home-container-column-r">
						<input
							type="text"
							placeholder="KW 1-52 (e.g. 1, 7)"
							className="input"
							onChange={props.personChangeHandler}
							name="KW"
							maxLength={255}
							required
						/>
						</div>
					</div>

					<div className="home-container-row">
						<div className="home-container-column-l">
						<span className="home-text">
							<span>Schulungsleit.-ID:</span>
							<br></br>
						</span>
						</div>
						<div className="home-container-column-r">
							
								<select name="schulungsleitID" id="schulungsleitID" onChange={props.personChangeHandler} required>
								<option value="">Select Schulungsleit.-ID</option>
									{schulungsleitIDs.rows ? (schulungsleitIDs.rows.map((schulungsleitID) => {
										return (<option value={schulungsleitID} key={schulungsleitID}>{schulungsleitID}</option>)})
									) : <option value="">Establishing a connection to DB...</option>
									}
								</select>
							
						</div>
					</div>

					<div className="home-container-row">
						<div className="home-container-column-l">
						<span className="home-text">
							<span>Manager-ID:</span>
							<br></br>
						</span>
						</div>
						<div className="home-container-column-r">
							
									<select name="managerID" id="managerID" onChange={props.personChangeHandler} required>
									<option value="">Select Manager-ID</option>
										{managerIDs.rows ? (managerIDs.rows.map((managerID) => {
											return (<option value={managerID} key={managerID}>{managerID}</option>)})
										) : <option value="">Establishing a connection to DB...</option>
										}
									</select>
							
						</div>
					</div>
			</>
			);
		  
		  case 'schueler':
			return (
				<>
					<div className="home-container-row">
						<div className="home-container-column-l">
						<span className="home-text">
							<span>Niveau:</span>
							<br></br>
						</span>
						</div>
						<div className="home-container-column-r">
							<select name="niveau" id="niveau" onChange={props.personChangeHandler} required>
								<option value="">Select level</option>
								<option value="A1.1">A1.1</option>
								<option value="A1.2">A1.2</option>
								<option value="A2.1">A2.1</option>
								<option value="A2.2">A2.2</option>
								<option value="B1.1">B1.1</option>
								<option value="B1.2">B1.2</option>
								<option value="B2.1">B2.1</option>
								<option value="B2.2">B2.2</option>
							</select>
						</div>
					</div>
					
					<div className="home-container-row">
						<div className="home-container-column-l">
						<span className="home-text">
							<span>Gruppen-ID:</span>
							<br></br>
						</span>
						</div>
						<div className="home-container-column-r">
							
									<select name="gruppenID" id="gruppenID" onChange={props.personChangeHandler} required>
									<option value="">Select Gruppen-ID</option>
										{gruppenIDs.rows ? (gruppenIDs.rows.map((gruppenID) => {
											return (<option value={gruppenID} key={gruppenID}>{gruppenID}</option>)})
										) : <option value="">Establishing a connection to DB...</option>
										}
									</select>
							
						</div>
					</div>

					<div className="home-container-row">
						<div className="home-container-column-l">
						<span className="home-text">
							<span>Manager-ID:</span>
							<br></br>
						</span>
						</div>
						<div className="home-container-column-r">
							
									<select name="managerID" id="managerID" onChange={props.personChangeHandler} required>
									<option value="">Select Manager-ID</option>
										{managerIDs.rows ? (managerIDs.rows.map((managerID) => {
											return (<option value={managerID} key={managerID}>{managerID}</option>)})
										) : <option value="">Establishing a connection to DB...</option>
										}
									</select>
							
						</div>
					</div>

					<div className="home-container-row">
						<div className="home-container-column-l">
							<span className="home-text">
								<span>Payment date:</span>
								<br></br>
							</span>
						</div>
							<div className="home-container-column-r">
							<input type="date" 
							placeholder="Date" 
							className="input"
							onChange={props.personChangeHandler} 
							name="paymentDate"
							id="paymentDate"
							min="2022-01-01"
							maxLength={255}
							required
							/>
						</div>
					</div>
					<div className="home-container-row">
						<div className="home-container-column-l">
						<span className="home-text">
							<span>Payment sum:</span>
							<br></br>
						</span>
						</div>
						<div className="home-container-column-r">
						<input
							type="text"
							placeholder="Enter sum"
							className="input"
							onChange={props.personChangeHandler}
							name="paymentSum"
							maxLength={255}
							id="paymentSum"
							pattern="[0-9]*"
							title="Please enter digits only"
							required
						/>
						</div>
					</div>
			</>
			);
		  default:
			return;
		}
	}

  return (
	<form className='myForm' id='addPerson' onSubmit={props.addPerson}>
	{/* <div className="home-container-main-column"> */}
		<div className="home-container-row ">
			<span className="home-text-header">Add person:</span>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>Role:</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
			<div className="home-container-column">
				<div className="home-container-row" id="small">
				<input
					type="checkbox"
					id="manager"
					name="role"
					value="manager"
					onChange={props.personRoleChangeHandler}
					checked={props.personData.role === 'manager'}
				/>
				</div>
				<div className="home-container-row" id="small">
				Manager
				</div>
			</div>
			<div className="home-container-column">
				<div className="home-container-row" id="small">
				<input
					type="checkbox"
					id="lehrer"
					name="role"
					value="lehrer"
					onChange={props.personRoleChangeHandler}
					checked={props.personData.role === 'lehrer'}
				/>
				</div>
				<div className="home-container-row" id="small">
				Lehrer
				</div>
			</div>
			<div className="home-container-column">
				<div className="home-container-row" id="small">
				<input
					type="checkbox"
					id="schueler"
					name="role"
					value="schueler"
					onChange={props.personRoleChangeHandler}
					checked={props.personData.role === 'schueler'}
				/>
				</div>
				<div className="home-container-row" id="small">
				Schüler
				</div>
			</div>
			</div>
		</div>

		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>Name:</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
			<input type="text" 
			placeholder="Enter name" 
			className="input"
			onChange={props.personChangeHandler} 
			name="name"
			maxLength={255}
			required
			/>
			</div>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>Surname:</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
			<input
				type="text"
				placeholder="Enter surname"
				className="input"
				onChange={props.personChangeHandler}
				name="surname"
				maxLength={255}
				required
			/>
			</div>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>E-mail:</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
			<input
				type="email"
				placeholder="Enter E-mail"
				className="input"
				onChange={props.personChangeHandler}
				name="email"
				required
				maxLength={255}
			/>
			</div>
		</div>

		<div className="home-container-row">
			<div className="home-container-column-l">
			<span className="home-text">
				<span>Phone:</span>
				<br></br>
			</span>
			</div>
			<div className="home-container-column-r">
			<input
				type="text"
				placeholder="Enter phone number"
				className="input"
				onChange={props.personChangeHandler}
				name="phone"
				pattern="\+[0-9]*"
				maxLength={255}
				title="A number should start with a '+' and contain only digits"
				required
			/>
			</div>
			
		</div>

		{renderSwitch(props.personData.role)}
		
		<div className="home-container-row">
			<div className="home-container-column-l">
				<button type="submit" className="home-button button">
				Add person
				</button>
			</div>
			<div className="home-container-column-r">
			{(() => {
				if (props.userAdded === 1) {
				return <span className="home-text" id="goodResult">✓ User added</span>
			} else if (props.userAdded === -1) {
				return <span className="home-text" id="badResult">✗ {props.error}</span>;
			} else {
				return null;
			}})()}
			</div>
			
		</div>
		
	</form>
  )};

  export default AddPerson;