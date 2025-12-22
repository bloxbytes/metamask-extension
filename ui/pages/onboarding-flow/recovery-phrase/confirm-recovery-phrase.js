import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  ButtonIcon,
  ButtonIconSize,
  ButtonSize,
  ButtonVariant,
  IconName,
  Text,
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
import { useI18nContext } from '../../../hooks/useI18nContext';
import { setSeedPhraseBackedUp } from '../../../store/actions';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import { getHDEntropyIndex } from '../../../selectors/selectors';
import {
  ONBOARDING_REVEAL_SRP_ROUTE,
  ONBOARDING_REVIEW_SRP_ROUTE,
  ONBOARDING_RECOVERY_CHECKLIST_ROUTE,
  REVEAL_SRP_LIST_ROUTE,
} from '../../../helpers/constants/routes';
import { TraceName } from '../../../../shared/lib/trace';
import ConfirmSrpModal from './confirm-srp-modal';
import RecoveryPhraseChips from './recovery-phrase-chips';

const QUIZ_WORDS_COUNT = 3;

const generateQuizWords = (secretRecoveryPhrase) => {
  const randomIndices = new Set();
  const srpLength = secretRecoveryPhrase.length;

  if (srpLength === 0) {
    return [];
  }

  while (randomIndices.size < QUIZ_WORDS_COUNT) {
    const randomIndex = Math.floor(Math.random() * srpLength);
    randomIndices.add(randomIndex);
  }

  const quizWords = Array.from(randomIndices).map((index) => {
    return {
      index,
      word: secretRecoveryPhrase[index],
    };
  });

  return quizWords;
};

export default function ConfirmRecoveryPhrase({ secretRecoveryPhrase = '' }) {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { search } = useLocation();
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);
  const { bufferedEndTrace } = trackEvent;
  const hdEntropyIndex = useSelector(getHDEntropyIndex);

  const splitSecretRecoveryPhrase = useMemo(
    () => (secretRecoveryPhrase ? secretRecoveryPhrase.split(' ') : []),
    [secretRecoveryPhrase],
  );
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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [matching, setMatching] = useState(false);
  const [quizWords, setQuizWords] = useState(
    generateQuizWords(splitSecretRecoveryPhrase),
  );
  const [answerSrp, setAnswerSrp] = useState('');

  useEffect(() => {
    if (!secretRecoveryPhrase) {
      navigate(
        `${ONBOARDING_REVEAL_SRP_ROUTE}${
          nextRouteQueryString ? `?${nextRouteQueryString}` : ''
        }`,
        { replace: true },
      );
    }
  }, [navigate, secretRecoveryPhrase, nextRouteQueryString]);

  const resetQuizWords = useCallback(() => {
    const newQuizWords = generateQuizWords(splitSecretRecoveryPhrase);
    setQuizWords(newQuizWords);
  }, [splitSecretRecoveryPhrase]);

  const handleQuizInput = useCallback(
    (inputValue) => {
      const isNotAnswered = inputValue.some((answer) => !answer.word);
      if (isNotAnswered) {
        setAnswerSrp('');
      } else {
        const copySplitSrp = [...splitSecretRecoveryPhrase];
        inputValue.forEach((answer) => {
          copySplitSrp[answer.index] = answer.word;
        });
        setAnswerSrp(copySplitSrp.join(' '));
      }
    },
    [splitSecretRecoveryPhrase],
  );

  const onContinue = useCallback(() => {
    const isMatching = answerSrp === secretRecoveryPhrase;
    setMatching(isMatching);
    setShowConfirmModal(true);
  }, [answerSrp, secretRecoveryPhrase]);

  const handleConfirmedPhrase = useCallback(() => {
    dispatch(setSeedPhraseBackedUp(true));
    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.OnboardingWalletSecurityPhraseConfirmed,
      properties: {
        hd_entropy_index: hdEntropyIndex,
      },
    });
    bufferedEndTrace?.({ name: TraceName.OnboardingNewSrpCreateWallet });
    bufferedEndTrace?.({ name: TraceName.OnboardingJourneyOverall });

    navigate(
      `${ONBOARDING_RECOVERY_CHECKLIST_ROUTE}${
        nextRouteQueryString ? `?${nextRouteQueryString}` : ''
      }`,
      { replace: true },
    );
  }, [
    dispatch,
    hdEntropyIndex,
    navigate,
    trackEvent,
    nextRouteQueryString,
    bufferedEndTrace,
  ]);

  const handleBack = useCallback(() => {
    navigate(
      `${ONBOARDING_REVIEW_SRP_ROUTE}${
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
      height={BlockSize.Full}
      gap={6}
      className="recovery-phrase recovery-phrase__confirm"
      data-testid="confirm-recovery-phrase"
    >
      <Box>
        {showConfirmModal && (
          <ConfirmSrpModal
            isError={!matching}
            onContinue={handleConfirmedPhrase}
            onClose={() => {
              resetQuizWords();
              setShowConfirmModal(false);
            }}
          />
        )}
        {isFromReminder && isFromSettingsSecurity ? (
          <Box
            className="recovery-phrase__header"
            display={Display.Grid}
            alignItems={AlignItems.center}
            gap={1}
            marginBottom={4}
            width={BlockSize.Full}
          >
            <ButtonIcon
              iconName={IconName.ArrowLeft}
              color={IconColor.iconDefault}
              size={ButtonIconSize.Md}
              data-testid="reveal-recovery-phrase-confirm-back-button"
              onClick={() => navigate(-1)}
              ariaLabel={t('back')}
            />
            <Text variant={TextVariant.headingSm} textAlign={TextAlign.Center}>
              {t('confirmRecoveryPhraseTitleSettings')}
            </Text>
            <ButtonIcon
              iconName={IconName.Close}
              color={IconColor.iconDefault}
              size={ButtonIconSize.Md}
              data-testid="reveal-recovery-phrase-confirm-close-button"
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
                {t('confirmRecoveryPhraseTitle')}
              </Text>
              <Text
                variant={TextVariant.bodyMd}
                color={TextColor.textAlternative}
                as="p"
                className="recovery-phrase__subtitle"
                textAlign={TextAlign.Center}
              >
                {t('confirmRecoveryPhraseDetails')}
              </Text>
            </Box>
          </>
        )}
        {splitSecretRecoveryPhrase.length > 0 && (
          <RecoveryPhraseChips
            secretRecoveryPhrase={splitSecretRecoveryPhrase}
            quizWords={quizWords}
            confirmPhase
            setInputValue={handleQuizInput}
          />
        )}
      </Box>
      {/* Buttons */}
      <Box
        width={BlockSize.Full}
        display={Display.Flex}
        flexDirection={FlexDirection.Row}
        gap={4}
      >
        <Button
          data-testid="confirm-recovery-phrase-back-button"
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
          data-testid="recovery-phrase-confirm"
          className="recovery-phrase__continue-button"
          disabled={answerSrp.trim() === ''}
          onClick={() => onContinue()}
          endIconName={IconName.Arrow2Right}
        >
          {t('continue')}
        </Button>
      </Box>
    </Box>
  );
}

ConfirmRecoveryPhrase.propTypes = {
  secretRecoveryPhrase: PropTypes.string,
};
