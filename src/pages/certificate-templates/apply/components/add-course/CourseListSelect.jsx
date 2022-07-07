import React from 'react';
import {renderToString} from "react-dom/server";
// Components
import {Select} from 'antd';
import MuiTag from "@src/components/shared/MuiTag";
import KcSelect from "@src/components/shared/KcSelect/KcSelect";
import MuiValue from "@src/components/shared/MuiValue";

// Hooks
import {useMui} from "@src/hooks/useMui";
// Store
import {useStore} from "@src/store/Context";
import {ApplyCoursesContext} from "@src/store/certificate-templates/ApplyCourses";
import {observer} from "mobx-react-lite";

const {Option} = Select;

/**
 * Courses in a course list table
 * @param pageSize
 * @param setPage
 * @param setCurrentCourseList
 * @param setLoading - loader for the select course table
 * @param courseNameFilter
 * @param setSelectedRows - changing selected courses
 * @returns {JSX.Element}
 * @constructor
 */
const CourseListSelect = ({
                            pageSize,
                            setPage,
                            setCurrentCourseList,
                            setLoading,
                            courseNameFilter,
                            setSelectedRows
                          }) => {
  // Store
  const store = useStore(ApplyCoursesContext);
  const courseLists = store.getCourseLists();
  // Data
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");

  /**
   * Handle option select
   * @param value
   * @param option
   */
  const handleChange = (value, option) => {
    // Removing selected courses when changing a course list
    setSelectedRows([]);
    store.setCurrentCourseListCourses(option.value, 1, pageSize, courseNameFilter, setLoading);
    setCurrentCourseList(option.value);
    setPage(1);
  }

  return (
    <KcSelect
      showSearch
      className="w-max"
      placeholder={<MuiTag muiKey="none_placeholder" muiGroup="L2Default" muiDefault="None"/>}
      onChange={(value, options) => handleChange(value, options)}
      defaultValue={renderToString(<MuiValue
        muiKey="all-courses"
        muiGroup="LMS2CertificateTemplates"
        muiDefault="All courses"
      />)}
    >
      <Option value="all-courses" key="all-courses">
        <MuiLMS2Certificate
          muiKey="all-courses"
          muiDefault="All courses"
        />
      </Option>
      {
        courseLists?.map((list, i) =>
          <Option
            value={list.course_list_id ? list.course_list_id : list.id}
            key={`list-${i}`}
          >
            {list.name}
          </Option>
        )
      }
    </KcSelect>
  )
}

export default observer(CourseListSelect);
