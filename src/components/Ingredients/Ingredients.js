import React, {useState, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'

function Ingredients() {
  const [ingredients, setIngredients] = useState([])
  useEffect(() => {
    fetch('https://react-hooks-d247e-default-rtdb.firebaseio.com/ingredients.json')
  .then(res => res.json())
  .then(data => {
    const loadedIngredients = []
    for (let key in data){
      loadedIngredients.push({
        id: key,
        title: data[key].title,
        amount: data[key].amount
      })
    }
    setIngredients(loadedIngredients)
  })
  }, [])

  
  const addIngredientHandler = ing => {
    fetch('https://react-hooks-d247e-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(data => {
      setIngredients(prevIng => [
        ...prevIng, 
        {id: data.name, ...ing}])
    })
  }
  const removeIngredientHandler = (id) => {
    const newIngredients = [...ingredients].filter(ing => ing.id !== id)
    setIngredients(newIngredients)

  }
  return (
    <div className="App">
      <IngredientForm onAddIngredient = {addIngredientHandler} />

      <section>
        <Search />
        <IngredientList 
        ingredients= {ingredients} 
        onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
