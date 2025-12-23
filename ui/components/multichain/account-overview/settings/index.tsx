import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Text } from '../../../component-library';
import IconEye from '../../../ui/icon/icon-eye';
import SRPQuiz from '../../../app/srp-quiz-modal';
import VisitSupportDataConsentModal from '../../../app/modals/visit-support-data-consent-modal/visit-support-data-consent-modal';
import { openWindow } from '../../../../helpers/utils/window';
import { Bell, CloudBackup, Contact, SettingsIcon } from 'lucide-react';

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
  <svg className="text-primary-cl" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
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
      style={{ maxHeight: 'calc(100vh - 200px)'}}
    >
      <div className="fah-card">

        {/* Version Info */}
        <div className="mb-4">
          <Text variant="h5" className="mb-2">
            App Info
          </Text>
          <div className="settings-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 flex items-center justify-center shadow-lg">
                <span className="text-xl text-primary-cl">O</span>
              </div>
              <div>
                <div className="inner-count">OPN Wallet</div>
                <div className="inner-content-heading">Version 1.0.0</div>
              </div>
            </div>
          </div>
        </div>

        <div>
            <Text variant="label" className="mb-2 text-primary-cl">
              Basic Settings
            </Text>
            <div className="basic-setting-card">
              <button
                type="button"
                onClick={() => history.push('/settings/general')}
                className="w-full flex items-center justify-between p-4 transition-all border-b border-[#4105b6]/20 last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                    <SettingsIcon className="w-4 h-4 text-[#b0efff]"/>
                  </div>
                  <div className="text-left">
                    <span className="block text-color-white">General</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 icon-right-arrow" />
              </button>
               <button
                type="button"
                onClick={() => history.push('/settings/security-and-privacy/backup-and-sync')}
                className="w-full flex items-center justify-between p-4 transition-all border-b border-[#4105b6]/20 last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                    <CloudBackup className="w-4 h-4 text-[#b0efff]"/>
                  </div>
                  <div className="text-left">
                    <span className="block text-color-white">Backup & Sync</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 icon-right-arrow" />
              </button>
                <button
                type="button"
                onClick={() => history.push('/settings/contact-list')}
                className="w-full flex items-center justify-between p-4 transition-all border-b border-[#4105b6]/20 last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                    <Contact className="w-4 h-4 text-[#b0efff]"/>
                  </div>
                  <div className="text-left">
                    <span className="block text-color-white">Contacts</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 icon-right-arrow" />
              </button>
              <button
                type="button"
                onClick={() => history.push('/notifications/settings')}
                className="w-full flex items-center justify-between p-4 transition-all border-b border-[#4105b6]/20 last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                    <Bell className="w-4 h-4 text-[#b0efff]"/>
                  </div>
                  <div className="text-left">
                    <span className="block text-color-white">Notifications</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 icon-right-arrow" />
              </button>
            </div>
          </div>
<div className="mt-4"></div>
        {/* Settings Sections */}
        <div className="space-y-4">
          {settingsSections.map((section, idx) => (
            <div key={idx}>
              <Text variant="label" className="mb-2 text-[#b0efff]/70">
                {section.title}
              </Text>
              <div className="setting-card-bg">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => handleItemClick(item.action)}
                    className="w-full flex items-center justify-between p-4 transition-all last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5 border-b border-[#4105b6]/20"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                        {item.icon ? <item.icon className="w-4 h-4 text-primary-cl" /> : null}
                      </div>
                      <div className="text-left">
                        <span className="block text-color-white">{item.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && <span className="text-sm text-[#b0efff]/70">{item.value}</span>}
                      <ChevronRight className="w-4 h-4 icon-right-arrow" />
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
              <div className="setting-card-bg">

                  <button
                    key={'reveal-secret-phrase'}
                    onClick={() => setSrpQuizModalVisible(true)}
                    className="w-full flex items-center justify-between p-4 transition-all last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5 border-b border-[#4105b6]/20"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                        <IconEye className="w-4 h-4 text-primary-cl"/>
                      </div>
                      <div className="text-left">
                        <span className="block text-color-white">Reveal Secrete Phrase</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                     <span className="text-sm text-[#b0efff]/70"></span>
                      <ChevronRight className="w-4 h-4 icon-right-arrow" />
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
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="24" height="24" className="lucide lucide-circle-help w-4 h-4 text-primary-cl"><path d="M320 64C324.6 64 329.2 65 333.4 66.9L521.8 146.8C543.8 156.1 560.2 177.8 560.1 204C559.6 303.2 518.8 484.7 346.5 567.2C329.8 575.2 310.4 575.2 293.7 567.2C121.3 484.7 80.6 303.2 80.1 204C80 177.8 96.4 156.1 118.4 146.8L306.7 66.9C310.9 65 315.4 64 320 64zM320 130.8L320 508.9C458 442.1 495.1 294.1 496 205.5L320 130.9L320 130.9z"/></svg>
                      </div>
                      <div className="text-left">
                        <span className="block text-color-white">Security and Privacy Settings</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                     <span className="text-sm text-[#b0efff]/70"></span>
                      <ChevronRight className="w-4 h-4 icon-right-arrow" />
                    </div>
                  </button>

              </div>
            </div>

          <div>
            <Text variant="label" className="mb-2 text-[#b0efff]/70">
              About
            </Text>
            <div className="setting-card-bg">
              <button
                type="button"
                onClick={() => setSupportModalVisible(true)}
                className="w-full flex items-center justify-between p-4 transition-all border-b border-[#4105b6]/20 last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-help w-4 h-4 text-primary-cl"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
                  </div>
                  <div className="text-left">
                    <span className="block text-color-white">Help &amp; Support</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 icon-right-arrow" />
              </button>
              <button
                type="button"
                onClick={() => openWindow('https://iopn.io/support.html')}
                className="w-full flex items-center justify-between p-4 transition-all border-b border-[#4105b6]/20 last:border-0 group hover:border-l-2 hover:border-l-[#4105b6] hover:pl-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4105b6]/30 to-[#6305b6]/30 group-hover:from-[#4105b6]/50 group-hover:to-[#6305b6]/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text w-4 h-4 text-primary-cl"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                  </div>
                  <div className="text-left">
                    <span className="block text-color-white">Terms &amp; Privacy</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 icon-right-arrow" />
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
          className="lock-wallet-button"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-red-400">Lock Wallet</span>
        </button>
      </div>
    </Box>
  );
}
