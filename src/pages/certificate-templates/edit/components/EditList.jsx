import React, {useEffect, useState} from 'react';
// Components
import LanguageCertificateTemplate
  from "@src/pages/certificate-templates/shared-components/LanguageCertificateTemplate";
import EditCertificateList from "@src/pages/certificate-templates/shared-components/EditCertificateList";
import {Modal, PageHeader, Space} from "antd";
import {PageContent} from "@src/components/PageContent/PageContent";
import PageHeaderBackButton from "@src/components/shared/PageHeaderBackButton/PageHeaderBackButton";
import KcAlert from "@src/components/shared/KcAlert/KcAlert";
import ButtonAction from "@src/components/shared/ButtonAction/ButtonAction";
import {CopyIcon} from "@src/assets/icons/icons-pack";
import EditCertNameModalContent
  from "@src/pages/certificate-templates/shared-components/modal-content/EditCertNameModalContent";
// Hooks
import {useParams} from "react-router-dom";
import {usePageTitle} from "@src/hooks/usePageTitle";
import {useTranslation} from "react-i18next";
import {useMui} from "@src/hooks/useMui";
// Store
import store from "@src/store/Store";
import {observer} from "mobx-react-lite";
import {
  LanguageCertificateTemplatesContext
} from "@src/store/certificate-templates/LanguageCertificateTemplates";
import {useStore} from "@src/store/Context";
// Constants
import {
  LIST_PATH,
  DEFAULT_CERTIFICATE_ID
} from "@src/pages/certificate-templates/certificates.constants";
// Styles
import "../Edit.scss";
import "../../CertificateTemplates.scss";

// import languageCertificatesList from "@src/pages/certificate-templates/data/languageCertificates.json";

const pageTitle = 'Default Certificate';

const EditList = () => {
  const {id} = useParams();
  const languageCertificateTemplatesStore = useStore(LanguageCertificateTemplatesContext);

  useEffect(() => {
    languageCertificateTemplatesStore.loadTemplates(id);
  }, [id]);

  const currentCertificates =
    // languageCertificatesList.data;
    languageCertificateTemplatesStore.getTemplates();
  const isDefault = id === DEFAULT_CERTIFICATE_ID;
  const defaultCertificate = currentCertificates?.find(cert => cert.is_default);

  const languages = store.portal.get('langs');
  const defaultLanguage = languages.find(language => language.is_default === 1);
  const defaultLanguageCertificate = currentCertificates?.find(cert => cert.language.name === defaultLanguage.name);
  const currentGroupName = defaultLanguageCertificate ? defaultLanguageCertificate.name :
    currentCertificates[0]?.name;

  // Hooks
  usePageTitle(pageTitle);
  useTranslation(["LMS2CertificateTemplates"]);
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const [visible, setVisible] = useState(false);

  return (
    <>
      <PageHeader
        title={[
          <Space size="middle">
            <PageHeaderBackButton path={LIST_PATH}/>
            {isDefault ? defaultCertificate.name : currentGroupName}
            {isDefault && <KcAlert
              message={
                <MuiLMS2Certificate
                  muiKey="duplicate-hint"
                  muiDefault="Create a duplicate to be able to make changes."
                />
              }
            />}
          </Space>
        ]}
        extra={[
          <ButtonAction
            handleClick={() => setVisible(true)}
            name={<MuiLMS2Certificate muiKey="duplicate" muiDefault="Duplicate"/>}
            prefix={<CopyIcon/>}
            buttonClassName="button-action-header"
            prefixClassName="button-action-icon"
            textClassName="button-action-text"
          />,
          <Modal
            title={null}
            visible={visible}
            centered
            footer={null}
            closable={false}
            className="certificate-name-modal"
            width={372}
          >
            <EditCertNameModalContent
              onClose={() => setVisible(false)}
            />
          </Modal>
        ]}
      />
      <PageContent>
        {
          isDefault ?
            <LanguageCertificateTemplate
              certName={defaultCertificate.name}
              previewUrlSmall={defaultCertificate.preview.url_small}
              previewUrlBig={defaultCertificate.preview.url_big}
              languageName={defaultCertificate.language.name}
              isDefault
            /> :
            <EditCertificateList
              defaultLanguage={defaultLanguage}
              currentCertificates={currentCertificates}
              portalLanguages={languages}
            />
        }
      </PageContent>
    </>
  )
}

export default observer(EditList);
