import React, {useState, useEffect} from 'react';
// Components
import uuid from 'react-uuid';
import {Modal} from "antd";
import AddCertificateCard from "@src/pages/certificate-templates/shared-components/AddCertificateCard";
import LanguageCertificateTemplate
  from "@src/pages/certificate-templates/shared-components/LanguageCertificateTemplate";
import Editor from "@src/pages/certificate-templates/shared-components/editor/Editor";

// Assets
import defaultImage from '@src/assets/images/certificate-templates/preview-certificate.png';

// Styles
import "../CertificateTemplates.scss";

const EditCertificateList = ({
                               defaultLanguage,
                               portalLanguages,
                               currentCertificates
                             }) => {
  // Data
  const newLanguages = currentCertificates ?
    portalLanguages.filter(language =>
    !currentCertificates?.find(cert => cert.language.code === language.lang)) :
    portalLanguages;
  const [visible, setVisible] = useState(currentCertificates ? new Array(currentCertificates.length).fill(false) : []);
  const [createModalVisible, setCreateModalVisible] = useState(new Array(newLanguages.length).fill(false));

  useEffect(() => {
    setVisible(currentCertificates ? new Array(currentCertificates.length).fill(false) : []);
    setCreateModalVisible(new Array(newLanguages.length).fill(false));
  }, [currentCertificates]);

  return (
    <div className="certificate-template-list">
      {
        currentCertificates?.map((cert, index) => (
            <div key={`${cert.id}${index}${cert.language.name}`}>
              <LanguageCertificateTemplate
                certName={cert.name}
                certId={cert.id}
                previewUrlSmall={cert.image.small}
                previewUrlBig={cert.image.big}
                // previewUrlSmall={cert.preview.url_small}
                // previewUrlBig={cert.preview.url_big}
                defaultImage={cert.default_image}
                languageName={cert.language.name}
                languageTemplateId={cert.certificate_template_id}

                onEditClick={() => {
                  setVisible(
                    // eslint-disable-next-line no-shadow
                    visible => visible.map((element, modalIndex) => modalIndex === index
                    ))
                }}
              />
              <Modal
                style={{top: 0, zIndex: 1000}}
                title={null}
                visible={visible[index]}
                footer={null}
                closable={false}
                mask={false}
                className="template-editor-modal"
                width={'100%'}
                wrapClassName="template-editor-container"
              >
                <Editor
                  certificate={cert}
                  onClose={() => setVisible(
                    // eslint-disable-next-line no-shadow
                    visible => visible.map(() => false
                    ))}
                />
              </Modal>
            </div>
          ))
      }
      {
        newLanguages.map((language, index) => {
          const isDefault = language.name === defaultLanguage.name;
          const groupId = currentCertificates && currentCertificates[0] ? currentCertificates[0].groupId : uuid();
          const newCertificate = {
            created: new Date(),
            updated: new Date(),
            groupId,
            name: 'New certificate',
            default_image: defaultImage,
            id: uuid(),
            language: {
              name: language.name,
              code: language.code
            }
          };
          return (
            <div key={language.name}>
              <AddCertificateCard
                key={language.name}
                muiKey={isDefault ? "create-certificate" : "add-certificate-in"}
                muiDefault={isDefault ? "Create certificate in" : "Add certificate in"}
                languageName={` ${language.name}`}
                isEdit
                onAddClick={() => setCreateModalVisible(
                  // eslint-disable-next-line no-shadow
                  createModalVisible => createModalVisible.map((element, modalIndex) => modalIndex === index
                  ))}
              />
            <Modal
              style={{top: 0, zIndex: 1000}}
              title={null}
              visible={createModalVisible[index]}
              footer={null}
              closable={false}
              className="template-editor-modal"
              wrapClassName="template-editor-container"
              mask={false}
              width={'100%'}
            >
              <Editor
                certificate={newCertificate}
                onClose={() => setCreateModalVisible(
                  // eslint-disable-next-line no-shadow
                   createModalVisible => createModalVisible.map(() => false
                  ))}
              />
            </Modal>
            </div>
          )
        })
      }
    </div>
  );
}

export default EditCertificateList;
