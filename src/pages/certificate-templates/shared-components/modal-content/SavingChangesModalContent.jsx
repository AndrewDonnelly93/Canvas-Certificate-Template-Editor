import React from 'react';
// Components
import {Button, Space} from "antd";

// Hooks
import {useMui} from "@src/hooks/useMui";
import {useHistory} from "react-router-dom";

// Constants
import {LIST_PATH} from "@src/pages/certificate-templates/certificates.constants";

// Styles
import "./ModalContent.scss";

const SavingChangesModalContent = ({onClose}) => {
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");
  const history = useHistory();

  return (
    <div className="modal-content">
      <div className="description">
        <MuiL2Default
          muiKey="confirm-leaving"
          muiDefault="Are you sure you want to leave this page with out saving changes? This action cannot be undone"
        />
      </div>
      <Space size="middle">
        <Button
          htmlType="button"
          onClick={() => onClose()}
        >
          <MuiLMS2Certificate
            muiKey="back"
            muiDefault="Back"
          />
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => history.replace(LIST_PATH)}
        >
          <MuiLMS2Certificate
            muiKey="confirm"
            muiDefault="Confirm"
          />
        </Button>
      </Space>
    </div>
  )
}

export default SavingChangesModalContent;
