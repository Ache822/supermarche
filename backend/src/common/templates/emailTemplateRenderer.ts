import React from 'react';
import { render } from '@react-email/render';
import { SupermarcheEmailTemplate, SupermarcheEmailTemplateProps } from './SupermarcheEmailTemplate';

/**
 * Render any Supermarche HTML email (Campaigns, Application Notices, Support Updates, etc.)
 */
export const renderSupermarcheEmailHtml = async (props: SupermarcheEmailTemplateProps): Promise<string> => {
  const element = React.createElement(SupermarcheEmailTemplate, props);
  return await render(element, { pretty: true });
};
