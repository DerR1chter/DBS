import React, { useState, useEffect } from 'react';
import TableData from './tableData';

function TableWithPagination(props) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addPersonLoading, setAddPersonLoading] = useState(false);
  const [currentView, setCurrentView] = useState('persons');

  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
    
    setLoading(true);
    let getRowsUrl;
    let getDataUrl;
    switch (currentView) {
      case 'persons':
        getRowsUrl = `http://localhost:3001/db?getRowsCount&view=persons`;
        getDataUrl = `http://localhost:3001/db?getNRows&view=persons&page=${page}&pageSize=${pageSize}`;
        break;
      case 'payments':
        getRowsUrl = `http://localhost:3001/db?getRowsCount&view=payments`;
        getDataUrl = `http://localhost:3001/db?getNRows&view=payments&page=${page}&pageSize=${pageSize}`;
        break;
      default:
        getRowsUrl = `http://localhost:3001/db?getRowsCount&view=persons`;
        getDataUrl = `http://localhost:3001/db?getNRows&view=persons&page=${page}&pageSize=${pageSize}`;
    }

    fetch(getRowsUrl)  
      .then(response => response.json()) 
      .then(data => {
        const rowsCount = data.rows[0][0];
          setTotalRows(rowsCount);
          setTotalPages(Math.ceil(rowsCount / pageSize));
          if (page > Math.ceil(rowsCount / pageSize)) {
            setPage(totalPages);
          }
        })
      .then(() => {
        fetch(getDataUrl)
        .then(response => response.json()) 
        .then(data => {
            setData(data);
            setLoading(false);
          });
      })
      .catch(error => console.log(error));
    
    
  }, [page, pageSize, addPersonLoading, totalPages, currentView, props.userAdded, props.userDeleted]);

  function handlePageChange(newPage) {
    setPage(newPage);
  }

  function handlePageSizeChange(event) {
    setPageSize(event.target.value);
  }

  function addPersons(event, role) {
    event.preventDefault();
    setAddPersonLoading(true);
    fetch(`http://localhost:3001/db/generate?role=${role}`)
    .then(response => response.json())
    .then(() => setAddPersonLoading(false));
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // Determine which page numbers to show and which to replace with "..."
  const visiblePageNumbers = [];
  if (totalPages <= 10) {
    // Show all pages if there are fewer than 10 pages
    visiblePageNumbers.push(...pages);
  } else if (page < 6) {
    // Show the first 10 pages if the current page is less than 6
    visiblePageNumbers.push(...pages.slice(0, 10));
  } else if (page > totalPages - 5) {
    // Show the last 10 pages if the current page is more than 5 from the end
    visiblePageNumbers.push(...pages.slice(-10));
  } else {
    // Show the current page and the 4 pages before and after it
    visiblePageNumbers.push(...pages.slice(page - 5, page + 5));
  }


  return (
    <div className="mainTable">
      <label htmlFor="views">Choose a view:</label>

        <select name="views" id="views" onChange={(e) => setCurrentView(e.target.value)}>
          <option value="persons">Persons</option>
          <option value="payments">Payments</option>
        </select>
      <form>
        <label htmlFor="pageSize">Rows per page:</label>
        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TableData data={data} view={currentView} />
      )}
      <div>
        Page {page} of {Math.ceil(totalRows / pageSize)}
      </div>
      

        <div className='pagination'>
          <button className={page === 1 ? null: "changePage"} onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
          </button>
          {visiblePageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={pageNumber === page ? null: "changePage"}
              onClick={() => handlePageChange(pageNumber)}
              disabled={pageNumber === page}
            >
              {pageNumber}
            </button>
          ))}
          <button className={page === totalPages ? null: "changePage"} onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
            Next
          </button>
      </div>
      {addPersonLoading ? (
        <div>Loading...</div>) : (
          <div className="addPeople">
            <button className="home-button button" id="addPerson" onClick={(event) => addPersons(event, 'manager')}>Add 10 managers</button>
            <button className="home-button button" id="addPerson" onClick={(event) => addPersons(event, 'lehrer')}>Add 10 teachers</button>
            <button className="home-button button" id="addPerson" onClick={(event) => addPersons(event, 'schueler')}>Add 10 students</button>
          </div>)
        }
    </div>
  );
}

export default TableWithPagination;
