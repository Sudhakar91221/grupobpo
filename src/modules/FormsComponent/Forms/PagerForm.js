//simmilar to preview/summary page
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {connect} from 'react-redux';
import {
  isLoadingSelector,
  blockListSelector,
  fieldsListSelector,
  apiSelector,
  errorSelector,
  applicationSubmitSelector,
} from '../Actions/selectors';
import Divider from '../../../components/views/Divider';
import {styless} from '../../../components/common/Styles';
import InputForm from './InputForm';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import BaseClass from '../../Base/BaseClass';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {getBlocks, getFields} from '../Actions/FormActions';
import {BLOCKS_GET, APPLICATION_SUBMIT, FIELDS_GET} from '../Actions/type';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import CustomFormPagerTopTab from './FormPagerTab';
import {
  IndicatorViewPager,
  PagerDotIndicator,
} from '../../../components/external/ViewPager/index';
class PagerForm extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    const currentPage =
      this.props.navigation.state.params !== undefined
        ? this.props.navigation.state.params.currentPage
        : 1;

    this.state = {
      currentPage: currentPage !== undefined ? currentPage : 1,
      submitGray: false,
      submitLoader: false,
      blocks: undefined,
      startBlockIndex: 0,
      blockModel: undefined,
      totalPages: this.props.blocks ? this.props.blocks.length + 1 : 1, //blocks from server + 1 summary page + 1 success page
      applicationId:
        props.applicationId !== undefined
          ? props.applicationId
          : undefined,
    };
    this.currentPageRef = {};
    this.renderScreens = this.renderScreens.bind(this);
    (this.state.percent =
      (100 * 1) /
      (this.state.totalPages !== undefined ? this.state.totalPages : 5)),
      (this.updatePage = this.updatePage.bind(this));
  }

  //MARK: - View LIfecycle

  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  updatePage = blockId => {
    // this.viewPager.setPage(myPage);

    // if(newPage !== undefined) {
    //   this.viewPager.setPage(newPage);
    //   this.setState({currentPage: newPage});
    //   return
    // }

    //TODO: (new changes by poonm)

    let percent = (100 * (this.state.currentPage+1)) / this.state.totalPages;

    if (this.state.currentPage == 4) {
      this.props.navigation.navigate('PreviewSummary');
      return;
    }

    if (
      this.state.currentPage !== undefined &&
      this.currentPageRef.ViewPager !== undefined
    ) {
      this.currentPageRef.ViewPager.setPage(this.state.currentPage);
      // this.state.currentPage = this.state.currentPage + 1;
      this.setState({currentPage: this.state.currentPage + 1,percent:percent});
    }

    if (blockId !== undefined) {
      const pageRef = this.currentPageRef[
        'InputForm:' + (parseInt(blockId) + 1).toString()
      ];
      if (pageRef !== undefined) {
        pageRef.updatePageDetailsIfNeeded();
      }
    }
  };

  render() {
    const {theme} = this.props;

    return (
      <View style={[{flex: 1}]}>
        <CustomFormPagerTopTab
          progress={
            this.props.applicationModel !== undefined ? this.state.percent : 20
          }
        />

        <IndicatorViewPager
          style={{flex: 1, backgroundColor: 'white'}}
          // ref={viewPager => {
          //   this.viewPager = viewPager;
          // }}
          onRef={viewPager => {
            this.currentPageRef.ViewPager = viewPager;
          }}
          // indicator={this._renderDotIndicator()}
          horizontalScroll={false} //TODO:" poonam new changes"
        >
          {/* {this.renderSuccessForm()} */}
          {this.renderScreens()}
          {/* {this.renderSummaryPage()}
                {this.renderSuccessForm()} */}
        </IndicatorViewPager>
      </View>
    );
  }

  renderScreens() {
    let applicationId = this.state.applicationId;
    if (this.state.applicationId === undefined) {
      applicationId =
        this.props.applicationModel !== undefined
          ? this.props.applicationModel.applicationId
          : undefined;
    }
    
    return this.props.blocks.map(
      
      function(item) {

        let submitButtonForImage = undefined
    if(item) {
       submitButtonForImage = item.fbId == "4" ? true : undefined
    }
        return (
          <View style={{flex: 1}}>
            <InputForm
              onRef={ref => {
                this.currentPageRef['InputForm:' + item.fbId] = ref;
              }}
              submitButtonEnable={submitButtonForImage}
              item={item}
              blockModel={item}
              formId={'1'}
              navigation={this.props.navigation}
              updatePage={this.updatePage}
              applicationId={applicationId}
              currentPage={this.state.currentPage}
              editable={true}
              saveForLater={true}
            />
            {/* <View style={{paddingVertical: 30}}>
              <Divider dashed={true} />
            </View> */}
          </View>
        );
      }.bind(this),
    );

  }
  _renderDotIndicator() {
    return (
      <PagerDotIndicator
        pageCount={this.state.totalPages}
        dotStyle={{
          backgroundColor: '#ABB8C3',
          marginBottom: 80,
          height: 8,
          width: 8,
        }}
        selectedDotStyle={{
          backgroundColor: '#FF8A65',
          marginBottom: 80,
          height: 8,
          width: 8,
        }}
      />
    );
  }
  renderBottomButton() {
    const {theme} = this.props;

    return (
      // <View style={{backgroundColor: 'transparent', height: 55}}>
      <BottomButton
        style={{
          height: 50,
          borderRadius: 5,
          backgroundColor: theme.primaryColor,
          position: 'absolute',
          marginBottom: 20,
          bottom: 0,
          width: '80%',
        }}
        title={translate('next')}
        action={this.onNextButtonTapped}
        activeState={true}
      />
      // </View>
    );
  }
  onNextButtonTapped = () => {
    this.props.navigation.navigate('SuccessForm');
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
  };
}

const PagerFormNew = withTheme(PagerForm);

PagerFormNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    title: 'Preview Summary',
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      paddingTop: 13,
      fontSize: 22,
      color: 'black',
      fontWeight: 'bold',
    },

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(PagerFormNew));
