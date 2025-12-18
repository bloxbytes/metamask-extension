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

type PrivacyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="welcome-legal-modal"
      data-testid="privacy-notice-modal"
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
            OPN Wallet Privacy Notice
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
              1. Introduction
            </Text>
            <Text variant={TextVariant.bodyMd}>
              We are committed to protecting your privacy. This Privacy Notice
              explains how we collect, use, and safeguard your information when
              you use our non-custodial wallet service.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              2. Information We Collect
            </Text>
            <Text variant={TextVariant.bodyMd} fontWeight={FontWeight.Medium}>
              2.1 Information You Provide
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>Wallet addresses and public keys (stored locally)</li>
              <li>Transaction history (stored locally)</li>
              <li>Preferences and settings</li>
              <li>Feedback and support communications</li>
            </ul>

            <Text
              variant={TextVariant.bodyMd}
              fontWeight={FontWeight.Medium}
              marginTop={4}
            >
              2.2 Automatically Collected Information
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (features used, frequency of use)</li>
              <li>Error logs and performance data</li>
            </ul>

            <Text
              variant={TextVariant.bodyMd}
              fontWeight={FontWeight.Medium}
              marginTop={4}
            >
              2.3 Information We Do NOT Collect
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>Private keys or secret recovery phrases</li>
              <li>Your password</li>
              <li>Personal identification data (unless you contact support)</li>
              <li>Financial or banking information</li>
            </ul>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              3. How We Use Your Information
            </Text>
            <Text variant={TextVariant.bodyMd}>
              We use collected information to:
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>Provide and maintain the OPN Wallet service</li>
              <li>Improve user experience and functionality</li>
              <li>Diagnose and fix technical issues</li>
              <li>Respond to user support requests</li>
              <li>Send important service updates and security alerts</li>
              <li>Analyze usage patterns to improve the service</li>
            </ul>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              4. Data Storage and Security
            </Text>
            <Text variant={TextVariant.bodyMd}>
              OPN Wallet is non-custodial, which means:
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>Private keys and recovery phrases stay only on your device</li>
              <li>We have no access to your private keys or funds</li>
              <li>Your transaction history is stored locally on your device</li>
              <li>We cannot recover your wallet if you lose your recovery phrase</li>
              <li>All sensitive data on your device is encrypted</li>
            </ul>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              5. Third-Party Services
            </Text>
            <Text variant={TextVariant.bodyMd}>
              OPN Wallet may interact with third-party services:
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>Blockchain networks (Ethereum, OPN Testnet, etc.)</li>
              <li>Token price data providers</li>
              <li>NFT metadata providers</li>
              <li>Analytics services (anonymized data only)</li>
            </ul>
            <Text variant={TextVariant.bodyMd} marginTop={2}>
              These services have their own privacy policies, which we recommend
              reviewing.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              6. Blockchain Transparency
            </Text>
            <Text variant={TextVariant.bodyMd}>
              Blockchain transactions are public and permanent. Once a
              transaction is on-chain, it cannot be deleted or modified. Wallet
              addresses and transaction history may be visible to anyone on the
              network.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              7. Data Sharing and Disclosure
            </Text>
            <Text variant={TextVariant.bodyMd}>
              We do not sell, trade, or rent personal information. We may share
              data only:
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or court orders</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>During a merger, acquisition, or sale of assets</li>
            </ul>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              8. Your Rights and Choices
            </Text>
            <Text variant={TextVariant.bodyMd}>
              You have the right to:
            </Text>
            <ul className="welcome-legal-modal__list">
              <li>Access your locally stored data</li>
              <li>Delete your wallet and related data from your device</li>
              <li>Opt out of optional data collection features</li>
              <li>Export your data</li>
              <li>Request information about data we may have collected</li>
            </ul>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              9. Children&apos;s Privacy
            </Text>
            <Text variant={TextVariant.bodyMd}>
              OPN Wallet is not intended for users under 18. We do not knowingly
              collect personal information from children. Contact us if you
              believe information was collected from a child.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              10. International Users
            </Text>
            <Text variant={TextVariant.bodyMd}>
              OPN Wallet is available globally. If you access the service from a
              different country, your information may be transferred to, stored
              in, and processed in other jurisdictions.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              11. Updates to This Privacy Notice
            </Text>
            <Text variant={TextVariant.bodyMd}>
              We may update this Privacy Notice periodically. We will share
              material changes in the app and update the &quot;Last Updated&quot;
              date. Continued use after updates means you accept the changes.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__section">
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              12. Contact Us
            </Text>
            <Text variant={TextVariant.bodyMd}>
              For questions about this Privacy Notice or our practices, reach us
              at support@iopn.io.
            </Text>
          </Box>

          <Box className="welcome-legal-modal__callout" marginTop={4}>
            <Text
              variant={TextVariant.headingSm}
              className="welcome-legal-modal__section-title"
            >
              Security Reminder
            </Text>
            <Text variant={TextVariant.bodyMd}>
              OPN Wallet will never ask for your secret recovery phrase, private
              keys, or password. If anyone claims to be from OPN Wallet and asks
              for this information, it is a scam.
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
