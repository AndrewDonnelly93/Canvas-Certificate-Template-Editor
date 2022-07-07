import React, {useState, useEffect} from 'react';
// Components
import ButtonAction from "@src/components/shared/ButtonAction/ButtonAction";
import {
  EyeFilled
} from "@ant-design/icons";
import {Button, Modal} from "antd";
import PreviewCertificateModalContent
  from "@src/pages/certificate-templates/shared-components/modal-content/PreviewCertificateModalContent";

// Hooks
import {useMui} from "@src/hooks/useMui";

// Styles
import "./CertificateTemplate.scss";

const LanguageCertificateTemplate = ({
                                       certName,
                                       previewUrlSmall,
                                       previewUrlBig,
                                       languageName,
                                       isDefault,
                                       onEditClick
                                     }) => {
  // Hooks
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");
  const [visible, setVisible] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="certificate-card certificate-card_standard-card certificate-card_short-card">
      <div
        className="edit-certificate"
        onMouseEnter={() => setShowEdit(true)}
        onMouseLeave={() => setShowEdit(false)}
      >
        <img alt="default-certificate-image"
             src={previewUrlSmall}
             className="certificate-image"/>
        {!isDefault && <div className={`edit-button ${showEdit ? 'active' : ''}`}>
          <Button key="1" type="primary" onClick={() => onEditClick()}>
            <MuiL2Default muiKey="edit" muiDefault="Edit"/>
          </Button>
        </div>}
      </div>

      <p className="certificate-name">
        {certName}
      </p>

      <div className="button-block">
        <div className="cert-languages">
          <div className="category-name">
            <MuiL2Default muiKey="language" muiDefault="Language:"/>
          </div>
          <div className="category-value">
            {languageName}
          </div>
        </div>
        {isDefault &&
          <div className="preview">
            <ButtonAction
              handleClick={() => setVisible(true)}
              name={<MuiL2Default muiKey="preview" muiDefault="Preview"/>}
              prefix={<EyeFilled/>}
              buttonClassName="button-action"
              prefixClassName="button-action-icon"
              textClassName="button-action-text"
            />
          </div>
        }
      </div>

      <Modal
        centered
        title={null}
        visible={visible}
        footer={null}
        closable={false}
        width={948}
        className="preview-certificate-modal"
      >
        <PreviewCertificateModalContent
          onClose={() => setVisible(false)}
          previewCertificate={previewUrlBig}
        />
      </Modal>
    </div>
  )
}

export default LanguageCertificateTemplate;
