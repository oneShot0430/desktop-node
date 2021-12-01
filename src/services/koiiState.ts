class KoiiState {
  private state: any
  private activatedTasks: string[]

  constructor(state: any, activatedTasks: string[]) {
    this.state = state;
    this.activatedTasks = activatedTasks;
  }

  getState(): any {
    return this.state;
  }

  setState(state: any) {
    this.state = state;
  } 

  getActivatedTasks(): string[] {
    return this.activatedTasks;
  }

  setActivatedTasks(activatedTasks: []) {
    this.activatedTasks = activatedTasks;
  }
}

export default new KoiiState({}, []);
