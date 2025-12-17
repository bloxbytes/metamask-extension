import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Hex } from '@metamask/utils';
import {
  ACCOUNT_OVERVIEW_TAB_KEY_TO_METAMETRICS_EVENT_NAME_MAP,
  ACCOUNT_OVERVIEW_TAB_KEY_TO_TRACE_NAME_MAP,
  AccountOverviewTabKey,
} from '../../../../shared/constants/app-state';
import { MetaMetricsEventCategory } from '../../../../shared/constants/metametrics';
import { endTrace, trace } from '../../../../shared/lib/trace';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { ASSET_ROUTE, DEFI_ROUTE } from '../../../helpers/constants/routes';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { useSafeChains } from '../../../pages/settings/networks-tab/networks-form/use-safe-chains';
import {
  getChainIdsToPoll,
  getIsMultichainAccountsState2Enabled,
} from '../../../selectors';
import { detectNfts } from '../../../store/actions';
import AssetList from '../../app/assets/asset-list';
import DeFiTab from '../../app/assets/defi-list/defi-tab';
import { useAssetListTokenDetection } from '../../app/assets/hooks';
import NftsTab from '../../app/assets/nfts/nfts-tab';
import TransactionList from '../../app/transaction-list';
import UnifiedTransactionList from '../../app/transaction-list/unified-transaction-list.component';
import { Box, Text } from '../../component-library';
import { TextVariant } from '../../../helpers/constants/design-system';
import { Tab, Tabs } from '../../ui/tabs';
import { useTokenBalances } from '../../../hooks/useTokenBalances';
import { AccountOverviewCommonProps } from './common';
import { HomeCoinBalance, HomeCoinButtons } from '../../../pages/home/home.component';
import AssetListControlBar from '../../app/assets/asset-list/asset-list-control-bar';

export type AccountOverviewTabsProps = AccountOverviewCommonProps & {
  showTokens: boolean;
  showTokensLinks?: boolean;
  showNfts: boolean;
  showActivity: boolean;
  showDefi?: boolean;
};

export const AccountOverviewTabs = ({
                                      onTabClick,
                                      defaultHomeActiveTabName,
                                      showTokens,
                                      showTokensLinks,
                                      showNfts,
                                      showActivity,
                                      showDefi,
                                    }: AccountOverviewTabsProps) => {
  const history = useHistory();
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);
  const dispatch = useDispatch();
  const selectedChainIds = useSelector(getChainIdsToPoll);

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

  const { safeChains } = useSafeChains();

  const isBIP44FeatureFlagEnabled = useSelector(
    getIsMultichainAccountsState2Enabled,
  );
  const showUnifiedTransactionList = isBIP44FeatureFlagEnabled;

  return (
    <Tabs<AccountOverviewTabKey>
      defaultActiveTabKey={defaultHomeActiveTabName ?? undefined}
      onTabClick={handleTabClick}
      tabListProps={{
        className: 'px-4',
      }}
    >
      {showTokens && (
        <Tab
          name={t('tokens')}
          tabKey={AccountOverviewTabKey.Tokens}
          data-testid="account-overview__asset-tab"
        >

          <Box marginBottom={4}>
            <HomeCoinBalance />
          </Box>

          <Box marginBottom={4} className={'account-overview-tab-asset-list-control-bar'}>
            <HomeCoinButtons iconView={true} />
          </Box>


          <div
            className="mt-3 bg-gradient-to-br from-[#1a1d3a]/60 to-[#1a1d3a]/40 backdrop-blur-xl rounded-xl p-4 border border-[#4105b6]/40 shadow-2xl relative overflow-hidden">
            <div
              className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-[#2280cd]/20 to-[#4105b6]/20 rounded-full blur-3xl animate-pulse"></div>
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
                    <div className="text-[#b0efff]/70 text-xs">Level 12</div>
                    <div className="text-[#f8fdf1] text-xl font-light">8,547</div>
                    <div className="text-[#4f5262] text-xs">REP Score</div>
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-[#4105b6] to-[#6305b6] text-[#f8fdf1] px-3 py-1.5 rounded-lg text-xs hover:from-[#6305b6] hover:to-[#4105b6] transition-all shadow-lg shadow-[#4105b6]/30 hover:shadow-[#4105b6]/50 whitespace-nowrap">View
                  Badges
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
                className="w-full bg-[#0f112a]/70 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-[#4105b6]/20">
                <div
                  className="bg-gradient-to-r from-[#2280cd] to-[#b0efff] h-full shadow-lg shadow-[#2280cd]/50 transition-all duration-500"
                ></div>
              </div>
              <div className="mt-1 text-[#b0efff]/60 text-xs">453 REP to Level 13</div>
            </div>
          </div>


          <Box marginBottom={2}>
            <AssetList
              showTokensLinks={showTokensLinks ?? true}
              onClickAsset={onClickAsset}
              safeChains={safeChains}
            />
          </Box>
        </Tab>
      )}
      {showDefi && (
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
          name={t('nfts')}
          tabKey={AccountOverviewTabKey.Nfts}
          data-testid="account-overview__nfts-tab"
        >
          <NftsTab />
        </Tab>
      )}

      {showActivity && (
        <Tab
          name={t('activity')}
          tabKey={AccountOverviewTabKey.Activity}
          data-testid="account-overview__activity-tab"
        >
          {showUnifiedTransactionList ? (
            <UnifiedTransactionList />
          ) : (
            <TransactionList />
          )}
        </Tab>
      )}
    </Tabs>
  );
};
