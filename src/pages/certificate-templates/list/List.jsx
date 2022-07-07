import React, {useState} from 'react';
// Components
import {PageHeader} from "antd";
import {PageContent} from "@src/components/PageContent/PageContent";
import CertificateTemplateList from "@src/pages/certificate-templates/list/components/CertificateTemplateList";
import FilterSearch from "@src/pages/certificate-templates/list/components/FilterSearch";

// Hooks
import {usePageTitle} from "@src/hooks/usePageTitle";
import {useTranslation} from "react-i18next";
import {useMui} from "@src/hooks/useMui";

// Store
import {observer} from "mobx-react-lite";
import {
  CertificateTemplatesContext,
  CertificateTemplatesStore
} from "@src/store/certificate-templates/CertificateTemplates";

// Styles
import "./List.scss";

const pageTitle = 'Certificate templates';

const List = () => {
  usePageTitle(pageTitle);
  useTranslation(["LMS2CertificateTemplates"]);
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const [filter, setFilter] = useState({
    certName: null
  });

  const changeFilter = (name, value) => {
    setFilter({...filter, [name]: value});
  }

  const store = new CertificateTemplatesStore();

  return (
    <CertificateTemplatesContext.Provider value={store}>
      <PageHeader
        title={<MuiLMS2Certificate muiKey="certificate-templates" muiDefault="Certificate templates"/>}
        extra={[
          <FilterSearch changeFilter={changeFilter} />
        ]}
      />
      <PageContent>
        <CertificateTemplateList filter={filter}/>
      </PageContent>
    </CertificateTemplatesContext.Provider>
  )
}

export default observer(List);
