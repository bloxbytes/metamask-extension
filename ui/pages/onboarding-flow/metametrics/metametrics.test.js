import React from 'react';
import { waitFor } from '@testing-library/react';
import { renderWithProvider } from '../../../../test/lib/render-helpers-navigate';
import { ONBOARDING_COMPLETION_ROUTE } from '../../../helpers/constants/routes';
import {
  onboardingMetametricCheckboxTitleOne,
  // TODO: Remove restricted import
  // eslint-disable-next-line import/no-restricted-paths
} from '../../../../app/_locales/en/messages.json';
import {
  setParticipateInMetaMetrics,
  setDataCollectionForMarketing,
} from '../../../store/actions';
import configureStore from '../../../store/store';
import { FirstTimeFlowType } from '../../../../shared/constants/onboarding';
import OnboardingMetametrics from './metametrics';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom-v5-compat', () => {
  return {
    ...jest.requireActual('react-router-dom-v5-compat'),
    useNavigate: () => mockUseNavigate,
    useLocation: jest.fn(() => ({ search: '' })),
  };
});

jest.mock('../../../store/actions.ts', () => {
  const actionConstants = jest.requireActual('../../../store/actionConstants');
  return {
    setParticipateInMetaMetrics: jest.fn((value) => (dispatch) => {
      dispatch({ type: actionConstants.SET_PARTICIPATE_IN_METAMETRICS, value });
      return Promise.resolve([value]);
    }),
    setDataCollectionForMarketing: jest.fn((value) => (dispatch) => {
      dispatch({
        type: actionConstants.SET_DATA_COLLECTION_FOR_MARKETING,
        value,
      });
      return Promise.resolve([value]);
    }),
  };
});

describe('Onboarding Metametrics Component', () => {
  let store;

  const mockState = {
    metamask: {
      firstTimeFlowType: FirstTimeFlowType.create,
      participateInMetaMetrics: null,
      internalAccounts: {
        accounts: {},
        selectedAccount: '',
      },
    },
  };

  beforeEach(() => {
    store = configureStore(mockState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the metametrics screen markup before auto navigation', () => {
    const { queryByText, queryByTestId } = renderWithProvider(
      <OnboardingMetametrics />,
      store,
    );

    expect(
      queryByText(onboardingMetametricCheckboxTitleOne.message),
    ).toBeInTheDocument();
    expect(queryByTestId('onboarding-metametrics')).toBeInTheDocument();
  });

  it('automatically opts out and navigates to the next route', async () => {
    renderWithProvider(<OnboardingMetametrics />, store);

    await waitFor(() => {
      expect(setDataCollectionForMarketing).toHaveBeenCalledWith(false);
      expect(setParticipateInMetaMetrics).toHaveBeenCalledWith(false);
      expect(mockUseNavigate).toHaveBeenCalledWith(ONBOARDING_COMPLETION_ROUTE);
    });
  });
});
