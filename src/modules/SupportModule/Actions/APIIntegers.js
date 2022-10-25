export const TicketStatusInt = {
  OPEN: 1,
  CLOSE: 2,
  REJECTED: 3,
  ASSIGNED: 4,
};

export const TicketStatus = {
  OPEN: 'Open',
  CLOSE: 'Close',
  REJECTED: 'Rejected',
  ASSIGNED: 'Assigned',
};

export const ModuleList = [
  'Dashboard',
  'Company Calendar',
  'Management',
  'Member Leaves',
  'Member Timesheets',
  'Member Requests',
  'Member Occurrences',
  'Member Payslips',
  'My Leaves',
  'My Timesheets',
  'My Requests',
  'My Occurrences',
  'My Payslips',
  'Directory',
  'Announcements',
  'Holidays',
  'Albums',
  'Support',
  'Settings',
  'Login/Logout',
  'Profile',
];

export function getTicketStatusText(status) {
  let statusText = '';

  switch (parseInt(status)) {
    case 1:
      statusText = TicketStatus.OPEN;
      break;
    case 2:
      statusText = TicketStatus.CLOSE;
      break;
    // case 3  : statusText =  TicketStatus.REJECTED; break;
    // case 4  : statusText =  TicketStatus.ASSIGNED; break;
  }

  return statusText;
}

export function getTicketStatusColor(status) {
  let color = 'gray';

  switch (parseInt(status)) {
    case 1:
      color = '#B0BEC5';
      break;
    case 2:
      color = '#a7f3fa';
      break;
    // case 3  : color =  '#EF9A9A';  break;
    // case 4  : color =  '#c5e1a5';  break;
  }

  return color;
}
