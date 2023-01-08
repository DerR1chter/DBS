import React from 'react'

const Loading = (props) => {

  return (
	<div className="home-container-main-column">
		<div className="home-container-row ">
			<span className="home-text-header">{props.header}</span>
		</div>
		<div className="home-container-row">
			<div className="home-container-column-r loading">
				<div>Loading...</div>
			</div>
		</div>
  </div>
  )};

  export default Loading;