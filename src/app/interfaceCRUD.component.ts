import { Sort } from "@angular/material/sort";

interface sysCode {
  value: string;
  viewValue: string;
}

export declare interface InterfaceCRUD {
  getOptionDesc(option: sysCode[], codeVal: string): string;
  changeSelect(): void;
  applyFilter(event: Event): void;
  changeSort(sortInfo: Sort): void;
  getViewDataList(): void;
  addNew(): void;
  startEdit(index: number, parmArray: string[]): void;
  deleteItem(index: number, parmArray: string[]): void;
}

export declare interface DialogAdd {
  getErrorMessage(): string;
  submit(): void;
  onNoClick(): void;
  confirmAdd(): Promise<void>;
}

export declare interface DialogEdit {
  getErrorMessage(): string;
  submit(): void;
  onNoClick(): void;
  stopEdit(): void;
}

export declare interface DialogDelete {
  onNoClick(): void;
  confirmDelete(): void;
}
