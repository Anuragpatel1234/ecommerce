import React from 'react';
import './CMSActionBar.css';

/**
 * CMSActionBar — Sticky top bar for CMS forms
 * Props:
 *   title: string
 *   breadcrumb: [{ label, path }]
 *   onSaveDraft: fn
 *   onPublish: fn
 *   onCancel: fn
 *   isSaving: bool
 *   isPublishing: bool
 *   isDirty: bool (unsaved changes)
 *   lastSaved: Date
 */
const CMSActionBar = ({
  title,
  breadcrumb = [],
  onSaveDraft,
  onPublish,
  onCancel,
  isSaving = false,
  isPublishing = false,
  isDirty = false,
  lastSaved,
  publishLabel = 'Publish'
}) => {
  return (
    <div className="cms-action-bar">
      <div className="cms-action-bar__left">
        <div className="cms-action-bar__breadcrumb">
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="cms-action-bar__sep">/</span>}
              <span
                className={`cms-action-bar__crumb ${i === breadcrumb.length - 1 ? 'active' : ''}`}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="cms-action-bar__title">{title}</h1>
        {isDirty && (
          <span className="cms-action-bar__dirty-badge">
            <i className="fa-solid fa-circle" style={{ fontSize: '6px' }}></i>
            Unsaved changes
          </span>
        )}
        {!isDirty && lastSaved && (
          <span className="cms-action-bar__saved-badge">
            <i className="fa-solid fa-check"></i>
            Saved {new Date(lastSaved).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="cms-action-bar__right">
        {onCancel && (
          <button
            type="button"
            className="cms-action-bar__btn cms-action-bar__btn--ghost"
            onClick={onCancel}
            disabled={isSaving || isPublishing}
          >
            Cancel
          </button>
        )}
        {onSaveDraft && (
          <button
            type="button"
            className="cms-action-bar__btn cms-action-bar__btn--secondary"
            onClick={onSaveDraft}
            disabled={isSaving || isPublishing}
          >
            {isSaving ? (
              <>
                <span className="cms-action-bar__spinner"></span> Saving...
              </>
            ) : (
              <>
                <i className="fa-regular fa-floppy-disk"></i> Save Draft
              </>
            )}
          </button>
        )}
        {onPublish && (
          <button
            type="button"
            className="cms-action-bar__btn cms-action-bar__btn--primary"
            onClick={onPublish}
            disabled={isSaving || isPublishing}
          >
            {isPublishing ? (
              <>
                <span className="cms-action-bar__spinner"></span> Publishing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-cloud-arrow-up"></i> {publishLabel}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CMSActionBar;
