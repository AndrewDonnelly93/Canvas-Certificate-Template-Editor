import React, {useEffect} from "react";

// Components
import {renderToString} from "react-dom/server";
import {
  Input,
  Tooltip,
  Select
} from "antd";
import MuiValue from "@src/components/shared/MuiValue";
import {
  AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined
} from '@ant-design/icons';
import KcSelect from "@src/components/shared/KcSelect/KcSelect";

// Helpers
import {useDebouncedCallback} from 'use-lodash-debounce';

// Hooks
import {useMui} from "@src/hooks/useMui";

// Styles
import "./Editor.scss";
import {FIELD_TYPES} from "../../certificates.constants";

const familyNames = ['Arial', 'Lato', 'Roboto'];
const fontWeights = [
  {
    key: 'Thin',
    value: 100
  },
  {
    key: 'Light',
    value: 300
  },
  {
    key: 'Normal',
    value: 400
  },
  {
    key: 'Medium',
    value: 500
  },
  {
    key: 'Bold',
    value: 700
  }
];
const fontSizes = [12, 14, 16, 18, 20, 24, 26, 30];

const {Option} = Select;

const QRStyles = [
  {
    key: 'Style 1',
    value: 'red'
  },
  {
    key: 'Style 2',
    value: 'green'
  }, {
    key: 'Style 3',
    value: 'yellow'
  },
  {
    key: 'Style 4',
    value: 'brown'
  }
];

const FieldSettings = ({
                         currentField,
                         onChangeFontSetting,
                         certificateId
                       }) => {
  // Hooks
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");
  const debouncedSetColor = useDebouncedCallback(onChangeFontSetting, 500);
  useEffect(() => {
    console.log('current Field: ', currentField);
  }, [currentField.text]);

  if (!currentField.text) {
    console.log('current Field text', currentField.text);
    return (
      <>
        <div className="field-text">
          <MuiLMS2Certificate muiKey="no-fields-selected" muiDefault="No fields selected"/>
        </div>
      </>
    )
  }

  if (currentField.fieldType === FIELD_TYPES.QR_CODE) {
    return (
      <div className="qr-field-settings">
        {/* QR Style */}
        <div className="qr-style">
          <div className="field-label">
            <MuiL2Default muiKey="style" muiDefault="Style"/>
          </div>
          <div className="qr-style-options">
            {
              QRStyles.map((qrStyle) => (
                <div
                  className={`qr-style-option ${currentField.QR.style === qrStyle.value ? 'active' : ''}`}
                  key={qrStyle.key}
                  style={{background: `${qrStyle.value}`}}
                  onClick={() => onChangeFontSetting({
                    ...currentField,
                    QR: {
                      ...currentField.QR,
                      style: qrStyle.value
                    }
                  })}
                />
              ))
            }
          </div>
        </div>

        {/* QR Code colour */}
        <div className="color-opacity">
          <div className="color">
            <div className="field-label">
              <MuiL2Default muiKey="qr-code-color" muiDefault="QR-code color"/>
            </div>
            <label className="color-picker-label" htmlFor={`color-picker-qr-color${certificateId}`}>
              <div className="color-block" style={{background: currentField.QR.fill}}>
                <input
                  type="color"
                  value={currentField.QR.fill || '#000000'}
                  size="10"
                  className="color-picker-input"
                  id={`color-picker-qr-color${certificateId}`}
                  onChange={(e) => debouncedSetColor({
                    ...currentField,
                    QR: {
                      ...currentField.QR,
                      fill: e.target.value
                    }
                  })}
                />
              </div>
              {currentField.QR.fill}
            </label>
          </div>
        </div>

        {/* QR background colour and opacity */}
        <div className="color-opacity">
          <div className="color">
            <div className="field-label">
              <MuiL2Default muiKey="bg-color" muiDefault="BG color"/>
            </div>
            <label className="color-picker-label" htmlFor={`color-picker-qr-bg${certificateId}`}>
              <div className="color-block" style={{background: currentField.QR.backgroundColor}}>
                <input
                  type="color"
                  value={currentField.fill || '#000000'}
                  size="10"
                  className="color-picker-input"
                  id={`color-picker-qr-bg${certificateId}`}
                  onChange={(e) => debouncedSetColor({
                    ...currentField,
                    QR: {
                      ...currentField.QR,
                      backgroundColor: e.target.value
                    }
                  })}
                />
              </div>
              {currentField.QR.backgroundColor}
            </label>

          </div>
          <div className="opacity">
            <div className="field-label">
              <MuiL2Default muiKey="opacity" muiDefault="Opacity"/>
            </div>
            <Input
              className="opacity"
              placeholder={renderToString(
                <MuiValue
                  muiKey="opacity-input"
                  muiGroup="LMS2CertificateTemplates"
                  muiDefault="Opacity"
                />
              )}
              value={currentField.opacity * 100}
              onChange={(e) => onChangeFontSetting({
                ...currentField,
                opacity: (e.target.value / 100)
              })}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
      <>
        {/* Font family */}
        <KcSelect
          defaultValue={currentField.fontFamily}
          className='field-selector'
          style={{width: '100%'}}
          value={currentField.fontFamily || familyNames[0]}
          onChange={(value) => onChangeFontSetting({
            ...currentField,
            fontFamily: value
          })}
        >
          {
            familyNames.map((familyName, i) => (
              <Option value={familyName} key={i}>{familyName}</Option>
            ))
          }
        </KcSelect>

        {/* Font weight */}
        <KcSelect
          defaultValue={currentField.fontWeight}
          className='field-selector'
          style={{width: '100%'}}
          value={currentField.fontWeight || fontWeights[0]}
          onChange={(value) => onChangeFontSetting({
            ...currentField,
            fontWeight: value
          })}
        >
          {
            fontWeights.map((fontWeight) => (
              <Option value={fontWeight.value} key={fontWeight.value}>{fontWeight.key}</Option>
            ))
          }
        </KcSelect>

        {/* Font size and alignment */}
        <div className="font-size">
          <div className="field-label">
            <MuiL2Default muiKey="size" muiDefault="Size"/>
          </div>
        </div>
        <div className="font-size-alignment">
          <KcSelect
            defaultValue={currentField.fontSize}
            value={currentField.fontSize || fontSizes[0]}
            className='field-selector'
            style={{width: '60%'}}
            onChange={(value) => onChangeFontSetting({
              ...currentField,
              fontSize: value
            })}
          >
            {
              fontSizes.map((fontSize) => (
                <Option key={fontSize} value={fontSize}>{fontSize}</Option>
              ))
            }
          </KcSelect>
          <div className="alignment">
            <Tooltip
              mouseEnterDelay={0.55}
              key="alignment-left-tooltip"
              title={renderToString(
                <MuiValue
                  muiGroup="L2Default"
                  muiKey="alignment-left-tooltip"
                  muiDefault="Align left"
                />
              )}
              placement="left"
            >
              <AlignLeftOutlined
                className={`alignment-icon ${currentField.textAlign === 'left' ? 'active' : ''}`}
                style={{fontSize: '20px'}}
                onClick={() => onChangeFontSetting({
                  ...currentField,
                  textAlign: 'left'
                })}
              />
            </Tooltip>
            <Tooltip
              mouseEnterDelay={0.55}
              key="alignment-centre-tooltip"
              title={renderToString(
                <MuiValue
                  muiGroup="L2Default"
                  muiKey="alignment-centre-tooltip"
                  muiDefault="Align center"
                />
              )}
              placement="left"
            >
              <AlignCenterOutlined
                className={`alignment-icon ${currentField.textAlign === 'center' ? 'active' : ''}`}
                style={{fontSize: '20px'}}
                onClick={() => onChangeFontSetting({
                  ...currentField,
                  textAlign: 'center'
                })}
              />
            </Tooltip>
            <Tooltip
              mouseEnterDelay={0.55}
              key="alignment-right-tooltip"
              title={renderToString(
                <MuiValue
                  muiGroup="L2Default"
                  muiKey="alignment-right-tooltip"
                  muiDefault="Align right"
                />
              )}
              placement="left"
            >
              <AlignRightOutlined
                className={`alignment-icon ${currentField.textAlign === 'right' ? 'active' : ''}`}
                style={{fontSize: '20px'}}
                onClick={() => onChangeFontSetting({
                  ...currentField,
                  textAlign: 'right'
                })}
              />
            </Tooltip>
          </div>
        </div>

        {/* Colour and opacity */}
        <div className="color-opacity">
          <div className="color">
            <div className="field-label">
              <MuiL2Default muiKey="color" muiDefault="Color"/>
            </div>
            <label className="color-picker-label" htmlFor={`color-picker${certificateId}`}>
              <div className="color-block" style={{background: currentField.fill}}>
                <input
                  type="color"
                  value={currentField.fill || '#000000'}
                  size="10"
                  className="color-picker-input"
                  id={`color-picker${certificateId}`}
                  onChange={(e) => debouncedSetColor({
                    ...currentField,
                    fill: e.target.value
                  })}
                />
              </div>
              {currentField.fill}
            </label>

          </div>
          <div className="opacity">
            <div className="field-label">
              <MuiL2Default muiKey="opacity" muiDefault="Opacity"/>
            </div>
            <Input
              className="opacity"
              placeholder={renderToString(
                <MuiValue
                  muiKey="opacity"
                  muiGroup="L2Default"
                  muiDefault="Opacity"
                />
              )}
              value={currentField.opacity * 100}
              onChange={(e) => onChangeFontSetting({
                ...currentField,
                opacity: (e.target.value / 100)
              })}
            />
          </div>
        </div>
      </>
    );
};

export default FieldSettings;
