import { Button } from '../components/ui/button';
import { render } from '@testing-library/react';

describe('First test', () => {
  it('Should render button', () => {
    render(<Button />);
    expect(true).toBeTruthy();
  });
});
