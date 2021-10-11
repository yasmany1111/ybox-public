export interface IPageMap {
  name: string;
  id: string;
  isModified: boolean;
  // this var is only local
  lastSavedToCloud?: number;
  lastSaved?: number;
}

export interface IPage {
  content: string;
  id: string;
}
