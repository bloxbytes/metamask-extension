import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { CaipChainId } from '@metamask/utils';
import type { Hex } from '@metamask/utils';
import { InternalAccount } from '@metamask/keyring-internal-api';
import { getNativeTokenAddress } from '@metamask/assets-controllers';
import { Box, ButtonLink, IconName } from '../../component-library';
import { TextVariant } from '../../../helpers/constants/design-system';
import { getPortfolioUrl } from '../../../helpers/utils/portfolio';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';

import { I18nContext } from '../../../contexts/i18n';
import Tooltip from '../../ui/tooltip';
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display';
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common';
import {
  getPreferences,
  getShouldHideZeroBalanceTokens,
  getTokensMarketData,
  getIsTestnet,
  getIsTokenNetworkFilterEqualCurrentNetwork,
  getChainIdsToPoll,
  getDataCollectionForMarketing,
  getMetaMetricsId,
  getParticipateInMetaMetrics,
  getEnabledNetworksByNamespace,
  isGlobalNetworkSelectorRemoved,
  getIsMultichainAccountsState2Enabled,
  selectAnyEnabledNetworksAreAvailable,
} from '../../../selectors';

import { PercentageAndAmountChange } from '../../multichain/token-list-item/price/percentage-and-amount-change/percentage-and-amount-change';
import { AccountGroupBalance } from '../assets/account-group-balance/account-group-balance';
import { AccountGroupBalanceChange } from '../assets/account-group-balance-change/account-group-balance-change';

import {
  getMultichainIsEvm,
  getMultichainShouldShowFiat,
} from '../../../selectors/multichain';
import { setPrivacyMode } from '../../../store/actions';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { useAccountTotalCrossChainFiatBalance } from '../../../hooks/useAccountTotalCrossChainFiatBalance';

import { useGetFormattedTokensPerChain } from '../../../hooks/useGetFormattedTokensPerChain';
import { useMultichainSelector } from '../../../hooks/useMultichainSelector';
import { AggregatedBalance } from '../../ui/aggregated-balance/aggregated-balance';
import { Skeleton } from '../../component-library/skeleton';
import { isZeroAmount } from '../../../helpers/utils/number-utils';
import {
  AggregatedMultichainPercentageOverview,
  AggregatedPercentageOverview,
} from './aggregated-percentage-overview';
import { AggregatedPercentageOverviewCrossChains } from './aggregated-percentage-overview-cross-chains';

export type CoinBalanceProps = {
  account: InternalAccount;
  balance: string;
  balanceIsCached: boolean;
  classPrefix?: string;
  chainId: CaipChainId | Hex;
};

export const CoinBalance = ({
  account,
  balance,
  balanceIsCached,
  classPrefix = 'coin',
  chainId,
}: CoinBalanceProps) => {
  const enabledNetworks = useSelector(getEnabledNetworksByNamespace);

  const t: ReturnType<typeof useI18nContext> = useContext(I18nContext);

  const trackEvent = useContext(MetaMetricsContext);

  const metaMetricsId = useSelector(getMetaMetricsId);
  const isMetaMetricsEnabled = useSelector(getParticipateInMetaMetrics);
  const isMarketingEnabled = useSelector(getDataCollectionForMarketing);

  const dispatch = useDispatch();

  const { privacyMode, showNativeTokenAsMainBalance } =
    useSelector(getPreferences);

  const isTokenNetworkFilterEqualCurrentNetwork = useSelector(
    getIsTokenNetworkFilterEqualCurrentNetwork,
  );

  const isEvm = useSelector(getMultichainIsEvm);
  const shouldHideZeroBalanceTokens = useSelector(
    getShouldHideZeroBalanceTokens,
  );
  const allChainIDs = useSelector(getChainIdsToPoll) as string[];
  const shouldShowFiat = useMultichainSelector(
    getMultichainShouldShowFiat,
    account,
  );
  const isTestnet = useSelector(getIsTestnet);
  const { formattedTokensWithBalancesPerChain } = useGetFormattedTokensPerChain(
    account,
    shouldHideZeroBalanceTokens,
    isTokenNetworkFilterEqualCurrentNetwork,
    allChainIDs,
  );

  const { totalFiatBalance } = useAccountTotalCrossChainFiatBalance(
    account,
    formattedTokensWithBalancesPerChain,
  );

  const tokensMarketData = useSelector(getTokensMarketData);
  const isMultichainAccountsState2Enabled = useSelector(
    getIsMultichainAccountsState2Enabled,
  );

  const anyEnabledNetworksAreAvailable = useSelector(
    selectAnyEnabledNetworksAreAvailable,
  );

  const handleSensitiveToggle = () => {
    dispatch(setPrivacyMode(!privacyMode));
  };

  const handlePortfolioOnClick = useCallback(() => {
    const url = getPortfolioUrl(
      'explore/tokens',
      'ext_portfolio_button',
      metaMetricsId,
      isMetaMetricsEnabled,
      isMarketingEnabled,
    );
    global.platform.openTab({ url });
    trackEvent({
      category: MetaMetricsEventCategory.Navigation,
      event: MetaMetricsEventName.PortfolioLinkClicked,
      properties: {
        location: 'Home',
        text: 'Portfolio',
      },
    });
  }, [isMarketingEnabled, isMetaMetricsEnabled, metaMetricsId, trackEvent]);

  const renderPercentageAndAmountChange = () => {
    const renderPortfolioButton = () => {
      return (
        <ButtonLink
          endIconName={IconName.Export}
          onClick={handlePortfolioOnClick}
          as="a"
          data-testid="portfolio-link"
          textProps={{ variant: TextVariant.bodyMdMedium }}
        >
          {t('discover')}
        </ButtonLink>
      );
      return null;
    };

    const renderNativeTokenView = () => {
      const value =
        tokensMarketData?.[getNativeTokenAddress(chainId as Hex)]
          ?.pricePercentChange1d;
      return (
        <Skeleton
          isLoading={!anyEnabledNetworksAreAvailable && isZeroAmount(value)}
        >
          <Box className="wallet-overview__currency-wrapper">
            <PercentageAndAmountChange value={value} />
            {renderPortfolioButton()}
          </Box>
        </Skeleton>
      );
    };

    const renderAggregatedView = () => (
      <Box className="wallet-overview__currency-wrapper">
        {isTokenNetworkFilterEqualCurrentNetwork ? (
          <AggregatedPercentageOverview
            portfolioButton={renderPortfolioButton}
          />
        ) : (
          <AggregatedPercentageOverviewCrossChains
            portfolioButton={renderPortfolioButton}
          />
        )}
      </Box>
    );

    const renderNonEvmView = () => (
      <Box className="wallet-overview__currency-wrapper">
        <AggregatedMultichainPercentageOverview
          privacyMode={privacyMode}
          portfolioButton={renderPortfolioButton}
        />
      </Box>
    );

    // Early exit for state2 unified view
    if (isMultichainAccountsState2Enabled) {
      return (
        <Box className="wallet-overview__currency-wrapper">
          <AccountGroupBalanceChange
            period="1d"
            portfolioButton={renderPortfolioButton}
          />
        </Box>
      );
    }

    if (!isEvm) {
      return renderNonEvmView();
    }

    return showNativeTokenAsMainBalance &&
      Object.keys(enabledNetworks).length === 1
      ? renderNativeTokenView()
      : renderAggregatedView();
  };

  /**
   * Obtains the currency type which should be displayed as main balance.
   * PRIMARY - Native Token or FIAT balance
   * SECONDARY - Fiat or Native Token balance.
   * @returns {string} PRIMARY | SECONDARY
   */
  const getCurrencyDisplayType = (): typeof PRIMARY | typeof SECONDARY => {
    const isMultiNetwork = Object.keys(enabledNetworks).length > 1;

    if (isGlobalNetworkSelectorRemoved) {
      if (isMultiNetwork && showNativeTokenAsMainBalance) {
        return SECONDARY;
      }
      return PRIMARY;
    }
    return PRIMARY;
  };

  let balanceSection: React.ReactNode;
  if (isMultichainAccountsState2Enabled) {
    balanceSection = (
      <AccountGroupBalance
        classPrefix={classPrefix}
        balanceIsCached={balanceIsCached}
        handleSensitiveToggle={handleSensitiveToggle}
      />
    );
  } else if (isEvm) {
    balanceSection = (
      <UserPreferencedCurrencyDisplay
        style={{ display: 'contents' }}
        account={account}
        className={classnames(`${classPrefix}-overview__primary-balance`, {
          [`${classPrefix}-overview__cached-balance`]: balanceIsCached,
        })}
        data-testid={`${classPrefix}-overview__primary-currency`}
        value={
          showNativeTokenAsMainBalance || isTestnet
            ? balance
            : totalFiatBalance.toString()
        }
        type={getCurrencyDisplayType()}
        ethNumberOfDecimals={4}
        hideTitle
        shouldCheckShowNativeToken
        isAggregatedFiatOverviewBalance={
          !showNativeTokenAsMainBalance && !isTestnet && shouldShowFiat
        }
        privacyMode={privacyMode}
        onClick={handleSensitiveToggle}
      />
    );
  } else {
    balanceSection = (
      <AggregatedBalance
        classPrefix={classPrefix}
        balanceIsCached={balanceIsCached}
        handleSensitiveToggle={handleSensitiveToggle}
      />
    );
  }

  return (
    <Tooltip
      position="top"
      title={t('balanceOutdated')}
      disabled={!balanceIsCached}
    >
      <div
        className={`${classPrefix}-overview__balance [.wallet-overview-fullscreen_&]:items-center`}
      >
        <div className={`${classPrefix}-overview__primary-container`}>
          {balanceSection}
          {balanceIsCached && (
            <span className={`${classPrefix}-overview__cached-star`}>*</span>
          )}
        </div>
        {renderPercentageAndAmountChange()}
      </div>
    </Tooltip>
  );
};

export default CoinBalance;
