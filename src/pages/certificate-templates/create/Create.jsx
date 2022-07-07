import React, {useState} from 'react';
// Components
import {PageHeader, Space, Modal} from "antd";
import {PageContent} from "@src/components/PageContent/PageContent";
import PageHeaderBackButton from "@src/components/shared/PageHeaderBackButton/PageHeaderBackButton";
import KcAlert from "@src/components/shared/KcAlert/KcAlert";
import SavingChangesModalContent
  from "@src/pages/certificate-templates/shared-components/modal-content/SavingChangesModalContent";
import EditCertificateList from "@src/pages/certificate-templates/shared-components/EditCertificateList";

// Hooks
import {usePageTitle} from "@src/hooks/usePageTitle";
import {useTranslation} from "react-i18next";
import {useMui} from "@src/hooks/useMui"

// Stores
import store from "@src/store/Store";

// Constants
import {EDIT_PATH} from "@src/pages/certificate-templates/certificates.constants";

// Styles
import "./Create.scss";
import "../CertificateTemplates.scss";

const pageTitle = 'Create Certificate';

const Create = () => {
  // Data
  const languages = store.portal.get('langs');
  const defaultLanguage = languages.find(language => language.is_default === 1);

  // Hooks
  usePageTitle(pageTitle);
  useTranslation(["LMS2CertificateTemplates"]);
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const [visible, setVisible] = useState(false);
  // Hooks

  // eslint-disable-next-line no-unused-vars
  const [initialValues, setInitialValues] = useState({
    id: null,
    isDefault: false,
    groupId: null,
    name: '',
    language: {
      name: '',
      code: ''
    },
    preview: {
      urlSmall: '',
      urlBig: ''
    },
    fields: {
      userProfile: {
        firstLastName: {
          styles: {}
        },
        city: {
          styles: {}
        },
        center: {
          styles: {}
        }
      }
    },
    created: new Date().getDate(),
    updated: null
  });

  return (
    <>
      <PageHeader
        title={[
          <Space size="middle">
            <PageHeaderBackButton
              path={EDIT_PATH}
              onClick={() => setVisible(true)}
            />
            {store.portal.getDefaultCertName()}
            <KcAlert
              message={
                <MuiLMS2Certificate
                  muiKey="create-certificate-alert"
                  muiDefault="You must create certificate in at least one language to save changes."
                />
              }
            />
          </Space>
        ]}
      />
      <PageContent>
        <EditCertificateList
          defaultLanguage={defaultLanguage}
          portalLanguages={languages}
        />
        <Modal
          centered
          title={null}
          visible={visible}
          footer={null}
          closable={false}
          className="saving-changes-modal"
          width={530}
        >
          <SavingChangesModalContent
            onClose={() => setVisible(false)}
          />
        </Modal>
      </PageContent>
    </>
  )
}

export default Create;
