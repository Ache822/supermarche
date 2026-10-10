import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Heading,
  Text,
  Button,
  Link
} from '@react-email/components';

export interface SupermarcheEmailTemplateProps {
  title: string;
  body: string;
  recipientName?: string;
  badgeText?: string;
  subHeaderBadge?: string;
  highlightBoxText?: string;
  ctaText?: string;
  ctaUrl?: string;
  unsubscribeUrl?: string;
  privacyUrl?: string;
  logoUrl?: string;
}

export const SupermarcheEmailTemplate: React.FC<SupermarcheEmailTemplateProps> = ({
  title,
  body,
  recipientName,
  badgeText = 'Official Announcement',
  subHeaderBadge = 'On-Demand Services',
  highlightBoxText,
  ctaText = 'Open Supermarche App',
  ctaUrl,
  unsubscribeUrl = 'https://supermarche.cm/unsubscribe',
  privacyUrl = 'https://supermarche.cm/privacy',
  logoUrl
}) => {
  const logoSrc = logoUrl || 'cid:supermarche_logo';
  const greetingText = recipientName ? `Hello ${recipientName},` : 'Hello,';

  const sanitizeOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'span', 'blockquote', 'div'],
    ALLOWED_ATTR: ['href', 'target', 'style', 'class']
  };

  const sanitizedBody = DOMPurify.sanitize(body || '', sanitizeOptions);
  const sanitizedCallout = highlightBoxText
    ? DOMPurify.sanitize(`<strong> Notice / Tip:</strong> ${highlightBoxText}`, sanitizeOptions)
    : '';

  return (
    <Html lang="en">
      <Head>
        <title>{title}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@600;700&family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          /* Mobile Responsive Optimization Rules */
          @media only screen and (max-width: 620px) {
            .email-container {
              width: 100% !important;
              max-width: 100% !important;
              border-radius: 0px !important;
            }
            .header-section {
              padding: 20px 16px 16px 16px !important;
              text-align: center !important;
            }
            .header-col {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
              box-sizing: border-box !important;
              text-align: center !important;
              padding: 4px 0 !important;
            }
            .logo-link {
              display: block !important;
              text-align: center !important;
              margin: 0 auto !important;
            }
            .logo-img {
              margin: 0 auto !important;
              max-width: 190px !important;
              height: auto !important;
            }
            .badge-text {
              white-space: nowrap !important;
              display: inline-block !important;
              font-size: 10px !important;
              padding: 4px 10px !important;
              margin: 6px auto 0 auto !important;
            }
            .hero-banner {
              padding: 20px 18px !important;
            }
            .main-heading {
              font-size: 19px !important;
              line-height: 1.35 !important;
              word-break: break-word !important;
            }
            .content-section {
              padding: 24px 18px !important;
            }
            .cta-button-container {
              width: 100% !important;
              display: block !important;
            }
            .cta-button {
              display: block !important;
              width: 100% !important;
              box-sizing: border-box !important;
              text-align: center !important;
              padding-left: 12px !important;
              padding-right: 12px !important;
            }
          }
        `}</style>
      </Head>

      <Body style={mainBodyStyle}>
        <Container style={containerStyle} className="email-container">
          
          {/* Header Bar with Official Supermarche Logo */}
          <Section style={headerSectionStyle} className="header-section">
            <Row style={{ width: '100%' }}>
              <Column align="left" style={{ width: '50%' }} className="header-col">
                <Link href="https://supermarche.cm" target="_blank" className="logo-link" style={{ display: 'inline-block' }}>
                  <Img
                    src={logoSrc}
                    alt="Supermarche Logo"
                    width="240"
                    style={logoImageStyle}
                    className="logo-img"
                  />
                </Link>
              </Column>
              <Column align="right" style={{ width: '50%' }} className="header-col">
                <Text style={badgeStyle} className="badge-text">{subHeaderBadge}</Text>
              </Column>
            </Row>
          </Section>

          {/* Banner / Hero Title Section */}
          <Section style={heroBannerStyle} className="hero-banner">
            <Text style={announcementTagStyle}>{badgeText}</Text>
            <Heading as="h1" style={mainHeadingStyle} className="main-heading">
              {title}
            </Heading>
          </Section>

          {/* Main Content Area */}
          <Section style={contentSectionStyle} className="content-section">
            
            {/* Recipient Greeting */}
            <Text style={greetingStyle}>
              {greetingText}
            </Text>

            {/* Main Body Text Content (HTML Rendered Safely) */}
            <div
              style={bodyTextStyle}
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />

            {/* Callout Box (Optional Highlights / Tips with HTML support) */}
            {highlightBoxText && (
              <Section style={calloutBoxStyle}>
                <div
                  style={calloutTextStyle}
                  dangerouslySetInnerHTML={{ __html: sanitizedCallout }}
                />
              </Section>
            )}

            {/* High-Converting Responsive CTA Button (Rendered only if ctaUrl is provided) */}
            {ctaUrl && (
              <Section style={buttonSectionStyle} className="cta-button-container">
                <Button href={ctaUrl} style={buttonStyle} className="cta-button">
                  {ctaText} &nbsp;&rarr;
                </Button>
              </Section>
            )}

            {/* Support Callout */}
            <Text style={supportTextStyle}>
              Need help or have questions? Reach out to our 24/7 support team via our{' '}
              <Link href="https://supermarche.cm/help" style={linkStyle}>
                Help Center
              </Link>{' '}
              or WhatsApp.
            </Text>
          </Section>

          {/* Footer & Compliance Section */}
          <Section style={footerSectionStyle}>
            <Text style={companyNameStyle}>
              Supermarche Services Ltd.
            </Text>
            <Text style={companyAddressStyle}>
              Douala, Cameroon
            </Text>
            <Text style={footerDisclaimerStyle}>
              You are receiving this official update because your email address is registered with Supermarche.
            </Text>
            <Text style={footerLinksStyle}>
              <Link href={unsubscribeUrl} style={footerLinkStyle}>
                Unsubscribe
              </Link>
              &nbsp;&bull;&nbsp;
              <Link href={privacyUrl} style={footerPrivacyLinkStyle}>
                Privacy Policy
              </Link>
            </Text>
          </Section>

        </Container>

        {/* Sub-Footer Tagline */}
        <Text style={subFooterStyle}>
          Supermarche Express • Cameroon’s On-Demand Service & Express Delivery Network
        </Text>
      </Body>
    </Html>
  );
};

// React Email Style Definitions (CAMPAIGN_EMAIL_TEMPLATE_SPEC.md Compliant)
const mainBodyStyle: React.CSSProperties = {
  backgroundColor: '#F1F5F9',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: '0',
  padding: '32px 12px'
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '600px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06)',
  border: '1px solid #E2E8F0',
  borderTop: '5px solid #3AAF49',
  margin: '0 auto'
};

const headerSectionStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '24px 30px',
  borderBottom: '1px solid #F0F7F1'
};

const logoImageStyle: React.CSSProperties = {
  display: 'block',
  maxWidth: '100%',
  height: 'auto',
  border: '0',
  outline: 'none'
};

const badgeStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '11px',
  fontWeight: 700,
  color: '#2F8F3C',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  backgroundColor: '#EAF7EC',
  padding: '6px 14px',
  borderRadius: '20px',
  display: 'inline-block',
  border: '1px solid #D2EFD7',
  whiteSpace: 'nowrap',
  margin: 0
};

const heroBannerStyle: React.CSSProperties = {
  backgroundColor: '#F8FAFC',
  padding: '24px 36px',
  borderBottom: '1px solid #E2E8F0'
};

const announcementTagStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#E8F7EA',
  color: '#2F8F3C',
  fontSize: '11px',
  fontWeight: 700,
  padding: '4px 12px',
  borderRadius: '20px',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  margin: '0 0 8px 0'
};

const mainHeadingStyle: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
  fontSize: '22px',
  fontWeight: 800,
  color: '#0F172A',
  lineHeight: '1.3',
  margin: '6px 0 0 0'
};

const contentSectionStyle: React.CSSProperties = {
  padding: '32px 36px'
};

const greetingStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '16px',
  fontWeight: 600,
  color: '#0F172A',
  margin: '0 0 16px 0'
};

const bodyTextStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '15px',
  color: '#334155',
  lineHeight: '1.68',
  margin: '0 0 24px 0'
};

const calloutBoxStyle: React.CSSProperties = {
  backgroundColor: '#F0FDF4',
  borderLeft: '4px solid #3AAF49',
  borderRadius: '0 8px 8px 0',
  padding: '16px 20px',
  margin: '0 0 24px 0'
};

const calloutTextStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '14px',
  color: '#166534',
  lineHeight: '1.5',
  margin: 0
};

const buttonSectionStyle: React.CSSProperties = {
  margin: '32px 0 28px 0',
  textAlign: 'center' as const
};

const buttonStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: '#FFFFFF',
  textDecoration: 'none',
  borderRadius: '10px',
  padding: '14px 32px',
  display: 'inline-block',
  backgroundColor: '#3AAF49',
  border: '1px solid #3AAF49',
  boxShadow: '0 4px 14px rgba(58, 175, 73, 0.3)',
  textAlign: 'center' as const,
  maxWidth: '100%',
  boxSizing: 'border-box'
};

const supportTextStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '13px',
  color: '#64748B',
  margin: '24px 0 0 0',
  lineHeight: '1.5'
};

const linkStyle: React.CSSProperties = {
  color: '#3AAF49',
  fontWeight: 600,
  textDecoration: 'underline'
};

const footerSectionStyle: React.CSSProperties = {
  backgroundColor: '#0E1712',
  padding: '28px 36px',
  borderTop: '1px solid #1E293B',
  textAlign: 'center' as const
};

const companyNameStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: '#E2E8F0',
  margin: '0 0 6px 0'
};

const companyAddressStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '11px',
  color: '#64748B',
  margin: '0 0 12px 0'
};

const footerDisclaimerStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '11px',
  color: '#64748B',
  margin: '0 0 12px 0',
  lineHeight: '1.5'
};

const footerLinksStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '11px',
  color: '#64748B',
  margin: 0
};

const footerLinkStyle: React.CSSProperties = {
  color: '#3AAF49',
  fontWeight: 600,
  textDecoration: 'underline'
};

const footerPrivacyLinkStyle: React.CSSProperties = {
  color: '#94A3B8',
  textDecoration: 'none'
};

const subFooterStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '11px',
  color: '#94A3B8',
  textAlign: 'center' as const,
  marginTop: '16px'
};
