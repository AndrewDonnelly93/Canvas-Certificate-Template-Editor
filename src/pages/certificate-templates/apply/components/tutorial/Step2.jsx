import React from 'react';
// Hooks
import {useMui} from "@src/hooks/useMui";
// Assets
import certIcon from "@src/assets/images/certificate-templates/certificate-icon.png";
import arrowIcon from "@src/assets/images/certificate-templates/arrow-icon.png";
import courseIcon from "@src/assets/images/certificate-templates/certificate-course-icon.png";
// Styles
import "./Tutorial.scss";

const Step2 = () => {
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  return (
    <div>
      <div className="icons-group">
        <div className="certificate">
          <div className="img-wrapper">
            <img src={certIcon} alt="cert-icon" width={47} height={64}/>
          </div>
          <div className="text"><MuiLMS2Certificate
            muiKey="certificate"
            muiDefault="Certificate"
          /></div>
        </div>
        <div className="img-wrapper img-wrapper_arrow">
          <img src={arrowIcon} alt="arrow-icon" width={41} height={15}/>
        </div>
        <div className="course">
          <div className="img-wrapper">
            <img src={courseIcon} alt="course-icon" width={57} height={57}/>
          </div>
          <div className="text"><MuiLMS2Certificate
            muiKey="course"
            muiDefault="Course"
          /></div>
        </div>
      </div>
      <p className="text">
        <MuiLMS2Certificate
          muiKey="tutorial-explanation-step-2"
          muiDefault="“Course” has the highest priority level. If a course has an assigned certificate it will be displayed to the user."
        />
      </p>
    </div>
  )
}

export default Step2;
