import React from 'react'
import About from './About'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


class Main extends React.Component {
 render() {
   return (
     <Router>
       <main>
         <Switch>
           <Route exact path='/' component={About}/>
           <Route path='/animalKingDom' component={About}/>
           <Route path='/animalKingDom/about' component={About}/>
         </Switch>
       </main>
     </Router>
   );
 }

}

export default Main