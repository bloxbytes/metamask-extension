import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Text } from '../../../component-library';
import IconEye from '../../../ui/icon/icon-eye';
import SRPQuiz from '../../../app/srp-quiz-modal';
import VisitSupportDataConsentModal from '../../../app/modals/visit-support-data-consent-modal/visit-support-data-consent-modal';
import { openWindow } from '../../../../helpers/utils/window';

type SettingsItem = {
  label: string;
  value?: string;
  action?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};

const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LogOut: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const sampleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const settingsSections: { title: string; items: SettingsItem[] }[] = [
  {
    title: 'Preferences',
    items: [
      { label: 'Network settings', action: '/settings/networks', icon: sampleIcon },
    ],
  },
];

export default function SettingsTab(): JSX.Element {
  const history = useHistory();
  const [srpQuizModalVisible, setSrpQuizModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);

  const handleItemClick = (action?: string) => {
    if (!action) return;
    history.push(action);
  };

  const handleLock = () => {
    // keep behavior minimal here; replace with real lock action in controller wiring
    history.push('/unlock'); // placeholder navigation
  };

  return (
    <Box
      padding={4}
      style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
    >
      <div className="px-4 pb-4 pt-4 ">

        {/* Version Info */}
        <div className="mb-4">
          <Text variant="h5" className="mb-2">
            App Info
          </Text>
          <div className="backdrop-blur-sm rounded-xl p-4 shadow-lg bg-gradient-to-br from-[#1a1d3a]/60 to-[#1a1d3a]/40 border border-[#4105b6]/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 flex items-center justify-center shadow-lg">
                <span className="text-[#b0efff] text-xl">O</span>
              </div>
              <div>
                <div className="text-[#f8fdf1]">OPN Wallet</div>
                <div className="text-sm text-[#b0efff]/70">Version 1.0.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {settingsSections.map((section, idx) => (
            <div key={idx}>
              <Text variant="label" className="mb-2 text-[#b0efff]/70">
                {section.title}
              </Text>
              <div className="backdrop-blur-sm rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#1a1d3a]/60 to-[#1a1d3a]/40 border border-[#4105b6]/30">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => handleItemClick(item.action)}
                    className="w-full flex items-center justify-between p-4 transition-all last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5 border-b border-[#4105b6]/20"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                        {item.icon ? <item.icon className="w-4 h-4 text-[#b0efff]" /> : null}
                      </div>
                      <div className="text-left">
                        <span className="block text-[#f8fdf1]">{item.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && <span className="text-sm text-[#b0efff]/70">{item.value}</span>}
                      <ChevronRight className="w-4 h-4 text-[#b0efff]/70" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div key={'SnP'}>
              <Text variant="label" className="mb-2 text-[#b0efff]/70">
                Security & Privacy
              </Text>
              <div className="backdrop-blur-sm rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#1a1d3a]/60 to-[#1a1d3a]/40 border border-[#4105b6]/30">

                  <button
                    key={'reveal-secret-phrase'}
                    onClick={() => setSrpQuizModalVisible(true)}
                    className="w-full flex items-center justify-between p-4 transition-all last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5 border-b border-[#4105b6]/20"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                        <IconEye className="w-4 h-4 text-[#b0efff]/70"/>
                      </div>
                      <div className="text-left">
                        <span className="block text-[#f8fdf1]">Reveal Secrete Phrase</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                     <span className="text-sm text-[#b0efff]/70"></span>
                      <ChevronRight className="w-4 h-4 text-[#b0efff]/70" />
                    </div>
                  </button>

                   <button
                    key={'reveal-secret-phrase'}
                    onClick={() => history.push('/settings/security')}
                    className="w-full flex items-center justify-between p-4 transition-all last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5 border-b border-[#4105b6]/20"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                        <IconEye className="w-4 h-4 text-[#b0efff]/70"/>
                      </div>
                      <div className="text-left">
                        <span className="block text-[#f8fdf1]">Security and Privacy Settings</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                     <span className="text-sm text-[#b0efff]/70"></span>
                      <ChevronRight className="w-4 h-4 text-[#b0efff]/70" />
                    </div>
                  </button>

              </div>
            </div>

          <div>
            <Text variant="label" className="mb-2 text-[#b0efff]/70">
              About
            </Text>
            <div className="backdrop-blur-sm rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#1a1d3a]/60 to-[#1a1d3a]/40 border border-[#4105b6]/30">
              <button
                type="button"
                onClick={() => setSupportModalVisible(true)}
                className="w-full flex items-center justify-between p-4 transition-all border-b border-[#4105b6]/20 last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                    <span className="text-[#b0efff] text-sm">?</span>
                  </div>
                  <div className="text-left">
                    <span className="block text-[#f8fdf1]">Help &amp; Support</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#b0efff]/70" />
              </button>
              <button
                type="button"
                onClick={() => openWindow('https://iopn.io/support.html')}
                className="w-full flex items-center justify-between p-4 transition-all border-b border-[#4105b6]/20 last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                    <span className="text-[#b0efff] text-sm">ℹ</span>
                  </div>
                  <div className="text-left">
                    <span className="block text-[#f8fdf1]">Terms &amp; Privacy</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#b0efff]/70" />
              </button>
            </div>
          </div>
        </div>

        {srpQuizModalVisible ? (
          <SRPQuiz
            isOpen={srpQuizModalVisible}
            onClose={() => setSrpQuizModalVisible(false)}
            closeAfterCompleting
          />
        ) : null}

        {supportModalVisible ? (
          <VisitSupportDataConsentModal
            isOpen={supportModalVisible}
            onClose={() => setSupportModalVisible(false)}
          />
        ) : null}

        {/* Lock Wallet Button */}
        <button
          type="button"
          onClick={handleLock}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl transition-all shadow-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-400/30"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-red-400">Lock Wallet</span>
        </button>
      </div>
    </Box>
  );
}
