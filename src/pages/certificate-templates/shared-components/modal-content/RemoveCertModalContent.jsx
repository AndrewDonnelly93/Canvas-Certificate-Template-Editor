import React from 'react';
// Components
import {Button, Space} from "antd";

// Hooks
import {useMui} from "@src/hooks/useMui";

// Styles
import "./ModalContent.scss";

const RemoveCertModalContent = ({onClose}) => {
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");

  return (
    <div className="modal-content">
      <div className="description">
        <MuiLMS2Certificate
          muiKey="confirm-removing"
          muiDefault="Are you sure you want to delete certificate? It will be removed from all courses. This action can not be undone."
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
          onClick={() => onClose()}
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

export default RemoveCertModalContent;
