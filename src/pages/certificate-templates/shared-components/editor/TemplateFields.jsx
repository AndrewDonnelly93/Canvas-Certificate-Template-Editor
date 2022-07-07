import React, {useState} from "react";

// Components
import {Select} from "antd";
import {renderToString} from "react-dom/server";
import MuiValue from "@src/components/shared/MuiValue";
import ButtonAction from "@src/components/shared/ButtonAction/ButtonAction";
import {PlusIcon} from "@src/assets/icons/icons-pack";
import KcSelect from "@src/components/shared/KcSelect/KcSelect";
import {
  CloseOutlined
} from "@ant-design/icons";
import fields from "@src/pages/certificate-templates/shared-components/editor/Fields";

// Hooks
import {useMui} from "@src/hooks/useMui";

// Styles
import "./Editor.scss";

// Constants
import {FIELD_TYPES} from "@src/pages/certificate-templates/certificates.constants";

const {Option, OptGroup} = Select;

const fieldsSelector = fields.map((fieldGroup) => (
  <OptGroup key={fieldGroup.group} label={fieldGroup.group}>
    {fieldGroup.items.map((fieldItem) => (
      <Option value={fieldItem.key} key={fieldItem.key}>{fieldItem.value}</Option>
    ))}
  </OptGroup>
));

const TemplateFields = ({
                          currentField,
                          fieldNames,
                          onChangeNames,
                          onEditCurrentField,
                          canvas
                        }) => {
  console.log('fieldNames (template fields): ', fieldNames);
  const defaultCurrentField = {
    text: '',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 400,
    textAlign: 'left',
    fill: '#000000',
    opacity: 1,
    fieldType: FIELD_TYPES.TEXT,
    QR: {
      style: '',
      url: '',
      fill: '#000000',
      backgroundColor: '#000000'
    }
  };

  // Data
  const selectedFields = fieldNames?.map(fieldName => (
    <div className="editor-field" key={fieldName} onClick={() => {
      if (canvas && canvas.canvasField) {
        canvas.canvasField.getObjects().forEach((o) => {
          if (o.customId === fieldName) {
            canvas.canvasField.setActiveObject(o);
            canvas.canvasField.renderAll();
          }
        })
      }
    }}>
      {fieldName}
      <CloseOutlined
        className="remove-field-icon"
        style={{fontSize: "14px"}}
        onClick={() => {
          onChangeNames(fieldName, 'REMOVE_ITEM');
          // onEditCurrentField(defaultCurrentField);
        }}
      />
    </div>
  ));

  // Hooks
  const [selectVisible, setSelectVisible] = useState(false);
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");

  return (
    <>
      <ButtonAction
        handleClick={() => setSelectVisible(true)}
        name={<MuiL2Default muiKey="add-field" muiDefault="Add field"/>}
        prefix={<PlusIcon/>}
        buttonClassName="add-field-button"
        prefixClassName="button-action-icon"
        textClassName="add-field-text"
      />
      {selectVisible &&
      <KcSelect
        placeholder="Select from list"
        className="field-selector"
        defaultValue={renderToString(
                <MuiValue
                  muiKey="select-from-list"
                  muiGroup="L2Default"
                  muiDefault="Select from list"
                />
              )}
        onChange={(_, option) => {
          onChangeNames(option.children, 'ADD_ITEM');
          onEditCurrentField({
            ...currentField,
            text: option.children,
            fieldType: option.children === 'QR Code' ? FIELD_TYPES.QR_CODE : FIELD_TYPES.TEXT,
            QR: {
              style: '',
              url: '',
              fill: '#000000',
              backgroundColor: '#000000'
            }
          });
          setSelectVisible(false);
        }}>
        {fieldsSelector}
      </KcSelect>
      }
      {selectedFields}
    </>
  )
};

export default TemplateFields;
