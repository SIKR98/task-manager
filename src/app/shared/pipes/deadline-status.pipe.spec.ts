import { DeadlineStatusPipe } from './deadline-status.pipe';

describe('DeadlineStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new DeadlineStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
