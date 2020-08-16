import React,{createContext,useReducer, useEffect,useContext} from 'react';
import NavBar from './components/Navbar'
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import SignIn from './components/screens/SignIn'
import SignUp from './components/screens/SignUp'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import {userReducer,initialState} from './reducers/userReducer'
import FollowedPost from './components/screens/FollowedPosts'

export const UserContext = createContext()

const Routing=()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({ type: "USER", payload: user })
    }else{
      history.push('/signin')
    }
  },[])
  return(
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
      <Route path="/myfollowedpost">
        <FollowedPost />
      </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(userReducer,initialState)
  return (
    // <h1>Hello</h1>
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar/>
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
