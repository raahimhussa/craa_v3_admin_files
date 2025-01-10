import { makeAutoObservable } from 'mobx';

export default class Baseline {
  label: string = '';
  testTime: number = 0;
  simulationId: string = '';
  protocolIds: string[] = [];
  instructionIds: string[] = [];
  studyLogIds: string[] = [];
  constructor() {
    makeAutoObservable(this);
  }
}
