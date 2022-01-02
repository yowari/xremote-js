import { AbstractChannel } from './abstract-channel';
import {
  ReportType,
  REPORT_HEADER_SIZE,
  serializeReportHeader
} from '../packet/report-header';
import {
  METADATA_FRAME_SIZE,
  serializeMetadataFrame
} from '../packet/metadata-frame';
import { FrameMetadataManager } from '../managers/frame-metadata-manager';
import { GAMEPAD_FRAME_SIZE, serializeGamepadFrame } from '../packet/gamepad-frame';
import { GamepadManager } from '../managers/gamepad-manager'

const webrtcDataChannelConfiguration: RTCDataChannelInit = {
  id: 3,
  ordered: true,
  protocol: '1.0'
};

const MAX_INPUT_SEQUENCE_NUMBER = 4294967295;

export class InputChannel extends AbstractChannel {
  private inputSequenceNumber = 0;
  private hasReceivedServerMetadata = false;
  private intervalId: number | null = null;

  constructor(
    webrtcClient: RTCPeerConnection,
    private frameMetadataManager: FrameMetadataManager,
    private gamepadManager: GamepadManager
  ) {
    super(webrtcClient, 'input', webrtcDataChannelConfiguration);
  }

  onOpen(event: Event): void {
    super.onOpen(event);

    this.sendRequestMetadata();

    this.intervalId = window.setInterval(() => {
      this.sendReport();
    }, 16);
  }

  onMessage(event: MessageEvent): void {
    super.onMessage(event);

    const dataView = new DataView(event.data)

    const metadataResponse = {
      packetType: dataView.getUint8(0), // 16 = ServerMetadata
      serverHeight: dataView.getUint32(1, true),
      serverWidth: dataView.getUint32(5, true)
    };
    this.hasReceivedServerMetadata = true;

    console.log(metadataResponse)
  }

  onClose(event: Event): void {
    super.onClose(event);

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private sendRequestMetadata(): void {
    this.inputSequenceNumber = (this.inputSequenceNumber >= MAX_INPUT_SEQUENCE_NUMBER) ? 0 : this.inputSequenceNumber + 1;

    const dataView = new DataView((new Uint8Array(REPORT_HEADER_SIZE + 1)).buffer);

    serializeReportHeader(dataView, 0, {
      reportType: ReportType.ClientMetadata,
      inputSequenceNumber: this.inputSequenceNumber
    });

    this.webrtcDataChannel.send(dataView.buffer);
  }

  private sendReport(): void {
    if (this.hasReceivedServerMetadata) {
      const buffer = this.generateInputReport();
      this.webrtcDataChannel.send(buffer);
    }
  }

  private generateInputReport(): ArrayBuffer {
    this.inputSequenceNumber = (this.inputSequenceNumber >= MAX_INPUT_SEQUENCE_NUMBER) ? 0 : this.inputSequenceNumber + 1;

    this.frameMetadataManager.reportPacketTime();

    let reportType = ReportType.None;
    let bufferSize = REPORT_HEADER_SIZE;

    const renderedFrames = this.frameMetadataManager.getRenderedFrames();
    const gamepadStates = this.gamepadManager.gamepadStates;

    if (renderedFrames.length > 0) {
      reportType |= ReportType.Metadata;
      bufferSize += 1 + (renderedFrames.length * METADATA_FRAME_SIZE);
    }
    if (gamepadStates.length > 0) {
      reportType |= ReportType.GamepadReport;
      bufferSize += 1 + (gamepadStates.length * GAMEPAD_FRAME_SIZE);
    }

    const reportDataView = new DataView((new Uint8Array(bufferSize)).buffer);
    let offset = 0;

    serializeReportHeader(reportDataView, offset, {
      reportType: reportType,
      inputSequenceNumber: this.inputSequenceNumber
    });
    offset += REPORT_HEADER_SIZE;

    if (renderedFrames.length > 0) {
      const now = performance.now();

      reportDataView.setUint8(offset, renderedFrames.length);
      offset += 1;

      for (const frameMetadata of renderedFrames) {
        frameMetadata.frameDateNow = now;
        serializeMetadataFrame(reportDataView, offset, frameMetadata);
        offset += METADATA_FRAME_SIZE;
      }

      this.frameMetadataManager.clearRenderedFrame();
    }

    if (gamepadStates.length > 0) {
      reportDataView.setUint8(offset, gamepadStates.length);
      offset += 1;

      for (const gamepadFrame of gamepadStates) {
        serializeGamepadFrame(reportDataView, offset, gamepadFrame);
        offset += GAMEPAD_FRAME_SIZE;
      }

      this.gamepadManager.clearGamepadStates();
    }

    return reportDataView.buffer;
  }
}
