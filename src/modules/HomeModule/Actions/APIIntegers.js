export const NotificationTypeInt = {
  URGENT: 1,
  OTHER: 2,
};

export const NotificationType = {
  URGENT: 'Urgent',
  OTHER: 'Other',
};

export function getNotificationTypeText(status) {
  let statusText = '';

  switch (parseInt(status)) {
    case 1:
      statusText = NotificationType.URGENT;
      break;
    case 2:
      statusText = NotificationType.OTHER;
      break;
  }

  return statusText;
}

export function getNotificationTypeColor(status) {
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
