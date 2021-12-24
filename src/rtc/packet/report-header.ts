import { LITTLE_ENDIAN } from '../common/constants';

export const REPORT_HEADER_SIZE = 5;

export enum ReportType {
  None = 0,
  Metadata = 1,
  GamepadReport = 2,
  PointerReport = 4,
  ClientMetadata = 8,
  ServerMetadata = 16,
  Mouse = 32
}

export interface ReportHeader {
  reportType: number;
  inputSequenceNumber: number;
}

export function serializeReportHeader(dataView: DataView, offset: number, reportHeader: ReportHeader): number {
  dataView.setUint8(offset + 0, reportHeader.reportType);
  dataView.setUint32(offset + 1, reportHeader.inputSequenceNumber, LITTLE_ENDIAN);

  return offset + REPORT_HEADER_SIZE;
}
