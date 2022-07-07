import React from 'react';
// Components
import AddCertificateCard from "@src/pages/certificate-templates/shared-components/AddCertificateCard";
import CertificateTemplateContainer
  from "@src/pages/certificate-templates/shared-components/CertificateTemplateContainer";
import LanguageCertificateTemplate
  from "@src/pages/certificate-templates/shared-components/LanguageCertificateTemplate";

// Stores
import store from "@src/store/Store.js";

// Styles
import "../CertificateTemplates.scss";

import defaultCertificates from "@src/pages/certificate-templates/data/certificateTemplates.json";

const CertificateTemplateList = ({
                                   isEditDefaultCertificate = false
                                 }) => {
  // Data
  const languagesTotal = store.portal.get('langs').length;

  const defaultCertificatesList = defaultCertificates.data.map(cert => (
    <CertificateTemplateContainer
      languagesTotal={languagesTotal}
      certName={cert.name}
      key={cert.id}
      certificateId={cert.id}
      priorityLevelTitle={cert.priority_level?.title}
      previewUrl={cert.preview.url_small}
      languagesAmount={cert.languages_amount}
      defaultImage={cert.default_image}
    />)
  );

  return (
    <div className="certificate-template-list">
      {!isEditDefaultCertificate && <AddCertificateCard
        muiKey="add-certificate"
        muiDefault="Add new certificate"
      />}
      {
        isEditDefaultCertificate ?
          <LanguageCertificateTemplate isDefault/> :
          defaultCertificatesList
      }
    </div>
  )
}

export default CertificateTemplateList;
