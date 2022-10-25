import {isPermissionAllowed, PermissionHelper} from '../../../network/APICall';

export const DetailBottomButton = {
  Submit: 1,
  ApproveReject: 2,
  Resubmit: 3,
  None: 0,
};

export const loginUser = {
  isHr: '0',
  isSup: '1',
  isEmp: '2', //checking timesheet user
  none: '',
};

export const TimesheetStatus = {
  All: '-1',
  Open: '0',
  Submitted: '1',
  Approved: '2',
  Rejected: '3',
  ReSubmitted: '4',
  ApproveByHr: '5',
  RejectByHr: '6',
  ResubmittedBySup: '7',
};
export function decideTheButtonOnBottomForSelectedDay(
  monthModel,
  dayModel,
  completeTimesheetStatus,
) {
  var buttons = DetailBottomButton.None;
  //  const monthModel = object.monthModel;
  //  const completeTimesheetStatus = object.completeTimesheetStatus;

  let finalAccess = false;
  if (global.loginUserId == monthModel.userId) {
    finalAccess = isPermissionAllowed('Timesheet/submitTimesheet');
  } else {
    finalAccess = isPermissionAllowed('Timesheet/givedayApproval');
  }

  if (finalAccess) {
    //     let monthModel = self.monthModel

    let isHrLogin = monthModel.isHr ? true : false; //login user type
    let isSupLogin = monthModel.isSup ? true : false; //for the timesheet he is viewing
    let isEmpLogin = global.loginUserId == monthModel.userId ? true : false; //My timesheet

    //out of these three only one can see the timesheet at time so maintained like this

    var loginUserType = loginUser.none;
    if (isEmpLogin) {
      loginUserType = loginUser.isEmp;
    } else if (isSupLogin) {
      loginUserType = loginUser.isSup;
    } else if (isHrLogin) {
      loginUserType = loginUser.isHr;
    }

    if (dayModel === undefined || dayModel.dayStatus === undefined) {
      buttons = DetailBottomButton.None; //as we have shown on monthlyController
      return buttons;
    }

    //  console.log('--------------------Day Timesheet -------------------------')
    //  console.log(dayModel.dayStatus)
    //  console.log(loginUserType)
    //  console.log(completeTimesheetStatus)
    //  console.log('--------------------Day Timesheet -------------------------')

    switch (dayModel.dayStatus) {
      case TimesheetStatus.Open:
        {
          switch (loginUserType) {
            case loginUser.isEmp:
              return (buttons = DetailBottomButton.None); //as we have shown on monthlyController
            case loginUser.isSup:
              break;
            case loginUser.isHr:
              break;
            case loginUser.none:
              break;
          }
        }
        break;

      //-------------------------------------------------

      case TimesheetStatus.Submitted:
        {
          switch (loginUserType) {
            case loginUser.isEmp:
              break;
            case loginUser.isSup:
              return (buttons = DetailBottomButton.ApproveReject);

            case loginUser.isHr:
              break;
            case loginUser.none:
              break;
          }
        }
        break;

      //-------------------------------------------------

      case TimesheetStatus.Approved:
        {
          switch (loginUserType) {
            case loginUser.isEmp:
              break;
            case loginUser.isSup:
              break;
            case loginUser.isHr:
              if (completeTimesheetStatus == TimesheetStatus.Approved) {
                return (buttons = DetailBottomButton.ApproveReject);
              }
              break;

            case loginUser.none:
              break;
          }
        }
        break;

      //-------------------------------------------------

      case TimesheetStatus.Rejected:
        {
          switch (loginUserType) {
            case loginUser.isEmp:
              return (buttons = DetailBottomButton.Resubmit);
            case loginUser.isSup:
              break;
            case loginUser.isHr:
              break;

            case loginUser.none:
              break;
          }
        }
        break;
      //-------------------------------------------------

      case TimesheetStatus.ReSubmitted:
        {
          switch (loginUserType) {
            case loginUser.isEmp:
              break;
            case loginUser.isSup:
              if (completeTimesheetStatus == TimesheetStatus.ReSubmitted) {
                return (buttons = DetailBottomButton.ApproveReject);
              }
              break;
            case loginUser.isHr:
              break;
            case loginUser.none:
              break;
          }
        }
        break;
      //-------------------------------------------------

      case TimesheetStatus.ApproveByHr:
        {
          switch (loginUserType) {
            case loginUser.isEmp:
              break;
            case loginUser.isSup:
              break;
            case loginUser.isHr:
              break;
            case loginUser.none:
              break;
          }
        }
        break;
      //-------------------------------------------------

      case TimesheetStatus.RejectByHr:
        {
          switch (loginUserType) {
            case loginUser.isEmp:
              break;

            case loginUser.isSup:
              if (completeTimesheetStatus == TimesheetStatus.RejectByHr) {
                return (buttons = DetailBottomButton.Resubmit);
              }
              break;
            case loginUser.isHr:
              break;
            case loginUser.none:
              break;
          }
        }
        break;
      //-------------------------------------------------

      case TimesheetStatus.ResubmittedBySup:
        {
          switch (loginUserType) {
            case loginUser.isEmp:
              break;
            case loginUser.isSup:
              break;
            case loginUser.isHr:
              if (completeTimesheetStatus == TimesheetStatus.ResubmittedBySup) {
                return (buttons = DetailBottomButton.ApproveReject);
              }
              break;
            case loginUser.none:
              break;
          }
        }
        break;
      //-------------------------------------------------

      case loginUser.none:
    }
  }
  return buttons;
}

//  export default decideTheButtonOnBottomForSelectedDay;
