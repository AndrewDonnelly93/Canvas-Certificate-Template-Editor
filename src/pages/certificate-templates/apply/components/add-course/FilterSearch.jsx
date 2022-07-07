import React, {useState} from 'react';
import {renderToString} from "react-dom/server";

// Components
import {Input} from "antd";
import {SearchIcon} from "@src/assets/icons/icons-pack";
import MuiValue from "@src/components/shared/MuiValue";

// Styles
import "./FilterSearch.scss";

const FilterSearch = ({changeFilter}) => {
  const inputDelay = 1000;

  // Hooks
  const [inputTimeout, setInputTimeout] = useState();

  const onInputChange = e => {
    clearTimeout(inputTimeout);
    setInputTimeout(
      setTimeout(() => {
        changeFilter("courseName", e.target.value)
      }, inputDelay)
    );
  }

  return (
    <Input
      className="filter-search"
      placeholder={renderToString(
        <MuiValue
          muiKey="course-name-search"
          muiGroup="LMS2CertificateTemplates"
          muiDefault="Search courses"
        />
      )}
      prefix={<SearchIcon width="14px" height="14px" />}
      onChange={onInputChange}
    />
  )
}

export default FilterSearch;
