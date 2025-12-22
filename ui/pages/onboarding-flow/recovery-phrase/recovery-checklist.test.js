import React from 'react';
import { fireEvent } from '@testing-library/react';
import configureStore from '../../../store/store';
import { renderWithProvider } from '../../../../test/lib/render-helpers-navigate';
import {
  ONBOARDING_COMPLETION_ROUTE,
  ONBOARDING_METAMETRICS,
} from '../../../helpers/constants/routes';
import * as BrowserRuntimeUtils from '../../../../shared/modules/browser-runtime.utils';
import RecoveryChecklist from './recovery-checklist';

const mockUseNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('react-router-dom-v5-compat', () => {
  return {
    ...jest.requireActual('react-router-dom-v5-compat'),
    useNavigate: () => mockUseNavigate,
    useLocation: () => mockUseLocation(),
  };
});

describe('RecoveryChecklist', () => {
  const store = configureStore({});

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({ search: '' });
    jest
      .spyOn(BrowserRuntimeUtils, 'getBrowserName')
      .mockReturnValue('chrome');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('disables continue until all checkboxes are checked', () => {
    const { getByTestId } = renderWithProvider(<RecoveryChecklist />, store);

    const continueButton = getByTestId('recovery-checklist-continue');
    expect(continueButton).toBeDisabled();

    fireEvent.click(getByTestId('recovery-checklist-0'));
    fireEvent.click(getByTestId('recovery-checklist-1'));
    fireEvent.click(getByTestId('recovery-checklist-2'));
    fireEvent.click(getByTestId('recovery-checklist-3'));

    expect(continueButton).not.toBeDisabled();
  });

  it('navigates to metametrics by default', () => {
    const { getByTestId } = renderWithProvider(<RecoveryChecklist />, store);

    fireEvent.click(getByTestId('recovery-checklist-0'));
    fireEvent.click(getByTestId('recovery-checklist-1'));
    fireEvent.click(getByTestId('recovery-checklist-2'));
    fireEvent.click(getByTestId('recovery-checklist-3'));

    fireEvent.click(getByTestId('recovery-checklist-continue'));

    expect(mockUseNavigate).toHaveBeenCalledWith(ONBOARDING_METAMETRICS, {
      replace: true,
    });
  });

  it('navigates to completion when reminder is present', () => {
    mockUseLocation.mockReturnValue({ search: '?isFromReminder=true' });

    const { getByTestId } = renderWithProvider(<RecoveryChecklist />, store);

    fireEvent.click(getByTestId('recovery-checklist-0'));
    fireEvent.click(getByTestId('recovery-checklist-1'));
    fireEvent.click(getByTestId('recovery-checklist-2'));
    fireEvent.click(getByTestId('recovery-checklist-3'));

    fireEvent.click(getByTestId('recovery-checklist-continue'));

    expect(mockUseNavigate).toHaveBeenCalledWith(
      `${ONBOARDING_COMPLETION_ROUTE}?isFromReminder=true`,
      { replace: true },
    );
  });
});
