import React, {useEffect} from 'react';
import {renderToString} from "react-dom/server";

// Components
import MuiValue from "@src/components/shared/MuiValue";
import TooltipHint from "@src/components/shared/Hint/Hint";
import {
  QuestionOutlined, CloseOutlined
} from '@ant-design/icons';
import {UploadIcon} from "@src/assets/icons/icons-pack";

// Assets
import currentImageIcon from '@src/assets/images/certificate-templates/current-image-icon.svg';

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

// eslint-disable-next-line no-unused-vars
const CertificateTemplateGallery = ({
                                      onUploadImage,
                                      images,
                                      currentImage,
                                      defaultImage,
                                      onSetCurrentImage,
                                      onRemoveImage,
                                      certificateId
                                    }) => {
  // Store
  const languageCertificateTemplatesStore = useStore(LanguageCertificateTemplatesContext);

  // Constants
  const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png'];
  // console.log('images: ',images);
  // let images = [];
  useEffect(() => {
    // images = languageCertificateTemplatesStore.getGallery();
    console.log('images: ',images);
  }, []);

  // Hooks
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");

  useEffect(() => {
    if (!currentImage) {
      onSetCurrentImage(defaultImage);
    }
  }, []);

  return (
    <div className="certificate-gallery">
      <div className="upload-card">
        <UploadIcon customClassName="upload-icon" style={{fontSize: "20px"}}/>
        <div className="description">
          <MuiLMS2Certificate muiKey="upload-description" muiDefault="Upload a jpg or png"/>
        </div>
        <div className="browse">
          <label
            htmlFor={`img${certificateId}`}
          ><MuiL2Default muiKey="browse" muiDefault="Browse"/></label>
          <input
            type="file"
            id={`img${certificateId}`}
            name="img"
            className="input-image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (ACCEPTED_FILE_TYPES.includes(file.type)) {
                const imageUrl = URL.createObjectURL(file);
                onUploadImage(imageUrl);
                onSetCurrentImage(imageUrl);
              }
            }}
          />
        </div>
        <TooltipHint>
          <MuiValue
            muiGroup="LMS2CertificateTemplates"
            muiKey="background-size-tooltip"
            muiDefault="Background image size is 950 x 620 pixels.  Images of all sizes will be resized and cropped to fit automatically."
          />
        </TooltipHint>
      </div>
    {/*  <div className="image-card">*/}
    {/*  {defaultImage === currentImage && <>*/}
    {/*    <img alt="current-image" className="current-image-icon" src={currentImageIcon}/>*/}
    {/*  </>}*/}
    {/*  <img src={defaultImage} alt="preview-image" onClick={() => onSetCurrentImage(defaultImage)}/>*/}
    {/*</div>*/}
      {
        images?.map((image, index) => (
          <div
            className="image-card"
            key={`${image.id}${index}`}
          >
            <CloseOutlined
              className="remove-image-icon"
              style={{fontSize: "12px"}}
              onClick={() => {
                onRemoveImage(image);
                onSetCurrentImage(defaultImage);
              }}
            />
            {image.is_used &&
            <img alt="current-image" className="current-image-icon" src={currentImageIcon}/>
            }
            <img src={image.url_preview} alt="preview-image" onClick={() => onSetCurrentImage(image)}/>
          </div>
        ))
      }
    </div>
  );
}

export default observer(CertificateTemplateGallery);
