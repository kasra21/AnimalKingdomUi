import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  AppBar, 
  Drawer, 
  MenuItem, 
  RaisedButton,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui'
import { ToastContainer, toast } from 'react-toastify';
import { RingLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css'

class About extends React.Component {

  //---------------------------------------Initialization

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      tableData: [],
      table: "",
      loading: false,
      spinner: ""
    };
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  //---------------------------------------User Interaction

  handleClick(event){
    //make the session expired right away
    window.location.replace("/animalKingDom/about");
  }

  componentDidMount() {
    var $ = require ('jquery');
    this.$fileChooserInputElement = $(this.fileChooserInputElement);
    this.setState({spinner: <RingLoader
        color={'#00bcd4'} 
        loading={true} 
      />
    });
  }

  componentWillUnmount() {
    //this.$fileChooserInputElement.somePlugin('destroy');
  }

  //---------------------------------------Services

  handleFileUpload(files) {
    var formData = new FormData();
    formData.append("file", files[0]);
    this.setState({loading: true});
    axios.post('/api/classifyImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
      this.processClassificationResult(response.data);
    })
    .catch(error => {
      toast.error("An Unexpected error has occured", {
        position: toast.POSITION.BOTTOM_LEFT
      });
    });
  }

  //add the error or the result to the page
  processClassificationResult(response) {
    if(response.msg === "success"){

      this.setState({loading: false});
      this.setState({tableData: response.result});
      this.setState({table: <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Breed</TableHeaderColumn>
            <TableHeaderColumn>Simularity</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.state.tableData.map((row, index) => (
            <TableRow key={index}>
              <TableRowColumn>{row.dogType}</TableRowColumn>
              <TableRowColumn>{row.simularityPercentageStr}</TableRowColumn>
            </TableRow>
            ))}
        </TableBody>
      </Table>
      });

      toast.success("Successfully Recongnized the image!", {
        position: toast.POSITION.BOTTOM_LEFT
      });

    } else {    //it is error
      toast.warn(response.msg, {
        position: toast.POSITION.BOTTOM_LEFT
      });
    }

  }

  //---------------------------------------Page Structure

  render() {
    return (
    <MuiThemeProvider>
      <div>
        <AppBar title="Animal  Kingdom"
        onLeftIconButtonTouchTap={this.handleToggle} >
        </AppBar>

        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}>
          <Link to='/animalKingDom/about'><MenuItem onTouchTap={this.handleClose}>About Page</MenuItem></Link>
          <MenuItem style={style}><RaisedButton label="Logout" primary={true}
          onClick={(event) => this.handleClick(event)}/></MenuItem>
        </Drawer>

      </div>
      <div>
        <input ref={fileChooserInputElement => this.fileChooserInputElement = fileChooserInputElement} type="file" onChange={(e) => this.handleFileUpload(e.target.files)} hidden />        
        <RaisedButton label="Choose Image File" primary={true} onClick={(e) => this.$fileChooserInputElement.click() }/>

        {this.state.loading ? this.state.spinner : this.state.table}

        <ToastContainer />
      </div>
    </MuiThemeProvider>
   );
   }
}

//---------------------------------------Styles

const style = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

//---------------------------------------export

export default About
