import React, {useState} from 'react';
import {renderToString} from "react-dom/server";
// Components
import MuiValue from "@src/components/shared/MuiValue";
import ButtonAction from "@src/components/shared/ButtonAction/ButtonAction";
import {CopyIcon, PencilIcon, BinIcon, QuestionCircleIcon, QuestionOutlinedIcon} from "@src/assets/icons/icons-pack";
import {Tooltip, Modal, Button, Input, Menu, Dropdown} from "antd";
import Hint from "@src/components/shared/Hint/Hint";
import {
  QuestionOutlined,
  ExclamationOutlined
} from "@ant-design/icons";
import EditCertNameModalContent
  from "@src/pages/certificate-templates/shared-components/modal-content/EditCertNameModalContent";
import RemoveCertModalContent
  from "@src/pages/certificate-templates/shared-components/modal-content/RemoveCertModalContent";

// Hooks
import {useMui} from "@src/hooks/useMui";
import {useHistory} from "react-router-dom";

// Constants
import {
  EDIT_PATH,
  DEFAULT_CERTIFICATE_ID,
  APPLY_PATH
} from "@src/pages/certificate-templates/certificates.constants";

// Styles
import "./CertificateTemplate.scss";
import MuiTag from "@src/components/shared/MuiTag";

const CertificateTemplateContainer = ({
                                        languagesTotal = 1,
                                        priorityLevelTitle,
                                        previewUrlSmall,
                                        certificateId,
                                        certName,
                                        languages,
                                        defaultImage,
                                        isDefault = false
                                      }) => {
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");
  const [showEdit, setShowEdit] = useState(false);
  const [certificateName, setCertificateName] = useState(certName || 'Copy 1');
  const [visible, setVisible] = useState({
    visible: false,
    newCertificate: true
  });
  const [submenuVisible, setSubmenuVisible] = useState(false);
  const [inputNameVisible, setInputNameVisible] = useState(false);
  const [removeCertVisible, setRemoveCertVisible] = useState(false);
  const history = useHistory();

  const menu = <Menu>
    {!isDefault && <Menu.Item>
      <ButtonAction
        handleClick={() => {
          setRemoveCertVisible(true);
          setSubmenuVisible(false);
        }}
        name={<MuiTag muiKey="remove" muiGroup="LMS2Reminder" muiDefault="Remove" />}
        prefix={<BinIcon/>}
        buttonClassName="button-action"
        prefixClassName="button-action-icon"
        textClassName="button-action-text"
      />
    </Menu.Item>}
    <Menu.Item>
      <ButtonAction
        handleClick={() => {
          setVisible({
            visible: true,
            newCertificate: true
          });
          setSubmenuVisible(false);
        }}
        name={<MuiLMS2Certificate muiKey="duplicate" muiDefault="Duplicate"/>}
        prefix={<CopyIcon/>}
        buttonClassName="button-action"
        prefixClassName="button-action-icon"
        textClassName="button-action-text"
      />
    </Menu.Item>
  </Menu>

  return (
    <div key={`${certificateId}${certName}`}
         className={`certificate-card certificate-card_standard-card
      ${isDefault ? 'certificate-card_default-certificate' : ''}
    `}
    >
      {isDefault &&
      <Tooltip
        mouseEnterDelay={0.55}
        key={`default-certificate-tooltip-${certificateId}${Math.random()}`}
        title={renderToString(
          <MuiValue
            muiGroup="LMS2CertificateTemplates"
            muiKey="default-certificate-tooltip"
            muiDefault="This certificate was created automatically and used only when courses have no applied custom certificates"
          />
        )}
        placement="right"
      >
          <span className="kc-hint">
            <QuestionOutlinedIcon customClassName="tooltip" style={{fontSize: "12px"}}/>
          </span>
      </Tooltip>
      }
      {!priorityLevelTitle && <Tooltip
        key={`default-certificate-tooltip-${certificateId}${Math.random()}`}
        mouseEnterDelay={0.55}
        title={renderToString(
          <MuiValue
            muiGroup="LMS2CertificateTemplates"
            muiKey="not-applied-certificate-tooltip"
            muiDefault="This certificate is not applied to any courses"
          />
        )}
        placement="right"
      >
        <ExclamationOutlined className="tooltip tooltip_exclamation" style={{fontSize: "12px"}}/>
      </Tooltip>}
      <div
        className="edit-certificate"
        onMouseEnter={() => setShowEdit(true)}
        onMouseLeave={() => setShowEdit(false)}
      >
        <img alt="default-certificate-image" src={previewUrlSmall} className="certificate-image"/>
        <div className={`edit-button ${showEdit ? 'active' : ''}`}>
          <Button key="1" type="primary" onClick={() => history.replace(`${EDIT_PATH}/${
            isDefault ? DEFAULT_CERTIFICATE_ID : certificateId
          }`)}>
            <MuiL2Default muiKey="edit" muiDefault="Edit"/>
          </Button>
        </div>
      </div>

      <p className="certificate-name">
        <span className="name">{!inputNameVisible && certificateName}</span>
        {inputNameVisible && <Input
          placeholder={renderToString(
            <MuiValue muiKey="default-certificate" muiGroup="LMS2CertificateTemplates"
                      muiDefault="Default certificate"/>
          )}
          value={certificateName}
          autoFocus
          onBlur={() => setInputNameVisible(false)}
          onChange={(e) => setCertificateName(e.target.value)}
        />}
        {!isDefault && <ButtonAction
          handleClick={() => {
            if (!isDefault) {
              setInputNameVisible(true);
            }
          }}
          disabled={isDefault}
          prefix={<PencilIcon/>}
        />}
      </p>

      <div className="information-block">

        <div className="cert-displayed">
          <div className="category-name">
            <MuiLMS2Certificate muiKey="displayed-to" muiDefault="Displayed to:"/>
          </div>
          <div className="category-value">
            {priorityLevelTitle || <MuiL2Default muiKey="not-set" muiDefault="Not set"/>}
          </div>
        </div>

        <div className="cert-languages">
          <div className="category-name">
            <MuiL2Default muiKey="languages" muiDefault="Languages:"/>
            {isDefault ? (<Tooltip
              key="default-certificate-language-tooltip"
              mouseEnterDelay={0.55}
              title={renderToString(
                <MuiValue
                  muiGroup="LMS2CertificateTemplates"
                  muiKey="default-certificate-language-tooltip"
                  muiDefault="Default certificate will be displayed in default portal language."
                />
              )}
              placement="right"
            >
              <span className="kc-hint">
                <QuestionOutlinedIcon customClassName="tooltip" style={{fontSize: "12px"}}/>
              </span>
            </Tooltip>) : (<Tooltip
                key="certificate-language-tooltip"
                overlayClassName="language-tooltip"
                mouseEnterDelay={0.55}
                title={<>
                  <div className="name"><MuiValue
                    muiGroup="LMS2CertificateTemplates"
                    muiKey="certificate-language-tooltip"
                    muiDefault="Language versions"
                  /></div>
                  {languages && languages.map(language => (<div className="language-option">{language}</div>))}
                </>}
                placement="right"
              >
                 <span className="kc-hint">
                  <QuestionOutlinedIcon customClassName="tooltip" style={{fontSize: "12px"}}/>
                 </span>
              </Tooltip>
            )}
          </div>
          <div className="category-value">
            {isDefault ? '1/1' : `${languages ? languages.length : 1}/${languagesTotal}`}
          </div>
        </div>
      </div>

      <div className="button-block">
        <Button
          className='mr-6 go_to_portal_button'
          disabled={isDefault}
          onClick={() => history.replace(`${APPLY_PATH}/${certificateId}`)}
        >
          <MuiLMS2Certificate muiKey="apply-to" muiDefault="Apply to"/>
        </Button>

        <Dropdown
          overlay={menu}
          trigger={['hover']}
          placement="topLeft"
          arrow={true}
          overlayClassName="submenu-dropdown"
        >
          <div className="card-submenu"
               onMouseEnter={() => setSubmenuVisible(true)}
               onMouseLeave={() => setSubmenuVisible(false)}
          >...
          </div>
        </Dropdown>
      </div>

      <Modal
        title={null}
        visible={visible.visible}
        footer={null}
        closable={false}
        className="certificate-name-modal"
        width={372}
        centered
      >
        <EditCertNameModalContent
          certificateName={certificateName}
          newCertificate={visible.newCertificate}
          onClose={() => setVisible({
            ...visible,
            visible: false
          })}
        />
      </Modal>

      <Modal
        title={null}
        visible={removeCertVisible}
        footer={null}
        closable={false}
        className="remove-cert-modal"
        width={530}
        centered
      >
        <RemoveCertModalContent
          onClose={() => setRemoveCertVisible(false)}
        />
      </Modal>
    </div>
  )
}

export default CertificateTemplateContainer;
