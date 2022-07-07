import React, {useEffect, useState} from 'react';
// Components
import {fabric} from 'fabric';
import {
  PlusOutlined,
  MinusOutlined
} from "@ant-design/icons";

// Constants
import {FIELD_TYPES} from "@src/pages/certificate-templates/certificates.constants";

// Assets
import defaultQR from '@src/assets/images/certificate-templates/qr-code.png';

// Data
import defaultFields from "@src/pages/certificate-templates/data/defaultFields.json";

const CanvasEditor = ({
                        currentField,
                        fieldToRemove,
                        currentImage,
                        canvas,
                        onSetCanvas,
                        onSetFieldNames,
                        onSetCurrentImage,
                        certInfo,
                        certificateId,
                        onSetCurrentField
                      }) => {
  const CANVAS_HEIGHT = 620;
  const CANVAS_WIDTH = 950;
  const [canvasScale, setCanvaScale] = useState(1);
  const qrCodeId = 'QR Code';
  const bgImageId = 'backgroundImage';

  // const deleteActiveObject = () => {
  //   canvas.canvasField.getActiveObjects().forEach((object) => {
  //     canvas.canvasField.remove(object);
  //   });
  //   canvas.canvasField.renderAll();
  // }

  // const onHandleKeyDown = (event) => {
  //   if (event.which === 46) {
  //     deleteActiveObject();
  //   }
  // };

  const addText = () => {
    const newTextObject =
      new fabric.Textbox(currentField.text, {
        fontFamily: currentField.fontFamily,
        fill: currentField.fill,
        fontWeight: currentField.fontWeight,
        fontSize: currentField.fontSize,
        padding: 5,
        top: currentField.top || .5 * CANVAS_HEIGHT,
        left: currentField.left || .5 * CANVAS_WIDTH,
        editable: false,
        textAlign: currentField.textAlign,
        opacity: currentField.opacity ? currentField.opacity : 1,
        lockScalingY: true,
        formFieldName: currentField.key,
        customElementType: field,
        fieldType: FIELD_TYPES.text,
        minWidth: 100
      });

    newTextObject.set({
      borderColor: '#3191EA',
      borderScaleFactor: 2,
      cornerColor: '#3191EA'
    });

    newTextObject.setControlsVisibility({
      tl: false,
      tr: false,
      bl: false,
      br: false,
      mt: false,
      mb: false
    });

    onSetCanvas({
      ...canvas,
      canvasField: canvas.canvasField.add(newTextObject)
    });
  };

  const uploadImage = (imageUrl, imageId, imageTop, imageLeft, QR, canvasField) => {
    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        // Setting an ID to the image and locking it
        img.set({
          formFieldName: imageId,
          customElementType: "background",
          QR: QR || {},
          top: imageTop || 0,
          left: imageLeft || 0,
          fieldType: FIELD_TYPES.QR_CODE,
          selectable: true,
          text: qrCodeId
        });
        img.setControlsVisibility({
          tl: false, tr: false, bl: false,
          br: false, mt: false, mb: false,
          ml: false, mr: false
        });
        if (canvasField) {
          canvasField.add(img);
          canvasField.bringToFront(img);
          canvasField.renderAll();
        }
      }
    );
  }

  const selectObject = (object) => {
    const selectedObject = object.selected[0];
    const {
      text,
      fontFamily,
      fontWeight,
      fontSize,
      textAlign,
      fill,
      opacity,
      fieldType,
      QR
    } = selectedObject;
    if (selectedObject.text) {
      onSetCurrentField({
        text,
        fontFamily,
        fontWeight,
        fontSize,
        textAlign,
        fill,
        opacity: opacity || 1,
        fieldType,
        QR
      });
    }
    if (selectedObject.fieldType === FIELD_TYPES.QR_CODE) {
      onSetCurrentField({
        opacity: opacity || 1,
        fieldType,
        QR,
        text,
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: 100,
        textAlign: 'left',
        fill: '#000000'
      });
    }
  }

  // eslint-disable-next-line no-shadow
  const removeField = (fieldToRemove) => {
    if (fieldToRemove && canvas.fieldNames?.includes(fieldToRemove)) {
      const objectToRemove = canvas.canvasField.getObjects().find(obj => obj.text === fieldToRemove);
      if (objectToRemove) {
        canvas.canvasField.remove(objectToRemove);
        onSetCanvas({
          ...canvas,
          fieldNames: canvas.fieldNames.filter(field => field !== fieldToRemove)
        })
      }
    }
  }

  // Initial canvas
  useEffect(() => {
    const canvasField = new fabric.Canvas(`canvas${certificateId}`, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      preserveObjectStacking: true,
      backgroundColor: '#FFFFFF'
    });

    // Loading default canvas data with default fields
    let canvasData = defaultFields;
    // Reassigning canvasData if there's a certificate with the current ID
    if (certificateId && localStorage && localStorage.getItem(certificateId)) {
      canvasData = JSON.parse(localStorage.getItem(certificateId));
    }
    // if (localStorage.getItem(certificateId)) {
      // const canvasData = JSON.parse(localStorage.getItem(certificateId));
      const canvasFieldNames = [];
      let canvasImage = '';
      canvasData.objects.forEach((object) => {
        // Adding textboxes from localStorage to the canvas
        if (object.type === 'textbox') {
          canvasFieldNames.push(object.text);
          const {
            fontFamily, fill, fontWeight, fontSize, top, left, height, width,
            textAlign, opacity, text, formFieldName, customElementType, direction
          } = object;
          const newTextObject =
            new fabric.Textbox(object.text, {
              fontFamily,
              fill,
              fontWeight,
              fontSize,
              padding: 5,
              top,
              left,
              height: height || 100,
              width,
              editable: true,
              textAlign,
              text,
              opacity: opacity || 1,
              lockScalingY: true,
              formFieldName,
              customElementType,
              fieldType: FIELD_TYPES.text
            });
          newTextObject.set({
            borderColor: '#3191EA',
            borderScaleFactor: 2,
            cornerColor: '#3191EA'
          });
          newTextObject.setControlsVisibility({
            tl: false, tr: false, bl: false,
            br: false, mt: false, mb: false
          });
          canvasField.add(newTextObject);
          canvasField.bringToFront(newTextObject);
        }
        // Adding an image
        if (object.type === 'image') {
          if (object.formFieldName === bgImageId) {
            fabric.Image.fromURL(
              object.src,
              (img) => {
                // Scaling the image
                img.scaleToWidth(CANVAS_WIDTH);
                img.scaleToHeight(CANVAS_HEIGHT);
                // Setting an ID to the image
                img.set({
                  formFieldName: bgImageId,
                  customElementType: "background",
                  top: 0,
                  left: 0,
                  selectable: true,
                  borderColor: '#3191EA',
                  borderScaleFactor: 2,
                  cornerColor: '#3191EA',
                  width: CANVAS_WIDTH,
                  height: CANVAS_HEIGHT
                });
                // Removing old images
                const imagesToRemove = canvasField.getObjects()
                  .filter(obj => obj.type === 'image' && obj.formFieldName !== qrCodeId);
                canvasField.remove(...imagesToRemove);
                canvasField.add(img);
                // Preventing the image from overlapping with the text fields
                canvasField.sendToBack(img);
                canvasField.renderAll();
              });
            canvasImage = object.src;
          }
          if (object.formFieldName === qrCodeId) {
            canvasFieldNames.push(qrCodeId);
            uploadImage(object.src, qrCodeId, object.top, object.left, object.QR, canvasField);
          }
        }
      });
      // Setting the canvas with the fields from localStorage
      onSetCanvas({
        ...canvas,
        canvasField,
        fieldNames: canvasFieldNames,
        image: canvasImage || currentImage
      });
      if (canvasImage) {
        onSetCurrentImage(canvasImage);
      }
      onSetFieldNames(canvasFieldNames);
    // }
    // else {
    //
    //   // No saved canvas, loading default fields
    //   onSetCanvas({
    //     ...canvas,
    //     image: currentImage,
    //     canvasField
    //   });
    // }

    canvasField.on('selection:created', (object) => {
      selectObject(object);
    });

    canvasField.on('selection:updated', (object) => {
      selectObject(object);
    });

    canvasField.on('mousedown', (e) => {
      console.log(e);
    });
  }, []);

  useEffect(() => {
    if (currentField.text && !canvas.fieldNames.includes(currentField.text)) {
      canvas.canvasField?.discardActiveObject().renderAll();
      if (currentField.fieldType === FIELD_TYPES.TEXT) {
        addText(currentField);
      } else if (currentField.fieldType === FIELD_TYPES.QR_CODE) {
        uploadImage(defaultQR, qrCodeId, 0, 0, currentField.QR, canvas.canvasField);
      }
      onSetCanvas({
        ...canvas,
        fieldNames: [...canvas.fieldNames, currentField.text]
      });
      console.log('useEffect currentField.text: ', [...canvas.fieldNames, currentField.text]);
      // If we add a field, remove it and add it again, fieldToRemove stays the same
      // But the current field resets to default with an empty text
      // We handle this situation below
    } else if (!currentField.text && fieldToRemove) {
      removeField(fieldToRemove);
    }
  }, [currentField.text])

  useEffect(() => {
    if (canvas.canvasField?.getActiveObject()) {
      canvas.canvasField.getActiveObject().set('fontFamily', currentField.fontFamily);
      canvas.canvasField.renderAll();
    }
  }, [currentField.fontFamily]);

  useEffect(() => {
    if (canvas.canvasField?.getActiveObject() && currentField.fieldType === FIELD_TYPES.QR_CODE) {
      canvas.canvasField.getActiveObject().set('QR', {
        ...currentField.QR
      });
      canvas.canvasField.renderAll();
    }
  }, [currentField.QR]);

  useEffect(() => {
    if (canvas.canvasField?.getActiveObject()) {
      canvas.canvasField.getActiveObject().set('fontWeight', currentField.fontWeight);
      canvas.canvasField.renderAll();
    }
  }, [currentField.fontWeight]);

  useEffect(() => {
    if (canvas.canvasField?.getActiveObject()) {
      canvas.canvasField.getActiveObject().set('fontSize', currentField.fontSize);
      canvas.canvasField.renderAll();
    }
  }, [currentField.fontSize]);

  useEffect(() => {
    if (canvas.canvasField?.getActiveObject()) {
      canvas.canvasField.getActiveObject().set('textAlign', currentField.textAlign);
      canvas.canvasField.renderAll();
    }
  }, [currentField.textAlign]);

  useEffect(() => {
    if (canvas.canvasField?.getActiveObject()) {
      canvas.canvasField.getActiveObject().set('fill', currentField.fill);
      canvas.canvasField.renderAll();
    }
  }, [currentField.fill]);

  useEffect(() => {
    if (canvas.canvasField?.getActiveObject()) {
      canvas.canvasField.getActiveObject().set('opacity', currentField.opacity);
      canvas.canvasField.renderAll();
    }
  }, [currentField.opacity]);

  // Removing a field
  useEffect(() => {
    removeField(fieldToRemove);
  }, [fieldToRemove]);

  // Uploading a background image
  useEffect(() => {
    if (currentImage && currentImage?.length !== 0) {
      fabric.Image.fromURL(
        currentImage,
        (img) => {
          // Scaling the image
          img.scaleToWidth(CANVAS_WIDTH);
          img.scaleToHeight(CANVAS_HEIGHT);
          // Setting an ID to the image and locking it
          img.set({
            formFieldName: bgImageId,
            customElementType: "background",
            top: 0,
            left: 0,
            selectable: true,
            borderColor: '#3191EA',
            borderScaleFactor: 2,
            cornerColor: '#3191EA',
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT
          });
          // Removing the old image from the canvas
          if (canvas.image.length !== 0 && canvas.canvasField) {
            const imagesToRemove = canvas.canvasField.getObjects()
              .filter(obj => obj.type === 'image' && obj.formFieldName !== qrCodeId);
            canvas.canvasField.remove(...imagesToRemove);
          }
          if (canvas.canvasField) {
            canvas.canvasField.add(img);
            // Preventing the image from overlapping with the text fields
            canvas.canvasField.sendToBack(img);
            canvas.canvasField.renderAll();
          }
        }
      );
      onSetCanvas({
        ...canvas,
        image: currentImage
      })
    }
  }, [currentImage]);

  return (
    <div>
      <div className="canvas-zoom">
        <div className="cert-info">{certInfo}</div>
        <canvas
          id={`canvas${certificateId}`}
          className="canvas-field"
        />
      </div>
      <div className="zoom-field-block" style={{position: "relative", zIndex: 20}}>
        <div className="zoom-field">
          <div
            className={`zoom-icon-container ${canvasScale <= 0.7 ? 'disabled' : ''}`}
            onClick={() => {
              setCanvaScale((prevScale) => prevScale <= 0.7 ? prevScale : prevScale - 0.1);
              document.getElementsByClassName('canvas-zoom')[0].style.transform = `scale(${canvasScale})`;
            }}
          >
            <MinusOutlined
              className="zoom-icon"
              disabled={canvasScale <= 0.7}
              style={{fontSize: "20px"}}
            />
          </div>
          <div className="reset-block"
               onClick={() => {
                 setCanvaScale(1);
                 document.getElementsByClassName('canvas-zoom')[0].style.transform = `scale(1)`;
               }}>100%
          </div>
          <div
            className={`zoom-icon-container ${canvasScale >= 1.3 ? 'disabled' : ''}`}
            onClick={() => {
              setCanvaScale((prevScale) => prevScale >= 1.3 ? prevScale : prevScale + 0.1);
              document.getElementsByClassName('canvas-zoom')[0].style.transform = `scale(${canvasScale})`;
            }}
          >
            <PlusOutlined
              disabled={canvasScale >= 1.3}
              className="zoom-icon"
              style={{fontSize: "20px"}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CanvasEditor;
