export class Menu {

  private title = '';

  private dataMap: Map<string, string> = null;

  constructor(key: string, val: Map<string, string>) {
    this.title = key;
    this.dataMap = val;
  }

  getTitle(): string {
    return this.title;
  }

  getMenuList(): Map<string, string> {
    return this.dataMap;
  }
}
