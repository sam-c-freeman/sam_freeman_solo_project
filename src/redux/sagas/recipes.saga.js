import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';





function* fetchRecipes (){
    try {
        const recipes = yield axios.get('/api/recipes');
        console.log(recipes.data)
        yield put ({type: 'SET_RECIPES', payload: recipes.data});
    } catch (error) {
        console.log(error);
        alert('Error fetching recipes');
    }
}


//this may need to be a different saga?
function* fetchCupboard (){
    try {
        const cupboard = yield axios.get('/api/cupboard');
        // console.log(cupboard.data)
        yield put ({type: 'SET_CUPBOARD', payload: cupboard.data});
    } catch (error) {
        console.log(error);
        alert('Error fetching cupboard');
    }
}

function* compareFunction (){
    try {
        const testCupboard = yield axios.get('/api/cupboard');
        const testRecipes = yield axios.get('/api/recipes');
    //    console.log(testCupboard.data)
    //    console.log(testRecipes.data)
       
        const cupboardArray = []
        for (let cupboardIngredient of testCupboard.data){
            // console.log(cupboardIngredient.name)
            cupboardArray.push(cupboardIngredient.name)
        }
        console.log(cupboardArray); //this gets the ingredients into an array to compare
        


        let checker = (arr, target) => target.every(v => arr.includes(v));
        let resultsArray = [];

       

        for(let recipeToCheck of testRecipes.data){
            console.log(recipeToCheck.ingredient_list)
            console.log(recipeToCheck.recipe_id)
            console.log(checker(cupboardArray, recipeToCheck.ingredient_list))
            if(checker(cupboardArray, recipeToCheck.ingredient_list) === true){
                resultsArray.push(recipeToCheck.recipe_id)
            }
            
        } //this checks the cupboard compared to recipes list

        console.log(resultsArray); 
        
        //this gives me the recipe_id of matching recipes.  Will
        //need to create a reducer to hold this data?
    

        // console.log(checker( testRecipes.data[0].ingredient_list , cupboardArray))
        // console.log(checker( testRecipes.data[1].ingredient_list , cupboardArray))

  
        yield put ({type: 'SET_MATCHING_IDS', payload: resultsArray});
        
    } catch (error) {
        console.log(error);
        alert('Error in compare function');
    }
}

function*postMatchingRecipes (action){
    try {
        const idsToGet = action.payload;
        console.log(idsToGet);

        //this step is sending the correct number of IDS but get route is 
        //getting back the wrong number
        
        // const matches = yield axios.get(`/api/recipes/${idsToGet}`);   //changing from this method to send multiple?
        const matches = yield axios.post(`/api/recipes/matches`, idsToGet);
        // console.log(matches.data)
        yield put ({type: 'GET_MATCHING_RECIPES'});
    } catch (error) {
        console.log(error);
        alert('Error setting matching recipes');
    }
}


// function* getMatchingRecipes (){
//     const matchingIdsReducer = useSelector(store => store.recipeReducer);
//     console.log(matchingIdsReducer);
//     try {
//         const recipes = yield axios.get('/api/recipes/matches');
//         // console.log(recipes.data)
//         yield put ({type: 'SET_MATCHING_RECIPES', payload: recipes.data});
//     } catch (error) {
//         console.log(error);
//         alert('Error setting recipes');
//     }
// }

function* addRecipe (action) {
    //try .filter to get rid of null key/value pairs
    // const 

    
    try {
        console.log(action.payload)
        const newRecipe = action.payload
        yield axios.post('/api/recipes', newRecipe);
        yield put ({type: 'FETCH_RECIPES'});
    } catch (error) {
        console.log(error);
        alert('Error fetching recipes');
    }
}

function* fetchOneDrink(action) {
    // get one drink from the DB
    const drinkId = action.payload;
    try {
        const drink = yield axios.get(`/api/recipes/${drinkId}`);
        yield put({ type: 'SET_ONE_DRINK', payload: drink.data });

    } catch {
        console.log('get one Drink error');
    }
        
}

function* saveToFavorites (action) {
    try {
        
        const recipeToSave = action.payload
        console.log(recipeToSave);
        const saved = yield axios.post('/api/recipes/save', recipeToSave);
        yield put ({type: 'GET_SAVED_RECIPES'});
    } catch (error) {
        console.log(error);
        alert('Error setting favorite recipes');
    }
}
function* fetchFavorites () {
    try {
        const favorites = yield axios.get('/api/recipes/favorites');
        console.log(favorites.data)
        yield put ({type: 'SET_SAVED_RECIPES', payload: favorites.data});
    } catch (error) {
        console.log(error);
        alert('Error fetching favorites');
    }
}

function* deleteSaved (action) {
    console.log(action.payload)
    const deleteId = action.payload
    try{
        const deleteRecipeRoute = yield axios.delete(`/api/recipes/saved/${deleteId}`);
        yield put({type: 'GET_SAVED_RECIPES'})
    } catch {
        console.log('error in delete route for saved recipe')
    }
}




function* recipesSaga() {
  yield takeLatest('FETCH_RECIPES', fetchRecipes);
  yield takeLatest('FETCH_CUPBOARD', fetchCupboard);
  yield takeLatest('COMPARE_CUPBOARD_RECIPES', compareFunction);
  yield takeLatest('POST_MATCHING_RECIPES', postMatchingRecipes);
//   yield takeLatest('TEST_MATCHING_RECIPES', getMatchingRecipes); 
  //going to try to edit this one instead.  This didn't work
  yield takeLatest('ADD_RECIPE', addRecipe);
  yield takeLatest('FETCH_DRINK_DETAILS', fetchOneDrink);
//   yield takeLatest('TEST_GET_MATCHES', fetchMatchingRecipes); 
  // testing using a get route instead of original post

  yield takeLatest('SAVE_RECIPE', saveToFavorites);
  yield takeLatest('GET_SAVED_RECIPES', fetchFavorites);
  yield takeLatest('DELETE_SAVED', deleteSaved)
}

export default recipesSaga;
