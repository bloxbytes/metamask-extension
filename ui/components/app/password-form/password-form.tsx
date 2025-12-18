import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Box,
  ButtonIcon,
  FormTextField,
  FormTextFieldSize,
  IconName,
  InputType,
  Text,
} from '../../component-library';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { PASSWORD_MIN_LENGTH } from '../../../helpers/constants/common';
import {
  TextColor,
  Display,
  FlexDirection,
  AlignItems,
  TextVariant,
} from '../../../helpers/constants/design-system';

type PasswordFormProps = {
  onChange: (password: string) => void;
  pwdInputTestId?: string;
  confirmPwdInputTestId?: string;
};

// TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
// eslint-disable-next-line @typescript-eslint/naming-convention
export default function PasswordForm({
  onChange,
  pwdInputTestId,
  confirmPwdInputTestId,
}: PasswordFormProps) {
  const t = useI18nContext();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [passwordLengthError, setPasswordLengthError] = useState(false);

  const handlePasswordChange = useCallback(
    (passwordInput: string) => {
      const confirmError =
        !confirmPassword || passwordInput === confirmPassword
          ? ''
          : t('passwordsDontMatch');

      setPassword(passwordInput);

      setConfirmPasswordError(confirmError);
      setPasswordLengthError(false);
    },
    [confirmPassword, t],
  );

  const handleConfirmPasswordChange = useCallback(
    (confirmPasswordInput: string) => {
      const error =
        password === confirmPasswordInput || confirmPasswordInput.length === 0
          ? ''
          : t('passwordsDontMatch');

      setConfirmPassword(confirmPasswordInput);
      setConfirmPasswordError(error);
    },
    [password, t],
  );

  useEffect(() => {
    if (
      password.length >= PASSWORD_MIN_LENGTH &&
      confirmPassword.length >= PASSWORD_MIN_LENGTH &&
      password === confirmPassword
    ) {
      onChange(password);
    } else {
      onChange('');
    }
  }, [password, confirmPassword, onChange]);

  const handlePasswordBlur = useCallback(() => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordLengthError(true);
    } else {
      setPasswordLengthError(false);
    }
  }, [password.length]);

  // Password requirements validation
  const passwordRequirements = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/u.test(password);
    const hasLowercase = /[a-z]/u.test(password);
    const hasNumber = /[0-9]/u.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/u.test(
      password,
    );

    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    };
  }, [password]);

  return (
    <Box className="password-form">
      <FormTextField
        label="Password"
        id="create-password-new"
        autoFocus
        autoComplete
        size={FormTextFieldSize.Lg}
        value={password}
        inputProps={{
          'data-testid': pwdInputTestId || 'create-password-new-input',
          type: showPassword ? InputType.Text : InputType.Password,
          placeholder: 'Enter your password',
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handlePasswordChange(e.target.value);
        }}
        helpTextProps={{
          color: TextColor.textAlternative,
          'data-testid': 'short-password-error',
        }}
        helpText="" // Hide error message - requirements list shows validation
        onBlur={handlePasswordBlur}
        error={false} // Don't show red border - requirements list handles validation
        endAccessory={
          <ButtonIcon
            iconName={showPassword ? IconName.EyeSlash : IconName.Eye}
            data-testid="show-password"
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setShowPassword(!showPassword);
            }}
            ariaLabel={
              showPassword ? t('passwordToggleHide') : t('passwordToggleShow')
            }
          />
        }
      />

      <FormTextField
        label="Confirm Password"
        id="create-password-confirm"
        autoComplete
        marginTop={4}
        size={FormTextFieldSize.Lg}
        error={false} // Don't show red border - requirements list handles validation
        helpTextProps={{
          'data-testid': 'confirm-password-error',
        }}
        helpText="" // Hide error message - requirements list shows validation
        value={confirmPassword}
        inputProps={{
          'data-testid':
            confirmPwdInputTestId || 'create-password-confirm-input',
          type: showConfirmPassword ? InputType.Text : InputType.Password,
          placeholder: 'Confirm your password',
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleConfirmPasswordChange(e.target.value);
        }}
        endAccessory={
          <ButtonIcon
            iconName={showConfirmPassword ? IconName.EyeSlash : IconName.Eye}
            data-testid="show-confirm-password"
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setShowConfirmPassword(!showConfirmPassword);
            }}
            ariaLabel={
              showConfirmPassword
                ? t('passwordToggleHide')
                : t('passwordToggleShow')
            }
          />
        }
      />

      {/* Password Requirements List */}
      <Box marginTop={4} className="password-form__requirements">
        <Text
          variant={TextVariant.bodySm}
          color={TextColor.textAlternative}
          marginBottom={3}
          className="password-form__requirements-title"
        >
          Password must contain:
        </Text>
        <Box
          display={Display.Flex}
          flexDirection={FlexDirection.Column}
          gap={2}
        >
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Row}
            alignItems={AlignItems.center}
            gap={2}
          >
            {passwordRequirements.hasMinLength ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="password-form__icon-checked"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="password-form__icon-unchecked"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
            <Text
              variant={TextVariant.bodySm}
              color={
                passwordRequirements.hasMinLength
                  ? TextColor.primaryDefault
                  : TextColor.textAlternative
              }
              className={
                passwordRequirements.hasMinLength
                  ? 'password-form__text-checked'
                  : 'password-form__text-unchecked'
              }
            >
              At least 8 characters
            </Text>
          </Box>
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Row}
            alignItems={AlignItems.center}
            gap={2}
          >
            {passwordRequirements.hasUppercase ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="password-form__icon-checked"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="password-form__icon-unchecked"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
            <Text
              variant={TextVariant.bodySm}
              color={
                passwordRequirements.hasUppercase
                  ? TextColor.primaryDefault
                  : TextColor.textAlternative
              }
              className={
                passwordRequirements.hasUppercase
                  ? 'password-form__text-checked'
                  : 'password-form__text-unchecked'
              }
            >
              Contains uppercase letter
            </Text>
          </Box>
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Row}
            alignItems={AlignItems.center}
            gap={2}
          >
            {passwordRequirements.hasLowercase ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="password-form__icon-checked"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="password-form__icon-unchecked"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
            <Text
              variant={TextVariant.bodySm}
              color={
                passwordRequirements.hasLowercase
                  ? TextColor.primaryDefault
                  : TextColor.textAlternative
              }
              className={
                passwordRequirements.hasLowercase
                  ? 'password-form__text-checked'
                  : 'password-form__text-unchecked'
              }
            >
              Contains lowercase letter
            </Text>
          </Box>
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Row}
            alignItems={AlignItems.center}
            gap={2}
          >
            {passwordRequirements.hasNumber ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="password-form__icon-checked"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="password-form__icon-unchecked"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
            <Text
              variant={TextVariant.bodySm}
              color={
                passwordRequirements.hasNumber
                  ? TextColor.primaryDefault
                  : TextColor.textAlternative
              }
              className={
                passwordRequirements.hasNumber
                  ? 'password-form__text-checked'
                  : 'password-form__text-unchecked'
              }
            >
              Contains number
            </Text>
          </Box>
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Row}
            alignItems={AlignItems.center}
            gap={2}
          >
            {passwordRequirements.hasSpecialChar ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="password-form__icon-checked"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="password-form__icon-unchecked"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
            <Text
              variant={TextVariant.bodySm}
              color={
                passwordRequirements.hasSpecialChar
                  ? TextColor.primaryDefault
                  : TextColor.textAlternative
              }
              className={
                passwordRequirements.hasSpecialChar
                  ? 'password-form__text-checked'
                  : 'password-form__text-unchecked'
              }
            >
              Contains special character
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
