import React from 'react';
// Hooks
import {useMui} from "@src/hooks/useMui"
// Styles
import "./Tutorial.scss";

const Step1 = () => {
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  return (
    <div>
      <p className="text">
        <MuiLMS2Certificate
          muiKey="tutorial-explanation-step-1"
          muiDefault="Each course may have only one assigned certificate for each priority level. Certificates are displayed according to priority level."
        />
      </p>
      <div className="course-table">
        <div className="row">
          <div className="text">
            <MuiLMS2Certificate muiKey="course" muiDefault="Course"/>
          </div>
          <div className="steps">
            <div className="step"/>
            <div className="step"/>
            <div className="step"/>
            <div className="step"/>
          </div>
        </div>
        <div className="row">
          <div className="text">
            <MuiLMS2Certificate muiKey="course-type" muiDefault="Course type"/>
          </div>
          <div className="steps">
            <div className="step"/>
            <div className="step"/>
            <div className="step"/>
          </div>
        </div>
        <div className="row">
          <div className="text">
            <MuiLMS2Certificate muiKey="all-courses" muiDefault="All courses"/>
          </div>
          <div className="steps">
            <div className="step"/>
            <div className="step"/>
          </div>
        </div>
        <div className="row">
          <div className="text">
            <MuiLMS2Certificate muiKey="default" muiDefault="Default"/>
          </div>
          <div className="steps">
            <div className="step"/>
          </div>
        </div>
      </div>
      <div className="default">
        <div className="step"/>
        <div className="text">
          — <MuiLMS2Certificate
          muiKey="priority-level"
          muiDefault="Priority level"
        />
        </div>
      </div>
    </div>
  )
}

export default Step1;
