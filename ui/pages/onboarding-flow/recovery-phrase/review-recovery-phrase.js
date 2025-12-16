import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom-v5-compat';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useI18nContext } from '../../../hooks/useI18nContext';
import {
  ONBOARDING_CONFIRM_SRP_ROUTE,
  ONBOARDING_REVEAL_SRP_ROUTE,
  ONBOARDING_COMPLETION_ROUTE,
  REVEAL_SRP_LIST_ROUTE,
} from '../../../helpers/constants/routes';
import {
  Text,
  Box,
  Button,
  ButtonVariant,
  ButtonSize,
  ButtonIcon,
  IconName,
  ButtonIconSize,
  BannerAlert,
  BannerAlertSeverity,
} from '../../../components/component-library';
import {
  TextVariant,
  JustifyContent,
  BlockSize,
  TextColor,
  IconColor,
  Display,
  FlexDirection,
  AlignItems,
  TextAlign,
} from '../../../helpers/constants/design-system';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { getHDEntropyIndex } from '../../../selectors';
import SRPDetailsModal from '../../../components/app/srp-details-modal';
import { setSeedPhraseBackedUp } from '../../../store/actions';
import { TraceName } from '../../../../shared/lib/trace';
import RecoveryPhraseChips from './recovery-phrase-chips';

export default function RecoveryPhrase({ secretRecoveryPhrase }) {
  const navigate = useNavigate();
  const t = useI18nContext();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const trackEvent = useContext(MetaMetricsContext);
  const { bufferedEndTrace } = trackEvent;
  const hdEntropyIndex = useSelector(getHDEntropyIndex);
  const [phraseRevealed, setPhraseRevealed] = useState(false);
  const [showSrpDetailsModal, setShowSrpDetailsModal] = useState(false);
  const searchParams = new URLSearchParams(search);
  const isFromReminder = searchParams.get('isFromReminder');
  const isFromSettingsSecurity = searchParams.get('isFromSettingsSecurity');

  const queryParams = new URLSearchParams();
  if (isFromReminder) {
    queryParams.set('isFromReminder', isFromReminder);
  }
  if (isFromSettingsSecurity) {
    queryParams.set('isFromSettingsSecurity', isFromSettingsSecurity);
  }
  const nextRouteQueryString = queryParams.toString();

  useEffect(() => {
    if (!secretRecoveryPhrase) {
      navigate(
        {
          pathname: ONBOARDING_REVEAL_SRP_ROUTE,
          search: nextRouteQueryString ? `?${nextRouteQueryString}` : '',
        },
        {
          replace: true,
        },
      );
    }
  }, [navigate, secretRecoveryPhrase, nextRouteQueryString]);

  const handleContinue = useCallback(() => {
    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.OnboardingWalletSecurityPhraseWrittenDown,
      properties: {
        hd_entropy_index: hdEntropyIndex,
      },
    });

    navigate({
      pathname: ONBOARDING_CONFIRM_SRP_ROUTE,
      search: nextRouteQueryString ? `?${nextRouteQueryString}` : '',
    });
  }, [hdEntropyIndex, navigate, trackEvent, nextRouteQueryString]);

  // eslint-disable-next-line no-unused-vars
  const handleOnShowSrpDetailsModal = useCallback(() => {
    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.SrpDefinitionClicked,
      properties: {
        location: 'review_recovery_phrase',
      },
    });
    setShowSrpDetailsModal(true);
  }, [trackEvent]);

  // eslint-disable-next-line no-unused-vars
  const handleRemindLater = useCallback(async () => {
    await dispatch(setSeedPhraseBackedUp(false));

    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.OnboardingWalletSecuritySkipConfirmed,
      properties: {
        // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
        // eslint-disable-next-line @typescript-eslint/naming-convention
        hd_entropy_index: hdEntropyIndex,
      },
    });
    bufferedEndTrace?.({ name: TraceName.OnboardingNewSrpCreateWallet });
    bufferedEndTrace?.({ name: TraceName.OnboardingJourneyOverall });

    navigate(ONBOARDING_COMPLETION_ROUTE, { replace: true });
  }, [bufferedEndTrace, dispatch, hdEntropyIndex, navigate, trackEvent]);

  const handleBack = useCallback(() => {
    navigate(
      `${ONBOARDING_REVEAL_SRP_ROUTE}${
        nextRouteQueryString ? `?${nextRouteQueryString}` : ''
      }`,
      { replace: true },
    );
  }, [navigate, nextRouteQueryString]);

  const onClose = useCallback(() => {
    navigate(REVEAL_SRP_LIST_ROUTE, { replace: true });
  }, [navigate]);

  return (
    <Box
      display={Display.Flex}
      flexDirection={FlexDirection.Column}
      justifyContent={JustifyContent.spaceBetween}
      alignItems={AlignItems.Center}
      height={BlockSize.Full}
      gap={6}
      className={classnames('recovery-phrase', 'recovery-phrase--glass')}
      data-testid="recovery-phrase"
    >
      <Box width={BlockSize.Full}>
        {showSrpDetailsModal && (
          <SRPDetailsModal onClose={() => setShowSrpDetailsModal(false)} />
        )}
        {isFromReminder && isFromSettingsSecurity ? (
          <Box
            className="recovery-phrase__header"
            display={Display.Grid}
            alignItems={AlignItems.center}
            gap={3}
            marginBottom={4}
            width={BlockSize.Full}
          >
            <ButtonIcon
              iconName={IconName.ArrowLeft}
              color={IconColor.iconDefault}
              size={ButtonIconSize.Md}
              data-testid="reveal-recovery-phrase-review-back-button"
              onClick={handleBack}
              ariaLabel={t('back')}
            />
            <Text variant={TextVariant.headingSm} textAlign={TextAlign.Center}>
              {t('seedPhraseReviewTitleSettings')}
            </Text>
            <ButtonIcon
              iconName={IconName.Close}
              color={IconColor.iconDefault}
              size={ButtonIconSize.Md}
              data-testid="reveal-recovery-phrase-review-close-button"
              onClick={onClose}
              ariaLabel={t('close')}
            />
          </Box>
        ) : (
          <>
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
                className="recovery-phrase__logo"
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
                className="recovery-phrase__title"
              >
                {t('seedPhraseReviewTitle')}
              </Text>
              <Text
                variant={TextVariant.bodyMd}
                color={TextColor.textAlternative}
                as="p"
                className="recovery-phrase__subtitle"
                textAlign={TextAlign.Center}
              >
                Write down these 12 words in order and store them safely
              </Text>
            </Box>

            {/* Important Security Information */}
            <Box marginBottom={4} width={BlockSize.Full}>
              <BannerAlert
                severity={BannerAlertSeverity.Warning}
                title="Important Security Information"
                titleProps={{
                  className: 'recovery-phrase__security-alert-title',
                }}
                className="recovery-phrase__security-alert custom-security-alert"
              >
                <Box
                  display={Display.Flex}
                  flexDirection={FlexDirection.Column}
                >
                  <Text
                    variant={TextVariant.bodySm}
                    color={TextColor.textAlternative}
                    style={{ fontSize: '12px' }}
                  >
                    • Never share your recovery phrase with anyone
                  </Text>
                  <Text
                    variant={TextVariant.bodySm}
                    color={TextColor.textAlternative}
                    style={{ fontSize: '12px' }}
                  >
                    • OPN will never ask for your recovery phrase
                  </Text>
                  <Text
                    variant={TextVariant.bodySm}
                    color={TextColor.textAlternative}
                    style={{ fontSize: '12px' }}
                  >
                    • If you lose it, you cannot recover your wallet
                  </Text>
                  <Text
                    variant={TextVariant.bodySm}
                    color={TextColor.textAlternative}
                    style={{ fontSize: '12px' }}
                  >
                    • Store it offline in a secure location
                  </Text>
                </Box>
              </BannerAlert>
            </Box>
          </>
        )}

        {/* Recovery Phrase Chips */}
        <RecoveryPhraseChips
          secretRecoveryPhrase={secretRecoveryPhrase.split(' ')}
          phraseRevealed={phraseRevealed}
          revealPhrase={() => {
            trackEvent({
              category: MetaMetricsEventCategory.Onboarding,
              event:
                MetaMetricsEventName.OnboardingWalletSecurityPhraseRevealed,
              properties: {
                hd_entropy_index: hdEntropyIndex,
              },
            });
            setPhraseRevealed(true);
          }}
        />
      </Box>

      {/* Buttons */}
      <Box
        width={BlockSize.Full}
        display={Display.Flex}
        flexDirection={FlexDirection.Row}
        gap={4}
      >
        <Button
          data-testid="recovery-phrase-back-button"
          variant={ButtonVariant.Secondary}
          width={BlockSize.Full}
          size={ButtonSize.Lg}
          className="recovery-phrase__back-button"
          type="button"
          onClick={handleBack}
        >
          {t('back')}
        </Button>
        <Button
          width={BlockSize.Full}
          variant={ButtonVariant.Primary}
          size={ButtonSize.Lg}
          data-testid="recovery-phrase-continue"
          className="recovery-phrase__continue-button"
          disabled={!phraseRevealed}
          onClick={handleContinue}
          endIconName={IconName.Arrow2Right}
        >
          {t('continue')}
        </Button>
      </Box>
    </Box>
  );
}

RecoveryPhrase.propTypes = {
  secretRecoveryPhrase: PropTypes.string,
};
