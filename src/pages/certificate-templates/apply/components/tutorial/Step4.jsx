import React from 'react';
// Hooks
import {useMui} from "@src/hooks/useMui";
// Assets
import certIcon from "@src/assets/images/certificate-templates/certificate-icon.png";
import arrowIcon from "@src/assets/images/certificate-templates/arrow-icon.png";
import courseIcon from "@src/assets/images/certificate-templates/certificate-course-icon.png";
import courseTypeIcon from "@src/assets/images/certificate-templates/course-type-icon.png";
import allCoursesIcon from "@src/assets/images/certificate-templates/all-courses-icon.png";
// Styles
import "./Tutorial.scss";

const Step4 = () => {
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
            <img src={allCoursesIcon} alt="all-courses-icon" width={62} height={62}/>
          </div>
          <div className="text"><MuiLMS2Certificate
            muiKey="all-courses"
            muiDefault="All courses"
          /></div>
        </div>
      </div>
      <p className="text">
        <MuiLMS2Certificate
          muiKey="tutorial-explanation-step-4"
          muiDefault="“All courses”, has low priority level. Courses that do not have an assigned certificate for “Courses” or “Course type” will display the certificate for “All courses”."
        />
      </p>
    </>
  )
}

export default Step4;
