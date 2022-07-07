import React from 'react';
import "../apply/components/add-course/AddCourse.scss";

const NotFoundContent = ({ children }) => (
    <div className="notifications__table-empty-text">
      {children}
    </div>
  )

export default NotFoundContent;
