export interface SessionConfiguration {
  keepAlivePulseInSeconds: number;
  serverDetails: {
    ipAddress: string;
    port: number;
    ipV4Address: string;
    ipV4Port: number,
    ipV6Address: string;
    ipV6Port: number;
    iceExchangePath: string;
    stunServerAddress: string;
    srtp: {
      key: string;
    };
  };
}
