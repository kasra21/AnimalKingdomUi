import React from 'react'
import About from './About'
import DogsRec from './DogsRec'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


class Main extends React.Component {
 render() {
   return (
     <Router>
       <main>
         <Switch>
           <Route exact path='/' component={About}/>
           <Route path='/animalKingDom/dogsRec' component={DogsRec}/>
         </Switch>
       </main>
     </Router>
   );
 }

}

export default Main