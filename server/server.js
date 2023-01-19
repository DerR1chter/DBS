const express = require('express');
const oracledb = require('oracledb');
const app = express();
const cors = require('cors');
const axios = require('axios');

// Set up the database connection
const dbConfig = {
  user:" a12024913",
  password: "030498aA",
  connectString: '//oracle19.cs.univie.ac.at:1521/orclcdb'
};

// Set up the server to listen on port 3001
app.listen(3001, '0.0.0.0', () => {
  console.log('Server listening on port 3001');
});

app.use(cors());

function dbHandler(res, queries) {
  let conn;
  let results = [];
  let ID_TO_REPLACE;

  async function execute() {
    try {
      conn = await oracledb.getConnection(dbConfig);

      
      for (q of queries) {
        if (q.includes('ID_TO_REPLACE')) {
          q = q.replace('ID_TO_REPLACE', ID_TO_REPLACE);
        }
        results.push(await conn.execute(q));

        if (q.includes('SELECT MAX')) {
          ID_TO_REPLACE = results.slice(-1)[0].rows[0][0];
        }
      }
      await conn.commit();
    } catch (err) {
      console.error(err);
      results.push(err);
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (err) {
          console.error(err);
        }
      }
    }

    return results;
  }
  return execute();
}

app.get('/', async (req, res) => {
  const statement = 'SELECT * FROM PERSONS';
  const result = await dbHandler(res, [statement]);
  res.send(result[0]);
});

app.get('/addManager', async (req, res) => {
  const {name, surname, email, phone, gehalt, description} = req.query;
  
  let results = [];
  
  const query_1 = `INSERT INTO MITARBEITER VALUES (seq_mitarbeiter.nextval, '${surname}', '${name}', '${email}', '${phone}')`;
  const query_2 = 'SELECT MAX(MITARBEITER_ID) FROM MITARBEITER';
  const query_3 = `INSERT INTO MANAGER VALUES ('ID_TO_REPLACE', '${gehalt}', '${description}')`;
  results = [...results, ...await (dbHandler(res, [query_1, query_2, query_3]))];
    
  const error = results.find(item => item.hasOwnProperty('errorNum'));

  error ? res.status(500).json({ error: error.message }) : res.send(results);
});

app.get('/addTeacher', async (req, res) => {
  const {name, surname, email, phone, skype, KW, schulungsleitID, managerID} = req.query;

  let results = [];

  const query_1 = `INSERT INTO MITARBEITER VALUES (seq_mitarbeiter.nextval, '${surname}', '${name}', '${email}', '${phone}')`;
  const query_2 = 'SELECT MAX(MITARBEITER_ID) FROM MITARBEITER';
  const query_3 = `INSERT INTO LEHRER VALUES ('ID_TO_REPLACE', '${skype}', '${KW}', '${schulungsleitID}', '${managerID}')`;
  results = [...results, ...await (dbHandler(res, [query_1, query_2, query_3]))];
    
  const error = results.find(item => item.hasOwnProperty('errorNum'));
  
  error ? res.status(500).json({ error: error.message }) : res.send(results);
  });

app.get('/addStudent', async (req, res) => {
  const {name, surname, email, phone, niveau, gruppenID, managerID, paymentDate, paymentSum} = req.query;
  let results = [];

  const query_1 = `INSERT INTO ZAHLUNG VALUES (seq_zahlung.nextval, TO_DATE('${paymentDate}', 'YYYY-MM-DD'), ${paymentSum})`;
  const query_2 = 'SELECT MAX(ZAHLUNGS_ID) FROM ZAHLUNG';
  const query_3 = `INSERT INTO SCHUELER (NACHNAME, VORNAME, EMAIL_ADRESS, TELEFONNUMMER, NIVEAU, GRUPPEN_ID, ZAHLUNGS_ID, MANAGER_ID) VALUES ('${surname}', '${name}', '${email}', '${phone}', '${niveau}', '${gruppenID}', 'ID_TO_REPLACE', '${managerID}')`;
  results = [...results, ...await (dbHandler(res, [query_1, query_2, query_3]))];
    
  const error = results.find(item => item.hasOwnProperty('errorNum'));

  error ? res.status(500).json({ error: error.message }) : res.send(results);
  });


app.get('/getSchulungsleitIDs', async (req, res) => {
  const statement = 'SELECT MITARBEITER_ID FROM LEHRER';
  const result = await dbHandler(res, [statement]);

  const error = result.find(item => item.hasOwnProperty('errorNum'));
  error ? res.status(500).json({ error: error.message }) : res.send(result[0]);

});

app.get('/getManagerIDs', async (req, res) => {
  const statement = 'SELECT MITARBEITER_ID FROM MANAGER';
  const result = await dbHandler(res, [statement]);

  const error = result.find(item => item.hasOwnProperty('errorNum'));
  error ? res.status(500).json({ error: error.message }) : res.send(result[0]);
});

app.get('/getGruppenIDs', async (req, res) => {
  const statement = 'SELECT GRUPPEN_ID FROM GRUPPE';
  const result = await dbHandler(res, [statement]);

  const error = result.find(item => item.hasOwnProperty('errorNum'));
  error ? res.status(500).json({ error: error.message }) : res.send(result[0]);
});

app.get('/getZahlungIDs', async (req, res) => {
  const statement = 'SELECT ZAHLUNGS_ID FROM ZAHLUNG';
  const result = await dbHandler(res, [statement]);
  
  const error = result.find(item => item.hasOwnProperty('errorNum'));
  error ? res.status(500).json({ error: error.message }) : res.send(result[0]);
});

app.get('/deletePerson', async (req, res) => {
  const {id} = req.query;
  let statement;
  id[0] === 4 ? statement = `DELETE FROM SCHUELER WHERE SCHUELER_ID = ${id}` : statement = `DELETE FROM MITARBEITER WHERE MITARBEITER_ID = ${id}`;
  const result = await dbHandler(res, [statement]);

  const error = result.find(item => item.hasOwnProperty('errorNum'));
  error ? res.status(500).json({ error: error.message }) : res.send(result[0]);
});

app.get('/addGroup', async (req, res) => {
  const {startDate, endDate, teacherID} = req.query;
  const statement = `INSERT INTO GRUPPE VALUES (seq_gruppe.nextval, TO_DATE('${startDate}', 'YYYY-MM-DD'), TO_DATE('${endDate}', 'YYYY-MM-DD'), ${teacherID})`;
  const result = await dbHandler(res, [statement]);

  const error = result.find(item => item.hasOwnProperty('errorNum'));
  error ? res.status(500).json({ error: error.message }) : res.send(result[0]);
});

app.get('/addPayment', async (req, res) => {
  const {date, sum} = req.query;
  const statement = `INSERT INTO ZAHLUNG VALUES (seq_zahlung.nextval, TO_DATE('${date}', 'YYYY-MM-DD'), ${sum})`;
  const result = await dbHandler(res, [statement]);

  const error = result.find(item => item.hasOwnProperty('errorNum'));
  error ? res.status(500).json({ error: error.message }) : res.send(result[0]);
});

app.get('/getNRows', async (req, res) => {
  const {view, page, pageSize} = req.query;
  let statement;
  if (view === 'persons') {
    statement = `SELECT * FROM (
      SELECT p.*, ROWNUM rnum
      FROM PERSONS p)
      WHERE rnum between ${((page-1)*pageSize)+1} and ${(page*pageSize)+1}`;
  } else if (view === 'payments') {
    statement = `SELECT * FROM (
      SELECT p.*, ROWNUM rnum
      FROM PAYMENTS p)
      WHERE rnum between ${((page-1)*pageSize)+1} and ${(page*pageSize)+1}`;
    } else {
      statement = `SELECT * FROM (
        SELECT p.*, ROWNUM rnum
        FROM GROUPS p)
        WHERE rnum between ${((page-1)*pageSize)+1} and ${(page*pageSize)+1}`;
    }
  const result = await dbHandler(res, [statement]);
  
  const error = result.find(item => item.hasOwnProperty('errorNum'));
  error ? res.status(500).json({ error: error.message }) : res.send(result[0]);
});

app.get('/getRowsCount', async (req, res) => {
  const {view} = req.query;
  let statement;

  if (view === 'persons') {
    statement = 'SELECT COUNT(*) FROM PERSONS';
  } else if (view === 'payments') {
    statement = 'SELECT COUNT(*) FROM PAYMENTS';
  } else {
    statement = 'SELECT COUNT(*) FROM GROUPS';
  }

  const result = await dbHandler(res, [statement]);
  
  const error = result.find(item => item.hasOwnProperty('errorNum'));
  error ? res.status(500).json({ error: error.message }) : res.send(result[0]);
});


app.get('/generate', async (req, res) => {
  
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
            conn.commit();
            break;
          case 'lehrer':
            for (let i = 0; i < 10; i++) {
              const {name, surname, email, phone, skype, KW, schulungsleitID, managerID} = data[i];
              result = await conn.execute(`INSERT INTO MITARBEITER VALUES (seq_mitarbeiter.nextval, '${surname}', '${name}', '${email}', '${phone}')`);
              let id_lehrer = await conn.execute('SELECT MAX(MITARBEITER_ID) FROM MITARBEITER');
              id_lehrer = id_lehrer.rows[0][0];
              result_2 = await conn.execute(`INSERT INTO LEHRER VALUES ('${id_lehrer}', '${skype}', '${KW}', '${schulungsleitID}', '${managerID}')`);
            }
            conn.commit();
            break;
          case 'schueler':
            for (let i = 0; i < 10; i++) {
              const {name, surname, email, phone, niveau, gruppenID, schuelerManagerID, paymentDate, paymentSum} = data[i];
              result = await conn.execute(`INSERT INTO ZAHLUNG VALUES (seq_zahlung.nextval, TO_DATE('${paymentDate}', 'YYYY-MM-DD'), ${paymentSum})`);
              let zahlungsID = await conn.execute('SELECT MAX(ZAHLUNGS_ID) FROM ZAHLUNG');
              zahlungsID = zahlungsID.rows[0][0];

              result_2 = await conn.execute(`INSERT INTO SCHUELER (NACHNAME, VORNAME, EMAIL_ADRESS, TELEFONNUMMER, NIVEAU, GRUPPEN_ID, ZAHLUNGS_ID, MANAGER_ID) VALUES ('${surname}', '${name}', '${email}', '${phone}', '${niveau}', '${gruppenID}', '${zahlungsID}', '${schuelerManagerID}')`);
            }
            conn.commit();
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
