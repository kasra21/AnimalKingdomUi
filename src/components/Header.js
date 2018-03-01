import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {AppBar, Drawer, MenuItem} from 'material-ui'
import { Link } from 'react-router-dom';

// The Header creates links that can be used to navigate
// between routes.
class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  render() {
    return (
    <MuiThemeProvider>
      <div>
        <AppBar title="Animal Kingdom"
        onLeftIconButtonTouchTap={this.handleToggle} >
        </AppBar>

        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}>
          <Link to='/animalKingDom/'><MenuItem onTouchTap={this.handleClose}>About</MenuItem></Link>
          <Link to='/animalKingDom/'><MenuItem onTouchTap={this.handleClose}>Test</MenuItem></Link>
        </Drawer>
      </div>
    </MuiThemeProvider>
   );
   }
}

export default Header
