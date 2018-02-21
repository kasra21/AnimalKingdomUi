import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  AppBar, 
  Divider,
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
import Center from 'react-center';
import { ToastContainer, toast } from 'react-toastify';
import { RingLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css'

class DogsRec extends React.Component {

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
    window.location.replace("/animalKingDom/dogsRec");
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
    axios.post('/api/classifyDogImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
      this.processClassificationResult(response.data);
      this.setState({loading: false});
    })
    .catch(error => {
      toast.error("An Unexpected error has occured", {
        position: toast.POSITION.BOTTOM_LEFT
      });
      this.setState({loading: false});
    });
  }

  //add the error or the result to the page
  processClassificationResult(response) {
    if(response.msg === "success"){

      this.setState({tableData: response.result});

      this.removeDuplicates();

      if(this.state.tableData[0].simularityPercentage <= 4.99) {
        toast.warn("We have difficulties to identify the image, please try another image ...", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }
      else {
        this.setState({table:<Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Dog Breed</TableHeaderColumn>
              <TableHeaderColumn>Simularity</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.tableData.map((row, index) => (
              <TableRow key={index}>
                <TableRowColumn>{this.setAnimalType(row.type)}</TableRowColumn>
                <TableRowColumn>{row.simularityPercentageStr}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
        });
  
        toast.success("Successfully Recongnized the image!", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }

    } else {    //it is error
      toast.warn(response.msg, {
        position: toast.POSITION.BOTTOM_LEFT
      });
    }

  }

  //---------------------------------------Helpers
  setAnimalType(type) {
    if (type.startsWith("alligatororcrocodile")) {
      return "Alligator"
    }
    else {
      return type;
    }
  }

  removeDuplicates() {
    var uniqueTableData = [];
    this.state.tableData.forEach(element => {
      var key = element.type;
      uniqueTableData.forEach(el => {
        if(el.type !== key) {
          uniqueTableData.push(element);
        }
      });
    });

    this.setState({tableData: uniqueTableData});
  }

  //---------------------------------------Page Structure

  render() {
    return (
    <MuiThemeProvider>
      <div>
        <div>
          <AppBar title="Dog Breed Recognition"
          onLeftIconButtonClick={this.handleToggle} >
          </AppBar>

          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}>
            <MenuItem disabled={true} style={{backgroundColor: '#00bcd4', color: '#ffffff', fontWeight: 'bold'}} >Animal Kingdom</MenuItem>
            <Divider />
            <Link to='/'><MenuItem onTouchTap={this.handleClose}>Animal Recognition</MenuItem></Link>
            <Link to='/animalKingDom/dogsRec'><MenuItem onTouchTap={this.handleClose}>Dog Recognition</MenuItem></Link>
          </Drawer>

        </div>
        <div>
          <input ref={fileChooserInputElement => this.fileChooserInputElement = fileChooserInputElement} type="file" onChange={(e) => this.handleFileUpload(e.target.files)} hidden />        
          <Center>
            <div style={marginTopStyle}>
              <RaisedButton label="Choose Image File Or Take a picture" primary={true} onClick={(e) => this.$fileChooserInputElement.click() } /> 
            </div>
          </Center>
          <Center>
            <div style={marginTopStyle}>
              {this.state.loading ? this.state.spinner : this.state.table}
            </div>
          </Center>
          <ToastContainer />
        </div>
      </div>
    </MuiThemeProvider>
   );
   }
}

//---------------------------------------Styles

const marginTopStyle = {
  marginTop: '12px'
};

//---------------------------------------export

export default DogsRec
