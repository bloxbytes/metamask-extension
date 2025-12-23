import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValidMnemonic } from '@ethersproject/hdnode';
import {
  AlignItems,
  BlockSize,
  Display,
  FlexDirection,
  IconColor,
  JustifyContent,
  TextAlign,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import {
  ONBOARDING_CREATE_PASSWORD_ROUTE,
  ONBOARDING_WELCOME_ROUTE,
} from '../../../helpers/constants/routes';
import { useI18nContext } from '../../../hooks/useI18nContext';
import SrpInputImport from '../../../components/app/srp-input-import';
import { getCurrentKeyring } from '../../../selectors';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import { getHDEntropyIndex } from '../../../selectors/selectors';
import {
  Text,
  Box,
  Button,
  IconName,
  ButtonIcon,
  ButtonIconSize,
  ButtonSize,
} from '../../../components/component-library';
import SRPDetailsModal from '../../../components/app/srp-details-modal';
import ThemeToggleButtons from '../../../components/app/theme-toggle-buttons/theme-toggle-buttons';
import {
  forceUpdateMetamaskState,
  resetOnboarding,
} from '../../../store/actions';

const hasUpperCase = (draftSrp) => {
  return draftSrp !== draftSrp.toLowerCase();
};
export default function ImportSRP({ submitSecretRecoveryPhrase }) {
  const dispatch = useDispatch();
  const [secretRecoveryPhrase, setSecretRecoveryPhrase] = useState('');
  const [showSrpDetailsModal, setShowSrpDetailsModal] = useState(false);
  const [srpError, setSrpError] = useState('');
  const navigate = useNavigate();
  const hdEntropyIndex = useSelector(getHDEntropyIndex);
  const t = useI18nContext();
  const currentKeyring = useSelector(getCurrentKeyring);

  useEffect(() => {
    if (currentKeyring) {
      navigate(ONBOARDING_CREATE_PASSWORD_ROUTE, { replace: true });
    }
  }, [currentKeyring, navigate]);
  const trackEvent = useContext(MetaMetricsContext);

  const onShowSrpDetailsModal = useCallback(() => {
    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.SrpDefinitionClicked,
      properties: {
        location: 'import_srp',
      },
    });
    setShowSrpDetailsModal(true);
  }, [trackEvent]);

  const onBack = async (e) => {
    e.preventDefault();
    // reset onboarding flow
    await dispatch(resetOnboarding());
    await forceUpdateMetamaskState(dispatch);

    navigate(ONBOARDING_WELCOME_ROUTE, { replace: true });
  };

  const onContinue = useCallback(() => {
    let newSrpError = '';
    if (
      hasUpperCase(secretRecoveryPhrase) ||
      !isValidMnemonic(secretRecoveryPhrase)
    ) {
      newSrpError = t('invalidSeedPhraseNotFound');
    }

    setSrpError(newSrpError);

    if (newSrpError) {
      return;
    }

    submitSecretRecoveryPhrase(secretRecoveryPhrase);
    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.OnboardingWalletSecurityPhraseConfirmed,
      properties: {
        hd_entropy_index: hdEntropyIndex,
      },
    });
    navigate(ONBOARDING_CREATE_PASSWORD_ROUTE);
  }, [
    secretRecoveryPhrase,
    t,
    hdEntropyIndex,
    trackEvent,
    navigate,
    submitSecretRecoveryPhrase,
  ]);

  useEffect(() => {
    setSrpError('');
  }, [secretRecoveryPhrase]);

  return (
    <Box
      display={Display.Flex}
      flexDirection={FlexDirection.Column}
      justifyContent={JustifyContent.spaceBetween}
      height={BlockSize.Full}
      gap={4}
      className="import-srp"
      data-testid="import-srp"
    >
      <ThemeToggleButtons />
      {showSrpDetailsModal && (
        <SRPDetailsModal onClose={() => setShowSrpDetailsModal(false)} />
      )}
      <Box>
        <Box
          display={Display.Flex}
          alignItems={AlignItems.center}
          marginBottom={4}>
          <ButtonIcon
            iconName={IconName.Arrow2Left}
            color={IconColor.iconDefault}
            size={ButtonIconSize.Md}
            data-testid="import-srp-back-button"
            onClick={onBack}
            ariaLabel={t('back')}
          />

          <span>Back</span>
        </Box>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#4105b6] to-[#6305b6] rounded-full blur-2xl opacity-40"></div>
            <img
              src="./images/logo/metamask-fox.svg"
              width="110"
              alt="OPN Wallet"
              style={{
                border: '5px solid',
                borderColor: '#454e69',
              }}
              // eslint-disable-next-line @metamask/design-tokens/color-no-hex
              className="welcome-login__mascotImg rounded-full relative"
            />
          </div>
        </div>


        <Box textAlign={TextAlign.Left} marginBottom={2}>
          <Text variant={TextVariant.headingLg}>{t('importAWallet')}</Text>
        </Box>

        <Box
          display={Display.Flex}
          alignItems={AlignItems.center}
          justifyContent={JustifyContent.center}
          width="100%"
          marginBottom={4}
        >
          <Text variant={TextVariant.bodyMd} color={TextColor.textAlternative}>
            {t('typeYourSRP')}
          </Text>
          <ButtonIcon
            iconName={IconName.Info}
            size={ButtonIconSize.Sm}
            color={IconColor.iconAlternative}
            onClick={onShowSrpDetailsModal}
            ariaLabel="info"
          />
        </Box>


        <Box width={BlockSize.Full}>
          <form onSubmit={(e) => e.preventDefault()}>
            <SrpInputImport onChange={setSecretRecoveryPhrase} />
            {srpError && (
              <Box marginTop={2}>
                <Text
                  data-testid="import-srp-error"
                  variant={TextVariant.bodySm}
                  color={TextColor.errorDefault}
                >
                  {srpError}
                </Text>
              </Box>
            )}
          </form>
        </Box>
      </Box>


      <Box
        display={Display.Flex}
        flexDirection={FlexDirection.Column}
        justifyContent={JustifyContent.center}
        alignItems={AlignItems.center}
        width={BlockSize.Full}
        textAlign={TextAlign.Left}
      >

        <div className="rounded-lg p-3 mb-6 w-full custom-alert-info"
        ><p
          className="text-sm text-center">💡 Tip: You can paste all 12 words at once</p></div>

        <Button
          width={BlockSize.Full}
          size={ButtonSize.Lg}
          type="primary"
          data-testid="import-srp-confirm"
          onClick={onContinue}
          disabled={!secretRecoveryPhrase.trim() || Boolean(srpError)}
        >
          {t('importAWallet')}
        </Button>

        <div className="mt-6 custom-alert-warning">
        <p
          className="text-[#b0efff]/70 text-sm text-center">⚠️ Never share your recovery phrase with anyone. OPN will
          never ask for it.</p></div>

      </Box>
    </Box>
  );
}

ImportSRP.propTypes = {
  submitSecretRecoveryPhrase: PropTypes.func,
};
