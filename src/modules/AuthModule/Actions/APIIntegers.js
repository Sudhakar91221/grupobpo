export const UserType = {
  USER: 1,
  ADMIN: 2,
};


export const loginWithMobileFields = {
  fields: [
    {
      controller: 'country',
      name: '',
      type: '18',
      lable: 'Country',
      childFields: [
        {
          name: 'country',
          type: '6',
          lable: 'Country',
          rules: 'required',
        },
        {
          name: 'mobile',
          type: '10',
          lable: 'Phone Number',
          rules: 'required|min_length[5]|max_length[10]',

        },
      ],
    },
    {
      name: 'password',
      type: '9',
      lable: 'Password',
      rules: 'required',
 
    },
  ],
};
export const loginWithEmailFields = {
  fields: [
    {
      name: 'email',
      type: '2',
      lable: 'Email Address',
      rules: 'required|valid_email',
    },
    {
      name: 'password',
      type: '9',
      lable: 'Password',
      rules: 'required',
    },
  ],
};

export const emailField = {
  fields: [
    {
      name: 'email',
      type: '2',
      lable: 'Email Address',
      rules: 'required|valid_email',
    },
  ],
};
