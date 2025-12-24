import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Award,
  Flame,
  Lock,
  Shield,
  Star,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import {
  AlignItems,
  BackgroundColor,
  BlockSize,
  Display,
  FlexDirection,
  JustifyContent,
  BorderRadius,
} from '../../../helpers/constants/design-system';
import { Box } from '../../../components/component-library';
import { DEFAULT_ROUTE } from '../../../helpers/constants/routes';

export const Badges = () => {
  const history = useHistory();

  const badges = [
    {
      id: 1,
      name: 'Early Adopter',
      description: 'Joined OPN in the first month',
      icon: Star,
      color: '#b0efff',
      unlocked: true,
      rep: 500,
    },
    {
      id: 2,
      name: 'Trading Master',
      description: 'Completed 100 swap transactions',
      icon: Zap,
      color: '#4105b6',
      unlocked: true,
      rep: 1000,
    },
    {
      id: 3,
      name: 'NFT Collector',
      description: 'Own 10 or more NFTs',
      icon: Award,
      color: '#6305b6',
      unlocked: true,
      rep: 750,
    },
    {
      id: 4,
      name: 'Security Pro',
      description: 'Enable all security features',
      icon: Shield,
      color: '#2280cd',
      unlocked: true,
      rep: 300,
    },
    {
      id: 5,
      name: 'Whale Status',
      description: 'Hold over $50,000 in assets',
      icon: Trophy,
      color: '#b0efff',
      unlocked: false,
      rep: 2500,
    },
    {
      id: 6,
      name: 'Diamond Hands',
      description: 'Hold tokens for 1 year',
      icon: Target,
      color: '#4105b6',
      unlocked: false,
      rep: 2000,
    },
    {
      id: 7,
      name: 'DeFi Pioneer',
      description: 'Use 5 different DeFi protocols',
      icon: Flame,
      color: '#6305b6',
      unlocked: false,
      rep: 1500,
    },
    {
      id: 8,
      name: 'Community Leader',
      description: 'Refer 10 new users',
      icon: Award,
      color: '#2280cd',
      unlocked: false,
      rep: 3000,
    },
  ];

  const unlockedBadges = badges.filter((badge) => badge.unlocked);
  const lockedBadges = badges.filter((badge) => !badge.unlocked);

  const handleClose = () => {
    if (history.length > 1) {
      history.goBack();
      return;
    }
    history.push(DEFAULT_ROUTE);
  };

  return (
    <Box
      alignItems={AlignItems.center}
      backgroundColor={BackgroundColor.backgroundDefault}
      className="redesigned__send__container"
      display={Display.Flex}
      flexDirection={FlexDirection.Column}
      height={BlockSize.Full}
      justifyContent={JustifyContent.center}
      style={{ flex: '1 0 auto', minHeight: 0 }}
      width={BlockSize.Full}
    >
      <Box
        backgroundColor={BackgroundColor.backgroundSection}
        className="redesigned__send__wrapper"
        display={Display.Flex}
        height={BlockSize.Full}
        justifyContent={JustifyContent.center}
        width={BlockSize.Full}
        borderRadius={BorderRadius.LG}
      >
        <Box
          className="redesigned__send__content"
          display={Display.Flex}
          flexDirection={FlexDirection.Column}
          height={BlockSize.Full}
          width={BlockSize.Full}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between border-b border-[#4105b6]/20">
              <div>
                <h2 className="modal-title">Badges & Achievements</h2>
                <p className="text-[#4f5262] text-sm">
                  {unlockedBadges.length} of {badges.length} unlocked
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="badge-x"
                aria-label="Close badges"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <h3 className="color-primary-cl mb-3 Fsize-18">Unlocked</h3>
                <div className="grid grid-cols-2 gap-3">
                  {unlockedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="custom-card badge-box-shadow"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                        style={{ backgroundColor: badge.color }}
                      >
                        <badge.icon className="w-6 h-6 text-[#fff]" />
                      </div>
                      <div className="modal-title text-sm mb-1">
                        {badge.name}
                      </div>
                      <div className="text-[#4f5262] text-xs mb-2">
                        {badge.description}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 color-primary-cl" />
                        <span className="color-primary-cl text-xs">
                          +{badge.rep} REP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="color-primary-cl mb-3 Fsize-18">Locked</h3>
                <div className="grid grid-cols-2 gap-3">
                  {lockedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="custom-card badge-box-shadow"
                    >
                      <div className="w-12 h-12 rounded-full lock-section flex items-center justify-center mb-3">
                        <Lock className="w-6 h-6 color-primary-cl" />
                      </div>
                      <div className="modal-title text-sm mb-1">
                        {badge.name}
                      </div>
                      <div className="text-[#4f5262] text-xs mb-2">
                        {badge.description}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 color-primary-cl" />
                        <span className="color-primary-cl text-xs">
                          +{badge.rep} REP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Badges;
