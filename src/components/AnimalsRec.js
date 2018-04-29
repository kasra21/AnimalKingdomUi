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
  SelectField,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui'
import Center from 'react-center';
import Progress from 'react-progressbar';
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
      openUploadToHelpDialog: false,
      tableData: [],
      table: "",
      loading: false,
      spinner: "",
      file: null,
      dropdownValue: null,
      dropdownItems: []
    };

    axios.post('/api/getLabels', {
      labelGroup: 'All'
    })
    .then(response => {
      var tempArr = [];
      for (let i = 0; i < response.data.labels.length; i++ ) {
        tempArr.push(<MenuItem value={response.data.labels[i]} key={response.data.labels[i]} primaryText={response.data.labels[i]} />);
      }
      this.setState({dropdownItems: tempArr});
      this.setState({dropdownValue: response.data.labels[0]});
    })
    .catch(error => {
      toast.error("Error: " + error, {
        position: toast.POSITION.BOTTOM_LEFT
      });
    });
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});
  handleOpenDialog = () => this.setState({openDialog: true});
  handleCloseDialog = () => this.setState({openDialog: false});
  handleOpenUploadToHelpDialog = () => this.setState({openUploadToHelpDialog: true});
  handleCloseUploadToHelpDialog = () => this.setState({openUploadToHelpDialog: false});
  dropdownHandleChange = (event, index, value) => this.setState({dropdownValue: value});

  //---------------------------------------User Interaction

  componentDidMount() {
    var $ = require ('jquery');
    this.$fileChooserInputElement = $(this.fileChooserInputElement);
    this.setState({spinner: <div style={{marginTop: '40px'}}> 
      <RingLoader
        color={'#00bcd4'} 
        loading={true} 
      />
      </div>
    });
  }

  componentWillUnmount() {
    //this.$fileChooserInputElement.somePlugin('destroy');
  }

  handleCloseAndHelp = () => {
    this.handleOpenUploadToHelpDialog();
  }

  //---------------------------------------Services

  handleHelpFileUpload = () => {
    var label = this.state.dropdownValue;
    var file = this.state.file;
    var formData = new FormData();
    formData.append("file", file);
    formData.append("label", label);

    axios.post('/api/uploadTmpImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
      toast.success("Thank you for you submission!", {
        position: toast.POSITION.BOTTOM_LEFT
      });
      this.setState({openUploadToHelpDialog: false});
    })
    .catch(error => {
      toast.error("An Unexpected error has occured", {
        position: toast.POSITION.BOTTOM_LEFT
      });
      this.setState({openUploadToHelpDialog: false});
    });
  }

  handleFileUpload(files) {

    var formData = new FormData();
    formData.append("animal", "All");
    formData.append("file", files[0]);
    this.setState({file: files[0]});
    this.setState({loading: true});
    axios.post('/api/classifyImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
      if(response.data.result[0].simularityPercentage < 5.01) {
        toast.warn("We have difficulties to identify the image, please try another image ...", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }
      else {
        this.processClassificationResult(response.data);
        if(response.data.result[0].type.startsWith("Dog") ) {
          this.handleOpenDialog();
        }
      }
      this.setState({loading: false});
      this.$fileChooserInputElement.prop("value", "");
      if(! toast.isActive(this.toastId)){
        this.toastId = toast(
          <div>
            Don't like the result? Help us to improve our system!
            <RaisedButton onClick={this.handleOpenUploadToHelpDialog} label="Click Here" style={{marginLeft: 8}} /> 
          </div>, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 15000
        });
      }
    })
    .catch(error => {
      toast.error("An Unexpected error has occured", {
        position: toast.POSITION.BOTTOM_LEFT
      });
      this.setState({loading: false});
      this.$fileChooserInputElement.prop("value", "");
    });
  }

  handleFileUploadDog= () => {
    this.setState({openDialog: false})
    var formData = new FormData();
    formData.append("animal", "Dog");
    formData.append("file", this.state.file);
    this.setState({loading: true});
    axios.post('/api/classifyImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
      this.processClassificationResult(response.data);
      this.setState({loading: false});
      if(! toast.isActive(this.toastId)){
        this.toastId = toast(
          <div>
            Don't like the result? Help us to improve our system!
            <RaisedButton onClick={this.handleOpenUploadToHelpDialog} label="Click Here" style={{marginLeft: 8}} /> 
          </div>, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 15000
        });
      }
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

      this.setState({tableData: response.result.map(x => {
        var obj = {};
        obj.type = this.setAnimalType(x.type);
        obj.simularityPercentageStr = x.simularityPercentageStr;
        return obj;
      })});

      this.removeDuplicates();

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
              <TableRowColumn>{row.simularityPercentageStr} <Progress color={this.setProgressBarColor(parseInt(row.simularityPercentageStr))} completed={parseInt(row.simularityPercentageStr)}/></TableRowColumn>
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

  setProgressBarColor(percentageVal) {
    if(percentageVal < 10) {
      return "#FF0000"
    }
    else if(percentageVal < 34) {
      return "#FFFF00"
    }
    else if(percentageVal < 100) {
      return "#00FF00"
    }
    else {
      return "#000000"
    }
  }

  setAnimalType(type) {
    if (type.startsWith("Alligatororcrocodile")) {
      return "Alligator"
    }
    else if (type.startsWith("Ape") || type.startsWith("Monkey")) {
      return "Ape"
    }
    else if (type.startsWith("Bird") || type.startsWith("Eagle")
      || type.startsWith("Owl")) {
      return "Bird"
    }
    else if(type.startsWith("Macropodidae")) {
      return "Macropodidae/Kangaroo ";
    }
    else if(type.startsWith("Sheeporgoat")) {
      return "Sheep/Goat";
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

    const actionsUploadToHelp = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleCloseUploadToHelpDialog}
      />,
      <FlatButton
        label="Send"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleHelpFileUpload}
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
            <MenuItem onTouchTap={this.handleCloseAndHelp}>Help us!</MenuItem>
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

        <Dialog
          title="Help us to improve our system!"
          actions={actionsUploadToHelp}
          modal={true}
          open={this.state.openUploadToHelpDialog}
          onRequestClose={this.handleCloseUploadToHelpDialog}
        >
          <div>
            Help us to improve our system by sending us the image with the expected label.
          </div>
          <Center>
            <SelectField floatingLabelText="Label" maxHeight={300} value={this.state.dropdownValue} autoWidth={true} onChange={this.dropdownHandleChange}>
              {this.state.dropdownItems}
            </SelectField>
          </Center>
          <Center>
            <div style={marginTopStyle}>
              <input type="file" onChange={(e) => {this.setState({file: e.target.files[0]}) }} style={{marginLeft: '12px'}} />
            </div>
          </Center>
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
