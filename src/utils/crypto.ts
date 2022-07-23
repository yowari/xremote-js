const base64CharSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const baseLength = 22;

function makeBase(): string {
  let result = '';
  for (let i = 0; i < baseLength; i++) {
    result += base64CharSet.charAt(Math.floor(Math.random() * base64CharSet.length));
  }
  return result
}

export class CorrelationVectorGenerator {
  value = 0;
  vector: string;

  constructor(correlationVector?: string, flag: boolean = false) {
    if (correlationVector) {
      const parts = correlationVector.split('.');
      this.vector = flag ? parts[0] : correlationVector;
    } else {
      this.vector = makeBase();
    }
  }

  getValue(): string {
    return `${this.vector}.${this.value}`;
  }

  getBase(): string {
    return this.vector.split('.')[0];
  }

  increment(): this {
    this.value++;
    return this;
  }

  extend(): CorrelationVectorGenerator {
    if (this.vector.length + 2 >= 127) {
      throw new Error('Correlation vector is too long!');
    }
    return new CorrelationVectorGenerator(this.getValue());
  }
}
