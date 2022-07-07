import {createContext} from "react";

// Api
import Courses from "@src/services/api/accounts/Courses";
import CertificateTemplates from "@src/services/api/accounts/CertificateTemplates";

// Store
import {makeAutoObservable} from "mobx";

export const ApplyCoursesContext = createContext(null);

export class ApplyCoursesStore {
  courseLists = [];

  initialSelectedCourses = [];

  selectedCourses = [];

  currentCourseListCourses = [];

  allCoursesInCurrentList = [];

  // One page of selected courses for pagination
  selectedCoursesPage = [];

  totalCourses = 0;

  // Total courses in the current list
  totalCoursesInList = 0;

  // Selected courses picked in the current course list
  selectedCoursesInCurrentList = [];

  // Selected rows for the table on the left-hand side
  selectedRows = [];

  constructor(certificateId) {
    makeAutoObservable(this);

    Courses.list(null, null, 1).then((result) => {
      this.setCourseLists(result.data?.response);
    });

    CertificateTemplates.appliedCourses(certificateId).then((result) => {
      this.setInitialSelectedCourses(result.data?.response);
      this.setSelectedCourses([]);
    })
  }

  /**
   * Set course lists
   * @param value
   */
  setCourseLists(value) {
    this.courseLists = value;
  }

  /**
   * Get course lists
   * @returns {*[]}
   */
  getCourseLists() {
    return this.courseLists;
  }

  /** Get all courses from the current course list
   * @param listId
   * @param courseNameFilter
   * @param setLoading
   */
  setAllCoursesInCurrentList(listId, courseNameFilter, setLoading) {
    if (listId === "all-courses") {
      Courses.all(courseNameFilter).then((result) => {
        const response = result.data?.response;
        const updatedSelectedCoursesInCurrentList = [];
        this.allCoursesInCurrentList = response.map(course => {
          const ifCourseSelected = this.selectedCourses.find(
            selectedCourse => selectedCourse.course_id === course.course_id
          );
          if (ifCourseSelected) {
            updatedSelectedCoursesInCurrentList.push(course);
          }
          return {
            ...course,
            isSelected: ifCourseSelected
          };
        });
        this.setSelectedCoursesInCurrentList(updatedSelectedCoursesInCurrentList);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      Courses.courseListContent("en", listId).then((result) => {
        const response = result.data?.response;
        const updatedSelectedCoursesInCurrentList = [];
        this.allCoursesInCurrentList = response.map(course => {
          const ifCourseSelected = this.selectedCourses.find(
            selectedCourse => selectedCourse.course_id === course.course_id
          );
          if (ifCourseSelected) {
            updatedSelectedCoursesInCurrentList.push(course);
          }
          return {
            ...course,
            isSelected: ifCourseSelected
          };
        });
        this.setSelectedCoursesInCurrentList(updatedSelectedCoursesInCurrentList);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }

  getAllCoursesInCurrentList() {
    return this.allCoursesInCurrentList;
  }

  /**
   * Set courses from the current course list
   * @param listId
   * @param page
   * @param pageSize
   * @param setLoading
   * @param courseNameFilter
   */
  setCurrentCourseListCourses(listId, page, pageSize, courseNameFilter, setLoading) {
    setLoading(true);
    if (listId === "all-courses") {
      // Courses.all(page, pageSize, courseNameFilter).then((result) => {
      Courses.all(undefined, undefined, courseNameFilter).then((result) => {
        const response = result.data?.response;
        const updatedSelectedCoursesInCurrentList = [];
        this.currentCourseListCourses = response.map(course => {
          const ifCourseSelected = this.selectedCourses.find(
            selectedCourse => selectedCourse.course_id === course.course_id
          );
          if (ifCourseSelected) {
            updatedSelectedCoursesInCurrentList.push(course);
          }
          return {
            ...course,
            isSelected: ifCourseSelected
          };
        });
        this.setSelectedCoursesInCurrentList(updatedSelectedCoursesInCurrentList);
        // const resultPagination = result.data.pagination;
        // this.setTotalCoursesInList(resultPagination?.totalRecords);
        this.setTotalCoursesInList(this.currentCourseListCourses.length);
        setLoading(false);
      }).catch(() => setLoading(false));

    } else {
      // Courses.courseListContent("en", listId, page, pageSize).then((result) => {
        Courses.courseListContent("en", listId, undefined, undefined).then((result) => {
        // Courses.selection(listId, page, pageSize, courseNameFilter).then((result) => {
        const response = result.data?.response;
        const updatedSelectedCoursesInCurrentList = [];
        this.currentCourseListCourses = response.map(course => {
          const ifCourseSelected = this.selectedCourses.find(
            selectedCourse => selectedCourse.course_id === course.course_id
          );
          if (ifCourseSelected) {
            updatedSelectedCoursesInCurrentList.push(course);
          }
          return {
            ...course,
            isSelected: ifCourseSelected
          };
        });
        this.setSelectedCoursesInCurrentList(updatedSelectedCoursesInCurrentList);
        // const resultPagination = result.data.pagination;
        // this.setTotalCoursesInList(resultPagination?.totalRecords);
        this.setTotalCoursesInList(this.currentCourseListCourses.length);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }

  /**
   * Get courses from the current course list
   * @returns {*[]}
   */
  getCurrentCourseListCourses() {
    return this.currentCourseListCourses;
  }

  /**
   * Set selected courses
   * @param value
   */
  setSelectedCourses(value) {
    this.selectedCourses = value;
  }

  /**
   * Get current selected courses
   * @returns {*[]}
   */
  getSelectedCourses() {
    return this.selectedCourses;
  }

  setInitialSelectedCourses(value) {
    this.initialSelectedCourses = value;
  }

  updateCurrentCourseListCourses(value) {
    this.currentCourseListCourses = value;
  }

  /**
   * Selecting a course from the currentCourseListCourses
   * @param selectedCourse
   * @param selectedCoursesPage
   * @param selectedCoursesPageSize
   */
  addSelectedCourse(selectedCourse, selectedCoursesPage, selectedCoursesPageSize) {
    if (!this.selectedCourses.find(course => course.course_id === selectedCourse.course_id)) {
      // Updating selected courses
      this.setSelectedCourses([...this.selectedCourses, selectedCourse]);
      // Updating currentCourseListCourses with the newly selected course
      const updatedCurrentCourseListCourses = this.currentCourseListCourses.map(course =>
        course.course_id !== selectedCourse.course_id ? course : {
          ...course,
          isSelected: true
        }
      );
      this.updateCurrentCourseListCourses(updatedCurrentCourseListCourses);
      // Updating the selected courses from the current list
      this.setSelectedCoursesInCurrentList(
        [...this.selectedCoursesInCurrentList, selectedCourse]
      );
      // Setting the set of courses for the selected courses table
      this.setSelectedCoursesPage(selectedCoursesPage, selectedCoursesPageSize);
    }
  }

  /**
   * Removing a course from the currentCourseListCourses
   * @param deselectedCourse
   * @param selectedCoursesPage
   * @param selectedCoursesPageSize
   */
  removeSelectedCourse(deselectedCourse, selectedCoursesPage, selectedCoursesPageSize) {
    const filteredCourses = this.selectedCourses.filter(course => course.course_id !== deselectedCourse.course_id);
    // Updating selected courses
    this.setSelectedCourses(filteredCourses);
    // Updating currentCourseListCourses with the newly deselected course
    const updatedCurrentCourseListCourses = this.currentCourseListCourses.map(course =>
      course.course_id !== deselectedCourse.course_id ? course : {
        ...course,
        isSelected: false
      }
    );
    this.updateCurrentCourseListCourses(updatedCurrentCourseListCourses);
    // Updating the selected courses from the current list
    // and removing the newly deselected course
    this.setSelectedCoursesInCurrentList(
      this.selectedCoursesInCurrentList.filter(course =>
        course.course_id !== deselectedCourse.course_id)
    );
    // Setting the set of courses for the selected courses table
    this.setSelectedCoursesPage(selectedCoursesPage, selectedCoursesPageSize);
  }

  /**
   * Get initial selected courses
   * @returns {*[]}
   */
  getInitialSelectedCourses() {
    return this.initialSelectedCourses;
  }

  /**
   * Returns a total amount of courses in a course list
   * @returns {number}
   */
  getTotalCoursesInList() {
    return this.totalCoursesInList;
  }

  setTotalCoursesInList(value) {
    this.totalCoursesInList = value;
  }

  /**
   * Get a selection of selected courses for the current page
   * @param selectedCoursesPage
   * @param selectedCoursesPageSize
   */
  setSelectedCoursesPage(selectedCoursesPage, selectedCoursesPageSize) {
    const startIndex = (selectedCoursesPage - 1) * selectedCoursesPageSize;
    this.selectedCoursesPage =
      this.selectedCourses.slice(startIndex, startIndex + selectedCoursesPageSize);
  }

  /**
   * Get selected courses for the current page
   * for the "selected courses" table
   */
  getSelectedCoursesPage() {
    return this.selectedCoursesPage;
  }

  /**
   * Get selected courses from the current course list
   */
  getSelectedCoursesInCurrentList() {
    return this.selectedCoursesInCurrentList;
  }

  /**
   * Set selected courses from the current course list
   * @param value
   */
  setSelectedCoursesInCurrentList(value) {
    this.selectedCoursesInCurrentList = value;
  }

  setSelectedRows(value) {
    this.selectedRows = value;
  }

  getSelectedRows() {
    return this.selectedRows;
  }
}
