import { makeAutoObservable } from 'mobx';

export default class Followup {
  readonly _id: string = '';
  label: string = '';
  simulationId: string = '';
  testTime: number = 0;
  protocolIds: string[] = [];
  instructionIds: string[] = [];
  studyLogIds: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}
