import React from 'react';
// Components
import {
  PlusOutlined
} from "@ant-design/icons";

// Hooks
import {useMui} from "@src/hooks/useMui";

// Styles
import "../CertificateTemplates.scss";

const AddCertificateCard = ({muiKey, muiDefault, languageName = '', isEdit, onAddClick}) => {
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");

  return (
    <div className={`certificate-card certificate-card_add-card
      ${isEdit ? 'certificate-card_short-card' : ''}
    `}
     onClick={() => onAddClick()}
    >
      <PlusOutlined className="add-icon" style={{ fontSize: "24px"}} />
      <p className="description">
        <MuiLMS2Certificate muiKey={muiKey} muiDefault={muiDefault} />
        {languageName || ''}
      </p>
    </div>
  )
}

export default AddCertificateCard;
