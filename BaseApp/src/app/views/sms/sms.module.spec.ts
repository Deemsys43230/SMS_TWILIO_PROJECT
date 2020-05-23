import { SmsModule } from './sms.module';

describe('SmsModule', () => {
  let smsModule: SmsModule;

  beforeEach(() => {
    smsModule = new SmsModule();
  });

  it('should create an instance', () => {
    expect(smsModule).toBeTruthy();
  });
});
