import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';
import {
  AlignItems,
  BackgroundColor,
  BlockSize,
  BorderColor,
  BorderRadius,
  BorderStyle,
  Display,
  FlexDirection,
  JustifyContent,
  TextAlign,
  TextColor,
  TextVariant,
  IconColor,
} from '../../../helpers/constants/design-system';
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Checkbox,
  Icon,
  IconName,
  IconSize,
  Text,
  Box,
} from '../../../components/component-library';
import { useI18nContext } from '../../../hooks/useI18nContext';
import {
  ONBOARDING_CONFIRM_SRP_ROUTE,
  ONBOARDING_COMPLETION_ROUTE,
  ONBOARDING_METAMETRICS,
} from '../../../helpers/constants/routes';
import { PLATFORM_FIREFOX } from '../../../../shared/constants/app';
import { getBrowserName } from '../../../../shared/modules/browser-runtime.utils';

const CHECKLIST_ITEMS = [
  {
    key: 'recoveryChecklistItemOne',
    icon: IconName.Description,
  },
  {
    key: 'recoveryChecklistItemTwo',
    icon: IconName.ShieldLock,
  },
  {
    key: 'recoveryChecklistItemThree',
    icon: IconName.Danger,
  },
  {
    key: 'recoveryChecklistItemFour',
    icon: IconName.Confirmation,
  },
];

export default function RecoveryChecklist() {
  const t = useI18nContext();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [checkedItems, setCheckedItems] = useState(
    CHECKLIST_ITEMS.map(() => false),
  );

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const nextRouteQueryString = searchParams.toString();
  const nextRoute =
    getBrowserName() === PLATFORM_FIREFOX ||
    searchParams.get('isFromReminder') === 'true'
      ? ONBOARDING_COMPLETION_ROUTE
      : ONBOARDING_METAMETRICS;

  const allChecked = useMemo(
    () => checkedItems.every(Boolean),
    [checkedItems],
  );

  const toggleItem = (index) => {
    setCheckedItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? !item : item,
      ),
    );
  };

  const handleContinue = () => {
    navigate(
      `${nextRoute}${nextRouteQueryString ? `?${nextRouteQueryString}` : ''}`,
      { replace: true },
    );
  };

  const handleBack = () => {
    navigate(
      `${ONBOARDING_CONFIRM_SRP_ROUTE}${
        nextRouteQueryString ? `?${nextRouteQueryString}` : ''
      }`,
      { replace: true },
    );
  };

  return (
    <Box
      data-testid="recovery-checklist"
      className="recovery-checklist"
      display={Display.Flex}
      flexDirection={FlexDirection.Column}
      justifyContent={JustifyContent.center}
      alignItems={AlignItems.Center}
      padding={4}
      width={BlockSize.Full}
      height={BlockSize.Full}
      position="relative"

    >
      <Box
        position="absolute"
        inset={0}
        style={{ pointerEvents: 'none' }}
      />
      <Box
        backgroundColor={BackgroundColor.backgroundDefault}
        borderColor={BorderColor.borderMuted}
        borderStyle={BorderStyle.solid}
        borderWidth={1}
        borderRadius={BorderRadius.XL}
        padding={6}
        display={Display.Flex}
        flexDirection={FlexDirection.Column}
        gap={6}
        width="100%"

      >
        <Box
          display={Display.Flex}
          flexDirection={FlexDirection.Column}
          alignItems={AlignItems.center}
          gap={3}
          textAlign={TextAlign.Center}
        >
          <Box
            display={Display.Flex}
            alignItems={AlignItems.center}
            justifyContent={JustifyContent.center}
            height={BlockSize.Full}
            width={BlockSize.Full}
          >
            <img
              src="./images/logo/metamask-fox.svg"
              width="72"
              height="72"
              alt="OPN Logo"
              style={{
                borderRadius: '9999px',
                boxShadow: '0 0 24px rgba(65, 5, 182, 0.4)',
              }}
            />
          </Box>
          <Text
            variant={TextVariant.headingLg}
            color={TextColor.textDefault}
            className="recovery-phrase__title"
          >
            {t('recoveryChecklistTitle')}
          </Text>
          <Text
            variant={TextVariant.bodySm}
            color={TextColor.textAlternative}
            textAlign={TextAlign.Center}
          >
            {t('recoveryChecklistSubtitle')}
          </Text>
        </Box>

        <Box
          display={Display.Flex}
          flexDirection={FlexDirection.Column}
          gap={3}
        >
          {CHECKLIST_ITEMS.map(({ key, icon }, index) => (
            <Box
              key={key}
              display={Display.Flex}
              alignItems={AlignItems.flexStart}
              gap={3}
              padding={4}
              borderRadius={BorderRadius.LG}
              style={{
                background:
                  'linear-gradient(135deg, rgba(26, 29, 58, 0.6), rgba(26, 29, 58, 0.4))',
                border: '1px solid rgba(65, 5, 182, 0.3)',
              }}
              role="button"
              tabIndex={0}
              onClick={() => toggleItem(index)}
              onKeyDown={(event) => {
                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault();
                  toggleItem(index);
                }
              }}
            >
              <Checkbox
                id={`recovery-checklist-${index}`}
                data-testid={`recovery-checklist-${index}`}
                isChecked={checkedItems[index]}
                onChange={() => toggleItem(index)}
                alignItems={AlignItems.flexStart}
                onClick={(event) => event.stopPropagation()}
                label={
                  <Box display={Display.Flex} flexDirection={FlexDirection.Column} gap={2}>
                    <Box display={Display.Flex} alignItems={AlignItems.center} gap={2}>
                      <Icon
                        name={icon}
                        color={IconColor.iconDefault}
                        size={IconSize.Sm}
                      />
                      <Text variant={TextVariant.bodyMd} color={TextColor.textDefault}>
                        {t(key)}
                      </Text>
                    </Box>
                    <Text
                      variant={TextVariant.bodySm}
                      color={TextColor.textAlternative}
                    >
                      {t(`${key}Description`)}
                    </Text>
                  </Box>
                }
              />
            </Box>
          ))}
        </Box>

        <Box
          padding={4}
          borderRadius={BorderRadius.LG}
          style={{
            background: 'rgba(15, 17, 42, 0.5)',
            border: '1px solid rgba(65, 5, 182, 0.2)',
          }}
        >
          <Text variant={TextVariant.bodySm} color={TextColor.textAlternative}>
            <strong style={{ color: 'var(--color-text-default)' }}>
              {t('recoveryChecklistImportantTitle')}
            </strong>{' '}
            {t('recoveryChecklistImportantDescription')}
          </Text>
        </Box>

        <Box
          width={BlockSize.Full}
          display={Display.Flex}
          flexDirection={FlexDirection.Row}
          gap={3}
        >
          <Button
            variant={ButtonVariant.Secondary}
            width={BlockSize.Full}
            size={ButtonSize.Lg}
            data-testid="recovery-checklist-back"
            onClick={handleBack}
          >
            {t('back')}
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            width={BlockSize.Full}
            size={ButtonSize.Lg}
            data-testid="recovery-checklist-continue"
            disabled={!allChecked}
            onClick={handleContinue}
            endIconName={IconName.ArrowRight}
          >
            {t('recoveryChecklistComplete')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
