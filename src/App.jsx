import { useState, useEffect, useRef, useReducer } from 'react';

const initialState = {
  
  data: [],
  isLoading: false,

  
  isError: false,
  searchTerm: 'react',
};

function storiesReducer(state, action) {
  
  switch (action.type) {
    case 'FETCH_INIT':
      
      return { ...state, isLoading: true, isError: false };
    case 'FETCH_SUCCESS':
      
      return { ...state, isLoading: false, data: action.payload };
    case 'FETCH_FAILURE':
      
      return { ...state, isLoading: false, isError: true };
    case 'REMOVE_ITEM':
      
      return {
        ...state,

        
        data: state.data.filter(item => item.objectID !== action.payload),
      };
    case 'SET_SEARCH_TERM':
      
      return { ...state, searchTerm: action.payload };
    default:
      throw new Error();
  }
}

function App() {

  
  const inputRef = useRef();
  
  const [state, dispatch] = useReducer(storiesReducer, initialState);

  const { data, isLoading, isError, searchTerm } = state;

  // API endpoint (using Hacker News)
  const API_ENDPOINT = `https://hn.algolia.com/api/v1/search?query=${searchTerm}`;

  // Fetch stories whenever searchTerm changes
  useEffect(() => {
    const fetchStories = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {

        
        const response = await fetch(API_ENDPOINT);
        const result = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: result.hits });
        
      } catch {
        dispatch({ type: 'FETCH_FAILURE' });
      }
    };

    fetchStories();
  }, [searchTerm]);

  // Handle form submission
  const handleSearchSubmit = (event) => {
  
    event.preventDefault();
    
    const term = inputRef.current.value;
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };

  // Handle removing a story
  const handleRemoveItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h1>My Articles</h1>

      <form onSubmit={handleSearchSubmit}>
        <input
          ref={inputRef}
          type="text"

          
          defaultValue={searchTerm}
          placeholder="Search stories"
        />
        <button type="submit">Search</button>
      </form>

     
      {isError && <p style={{ color: 'red' }}>Something went wrong...</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.objectID}>
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.title}
              </a>{' '}
              <button onClick={() => handleRemoveItem(item.objectID)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
