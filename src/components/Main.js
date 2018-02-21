import React from 'react'
import AnimalsRec from './AnimalsRec'
import DogsRec from './DogsRec'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


class Main extends React.Component {
 render() {
   return (
     <Router>
       <main>
         <Switch>
           <Route exact path='/' component={AnimalsRec}/>
           <Route path='/animalKingDom/dogsRec' component={DogsRec}/>
         </Switch>
       </main>
     </Router>
   );
 }

}

export default Main