export class MappingCode {

  private _codeType: string;
  private _codeNo: string;
  private _codeDesc: string;
  private _codeSort: number;
  private _codeTag: string;
  private _codeFlag: string;

    public get codeType(): string
 {
        return this._codeType;
    }

    public set codeType(codeType: string
) {
        this._codeType = codeType;
    }

    public get codeNo(): string
 {
        return this._codeNo;
    }

    public set codeNo(codeNo: string
) {
        this._codeNo = codeNo;
    }

    public get codeDesc(): string
 {
        return this._codeDesc;
    }

    public set codeDesc(codeDesc: string
) {
        this._codeDesc = codeDesc;
    }

    public get codeSort(): number
 {
        return this._codeSort;
    }

    public set codeSort(codeSort: number
) {
        this._codeSort = codeSort;
    }

    public get codeTag(): string
 {
        return this._codeTag;
    }

    public set codeTag(codeTag: string
) {
        this._codeTag = codeTag;
    }

    public get codeFlag(): string {
        return this._codeFlag;
    }

    public set codeFlag(codeFlag: string) {
        this._codeFlag = codeFlag;
    }




}
