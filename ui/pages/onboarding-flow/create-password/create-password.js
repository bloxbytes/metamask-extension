import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import { useI18nContext } from '../../../hooks/useI18nContext';
import {
  JustifyContent,
  AlignItems,
  TextVariant,
  TextColor,
  BlockSize,
  Display,
  FlexDirection,
  TextAlign,
} from '../../../helpers/constants/design-system';
import {
  ONBOARDING_COMPLETION_ROUTE,
  ONBOARDING_DOWNLOAD_APP_ROUTE,
  ONBOARDING_IMPORT_WITH_SRP_ROUTE,
  ONBOARDING_METAMETRICS,
  ONBOARDING_REVIEW_SRP_ROUTE,
  ONBOARDING_WELCOME_ROUTE,
} from '../../../helpers/constants/routes';
// Commented out - not used since terms container is commented
// import ZENDESK_URLS from '../../../helpers/constants/zendesk-url';
import {
  getFirstTimeFlowType,
  getCurrentKeyring,
  getMetaMetricsId,
  getParticipateInMetaMetrics,
  getIsSocialLoginFlow,
  getSocialLoginType,
  getIsParticipateInMetaMetricsSet,
} from '../../../selectors';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventAccountType,
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import {
  Box,
  Button,
  ButtonSize,
  ButtonVariant,
  IconName,
  Text,
} from '../../../components/component-library';
import ThemeToggleButtons from '../../../components/app/theme-toggle-buttons/theme-toggle-buttons';
import { FirstTimeFlowType } from '../../../../shared/constants/onboarding';
import PasswordForm from '../../../components/app/password-form/password-form';
import { PLATFORM_FIREFOX } from '../../../../shared/constants/app';
import { getBrowserName } from '../../../../shared/modules/browser-runtime.utils';
import {
  forceUpdateMetamaskState,
  resetOnboarding,
  setDataCollectionForMarketing,
  setMarketingConsent,
} from '../../../store/actions';
import { TraceName, TraceOperation } from '../../../../shared/lib/trace';

const isFirefox = getBrowserName() === PLATFORM_FIREFOX;

export default function CreatePassword({
                                         createNewAccount,
                                         importWithRecoveryPhrase,
                                         secretRecoveryPhrase,
                                       }) {
  const t = useI18nContext();
  const [password, setPassword] = useState('');
  const [termsChecked] = useState(false);
  const [newAccountCreationInProgress, setNewAccountCreationInProgress] =
    useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const firstTimeFlowType = useSelector(getFirstTimeFlowType);
  const trackEvent = useContext(MetaMetricsContext);
  const { bufferedTrace, bufferedEndTrace, onboardingParentContext } =
    trackEvent;
  const currentKeyring = useSelector(getCurrentKeyring);
  const isSocialLoginFlow = useSelector(getIsSocialLoginFlow);
  const socialLoginType = useSelector(getSocialLoginType);

  const participateInMetaMetrics = useSelector(getParticipateInMetaMetrics);
  const isParticipateInMetaMetricsSet = useSelector(
    getIsParticipateInMetaMetricsSet,
  );
  const metametricsId = useSelector(getMetaMetricsId);
  const base64MetametricsId = Buffer.from(metametricsId ?? '').toString(
    'base64',
  );
  const shouldInjectMetametricsIframe = Boolean(
    participateInMetaMetrics && base64MetametricsId,
  );
  const analyticsIframeQuery = {
    mmi: base64MetametricsId,
    env: 'production',
  };
  const analyticsIframeUrl = `https://start.metamask.io/?${new URLSearchParams(
    analyticsIframeQuery,
  )}`;

  useEffect(() => {
    if (currentKeyring && !newAccountCreationInProgress) {
      if (
        firstTimeFlowType === FirstTimeFlowType.import ||
        firstTimeFlowType === FirstTimeFlowType.socialImport
      ) {
        if (
          !isFirefox &&
          firstTimeFlowType === FirstTimeFlowType.socialImport
        ) {
          // we don't display the metametrics screen for social login flows if the user is not on firefox
          navigate(ONBOARDING_COMPLETION_ROUTE, { replace: true });
        } else {
          navigate(
            isParticipateInMetaMetricsSet
              ? ONBOARDING_COMPLETION_ROUTE
              : ONBOARDING_METAMETRICS,
            { replace: true },
          );
        }
      } else if (firstTimeFlowType === FirstTimeFlowType.socialCreate) {
        navigate(ONBOARDING_COMPLETION_ROUTE, { replace: true });
      } else {
        navigate(ONBOARDING_REVIEW_SRP_ROUTE, { replace: true });
      }
    } else if (
      firstTimeFlowType === FirstTimeFlowType.import &&
      !secretRecoveryPhrase
    ) {
      navigate(ONBOARDING_IMPORT_WITH_SRP_ROUTE, { replace: true });
    }
  }, [
    currentKeyring,
    navigate,
    firstTimeFlowType,
    newAccountCreationInProgress,
    secretRecoveryPhrase,
    isParticipateInMetaMetricsSet,
  ]);

  // Commented out - not used since terms container is commented
  // const handleLearnMoreClick = (event) => {
  //   event.stopPropagation();
  //   trackEvent({
  //     category: MetaMetricsEventCategory.Onboarding,
  //     event: MetaMetricsEventName.ExternalLinkClicked,
  //     properties: {
  //       text: 'Learn More',
  //       location: 'create_password',
  //       url: ZENDESK_URLS.PASSWORD_ARTICLE,
  //     },
  //   });
  // };

  // Helper function to determine account type for analytics
  const getAccountType = (baseType, includesSocialLogin = false) => {
    if (includesSocialLogin && socialLoginType) {
      const socialProvider = String(socialLoginType).toLowerCase();
      return `${baseType}_${socialProvider}`;
    }
    return baseType;
  };

  const handleWalletImport = async () => {
    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.WalletImportAttempted,
    });

    await importWithRecoveryPhrase(password, secretRecoveryPhrase);

    bufferedEndTrace?.({ name: TraceName.OnboardingExistingSrpImport });
    bufferedEndTrace?.({ name: TraceName.OnboardingJourneyOverall });

    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.WalletImported,
      properties: {
        biometrics_enabled: false,
      },
    });

    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.WalletSetupCompleted,
      properties: {
        wallet_setup_type: 'import',
        new_wallet: false,
        account_type: getAccountType(
          MetaMetricsEventAccountType.Imported,
          isSocialLoginFlow,
        ),
      },
    });

    if (isFirefox || isSocialLoginFlow) {
      navigate(ONBOARDING_COMPLETION_ROUTE, { replace: true });
    } else {
      navigate(ONBOARDING_METAMETRICS, { replace: true });
    }
  };

  const handleCreateNewWallet = async () => {
    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.WalletCreationAttempted,
      properties: {
        account_type: getAccountType(
          MetaMetricsEventAccountType.Default,
          isSocialLoginFlow,
        ),
      },
    });

    if (createNewAccount) {
      setNewAccountCreationInProgress(true);
      await createNewAccount(password);
    }

    if (isSocialLoginFlow) {
      bufferedEndTrace?.({ name: TraceName.OnboardingNewSocialCreateWallet });
      bufferedEndTrace?.({ name: TraceName.OnboardingJourneyOverall });
    }

    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.WalletCreated,
      properties: {
        biometrics_enabled: false,
        account_type: getAccountType(
          MetaMetricsEventAccountType.Default,
          isSocialLoginFlow,
        ),
      },
    });

    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.WalletSetupCompleted,
      properties: {
        wallet_setup_type: 'new',
        new_wallet: true,
        account_type: getAccountType(
          MetaMetricsEventAccountType.Default,
          isSocialLoginFlow,
        ),
      },
    });
    if (isSocialLoginFlow) {
      if (termsChecked) {
        dispatch(setMarketingConsent(true));
        dispatch(setDataCollectionForMarketing(true));
      }
      navigate(ONBOARDING_DOWNLOAD_APP_ROUTE, { replace: true });
    } else {
      navigate(ONBOARDING_REVIEW_SRP_ROUTE, { replace: true });
    }
  };

  useEffect(() => {
    bufferedTrace?.({
      name: TraceName.OnboardingPasswordSetupAttempt,
      op: TraceOperation.OnboardingUserJourney,
      parentContext: onboardingParentContext?.current,
    });
    return () => {
      bufferedEndTrace?.({ name: TraceName.OnboardingPasswordSetupAttempt });
    };
  }, [onboardingParentContext, bufferedTrace, bufferedEndTrace]);

  const handleBackClick = async (event) => {
    event.preventDefault();

    if (firstTimeFlowType === FirstTimeFlowType.import) {
      // for SRP import flow, we will just navigate back to the import SRP page
      navigate(ONBOARDING_IMPORT_WITH_SRP_ROUTE, { replace: true });
    } else {
      // reset onboarding flow
      await dispatch(resetOnboarding());
      await forceUpdateMetamaskState(dispatch);

      navigate(ONBOARDING_WELCOME_ROUTE, { replace: true });
    }
  };

  const handlePasswordSetupError = (error) => {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    bufferedTrace?.({
      name: TraceName.OnboardingPasswordSetupError,
      op: TraceOperation.OnboardingUserJourney,
      parentContext: onboardingParentContext.current,
      tags: { errorMessage },
    });
    bufferedEndTrace?.({ name: TraceName.OnboardingPasswordSetupError });

    console.error(error);
  };

  const handleCreatePassword = async (event) => {
    event?.preventDefault();

    if (!password) {
      return;
    }

    try {
      // If secretRecoveryPhrase is defined we are in import wallet flow
      if (
        secretRecoveryPhrase &&
        firstTimeFlowType === FirstTimeFlowType.import
      ) {
        await handleWalletImport();
      } else {
        // Otherwise we are in create new wallet flow
        await handleCreateNewWallet();
      }
    } catch (error) {
      handlePasswordSetupError(error);
      trackEvent({
        category: MetaMetricsEventCategory.Onboarding,
        event: MetaMetricsEventName.WalletSetupFailure,
      });
    }
  };

  // Commented out - not used since terms container is commented
  // const createPasswordLink = (
  //   <a
  //     onClick={handleLearnMoreClick}
  //     key="create-password__link-text"
  //     href={ZENDESK_URLS.PASSWORD_ARTICLE}
  //     target="_blank"
  //     rel="noopener noreferrer"
  //   >
  //     <span className="create-password__link-text">
  //       {t('learnMoreUpperCaseWithDot')}
  //     </span>
  //   </a>
  // );

  // const checkboxLabel = isSocialLoginFlow
  //   ? t('createPasswordMarketing')
  //   : t('passwordTermsWarning');

  return (
    <>
      {/* Background blur effects */}
      <Box className="create-password__background-effects">
        <Box className="create-password__blur-circle create-password__blur-circle--top-left" />
        <Box className="create-password__blur-circle create-password__blur-circle--bottom-right" />
      </Box>
      <ThemeToggleButtons />
      <Box
        display={Display.Flex}
        flexDirection={FlexDirection.Column}
        justifyContent={JustifyContent.spaceBetween}
        height={BlockSize.Full}
        width={BlockSize.Full}
        gap={4}
        as="form"
        className="create-password"
        data-testid="create-password"
        onSubmit={handleCreatePassword}
      >
        <Box>
          {/* Logo */}
          <Box
            display={Display.Flex}
            justifyContent={JustifyContent.center}
            alignItems={AlignItems.center}
            marginBottom={4}
            width={BlockSize.Full}
          >
            <img
              src="./images/logo/metamask-fox.svg"
              width="80"
              height="80"
              alt="OPN Wallet"
              className="create-password__logo"
            />
          </Box>

          {/* Title and Subtitle - Centered */}
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Column}
            alignItems={AlignItems.center}
            justifyContent={JustifyContent.center}
            marginBottom={4}
            width={BlockSize.Full}
          >
            <Text
              variant={TextVariant.headingLg}
              as="h2"
              marginBottom={2}
              textAlign={TextAlign.Center}
              className="create-password__title"
            >
              {t('createPassword')}
            </Text>
            <Text
              variant={TextVariant.bodyMd}
              color={TextColor.textAlternative}
              as="p"
              className="create-password__subtitle"
              textAlign={TextAlign.Center}
            >
              Secure your wallet with a strong password
            </Text>
          </Box>
          <PasswordForm onChange={(newPassword) => setPassword(newPassword)} />
          {/* <Box
            className="create-password__terms-container"
            alignItems={AlignItems.center}
            justifyContent={JustifyContent.spaceBetween}
            marginTop={6}
            backgroundColor={BackgroundColor.backgroundMuted}
            padding={3}
            borderRadius={BorderRadius.LG}
          >
            <Checkbox
              inputProps={{ 'data-testid': 'create-password-terms' }}
              alignItems={AlignItems.flexStart}
              isChecked={termsChecked}
              onChange={() => {
                setTermsChecked(!termsChecked);
              }}
              label={
                <Text variant={TextVariant.bodySm} color={TextColor.textDefault}>
                  {checkboxLabel}
                  {!isSocialLoginFlow && (
                    <>
                      <br />
                      {createPasswordLink}
                    </>
                  )}
                </Text>
              }
            />
          </Box> */}
        </Box>
        <Box
          display={Display.Flex}
          flexDirection={FlexDirection.Row}
          gap={4}
          width={BlockSize.Full}
        >
          <Button
            data-testid="create-password-back-button"
            variant={ButtonVariant.Secondary}
            width={BlockSize.Full}
            size={ButtonSize.Lg}
            className="create-password__back-button"
            type="button"
            onClick={handleBackClick}
          >
            {t('back')}
          </Button>
          <Button
            data-testid="create-password-submit"
            variant={ButtonVariant.Primary}
            width={BlockSize.Full}
            size={ButtonSize.Lg}
            className={'create-password__form--submit-button ' + password ? '' : 'primary-button primary-button-white-color'}
            disabled={!password}
            endIconName={IconName.Arrow2Right}
          >
            {t('createPasswordCreate')}
          </Button>
        </Box>
        {shouldInjectMetametricsIframe ? (
          <iframe
            src={analyticsIframeUrl}
            className="create-password__analytics-iframe"
            data-testid="create-password-iframe"
          />
        ) : null}
      </Box>
    </>
  );
}

CreatePassword.propTypes = {
  createNewAccount: PropTypes.func,
  importWithRecoveryPhrase: PropTypes.func,
  secretRecoveryPhrase: PropTypes.string,
};
