export const validateValues = {
  email: {
    // type: 'email',
    desc: '邮箱',
    regex:/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
    required: true,
    invalidMsg: '请输入有效的邮箱',
    emptyMsg: '请输入邮箱',
  },
  phone: {
    // type: 'phone',
    desc: '手机号',
    regex:/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
    required: true,
    invalidMsg: '请输入有效的手机号',
    emptyMsg: '请输入手机号',
  },
};

