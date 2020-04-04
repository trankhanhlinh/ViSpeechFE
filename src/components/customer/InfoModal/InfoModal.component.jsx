/* eslint-disable react/no-danger */
import React from 'react'
import LoadingIcon from 'components/common/LoadingIcon/LoadingIcon.component'

const InfoModal = ({ infoModal }) => {
  return (
    <div className="modal fade" id="info-modal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-md modal-dialog-centered">
        <div className="modal-content pb-0">
          <div className="popup-body text-center">
            <div className="gaps-2x" />
            {infoModal.icon &&
              infoModal.icon.isSuccess != null &&
              (infoModal.icon.isSuccess ? (
                <div className="pay-status pay-status-success">
                  <em className="ti ti-check" />
                </div>
              ) : (
                <div className="pay-status pay-status-error">
                  <em className="ti ti-alert" />
                </div>
              ))}
            {infoModal.icon && infoModal.icon.isLoading != null && <LoadingIcon />}
            <div className="gaps-2x" />
            {infoModal.title && <h3 style={{ color: '#495463' }}>{infoModal.title}</h3>}
            <p
              style={{ color: '#495463' }}
              dangerouslySetInnerHTML={{ __html: infoModal.message }}
            />
            <div className="gaps-2x" />
            {infoModal.button && (
              <button
                type="button"
                style={{ color: '#253992', fontWeight: 'bold' }}
                className="btn btn-lighter"
                onClick={infoModal.button.clickFunc}
              >
                {infoModal.button.content}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoModal
