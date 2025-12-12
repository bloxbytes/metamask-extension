// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for web3's BigNumber if AMD's "define" is defined...
let __define;

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
const cleanContextForImports = () => {
  __define = global.define;
  try {
    global.define = undefined;
  } catch (_) {
    console.warn('MetaMask - global.define could not be deleted.');
  }
};

/**
 * Restores global define object from cached reference
 */
const restoreContextAfterImports = () => {
  try {
    global.define = __define;
  } catch (_) {
    console.warn('MetaMask - global.define could not be overwritten.');
  }
};

cleanContextForImports();

/* eslint-disable import/first */
import log from 'loglevel';
import { v4 as uuid } from 'uuid';
import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { initializeProvider } from '@metamask/providers/initializeInpageProvider';
import ObjectMultiplex from '@metamask/object-multiplex';
import { pipeline } from 'readable-stream';

import {
  getDefaultTransport,
  getMultichainClient,
} from '@metamask/multichain-api-client';
import { registerSolanaWalletStandard } from '@metamask/solana-wallet-standard';

import shouldInjectProvider from '../../shared/modules/provider-injection';
import { METAMASK_EIP_1193_PROVIDER } from './constants/stream';

// contexts
const CONTENT_SCRIPT = 'opn-contentscript';
const INPAGE = 'opn-inpage';

restoreContextAfterImports();

log.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn');

//
// setup plugin communication
//

if (shouldInjectProvider()) {
  // setup background connection
  const metamaskStream = new WindowPostMessageStream({
    name: INPAGE,
    target: CONTENT_SCRIPT,
  });

  const mux = new ObjectMultiplex();

  /**
   * Note: We do NOT add graceful shutdown handlers (close/end/beforeunload) to the mux
   * in this file, unlike in the background stream files (provider-stream.ts, etc.).
   *
   * This is intentional because:
   *
   * 1. CONTEXT DIFFERENCE:
   *    - inpage.js runs in PAGE CONTEXT (web pages)
   *    - Background streams run in EXTENSION CONTEXT (persistent background)
   *
   * 2. AUTOMATIC CLEANUP:
   *    - When a page navigates/unloads, the browser automatically destroys the entire
   *      script execution context, including all streams and event listeners
   *    - No explicit cleanup is needed - the browser handles it naturally
   *
   * 3. AVOIDING PREMATURE DISCONNECTION:
   *    - Adding handlers that call mux.end() or connectionStream.end() can actually
   *      CAUSE disconnection errors when pages navigate to external URLs
   *    - Tests showed that explicit handlers in page context trigger "Disconnected from
   *      MetaMask background" errors during rapid navigation scenarios (e.g., deep links)
   *
   * 4. DIFFERENT ERROR SOURCE:
   *    - "Premature close" errors in page context are typically harmless - they occur
   *      during normal page navigation and don't indicate a real problem
   *    - The critical "Premature close" issues (3.8M/month in Sentry) come from the
   *      BACKGROUND streams that persist across page loads
   *
   * For context on the "Premature close" issue, see:
   * - https://github.com/MetaMask/metamask-extension/issues/26337
   * - https://github.com/MetaMask/metamask-extension/issues/35241
   */
  pipeline(metamaskStream, mux, metamaskStream, (error) => {
    let warningMsg = `Lost connection to "${METAMASK_EIP_1193_PROVIDER}".`;
    if (error?.stack) {
      warningMsg += `\n${error.stack}`;
    }
    console.warn(warningMsg);
  });

  const providerInfo = {
    uuid: uuid(),
    name: process.env.METAMASK_BUILD_NAME,
    icon: process.env.METAMASK_BUILD_ICON,
    rdns: process.env.METAMASK_BUILD_APP_ID,
  };

  const opnProvider = initializeProvider({
    connectionStream: mux.createStream(METAMASK_EIP_1193_PROVIDER),
    logger: log,
    shouldShimWeb3: true,
    providerInfo,
  });

  opnProvider.isOPN = true;
  window.__OPN_PROVIDER__ = opnProvider;
  window.__OPN_PROVIDERS__ = [opnProvider];

  // Override ethereum
  Object.defineProperty(window, 'ethereum', {
    configurable: false,
    enumerable: true,

    get() {
      // The main provider: ALWAYS your wallet
      const eth = window.__OPN_PROVIDER__;
      eth.isMetaMask = false;

      // Attach provider list dynamically
      eth.providers = window.__OPN_PROVIDERS__;
      return eth;
    },

    set(newProvider) {
      // // MetaMask tries to set its provider here
      // window.__METAMASK_PROVIDER__ = newProvider;

      // Store it in list (but do NOT replace the default provider)
      window.__OPN_PROVIDERS__.push(newProvider);
    },
  });

  const multichainClient = getMultichainClient({
    transport: getDefaultTransport(),
  });
  registerSolanaWalletStandard({
    client: multichainClient,
    walletName: process.env.METAMASK_BUILD_NAME,
  });
}
