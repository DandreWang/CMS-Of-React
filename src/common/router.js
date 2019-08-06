import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayoutDiy')),
    },
    '/workbench/staff': {
      component: dynamicWrapper(app, ['staff'], () => import('../routes/Workbench/Staff')),
      // authority:['admin','doctor'],
    },
    // '/temp/index': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Temp/Index')),
    // },
    '/patient/patient/:other': {
      component: dynamicWrapper(app, [], () => import('../routes/Workbench/Staff')),
      // authority:['admin','doctor'],
    },
    '/patient-case/filed-list': {
      component: dynamicWrapper(app, [], () => import('../routes/PatientCase/Filed/List')),
      // authority:['doctor'],
    },
    '/patient-case/filed-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/PatientCase/Filed/Detail')),
      authority:['doctor'],
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/LoginDiy')),
    },
    '/workbench/admin': {
      component: dynamicWrapper(app, [], () => import('../routes/Workbench/Admin')),
    },
    '/table-demo/list': {
      component: dynamicWrapper(app, ['tableDemo','commonConfig'], () => import('../routes/TableDemo/List')),
    },
    '/table-demo/add': {
      component: dynamicWrapper(app, ['tableDemo','commonConfig'], () => import('../routes/TableDemo/Add')),
    },
    '/table-demo/edit/:id': {
      component: dynamicWrapper(app, ['tableDemo','commonConfig'], () => import('../routes/TableDemo/Edit')),
    },
    '/table-demo/detail/:id': {
      component: dynamicWrapper(app, ['tableDemo','commonConfig'], () => import('../routes/TableDemo/Detail')),
    },
    '/basics/profession-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Profession/List')),
    },
    '/basics/profession-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Profession/Add')),
    },
    '/basics/profession-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Profession/Detail')),
    },
    '/basics/profession-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Profession/Edit')),
    },
    '/basics/office-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Office/List')),
    },
    '/basics/office-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Office/Add')),
    },
    '/basics/office-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Office/Detail')),
    },
    '/basics/office-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Office/Edit')),
    },
    '/basics/doctor-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Doctor/List')),
    },
    '/basics/doctor-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Doctor/Add')),
    },
    '/basics/doctor-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Doctor/Detail')),
    },
    '/basics/doctor-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Basics/Doctor/Edit')),
    },
    '/card/category-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/Category/List')),
    },
    '/card/category-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/Category/Add')),
    },
    '/card/category-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/Category/Edit')),
    },
    '/card/category-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/Category/Detail')),
    },
    '/card/consume-card-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/ConsumeCard/List')),
    },
    '/card/consume-card-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/ConsumeCard/Add')),
    },
    '/card/consume-card-batch-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/ConsumeCard/BatchAdd')),
    },
    '/card/consume-card-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/ConsumeCard/Detail')),
    },
    '/card/distribute-manage': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/DistributeManage')),
    },
    '/card/brush': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/Brush')),
    },
    '/card/information-search': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/InformationSearch')),
    },
    '/card/activate': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/Activate')),
    },
    '/card/distribute': {
      component: dynamicWrapper(app, [], () => import('../routes/Card/Distribute')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    // '/patient/index': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Dashboard/Index')),
    // },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/diagnose/sickness': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Diagnose/Sickness')),
    },
    '/treatment-manage/item-list': {
      component: dynamicWrapper(app, [], () => import('../routes/TreatmentManage/Item/List')),
    },
    '/treatment-manage/item-add': {
      component: dynamicWrapper(app, [], () => import('../routes/TreatmentManage/Item/Add')),
    },
    '/treatment-manage/item-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/TreatmentManage/Item/Detail')),
    },
    '/treatment-manage/item-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/TreatmentManage/Item/Edit')),
    },
    '/diagnose/main/level1-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel1/List')),
    },
    '/diagnose/main/level1-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel1/Add')),
    },
    '/diagnose/main/level1-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel1/Detail')),
    },
    '/diagnose/main/level1-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel1/Edit')),
    },
    '/diagnose/main/level2-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel2/List')),
    },
    '/diagnose/main/level2-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel2/Add')),
    },
    '/diagnose/main/level2-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel2/Detail')),
    },
    '/diagnose/main/level2-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel2/Edit')),
    },
    '/diagnose/main/level3-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel3/List')),
    },
    '/diagnose/main/level3-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel3/Add')),
    },
    '/diagnose/main/level3-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel3/Detail')),
    },
    '/diagnose/main/level3-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/MainLevel3/Edit')),
    },
    '/diagnose/assisted/level1-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/AssistedLevel1/List')),
    },
    '/diagnose/assisted/level1-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/AssistedLevel1/Add')),
    },
    '/diagnose/assisted/level1-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/AssistedLevel1/Detail')),
    },
    '/diagnose/assisted/level1-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/AssistedLevel1/Edit')),
    },
    '/diagnose/assisted/level2-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/AssistedLevel2/List')),
    },
    '/diagnose/assisted/level2-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/AssistedLevel2/Add')),
    },
    '/diagnose/assisted/level2-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/AssistedLevel2/Detail')),
    },
    '/diagnose/assisted/level2-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/AssistedLevel2/Edit')),
    },
    '/diagnose/medicine-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/Medicine/List')),
    },
    '/diagnose/medicine-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/Medicine/Add')),
    },
    '/diagnose/medicine-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/Medicine/Detail')),
    },
    '/diagnose/medicine-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Diagnose/Medicine/Edit')),
    },
    '/diagnose/record': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Diagnose/Record')),
    },
    '/evaluation/bookbuilding': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Evaluation/Bookbuilding')),
    },
    '/evaluation/record': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Evaluation/Record')),
    },
    '/patient/answer/:case_id/:flow_id/:evaluate_test_record_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/Answer')),
    },
    '/medical-record/tester-case': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/TesterCase')),
    },
    '/medical-record/tester-case-done': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/TesterCaseDone')),
    },
    '/medical-record/doctor-case': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/DoctorCase')),
    },
    '/medical-record/doctor-case-done': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/DoctorCaseDone')),
    },
    '/medical-record/therapist-case': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/TherapistCase')),
    },
    '/medical-record/therapist-case-done': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/TherapistCaseDone')),
    },
    '/patient/list': {
      component: dynamicWrapper(app, [], () => import('../routes/Patient/List')),
    },
    '/patient/eeg-detection/:device_test_record_id/:case_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/EegDetection')),
    },
    '/patient/eeg-detection-result/:device_test_record_id/:case_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/EegDetectionResult')),
    },
    '/patient/patient-diagnosis-success/:case_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/PatientDiagnosisSuccess')),
    },
    '/patient/treat-success/:case_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/TreatSuccess')),
    },
    '/patient/ecg-detection/:device_test_record_id/:case_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/EcgDetection')),
    },
    '/patient/ecg-detection-result/:device_test_record_id/:case_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/EcgDetectionResult')),
    },
    '/patient/new-success/:case_id/:case_no': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/PatientNewSuccess')),
    },
    '/patient/treat/:case_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/Treat')),
    },
    '/patient/treat-record/:case_id': {
      // 治疗记录
      component: dynamicWrapper(app, [], () => import('../routes/Detection/TreatRecord')),
    },
    '/patient/treat-plan/:case_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/TreatPlan')),
    },
    '/patient/treat-plan-again/:case_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Detection/TreatPlanAgain')),
    },
    '/patient/get-my-list': {
      component: dynamicWrapper(app, ['success'], () => import('../routes/Detection/Success')),
    },
    '/patient/patient-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Profile/PatientDetail')),
    },
    '/patient/scale-results/:case_id/:flow_id/:evaluate_test_record_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/ScaleResults')),
    },
    '/patient/visit-results/:case_id/:flow_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/VisitResults')),
    },
    '/patient/synthesis/:case_id': {
      // 综合报告
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Synthesis')),
    },
    '/patient/synthesis-for-export/:case_id': {
      // 综合报告
      component: dynamicWrapper(app, [], () => import('../routes/Scale/SynthesisForExport')),
    },
    '/patient/detection-success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/SuccessDiy')),
    },
    '/patient/diagnostic/:case_id': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Diagnostic')),
    },
    '/patient/treatment': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Treatment')),
    },
    '/patient/patient-own-file': {
      component: dynamicWrapper(app, ['patientOwnFile'], () => import('../routes/Scale/PatientOwnFile')),
    },
    '/patient/patient-case-edit/:case_id': {
      component: dynamicWrapper(app, ['patientOwnFile'], () => import('../routes/Scale/PatientOwnFile')),
    },
    '/patient/patient-test/:case_id': {
      component: dynamicWrapper(app, ['patientTest'], () => import('../routes/Scale/PatientTest')),
    },
    // '/patient/patient-evaluation': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Scale/PatientEvaluation')),
    // },
    '/patient/global-statistics': {
      component: dynamicWrapper(app, [], () => import('../routes/Statistics/GlobalStatistics')),
    },
    '/patient/hardware': {
      component: dynamicWrapper(app, [], () => import('../routes/Management/Hardware')),
    },
    '/patient/hardware-edit': {
      component: dynamicWrapper(app, [], () => import('../routes/Management/HardwareEdit')),
    },
    '/patient/person': {
      component: dynamicWrapper(app, [], () => import('../routes/Management/Person')),
    },
    '/parameter/flow-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Flow/List')),
    },
    '/parameter/flow-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Flow/Add')),
    },
    '/parameter/flow-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Flow/Detail')),
    },
    '/parameter/flow-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Flow/Edit')),
    },
    '/parameter/device-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Device/List')),
    },
    '/parameter/device-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Device/Add')),
    },
    '/parameter/device-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Device/Detail')),
    },
    '/parameter/device-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Device/Edit')),
    },
    '/parameter/category-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Category/List')),
    },
    '/parameter/category-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Category/Add')),
    },
    '/parameter/category-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Category/Detail')),
    },
    '/parameter/category-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Category/Edit')),
    },
    '/parameter/disease-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Disease/List')),
    },
    '/parameter/disease-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Disease/Add')),
    },
    '/parameter/disease-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Disease/Detail')),
    },
    '/parameter/disease-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Parameter/Disease/Edit')),
    },
    '/process/special-edit-manage': {
      component: dynamicWrapper(app, [], () => import('../routes/Process/SpecialEditManage')),
    },
    '/process/special-sickness': {
      component: dynamicWrapper(app, [], () => import('../routes/Process/SpecialSickness')),
    },
    '/process/sickness': {
      component: dynamicWrapper(app, [], () => import('../routes/Process/Sickness')),
    },
    '/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/hardware/hardware': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Hardware/Hardware')),
    },
    '/hardware/category': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Hardware/Category')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/patient/therapist-create-doc': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Detection/TherapistCreateDoc')
      ),
    },
    '/report/global': {
      component: dynamicWrapper(app, [], () => import('../routes/Report/Global')),
    },
    '/report/statement': {
      component: dynamicWrapper(app, [], () => import('../routes/Report/Statement')),
    },
    '/report/billing': {
      component: dynamicWrapper(app, [], () => import('../routes/Report/Billing')),
    },
    '/report/keyword': {
      component: dynamicWrapper(app, [], () => import('../routes/Report/Keyword')),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/role/staff': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Staff')),
    },
    '/role/role-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Role/List')),
    },
    '/role/staff-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Staff/List')),
    },
    '/role/staff-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Staff/Add')),
    },
    '/role/staff-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Staff/Detail')),
    },
    '/role/staff-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Staff/Edit')),
    },
    '/role/authorization': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Authorization')),
    },
    '/role/module': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Module')),
    },
    '/role/organization': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Organization')),
    },
    '/role/hospital': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Hospital')),
    },
    '/role/office-category': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/OfficeCategory')),
    },
    '/role/office-manage': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/OfficeManage')),
    },
    '/role/office-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Office/List')),
    },
    '/role/office-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Office/Add')),
    },
    '/role/office-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Office/Edit')),
    },
    '/role/office-detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/Office/Detail')),
    },
    '/role/office-maintain': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/OfficeMaintain')),
    },
    '/scale/hospital-relationship': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/HospitalRelationship')),
    },
    '/scale/office-relationship': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/OfficeRelationship')),
    },
    '/scale/office-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Office/List')),
    },
    '/scale/office-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Office/Add')),
    },
    '/scale/office-detail/:id': {
      name:'科室量表授权（详情页）',
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Office/Detail')),
    },
    '/scale/office-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Office/Edit')),
    },
    '/scale/category-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Category/List')),
    },
    '/scale/category-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Category/Add')),
    },
    '/scale/category-detail/:id': {
      name:'量表分类管理（详情页）',
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Category/Detail')),
    },
    '/scale/category-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Category/Edit')),
    },
    '/scale/plain-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Plain/List')),
    },
    '/scale/plain-add': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Plain/Add')),
    },
    '/scale/plain-detail/:id': {
      name:'普通量表管理（详情页）',
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Plain/Detail')),
    },
    '/scale/plain-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/Plain/Edit')),
    },
    '/scale/platform-scale': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/PlatformScale')),
    },
    '/scale/hospital-scale': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/HospitalScale')),
    },
    '/scale/office-scale': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/OfficeScale')),
    },
    '/scale/first-scale': {
      component: dynamicWrapper(app, [], () => import('../routes/Scale/FirstScale')),
    },
    '/system/msg-record': {
      component: dynamicWrapper(app, [], () => import('../routes/System/MsgRecord')),
    },
    '/system/msg-push': {
      component: dynamicWrapper(app, [], () => import('../routes/System/MsgPush')),
    },
    '/system/operation-log': {
      component: dynamicWrapper(app, [], () => import('../routes/System/OperationLog')),
    },
    '/system/system-log': {
      component: dynamicWrapper(app, [], () => import('../routes/System/SystemLog')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayoutDiy')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/log/manage': {
      component: dynamicWrapper(app, [], () => import('../routes/Log/List')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
