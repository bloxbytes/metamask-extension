import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithProvider } from '../../../../test/lib/render-helpers-navigate';
import configureStore from '../../../store/store';
import WelcomeLogin from './welcome-login';

describe('Welcome login', () => {
  it('should render', () => {
    const mockOnLogin = jest.fn();
    const store = configureStore({});
    const { getByTestId, getByText } = renderWithProvider(
      <WelcomeLogin onLogin={mockOnLogin} />,
      store,
    );
    expect(getByTestId('get-started')).toBeInTheDocument();

    const importButton = getByText('I have an existing wallet');
    expect(importButton).toBeInTheDocument();

    const createButton = getByText('Create a new wallet');
    expect(createButton).toBeInTheDocument();
  });

  it('should display Login Options modal when seedless onboarding feature is enabled', () => {
    const mockOnLogin = jest.fn();

    const store = configureStore({});
    const { getByTestId, getByText } = renderWithProvider(
      <WelcomeLogin onLogin={mockOnLogin} />,
      store,
    );
    expect(getByTestId('get-started')).toBeInTheDocument();

    const importButton = getByText('I have an existing wallet');
    expect(importButton).toBeInTheDocument();

    fireEvent.click(importButton);

    expect(mockOnLogin).not.toHaveBeenCalled();
    expect(
      getByTestId('onboarding-import-with-srp-button'),
    ).toBeInTheDocument();
  });

  it('opens the Terms modal when clicking Terms of Use', () => {
    const store = configureStore({});
    const { getByRole, getByTestId } = renderWithProvider(
      <WelcomeLogin onLogin={jest.fn()} />,
      store,
    );

    fireEvent.click(getByRole('button', { name: /terms of use/i }));

    expect(getByTestId('terms-of-use-modal')).toBeInTheDocument();
  });

  it('opens the Privacy modal when clicking Privacy notice', () => {
    const store = configureStore({});
    const { getByRole, getByTestId } = renderWithProvider(
      <WelcomeLogin onLogin={jest.fn()} />,
      store,
    );

    fireEvent.click(getByRole('button', { name: /privacy notice/i }));

    expect(getByTestId('privacy-notice-modal')).toBeInTheDocument();
  });
});
