import React, {useEffect, useMemo, useState} from 'react';

// Components
import MuiTag from "@src/components/shared/MuiTag";
import ButtonAction from "@src/components/shared/ButtonAction/ButtonAction";
import {Typography} from "antd";
import NotFoundContent from "@src/pages/certificate-templates/apply/NotFoundContent";
import TablePagination from "@src/pages/certificate-templates/apply/components/add-course/TablePagination";
import KcLoaderDot from "@src/components/ui/KcLoaderDot";
import KcTableAnt from "@src/components/shared/KcTable/KcTableAnt";

// Hooks
import {useMui} from "@src/hooks/useMui";

// Assets
import {BinIcon, ChevronDownIcon, PlusIcon} from "@src/assets/icons/icons-pack";

// Store
import {useStore} from "@src/store/Context";
import {ApplyCoursesContext} from "@src/store/certificate-templates/ApplyCourses";
import {observer} from "mobx-react-lite";
import {renderToString} from "react-dom/server";
import MuiValue from "@src/components/shared/MuiValue";
import KcSelect from "@src/components/shared/KcSelect/KcSelect";
import {Option} from "antd/es/mentions";

/**
 * All selected courses table
 * @param selectedPage
 * @param setSelectedPage
 * @param selectedPageSize
 * @param setSelectedPageSize
 * @returns {JSX.Element}
 * @constructor
 */
const SelectedCourseTable = ({
                               selectedPage,
                               setSelectedPage,
                               selectedPageSize,
                               setSelectedPageSize,
                               currentCourseListsCourses,
                               page,
                               pageSize
                             }) => {
  // Hooks
  const [selectedRows, setSelectedRows] = useState([]);
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const [loading, setLoading] = useState(false);

  // Store
  const store = useStore(ApplyCoursesContext);
  const selectedCourses = store.getSelectedCourses();
  const selectedCoursesPage = store.getSelectedCoursesPage();
  const total = selectedCourses.length;

  /**
   * Set new page
   * @param newPage
   */
  const handlePaginationChange = newPage => {
    setSelectedPage(newPage);
  }

  /**
   * Set page size
   * @param newPageSize
   */
  const handlePageSizeChange = newPageSize => {
    setSelectedPageSize(newPageSize);
  }

  useEffect(() => {
    store.setSelectedCoursesPage(selectedPage, selectedPageSize);
  }, [selectedPage, selectedPageSize]);

  /**
   * Handling rows selection
   * @type {{onChange: rowSelection.onChange}}
   */
  const rowSelection = {
    selectedRowKeys: selectedRows,
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys, newSelectedRows) => {
      const newSelectedRowsKeys = newSelectedRows.map(el => el.course_id);
      setSelectedRows([...newSelectedRowsKeys]);
    },
    // selections: [
    //   {
    //     key: 'select-all',
    //     text: renderToString(
    //       <MuiValue
    //         muiGroup="L2Default"
    //         muiKey="select-all-across-pages"
    //         muiDefault="Select all across pages"
    //       />
    //     ),
    //     onSelect: () => {
    //       const selectedCoursesIds = selectedCourses.map(course => course.course_id);
    //       setSelectedRows([...selectedCoursesIds]);
    //     }
    //   }
    // ]
  };

  const columns = [
    {
      title: <MuiLMS2Certificate muiKey="course-name" muiDefault="Course name"/>,
      dataIndex: 'title',
      render: (text) => <Typography.Text
        style={{width: '13rem'}}
        ellipsis={true}>{text}</Typography.Text>,
      sorter: (a, b) => (a.title || '').localeCompare(b.title || '')
    },
    {
      title: <MuiLMS2Certificate muiKey="course-id" muiDefault="Course ID"/>,
      // dataIndex: 'id',
      dataIndex: 'course_id',
      render: (text) => <Typography.Text
        style={{width: '6rem'}}
        ellipsis={true}>[{text}]</Typography.Text>,
      sorter: (a, b) => (a.id || '').localeCompare(b.id || '')
    },
    {
      title: <MuiLMS2Certificate muiKey="certificate" muiDefault="Certificate"/>,
      dataIndex: 'title',
      render: (text) => <Typography.Text
        style={{width: '5rem'}}
        ellipsis={true}>Not set</Typography.Text>,
      sorter: (a, b) => (a.title || '').localeCompare(b.title || '')
    },
    {
      title: <MuiTag muiKey="action" muiGroup="L2Default" muiDefault="Action"/>,
      render: (row) => {
        return (
          <ButtonAction
            style={{width: '6rem'}}
            name={<MuiTag muiKey="remove" muiGroup="L2Default" muiDefault="Remove"/>}
            prefix={<BinIcon/>}
            handleClick={() => {
              store.removeSelectedCourse(row, selectedPage, selectedPageSize);
              if (selectedCoursesPage.length === 1 && selectedPage >= 2) {
                setSelectedPage(selectedPage - 1);
              }
            }}
          />
        )
      }
    }
  ];

  return (
    <>
      <KcTableAnt
        id="selected-courses"
        customRowSelection={rowSelection}
        columns={columns.reverse()}
        dataSource={selectedCourses}
        locale={{
          emptyText: <NotFoundContent>
            <MuiTag muiKey="no-courses" muiGroup="L2Default" muiDefault="No courses added yet"/>
          </NotFoundContent>
        }}
        scroll={{y: 485}}
        rowKey={`course_id`}
        rowSelect={true}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        tableLayout={"auto"}
        showSorterTooltip={false}
        sticky={{offsetHeader: -25}}
        pagination={{
          position: 'bottomRight',
          showQuickJumper: (selectedCourses.length / selectedPageSize) > 7,
          showSizeChanger: false,
          size: "small",
          pageSize: selectedPageSize,
          current: selectedPage,
          onChange: handlePaginationChange
        }}
        removeButton={
          <ButtonAction
            name={<MuiTag muiKey="remove" muiGroup="L2Default" muiDefault="Remove"/>}
            prefix={<BinIcon/>}
            handleClick={() => {
              selectedRows.forEach(rowId => {
                const selectedCourse = selectedCourses.find(
                  course => course.course_id === rowId);
                store.removeSelectedCourse(selectedCourse, selectedPage, selectedPageSize);
              });
              setSelectedRows([]);
            }}
          />
        }
        loading={{indicator: <div className="scheduled__loader"><KcLoaderDot color="orange"/></div>, spinning: loading}}
      />
      <KcSelect
        defaultValue="20"
        onChange={handlePageSizeChange}
        suffixIcon={<ChevronDownIcon />}
      >
        <Option value="20">20</Option>
        <Option value="40">40</Option>
        <Option value="50">50</Option>
        <Option value="100">100</Option>
      </KcSelect>
      {/*<TablePagination*/}
      {/*  currentPage={selectedPage}*/}
      {/*  pageSize={selectedPageSize}*/}
      {/*  total={total}*/}
      {/*  showTotal={false}*/}
      {/*  handlePaginationChange={handlePaginationChange}*/}
      {/*  handlePageSizeChange={handlePageSizeChange}*/}
      {/*/>*/}
    </>
  )
}

export default observer(SelectedCourseTable);
