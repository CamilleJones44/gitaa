import { useState, useEffect, useRef, useReducer } from 'react';

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
  searchTerm: 'react', // Default set here.
};

function sR(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      
      return { ...state, isLoading: true, isError: false };

    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, data: action.payload };

    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };

    case 'REMOVE_ITEM':
   
    case 'SET_SEARCH_TERM':
    
    default:
      throw new Error();
  }
}

function App() {
  const inputRef = useRef();
  const [state, dispatch] = useReducer(sR, initialState);


  const fetchStories = async (query) => {
    dispatch({ type: 'FETCH_INIT' });

    try {
     
      const response = await fetch(`https://hn.algolia.com/api/v1/search?query=${query}`);

          const result = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: result.hits });
    } catch {
      dispatch({ type: 'FETCH_FAILURE' });
    }
  };


  useEffect(() => {
    fetchStories(state.searchTerm);
  
  }, [state.searchTerm]); 

  const handleSearchInput = (event) => {

    dispatch({ type: 'SET_SEARCH_TERM', payload: event.target.value });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
   
    fetchStories(state.searchTerm);
  };

  return (

    
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>My nEW News</h1>

      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
        <input
          
          type="text"
          value={state.searchTerm}
          
          onChange={handleSearchInput}
          ref={inputRef}
        />
      
        <button
          type="button"
          onClick={() => inputRef.current.focus()} 
          style={{ marginLeft: '10px' }}
        >
          Focus Input
        </button>
        
              <button type="submit" style={{ marginLeft: '15x' }}>
                
          Search
        </button>
      </form>

     
      {state.isError && <p style={{ color: 'red' }}></p>}
      
      {state.isLoading ? (
      
        <p>Loading.......</p>
      ) : (
        <ul>
         

          {state.data.map((item) => (

          
            <li key={item.objectID} style={{ marginBottom: '15px' }}>

              
              <a href={item.url} target="_blank" rel="noreferrer">
                
                {item.title || 'THERE IS NOTA TITLE'}
              </a>


              <button
                type="button"

                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.objectID })} 

                style={{ marginLeft: '15px' }}
              >
                Dismiss
              </button>
            </li>

          
           ))}
        </ul>
      
      )}
    </div>
  );
  
}

export default App;
