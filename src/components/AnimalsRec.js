import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  AppBar,
  Dialog,
  Divider,
  Drawer,
  FlatButton,
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

class AnimalsRec extends React.Component {

  //---------------------------------------Initialization

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openDialog: false,
      tableData: [],
      table: "",
      loading: false,
      spinner: ""
    };
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});
  handleOpenDialog = () => this.setState({openDialog: true});
  handleCloseDialog = () => this.setState({openDialog: false});

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
      if(response.data.result[0].type.startsWith("dog")) {
        this.handleOpenDialog();
      }
      this.setState({loading: false});
      this.$fileChooserInputElement.prop("value", "");
    })
    .catch(error => {
      toast.error("An Unexpected error has occured", {
        position: toast.POSITION.BOTTOM_LEFT
      });
      this.setState({loading: false});
      this.$fileChooserInputElement.prop("value", "");
    });
  }

  handleFileUploadDog() {
    debugger;
    console.log("test");
    this.handleCloseDialog();
    // if(element !== undefined && element.files.length > 0) {

    // }
  }

  handleFileUploadDog = () => {this.setState({openDialog: false})
    //this.handleCloseDialog();
  };

  //add the error or the result to the page
  processClassificationResult(response) {
    if(response.msg === "success"){

      this.setState({tableData: response.result.map(x => {
        var obj = {};
        obj.type = this.setAnimalType(x.type);
        obj.simularityPercentageStr = x.simularityPercentageStr;
        return obj;
      })});

      this.removeDuplicates();

      if(this.state.tableData[0].simularityPercentage < 5.01) {
        toast.warn("We have difficulties to identify the image, please try another image ...", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }
      else {
        this.setState({table:<Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Animal</TableHeaderColumn>
              <TableHeaderColumn>Simularity</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.tableData.map((row, index) => (
              <TableRow key={index}>
                <TableRowColumn>{row.type}</TableRowColumn>
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
  removeDuplicates() {
    var uniqueTableData = [];
    uniqueTableData.push(this.state.tableData[0]);
    this.state.tableData.forEach(element => {
      var key = element.type;
      var addFlag = true;
        (function(){
          uniqueTableData.forEach(el => {
            if(el.type === key) {
              addFlag = false;
            }
          });
        })();
        if(addFlag){
          uniqueTableData.push(element);
        }
    });

    this.setState({tableData: uniqueTableData});
  }

  setAnimalType(type) {
    if (type.startsWith("alligatororcrocodile")) {
      return "Alligator"
    }
    else if (type.startsWith("ape") || type.startsWith("monkey")) {
      return "Ape"
    }
    else if (type.startsWith("bird")) {
      return "Bird"
    }
    else if (type.startsWith("bison")) {
      return "Bison"
    }
    else if (type.startsWith("cat")) {
      return "Cat"
    }
    else if (type.startsWith("chicken")) {
      return "Chicken"
    }
    else if (type.startsWith("cow")) {
      return "Cow"
    }
    else if (type.startsWith("deer")) {
      return "Deer"
    }
    else if(type.startsWith("dog")) {
      return "Dog";
    }
    else if(type.startsWith("dolphin")) {
      return "Dolphin";
    }
    else if(type.startsWith("duck")) {
      return "Duck";
    }
    else if(type.startsWith("eagle")) {
      return "Eagle";
    }
    else if(type.startsWith("elephant")) {
      return "Elephant";
    }
    else if(type.startsWith("fish")) {
      return "Fish";
    }
    else if (type.startsWith("frog")) {
      return "Frog"
    }
    else if(type.startsWith("hamster")) {
      return "Hamster";
    }
    else if(type.startsWith("horse")) {
      return "Horse";
    }
    else if(type.startsWith("lion")) {
      return "Lion";
    }
    else if(type.startsWith("lobsterorcrab") || type.startsWith("crab")) {
      return "Crab";
    }
    else if(type.startsWith("macropodidae")) {
      return "Macropodidae/Kangaroo ";
    }
    else if(type.startsWith("owl")) {
      return "Owl";
    }
    else if(type.startsWith("pig")) {
      return "Pig";
    }
    else if(type.startsWith("panda")) {
      return "Panda";
    }
    else if(type.startsWith("rabbit")) {
      return "Rabbit";
    }
    else if(type.startsWith("shark")) {
      return "Shark";
    }
    else if(type.startsWith("sheeporgoat")) {
      return "Sheep/Goat";
    }
    else if(type.startsWith("snake")) {
      return "Snake";
    }
    else if(type.startsWith("spider")) {
      return "Spider";
    }
    else if(type.startsWith("tiger")) {
      return "Tiger";
    }
    else if(type.startsWith("turkey")) {
      return "Turkey";
    }
    else if (type.startsWith("wolf")) {
      return "Wolf"
    }
    else {
      return type;
    }
  }

  //---------------------------------------Page Structure

  render() {
    const actions = [
      <FlatButton
        label="No"
        primary={true}
        onClick={this.handleCloseDialog}
      />,
      <FlatButton
        label="Yes"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleFileUploadDog}
      />,
    ];

    return (
    <MuiThemeProvider>
      <div>
        <div>
          <AppBar title="Animal Recognition"
          onLeftIconButtonClick={this.handleToggle} >
          </AppBar>

          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}>
            <MenuItem disabled={true} style={{backgroundColor: '#00bcd4', color: '#ffffff', fontWeight: 'bold'}}>Animal Kingdom</MenuItem>
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
        <Dialog
          title="Dog Breed Recognition?"
          actions={actions}
          modal={false}
          open={this.state.openDialog}
          onRequestClose={this.handleCloseDialog}
        >
          This Animal looks like a Dog, would you like to identify the breed of dog?
        </Dialog>
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

export default AnimalsRec
