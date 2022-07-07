import React, {useState, useRef} from 'react';
// Components
import {Carousel, Button, Popconfirm, Space} from "antd";
import KcTutorial from "@src/components/shared/KcTutorial/KcTutorial";
import {QuestionCircleIcon} from "@src/assets/icons/icons-pack";
import Step1 from "@src/pages/certificate-templates/apply/components/tutorial/Step1";
import Step2 from "@src/pages/certificate-templates/apply/components/tutorial/Step2";
import Step3 from "@src/pages/certificate-templates/apply/components/tutorial/Step3";
import Step4 from "@src/pages/certificate-templates/apply/components/tutorial/Step4";
import Step5 from "@src/pages/certificate-templates/apply/components/tutorial/Step5";

// Hooks
import {useMui} from "@src/hooks/useMui"

// Constants
import {LIST_PATH, TUTORIAL_VIEWED} from "@src/pages/certificate-templates/certificates.constants";

// Styles
import "./Tutorial.scss";

const Tutorial = () => {
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  // Data
  const slides = [
    {
      html: <Step1/>
    },
    {
      html: <Step2/>
    },
    {
      html: <Step3/>
    },
    {
      html: <Step4/>
    },
    {
      html: <Step5/>
    }
  ];
  // Hooks
  const [tutorialVisible, setTutorialVisible] = useState(
    localStorage && !JSON.parse(localStorage.getItem(TUTORIAL_VIEWED))
  );

  /**
   * Handle OK button click. Don't automatically show tutorial after that
   */
  const onTutorialClose = () => {
    setTutorialVisible(false);
    localStorage.setItem(TUTORIAL_VIEWED, JSON.stringify(true));
  }

  /**
   * Handle visibility change
   * @param visible
   */
  const onVisibleChange = (visible) => {
    setTutorialVisible(visible);
  }

  return (
    <KcTutorial
      slides={slides}
      onClose={onTutorialClose}
      onVisibleChange={onVisibleChange}
      tutorialVisible={tutorialVisible}
    >
      <div className="list-course-create__tutorial">
        <Space size={4}>
          <div className="header">
            <MuiLMS2Certificate
              miuKey="apply-to-courses"
              muiDefault="Apply to courses"
            />
            <div className="tutorial-button"><QuestionCircleIcon/></div>
          </div>
        </Space>
      </div>
    </KcTutorial>
  )
}

export default Tutorial;
