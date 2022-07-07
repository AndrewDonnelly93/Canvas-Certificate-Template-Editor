import React, {useState} from "react";
import MuiTag from "@src/components/shared/MuiTag";
import {BinIcon} from "@src/assets/icons/icons-pack";
import ButtonAction from "@src/components/shared/ButtonAction/ButtonAction";
import {Modal, Space} from "antd";
import Reminder from "@src/services/api/accounts/reminder/Reminder";
import KcLoaderDot from "@src/components/ui/KcLoaderDot";
import KcButton from "@src/components/shared/KcButton/KcButton";
// Hooks
import {useMui} from "@src/hooks/useMui";
// Styles
import "./RemoveConfirmation.scss";

const RemoveConfirmation = ({ id, idList, handleAfterRemove, muiDefault, muiKey, muiGroup }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");

  const finishLoading = (isRemoved = false) => {
    setVisible(false);
    setLoading(false);
    if (isRemoved) {
      handleAfterRemove();
    }
  }

  const handleSubmit = () => {
    setLoading(true);
    if (id) {
      Reminder.remove(id)
        .then(() => {
          finishLoading(true);
        })
        .catch(() => {
          finishLoading();
        })
    } else if (idList) {
      Reminder.removeList(idList)
        .then(() => {
          finishLoading(true);
        })
        .catch(() => {
          finishLoading();
        })
    }
    finishLoading(true);
  }

  const getModalContent = () => {
    if (loading) {
      return (
        <KcLoaderDot />
      )
    }

    return (
      <>
        <div className="remove-confirm__text mb-6">
          <MuiTag
            muiKey={muiKey || "remove-course-submit-table"}
            muiGroup={muiGroup || "LMS2CertificateTemplates"}
            muiDefault={muiDefault || "Do you really want to remove this course? This action can’t be undone."}
          />
        </div>
        <Space size="middle">
          <KcButton
            htmlType="button"
            onClick={() => setVisible(false)}
          >
            <MuiTag muiKey="modals-cancel" muiGroup="L2Default" muiDefault="Cancel" />
          </KcButton>
          <KcButton
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
          >
            <MuiTag muiKey="remove" muiGroup="LMS2Reminder" muiDefault="Remove" />
          </KcButton>
        </Space>
      </>
    )
  }

  return (
    <>
      <ButtonAction
        name={<MuiTag muiKey="remove" muiGroup="LMS2Reminder" muiDefault="Remove" />}
        prefix={<BinIcon />}
        handleClick={() => setVisible(true)}
      />
      <Modal
        centered
        title={null}
        visible={visible}
        footer={null}
        closable={false}
        className={`remove-confirm${  loading ? " loading" : ""}`}
      >
        {getModalContent()}
      </Modal>
    </>
  );
}

export default RemoveConfirmation;
