import React, {useState} from 'react';
import {Select} from 'antd';
import MuiTag from "@src/components/shared/MuiTag";
import MultipleSelectSearch from "@src/components/shared/KcSelect/MultipleSelectSearch";

const { Option, OptGroup } = Select;

const FilterCourse = (props) => {
  const {
    changeFilter,
    coursesList,
    searchData
  } = props;
  const [selected, setSelected] = useState([]);
  const [shownSelected, setShownSelected] = useState([]);
  const [searchValue, setSearchValue] = useState();

  /**
   * Options for course select
   * @returns {null|*}
   */
  const showCourses = () => {
    if (coursesList) {
      return coursesList.map(course => {
        const searchItems = <Option
          className="image-item"
          value={course.id}
          key={course.id}
          title={course.title}
          course_id={course.course_id}
          course={course}
        >
          <img className="mright-8" src={`https://cdn0.kcexp.pro/opencontent/courses/previews/${course.course_id}/400.jpg`} width="80" height="45" />
          {`[${course.course_id}] ${course.title}`}
        </Option>;

        if (searchValue === '' && !{}.propertyIsEnumerable.call(shownSelected, course.id)) {
          return course?.isAllCourses ? null : searchItems
        }
        if (searchValue !== '') {
          return course?.isAllCourses ? null : searchItems;
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
      selectedGroup[option.value] = {
        id: option?.value,
        course: option.course
      };
    })

    setSelected(selectedGroup);
    changeFilter(value, options);
  }

  return (
    <MultipleSelectSearch
      fetchOnSearch={searchData}
      handleChange={handleChange}
      selected={selected}
      setShownSelected={setShownSelected}
      shownSelected={shownSelected}
      setSearchValue={setSearchValue}
      searchValue={searchValue}
      showImage={true}
    >
      <OptGroup label={<MuiTag muiKey="suggested-course-lists" muiGroup="LMS2Reminder" muiDefault="Suggested courses" />}>
        {showCourses()}
      </OptGroup>
    </MultipleSelectSearch>
  )
}

export default FilterCourse;
