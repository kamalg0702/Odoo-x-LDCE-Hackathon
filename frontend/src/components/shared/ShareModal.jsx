import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Globe, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function ShareModal({
  isOpen,
  onClose,
  trip,
  shareData, // { slug, public_url }
  onGenerateLink
}) {
  const [copied, setCopied] = useState(false);

  if (!trip) return null;

  const fullShareUrl = shareData?.slug
    ? `${window.location.origin}/share/${shareData.slug}`
    : '';

  const handleCopy = () => {
    if (!fullShareUrl) return;
    navigator.clipboard.writeText(fullShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Trip Plan"
      subtitle="Publish a read-only live itinerary link for friends, family, or travel companions."
      maxWidth="500px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Share Header Card */}
        <div style={{ backgroundColor: 'var(--paper)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--mist)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Globe size={18} style={{ color: 'var(--terrain)' }} />
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>{trip.name}</h4>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
            Anyone with this link can view the itinerary, scheduled activities, and map route without needing to sign in.
          </p>
        </div>

        {fullShareUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>
              Public Share URL
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={fullShareUrl}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--mist-dark)',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'var(--font-data)',
                  fontSize: '13px',
                  color: 'var(--ink)'
                }}
                onClick={(e) => e.target.select()}
              />
              <Button
                variant={copied ? 'terrain' : 'primary'}
                icon={copied ? Check : Copy}
                onClick={handleCopy}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <a
                href={fullShareUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--traverse)' }}
              >
                <span>Preview Live Public Page</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Button
              variant="terrain"
              icon={Sparkles}
              size="lg"
              onClick={onGenerateLink}
            >
              Generate Shareable Link
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
