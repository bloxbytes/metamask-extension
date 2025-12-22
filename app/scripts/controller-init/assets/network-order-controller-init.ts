import {
  NetworkOrderController,
  NetworkOrderControllerState,
} from '../../controllers/network-order';
import { NetworkOrderControllerMessenger } from '../messengers/assets';
import { ControllerInitFunction } from '../types';

const generateDefaultNetworkOrderControllerState =
  (): NetworkOrderControllerState => {
    if (
      process.env.METAMASK_DEBUG &&
      process.env.METAMASK_ENVIRONMENT === 'development' &&
      !process.env.IN_TEST
    ) {
      return {
        orderedNetworkList: [
          {
            networkId: 'eip155:984', // OPN
            networkRpcUrl: 'https://testnet-rpc.iopn.tech',
          },
        ],
      };
    }

    return {
      orderedNetworkList: [
        {
          networkId: 'eip155:985', // OPN
          networkRpcUrl: 'https://testnet-rpc.iopn.tech',
        },
      ],
    };
  };

export const NetworkOrderControllerInit: ControllerInitFunction<
  NetworkOrderController,
  NetworkOrderControllerMessenger
> = ({ controllerMessenger, persistedState }) => {
  const controller = new NetworkOrderController({
    messenger: controllerMessenger,
    state: {
      ...generateDefaultNetworkOrderControllerState(),
      ...persistedState.NetworkOrderController,
    },
  });

  return {
    controller,
  };
};
