import React from 'react';
// Hooks
import {useMui} from "@src/hooks/useMui";
// Assets
import certIcon from "@src/assets/images/certificate-templates/certificate-icon.png";
import arrowIcon from "@src/assets/images/certificate-templates/arrow-icon.png";
import courseIcon from "@src/assets/images/certificate-templates/certificate-course-icon.png";
import courseTypeIcon from "@src/assets/images/certificate-templates/course-type-icon.png";
// Styles
import "./Tutorial.scss";

const Step3 = () => {
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  return (
    <>
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
            <img src={courseTypeIcon} alt="course-type-icon" width={60} height={60}/>
          </div>
          <div className="text"><MuiLMS2Certificate
            muiKey="course-type"
            muiDefault="Course type"
          /></div>
        </div>
      </div>
      <p className="text">
        <MuiLMS2Certificate
          muiKey="tutorial-explanation-step-3"
          muiDefault="“Course type”, has high priority level. Courses that have no assigned certificate will display the certificate assigned to “Course type”"
        />
      </p>
    </>
  )
}

export default Step3;
