import React, { useState } from 'react'

import { Helmet } from 'react-helmet'


import './home.css'
import './table.css'
import AddPerson from './addPerson'
import DeletePerson from './deletePerson'
import Loading from './loading'
import AddGroup from './addGroup'
import AddPayment from './addPayment'
import TableWithPagination from './tableWithPagination'

const Home = (props) => {

  const defaultPersonData = {
    role: 'manager',
    name: null, 
    surname: null, 
    email: null, 
    phone: null,
    gehalt: null,
    description: null,
    skype: null,
    KW: null,
    schulungsleitIDs: null,
    managerID: null,
    niveau: null,
    gruppenID: null,
    schuelerManagerID: null,
    paymentDate: null,
    paymentSum: null
  }
  const defaultGroupData = {
    startDate: null, 
    endDate: null, 
    teacherID: null
  }
  const defaultPaymentData = {
    startDate: null, 
    sum: null
  }

  const [personData, setPersonData] = useState(defaultPersonData);
  const [groupData, setGroupData] = useState(defaultGroupData);
  const [paymentData, setPaymentData] = useState(defaultPaymentData);

  const [data, setData] = useState(null);
  const [schulungsleitIDs, setSchulungsleitIDs] = React.useState(null);
	const [managerIDs, setManagerIDs] = React.useState([]);
	const [gruppenIDs, setGruppenIDs] = React.useState([]);
	const [zahlungIDs, setZahlungIDs] = React.useState([]);
  const [userAdded, setUserAdded] = useState(0);
  const [userDeleted, setUserDeleted] = useState(0);
  const [groupAdded, setGroupAdded] = useState(0);
  const [paymentAdded, setPaymentAdded] = useState(0);
  const [idToDelete, setIdToDelete] = useState(null);
  const [error, setError] = useState(null);

  const personChangeHandler = e => {
		const {name, value} = e.target;
		setPersonData(prevState => ({...prevState, [name]: value}));
	}

  const personRoleChangeHandler = e => {
		const {name, value} = e.target;
    
    setPersonData(prevState => {
      if (prevState.role === value) {
        return prevState;
      } else {
        document.getElementById('addPerson').reset();
        setUserAdded(0);
        return {...defaultPersonData, [name]: value};
      }});
	}
  
  const idToDeleteHandler = ({value}) => {
    setIdToDelete(value);
  }

  const groupChangeHandler = val => {
    typeof(val) === 'object' && val !== null ? setGroupData(prevState => {
      return {...prevState, [val.target.name]: val.target.value};
      }) :
		setGroupData(prevState => ({...prevState, teacherID: val}));
	}

  const paymentChangeHandler = event => {
    const {name, value} = event.target;
		setPaymentData(prevState => ({...prevState, [name]: value}));
	}


  const addPerson = (event) => {
    event.preventDefault();
    const {name, surname, email} = personData;
    let phone = personData.phone;
    if (phone === '' || phone === null) {
      alert('Please enter a phone number again');
      return;
    } else {
      phone = phone.replace('+', '%2b');
    }

    switch(personData.role) {
      case 'manager':
        const gehalt = personData.gehalt;
        const description = personData.description;

        fetch(`http://localhost:3001/addManager?name=${name}&surname=${surname}&email=${email}&phone=${phone}&gehalt=${gehalt}&description=${description}`)
        .then(response => response.json())
        .then((data) => {
          if (Object.keys(data)[0] === 'error') {
            setUserAdded(-1);
            setError(data.error)
          } else {
            setUserAdded(1);
            setError(null);
          }
          setPersonData(defaultPersonData);
          document.getElementById('addPerson').reset();
        })
        break;
      case 'lehrer':
        const {skype, KW, schulungsleitID, managerID} = personData;

        fetch(`http://localhost:3001/addTeacher?name=${name}&surname=${surname}&email=${email}&phone=${phone}&skype=${skype}&KW=${KW}&schulungsleitID=${schulungsleitID}&managerID=${managerID}`)
        .then(response => response.json())
        .then((data) => {
          if (Object.keys(data)[0] === 'error') {
            setUserAdded(-1);
            setError(data.error)
          } else {
            setUserAdded(1);
            setError(null);
          }
          setPersonData(defaultPersonData);
          document.getElementById('addPerson').reset();
        })
        break;

      case 'schueler':
          const {niveau, gruppenID, paymentDate, paymentSum, managerID: schuelerManagerID} = personData;
          
          fetch(`http://localhost:3001/addStudent?name=${name}&surname=${surname}&email=${email}&phone=${phone}&niveau=${niveau}&gruppenID=${gruppenID}&managerID=${schuelerManagerID}&paymentDate=${paymentDate}&paymentSum=${paymentSum}`)
          .then(response => response.json())
          .then((data) => {
            if (Object.keys(data)[0] === 'error') {
              setUserAdded(-1);
              setError(data.error)
            } else {
              setUserAdded(1);
              setError(null);
            }
            setPersonData(defaultPersonData);
            document.getElementById('addPerson').reset();
          })
          break;

      default:
        break;
    }

  }

  const addGroup = (event) => {
    event.preventDefault();

    const {startDate, endDate, teacherID} = groupData;

    const startDateJS = new Date(startDate);
		const endDateJS = new Date(endDate);

    if (endDateJS < startDateJS) {
		  alert("The end date must be after the start date.");
		  return false;
		}

    fetch(`http://localhost:3001/addGroup?startDate=${startDate}&endDate=${endDate}&teacherID=${teacherID}`)
    .then(response => response.json())
    .then((data) => {
      Object.keys(data)[0] === 'error' ? setGroupAdded(-1) : setGroupAdded(1);
      setGroupData(defaultGroupData);
      document.getElementById('addGroup').reset();
    })
  }

  const addPayment = (event) => {
    event.preventDefault();
    const date = paymentData.startDate;
    const sum = paymentData.sum;


    fetch(`http://localhost:3001/addPayment?date=${date}&sum=${sum}`)
    .then(response => response.json())
    .then((data) => {
      Object.keys(data)[0] === 'error' ? setPaymentAdded(-1) : setPaymentAdded(1);
      setPaymentData(defaultPaymentData);
      document.getElementById('addPayment').reset();
    })
  }

  const deletePerson = (event) => {
    event.preventDefault();

    fetch(`http://localhost:3001/deletePerson?id=${idToDelete}`)
    .then(response => response.json())
    .then(data => {
      Object.keys(data)[0] === 'error' || Object.values(data)[0] === 0 ? setUserDeleted(-1) : setUserDeleted(prevState => prevState + 1);
      document.getElementById('deletePerson').reset();
    })
  }

  React.useEffect(() => {
    fetch(`http://localhost:3001/`)
      .then(response => response.json())
      .then(data => {
        setData(data);
      }).then(() => fetch(`http://localhost:3001/getSchulungsleitIDs`))
		  .then(response => response.json())
		  .then(data => {
      setSchulungsleitIDs(data);
		  }).then(() => fetch(`http://localhost:3001/getGruppenIDs`))
		  .then(response => response.json())
		  .then(data => {
			setGruppenIDs(data);
		  }).then(() => fetch(`http://localhost:3001/getZahlungIDs`))
		  .then(response => response.json())
		  .then(data => {
			setZahlungIDs(data);
		  }).then(() => fetch(`http://localhost:3001/getManagerIDs`))
		  .then(response => response.json())
		  .then(data => {
			setManagerIDs(data);
		  }).catch(err => console.log(err));
      const timeOut = error ? 10000 : 5000;
      setTimeout(() => {
        setUserAdded(0);
        setUserDeleted(0);
        setPaymentAdded(0);
        setGroupAdded(0);
        setError(null);
      }, timeOut);
  }, [userAdded, userDeleted, groupAdded, paymentAdded, error]);

  return (
    <div className="home-container">
      <Helmet>
        <title>DBS Project</title>
        <meta property="og:title" content="DBS Project" />
      </Helmet>
      <div className="home-hero">
        <div className="home-container01">
          <div className="home-card">
            <h1 className="home-text HeadingOne">React + NodeJS DBS Project</h1>
            <h1 className="home-text01 HeadingOne">by Yehor Chulkov</h1>
            <span className="home-text02">Online German school</span>
          </div>
        </div>
      </div>
      <img
        alt="curved"
        src="/playground_assets/curved6-1500h.jpg"
        className="home-image"
      />
      <section className="home-features">
        
        <div className="home-container-main-row">
          {data && managerIDs && gruppenIDs && zahlungIDs && schulungsleitIDs ?
          <AddPerson personChangeHandler={personChangeHandler} addPerson={addPerson} personRoleChangeHandler={personRoleChangeHandler} personData={personData} schulungsleitIDs={schulungsleitIDs} managerIDs={managerIDs} gruppenIDs={gruppenIDs} zahlungIDs={zahlungIDs} userAdded={userAdded} setUserAdded={setUserAdded} error={error} />
          :
          <Loading header={"Add person:"} />
          }
          {data ?
            <DeletePerson deletePerson={deletePerson} idToDeleteHandler={idToDeleteHandler} idToDelete={idToDelete} userDeleted={userDeleted} data={data} /> 
          :
            <Loading header={"Delete person:"} />
        	}
        </div>
          <br/>
          <br/>
        <div className="home-container-main-row">
          {schulungsleitIDs ? 
          <AddGroup groupChangeHandler={groupChangeHandler} addGroup={addGroup} groupData={groupData} schulungsleitIDs={schulungsleitIDs} groupAdded={groupAdded} setGroupAdded={setGroupAdded} />
          :
          <Loading header={"Add group:"} />
          }
          {data ?
            <AddPayment paymentChangeHandler={paymentChangeHandler} addPayment={addPayment} paymentData={paymentData} paymentAdded={paymentAdded} setPaymentAdded={setPaymentAdded} />
          :
            <Loading header={"Delete person:"} />
        	}
        </div>
        
        

        <div className="home-container-main-row">
          <div className="home-container-row" id="tableViewsRow">
           <div className="tableViews">Table views:</div>
          </div>
        </div>
        <div className="home-container-main-row">
          {data ? 
          <TableWithPagination userAdded={userAdded} userDeleted={userDeleted} /> 
          : 
          <Loading header={"Table view:"} />
          }
        </div>
      </section>
     
      <section className="home-testimonials">
        <div className="home-container45">
          <div className="home-container46">
            <div className="home-container47">
              <h2 className="home-text38 HeadingOne">That's it!</h2>
              <p className="home-text39 Lead">
                <span className="home-text40">
                  Thanks for your attention! 
                </span>
              </p>
              <p className="home-text41">Yehor Chulkov</p>
              <p className="home-text42 Small">University of Vienna</p>
              <div className="home-container48">
                <img
                  alt="chulkov yehor"
                  src="/playground_assets/chulkov.jpg"
                  className="home-image01"
                />
              </div>
            </div>
          </div>
          <div className="home-logos">
            <div className="home-container51">
              <div className="home-container52">
                <div className="home-container53">
                  <img
                    alt="html5"
                    src="/playground_assets/html5.png"
                    className="home-image04"
                  />
                </div>
                <div className="home-container54">
                  <img
                    alt="css"
                    src="/playground_assets/css.png"
                    className="home-image05"
                  />
                </div>
                <div className="home-container55">
                  <img
                    alt="js"
                    src="/playground_assets/JS.png"
                    className="home-image06"
                  />
                </div>
              </div>
              <div className="home-container56">
                <div className="home-container57">
                  <img
                    alt="nodeJS"
                    src="/playground_assets/nodeJS.png"
                    className="home-image07"
                  />
                </div>
                <div className="home-container58">
                  <img
                    alt="react"
                    src="/playground_assets/React-icon.png"
                    className="home-image08"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
        <img
          alt="wave"
          src="/playground_assets/bottom.svg"
          className="home-bottom-wave-image"
        />
        <img
          alt="home"
          src="/playground_assets/waves-white.svg"
          className="home-image12"
        />
        <img
          alt="wave"
          src="/playground_assets/top.svg"
          className="home-top-wave-image"
        />
      </section>
    </div>
  )
}

export default Home
