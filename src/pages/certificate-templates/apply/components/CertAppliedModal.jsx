import React from 'react';
import {renderToString} from "react-dom/server";
// Components
import KcButton from "@src/components/shared/KcButton/KcButton";
import {Message as Hint} from "@src/utils/Message";
import MuiValue from "@src/components/shared/MuiValue";
import MuiTag from "@src/components/shared/MuiTag";

// Hooks
import {useMui} from "@src/hooks/useMui";

// Styles
import "../Apply.scss";

const CertAppliedModalContent = ({
                                   onClose,
                                   currentPage,
                                   currentCoursesConflicts = true
                                 }) => {
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");
  let conflictMessage = <MuiLMS2Certificate
    muiKey="applied-cert-warning"
    muiDefault="Several courses have a certificate template assigned. If you create a new certificate template, the old one will be removed."
  />;
  if (currentPage !== 'course') {
    conflictMessage = <MuiLMS2Certificate
      muiKey="applied-cert-warning-courses-type"
      muiDefault="This type of course has a certificate template assigned. If you assign this one, the old certificate will be removed."
    />;
  }
  return (
    <>
      <div className="modal-window">
        <div className="modal-text">
          {currentCoursesConflicts ? conflictMessage : <MuiLMS2Certificate
            muiKey="applied-cert-success"
            muiDefault="Certificate was assigned successfully"
          />}
        </div>
        <div className="buttons-block">
          {currentCoursesConflicts ? <><KcButton key="1" type="primary" onClick={() => onClose()}>
            <MuiL2Default muiKey="back" muiDefault="Back"/>
          </KcButton>
            <KcButton key="2" onClick={() => {
              Hint.sendSuccess(
                renderToString(<MuiValue
                  muiKey="template-applied-success"
                  muiGroup="LMS2CertificateTemplates"
                  muiDefault="Certificate template was applied successfully"
                />)
              );
              onClose();
            }}>
              <MuiL2Default muiKey="confirm" muiDefault="Confirm"/>
            </KcButton></> : <KcButton key="1" type="primary" onClick={() => {
            Hint.sendSuccess(
              renderToString(<MuiValue
                muiKey="template-applied-success"
                muiGroup="LMS2CertificateTemplates"
                muiDefault="Certificate template was applied successfully"
              />)
            );
            onClose();
          }}>
            <MuiTag muiKey="remove" muiGroup="LMS2Reminder" muiDefault="Remove" />
          </KcButton>
          }
        </div>
      </div>
    </>
  );
}

export default CertAppliedModalContent;
