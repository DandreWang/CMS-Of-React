import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '工作台',
    icon: 'dashboard',
    path: 'workbench/staff',
    authority:['therapist', 'tester', 'doctor'],
  },

  // {
  //   name: '全局统计',
  //   icon: 'dashboard',
  //   path: 'workbench/admin',
  //   authority:['admin'],
  // },
  {
    name: '病历列表',
    icon: 'code-o',
    path: 'medical-record',
    authority:['therapist', 'tester', 'doctor'],
    children: [
      {
        name: '测评列表',
        path: 'tester-case',
        authority:['tester','doctor'],
      },
      {
        name: '测评结束列表',
        path: 'tester-case-done',
        authority:['tester','doctor'],
      },
      {
        name: '诊断列表',
        path: 'doctor-case',
        authority:['doctor'],
      },
      {
        name: '诊断结束列表',
        path: 'doctor-case-done',
        authority:['doctor'],
      },
      {
        name: '治疗列表',
        path: 'therapist-case',
        authority:['therapist'],
      },
      {
        name: '治疗结束列表',
        path: 'therapist-case-done',
        authority:['therapist'],
      },
    ],
  },
  {
    name: '归档病历管理',
    icon: 'folder',
    path: 'patient-case',
    children: [
      {
        name: '已归档病历',
        path: 'filed-list',
        authority:['doctor'],
      },
    ],
  },
  {
    name: '患者管理',
    icon: 'book',
    path: 'patient',
    children: [
      {
        name: '患者新增',
        path: 'patient/new',
        authority:['tester', 'doctor'],
      },
      {
        name: '患者新增',
        path: 'therapist-create-doc',
        authority:['therapist'],
      },
      {
        name: '患者列表',
        path: 'list',
      },
    ],
  },
  {
    name: '量表管理',
    icon: 'rocket',
    path: 'scale',
    children: [
      {
        name: '量表分类管理',
        path: 'category-list',
        authority:['admin'],
      },
      {
        name: '普通量表管理',
        path: 'plain-list',
        authority:['admin'],
      },
      // {
      //   name: '首访量表管理',
      //   path: 'first-scale',
      // },
      {
        name: '科室量表授权',
        path: 'office-list',
        authority:['admin'],
      },
      // {
      //   name: '科室量表授权',
      //   path: 'office-detail',
      //   // hideInBreadcrumb: true,
      //   hideInMenu: true,
      // },
    ],
  },
  {
    name: '基础参数管理',
    icon: 'file',
    path: 'basics',
    children: [
      {
        name: '职业配置',
        path: 'profession-list',
        authority:['admin'],
      },
      {
        name: '来源科室配置',
        path: 'office-list',
        authority:['admin'],
      },
      {
        name: '临床医生配置',
        path: 'doctor-list',
        authority:['admin'],
      },
    ],
  },
  {
    name: '测评参数管理',
    icon: 'file-text',
    path: 'parameter',
    authority:['admin'],
    children: [
      {
        name: '设备分类管理',
        path: 'category-list',
      },
      {
        name: '测评仪器管理',
        path: 'device-list',
      },
      {
        name: '特殊疾病管理',
        path: 'disease-list',
      },
      {
        name: '测评流程模板管理',
        path: 'flow-list',
      },
    ],
  },
  {
    name: '诊断参数管理',
    icon: 'api',
    path: 'diagnose',
    authority:['admin'],
    children: [
      {
        name: '主诊断参数管理',
        path: 'main',
        children: [
          {
            name: '一级诊断参数管理',
            path: 'level1-list',
          },
          {
            name: '二级诊断参数管理',
            path: 'level2-list',
          },
          {
            name: '三级诊断参数管理',
            path: 'level3-list',
          },
        ],
      },
      {
        name: '辅助诊断参数管理',
        path: 'assisted',
        children: [
          {
            name: '一级辅助诊断参数管理',
            path: 'level1-list',
          },
          {
            name: '二级辅助诊断参数管理',
            path: 'level2-list',
          },
        ],
      },
      {
        name: '药物管理',
        path: 'medicine-list',
      },
    ],
  },
  {
    name: '治疗参数管理',
    icon: 'book',
    path: 'treatment-manage',
    // authority:['doctor','therapist','admin'],
    children: [
      {
        name: '治疗项目',
        path: 'item-list',
        authority:['admin'],
      },
    ],
  },
  {
    name: '角色权限管理',
    icon: 'team',
    path: 'role',
    authority:['admin'],
    children: [
      {
        name: '工作人员管理',
        path: 'staff-list',
      },
      {
        name: '角色管理',
        path: 'role-list',
      },
      {
        name: '科室管理',
        path: 'office-list',
      },
    ],
  },
  {
    name: '报表管理',
    icon: 'bar-chart',
    path: 'report',
    authority:['admin'],
    children: [
      {
        name: '流水统计',
        path: 'statement',
      },
      {
        name: '开单情况汇总',
        path: 'billing',
      },
    ],
  },
  {
    name: '卡管理',
    icon: 'tag-o',
    path: 'card',
    authority:['admin'],
    children: [
      {
        name: '消费卡分类管理',
        path: 'category-list',
      },
      {
        name: '消费卡管理',
        path: 'consume-card-list',
      },
    ],
  },
  {
    name: '操作日志管理',
    icon: 'hdd',
    path: 'log',
    authority:['admin'],
    children: [
      {
        name: '操作日志管理',
        path: 'manage',
      },
    ],
  },
  // {
  //   name: '系统管理',
  //   icon: 'flag',
  //   path: 'system',
  //   authority:['admin'],
  //   children: [
  //     {
  //       name: '消息记录管理',
  //       path: 'msg-record',
  //     },
  //     {
  //       name: '操作日志',
  //       path: 'operation-log',
  //     },
  //     {
  //       name: '系统日志',
  //       path: 'system-log',
  //     },
  //
  //   ],
  // },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
