import React, {useState} from "react";
import {renderToString} from "react-dom/server";
// Components
import {Input, Space, Button} from "antd";
import InputTitle from "@src/components/shared/InputTitle/InputTitle";
import MuiValue from "@src/components/shared/MuiValue";
import MuiTag from "@src/components/shared/MuiTag";

// Hooks
import {useMui} from "@src/hooks/useMui";
import {useHistory} from "react-router-dom";

// Stores
import store from "@src/store/Store";

// Constants
import {CREATE_PATH} from "@src/pages/certificate-templates/certificates.constants";

// Styles
import "./EditCertNameModalContent.scss";

const EditCertNameModalContent = ({onClose, certificateName, newCertificate = false}) => {
  // Hooks
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");
  const history = useHistory();
  const [certName, setCertName] = useState(certificateName || 'Copy 1');

  return (
    <div className="edit-certificate-name">
      <div className="form-name"><MuiLMS2Certificate muiKey="certificate-name" muiDefault="Certificate name"/></div>
      <InputTitle size="small">
        <MuiLMS2Certificate muiKey="name" muiDefault="Name"/>
      </InputTitle>
      <Input
        placeholder={renderToString(
          <MuiValue muiKey="default-certificate" muiGroup="LMS2CertificateTemplates" muiDefault="Default certificate"/>
        )}
        value={certName}
        onChange={(e) => setCertName(e.target.value)}
      />
      <Space size="middle">
        <Button
          htmlType="button"
          onClick={() => onClose()}
        >
          <MuiTag muiKey="modals-cancel" muiGroup="L2Default" muiDefault="Cancel"/>
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            store.portal.setDefaultCertName(certName);
            if (newCertificate) {
              history.push(CREATE_PATH);
            } else {
              onClose();
            }
          }}
        >
          <MuiL2Default
            muiKey="confirm"
            muiDefault="Confirm"
          />
        </Button>
      </Space>
    </div>
  );
}

export default EditCertNameModalContent;
