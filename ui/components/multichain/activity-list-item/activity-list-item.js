import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  AlignItems,
  BackgroundColor,
  BlockSize,
  Display,
  FlexDirection,
  FlexWrap,
  FontWeight,
  JustifyContent,
  TextAlign,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { Box, Text } from '../../component-library';
import { ArrowUpRight, ArrowDownLeft, Repeat } from 'lucide-react';


const getIcon = (type = null) => {
  switch (type) {
    case 'send':
      return ArrowUpRight;
    case 'receive':
      return ArrowDownLeft;
    case 'swap':
      return Repeat;
    default:
      return ArrowUpRight;
  }
};

const getIconBg = (type = null) => {
  switch (type) {
    case 'send':
      return '#4105b6';
    case 'receive':
      return '#2280cd';
    case 'swap':
      return '#6305b6';
    default:
      return '#4105b6';
  }
};

export const ActivityListItem = ({
                                   topContent,
                                   icon,
                                   title,
                                   subtitle,
                                   midContent,
                                   children,
                                   rightContent,
                                   onClick,
                                   className,
                                   'data-testid': dataTestId,
                                 }) => {
  const primaryClassName = classnames('activity-list-item', className, {
    'activity-list-item--single-content-row': !(subtitle || children),
  });

  console.log(icon, 'icon selected is ');

  const IconLocal = getIcon(icon);

  return (
    // <Box
    //   tabIndex={0}
    //   className={primaryClassName}
    //   onClick={onClick}
    //   onKeyPress={(event) => {
    //     if (event.key === 'Enter') {
    //       onClick();
    //     }
    //   }}
    //   data-testid={dataTestId}
    //   paddingInline={4}
    //   paddingTop={3}
    //   paddingBottom={3}
    //   // display={Display.Flex}
    //   width={BlockSize.Full}
    //   flexWrap={FlexWrap.Wrap}
    //   gap={4}
    // >
    //    {/*{topContent && (*/ }
    //   {/*  <Text*/
    //   }
    //   {/*    variant={TextVariant.bodyMdMedium}*/
    //   }
    //   {/*    color={TextColor.textDefault}*/
    //   }
    //   {/*    display={Display.Flex}*/
    //   }
    //   {/*    width={BlockSize.Full}*/
    //   }
    //   {/*  >*/
    //   }
    //   {/*    {topContent}*/
    //   }
    //   {/*  </Text>*/
    //   }
    //   {/*)}*/
    //   }
    //
    //   {/*<TransactionItem />*/
    //   }

    <div
      onClick={onClick}
      onKeyPress={(event) => {
        if (event.key === 'Enter') {
          onClick();
        }
      }}
      className={`${title}-activity-block bg-gradient-to-br from-[#1a1d3a]/60 to-[#1a1d3a]/40 backdrop-blur-sm rounded-xl p-3 hover:from-[#20245a]/60 hover:to-[#20245a]/40 transition-all cursor-pointer border border-[#4105b6]/30 shadow-lg relative ml-10 group mb-4 home-card-2`}>
      <div
        className="absolute -left-[49px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg relative z-10"
        style={{
          background: 'linear-gradient(135deg, rgb(34, 128, 205), rgba(34, 128, 205, 0.867)); box-shadow: rgba(34, 128, 205, 0.25) 0px 4px 12px',
        }}>
        <div className="absolute inset-0 rounded-full blur-md opacity-50"
             style={{
               backgroundColor: 'rgb(34, 128, 205)',
             }}></div>

        {icon}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="level-heading">{title}</div>

            {topContent ? (
              <div className="rep-score">
                <Text className={"Fsize-12 rep-score"}>{topContent}</Text>
              </div>
            ) : null}

            <div className={'activity-item-status'}>
              {typeof subtitle === 'string' && subtitle.toLowerCase() === 'confirmed' ?
                <div
                  className="flex items-center gap-1 px-2 py-1 bg-[#b0efff]/10 rounded-full border border-[#b0efff]/30">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#b0efff] shadow-sm shadow-[#b0efff]/50 animate-pulse"></span><span
                  className="text-[#b0efff]">Confirmed</span></div> : subtitle}

            </div>

          </div>
        </div>
        <div className="text-right">
          {rightContent}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             className="lucide lucide-external-link w-3 h-3 text-[#b0efff]/70 hover:text-[#b0efff] transition-colors ml-auto">
          <path d="M15 3h6v6"></path>
          <path d="M10 14 21 3"></path>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        </svg>
      </div>
    </div>


    // </Box>
    //  {/*<Box*/
    //   }
    //   {/*  display={Display.Flex}*/
    //   }
    //   {/*  width={BlockSize.Full}*/
    //   }
    //   {/*  flexDirection={FlexDirection.Row}*/
    //   }
    //   {/*  gap={4}*/
    //   }
    //   {/*>*/
    //   }
    //   {/*  {icon && (*/
    //   }
    //   {/*    <Box*/
    //   }
    //   {/*      display={Display.InlineFlex}*/
    //   }
    //   {/*      className="activity-list-item__icon"*/
    //   }
    //   {/*    >*/
    //   }
    //   {/*      {icon}*/
    //   }
    //   {/*    </Box>*/
    //   }
    //   {/*  )}*/
    //   }
    //   {/*  <Box*/
    //   }
    //   {/*    display={Display.InlineFlex}*/
    //   }
    //   {/*    width={BlockSize.Full}*/
    //   }
    //   {/*    justifyContent={JustifyContent.spaceBetween}*/
    //   }
    //   {/*    className="activity-list-item__content-container"*/
    //   }
    //   {/*  >*/
    //   }
    //   {/*    <Box*/
    //   }
    //   {/*      display={Display.InlineFlex}*/
    //   }
    //   {/*      flexDirection={FlexDirection.Column}*/
    //   }
    //   {/*      className="activity-list-item__detail-container"*/
    //   }
    //   {/*      minWidth="0"*/
    //   }
    //   {/*    >*/
    //   }
    //   {/*      <Box*/
    //   }
    //   {/*        display={Display.Flex}*/
    //   }
    //   {/*        flexDirection={FlexDirection.Row}*/
    //   }
    //   {/*        alignItems={AlignItems.center}*/
    //   }
    //   {/*      >*/
    //   }
    //   {/*        <Text*/
    //   }
    //   {/*          ellipsis*/
    //   }
    //   {/*          textAlign={TextAlign.Left}*/
    //   }
    //   {/*          variant={TextVariant.bodyMdMedium}*/
    //   }
    //   {/*          fontWeight={FontWeight.Medium}*/
    //   }
    //   {/*          data-testid="activity-list-item-action"*/
    //   }
    //   {/*        >*/
    //   }
    //   {/*          {title}*/
    //   }
    //   {/*        </Text>*/
    //   }
    //   {/*      </Box>*/
    //   }
    //   {/*      {subtitle && (*/
    //   }
    //   {/*        <Text*/
    //   }
    //   {/*          as="div"*/
    //   }
    //   {/*          ellipsis*/
    //   }
    //   {/*          textAlign={TextAlign.Left}*/
    //   }
    //   {/*          variant={TextVariant.bodySmMedium}*/
    //   }
    //   {/*        >*/
    //   }
    //   {/*          {subtitle}*/
    //   }
    //   {/*        </Text>*/
    //   }
    //   {/*      )}*/
    //   }
    //   {/*      {children && (*/
    //   }
    //   {/*        <Box className="activity-list-item__children">{children}</Box>*/
    //   }
    //   {/*      )}*/
    //   }
    //   {/*    </Box>*/
    //   }
    //
    //   {/*    {midContent && (*/
    //   }
    //   {/*      <Box*/
    //   }
    //   {/*        display={Display.InlineFlex}*/
    //   }
    //   {/*        className="activity-list-item__mid-content"*/
    //   }
    //   {/*      >*/
    //   }
    //   {/*        {midContent}*/
    //   }
    //   {/*      </Box>*/
    //   }
    //   {/*    )}*/
    //   }
    //   {/*    {rightContent && (*/
    //   }
    //   {/*      <Box*/
    //   }
    //   {/*        display={Display.InlineFlex}*/
    //   }
    //   {/*        height={BlockSize.Min}*/
    //   }
    //   {/*        flexDirection={FlexDirection.Column}*/
    //   }
    //   {/*        alignItems={AlignItems.flexEnd}*/
    //   }
    //   {/*        className="activity-list-item__right-content"*/
    //   }
    //   {/*      >*/
    //   }
    //   {/*        {rightContent}*/
    //   }
    //   {/*      </Box>*/
    //   }
    //   {/*    )}*/
    //   }
    //   {/*  </Box>*/
    //   }
    //   {/*</Box>*/
    //   }
  );
};

ActivityListItem.propTypes = {
  /**
   * Top content for the activity
   */
  topContent: PropTypes.node,
  /**
   * Icon which represents the activity
   */
  icon: PropTypes.node,
  /**
   * Title text
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Additional text detail
   */
  subtitle: PropTypes.node,
  /**
   * Middle content
   */
  midContent: PropTypes.node,
  /**
   * Additional variable contents
   */
  children: PropTypes.node,
  /**
   * Right-most content
   */
  rightContent: PropTypes.node,
  /**
   * Executes upon click of the activity
   */
  onClick: PropTypes.func,
  /**
   * Additional classname for this component
   */
  className: PropTypes.string,
  /**
   * Test ID for this component
   */
  'data-testid': PropTypes.string,
};
