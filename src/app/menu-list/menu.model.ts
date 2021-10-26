export class Menu {

  private title = '';

  private dataMap: Map<string, string> = null;

  private icon = '';

  constructor(key: string, val: Map<string, string>, icon: string) {
    this.title = key;
    this.dataMap = val;
    this.icon = icon;
  }

  getTitle(): string {
    return this.title;
  }

  getMenuList(): Map<string, string> {
    return this.dataMap;
  }

  getIcon(): string {
    return this.icon;
  }
}
