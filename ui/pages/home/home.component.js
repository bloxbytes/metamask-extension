import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { EthMethod, isEvmAccountType } from '@metamask/keyring-api';
import { Text, TextVariant, TextColor } from '@metamask/design-system-react';
import {
  ///: BEGIN:ONLY_INCLUDE_IF(build-main)
  MetaMetricsContextProp,
  ///: END:ONLY_INCLUDE_IF
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../shared/constants/metametrics';
import TermsOfUsePopup from '../../components/app/terms-of-use-popup';
import RecoveryPhraseReminder from '../../components/app/recovery-phrase-reminder';
import WhatsNewModal from '../../components/app/whats-new-modal';
import { FirstTimeFlowType } from '../../../shared/constants/onboarding';
import HomeNotification from '../../components/app/home-notification';
import MultipleNotifications from '../../components/app/multiple-notifications';
import Button from '../../components/ui/button';
import Popover from '../../components/ui/popover';
import ConnectedSites from '../connected-sites';
import ConnectedAccounts from '../connected-accounts';
import { isMv3ButOffscreenDocIsMissing } from '../../../shared/modules/mv3.utils';
import ActionableMessage from '../../components/ui/actionable-message/actionable-message';

import {
  FontWeight,
  Display,
  FlexDirection,
  BlockSize,
  AlignItems,
  JustifyContent,
} from '../../helpers/constants/design-system';
import { SECOND } from '../../../shared/constants/time';
import {
  ButtonIcon,
  ButtonIconSize,
  IconName,
  Box,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '../../components/component-library';
import MultiRpcEditModal from '../../components/app/multi-rpc-edit-modal/multi-rpc-edit-modal';
import UpdateModal from '../../components/app/update-modal/update-modal';
import {
  RESTORE_VAULT_ROUTE,
  CONNECTED_ROUTE,
  CONNECTED_ACCOUNTS_ROUTE,
  AWAITING_SWAP_ROUTE,
  PREPARE_SWAP_ROUTE,
  CROSS_CHAIN_SWAP_ROUTE,
  ONBOARDING_REVIEW_SRP_ROUTE, ACCOUNT_LIST_PAGE_ROUTE,
} from '../../helpers/constants/routes';
import ZENDESK_URLS from '../../helpers/constants/zendesk-url';
import { METAMETRICS_SETTINGS_LINK } from '../../helpers/constants/common';
import {
  ///: BEGIN:ONLY_INCLUDE_IF(build-main)
  SUPPORT_LINK,
  ///: END:ONLY_INCLUDE_IF
} from '../../../shared/lib/ui-utils';
import { AccountOverview } from '../../components/multichain/account-overview';
import { setEditedNetwork } from '../../store/actions';
import { navigateToConfirmation } from '../confirmations/hooks/useConfirmationNavigation';
import PasswordOutdatedModal from '../../components/app/password-outdated-modal';
import ConnectionsRemovedModal from '../../components/app/connections-removed-modal';
import ShieldEntryModal from '../../components/app/shield-entry-modal';
import { AppHeaderOPN } from '../../components/multichain';
import AssetListControlBar from '../../components/app/assets/asset-list/asset-list-control-bar';
import CoinButtons from '../../components/app/wallet-overview/coin-buttons';
import { CoinBalance } from '../../components/app/wallet-overview/coin-balance';
import { getCurrentChainId } from '../../../shared/modules/selectors/networks';
import {
  isBalanceCached,
  getIsBridgeChain,
  getIsSwapsChain,
  getSelectedInternalAccount,
  getSelectedAccountCachedBalance,
} from '../../selectors';
import { getSelectedMultichainNetworkConfiguration } from '../../selectors/multichain/networks';
import { getMultichainSelectedAccountCachedBalance } from '../../selectors/multichain';
import { getIsNativeTokenBuyable } from '../../ducks/ramps';
import { shortenAddress } from '../../helpers/utils/util';
///: BEGIN:ONLY_INCLUDE_IF(build-beta)
import BetaHomeFooter from './beta/beta-home-footer.component';
///: END:ONLY_INCLUDE_IF
///: BEGIN:ONLY_INCLUDE_IF(build-flask)
import FlaskHomeFooter from './flask/flask-home-footer.component';

///: END:ONLY_INCLUDE_IF


function shouldCloseNotificationPopup({
  isNotification,
  totalUnapprovedCount,
  hasApprovalFlows,
  isSigningQRHardwareTransaction,
}) {
  const shouldClose =
    isNotification &&
    totalUnapprovedCount === 0 &&
    !hasApprovalFlows &&
    !isSigningQRHardwareTransaction;

  return shouldClose;
}


export const HomeCoinButtons = ({ iconView = false }) => {
  const account = useSelector(getSelectedInternalAccount);
  const evmChainId = useSelector(getCurrentChainId);
  const { chainId: multichainChainId } =
    useSelector(getSelectedMultichainNetworkConfiguration) || {};
  const isSwapsChainDefault = useSelector(getIsSwapsChain);
  const isBridgeChainDefault = useSelector(getIsBridgeChain);
  const isSwapsChainMultichain = useSelector((state) =>
    multichainChainId ? getIsSwapsChain(state, multichainChainId) : false,
  );
  const isBridgeChainMultichain = useSelector((state) =>
    multichainChainId ? getIsBridgeChain(state, multichainChainId) : false,
  );
  const isBuyableChain = useSelector(getIsNativeTokenBuyable);
  const isEvm = isEvmAccountType(account?.type);

  const chainId = isEvm ? evmChainId : multichainChainId;
  if (!account || !chainId) {
    return null;
  }

  const isSigningEnabled = isEvm
    ? account.methods?.includes(EthMethod.SignTransaction) ||
    account.methods?.includes(EthMethod.SignUserOperation)
    : true;

  return (
    <div className="home__coin-buttons">
      <CoinButtons
        account={account}
        chainId={chainId}
        trackingLocation="home"
        isSwapsChain={isEvm ? isSwapsChainDefault : isSwapsChainMultichain}
        isBridgeChain={isEvm ? isBridgeChainDefault : isBridgeChainMultichain}
        isSigningEnabled={isSigningEnabled}
        isBuyableChain={isBuyableChain}
        classPrefix="home"
        iconView={iconView}
      />
    </div>
  );
};

export const BannerComponent = ({ isPopup = false }) => {
  if (!isPopup) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="custom-card md:col-span-2">
        <div className="bg-gradient-custom"></div>

        <div className="px-4 py-2 relative">
          <div className="flex justify-center mb-4 relative">
            <img
              src="./images/logo/metamask-fox.svg"
              alt="OPN Logo"
              className="logo-image"
            />
          </div>

          <button className="custom-copy-section">
            <div className="flex items-center gap-2 relative z-10 w-full">
              <AppHeaderOPN location={location} />
            </div>
          </button>

          <button className="assetList-section">
            <Box className="w-full">
              <AssetListControlBar />
            </Box>
          </button>
        </div>
      </div>
    </div>
  );
};


export const HomeCoinBalance = () => {
  const account = useSelector(getSelectedInternalAccount);
  const evmChainId = useSelector(getCurrentChainId);
  const evmBalance = useSelector(getSelectedAccountCachedBalance);
  const nonEvmBalance = useSelector(
    getMultichainSelectedAccountCachedBalance,
  );
  const evmBalanceIsCached = useSelector(isBalanceCached);
  const { chainId: multichainChainId } =
    useSelector(getSelectedMultichainNetworkConfiguration) || {};
  const isEvm = isEvmAccountType(account?.type);

  const chainId = isEvm ? evmChainId : multichainChainId;
  const balance = isEvm ? evmBalance : nonEvmBalance;
  const balanceIsCached = isEvm ? evmBalanceIsCached : false;
  const displayAddress =
    account?.address && typeof account.address === 'string'
      ? shortenAddress(account.address)
      : '';

  if (!account || !chainId || balance === undefined) {
    return null;
  }

  return (
    <div className="home__coin-balance">
      <CoinBalance
        account={account}
        balance={balance}
        balanceIsCached={balanceIsCached}
        chainId={chainId}
        classPrefix="home"
      />
      {displayAddress ? (
        <div className="home__coin-balance-address"><p>{displayAddress}</p></div>
      ) : null}
    </div>
  );
};

export default class Home extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  static propTypes = {
    history: PropTypes.object,
    forgottenPassword: PropTypes.bool,
    setConnectedStatusPopoverHasBeenShown: PropTypes.func,
    shouldShowSeedPhraseReminder: PropTypes.bool.isRequired,
    isPopup: PropTypes.bool,
    connectedStatusPopoverHasBeenShown: PropTypes.bool,
    showRecoveryPhraseReminder: PropTypes.bool.isRequired,
    showTermsOfUsePopup: PropTypes.bool.isRequired,
    firstTimeFlowType: PropTypes.string,
    completedOnboarding: PropTypes.bool,
    showWhatsNewPopup: PropTypes.bool.isRequired,
    hideWhatsNewPopup: PropTypes.func.isRequired,
    announcementsToShow: PropTypes.bool.isRequired,
    onboardedInThisUISession: PropTypes.bool,
    showMultiRpcModal: PropTypes.bool.isRequired,
    showUpdateModal: PropTypes.bool.isRequired,
    newNetworkAddedConfigurationId: PropTypes.string,
    isNotification: PropTypes.bool.isRequired,
    // This prop is used in the `shouldCloseNotificationPopup` function
    // eslint-disable-next-line react/no-unused-prop-types
    totalUnapprovedCount: PropTypes.number.isRequired,
    defaultHomeActiveTabName: PropTypes.string,
    participateInMetaMetrics: PropTypes.bool.isRequired,
    onTabClick: PropTypes.func.isRequired,
    haveSwapsQuotes: PropTypes.bool.isRequired,
    showAwaitingSwapScreen: PropTypes.bool.isRequired,
    haveBridgeQuotes: PropTypes.bool.isRequired,
    setDataCollectionForMarketing: PropTypes.func.isRequired,
    dataCollectionForMarketing: PropTypes.bool,
    swapsFetchParams: PropTypes.object,
    location: PropTypes.object,
    shouldShowWeb3ShimUsageNotification: PropTypes.bool.isRequired,
    setWeb3ShimUsageAlertDismissed: PropTypes.func.isRequired,
    originOfCurrentTab: PropTypes.string,
    disableWeb3ShimUsageAlert: PropTypes.func.isRequired,
    pendingApprovals: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasApprovalFlows: PropTypes.bool.isRequired,
    infuraBlocked: PropTypes.bool.isRequired,
    setRecoveryPhraseReminderHasBeenShown: PropTypes.func.isRequired,
    setRecoveryPhraseReminderLastShown: PropTypes.func.isRequired,
    setTermsOfUseLastAgreed: PropTypes.func.isRequired,
    showOutdatedBrowserWarning: PropTypes.bool.isRequired,
    setOutdatedBrowserWarningLastShown: PropTypes.func.isRequired,
    newNetworkAddedName: PropTypes.string,
    editedNetwork: PropTypes.object,
    // This prop is used in the `shouldCloseNotificationPopup` function
    // eslint-disable-next-line react/no-unused-prop-types
    isSigningQRHardwareTransaction: PropTypes.bool,
    newNftAddedMessage: PropTypes.string,
    setNewNftAddedMessage: PropTypes.func.isRequired,
    removeNftMessage: PropTypes.string,
    setRemoveNftMessage: PropTypes.func.isRequired,
    attemptCloseNotificationPopup: PropTypes.func.isRequired,
    newTokensImported: PropTypes.string,
    newTokensImportedError: PropTypes.string,
    setNewTokensImported: PropTypes.func.isRequired,
    setNewTokensImportedError: PropTypes.func.isRequired,
    clearNewNetworkAdded: PropTypes.func,
    clearEditedNetwork: PropTypes.func,
    setActiveNetwork: PropTypes.func,
    hasAllowedPopupRedirectApprovals: PropTypes.bool.isRequired,
    useExternalServices: PropTypes.bool,
    setBasicFunctionalityModalOpen: PropTypes.func,
    fetchBuyableChains: PropTypes.func.isRequired,
    redirectAfterDefaultPage: PropTypes.object,
    clearRedirectAfterDefaultPage: PropTypes.func,
    setAccountDetailsAddress: PropTypes.func,
    isSeedlessPasswordOutdated: PropTypes.bool,
    isPrimarySeedPhraseBackedUp: PropTypes.bool,
    showConnectionsRemovedModal: PropTypes.bool,
    showShieldEntryModal: PropTypes.bool,
    isSocialLoginFlow: PropTypes.bool,
    lookupSelectedNetworks: PropTypes.func.isRequired,
  };

  state = {
    canShowBlockageNotification: true,
    notificationClosing: false,
    redirecting: false,
  };

  constructor(props) {
    super(props);

    const {
      attemptCloseNotificationPopup,
      haveSwapsQuotes,
      haveBridgeQuotes,
      isNotification,
      pendingApprovals,
      showAwaitingSwapScreen,
      swapsFetchParams,
      location,
    } = this.props;
    const stayOnHomePage = Boolean(location?.state?.stayOnHomePage);

    if (shouldCloseNotificationPopup(props)) {
      this.state.notificationClosing = true;
      attemptCloseNotificationPopup();
    } else if (
      pendingApprovals.length ||
      (!isNotification &&
        !stayOnHomePage &&
        (showAwaitingSwapScreen ||
          haveSwapsQuotes ||
          swapsFetchParams ||
          haveBridgeQuotes))
    ) {
      this.state.redirecting = true;
    }
  }

  checkStatusAndNavigate() {
    const {
      history,
      isNotification,
      haveSwapsQuotes,
      haveBridgeQuotes,
      showAwaitingSwapScreen,
      swapsFetchParams,
      location,
      pendingApprovals,
      hasApprovalFlows,
    } = this.props;
    const stayOnHomePage = Boolean(location?.state?.stayOnHomePage);

    const canRedirect = !isNotification && !stayOnHomePage;
    if (canRedirect && showAwaitingSwapScreen) {
      history.push(AWAITING_SWAP_ROUTE);
    } else if (canRedirect && (haveSwapsQuotes || swapsFetchParams)) {
      history.push(PREPARE_SWAP_ROUTE);
    } else if (canRedirect && haveBridgeQuotes) {
      history.push(CROSS_CHAIN_SWAP_ROUTE + PREPARE_SWAP_ROUTE);
    } else if (pendingApprovals.length || hasApprovalFlows) {
      navigateToConfirmation(
        pendingApprovals?.[0]?.id,
        pendingApprovals,
        hasApprovalFlows,
        history,
      );
    }
  }

  checkRedirectAfterDefaultPage() {
    const {
      redirectAfterDefaultPage,
      history,
      clearRedirectAfterDefaultPage,
      setAccountDetailsAddress,
    } = this.props;

    if (
      redirectAfterDefaultPage?.shouldRedirect &&
      redirectAfterDefaultPage?.path
    ) {
      // Set the account details address if provided
      if (redirectAfterDefaultPage?.address) {
        setAccountDetailsAddress(redirectAfterDefaultPage.address);
      }

      history.push(redirectAfterDefaultPage.path);
      clearRedirectAfterDefaultPage();
    }
  }

  componentDidMount() {
    this.checkStatusAndNavigate();

    this.props.fetchBuyableChains();

    // Check for redirect after default page
    this.checkRedirectAfterDefaultPage();

    // Ensure we have up-to-date connectivity statuses for all enabled networks
    this.props.lookupSelectedNetworks();
  }

  static getDerivedStateFromProps(props) {
    if (shouldCloseNotificationPopup(props)) {
      return { notificationClosing: true };
    }
    return null;
  }

  componentDidUpdate(_prevProps, prevState) {
    const {
      attemptCloseNotificationPopup,
      isNotification,
      hasAllowedPopupRedirectApprovals,
      newNetworkAddedConfigurationId,
      setActiveNetwork,
      clearNewNetworkAdded,
    } = this.props;

    const {
      newNetworkAddedConfigurationId: prevNewNetworkAddedConfigurationId,
    } = _prevProps;
    const { notificationClosing } = this.state;

    if (
      newNetworkAddedConfigurationId &&
      prevNewNetworkAddedConfigurationId !== newNetworkAddedConfigurationId
    ) {
      setActiveNetwork(newNetworkAddedConfigurationId);
      clearNewNetworkAdded();
    }

    if (notificationClosing && !prevState.notificationClosing) {
      attemptCloseNotificationPopup();
    } else if (isNotification || hasAllowedPopupRedirectApprovals) {
      this.checkStatusAndNavigate();
    }

    // Check for redirect after default page on updates
    this.checkRedirectAfterDefaultPage();
  }

  onRecoveryPhraseReminderClose = () => {
    const {
      setRecoveryPhraseReminderHasBeenShown,
      setRecoveryPhraseReminderLastShown,
    } = this.props;
    setRecoveryPhraseReminderHasBeenShown(true);
    setRecoveryPhraseReminderLastShown(new Date().getTime());
  };

  onAcceptTermsOfUse = () => {
    const { setTermsOfUseLastAgreed } = this.props;
    setTermsOfUseLastAgreed(new Date().getTime());
    this.context.trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.TermsOfUseAccepted,
      properties: {
        location: 'Terms Of Use Popover',
      },
    });
  };

  ///: BEGIN:ONLY_INCLUDE_IF(build-main)
  onSupportLinkClick = () => {
    this.context.trackEvent(
      {
        category: MetaMetricsEventCategory.Home,
        event: MetaMetricsEventName.SupportLinkClicked,
        properties: {
          url: SUPPORT_LINK,
        },
      },
      {
        contextPropsIntoEventProperties: [MetaMetricsContextProp.PageTitle],
      },
    );
  };
  ///: END:ONLY_INCLUDE_IF

  onOutdatedBrowserWarningClose = () => {
    const { setOutdatedBrowserWarningLastShown } = this.props;
    setOutdatedBrowserWarningLastShown(new Date().getTime());
  };

  renderNotifications() {
    const { t } = this.context;

    const {
      history,
      shouldShowSeedPhraseReminder,
      isPopup,
      shouldShowWeb3ShimUsageNotification,
      setWeb3ShimUsageAlertDismissed,
      originOfCurrentTab,
      disableWeb3ShimUsageAlert,
      infuraBlocked,
      showOutdatedBrowserWarning,
      newNftAddedMessage,
      setNewNftAddedMessage,
      newNetworkAddedName,
      editedNetwork,
      removeNftMessage,
      setRemoveNftMessage,
      newTokensImported,
      newTokensImportedError,
      setNewTokensImported,
      setNewTokensImportedError,
      clearNewNetworkAdded,
      clearEditedNetwork,
      isPrimarySeedPhraseBackedUp,
    } = this.props;

    const onAutoHide = () => {
      setNewNftAddedMessage('');
      setRemoveNftMessage('');
      setNewTokensImported(''); // Added this so we dnt see the notif if user does not close it
      setNewTokensImportedError('');
      setEditedNetwork();
    };

    const autoHideDelay = 5 * SECOND;

    const outdatedBrowserNotificationDescriptionText =
      isMv3ButOffscreenDocIsMissing ? (
        <div>
          <Text>{t('outdatedBrowserNotification')}</Text>
          <br />
          <Text fontWeight={FontWeight.Bold} color={TextColor.WarningDefault}>
            {t('noHardwareWalletOrSnapsSupport')}
          </Text>
        </div>
      ) : (
        t('outdatedBrowserNotification')
      );

    const items = [
      newNftAddedMessage === 'success' ? (
        <ActionableMessage
          key="new-nft-added"
          type="success"
          className="home__new-network-notification"
          autoHideTime={autoHideDelay}
          onAutoHide={onAutoHide}
          message={
            <Box display={Display.InlineFlex}>
              <i className="fa fa-check-circle home__new-nft-notification-icon" />
              <Text variant={TextVariant.BodySm} asChild>
                <h6>{t('newNftAddedMessage')}</h6>
              </Text>
              <ButtonIcon
                iconName={IconName.Close}
                size={ButtonIconSize.Sm}
                ariaLabel={t('close')}
                onClick={onAutoHide}
              />
            </Box>
          }
        />
      ) : null,
      removeNftMessage === 'success' ? (
        <ActionableMessage
          key="remove-nft"
          type="success"
          className="home__new-network-notification"
          autoHideTime={autoHideDelay}
          onAutoHide={onAutoHide}
          message={
            <Box display={Display.InlineFlex}>
              <i className="fa fa-check-circle home__new-nft-notification-icon" />
              <Text variant={TextVariant.BodySm} asChild>
                <h6>{t('removeNftMessage')}</h6>
              </Text>
              <ButtonIcon
                iconName={IconName.Close}
                size={ButtonIconSize.Sm}
                ariaLabel={t('close')}
                onClick={onAutoHide}
              />
            </Box>
          }
        />
      ) : null,
      removeNftMessage === 'error' ? (
        <ActionableMessage
          key="remove-nft-error"
          type="danger"
          className="home__new-network-notification"
          autoHideTime={autoHideDelay}
          onAutoHide={onAutoHide}
          message={
            <Box display={Display.InlineFlex}>
              <i className="fa fa-check-circle home__new-nft-notification-icon" />
              <Text variant={TextVariant.BodySm} asChild>
                <h6>{t('removeNftErrorMessage')}</h6>
              </Text>
              <ButtonIcon
                iconName={IconName.Close}
                size={ButtonIconSize.Sm}
                ariaLabel={t('close')}
                onClick={onAutoHide}
              />
            </Box>
          }
        />
      ) : null,
      newNetworkAddedName ? (
        <ActionableMessage
          key="new-network-added"
          type="success"
          className="home__new-network-notification"
          message={
            <Box display={Display.InlineFlex}>
              <i className="fa fa-check-circle home__new-network-notification-icon" />
              <Text variant={TextVariant.BodySm} asChild>
                <h6>{t('newNetworkAdded', [newNetworkAddedName])}</h6>
              </Text>
              <ButtonIcon
                iconName={IconName.Close}
                size={ButtonIconSize.Sm}
                ariaLabel={t('close')}
                onClick={() => clearNewNetworkAdded()}
                className="home__new-network-notification-close"
              />
            </Box>
          }
        />
      ) : null,
      editedNetwork?.editCompleted ? (
        <ActionableMessage
          key="edited-network"
          type="success"
          className="home__new-tokens-imported-notification"
          autoHideTime={autoHideDelay}
          onAutoHide={onAutoHide}
          message={
            <Box display={Display.InlineFlex}>
              <i className="fa fa-check-circle home__new-network-notification-icon" />
              <Text variant={TextVariant.BodySm} asChild>
                <h6>
                  {editedNetwork.newNetwork
                    ? t('newNetworkAdded', [editedNetwork.nickname])
                    : t('newNetworkEdited', [editedNetwork.nickname])}
                </h6>
              </Text>
              <ButtonIcon
                iconName={IconName.Close}
                size={ButtonIconSize.Sm}
                ariaLabel={t('close')}
                onClick={() => clearEditedNetwork()}
                className="home__new-network-notification-close"
              />
            </Box>
          }
        />
      ) : null,
      newTokensImported ? (
        <ActionableMessage
          key="new-tokens-imported"
          type="success"
          autoHideTime={autoHideDelay}
          onAutoHide={onAutoHide}
          className="home__new-tokens-imported-notification"
          message={
            <Box display={Display.InlineFlex}>
              <i className="fa fa-check-circle home__new-tokens-imported-notification-icon" />
              <Box>
                <Text
                  className="home__new-tokens-imported-notification-title"
                  variant={TextVariant.BodySm}
                  asChild
                >
                  <h6>{t('newTokensImportedTitle')}</h6>
                </Text>
                <Text
                  className="home__new-tokens-imported-notification-message"
                  variant={TextVariant.BodySm}
                  asChild
                >
                  <h6>{t('newTokensImportedMessage', [newTokensImported])}</h6>
                </Text>
              </Box>

              <ButtonIcon
                iconName={IconName.Close}
                size={ButtonIconSize.Sm}
                ariaLabel={t('close')}
                onClick={() => setNewTokensImported('')}
                className="home__new-tokens-imported-notification-close"
              />
            </Box>
          }
        />
      ) : null,
      newTokensImportedError ? (
        <ActionableMessage
          key="new-tokens-imported-error"
          type="danger"
          className="home__new-tokens-imported-notification"
          autoHideTime={autoHideDelay}
          onAutoHide={onAutoHide}
          message={
            <Box display={Display.InlineFlex}>
              <Icon name={IconName.Danger} marginRight={1} />
              <Text variant={TextVariant.BodySm} asChild>
                <h6>{t('importTokensError')}</h6>
              </Text>
              <ButtonIcon
                iconName={IconName.Close}
                size={ButtonIconSize.Sm}
                ariaLabel={t('close')}
                onClick={onAutoHide}
              />
            </Box>
          }
        />
      ) : null,
      shouldShowWeb3ShimUsageNotification ? (
        <HomeNotification
          key="show-web3-shim"
          descriptionText={t('web3ShimUsageNotification', [
            <span
              key="web3ShimUsageNotificationLink"
              className="home-notification__text-link"
              onClick={() =>
                global.platform.openTab({ url: ZENDESK_URLS.LEGACY_WEB3 })
              }
            >
              {t('here')}
            </span>,
          ])}
          ignoreText={t('dismiss')}
          onIgnore={(disable) => {
            setWeb3ShimUsageAlertDismissed(originOfCurrentTab);
            if (disable) {
              disableWeb3ShimUsageAlert();
            }
          }}
          checkboxText={t('dontShowThisAgain')}
          checkboxTooltipText={t('canToggleInSettings')}
        />
      ) : null,
      !isPrimarySeedPhraseBackedUp && shouldShowSeedPhraseReminder ? (
        <HomeNotification
          key="show-seed-phrase-reminder"
          descriptionText={t('backupApprovalNotice')}
          acceptText={t('backupNow')}
          onAccept={() => {
            const backUpSRPRoute = `${ONBOARDING_REVIEW_SRP_ROUTE}/?isFromReminder=true`;
            if (isPopup) {
              global.platform.openExtensionInBrowser(backUpSRPRoute);
            } else {
              history.push(backUpSRPRoute);
            }
          }}
          infoText={t('backupApprovalInfo')}
        />
      ) : null,
      infuraBlocked && this.state.canShowBlockageNotification ? (
        <HomeNotification
          key="infura-blocked"
          descriptionText={t('infuraBlockedNotification', [
            <span
              key="infuraBlockedNotificationLink"
              className="home-notification__text-link"
              onClick={() =>
                global.platform.openTab({ url: ZENDESK_URLS.INFURA_BLOCKAGE })
              }
            >
              {t('here')}
            </span>,
          ])}
          ignoreText={t('dismiss')}
          onIgnore={() => {
            this.setState({
              canShowBlockageNotification: false,
            });
          }}
        />
      ) : null,
      showOutdatedBrowserWarning ? (
        <HomeNotification
          key="outdated-browser-notification"
          descriptionText={outdatedBrowserNotificationDescriptionText}
          acceptText={t('gotIt')}
          onAccept={this.onOutdatedBrowserWarningClose}
        />
      ) : null,
    ].filter(Boolean);

    return items.length ? (
      <MultipleNotifications>{items}</MultipleNotifications>
    ) : null;
  }

  renderOnboardingPopover = () => {
    const { t } = this.context;
    const { setDataCollectionForMarketing } = this.props;

    const handleClose = () => {
      setDataCollectionForMarketing(false);
      this.context.trackEvent({
        category: MetaMetricsEventCategory.Home,
        event: MetaMetricsEventName.AnalyticsPreferenceSelected,
        properties: {
          has_marketing_consent: false,
          location: 'marketing_consent_modal',
        },
      });
    };

    const handleConsent = (consent) => {
      setDataCollectionForMarketing(consent);
      this.context.trackEvent({
        category: MetaMetricsEventCategory.Home,
        event: MetaMetricsEventName.AnalyticsPreferenceSelected,
        properties: {
          has_marketing_consent: consent,
          location: 'marketing_consent_modal',
        },
      });
    };

    return (
      <Modal isOpen onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            onClose={handleClose}
            display={Display.Flex}
            flexDirection={FlexDirection.Row}
            fontWeight={FontWeight.Bold}
            alignItems={AlignItems.center}
            justifyContent={JustifyContent.center}
            gap={4}
            size={18}
            paddingBottom={0}
          >
            {t('onboardedMetametricsTitle')}
          </ModalHeader>
          <ModalBody>
            <Box
              display={Display.Flex}
              flexDirection={FlexDirection.Column}
              gap={2}
              margin={4}
            >
              <Text>
                {t('onboardedMetametricsParagraph1', [
                  <a
                    href={METAMETRICS_SETTINGS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    key="retention-link"
                  >
                    {t('onboardedMetametricsLink')}
                  </a>,
                ])}
              </Text>
              <Text>{t('onboardedMetametricsParagraph2')}</Text>
              <ul className="home__onboarding_list">
                <li>{t('onboardedMetametricsKey1')}</li>
                <li>{t('onboardedMetametricsKey2')}</li>
                <li>{t('onboardedMetametricsKey3')}</li>
              </ul>
              <Text>{t('onboardedMetametricsParagraph3')}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Box
              display={Display.Flex}
              flexDirection={FlexDirection.Row}
              gap={2}
              width={BlockSize.Full}
            >
              <Button type="secondary" onClick={() => handleConsent(false)}>
                {t('onboardedMetametricsDisagree')}
              </Button>
              <Button type="primary" onClick={() => handleConsent(true)}>
                {t('onboardedMetametricsAccept')}
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  renderPopover = () => {
    const { setConnectedStatusPopoverHasBeenShown } = this.props;
    const { t } = this.context;
    return (
      <Popover
        title={t('whatsThis')}
        onClose={setConnectedStatusPopoverHasBeenShown}
        className="home__connected-status-popover"
        showArrow
        CustomBackground={({ onClose }) => {
          return (
            <div
              className="home__connected-status-popover-bg-container"
              onClick={onClose}
            >
              <div className="home__connected-status-popover-bg" />
            </div>
          );
        }}
        footer={
          <>
            <a
              href={ZENDESK_URLS.USER_GUIDE_DAPPS}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('learnMoreUpperCase')}
            </a>
            <Button
              type="primary"
              onClick={setConnectedStatusPopoverHasBeenShown}
            >
              {t('dismiss')}
            </Button>
          </>
        }
      >
        <main className="home__connect-status-text">
          <div>{t('metaMaskConnectStatusParagraphOne')}</div>
          <div>{t('metaMaskConnectStatusParagraphTwo')}</div>
          <div>{t('metaMaskConnectStatusParagraphThree')}</div>
        </main>
      </Popover>
    );
  };

  render() {
    const {
      defaultHomeActiveTabName,
      onTabClick,
      useExternalServices,
      setBasicFunctionalityModalOpen,
      forgottenPassword,
      participateInMetaMetrics,
      dataCollectionForMarketing,
      connectedStatusPopoverHasBeenShown,
      isPopup,
      showRecoveryPhraseReminder,
      showTermsOfUsePopup,
      showWhatsNewPopup,
      hideWhatsNewPopup,
      completedOnboarding,
      onboardedInThisUISession,
      announcementsToShow,
      firstTimeFlowType,
      newNetworkAddedConfigurationId,
      showMultiRpcModal,
      showUpdateModal,
      isSeedlessPasswordOutdated,
      isPrimarySeedPhraseBackedUp,
      showConnectionsRemovedModal,
      showShieldEntryModal,
      isSocialLoginFlow,
      location,
    } = this.props;

    if (forgottenPassword) {
      return <Redirect to={{ pathname: RESTORE_VAULT_ROUTE }} />;
    } else if (this.state.notificationClosing || this.state.redirecting) {
      return null;
    }

    const canSeeModals =
      completedOnboarding &&
      (!onboardedInThisUISession ||
        firstTimeFlowType === FirstTimeFlowType.import) &&
      !newNetworkAddedConfigurationId;

    const showWhatsNew =
      canSeeModals &&
      announcementsToShow &&
      showWhatsNewPopup &&
      !process.env.IN_TEST;

    const showMultiRpcEditModal =
      canSeeModals &&
      showMultiRpcModal &&
      !showWhatsNew &&
      !process.env.IN_TEST;

    const displayUpdateModal =
      canSeeModals &&
      showUpdateModal &&
      !showWhatsNew &&
      !showMultiRpcEditModal;

    const showTermsOfUse =
      false &&
      completedOnboarding &&
      !onboardedInThisUISession &&
      showTermsOfUsePopup &&
      !isSocialLoginFlow;

    return (
      <div
        className={classnames(
          'main-container py-8',
          { 'main-container--popup': isPopup },
        )}
      >
        {/* Background blur effects */}
        <div className="home__background-effects">
          <div className="home__background-effects__blur-circle home__background-effects__blur-circle--top-left"></div>
          <div
            className="home__background-effects__blur-circle home__background-effects__blur-circle--bottom-right"></div>
        </div>
        <Route path={CONNECTED_ROUTE} component={ConnectedSites} exact />
        <Route
          path={CONNECTED_ACCOUNTS_ROUTE}
          component={ConnectedAccounts}
          exact
        />
        {/*Start Custom*/}
        {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">*/}
        {/*  <div*/}
        {/*    className="custom-card md:col-span-2">*/}
        {/*    <div className="bg-gradient-custom"></div>*/}
        {/*    <div className="px-4 py-2 relative">*/}
        {/*      <div className="flex justify-center mb-4 relative">*/}
        {/*        <img src="./images/logo/metamask-fox.svg" alt="OPN Logo"*/}
        {/*             className="logo-image" /></div>*/}
        {/*      <button*/}
        {/*        className="custom-copy-section">*/}
        {/*        <div className="flex items-center gap-2 relative z-10 w-full">*/}
        {/*          <AppHeaderOPN location={location} />*/}
        {/*        </div>*/}

        {/*      </button>*/}

        {/*      <button*/}
        {/*        className="assetList-section">*/}
        {/*        <Box className="w-full">*/}
        {/*          <AssetListControlBar />*/}
        {/*        </Box>*/}

        {/*      </button>*/}
        {/*    </div>*/}
        {/*  </div>*/}

        {/*  {*/}
        {/*    isPopup ? null : <div*/}
        {/*      className="custom-card">*/}
        {/*      <h3 className="text-[#f8fdf1] mb-4">Quick Actions</h3>*/}
        {/*      <div className="space-y-2">*/}
        {/*        <HomeCoinButtons />*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  }*/}
        {/*</div>*/}

        <BannerComponent isPopup={isPopup} />


        {/*END CUSTOM*/}
        <div className="home__container">

          {dataCollectionForMarketing === null &&
            participateInMetaMetrics === true
            ? this.renderOnboardingPopover()
            : null}
          {isSeedlessPasswordOutdated && <PasswordOutdatedModal />}
          {showMultiRpcEditModal && <MultiRpcEditModal />}
          {displayUpdateModal && <UpdateModal />}
          {showWhatsNew ? <WhatsNewModal onClose={hideWhatsNewPopup} /> : null}
          {!showWhatsNew &&
            showRecoveryPhraseReminder &&
            !isPrimarySeedPhraseBackedUp ? (
            <RecoveryPhraseReminder
              onConfirm={this.onRecoveryPhraseReminderClose}
            />
          ) : null}
          {showTermsOfUse ? (
            <TermsOfUsePopup onAccept={this.onAcceptTermsOfUse} />
          ) : null}
          {showConnectionsRemovedModal && <ConnectionsRemovedModal />}
          {showShieldEntryModal && <ShieldEntryModal />}
          {isPopup && !connectedStatusPopoverHasBeenShown
            ? this.renderPopover()
            : null}

          <div className="home__main-view">

            <AccountOverview
              onTabClick={onTabClick}
              ///: BEGIN:ONLY_INCLUDE_IF(build-main)
              onSupportLinkClick={this.onSupportLinkClick}
              ///: END:ONLY_INCLUDE_IF
              defaultHomeActiveTabName={defaultHomeActiveTabName}
              useExternalServices={useExternalServices}
              setBasicFunctionalityModalOpen={setBasicFunctionalityModalOpen}
              showBalance={false}
              showButtons={false}
              isPopup={isPopup}
            ></AccountOverview>


            {
              ///: BEGIN:ONLY_INCLUDE_IF(build-beta)
              <div className="home__support">
                <BetaHomeFooter />
              </div>
              ///: END:ONLY_INCLUDE_IF
            }
            {
              ///: BEGIN:ONLY_INCLUDE_IF(build-flask)
              <div className="home__support">
                <FlaskHomeFooter />
              </div>
              ///: END:ONLY_INCLUDE_IF
            }


          </div>
          {this.renderNotifications()}
        </div>
      </div>
    );
  }
}
