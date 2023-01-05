const express = require('express');
const oracledb = require('oracledb');
const app = express();
const cors = require('cors');
const axios = require('axios');

// Set up the database connection
const dbConfig = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  connectString: '//oracle19.cs.univie.ac.at:1521/orclcdb'
};

// Set up the server to listen on port 3001
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});

app.use(cors());

// Set up a route to handle requests to the database
app.get('/db', async (req, res) => {
  
  const queryKeys = Object.keys(req.query);
  const queryValues = Object.values(req.query);
  // console.log(queryKeys);

  let conn;
  let result;
  let result_2;

  try {
    // Create a new database connection
    conn = await oracledb.getConnection(dbConfig);
    
    switch(queryKeys[0]) {
      case 'addPerson':
        const name = queryValues[2];
        const surname = queryValues[3];
        const email = queryValues[4];
        const phone = queryValues[5];

        switch(queryValues[1]) {
          case 'manager':
            const gehalt = queryValues[6];
            const description = queryValues[7];

            result = await conn.execute(`INSERT INTO MITARBEITER VALUES (seq_mitarbeiter.nextval, '${surname}', '${name}', '${email}', '${phone}')`);
            let id_manager = await conn.execute('SELECT MAX(MITARBEITER_ID) FROM MITARBEITER');
            id_manager = id_manager.rows[0][0];
            result_2 = await conn.execute(`INSERT INTO MANAGER VALUES ('${id_manager}', '${gehalt}', '${description}')`);
            conn.execute('COMMIT');
            break;
          case 'lehrer':
            const skype = queryValues[6];
            const KW = queryValues[7];
            const schulungsleitID = queryValues[8];
            const managerID = queryValues[9];

            result = await conn.execute(`INSERT INTO MITARBEITER VALUES (seq_mitarbeiter.nextval, '${surname}', '${name}', '${email}', '${phone}')`);
            let id_lehrer = await conn.execute('SELECT MAX(MITARBEITER_ID) FROM MITARBEITER');
            id_lehrer = id_lehrer.rows[0][0];

            result_2 = await conn.execute(`INSERT INTO LEHRER VALUES ('${id_lehrer}', '${skype}', '${KW}', '${schulungsleitID}', '${managerID}')`);
            conn.execute('COMMIT');
            break;
          case 'schueler':
              const niveau = queryValues[6];
              const gruppenID = queryValues[7];
              const schuelerManagerID = queryValues[8];

              const paymentDate = queryValues[9];
              const paymentSum = queryValues[10];
              result = await conn.execute(`INSERT INTO ZAHLUNG VALUES (seq_zahlung.nextval, TO_DATE('${paymentDate}', 'YYYY-MM-DD'), ${paymentSum})`);
              
              let zahlungsID = await conn.execute('SELECT MAX(ZAHLUNGS_ID) FROM ZAHLUNG');
              zahlungsID = zahlungsID.rows[0][0];

              
              result = await conn.execute(`INSERT INTO SCHUELER (NACHNAME, VORNAME, EMAIL_ADRESS, TELEFONNUMMER, NIVEAU, GRUPPEN_ID, ZAHLUNGS_ID, MANAGER_ID) VALUES ('${surname}', '${name}', '${email}', '${phone}', '${niveau}', '${gruppenID}', '${zahlungsID}', '${schuelerManagerID}')`);
              conn.execute('COMMIT');
              break;
        }
        break;
        
      case 'getSchulungsleitIDs':
        result = await conn.execute('SELECT MITARBEITER_ID FROM LEHRER');
        break;

      case 'getManagerIDs':
        result = await conn.execute('SELECT MITARBEITER_ID FROM MANAGER');
        break;

      case 'getGruppenIDs':
        result = await conn.execute('SELECT GRUPPEN_ID FROM GRUPPE');
        break;

      case 'getZahlungIDs':
        result = await conn.execute('SELECT ZAHLUNGS_ID FROM ZAHLUNG');
        break;

      case 'deletePerson':
        if (queryValues[1][0] === '4') {
          result = await conn.execute(`DELETE FROM SCHUELER WHERE SCHUELER_ID = '${queryValues[1]}'`);
        } else {
          result = await conn.execute(`DELETE FROM MITARBEITER WHERE MITARBEITER_ID = '${queryValues[1]}'`);
        }
        conn.execute('COMMIT');
        break;

      case 'addGroup':
        const start = queryValues[1];
        const end = queryValues[2];
        const teacherID = queryValues[3];
        result = await conn.execute(`INSERT INTO GRUPPE VALUES (seq_gruppe.nextval, TO_DATE('${start}', 'YYYY-MM-DD'), TO_DATE('${end}', 'YYYY-MM-DD'), ${teacherID})`);
        conn.execute('COMMIT');
        break;

      case 'addPayment':
        const date = queryValues[1];
        const sum = queryValues[2];
        result = await conn.execute(`INSERT INTO ZAHLUNG VALUES (seq_zahlung.nextval, TO_DATE('${date}', 'YYYY-MM-DD'), ${sum})`);
        conn.execute('COMMIT');
        break;
      

      case 'getNRows':
        const view = queryValues[1];
        const page = queryValues[2];
        const pageSize = queryValues[3];
        let statement;

        switch (view) {
          case 'persons':
            statement = `SELECT * FROM (
              SELECT p.*, ROWNUM rnum
              FROM PERSONS p)
              WHERE rnum between ${((page-1)*pageSize)+1} and ${(page*pageSize)+1}`;
            break;
          case 'payments':
            statement = `SELECT * FROM (
              SELECT p.*, ROWNUM rnum
              FROM PAYMENTS p)
              WHERE rnum between ${((page-1)*pageSize)+1} and ${(page*pageSize)+1}`;
              break;
        }
        result = await conn.execute(statement);
        break;
      
      case 'getRowsCount':
        const selectedView = queryValues[1];
        switch (selectedView) {
          case 'persons':
            result = await conn.execute(`SELECT COUNT(*) FROM PERSONS`);
            break;
          case 'payments':
            result = await conn.execute(`SELECT COUNT(*) FROM PAYMENTS`);
            break;
        }
        break;
        
      default:
        // // Execute a SQL query against the database
        result = await conn.execute('SELECT * FROM PERSONS');
    }

    res.json(result_2 !== undefined ? [result, result_2] : result);

    // res.json(resultat_final);
  } catch (err) {
    // If there is an error, log it and send an error response to the client
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    // Close the database connection
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

app.get('/db/generate', async (req, res) => {
  
  const queryValues = Object.values(req.query);

  let conn;
  let result;
  let result_2;
  
  function generatePhoneNumber() {
    const firstPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const secondPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const thirdPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
    return `+43 ${firstPart} ${secondPart} ${thirdPart}`;
  }

  function generateKWs() {
    const firstPart = Math.floor(Math.random() * 17).toString();
    const secondPart = (Math.floor(Math.random() * 17)+17).toString();
    const thirdPart = (Math.floor(Math.random() * 17)+35).toString();
  
    return `${firstPart}, ${secondPart}, ${thirdPart}`;
  }
  
  const niveaus = ['A1.1', 'A1.2','A2.1', 'A2.2', 'B1.1', 'B1.2', 'B2.1', 'B2.2'];

  function generateRandomDate() {
    const start = new Date(2021, 0, 1); // Start date is 2021-01-01
    const end = new Date(); // End date is current date
    const randomTimestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const randomDate = new Date(randomTimestamp);
    return randomDate.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
  }

  let data = [];

  try {
    // Create a new database connection
    conn = await oracledb.getConnection(dbConfig);

    const response = await axios.get('https://random-data-api.com/api/v2/users?size=10&response_type=json');

      let schulungsleitIDs = await conn.execute('SELECT MITARBEITER_ID FROM LEHRER');
      schulungsleitIDs = schulungsleitIDs.rows.map((id) => id[0]);  

      let managerIDs = await conn.execute('SELECT MITARBEITER_ID FROM MANAGER');
      managerIDs = managerIDs.rows.map((id) => id[0]);

      let gruppenIDs = await conn.execute('SELECT GRUPPEN_ID FROM GRUPPE');
      gruppenIDs = gruppenIDs.rows.map((id) => id[0]);


    data = response.data.map(({first_name, last_name, email, username, employment: {title}}) => (
      {name: first_name, 
        surname: last_name, 
        email, 
        phone: generatePhoneNumber(),
        gehalt: Math.floor(Math.random() * 50000), 
        description: title,
        skype: username, 
        KW: generateKWs(),
        niveau: niveaus[Math.floor(Math.random() * niveaus.length)],
        schulungsleitID: schulungsleitIDs[Math.floor(Math.random() * schulungsleitIDs.length)],
        managerID: managerIDs[Math.floor(Math.random() * managerIDs.length)],
        gruppenID: gruppenIDs[Math.floor(Math.random() * gruppenIDs.length)],
        schuelerManagerID: managerIDs[Math.floor(Math.random() * managerIDs.length)],
        paymentDate: generateRandomDate(),
        paymentSum: Math.floor(Math.random() * 1000)
      }
      ));

        switch(queryValues[0]) {
          case 'manager':
            for (let i = 0; i < 10; i++) {
              const {name, surname, email, phone, gehalt, description} = data[i];
              result = await conn.execute(`INSERT INTO MITARBEITER VALUES (seq_mitarbeiter.nextval, '${surname}', '${name}', '${email}', '${phone}')`);
              let id_manager = await conn.execute('SELECT MAX(MITARBEITER_ID) FROM MITARBEITER');
              id_manager = id_manager.rows[0][0];
              result_2 = await conn.execute(`INSERT INTO MANAGER VALUES ('${id_manager}', '${gehalt}', '${description}')`);
            }
            conn.execute('COMMIT');
            break;
          case 'lehrer':
            for (let i = 0; i < 10; i++) {
              const {name, surname, email, phone, skype, KW, schulungsleitID, managerID} = data[i];
              result = await conn.execute(`INSERT INTO MITARBEITER VALUES (seq_mitarbeiter.nextval, '${surname}', '${name}', '${email}', '${phone}')`);
              let id_lehrer = await conn.execute('SELECT MAX(MITARBEITER_ID) FROM MITARBEITER');
              id_lehrer = id_lehrer.rows[0][0];
              result_2 = await conn.execute(`INSERT INTO LEHRER VALUES ('${id_lehrer}', '${skype}', '${KW}', '${schulungsleitID}', '${managerID}')`);
            }
            conn.execute('COMMIT');
            break;
          case 'schueler':
            for (let i = 0; i < 10; i++) {
              const {name, surname, email, phone, niveau, gruppenID, schuelerManagerID, paymentDate, paymentSum} = data[i];
              result = await conn.execute(`INSERT INTO ZAHLUNG VALUES (seq_zahlung.nextval, TO_DATE('${paymentDate}', 'YYYY-MM-DD'), ${paymentSum})`);
              let zahlungsID = await conn.execute('SELECT MAX(ZAHLUNGS_ID) FROM ZAHLUNG');
              zahlungsID = zahlungsID.rows[0][0];

              result_2 = await conn.execute(`INSERT INTO SCHUELER (NACHNAME, VORNAME, EMAIL_ADRESS, TELEFONNUMMER, NIVEAU, GRUPPEN_ID, ZAHLUNGS_ID, MANAGER_ID) VALUES ('${surname}', '${name}', '${email}', '${phone}', '${niveau}', '${gruppenID}', '${zahlungsID}', '${schuelerManagerID}')`);
            }
              conn.execute('COMMIT');
              break;
        }

      
    res.json(result_2 !== undefined ? [result, result_2] : result);

    // res.json(resultat_final);
  } catch (err) {
    // If there is an error, log it and send an error response to the client
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    // Close the database connection
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});
