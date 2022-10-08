import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function RecipesList () {
    const dispatch = useDispatch();


    const recipesList = useSelector(store => store.recipeReducer);
    

    useEffect(() => {
      dispatch({ type: 'FETCH_RECIPES' })


      
    }, []);

  
    
    return(
        <p>Recipes List Page</p>
    )
}

export default RecipesList;

