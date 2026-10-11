import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  ButtonGroup,
  Paper,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TitleIcon from '@mui/icons-material/Title';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HtmlContent from './HtmlContent';

interface RichHtmlEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  required?: boolean;
}

export const RichHtmlEditor: React.FC<RichHtmlEditorProps> = ({
  label = 'Content / HTML Body',
  value,
  onChange,
  placeholder = 'Write content or HTML markup (e.g. <p>Description...</p>)...',
  minRows = 5,
  required = false,
}) => {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  const insertTag = (openTag: string, closeTag = '') => {
    onChange(`${value}${openTag}${closeTag}`);
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
          {label} {required && '*'}
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ minHeight: 28, '& .MuiTab-root': { minHeight: 28, py: 0.25, px: 1.5, fontSize: 11, fontWeight: 700 } }}
        >
          <Tab icon={<CodeIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="HTML Editor" value="edit" />
          <Tab icon={<VisibilityIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Live Preview" value="preview" />
        </Tabs>
      </Box>

      {tab === 'edit' ? (
        <Box>
          {/* Quick Toolbar */}
          <Paper
            variant="outlined"
            sx={{
              p: 0.5,
              mb: 0.5,
              display: 'flex',
              gap: 0.5,
              flexWrap: 'wrap',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'),
              borderRadius: '8px 8px 0 0',
              borderBottom: 'none',
            }}
          >
            <ButtonGroup size="small" variant="text">
              <Tooltip title="Bold <strong>">
                <Button onClick={() => insertTag('<strong>', '</strong>')} sx={{ minWidth: 32, p: 0.5 }}>
                  <FormatBoldIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Italic <em>">
                <Button onClick={() => insertTag('<em>', '</em>')} sx={{ minWidth: 32, p: 0.5 }}>
                  <FormatItalicIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Heading <h3>">
                <Button onClick={() => insertTag('<h3>', '</h3>')} sx={{ minWidth: 32, p: 0.5 }}>
                  <TitleIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Bullet List <ul><li>">
                <Button onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} sx={{ minWidth: 32, p: 0.5 }}>
                  <FormatListBulletedIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Link <a href>">
                <Button onClick={() => insertTag('<a href="#">', '</a>')} sx={{ minWidth: 32, p: 0.5 }}>
                  <LinkIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Paragraph <p>">
                <Button onClick={() => insertTag('<p>', '</p>')} sx={{ minWidth: 32, p: 0.5, fontWeight: 700, fontSize: 12 }}>
                  P
                </Button>
              </Tooltip>
              <Tooltip title="Line Break <br/>">
                <Button onClick={() => insertTag('<br/>')} sx={{ minWidth: 32, p: 0.5, fontWeight: 700, fontSize: 12 }}>
                  BR
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Paper>

          <TextField
            fullWidth
            multiline
            minRows={minRows}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '0 0 8px 8px',
                fontFamily: 'monospace',
                fontSize: '13px',
              },
            }}
          />
        </Box>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            minHeight: 120,
            borderRadius: 2,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
          }}
        >
          {value ? (
            <HtmlContent content={value} />
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No content entered yet. Switch to "HTML Editor" tab to add text or HTML tags.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default RichHtmlEditor;
