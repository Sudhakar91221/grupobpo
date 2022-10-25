/* eslint-disable react-native/no-inline-styles */
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from '../../../components/external/CollapsibleView/index';
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Divider from '../../../components/views/Divider';
import {styless} from '../../../components/common/Styles';
import {translate} from '../../../../App';
import {BottomButton} from '../../../components/views/Button';
import InputForm from '../Forms/InputForm';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import Icons from '../../../components/common/Icons';
const clonedeep = require('lodash.clonedeep');
import {connect} from 'react-redux';
import {
  isLoadingSelector,
  blockListSelector,
  fieldsListSelector,
  apiSelector,
  errorSelector,
  applicationSubmitSelector,
} from '../Actions/selectors';
import {getBlocks, getFields, submitApplication} from '../Actions/FormActions';
import {APPLICATION_SUBMIT} from '../Actions/type';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';

class CollapsibleList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      applicationId:
        props.applicationId !== undefined
          ? props.applicationId
          : props.applicationModel !== undefined
          ? props.applicationModel.applicationId
          : undefined,
      submitGray: false,
      submitLoader: false,
      childFields:
        props.item.childFields !== undefined &&
        props.item.childFields.length > 0
          ? this.props.item.childFields
          : [],
      inputs: [],
      initialListNumber: 1,
      createdNewBlocks: [],
      updateUI: false,
      list: [
        {
          title: 'Getting Started',
          body:
            'React native Accordion/Collapse component, very good to use in toggles & show/hide content',
        },
        {
          title: 'Components',
          body: 'AccordionList,Collapse,CollapseHeader & CollapseBody',
        },
      ],
    };
    this.onAddHeaderPressed = this.onAddHeaderPressed.bind(this);
    this._addHeader = this._addHeader.bind(this);
    this.onDeleteBuisnessActivityView = this.onDeleteBuisnessActivityView.bind(
      this,
    );
    this.originalView = this.originalView.bind(this);
    this.onNextButtonTapped = this.onNextButtonTapped.bind(this);
    this.currentPageRef = {};
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }

    // //separe values for each block
    // const numberOfBlocks = this.state.childFields[0].value.split(',');

    // numberOfBlocks.map( function(value,index) {

    //   this.props.item.childFields[index].map(
    //     function(childItem) {
    //       childItem.value = this.state.childFields[index].value;
    //     }.bind(this),
    //   );

    // });

    this.defaultView();

    this.setState({updateUI: true});
  }

  componentDidUpdate() {
    // if (!this.props.error && this.props.api === APPLICATION_SUBMIT && this.props.item.blockID == "3") {
    //   if (
    //     this.props.applicationModel !== this.state.applicationModel &&
    //     this.props.newPageToChange == this.props.currentPage + 1
    //   ){
    //       // if (this.props.updatePage !== undefined) {
    //         this.props.updateMainPage()
    //         this.state.applicationModel = this.props.applicationModel;
    //         this.setState({submitLoader: false});
    //       // }
    //     }
    // }
  }

  _addHeader(item) {
    if (this.props.editable == true) {
      const {theme} = this.props;
      return (
        <TouchableOpacity
          style={{flex: 1}}
          onPress={this.onAddHeaderPressed(item)}>
          <View
            style={[styless.leftRight, {paddingVertical: 10, marginRight: 10}]}>
            <Text style={theme.detailPlaceholder}>Add Activity</Text>
            <Icons.FontAwesome5
              style={[{color: 'green'}]}
              size={18}
              color={'green'}
              name={'plus'}
            />
          </View>
        </TouchableOpacity>
      );
    }
  }

  originalView(item, index) {
    console.log('add header is tapped...............');

    // console.log(this.state.inputs);
    console.log(item);

    const newLine = (
      <Collapse
        isCollapsed={true}
        //onToggle={isCollapsed => this.onToggle()}
      >
        <CollapseHeader>{this._head(item)}</CollapseHeader>
        <CollapseBody>
          <View style={{backgroundColor: 'white', paddingHorizontal: -20}}>
            <InputForm
              item={item}
              navigation={this.props.navigation}
              innerPage={true}
              isFromCollapsible={true}
              isRequireHeader={this.props.isRequireHeader}
              hideBottomButton={true}
              editable={this.props.editable}
              onRef={ref => {
                this.currentPageRef[index] = ref;
              }}
            />
          </View>
        </CollapseBody>
      </Collapse>
    );
    this.state.inputs = [...this.state.inputs, newLine];
    // console.log(newInputs);
  }
  onAddHeaderPressed = item => e => {
    console.log('add header is tapped...............');

    let newItemWithValues = clonedeep(item);

    item.childFields.map((childItem, childIndex) => {
      if (childItem.value !== undefined) {
        newItemWithValues.childFields[childIndex].value = '';
      }
    });
    this.state.createdNewBlocks = [
      ...this.state.createdNewBlocks,
      newItemWithValues,
    ];

    const newLine = (
      <Collapse
        isCollapsed={true}
        //onToggle={isCollapsed => this.onToggle()}
      >
        <CollapseHeader>{this._head(newItemWithValues)}</CollapseHeader>
        <CollapseBody>
          <View style={{backgroundColor: 'white', paddingHorizontal: -20}}>
            <InputForm
              item={newItemWithValues}
              navigation={this.props.navigation}
              innerPage={true}
              isRequireHeader={this.props.isRequireHeader}
              isFromCollapsible={true}
              hideBottomButton={true}
              onRef={ref => {
                this.currentPageRef[this.state.createdNewBlocks.length] = ref;
              }}
              // onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
            />
          </View>
        </CollapseBody>
      </Collapse>
    );
    const newInputs = [...this.state.inputs, newLine];
    console.log(newInputs);

    this.setState(
      {inputs: newInputs, initialListNumber: this.state.initialListNumber + 1},
      () => {
        console.log(this.state.inputs);
      },
    );
  };
  _head(item) {
    return (
      <View>
        <Divider />
        <View style={[styless.leftRight, {height: 40, alignItems: 'center'}]}>
          <Text style={{width: '80%'}}>{item.lable}</Text>
          {this.props.editable &&
          <TouchableOpacity
            onPress={this.onDeleteBuisnessActivityView(item)}
            style={[styless.leftRight, {height: '100%', alignItems: 'center'}]}>
            <Text />
            <Icons.FontAwesome5
              style={[{color: 'red'}]}
              size={18}
              color={'red'}
              name={'minus-circle'}
            />
          </TouchableOpacity>
          }
        </View>

        <Divider />
      </View>
    );
  }

  onDeleteBuisnessActivityView = item => e => {
    var index = this.state.inputs
      .map(function(item, index) {
        return item;
      })
      .indexOf(item);

    this.state.inputs.splice(index, 1);

    const newInputs = [...this.state.inputs];
    console.log(newInputs);

    this.setState(
      {inputs: newInputs, initialListNumber: this.state.initialListNumber - 1},
      () => {
        console.log(this.state.inputs);
      },
    );
  };

  keepCloning(objectpassed) {
    if (objectpassed === null || typeof objectpassed !== 'object') {
      return objectpassed;
    }
  }

  renderDefaultView() {
    const {item} = this.props;

    if (item.childFields.length > 0) {
      if (item.childFields[0].value !== undefined) {
        const valuesFromApplicationModel =
        this.props.applicationModel !== undefined
          ? this.props.applicationModel[item.childFields[0].name]
          : undefined;


        if (valuesFromApplicationModel !== undefined) {

          const noOfBlocksPresent = valuesFromApplicationModel
            .toString()
            .split(',');


          noOfBlocksPresent.map(

            function(value, valueIndex) {
              let newItemWithValues = clonedeep(item);

              item.childFields.map((childItem, childIndex) => {
                if (childItem.value !== undefined) {
                  
                  const valuesFromApplicationModel1 =
                  this.props.applicationModel !== undefined
                    ? this.props.applicationModel[item.childFields[childIndex].name]
                    : undefined;
                    
                  const childItemValueArray =  valuesFromApplicationModel1
                    .toString()
                    .split(',');
                  newItemWithValues.childFields[childIndex].value =
                    childItemValueArray[valueIndex];
                }
              });
              this.state.createdNewBlocks = [
                ...this.state.createdNewBlocks,
                newItemWithValues,
              ];
            }.bind(this),
          );
        } else {
          const noOfBlocksPresent = item.childFields[0].value
            .toString()
            .split(',');
          noOfBlocksPresent.map(
            
            function(value, valueIndex) {
              let newItemWithValues = clonedeep(item);

              item.childFields.map((childItem, childIndex) => {
                if (childItem.value !== undefined) {
                  const childItemValueArray = childItem.value
                    .toString()
                    .split(',');
                  newItemWithValues.childFields[childIndex].value =
                    childItemValueArray[valueIndex];
                }
              });
              this.state.createdNewBlocks = [
                ...this.state.createdNewBlocks,
                newItemWithValues,
              ];
            }.bind(this),
          );
        }
      }
    }
  }
  defaultView() {
    const {item} = this.props;

    //get the no of blocks from values with comma seperated array buisnessLines = 'unit1,unit2,unit3' - blocks will be 3
    //for submission - as the field name will be same , concatenates the same fields values with comma
    //for display - get no of block from values comma sepearted string, field values for the each block with its index values index
    if (this.props.editable == false) {
      this.renderDefaultView();
    } else {
      this.renderDefaultView();
      // if (item.childFields.length > 0) {
      //   if (item.childFields[0].value !== undefined) {
      //     const noOfBlocksPresent = item.childFields[0].value
      //       .toString()
      //       .split(',');
      //     noOfBlocksPresent.map(
      //       function(value, valueIndex) {
      //         let newItemWithValues = clonedeep(item);

      //         item.childFields.map((childItem, childIndex) => {
      //           if (childItem.value !== undefined) {
      //             const childItemValueArray = childItem.value
      //               .toString()
      //               .split(',');
      //             newItemWithValues.childFields[childIndex].value =
      //               childItemValueArray[valueIndex];
      //           }
      //         });
      //         this.state.createdNewBlocks = [
      //           ...this.state.createdNewBlocks,
      //           newItemWithValues,
      //         ];
      //       }.bind(this),
      //     );
      //   }
      // }
    }

    this.state.createdNewBlocks.map((newItemWithValues, index) => {
      // newItemWithValues.childFields.map((child) => {
      //   child.value =  index
      // })
      this.originalView(newItemWithValues, index + 1);
    });
  }

  // func() {
  //   console.log('-------',newItemWithValues)
  //         this.state.childFields.map(
  //           function(childItem, index) {
  //             if(childItem.value !== undefined) {
  //               const childValuesArray = childItem.value.split(',');
  //               childItem.value = childValuesArray[valueIndex];
  //             }

  //           }.bind(this),
  //         );
  //         console.log('-------',newItemWithValues)
  // }

  render() {
    const {item} = this.props;

    if (this.state.inputs.length == 0) {
      return (
        <View style={[{backgroundColor: 'white', flex: 1}]}>
          {this._addHeader(item)}
          {this.props.editable === true && this.renderBottomButton()}
        </View>
      );
    } else {
      return (
        <View style={[{backgroundColor: 'white', flex: 1}]}>
          {this.state.inputs.map(itemNew => {
            return <View style={{backgroundColor: 'white'}}>{itemNew}</View>;
          })}
          {this.state.inputs.length <= 3 &&
            this._addHeader(item)
          }
          {this.props.editable === true && this.renderBottomButton()}
        </View>
      );
    }
  }

  //MARK: - Render UI

  renderBottomButton() {
    const {theme} = this.props;

    return (
      <View
        style={{backgroundColor: 'transparent', height: 55, paddingTop: 150}}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 5,
            // backgroundColor: theme.blueColor,
            position: 'absolute',
            bottom: 10,
            width: '90%',
          }}
          title={translate('save')}
          action={
            !this.state.submitLoader && !this.state.submitGray
              ? this.onNextButtonTapped
              : null
          }
          isLoader={this.state.submitLoader}
          isGray={this.state.submitGray}
        />
      </View>
    );
  }

  onNextButtonTapped = () => {
    //this.callSubmitFields();
    const itemList = this.state.createdNewBlocks;
    const input = {};
    let inputNameArray = [];

    itemList.map(
      function(item, collapseItemIndex) {
        // console.log(this.currentPageRef);

        if (item.childFields !== undefined && item.childFields.length > 0) {
          item.childFields.map(
            function(childItem, index) {
              let newIndex = collapseItemIndex + 1;
              if (collapseItemIndex < this.state.createdNewBlocks.length) {
                if (inputNameArray.includes(childItem.name)) {
                  let fieldValues = this.currentPageRef[newIndex]
                    .currentFieldsRef[childItem.name].props.values;

                  if (
                    fieldValues == '' ||
                    fieldValues === undefined ||
                    fieldValues === 'undefined'
                  ) {
                    fieldValues = this.currentPageRef[newIndex]
                      .currentFieldsRef[childItem.name].state[childItem.name];
                  }
                  if (fieldValues === undefined) {
                    fieldValues = '';
                  }
                  input[childItem.name] =
                    input[childItem.name] + ',' + fieldValues;
                } else {
                  let fieldValues = this.currentPageRef[newIndex]
                    .currentFieldsRef[childItem.name].props.values;

                  if (
                    fieldValues == '' ||
                    fieldValues === undefined ||
                    fieldValues === 'undefined'
                  ) {
                    fieldValues = this.currentPageRef[newIndex]
                      .currentFieldsRef[childItem.name].state[childItem.name];
                  }
                  if (fieldValues === undefined) {
                    fieldValues = '';
                  }

                  input[childItem.name] = fieldValues;
                  inputNameArray = [...inputNameArray, childItem.name];
                }
              }
            }.bind(this),
          );
        }
      }.bind(this),
    );

    const dicLength = Object.keys(input).length;

    (input.userId = this.props.user.userId),
      (input.token = this.props.user.token),
      (input.formId = this.props.item.formId),
      (input.blockId = this.props.item.blockID);
    const newDicLength = Object.keys(input).length;

    if (this.state.applicationId !== undefined) {
      input.applicationId = this.state.applicationId;
    } else if (this.props.applicationModel !== undefined) {
      input.applicationId = this.props.applicationModel.applicationId;
    }

    this.props.updateMainPage({
      input: input,
      controller: this.props.item.controller,
    });

    // this.props.updateMainPage();
    // if(this.currentPageRef[])
    // if (
    //   this.currentPageRef['InputForm:' + item.name] !== undefined &&
    //   this.currentPageRef['InputForm:' + item.name].state !== undefined
    // ) {
    //   const data = this.currentPageRef['InputForm:' + item.name].state
    //     .inputDict;
    //   this.props.navigation.state.params.getAnotherScreenData(item.name, data);
    // }
  };
}

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    blocks: blockListSelector(state.FormReducer),
    blockModel: fieldsListSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    applicationModel: applicationSubmitSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getBlocks: input => dispatch(getBlocks(input)),
    getFields: input => dispatch(getFields(input)),
    submitApplication: (input, controller) =>
      dispatch(submitApplication(input, controller)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CollapsibleList);
