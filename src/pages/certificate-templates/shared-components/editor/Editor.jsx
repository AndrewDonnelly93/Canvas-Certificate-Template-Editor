import React, {useEffect, useState} from 'react';
import {renderToString} from "react-dom/server";
// Components
import MuiValue from "@src/components/shared/MuiValue";
import CertificateTemplateGallery
  from "@src/pages/certificate-templates/shared-components/editor/CertificateTemplateGallery";
import MuiTag from "@src/components/shared/MuiTag";
import KcLongButton from "@src/components/shared/KcLongButton/KcLongButton";
import {QuestionOutlined} from "@ant-design/icons";
import TemplateFields from "@src/pages/certificate-templates/shared-components/editor/TemplateFields";
import FieldSettings from "@src/pages/certificate-templates/shared-components/editor/FieldSettings";
import CanvasEditor from "@src/pages/certificate-templates/shared-components/editor/CanvasEditor";
import {Message as Hint} from "@src/utils/Message";
import TooltipHint from "@src/components/shared/Hint/Hint";

// Constants
import {FIELD_TYPES} from "@src/pages/certificate-templates/certificates.constants";

// Hooks
import {useMui} from "@src/hooks/useMui";

// Store
import {observer} from "mobx-react-lite";
import {
  LanguageCertificateTemplatesContext
} from "@src/store/certificate-templates/LanguageCertificateTemplates";
import {useStore} from "@src/store/Context";

// Styles
import "./Editor.scss";

const Editor = ({certificate, onClose}) => {
  // Store
  const languageCertificateTemplatesStore = useStore(LanguageCertificateTemplatesContext);

  // Data
  const defaultImage = certificate.default_image;
  const defaultCurrentField = {
    text: '',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 400,
    textAlign: 'left',
    fill: '#000000',
    opacity: 1,
    fieldType: FIELD_TYPES.TEXT,
    formFieldName: '',
    customElementType: '',
    QR: {
      style: '',
      url: '',
      fill: '#000000',
      backgroundColor: '#000000'
    }
  };

  // const defaultQR = {
  //   style: '',
  //   url: '',
  //   color: '',
  //   backgroundColor: '',
  //   opacity: 1,
  //   fieldType: FIELD_TYPES.QR_CODE
  // }

  const languageTemplateId = certificate.id;
  const certId = certificate.certificate_template_id;

  // Hooks
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const [fieldNames, setFieldNames] = React.useState([]);
  const [currentField, setCurrentField] = React.useState(defaultCurrentField);
  const [fieldToRemove, setFieldToRemove] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [currentImage, setCurrentImage] = React.useState('');
  const [canvas, setCanvas] = useState({
    canvasField: null,
    fieldNames: [],
    image: ''
  });

  useEffect(() => {
    languageCertificateTemplatesStore.loadGallery(certId, languageTemplateId);
    // setImages(languageCertificateTemplatesStore.getGallery());
  }, [certId, languageTemplateId]);

  let imagesStored = languageCertificateTemplatesStore.getGallery();
  // let currentImage = imagesStored.find(image => image.is_used);

  return (
    <div className="template-editor">
      <div className="template-gallery">
        <CertificateTemplateGallery
          images={imagesStored}
          onUploadImage={(imageObject) => setImages(
            [imageObject, ...images]
          )}
          onRemoveImage={(imageToRemove) => setImages(images.filter(image => image !== imageToRemove))}
          currentImage={imagesStored.find(image => image.is_used)}
          defaultImage={defaultImage}
          onSetCurrentImage={(image) => setCurrentImage(image)}
          certificateId={certId}
        />
      </div>
      <div className="canvas">
        <div className="certificate-image-editor">
          <CanvasEditor
            currentField={currentField}
            onSetCurrentField={setCurrentField}
            fieldToRemove={fieldToRemove}
            currentImage={imagesStored.find(image => image.is_used)?.url_original || ''}
            onSetCurrentImage={(image) => setCurrentImage(image)}
            canvas={canvas}
            onSetCanvas={setCanvas}
            certificateId={certId}
            onSetFieldNames={setFieldNames}
            fieldNames={fieldNames}
            certInfo={`${certificate.name} (${certificate.language.name})`}
          />
        </div>
      </div>
      <div className="settings">
        <div className="field-settings">
          <div className="setting-name">
            <MuiLMS2Certificate muiKey="field-settings" muiDefault="Field settings"/>
          </div>
          <FieldSettings
            currentField={currentField}
            certificateId={certId}
            onChangeFontSetting={(fontSetting) => setCurrentField(fontSetting)}
          />
        </div>

        <div className="template-fields">
          <div className="setting-name">
            <MuiLMS2Certificate muiKey="template-fields" muiDefault="Template fields"/>
            <TooltipHint placement="right">
              <MuiValue
                muiGroup="LMS2CertificateTemplates"
                muiKey="template-fields-tooltip"
                muiDefault="You can add fields of any type. You cannot add more fields than the drop-down list."
              />
            </TooltipHint>
          </div>

          <TemplateFields
            currentField={currentField}
            fieldNames={fieldNames}
            onClose={onClose}
            onChangeNames={(value, operation) => {
              if (operation === 'ADD_ITEM') {
                if (!fieldNames.includes(value)) {
                  setFieldNames([...fieldNames, value])
                }
              }
              if (operation === 'REMOVE_ITEM') {
                setFieldNames(fieldNames.filter(item => item !== value));
                setFieldToRemove(value);
                setCurrentField(defaultCurrentField);
              }
            }}
            canvas={canvas}
            onEditCurrentField={(fieldName) => setCurrentField(fieldName)}
          />
        </div>
        <div className="buttons">
          <KcLongButton
            buttonType="primary"
            onButtonClick={() => onClose()}
          >
            <MuiTag muiKey="modals-cancel" muiGroup="L2Default" muiDefault="Cancel"/>
          </KcLongButton>
          <KcLongButton
            onButtonClick={() => {
              if (canvas && canvas.canvasField) {
                localStorage.setItem(certId, JSON.stringify(canvas.canvasField.toJSON([
                  'width',
                  'height',
                  'preserveObjectStacking',
                  'backgroundColor',
                  'formFieldName',
                  'customElementType',
                  'QR',
                  'fieldType'
                ])));
                if (localStorage.getItem(certId)) {
                  Hint.sendSuccess(
                    renderToString(<MuiValue
                      muiKey="template-save-success"
                      muiGroup="LMS2CertificateTemplates"
                      muiDefault="The template was saved successfully."
                    />)
                  );
                } else {
                  Hint.sendError(
                    renderToString(<MuiValue
                      muiKey="template-save-error"
                      muiGroup="LMS2CertificateTemplates"
                      muiDefault="There was an error when saving your template. Please try again"
                    />)
                  );
                }
              }
              console.log('canvas template: ',
                canvas.canvasField.toJSON([
                'width',
                'height',
                'preserveObjectStacking',
                'backgroundColor',
                'customElementType',
                'formFieldName',
                'QR',
                'fieldType'
              ])
              );
            }}
          >
            <MuiLMS2Certificate muiKey="save-template" muiDefault="Save template"/>
          </KcLongButton>
        </div>
      </div>
    </div>
  )
};

export default observer(Editor);
