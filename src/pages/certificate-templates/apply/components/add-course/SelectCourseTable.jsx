/* eslint-disable */
import React, {useEffect, useMemo, useState} from 'react';
import {renderToString} from "react-dom/server";
// Components
import MuiValue from "@src/components/shared/MuiValue";
import MuiTag from "@src/components/shared/MuiTag";
import ButtonAction from "@src/components/shared/ButtonAction/ButtonAction";
import {Typography, Space, Checkbox, Table} from "antd";
import TablePagination from "@src/pages/certificate-templates/apply/components/add-course/TablePagination";
import NotFoundContent from "@src/pages/certificate-templates/apply/NotFoundContent";
import KcLoaderDot from "@src/components/ui/KcLoaderDot";
import KcTableAnt from "@src/components/shared/KcTable/KcTableAnt";
import {Option} from "antd/es/mentions";
import KcSelect from "@src/components/shared/KcSelect/KcSelect";

// Hooks
import {useMui} from "@src/hooks/useMui";

// Assets
import {SelectIcon, SelectedIcon, PlusIcon, ChevronDownIcon} from "@src/assets/icons/icons-pack";

// Store
import {useStore} from "@src/store/Context";
import {ApplyCoursesContext} from "@src/store/certificate-templates/ApplyCourses";
import {observer} from "mobx-react-lite";

// Styles
import "./AddCourse.scss";


const SelectCourseTable = ({
                             page,
                             setPage,
                             pageSize,
                             setPageSize,
                             currentCourseList,
                             selectedPage,
                             selectedPageSize,
                             courseNameFilter,
                             loading,
                             setLoading,
  selectedRows,
  setSelectedRows
                           }) => {
  // Store
  const store = useStore(ApplyCoursesContext);
  const currentCourseListsCourses = store.getCurrentCourseListCourses();
  const selectedCourses = store.getSelectedCourses();
  const total = store.getTotalCoursesInList();
  const selectedCoursesInCurrentList = store.getSelectedCoursesInCurrentList();

  // Hooks
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");

  /**
   * Set new page
   * @param newPage
   */
  const handlePaginationChange = newPage => {
    setPage(newPage);
  }

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
      getCheckboxProps: (row) => ({
        disabled: row.isSelected || selectedCourses.includes(row)
      }),
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
      //       const unselectedCourses = currentCourseListsCourses.filter(course => !(course.isSelected || selectedCourses.includes(course)));
      //       const unselectedCoursesIds = unselectedCourses.map(course => course.course_id);
      //       setSelectedRows([...unselectedCoursesIds]);
      //     },
      //   },
      //   {
      //     key: 'deselect-all',
      //     text: renderToString(
      //       <MuiValue
      //         muiGroup="L2Default"
      //         muiKey="deselect-all-across-pages"
      //         muiDefault="Deselect all across pages"
      //       />
      //     ),
      //     onSelect: () => {
      //       currentCourseListsCourses.forEach(
      //         course => store.removeSelectedCourse(course, selectedPage, selectedPageSize)
      //       );
      //       setSelectedRows([]);
      //     },
      //   }
      // ]
  };

  /**
   * Extracting new current course list for each page
   */
  useEffect(() => {
    setLoading(true);
    store.setCurrentCourseListCourses(currentCourseList, page, pageSize, courseNameFilter, setLoading);
  }, [courseNameFilter]);

  /**
   * Set page size
   * @param newPageSize
   */
  const handlePageSizeChange = newPageSize => {
    setPageSize(newPageSize);
  }

  const columns = [
    {
      title: <MuiLMS2Certificate muiKey="course-name" muiDefault="Course name"/>,
      dataIndex: 'title',
      render: (text) => <Typography.Text
        style={{width: '12rem'}}
        ellipsis={true}>{text}</Typography.Text>,
      sorter: (a, b) => (a.title || '').localeCompare(b.title || '')
    },
    {
      title: <MuiLMS2Certificate muiKey="course-id" muiDefault="Course ID"/>,
      // dataIndex: 'id',
      dataIndex: 'course_id',
      render: (text) => <Typography.Text
        style={{width: '7rem'}}
        ellipsis={true}>[{text}]</Typography.Text>,
      sorter: (a, b) => (a.id || '').localeCompare(b.id || '')
    },
    {
      title: <Space size={20}>
        <MuiTag muiKey="action" muiGroup="L2Default" muiDefault="Action"/>
      </Space>,
      render: (row) => {
        if (row.isSelected || selectedCourses.includes(row)) {
          return (
            <ButtonAction
              name={<MuiTag muiKey="selected" muiGroup="L2Default" muiDefault="Selected"/>}
              prefix={<SelectedIcon/>}
              handleClick={() =>
                store.removeSelectedCourse(row, selectedPage, selectedPageSize)
              }
              textClassName="button-action-selected"
            />
          )
        }
        return (
          <ButtonAction
            name={<MuiTag muiKey="select" muiGroup="L2Default" muiDefault="Select"/>}
            prefix={<SelectIcon/>}
            handleClick={() => {
              store.addSelectedCourse(row, selectedPage, selectedPageSize);
              setSelectedRows(selectedRows.filter(rowId => row.id !== rowId));
            }}
          />
        )
      }
    },
  ];

  return (
    <div className="select-course-table-block">
      <KcTableAnt
        id="apply-certificates"
        customRowSelection={rowSelection}
        columns={columns.reverse()}
        dataSource={currentCourseListsCourses}
        locale={{
          emptyText: <NotFoundContent>
            <MuiTag muiKey="no-courses" muiGroup="L2Default" muiDefault="No courses added yet"/>
          </NotFoundContent>
        }}
        rowKey={`course_id`}
        tableLayout={"auto"}
        showSorterTooltip={false}
        scroll={{y: 485}}
        removeButton={
          <ButtonAction
            name={<MuiTag muiKey="add-courses-selected" muiGroup="L2Default" muiDefault="Add courses to selected"/>}
            prefix={<PlusIcon/>}
            handleClick={() => {
              selectedRows.forEach(rowId => {
                const selectedCourse = currentCourseListsCourses.find(
                  course => course.course_id === rowId);
                store.addSelectedCourse(selectedCourse, selectedPage, selectedPageSize);
              });
              setSelectedRows([]);
            }}
          />
        }
        rowSelect={true}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        pagination={{
          position: 'bottomRight',
          showQuickJumper: (total / pageSize) > 7,
          showSizeChanger: false,
          size: "small",
          pageSize: pageSize,
          current: page,
          onChange: handlePaginationChange
      }}
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
      {/*  currentPage={page}*/}
      {/*  handlePaginationChange={handlePaginationChange}*/}
      {/*  handlePageSizeChange={handlePageSizeChange}*/}
      {/*  pageSize={pageSize}*/}
      {/*  total={total}*/}
      {/*/>*/}
    </div>
  )
}

export default observer(SelectCourseTable);
