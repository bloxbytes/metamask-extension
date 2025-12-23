import React, { useCallback } from 'react';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import { ThemeType } from '../../../../shared/constants/preferences';
import { setTheme } from '../../../store/actions';
import { setTheme as setDocumentTheme } from '../../../pages/routes/utils';
import { useTheme } from '../../../hooks/useTheme';

export type ThemeToggleButtonsProps = {
  className?: string;
};

export const ThemeToggleButtons = ({
  className,
}: ThemeToggleButtonsProps) => {
  const dispatch = useDispatch();
  const resolvedTheme = useTheme();
  const isDarkMode = resolvedTheme === ThemeType.dark;

  const handleToggleTheme = useCallback(() => {
    const nextTheme = isDarkMode ? ThemeType.light : ThemeType.dark;
    setDocumentTheme(nextTheme);
    dispatch(setTheme(nextTheme));
  }, [dispatch, isDarkMode]);

  return (
    <div className={classnames('fixed top-6 right-6 z-50', className)}>
      {isDarkMode ? (
        <button
          type="button"
          className="p-2.5 rounded-xl transition-all bg-[#1d2449] hover:bg-[#4105b6] text-[#b0efff]"
          onClick={handleToggleTheme}
          aria-label="Use light theme"
          aria-pressed
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-sun w-5 h-5"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          className="p-2.5 rounded-xl transition-all bg-white hover:bg-gray-100 text-gray-700 border-2 border-[#3d00b51c]"
          onClick={handleToggleTheme}
          aria-label="Use dark theme"
          aria-pressed={false}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-moon w-5 h-5"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ThemeToggleButtons;
