
import {loginUser, TimesheetStatus} from './TimesheetApproval';

export function newColorOfTheDay(timesheetFinalStatus, monthModel, dayModel) {
  //out of these three only one can see the timesheet at time so maintained like this

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
  var result = '';

  // console.log('monthModel ------------------',monthModel)
  // console.log('timesheetFinalStatus ------------------',timesheetFinalStatus)
  let dayStatus = 0;
  if (dayModel !== undefined) {
    console.log('dayModel ------------------', dayModel.dayStatus);
    dayStatus = dayModel.dayStatus;
  }

  switch (timesheetFinalStatus) {
    case TimesheetStatus.Open:
      {
        result = openTimesheet(dayStatus, loginUserType);
      }
      break;

    case TimesheetStatus.Submitted:
      {
        console.log('-------Enters into step submitted  timesheet');
        result = submitTimesheet(dayStatus, loginUserType);
        console.log('-------result', result);
      }
      break;

    case TimesheetStatus.Approved:
      {
        result = approveBySupTimesheet(dayStatus, loginUserType);
      }
      break;

    case TimesheetStatus.Rejected:
      {
        result = rejectedBySupTimesheet(dayStatus, loginUserType);
      }
      break;

    case TimesheetStatus.ReSubmitted:
      {
        result = reconsiderByEmpTimesheet(dayStatus, loginUserType);
      }
      break;

    case TimesheetStatus.ApproveByHr:
      {
        result = approveByHrTimesheet(dayStatus, loginUserType);
      }
      break;

    case TimesheetStatus.RejectByHr:
      {
        result = rejectedByHrTimesheet(dayStatus, loginUserType);
      }
      break;

    case TimesheetStatus.ResubmittedBySup:
      {
        result = resubmittedBySupTimesheet(dayStatus, loginUserType);
      }
      break;
    default:
      break;
  }

  return result;
}

function openTimesheet(dayStatus, loginUserType) {
  var status = '';
  var remark = false;
  var reason = false;

  switch (dayStatus) {
    case TimesheetStatus.Submitted: {
      status = TimesheetStatus.Submitted;

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

      break;
    }

    default:
      break;
  }

  return {status, remark, reason};
}

function submitTimesheet(dayStatus, loginUserType) {
  var status = '';
  var remark = false;
  var reason = false;

  console.log(
    '-----------_Enter here in submit timesheet method',
    dayStatus,
    loginUserType,
  );

  switch (dayStatus) {
    case TimesheetStatus.Submitted: {
      status = TimesheetStatus.Submitted;

      switch (loginUserType) {
        case loginUser.isEmp:
          break;
        case loginUser.isSup:
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Submitted;

          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.Approved: {
      switch (loginUserType) {
        case loginUser.isSup:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          status = TimesheetStatus.Approved;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.Rejected: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          console.log('-------Enters into step rejected daystatus');
          remark = true;
          console.log('remark', remark);
          status = TimesheetStatus.Rejected;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.ReSubmitted: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    default:
      break;
  }

  return {status, remark, reason};
}

function rejectedBySupTimesheet(dayStatus, loginUserType) {
  var status = '';
  var remark = false;
  var reason = false;

  switch (dayStatus) {
    case TimesheetStatus.Submitted: {
      switch (loginUserType) {
        case loginUser.isEmp:
          break;
        case loginUser.isSup:
          remark = true;
          break;
        case loginUser.isHr:
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.Approved: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          status = TimesheetStatus.Approved;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.Rejected: {
      switch (loginUserType) {
        case loginUser.isEmp:
          remark = true;
          status = TimesheetStatus.Rejected;
        case loginUser.isSup:
          remark = true;
          status = TimesheetStatus.Rejected;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.ReSubmitted: {
      switch (loginUserType) {
        case loginUser.isEmp:
          // remark = true
          reason = true;
          status = TimesheetStatus.ReSubmitted;
        case loginUser.isSup:
          remark = true;
          status = TimesheetStatus.Rejected;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    default:
      break;
  }

  return {status, remark, reason};
}

function reconsiderByEmpTimesheet(dayStatus, loginUserType) {
  var status = '';
  var remark = false;
  var reason = false;

  switch (dayStatus) {
    case TimesheetStatus.Approved: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          status = TimesheetStatus.Approved;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.ReSubmitted: {
      switch (loginUserType) {
        case loginUser.isEmp:
          reason = true;
          remark = true;
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          remark = true;
          reason = true;
          status = TimesheetStatus.ReSubmitted;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.Rejected: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          remark = true;
          status = TimesheetStatus.Rejected;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.none:
          break;
      }
    }

    default:
      break;
  }

  return {status, remark, reason};
}

function approveBySupTimesheet(dayStatus, loginUserType) {
  var status = '';
  var remark = false;
  var reason = false;

  switch (dayStatus) {
    case TimesheetStatus.Approved: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          status = TimesheetStatus.Approved;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.Approved;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.RejectByHr: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          status = TimesheetStatus.Approved;
          break;
        case loginUser.isHr:
          remark = true;
          status = TimesheetStatus.RejectByHr;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.ApproveByHr: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          status = TimesheetStatus.Approved;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.ApproveByHr;
          break;
        case loginUser.none:
          break;
      }

      break;
    }
    default:
      break;
  }

  return {status, remark, reason};
}

function rejectedByHrTimesheet(dayStatus, loginUserType) {
  var status = '';
  var remark = false;
  var reason = false;

  switch (dayStatus) {
    case TimesheetStatus.ApproveByHr: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          status = TimesheetStatus.ApproveByHr;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.ApproveByHr;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.RejectByHr: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          remark = true;
          status = TimesheetStatus.RejectByHr;
          break;
        case loginUser.isHr:
          remark = true;
          status = TimesheetStatus.RejectByHr;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.ResubmittedBySup: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          remark = true;
          reason = true;
          status = TimesheetStatus.ResubmittedBySup;
          break;
        case loginUser.isHr:
          remark = true;
          // reason = true
          status = TimesheetStatus.RejectByHr;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    default:
      break;
  }

  return {status, remark, reason};
}

function resubmittedBySupTimesheet(dayStatus, loginUserType) {
  var status = '';
  var remark = false;
  var reason = false;

  switch (dayStatus) {
    case TimesheetStatus.ApproveByHr: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          status = TimesheetStatus.Approved;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.ApproveByHr;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    case TimesheetStatus.ResubmittedBySup: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.Submitted;
          break;
        case loginUser.isSup:
          remark = true;
          reason = true;
          status = TimesheetStatus.ResubmittedBySup;
          break;
        case loginUser.isHr:
          remark = true;
          reason = true;
          status = TimesheetStatus.ResubmittedBySup;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    default:
      break;
  }

  return {status, remark, reason};
}

function approveByHrTimesheet(dayStatus, loginUserType) {
  var status = '';
  var remark = false;
  var reason = false;

  switch (dayStatus) {
    case TimesheetStatus.ApproveByHr: {
      switch (loginUserType) {
        case loginUser.isEmp:
          status = TimesheetStatus.ApproveByHr;
          break;
        case loginUser.isSup:
          status = TimesheetStatus.ApproveByHr;
          break;
        case loginUser.isHr:
          status = TimesheetStatus.ApproveByHr;
          break;
        case loginUser.none:
          break;
      }

      break;
    }

    default:
      break;
  }

  return {status, remark, reason};
}
