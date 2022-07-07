import React, {useState, useEffect} from 'react';
// Components
import AddCertificateCard from "@src/pages/certificate-templates/shared-components/AddCertificateCard";
import CertificateTemplateContainer
  from "@src/pages/certificate-templates/shared-components/CertificateTemplateContainer";
import {Modal} from "antd";
import EditCertNameModalContent
  from "@src/pages/certificate-templates/shared-components/modal-content/EditCertNameModalContent";

// Hooks
import {useMui} from "@src/hooks/useMui";

// Stores
import store from "@src/store/Store";
import {observer} from "mobx-react-lite";
import {
  CertificateTemplatesContext
} from "@src/store/certificate-templates/CertificateTemplates";
import {useStore} from "@src/store/Context";

// Styles
import "../../CertificateTemplates.scss";

// import certificateTemplatesList from "@src/pages/certificate-templates/data/certificateTemplates.json";

const CertificateTemplateList = ({filter,
                                   // certificateTemplatesFilteredList
  }) => {
  // Data
  const languagesTotal = store.portal.get('langs').length;

  const certificateTemplateStore = useStore(CertificateTemplatesContext);

  useEffect(() => {
    certificateTemplateStore.loadTemplates();
  }, []);

  let certificateTemplatesFilteredList = certificateTemplateStore.getTemplates();

  if (filter && filter.certName && filter.certName.toLowerCase().length >= 2) {
    certificateTemplatesFilteredList = certificateTemplatesFilteredList.filter(
      (cert) => cert.name.toLowerCase().includes(filter.certName)
    );
  }
  // Hooks
  const [visible, setVisible] = useState({
    visible: false,
    newCertificate: true
  });
  // const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");

  const certificateTemplates = certificateTemplatesFilteredList.map((cert, index) => (
    <CertificateTemplateContainer
      languagesTotal={languagesTotal}
      certName={cert.name}
      key={`${cert.id}${index}`}
      certificateId={cert.id}
      priorityLevelTitle={cert.priority_level?.title}
      previewUrlSmall={cert.preview.url_small}
      defaultImage={cert.default_image}
      languagesAmount={cert.languages_amount}
      isDefault={cert.is_default}
      languages={cert.languages}
    />)
  );

  if (filter && filter.certName && certificateTemplatesFilteredList.length === 0) {
    return (
      <div className="no-search-results">
        <div className="no-results-header">
          <MuiL2Default muiKey="your-search-for"
                        muiDefault={`Your search for ${filter.certName} didn't return any results`}/>
        </div>
        <div className="no-results-description">
          <MuiL2Default muiKey="check-for-general-words"
                        muiDefault="Сheck if you entered the request correctly, or try to use fewer or more general words."/>
        </div>
      </div>

    )
  }

  return (
      <div className="certificate-template-list">
        <Modal
          title={null}
          visible={visible.visible}
          footer={null}
          closable={false}
          centered
          className="certificate-name-modal"
          width={372}
        >
          <EditCertNameModalContent
            newCertificate={visible.newCertificate}
            onClose={() => setVisible({
              ...visible,
              visible: false
            })}
          />
        </Modal>
        <AddCertificateCard
          muiKey="add-certificate"
          muiDefault="Add new certificate"
          onAddClick={() => setVisible({
            visible: true,
            newCertificate: true
          })}
        />
        {
          certificateTemplates
        }
      </div>
  )
}

export default observer(CertificateTemplateList);
