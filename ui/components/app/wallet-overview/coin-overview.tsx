import React from 'react';
import { CaipChainId } from '@metamask/utils';
import type { Hex } from '@metamask/utils';

import { InternalAccount } from '@metamask/keyring-internal-api';
import WalletOverview from './wallet-overview';
import { CoinBalance } from './coin-balance';
import CoinButtons from './coin-buttons';

export type CoinOverviewProps = {
  account: InternalAccount;
  balance: string;
  balanceIsCached: boolean;
  className?: string;
  classPrefix?: string;
  chainId: CaipChainId | Hex;
  isBridgeChain: boolean;
  isBuyableChain: boolean;
  isSwapsChain: boolean;
  isSigningEnabled: boolean;
};

export const CoinOverview = ({
  account,
  balance,
  balanceIsCached,
  className,
  classPrefix = 'coin',
  chainId,
  isBridgeChain,
  isBuyableChain,
  isSwapsChain,
  isSigningEnabled,
}: CoinOverviewProps) => {
  return (
    <WalletOverview
      balance={
        <CoinBalance
          account={account}
          balance={balance}
          balanceIsCached={balanceIsCached}
          chainId={chainId}
          classPrefix={classPrefix}
        />
      }
      buttons={
        <CoinButtons
          {...{
            account,
            trackingLocation: 'home',
            chainId,
            isSwapsChain,
            isSigningEnabled,
            isBridgeChain,
            isBuyableChain,
            classPrefix,
          }}
        />
      }
      className={className}
    />
  );
};
