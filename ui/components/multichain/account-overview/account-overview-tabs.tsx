import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Hex } from '@metamask/utils';
import {
  ACCOUNT_OVERVIEW_TAB_KEY_TO_METAMETRICS_EVENT_NAME_MAP,
  ACCOUNT_OVERVIEW_TAB_KEY_TO_TRACE_NAME_MAP,
  AccountOverviewTabKey,
} from '../../../../shared/constants/app-state';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import { endTrace, trace } from '../../../../shared/lib/trace';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { ASSET_ROUTE, DEFI_ROUTE } from '../../../helpers/constants/routes';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { useSafeChains } from '../../../pages/settings/networks-tab/networks-form/use-safe-chains';
import {
  getChainIdsToPoll,
  getIsMultichainAccountsState2Enabled,
} from '../../../selectors';
import { detectNfts, showImportTokensModal } from '../../../store/actions';
import AssetList from '../../app/assets/asset-list';
import DeFiTab from '../../app/assets/defi-list/defi-tab';
import { useAssetListTokenDetection } from '../../app/assets/hooks';
import NftsTab from '../../app/assets/nfts/nfts-tab';
import TransactionList from '../../app/transaction-list';
import UnifiedTransactionList from '../../app/transaction-list/unified-transaction-list.component';
import { Box } from '../../component-library';
import {
  AlignItems,
  Display,
  JustifyContent,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { Tab, Tabs } from '../../ui/tabs';
import { useTokenBalances } from '../../../hooks/useTokenBalances';
import { AccountOverviewCommonProps } from './common';
import { HomeCoinBalance, HomeCoinButtons } from '../../../pages/home/home.component';
import { Activity, Home, Image, Settings, Zap } from 'lucide-react';
import { Button, ButtonSize, ButtonVariant } from '../../component-library';
import { getMultichainIsEvm } from '../../../selectors/multichain';

import SettingsTab from './settings';
import AssetListControlBar from '../../app/assets/asset-list/asset-list-control-bar';

export type AccountOverviewTabsProps = AccountOverviewCommonProps & {
  showTokens: boolean;
  showTokensLinks?: boolean;
  showNfts: boolean;
  showActivity: boolean;
  showDefi?: boolean;
  showSettings?: boolean;
  isPopup?: boolean;
};

export const AccountOverviewTabs = ({
                                      onTabClick,
                                      defaultHomeActiveTabName,
                                      showTokens,
                                      showTokensLinks,
                                      showNfts,
                                      showActivity,
                                      showDefi,
                                      showSettings,
                                      isPopup = false,
                                    }: AccountOverviewTabsProps) => {
  const history = useHistory();
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);
  const dispatch = useDispatch();
  const selectedChainIds = useSelector(getChainIdsToPoll);
  const isEvm = useSelector(getMultichainIsEvm);
  const canManageTokens = showTokensLinks ?? isEvm;

  useAssetListTokenDetection();

  // EVM specific tokenBalance polling, updates state via polling loop per chainId
  useTokenBalances({
    chainIds: selectedChainIds as Hex[],
  });

  const handleTabClick = useCallback(
    (tabName: AccountOverviewTabKey) => {
      onTabClick(tabName);
      if (tabName === AccountOverviewTabKey.Nfts) {
        dispatch(detectNfts(selectedChainIds));
      }
      trackEvent({
        category: MetaMetricsEventCategory.Home,
        event: ACCOUNT_OVERVIEW_TAB_KEY_TO_METAMETRICS_EVENT_NAME_MAP[tabName],
      });
      if (defaultHomeActiveTabName) {
        endTrace({
          name: ACCOUNT_OVERVIEW_TAB_KEY_TO_TRACE_NAME_MAP[
            defaultHomeActiveTabName
            ],
        });
      }
      trace({
        name: ACCOUNT_OVERVIEW_TAB_KEY_TO_TRACE_NAME_MAP[tabName],
      });
    },
    [onTabClick],
  );

  const onClickAsset = useCallback(
    (chainId: string, asset: string) =>
      history.push(`${ASSET_ROUTE}/${chainId}/${encodeURIComponent(asset)}`),
    [history],
  );
  const onClickDeFi = useCallback(
    (chainId: string, protocolId: string) =>
      history.push(
        `${DEFI_ROUTE}/${chainId}/${encodeURIComponent(protocolId)}`,
      ),
    [history],
  );

  const handleManageTokens = useCallback(() => {
    if (!canManageTokens) {
      return;
    }

    dispatch(showImportTokensModal());
    trackEvent({
      category: MetaMetricsEventCategory.Navigation,
      event: MetaMetricsEventName.TokenImportButtonClicked,
      properties: {
        location: 'HOME',
      },
    });
  }, [canManageTokens, dispatch, trackEvent]);

  const { safeChains } = useSafeChains();

  const isBIP44FeatureFlagEnabled = useSelector(
    getIsMultichainAccountsState2Enabled,
  );
  const showUnifiedTransactionList = isBIP44FeatureFlagEnabled;
  const tabListClassName = isPopup
    ? 'account-overview-tabs__tablist account-overview-tabs__tablist--popup'
    : 'account-overview-tabs__tablist';
  const tabContentClassName = isPopup
    ? 'account-overview-tabs__content account-overview-tabs__content--popup'
    : 'p-9 account-overview-tabs__content';
  const renderTabLabel = (
    label: React.ReactNode,
    IconComponent?: React.ComponentType<{ className?: string }>,
  ) => {
    if (!isPopup) {
      return label;
    }

    return (
      <span className="account-overview-tabs__nav-label">
        {IconComponent ? (
          <IconComponent className="account-overview-tabs__nav-icon" />
        ) : null}
        <span className="account-overview-tabs__nav-text">{label}</span>
      </span>
    );
  };

  const popupTabClass = isPopup
    ? 'account-overview-tabs__tab account-overview-tabs__tab--popup'
    : undefined;

  return (
    <Tabs<AccountOverviewTabKey>
      defaultActiveTabKey={defaultHomeActiveTabName ?? undefined}
      onTabClick={handleTabClick}
      className={isPopup ? 'account-overview-tabs account-overview-tabs--popup' : 'account-overview-tabs'}
      tabListProps={{
        className: tabListClassName,
        style: isPopup ? undefined : { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
        display: isPopup ? Display.Grid : undefined,
      }}
      tabContentProps={{
        className: tabContentClassName,
      }}
    >
      {showTokens && (
        <Tab
          name={renderTabLabel('Dashboard', Home)}
          tabKey={AccountOverviewTabKey.Tokens}
          data-testid="account-overview__asset-tab"
          className={popupTabClass}
        >

          <Box marginBottom={4}>
            <HomeCoinBalance />
          </Box>

          <Box
            marginBottom={4}
            className={'account-overview-tab-asset-list-control-bar'}
            display={Display.Flex}
            justifyContent={JustifyContent.spaceBetween}
            alignItems={AlignItems.center}
          >
            <HomeCoinButtons iconView={true} />
          </Box>


          <Box marginBottom={4}>
            <div
              className="level-card">

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <svg className="absolute inset-0 w-12 h-12 -rotate-90">
                        <circle cx="24" cy="24" r="22" fill="none" stroke="url(#repGradient)" stroke-width="2"
                                stroke-dasharray="75.486 138" stroke-linecap="round"
                                className="transition-all duration-500"></circle>
                        <defs>
                          <linearGradient id="repGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#2280cd"></stop>
                            <stop offset="100%" stop-color="#b0efff"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2280cd] to-[#4105b6] flex items-center justify-center shadow-lg shadow-[#4105b6]/50 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-award w-6 h-6 text-[#f8fdf1]">
                          <path
                            d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                          <circle cx="12" cy="8" r="6"></circle>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="inner-content-heading">Level 12</div>
                      <div className="text-count">8,547</div>
                      <div className="inner-content-heading">REP Score</div>
                    </div>
                  </div>
                  <button
                    className="bg-gradient-to-r from-[#4105b6] to-[#6305b6] text-[#f8fdf1] px-3 py-1.5 rounded-lg hover:from-[#6305b6] hover:to-[#4105b6] transition-all shadow-lg shadow-[#4105b6]/30 hover:shadow-[#4105b6]/50 whitespace-nowrap"
                    style={{ fontSize: '12px' }}
                  >
                    View Badges
                  </button>
                </div>
                <div className="flex items-center gap-1 text-[#2280cd] text-sm mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       className="lucide lucide-trending-up w-4 h-4">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                  <span>+247 this week</span></div>
                <div
                  className="w-full bg-[#0f112a]/70 backdrop-blur-sm rounded-full h-2 overflow-hidden border theme-border-color">
                  <div
                    className="bg-gradient-to-r from-[#2280cd] to-[#b0efff] h-full shadow-lg shadow-[#2280cd]/50 transition-all duration-500"
                  ></div>
                </div>
                <div className="mt-1 inner-content-heading">453 REP to Level 13</div>
              </div>
            </div>
          </Box>

          <Box marginBottom={4}>
            <div
              className="level-card">


              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2280cd] to-[#b0efff] flex items-center justify-center shadow-lg shadow-[#2280cd]/50">
                      <Activity className="w-4 h-4 text-[#f8fdf1]" />
                    </div>
                    <div>
                      <div className="inner-count">OPN Chain</div>
                      <div className="inner-content-heading">Live Network Status</div>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-1 px-2 py-1 bg-[#2280cd]/20 rounded-full border border-[#2280cd]/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b0efff] animate-pulse"></div>
                    <span className="text-[#2280cd] text-xs">Active</span>
                  </div>
                </div>

                {/* Animated nodes visualization */}
                <div
                  className="relative h-16 mb-3 rounded-lg sub-level overflow-hidden">
                  <svg className="w-full h-full">
                    {/* Animated connection lines */}
                    <line x1="10%" y1="50%" x2="30%" y2="50%" stroke="#4105b6" strokeWidth="2" opacity="0.6">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                    </line>
                    <line x1="30%" y1="50%" x2="50%" y2="30%" stroke="#2280cd" strokeWidth="2" opacity="0.6">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="0.5s"
                               repeatCount="indefinite" />
                    </line>
                    <line x1="50%" y1="30%" x2="70%" y2="50%" stroke="#b0efff" strokeWidth="2" opacity="0.6">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="1s"
                               repeatCount="indefinite" />
                    </line>
                    <line x1="70%" y1="50%" x2="90%" y2="50%" stroke="#4105b6" strokeWidth="2" opacity="0.6">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="1.5s"
                               repeatCount="indefinite" />
                    </line>

                    {/* Animated nodes */}
                    <circle cx="10%" cy="50%" r="4" fill="#4105b6">
                      <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="30%" cy="50%" r="4" fill="#2280cd">
                      <animate attributeName="r" values="3;5;3" dur="2s" begin="0.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50%" cy="30%" r="4" fill="#b0efff">
                      <animate attributeName="r" values="3;5;3" dur="2s" begin="1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="70%" cy="50%" r="4" fill="#2280cd">
                      <animate attributeName="r" values="3;5;3" dur="2s" begin="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="90%" cy="50%" r="4" fill="#4105b6">
                      <animate attributeName="r" values="3;5;3" dur="2s" begin="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="light-card-bg">
                    <div className="flex items-center gap-1 mb-1">
                      <Zap className="w-3 h-3 text-[#b0efff]" />
                      <span className="inner-content-heading">TPS</span>
                    </div>
                    <div className="text-count">15,847</div>
                  </div>
                  <div className="light-card-bg">
                    <div className="inner-content-heading mb-1">Validators</div>
                    <div className="text-count">1,247</div>
                  </div>
                </div>
              </div>
            </div>


            <Box marginBottom={2}>

              <Box
                display="flex"
                justifyContent="space-between"
                paddingTop={4}
                paddingBottom={4}
                alignItems="center"
                marginBottom={2}
              >
                <div>Tokens</div>
                <Button
                  size={ButtonSize.Sm}
                  variant={ButtonVariant.Secondary}
                  onClick={handleManageTokens}
                  disabled={!canManageTokens}
                >
                  Manage
                </Button>
              </Box>

              <AssetList
                showTokensLinks={showTokensLinks ?? true}
                onClickAsset={onClickAsset}
                safeChains={safeChains}
              />
            </Box>
          </Box>
        </Tab>
      )}
      {false && showDefi && (
        <Tab
          name={t('defi')}
          tabKey={AccountOverviewTabKey.DeFi}
          data-testid="account-overview__defi-tab"
        >
          <Box>
            <DeFiTab
              showTokensLinks={showTokensLinks ?? true}
              onClickAsset={onClickDeFi}
              safeChains={safeChains}
            />
          </Box>
        </Tab>
      )}

      {showNfts && (
        <Tab
          name={renderTabLabel(t('nfts'), Image)}
          tabKey={AccountOverviewTabKey.Nfts}
          data-testid="account-overview__nfts-tab"
          className={popupTabClass}
        >
          <NftsTab />
        </Tab>
      )}


      {showActivity && (
        <Tab
          name={renderTabLabel(t('activity'), Activity)}
          tabKey={AccountOverviewTabKey.Activity}
          data-testid="account-overview__activity-tab"
          className={popupTabClass}
        >
          {showUnifiedTransactionList ? (
            <UnifiedTransactionList />
          ) : (
            <TransactionList />
          )}
        </Tab>
      )}
      {showSettings && (
        <Tab
          name={renderTabLabel(t('settings'), Settings)}
          // Settings may not be present on the AccountOverviewTabKey enum in all branches;
          // cast to satisfy the Tabs generic while keeping runtime key as 'settings'.
          tabKey={AccountOverviewTabKey.Settings}
          data-testid="account-overview__settings-tab"
          className={popupTabClass}
        >
          <Box padding={4}>
            <SettingsTab />
          </Box>
        </Tab>
      )}


    </Tabs>
  );
};
