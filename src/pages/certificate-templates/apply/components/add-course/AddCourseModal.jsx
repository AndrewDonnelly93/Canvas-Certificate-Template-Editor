import React, {useState} from 'react';
import {renderToString} from "react-dom/server";
// Components
import KcButton from "@src/components/shared/KcButton/KcButton";
import {Message as Hint} from "@src/utils/Message";
import MuiValue from "@src/components/shared/MuiValue";
import KcAlertSquare from "@src/components/shared/KcAlertSquare/KcAlertSquare";
import CoursesListSelect from "@src/pages/certificate-templates/apply/components/add-course/CourseListSelect";
import SelectCourseTable from "@src/pages/certificate-templates/apply/components/add-course/SelectCourseTable";
import SelectedCourseTable from "@src/pages/certificate-templates/apply/components/add-course/SelectedCourseTable";
import FilterSearch from "@src/pages/certificate-templates/apply/components/add-course/FilterSearch";

// Hooks
import {useMui} from "@src/hooks/useMui";

// Store
import {observer} from "mobx-react-lite";
import {useStore} from "@src/store/Context";
import {ApplyCoursesContext} from "@src/store/certificate-templates/ApplyCourses";

// Styles
import "../../Apply.scss";
import "./AddCourse.scss";

const AddCourseModalContent = ({
                                 onClose,
                                 currentPage,
                                 currentCoursesConflicts = true,
                                 courseLists,
                                 currentTemplateName
                               }) => {
  // Hooks
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");
  const [currentCourseList, setCurrentCourseList] = useState('all-courses');
  const [loading, setLoading] = useState(false);
  // Store
  const store = useStore(ApplyCoursesContext);
  const selectedCourses = store.getSelectedCourses();
  // Pages for selecting courses from the course lists
  // on the left-hand side
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  // Pages for selected courses
  // on the right-hand side
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(20);
  // Filter for the search of courses
  const [filter, setFilter] = useState({
    courseName: null
  });
  // Selected rows for the left-hand side
  const [selectedRows, setSelectedRows] = useState([]);
  // Constants
  const maxAssignableCourses = 1000;
  const changeFilter = (name, value) => {
    setFilter({...filter, [name]: value});
  }

  let conflictMessage = <MuiLMS2Certificate
    muiKey="applied-cert-warning"
    muiDefault="Several courses have a certificate template assigned. If you create a new certificate template, the old one will be removed."
  />;
  if (currentPage !== 'course') {
    conflictMessage = <MuiLMS2Certificate
      muiKey="applied-cert-warning-courses-type"
      muiDefault="This type of course has a certificate template assigned. If you assign this one, the old certificate will be removed."
    />;
  }
  return (
    <div className="add-courses-window">
      <div className="modal-window">
        <div className="modal-text">
          <div className="tables">
            <div className="course-search">
              <div className="header">
                <MuiLMS2Certificate muiKey="add-courses-to" muiDefault="Add courses to"/>&nbsp;{currentTemplateName}
              </div>
              <div className="choose-course">
                <CoursesListSelect
                  pageSize={pageSize}
                  courseLists={courseLists}
                  setPage={setPage}
                  setCurrentCourseList={setCurrentCourseList}
                  courseNameFilter={filter.courseName}
                  setLoading={setLoading}
                  setSelectedRows={setSelectedRows}
                />
                <FilterSearch changeFilter={changeFilter}/>
              </div>
              <SelectCourseTable
                currentCourseList={currentCourseList}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                selectedPage={selectedPage}
                selectedPageSize={selectedPageSize}
                courseNameFilter={filter.courseName}
                loading={loading}
                setLoading={setLoading}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
              />
            </div>
            <div className="selected-table">
              <div className="header">
                {selectedCourses.length}&nbsp;<MuiLMS2Certificate muiKey="selected-courses"
                                                                  muiDefault="selected courses"/>
              </div>
              <SelectedCourseTable
                currentCourseList={currentCourseList}
                page={page}
                pageSize={pageSize}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                selectedPageSize={selectedPageSize}
                setSelectedPageSize={setSelectedPageSize}
              />
            </div>
          </div>
        </div>
        <div className="buttons-block">
          <KcButton key="2" onClick={() => onClose()}>
            <MuiL2Default muiKey="modals-cancel" muiDefault="Cancel"/>
          </KcButton>
          <KcButton key="1" type="primary"
                    disabled={selectedCourses.length > maxAssignableCourses}
                    onClick={() => {
            Hint.sendSuccess(
              renderToString(<MuiValue
                muiKey="template-applied-success"
                muiGroup="LMS2CertificateTemplates"
                muiDefault="Certificate template was applied successfully"
              />)
            );
            onClose();
          }}>
            <MuiL2Default muiKey="assign-and-save" muiDefault="Assign and save"/>
          </KcButton>
          {/*{selectedCourses.length > maxAssignableCourses &&*/}
            <KcAlertSquare type="warning" message={
              renderToString(<MuiValue
                muiKey="assign-courses-error"
                muiGroup="LMS2CertificateTemplates"
                muiDefault="You can’t assign more than 1000 courses at a time"
              />)
            } />
          {/*}*/}
        </div>
      </div>
    </div>
  );
}

export default observer(AddCourseModalContent);
