import { LITTLE_ENDIAN } from '../common/constants';

export const REPORT_HEADER_SIZE = 14;

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
  dataView.setUint16(offset + 0, reportHeader.reportType, LITTLE_ENDIAN);
  dataView.setUint32(offset + 2, reportHeader.inputSequenceNumber, LITTLE_ENDIAN);
  dataView.setFloat64(offset + 6, performance.now(), LITTLE_ENDIAN)

  return offset + REPORT_HEADER_SIZE;
}
