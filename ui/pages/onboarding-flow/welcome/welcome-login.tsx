import EventEmitter from 'events';
import React, { useCallback, useRef, useState } from 'react';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import Mascot from '../../../components/ui/mascot';
import {
  Box,
  Button,
  ButtonSize,
  ButtonVariant,
  Text,
  IconName,
} from '../../../components/component-library';
import {
  AlignItems,
  Display,
  FlexDirection,
  JustifyContent,
  TextAlign,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { isFlask, isBeta } from '../../../helpers/utils/build-types';
import { getIsSeedlessOnboardingFeatureEnabled } from '../../../../shared/modules/environment';
import { ThemeType } from '../../../../shared/constants/preferences';
import { setTermsOfUseLastAgreed } from '../../../store/actions';
import LoginOptions from './login-options';
import { LOGIN_OPTION, LOGIN_TYPE, LoginOptionType, LoginType } from './types';
import { TermsModal } from './terms-modal';
import { PrivacyModal } from './privacy-modal';

// TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
// eslint-disable-next-line @typescript-eslint/naming-convention
export default function WelcomeLogin({
                                       onLogin,
                                     }: {
  onLogin: (loginType: LoginType, loginOption: string) => Promise<void>;
}) {
  const t = useI18nContext();
  const animationEventEmitter = useRef(new EventEmitter());
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [loginOption, setLoginOption] = useState<LoginOptionType | null>(null);
  const isSeedlessOnboardingFeatureEnabled =
    getIsSeedlessOnboardingFeatureEnabled();
  const dispatch = useDispatch();
  const [showImportOption, setShowImportOption] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const renderMascot = () => {
    return (
      <img
        src="./images/logo/metamask-fox.svg"
        width="256"
        height="256"
        alt="OPN Wallet"

        // eslint-disable-next-line @metamask/design-tokens/color-no-hex
        className="welcome-login__mascotImg rounded-full relative mb-4 img-border"
      />
    );

    if (isFlask()) {
      return (
        <img src="./images/logo/metamask-fox.svg" width="178" height="178" />
      );
    }
    if (isBeta()) {
      return (
        <img src="./images/logo/metamask-fox.svg" width="178" height="178" />
      );
    }
    return (
      <Mascot
        animationEventEmitter={animationEventEmitter.current}
        width="268"
        height="268"
      />
    );
  };

  const handleLogin = useCallback(
    async (loginType: LoginType) => {
      if (!loginOption) {
        return;
      }
      setShowLoginOptions(false);

      await dispatch(setTermsOfUseLastAgreed(new Date().getTime()));

      await onLogin(loginType, loginOption);
    },
    [dispatch, loginOption, onLogin],
  );

  return (
    <>
      {/* Background blur effects */}
      <Box className="welcome-login__background-effects">
        <Box className="welcome-login__blur-circle welcome-login__blur-circle--top-left" />
        <Box className="welcome-login__blur-circle welcome-login__blur-circle--bottom-right" />
        <Box className="welcome-login__blur-circle welcome-login__blur-circle--center" />
      </Box>
      <Box
        display={Display.Flex}
        flexDirection={FlexDirection.Column}
        justifyContent={JustifyContent.spaceBetween}
        gap={4}
        marginInline="auto"
        marginTop={2}
        padding={6}
        className="welcome-login"
        data-testid="get-started"
      >
        <Box
          display={Display.Flex}
          flexDirection={FlexDirection.Column}
          alignItems={AlignItems.center}
          justifyContent={JustifyContent.center}
          className="welcome-login__content"
        >
          <Text
            marginInline={5}
            marginBottom={5}
            textAlign={TextAlign.Center}
            as="h2"
            className="welcome-login__title"
            data-testid="onboarding-welcome"
          >
            {t('welcomeToMetaMask')}
          </Text>

          <Box
            className={classnames('welcome-login__mascot', {
              'welcome-login__mascot--image': isFlask() || isBeta(),
            })}
          >
            {renderMascot()}
          </Box>
        </Box>

        <Box
          display={Display.Flex}
          flexDirection={FlexDirection.Column}
          gap={4}
        >
          <Button
            data-testid="onboarding-create-wallet"
            variant={ButtonVariant.Primary}
            size={ButtonSize.Lg}
            block
            endIconName={IconName.Arrow2Right}
            className="welcome-login__button-primary"
            onClick={async () => {
              setShowLoginOptions(true);
              setLoginOption(LOGIN_OPTION.NEW);
              if (!isSeedlessOnboardingFeatureEnabled) {
                await onLogin(LOGIN_TYPE.SRP, LOGIN_OPTION.NEW);
              }

            }}
          >
            {t('onboardingCreateWallet')}
          </Button>


          <Button
            data-testid="onboarding-import-wallet"
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Lg}
            block
            className="welcome-login__button-secondary"
            onClick={async () => {
              setShowLoginOptions(true);
              setLoginOption(LOGIN_OPTION.EXISTING);
              if (!isSeedlessOnboardingFeatureEnabled) {
                await onLogin(LOGIN_TYPE.SRP, LOGIN_OPTION.EXISTING);
              }
            }}
          >
            {showImportOption ? t('onboardingImportWallet') : (isSeedlessOnboardingFeatureEnabled
              ? t('onboardingImportWallet')
              : t('onboardingSrpImport'))}
          </Button>

          <div className={'mb-4'}></div>
          <div className="text-[#4f5262] text-sm">
            <p>
              By continuing, I agree to OPN Wallet's{' '}
              <button
                type="button"
                className="welcome-login__legal-link"
                onClick={() => setShowTermsModal(true)}
              >
                Terms of Use
              </button>{' '}
              and{' '}
              <button
                type="button"
                className="welcome-login__legal-link"
                onClick={() => setShowPrivacyModal(true)}
              >
                Privacy notice
              </button>
              .
            </p>
          </div>

        </Box>


        {isSeedlessOnboardingFeatureEnabled &&
          showLoginOptions &&
          loginOption && (
            <LoginOptions
              loginOption={loginOption}
              onClose={() => {
                setLoginOption(null);
              }}
              handleLogin={handleLogin}
            />
          )}
        {showTermsModal && (
          <TermsModal
            isOpen={showTermsModal}
            onClose={() => setShowTermsModal(false)}
          />
        )}
        {showPrivacyModal && (
          <PrivacyModal
            isOpen={showPrivacyModal}
            onClose={() => setShowPrivacyModal(false)}
          />
        )}
      </Box>
    </>
  );
}
