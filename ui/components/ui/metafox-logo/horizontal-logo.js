/* eslint-disable @metamask/design-tokens/color-no-hex*/
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeType } from '../../../../shared/constants/preferences';

const LOGO_WIDTH = 162;
const LOGO_HEIGHT = 30;

export default function MetaFoxHorizontalLogo({
  theme: themeProps,
  className,
}) {
  const [theme, setTheme] = useState(() =>
    themeProps === undefined
      ? document.documentElement.getAttribute('data-theme')
      : themeProps,
  );

  const fill = theme === ThemeType.dark ? 'rgb(255,255,255)' : 'rgb(22,22,22)';

  useEffect(() => {
    let newTheme = themeProps;
    if (newTheme === undefined) {
      newTheme = document.documentElement.getAttribute('data-theme');
    }
    setTheme(newTheme);
  }, [themeProps, setTheme]);

  return (
    <svg
      height={LOGO_HEIGHT}
      width={LOGO_WIDTH}
      viewBox="0 0 696 344"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M256.627 174.431C198.748 174.431 151.843 221.357 151.843 279.215V384H186.771V279.215C186.771 240.629 218.041 209.359 256.627 209.359C295.213 209.359 326.483 240.629 326.483 279.215V384H361.411V279.215C361.411 221.336 314.485 174.431 256.627 174.431Z"
        fill={fill}
      />
    </svg>
  );
}

MetaFoxHorizontalLogo.propTypes = {
  theme: PropTypes.oneOf([ThemeType.light, ThemeType.dark, ThemeType.os]),
  className: PropTypes.string,
};
