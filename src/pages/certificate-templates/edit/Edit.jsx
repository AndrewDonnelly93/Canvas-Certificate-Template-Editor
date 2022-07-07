import React from 'react';
// Components
import EditList from "@src/pages/certificate-templates/edit/components/EditList";

// Stores
import {observer} from "mobx-react-lite";
import {
  LanguageCertificateTemplatesContext,
  LanguageCertificateTemplatesStore
} from "@src/store/certificate-templates/LanguageCertificateTemplates";

// Styles
import "./Edit.scss";
import "../CertificateTemplates.scss";

// import languageCertificatesList from "@src/pages/certificate-templates/data/languageCertificates.json";

const Edit = () => {
  // Store
  const store = new LanguageCertificateTemplatesStore();

  return (
    <LanguageCertificateTemplatesContext.Provider value={store}>
      <EditList/>
    </LanguageCertificateTemplatesContext.Provider>
  )
}

export default observer(Edit);
