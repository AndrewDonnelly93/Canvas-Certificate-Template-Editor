import uuid from "react-uuid";

/**
 * Change selected courses
 * @param allCourses
 * @param currentData
 * @param initialData
 * @param selectedCourses
 * @returns {{newInitialData: *[], newData: *[]}}
 */
export const changeCourses = (allCourses, currentData, initialData, selectedCourses) => {
  let newData = currentData ? [...currentData] : [];
  let newInitialData = initialData ? [...initialData] : [];
  const currentCourses = newData.map(el => el.course_id);

  // Add new courses
  selectedCourses.forEach(course => {
    if (!currentCourses.includes(course)) {
      const newCourse = allCourses.find(el => el.id === course);
      if (newCourse) {
        newData = newData.map(el => ({...el, order: el.order + 1}));
        newData.unshift({...newCourse, id: uuid(), is_new: true, order: 0});
      }
    }
  });

  // Leave only selected
  newData = newData.filter(el => selectedCourses.includes(el.course_id));

  // Cancel removed property in the initial data if the course was added again
  newInitialData = newInitialData.map(el => {
    if (selectedCourses.includes(el.course_id) && el.is_remove) {
      return {...el, is_remove: false};
    }
    return el;
  });

  return {
    newData,
    newInitialData
  }
}

/**
 * Remove courses
 * @param currentData
 * @param idList
 * @param initialData
 * @returns {{newInitialData: *[], newData: *[]}}
 */
export const removeCourses = (currentData, idList, initialData) => {
  let newInitialData = initialData ? [...initialData] : [];
  let newData = currentData ? [...currentData] : [];

  // Tag initial course as removed
  newInitialData = newInitialData.map((el) => {
    if (idList.includes(el.id)) {
      return {...el, is_remove: true};
    }

    return el;
  });

  // Remove from current data
  newData = newData.filter(el => !idList.includes(el.id));
  return {
    newData,
    newInitialData
  }
}
