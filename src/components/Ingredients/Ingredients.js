import React, {useReducer, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'

const ingredientsReducer = (currentIngredients, action) => {
  switch(action.type){
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('should not get there')

  }

}

const httpReducer = (prevhttpState, action) => {
  switch(action.type){
    case "SEND":
      return {loading: true, error: null}
    case 'RESPONSE':
      return {...prevhttpState, loading: false}
    case 'ERROR':
      return {loading: false, error: action.error}
    case 'CLEAR':
      return {...prevhttpState, error: null}
    default:
      throw new Error('should not be reached')
  }
}

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null})
  //const [ingredients, setIngredients] = useState([])
  //const [isLoading, setIsLoading] = useState(false)
  //const [error, setError] = useState()
  
  const filteredIngredientsHandler =useCallback(filteredIngredients => {
    //setIngredients(filteredIngredients)
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, [])

  
  const addIngredientHandler = useCallback(ing => {
    dispatchHttp({type: 'SEND'})
    fetch('https://react-hooks-d247e-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: { 'Content-Type': 'application/json' }
    }).then(res =>{
       dispatchHttp({type:'RESPONSE' })
       return res.json()
      })
       .then(data => {
      //setIngredients(prevIng => [
       // ...prevIng, 
        //{id: data.name, ...ing}])
        dispatch({type: 'ADD', ingredient:{id: data.id, ...ing} })
    }).catch(error => {
      dispatchHttp({type: 'ERROR', error})

    })
  }, [])
  const removeIngredientHandler = useCallback((id) => {
    //setIsLoading(true)
    dispatchHttp({type: 'SEND'})
    fetch(`https://react-hooks-d247e-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
  })
  .then(res => {
    //setIsLoading(false)
    ///const newIngredients = [...ingredients].filter(ing => ing.id !== id)
    ///setIngredients(newIngredients)
    dispatch({type: 'DELETE', id })
    dispatchHttp({type:'RESPONSE' })

  })
  })
  const clearError = () => {
    dispatchHttp({type: 'CLEAR'})
  }

  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
      ingredients= {userIngredients} 
      onRemoveItem={removeIngredientHandler}/>
    )
  }, [userIngredients])
  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient = {addIngredientHandler} loading = {httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
       {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
