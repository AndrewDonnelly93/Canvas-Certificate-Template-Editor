import React from 'react';
// Components
import {CloseOutlined} from "@ant-design/icons";

const PreviewCertificateModalContent = ({
  previewCertificate,
  onClose
                                        }) => (
  <>
    <div className="preview-certificate">
      <CloseOutlined className="close-icon" onClick={() => onClose()}/>
      <img alt="preview-certificate-image" src={previewCertificate} className="preview-certificate-image"/>
    </div>
  </>
);

export default PreviewCertificateModalContent;
