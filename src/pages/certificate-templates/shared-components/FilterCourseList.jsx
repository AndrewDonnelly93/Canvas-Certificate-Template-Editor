import React, {useEffect, useState} from 'react';
import {Select} from 'antd';
import MuiTag from "@src/components/shared/MuiTag";
import Courses from "@src/services/api/accounts/Courses";
import FilterSelectMultipleSearch from "@src/components/shared/KcSelect/FilterSelectMultipleSearch";

const { Option, OptGroup } = Select;

const FilterCourseList = ({ changeFilter }) => {
  const [courseLists, setCourseLists] = useState([]);
  const [defaultCourseLists, setDefaultCourseLists] = useState([]);
  const [selected, setSelected] = useState([]);
  const [shownSelected, setShownSelected] = useState([]);

  /**
   * Load data for filters
   */
  useEffect(() => {
    Courses.list(4).then((result) => {
      setDefaultCourseLists(result.data.response);
      setCourseLists(result.data.response);
    });
  }, []);

  /**
   * Search course lists
   * @param search
   * @returns {Promise<unknown>|Promise<unknown[]>}
   */
  const searchData = search => {
    if (search) {
      return Courses.list(null, search).then((result) => {
        setCourseLists(result.data.response);
      });
    }

    return new Promise((resolve) => {
      setCourseLists(defaultCourseLists);
      resolve();
    })
  }

  /**
   * Options for course list select
   * @returns {null|*}
   */
  const getCourseListsOptions = () => {
    if (courseLists) {
      return courseLists.map(list => {
        if (!{}.propertyIsEnumerable.call(shownSelected, list.id)) {
          return list?.isAllCourses ? null : <Option value={list.id} key={list.id}>{list.name}</Option>
        }
        return null;
      });
    }

    return null;
  }

  /**
   * Handle option select
   * @param value
   * @param options
   */
  const handleChange = (value, options) => {
    const selectedGroup = [];

    options.forEach(option => {
      selectedGroup[option.value] = {id: option?.value, name: option.children};
    })

    setSelected(selectedGroup);
    changeFilter("course_lists", value);
  }

  return (
    <FilterSelectMultipleSearch
      fetchOnSearch={searchData}
      handleChange={handleChange}
      selected={selected}
      setShownSelected={setShownSelected}
      shownSelected={shownSelected}
    >
      <OptGroup label={<MuiTag muiKey="suggested-course-lists" muiGroup="LMS2Reminder" muiDefault="Suggested course lists" />}>
        {getCourseListsOptions()}
      </OptGroup>
    </FilterSelectMultipleSearch>
  )
}

export default FilterCourseList;
