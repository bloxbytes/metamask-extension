import React from 'react';
import {
  Box,
  Button,
  ButtonSize,
  ButtonVariant,
  Modal,
  ModalBody,
  ModalContent,
  ModalContentSize,
  ModalHeader,
  ModalOverlay,
  Text,
} from '../../../components/component-library';
import {
  FontWeight,
  TextVariant,
} from '../../../helpers/constants/design-system';

type TermsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="welcome-legal-modal"
      data-testid="terms-of-use-modal"
    >
      <ModalOverlay />
      <ModalContent
        size={ModalContentSize.Md}
        modalDialogProps={{
          className: 'welcome-legal-modal__dialog',
        }}
      >
        <ModalHeader onClose={onClose}>
          <Text variant={TextVariant.headingMd} fontWeight={FontWeight.Bold}>
            OPN Wallet Terms of Use
          </Text>
        </ModalHeader>
        <ModalBody className="welcome-legal-modal__body">
          <Text
            variant={TextVariant.bodySm}
            className="welcome-legal-modal__muted"
          >
            Last Updated: December 8, 2025
          </Text>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              1. Acceptance of Terms
            </Text>
            <Text variant={TextVariant.bodyMd}>
              By accessing and using OPN Wallet, you agree to these Terms of Use.
              If you do not agree to these terms, please discontinue using the
              wallet.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              2. Description of Service
            </Text>
            <Text variant={TextVariant.bodyMd}>
              OPN Wallet is a non-custodial cryptocurrency wallet that lets you
              store, send, receive, and manage digital assets across supported
              networks, NFTs, and reputation features.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              3. User Responsibilities
            </Text>
            <Text variant={TextVariant.bodyMd}>
              You are responsible for the security and accuracy of everything
              done from your account, including:
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>Protecting your password and secret recovery phrase</li>
              <li>All actions taken with your wallet</li>
              <li>Providing accurate information</li>
              <li>Complying with applicable laws and regulations</li>
              <li>Backing up your secret recovery phrase securely</li>
            </ul>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              4. Security and Private Keys
            </Text>
            <Text variant={TextVariant.bodyMd}>
              OPN Wallet is non-custodial. Only you control your private keys and
              recovery phrase. We do not store, access, or recover your keys. If
              you lose your recovery phrase, access to your wallet and assets is
              permanently lost.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              5. Prohibited Activities
            </Text>
            <Text variant={TextVariant.bodyMd}>
              You agree not to:
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>Use OPN Wallet for illegal activities</li>
              <li>Attempt unauthorized access to other accounts</li>
              <li>Interfere with or disrupt services or servers</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Engage in activity that could harm OPN Wallet or users</li>
            </ul>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              6. Disclaimers
            </Text>
            <Text variant={TextVariant.bodyMd}>
              OPN Wallet is provided &quot;as is&quot; without warranties. We do
              not guarantee:
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy or reliability of information obtained</li>
              <li>Security of the blockchain networks you use</li>
              <li>Protection against loss or theft of digital assets</li>
            </ul>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              7. Limitation of Liability
            </Text>
            <Text variant={TextVariant.bodyMd}>
              OPN Wallet and its developers are not liable for direct, indirect,
              incidental, special, consequential, or exemplary damages from your
              use of the service, including loss of profits, data, or assets.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              8. Transaction Fees
            </Text>
            <Text variant={TextVariant.bodyMd}>
              You are responsible for all network fees (gas fees) tied to your
              blockchain transactions. These fees go to network validators, not
              OPN Wallet.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              9. Updates and Modifications
            </Text>
            <Text variant={TextVariant.bodyMd}>
              We may update these Terms of Use at any time. Continued use of OPN
              Wallet after changes means you accept the updated terms.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              10. Termination
            </Text>
            <Text variant={TextVariant.bodyMd}>
              You may stop using OPN Wallet at any time. We may suspend or end
              access for violations of these terms or at our discretion.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              11. Contact Information
            </Text>
            <Text variant={TextVariant.bodyMd}>
              For questions about these Terms of Use, contact support@iopn.io.
            </Text>
          </Box>
        </ModalBody>

        <Box paddingLeft={4} paddingRight={4} paddingTop={2} paddingBottom={4}>
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Lg}
            block
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
}
