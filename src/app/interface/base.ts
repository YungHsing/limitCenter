export interface Employee extends CommonRes {
  rspBody: {
    empList: EmpItems[];
    levelTypeList: MappingCode[];
    projectList: MappingCode[];
    roleList: RoleItem[];
    ynList: MappingCode[];
  };
}

interface EmpItems {
  agentEmp: string;
  assignProjectno: string;
  assignStop: string;
  email: string;
  empId: string;
  empName: string;
  empNo: string;
  leaveEnddate: string;
  leaveEnddateType: string;
  leaveStartdate: string;
  leaveStartdateType: string;
}

export interface RoleItem {
  roleNo: string;
  roleName: string;
  roleAmt: string;
}

export interface CommonRes {
  rspCode: string;
  rspMsg: string;
}

interface MappingCode {
  codeNo: string;
  codeDesc: string;
  codeType: string;
  codeSort: string;
  codeTag: string;
  codeFlag: string;
}

export interface OptionsCode {
  value: string;
  viewValue: string;
}

export interface checkBox {
  value: string;
  completed: boolean;
}
