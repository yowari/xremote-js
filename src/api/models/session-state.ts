import { ErrorDetails } from './error-details';

export interface SessionState {
  state: SessionStateResponse;
  detailedSessionState: number;
  errorDetails: ErrorDetails;
}

export type SessionStateResponse =
  | SessionStateType.WaitingForResources
  | SessionStateType.ReadyToConnect
  | SessionStateType.Provisioning
  | SessionStateType.Provisioned
  | SessionStateType.Failed;

export enum SessionStateType {
  WaitingForResources = 'WaitingForResources',
  ReadyToConnect = 'ReadyToConnect',
  Provisioning = 'Provisioning',
  Provisioned = 'Provisioned',
  Failed = 'Failed'
}
