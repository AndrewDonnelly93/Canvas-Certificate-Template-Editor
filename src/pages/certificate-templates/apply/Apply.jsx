import React, {useState, useRef, useEffect, useMemo} from 'react';
// Components
import {PageHeader, Space, Radio, Select, Modal, Tooltip, Popover} from "antd";
import ButtonAction from "@src/components/shared/ButtonAction/ButtonAction";
import {PageContent, PageWrapper, PageActions} from "@src/components/PageContent/PageContent";
import PageHeaderBackButton from "@src/components/shared/PageHeaderBackButton/PageHeaderBackButton";
import KcAlert from "@src/components/shared/KcAlert/KcAlert";
import SavingChangesModalContent
  from "@src/pages/certificate-templates/shared-components/modal-content/SavingChangesModalContent";
import Tutorial from "@src/pages/certificate-templates/apply/components/tutorial/Tutorial";
import Hint from "@src/components/shared/Hint/Hint";
import KcSelect from "@src/components/shared/KcSelect/KcSelect";
import FilterCourse from "@src/pages/learning-path/shared-components/FilterCourse";
import TableLP from '@src/pages/learning-path/shared-components/table/TableLP';
import KcButton from "@src/components/shared/KcButton/KcButton";
import CertAppliedModal from "@src/pages/certificate-templates/apply/components/CertAppliedModal";
import {Message} from "@src/utils/Message";
import {PlusIcon, QuestionCircleIcon} from "@src/assets/icons/icons-pack";
import KcTable from "@src/components/shared/KcTable/KcTable";
import TablePagination from "@src/components/shared/TablePagination/TablePagination";
import NotFoundContent from "@src/pages/certificate-templates/apply/NotFoundContent";
import MuiTag from "@src/components/shared/MuiTag";
import CoursesSelect from "@src/components/shared/CoursesSelect/CoursesSelect";
import {renderToString} from "react-dom/server";
import MuiValue from "@src/components/shared/MuiValue";
import AddCourseModal from "@src/pages/certificate-templates/apply/components/add-course/AddCourseModal";

// Data
import certificatesTemplatesList from "@src/pages/certificate-templates/data/certificateTemplates.json";

// Hooks
import {usePageTitle} from "@src/hooks/usePageTitle";
import {useTranslation} from "react-i18next";
import {useMui} from "@src/hooks/useMui";
import {useParams} from "react-router-dom";

// Stores
import store from "@src/store/Store";
import {observer} from "mobx-react-lite";
// import {useStore} from "@src/store/Context";
import {ApplyCoursesContext, ApplyCoursesStore} from "@src/store/certificate-templates/ApplyCourses";

// Constants
import {LIST_PATH} from "@src/pages/certificate-templates/certificates.constants";
import useContentCourse from './components/useContentCourse';

// Styles
import "./Apply.scss";
import "../CertificateTemplates.scss";

const pageTitle = 'Apply Certificate';
const {Option} = Select;

const Apply = (props) => {
  // Data
  const {id} = useParams();
  const currentTemplate = certificatesTemplatesList.data.find(certTemplate => certTemplate.id === id.toString());
  const {
    courseList = [],
    setCourseList = () => null,
    currentCourseLine = []
  } = props;
  const store2 = new ApplyCoursesStore(id);

  const {
    onSelectedCourse,
    coursesList,
    searchData,
    columnsGroup,
    data,
    selectedRows,
    rowSelection,
    currentCoursesConflicts,
    setSelectedRows,
    selectedCourses,
    page,
    pageSize,
    handlePaginationChange,
    handlePageSizeChange,
    total
  } = useContentCourse(
    courseList,
    setCourseList,
    currentCourseLine
  );

  // Hooks
  usePageTitle(pageTitle);
  useTranslation(["LMS2CertificateTemplates"]);
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const MuiL2Default = useMui("L2Default");
  const [visibleCertApplied, setVisibleCertApplied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleAddCourse, setVisibleAddCourse] = useState(false);
  const [currentPage, setCurrentPage] = React.useState('course');
  const [courseType, setCourseType] = React.useState('class');

  const optionsCourses = [
    {
      value: 'course',
      muiDefault: 'Course'
    },
    {
      value: 'course-type',
      muiDefault: 'Course type'
    },
    {
      value: 'all-courses',
      muiDefault: 'All courses'
    }
  ];
  const radioOptions = [
    {
      value: 'class',
      muiDefault: 'Class'
    },
    {
      value: 'lessons',
      muiDefault: 'Lessons'
    },
    {
      value: 'external',
      muiDefault: 'External'
    }
  ];

  // Data
  const courseLists = useMemo(() => store2.getCourseLists(), []);
  const currentTemplateName = currentTemplate?.name || store.portal.getDefaultCertName();

  return (
    <ApplyCoursesContext.Provider value={store2}>
      <>
        <PageHeader
          title={[
            <Space size="middle">
              <PageHeaderBackButton
                path={LIST_PATH}
                onClick={() => setVisible(true)}
              />
              {currentTemplateName}
            </Space>
          ]}
        />
        <PageContent fixedWrap={true} customClassName="apply-to-page">
          <PageWrapper>
            <div className="apply-to">
              <Space size={4}>
                <Tutorial/>
              </Space>
              <div className="select-group">
                <div className="group">
                  <div className="group-name"><MuiLMS2Certificate
                    miuKey="priority-level"
                    muiDefault="Priority level"
                  /></div>
                  <KcSelect className="priority-selector" defaultValue="course"
                            onChange={(value) => {
                              setCurrentPage(value);
                            }}>
                    {optionsCourses.map((option) => (
                      <Option className="select-option"
                              value={option.value}
                              key={option.value}
                      ><MuiLMS2Certificate
                        miuKey={option.value}
                        muiDefault={option.muiDefault}
                      /></Option>))}
                  </KcSelect>
                </div>
                {currentPage === 'course' &&
                  <div className="group">
                    <div className="group-name"><MuiLMS2Certificate
                      miuKey="select-course"
                      muiDefault="Select course"
                    /></div>
                    <ButtonAction
                      handleClick={() => setVisibleAddCourse(true)}
                      name={<MuiL2Default muiKey="add-courses" muiDefault="Add courses"/>}
                      prefix={<PlusIcon/>}
                      buttonClassName="add-field-button add-course"
                      prefixClassName="button-action-icon"
                      textClassName="add-field-text"
                    />
                  </div>
                }
                {
                  currentPage === 'course-type' &&
                  <div className="group">
                    <div className="group-name"><MuiLMS2Certificate
                      miuKey="course-type"
                      muiDefault="Course type"
                    /></div>
                    <Radio.Group className="course-type-selector" onChange={(e) => setCourseType(e.target.value)}
                                 value={courseType}>
                      {radioOptions.map(radioOption => (
                        <Radio value={radioOption.value}>
                          <MuiLMS2Certificate
                            miuKey={radioOption.value}
                            muiDefault={radioOption.muiDefault}
                          />
                        </Radio>
                      ))}
                    </Radio.Group>
                  </div>
                }
              </div>
              {currentPage === 'course' && currentCoursesConflicts &&
                <KcAlert
                  message={
                    <MuiLMS2Certificate
                      muiKey="applied-certificate-conflict"
                      muiDefault="Some courses already have an assigned certificate. If you apply this one, the old one won’t be used."
                    />}
                />
              }
              {currentPage === 'course' &&
                <div className="courses">
                  {/*<TableLP*/}
                  {/*  columns={columnsGroup}*/}
                  {/*  selectedRows={selectedRows}*/}
                  {/*  data={data}*/}
                  {/*  rowSelection={rowSelection}*/}
                  {/*/>*/}
                  <KcTable
                    id="apply-certificates"
                    columns={columnsGroup}
                    dataSource={data}
                    locale={{
                      emptyText: <NotFoundContent>
                        <MuiTag muiKey="no-data" muiGroup="L2Default" muiDefault="No data available"/>
                      </NotFoundContent>
                    }}
                    rowKey={`id`}
                    rowSelect={true}
                    tableLayout={"auto"}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    rowSelection={rowSelection}
                    showSorterTooltip={false}
                    sticky={{offsetHeader: -25}}
                  />
                  <TablePagination
                    currentPage={page}
                    handlePaginationChange={handlePaginationChange}
                    handlePageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                    total={total}
                  />
                </div>}
              {(currentPage === 'course-type' || currentPage === 'all-courses') &&
                <KcAlert
                  message={
                    <span>
                  {/*<MuiLMS2Certificate*/}
                      {/*  muiKey="applied-certificate-alert-1"*/}
                      {/*  muiDefault="This type of courses have"*/}
                      {/*/>&nbsp;*/}
                      {/*<span className="certificate-link">*/}
                      {/*  <MuiLMS2Certificate*/}
                      {/*    muiKey="applied-certificate-alert-2"*/}
                      {/*    muiDefault="Assigned certificate"*/}
                      {/*  />*/}
                      {/*</span>.*/}
                      {/*<MuiLMS2Certificate*/}
                      {/*  muiKey="applied-certificate-alert"*/}
                      {/*  muiDefault="If you assign this one, old won’t be used"*/}
                      {/*/>*/}
                      <MuiLMS2Certificate
                        muiKey="applied-certificate-alert"
                        muiDefault="This type of course already has an assigned certificate. If you apply this one, the old one won’t be used."
                      />
                </span>
                  }
                />
              }
            </div>
          </PageWrapper>

          <div className="content-container">
            <KcButton key="1" type="primary" onClick={() => {
              if (!currentCoursesConflicts) {
                Message.sendSuccess(
                  renderToString(<MuiValue
                    muiKey="template-applied-success"
                    muiGroup="LMS2CertificateTemplates"
                    muiDefault="Certificate template was applied successfully"
                  />)
                );
              } else {
                setVisibleCertApplied(true);
              }
            }}>
              <MuiLMS2Certificate
                miuKey="apply"
                muiDefault="Apply"
              />
            </KcButton>
          </div>
          <Modal
            centered
            title={null}
            visible={visibleCertApplied}
            footer={null}
            closable={false}
            className="applied-cert-modal"
            width={488}
          >
            <CertAppliedModal
              currentPage={currentPage}
              currentCoursesConflicts={currentCoursesConflicts}
              onClose={() => setVisibleCertApplied(false)}
            />
          </Modal>

          <Modal
            centered
            title={null}
            visible={visible}
            footer={null}
            closable={false}
            className="saving-changes-modal"
            width={530}
          >
            <SavingChangesModalContent
              onClose={() => setVisible(false)}
            />
          </Modal>

          <Modal
            centered
            title={null}
            visible={visibleAddCourse}
            footer={null}
            closable={false}
            className="add-course-modal"
            width={1267}
          >
            <AddCourseModal
              currentTemplateName={currentTemplateName}
              certId={id}
              currentPage={currentPage}
              currentCoursesConflicts={currentCoursesConflicts}
              courseLists={courseLists}
              onClose={() => setVisibleAddCourse(false)}
            />
          </Modal>
        </PageContent>
      </>
    </ApplyCoursesContext.Provider>
  )
}

export default observer(Apply);
